/**
 * fake-chat.js
 *
 * Matches a user message against fake-chat.json using a 3-stage algorithm:
 *   1. Direct exact match     (normalised, case-insensitive)
 *   2. Contains match         (input contains pair phrase, or pair phrase contains input)
 *   3. Best-score match       (Jaccard word-overlap, then Levenshtein for short inputs)
 *   4. Random fallback        (when nothing reaches the confidence threshold)
 *
 * Add new pairs to fake-chat.json — no code changes needed.
 */

import DATA from './fake-chat.json';
import { buildFaqResponsePayloadFromFakeChat } from './faq-demo.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Lowercase, strip punctuation, collapse whitespace */
function normalise(str) {
  return String(str ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Split a normalised string into word tokens, filtering stop-words */
const STOP_WORDS = new Set([
  'a','an','the','is','it','in','on','at','to','for','of','and','or','but',
  'i','me','my','we','you','your','can','do','does','did','be','am','are',
  'was','were','have','has','had','will','would','should','could','may',
  'might','shall','let','please','hey','hi','hello','s','re','ll','ve',
]);

function tokenise(str) {
  return normalise(str).split(' ').filter((t) => t && !STOP_WORDS.has(t));
}

/**
 * Standard Levenshtein distance (dynamic programming, O(m·n)).
 * Only called for short strings (≤ 40 chars) to keep it fast.
 */
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  // Quick exits
  if (m === 0) return n;
  if (n === 0) return m;
  if (a === b)  return 0;

  // Single row rolling array
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,          // insert
        prev[j] + 1,              // delete
        prev[j - 1] + cost,       // replace
      );
    }
    prev = curr;
  }
  return prev[n];
}

/**
 * Jaccard similarity over token sets — [0, 1].
 * Good for longer, bag-of-words comparisons.
 */
function jaccardSimilarity(tokA, tokB) {
  if (!tokA.length || !tokB.length) return 0;
  const setA = new Set(tokA);
  const setB = new Set(tokB);
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...tokA, ...tokB]).size;
  return union === 0 ? 0 : intersection / union;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main matcher
// ─────────────────────────────────────────────────────────────────────────────

const { pairs, fallbacks } = DATA;

/**
 * Match a user message to the best response in fake-chat.json.
 *
 * @param   {string} input   Raw user message
 * @returns {string|object}  Agent response (string or renderer-payload object)
 */
const BOOK_FLIGHT_RESPONSES = [
  (carrier, price) => `✈️ Flight booked! Your ${carrier} seat at ${price} is confirmed. Confirmation #: FL-${Math.random().toString(36).slice(2,8).toUpperCase()} 🎉 Check your email for the boarding pass!`,
  (carrier, price) => `🛫 Wheels up soon! ${carrier} at ${price} — your booking is locked in. Have a great flight! 🌍`,
  (carrier, price) => `🎟️ Booking confirmed for ${carrier} at ${price}. Your e-ticket will arrive shortly. Safe travels! ✈️`,
  (carrier, price) => `🚀 You're all set! ${carrier} flight secured at ${price}. Gate info arrives 24h before departure. Bon voyage! 🌏`,
  (carrier, price) => `✅ ${carrier} at ${price} — booked and confirmed! We've sent the itinerary to your email. Enjoy your trip! 🗺️`,
];

const BUY_NOW_RESPONSES = [
  (items) => `🛒 Order placed! Your ${items} ${items.includes(',') ? 'are' : 'is'} on the way. Estimated delivery: 2–4 business days. 📦✨`,
  (items) => `🎉 Woohoo! ${items} added to your order. We're packing it up right now! 🏷️📬`,
  (items) => `✅ Purchase confirmed for ${items}! You'll receive a confirmation email shortly. Happy shopping! 🛍️`,
  (items) => `🚀 Launching your order into the fulfillment pipeline... ${items} secured! Expect tracking info soon. 📡`,
  (items) => `💳 Payment processed! ${items} ${items.includes(',') ? 'are' : 'is'} queued for dispatch. Your wallet felt that. 😄📦`,
  (items) => `🎁 Amazing choice! ${items} will arrive gift-wrapped (in our hearts, at least). Shipping in 24h! 💝`,
  (items) => `🏪 Checkout complete! ${items} — excellent taste! Our warehouse team is on it. 🧑‍🏭📦`,
];

const FORM_SUBMIT_RESPONSES = [
  (name, country, dob) => `✅ **Information Collected!**\n\nThank you, **${name}**! Here's a summary of what we received:\n\n- 🌍 **Country:** ${country}\n- 🎂 **Date of Birth:** ${dob}\n- 📋 **Terms:** Accepted\n\nYour profile is all set! We'll send a welcome email shortly. 🎉`,
  (name, country, dob) => `🎊 **Profile Created Successfully!**\n\nWelcome aboard, **${name}**! Your registration is complete.\n\n- **Location:** ${country}\n- **DOB:** ${dob}\n- **Status:** Verified ✅\n\nYou're all set to get started!`,
  (name, country, dob) => `📋 **Information Received!**\n\nHi **${name}**, we've got everything we need!\n\n| Field | Value |\n|---|---|\n| Country | ${country} |\n| Date of Birth | ${dob} |\n| Terms | Accepted |\n\nYour account is now active. Welcome! 🚀`,
];

export function matchResponse(input) {
  const norm  = normalise(input);
  const inTok = tokenise(input);

  // ── Stage 0: Buy Now prefix handler (dynamic cart submissions) ───────────
  const BUY_PREFIX = 'buy now cart items:';
  if (norm.startsWith(normalise(BUY_PREFIX))) {
    const rawItems = input.slice(input.toLowerCase().indexOf(':') + 1).trim();
    const items = rawItems || 'your selected items';
    const pick = BUY_NOW_RESPONSES[Math.floor(Math.random() * BUY_NOW_RESPONSES.length)];
    return pick(items);
  }

  // ── Stage 0b: Book flight handler (dynamic flight booking) ───────────────
  // Matches "Book Delta Air Lines at $249" / "book united airlines at $289"
  const BOOK_FLIGHT_RE = /^book (.+?) at (\$[\d,]+)$/i;
  const bfMatch = input.trim().match(BOOK_FLIGHT_RE);
  if (bfMatch) {
    const [, carrier, price] = bfMatch;
    const pick = BOOK_FLIGHT_RESPONSES[Math.floor(Math.random() * BOOK_FLIGHT_RESPONSES.length)];
    return pick(carrier, price);
  }

  // ── Stage 0c: CompleteForm submit handler ─────────────────────────────────
  // Matches "Form Submitted: Jane Doe, United States, Female, Terms Accepted, photo.jpg, DOB: 1990-01-15"
  const FORM_PREFIX = 'form submitted:';
  if (norm.startsWith(normalise(FORM_PREFIX))) {
    const details = input.slice(input.toLowerCase().indexOf(':') + 1).trim();
    const parts = details.split(',').map((s) => s.trim());
    const name    = parts[0] || 'there';
    const country = parts[1] || 'your country';
    const dob     = (parts.find((p) => p.toLowerCase().startsWith('dob:')) ?? 'DOB: not provided').replace(/^dob:\s*/i, '');
    const pick = FORM_SUBMIT_RESPONSES[Math.floor(Math.random() * FORM_SUBMIT_RESPONSES.length)];
    return pick(name, country, dob);
  }

  // ── Stage 0d: FAQ / knowledge-base handler ─────────────────────────────────
  // Intercepts help / how-to / what-is style questions and returns a
  // FAQResponse renderer payload so the custom renderer card is shown.
  const FAQ_TRIGGERS = [
    /\bhow\s+to\b/i,
    /\bwhat\s+is\b/i,
    /\bwhat\s+are\b/i,
    /\bhow\s+do\s+i\b/i,
    /\bcan\s+i\b/i,
    /\bwhere\s+(can|do|is)\b/i,
    /\breset\b/i,
    /\bforgot\b/i,
    /\bpassword\b/i,
    /\bhelp\b/i,
    /\bguide\b/i,
    /\btutorial\b/i,
    /\bexplain\b/i,
    /\bwhy\s+(is|does|do|can|should)\b/i,
  ];
  // Don't hijack existing Stage-0 renderer triggers
  const NOT_FAQ = [
    /^buy now cart items:/i,
    /^book .+ at \$/i,
    /^form submitted:/i,
  ];
  const looksFaq   = FAQ_TRIGGERS.some((re) => re.test(input));
  const notHijack  = NOT_FAQ.every((re) => !re.test(input));
  if (looksFaq && notHijack) {
    return buildFaqResponsePayloadFromFakeChat(input, 3);
  }

  // ── Stage 1: Direct exact match ──────────────────────────────────────────
  for (const pair of pairs) {
    if (normalise(pair.user) === norm) return pair.agent;
  }

  // ── Stage 2: Contains match ──────────────────────────────────────────────
  // a) input contains the pair's phrase verbatim (e.g. "I want to show flights" → "show flights")
  // b) pair's phrase contains the entire input
  for (const pair of pairs) {
    const pNorm = normalise(pair.user);
    if (norm.includes(pNorm) || pNorm.includes(norm)) return pair.agent;
  }

  // ── Stage 3a: Best Jaccard score ─────────────────────────────────────────
  let bestPair  = null;
  let bestScore = 0;

  for (const pair of pairs) {
    const score = jaccardSimilarity(inTok, tokenise(pair.user));
    if (score > bestScore) {
      bestScore = score;
      bestPair  = pair;
    }
  }

  // Accept if Jaccard ≥ 0.35 (at least ~35% word overlap)
  if (bestScore >= 0.35 && bestPair) return bestPair.agent;

  // ── Stage 3b: Levenshtein for short inputs (typo tolerance) ─────────────
  if (norm.length <= 40) {
    let bestDist    = Infinity;
    let levenPair   = null;

    for (const pair of pairs) {
      const pNorm = normalise(pair.user);
      // Skip pairs whose length differs too much — avoids false positives
      if (Math.abs(pNorm.length - norm.length) > 10) continue;

      const dist      = levenshtein(norm, pNorm);
      // Adaptive threshold: allow ~30% edit distance relative to the shorter string
      const threshold = Math.max(2, Math.floor(Math.min(norm.length, pNorm.length) * 0.30));

      if (dist < bestDist && dist <= threshold) {
        bestDist  = dist;
        levenPair = pair;
      }
    }

    if (levenPair) return levenPair.agent;
  }

  // ── Stage 4: Random fallback ─────────────────────────────────────────────
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

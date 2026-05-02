import DATA from './fake-chat.json';

const FAQ_TAG_TO_CATEGORY = {
  support: 'Support',
  account: 'Account',
  about: 'About',
  orders: 'Orders',
  tips: 'Product',
};

const FAQ_TAG_PRIORITY = ['support', 'account', 'about', 'orders', 'tips'];

function toQuestion(text) {
  const trimmed = String(text ?? '').trim();
  if (!trimmed) return '';
  const first = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return /[?.!]$/.test(first) ? first : `${first}?`;
}

function pickCategory(tags = []) {
  const matched = FAQ_TAG_PRIORITY.find((tag) => tags.includes(tag));
  return FAQ_TAG_TO_CATEGORY[matched] ?? 'General';
}

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function tokenise(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function jaccardScore(aText, bText) {
  const a = new Set(tokenise(aText));
  const b = new Set(tokenise(bText));
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 0;
}

function confidenceFromScore(score) {
  return Math.max(0.55, Math.min(0.99, score));
}

function buildFaqCandidates() {
  const pairs = Array.isArray(DATA?.pairs) ? DATA.pairs : [];
  return pairs
    .filter((pair) => typeof pair?.agent === 'string')
    .filter((pair) => Array.isArray(pair?.tags) && pair.tags.some((tag) => FAQ_TAG_PRIORITY.includes(tag)))
    .map((pair, idx) => ({
      category: pickCategory(pair.tags),
      question: toQuestion(pair.user),
      answer: pair.agent,
      faqId: String(idx + 1),
      tags: pair.tags,
    }))
    .filter((item) => item.question && item.answer);
}

function dedupeFaqItems(items) {
  const deduped = [];
  const seen = new Set();
  for (const item of items) {
    const key = `${item.category}::${item.question.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }
  return deduped;
}

function withSemanticScore(items, userQuery) {
  return items
    .map((item) => {
      const qScore = jaccardScore(userQuery, item.question);
      const aScore = jaccardScore(userQuery, item.answer);
      const directBoost = item.question.toLowerCase().includes('password') ? 0.12 : 0;
      const score = confidenceFromScore((qScore * 0.75) + (aScore * 0.25) + directBoost);
      return {
        faqId: item.faqId,
        category: item.category,
        question: item.question,
        answer: item.answer,
        score: Number(score.toFixed(2)),
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function buildFaqResponsePayloadFromFakeChat(userQuery = 'how to reset password', maxMatches = 3) {
  const base = dedupeFaqItems(buildFaqCandidates());
  const ranked = withSemanticScore(base, userQuery);
  const matchedFaqs = ranked.slice(0, Math.max(1, maxMatches));
  const top = matchedFaqs[0];

  return {
    type: 'FAQResponse',
    title: 'FAQ Match Results',
    userQuery,
    answer: top?.answer || 'I could not find a strong FAQ match. Please refine your question.',
    confidence: top?.score ?? 0.55,
    matchedFaqs,
    caption: `Simulated semantic match from fake-chat.json • ${new Date().toLocaleDateString()}`,
  };
}

export const FAQ_RESPONSE_CODE = `// FAQResponseComponent.jsx
// ── How data flows to your backend ────────────────────────────────────────
// 1. USER types a question in chat, e.g. "how to reset password"
//
// 2. YOUR BACKEND receives the message and returns this JSON:
//    { "type": "FAQResponse",
//      "title": "FAQ Match Results",
//      "userQuery": "how to reset password",
//      "answer": "To change your password: Settings → Security → Change Password...",
//      "confidence": 0.94,
//      "matchedFaqs": [
//        { "faqId": "FAQ-021", "category": "Account",
//          "question": "How do I change password?", "answer": "...", "score": 0.94 },
//        { "faqId": "FAQ-044", "category": "Account",
//          "question": "I forgot my password?", "answer": "...", "score": 0.89 },
//        { "faqId": "FAQ-057", "category": "Support",
//          "question": "How to secure my account?", "answer": "...", "score": 0.82 }
//      ]
//    }
//    ConvEngine passes it as the \`payload\` prop to your component.
//
// 3. DEMO (this project):
//    Queries like "how to reset password", "what is 2FA", "forgot my password"
//    automatically return FAQResponse JSON from the mock backend — try it!

// ---------------------------------------------------------------------------
// FAQ custom renderer (complete React example)
// ---------------------------------------------------------------------------
const FAQ_BADGE_PALETTE = [
  { bg: '#dbeafe', fg: '#1e40af', border: '#bfdbfe' },
  { bg: '#dcfce7', fg: '#166534', border: '#bbf7d0' },
  { bg: '#ede9fe', fg: '#5b21b6', border: '#ddd6fe' },
  { bg: '#fef3c7', fg: '#92400e', border: '#fde68a' },
  { bg: '#fce7f3', fg: '#9d174d', border: '#fbcfe8' },
];

function FAQResponseComponent({ payload }) {
  const answer = payload?.answer;
  const confidence = typeof payload?.confidence === 'number' ? payload.confidence : null;
  const matchedFaqs = Array.isArray(payload?.matchedFaqs) ? payload.matchedFaqs : [];

  return (
    <div className="ce-interactive-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* top row: colorful numeric FAQ ID badges left, confidence % right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          {matchedFaqs.map((f, i) => {
            const c = FAQ_BADGE_PALETTE[i % FAQ_BADGE_PALETTE.length];
            return (
              <span key={f.faqId || i} style={{
                fontSize: '0.65rem', fontWeight: 700,
                color: c.fg, background: c.bg, border: \`1px solid \${c.border}\`,
                borderRadius: 999, padding: '2px 7px',
              }}>
                {f.faqId}
              </span>
            );
          })}
        </div>
        {confidence !== null && (
          <span style={{
            fontSize: '0.68rem', fontWeight: 700,
            color: '#1e40af', background: '#dbeafe', border: '1px solid #bfdbfe',
            borderRadius: 999, padding: '2px 8px', whiteSpace: 'nowrap',
          }}>
            {(confidence * 100).toFixed(0)}%
          </span>
        )}
      </div>

      {/* answer only */}
      {answer && (
        <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--ce-fg)' }}>{answer}</p>
      )}
    </div>
  );
}

export const faqResponseRenderer = {
  key: 'FAQResponse',
  priority: 210,
  hideBubble: true,
  match: ({ effectiveType }) => effectiveType === 'FAQResponse',
  Component: FAQResponseComponent,
};

// Wire into ConvEngineChat
<ConvEngineChat config={{ renderers: [faqResponseRenderer] }} />`;

// ---------------------------------------------------------------------------
// Demo hint queries — what to type in the chat to test each match level
// ---------------------------------------------------------------------------
export const FAQ_MATCH_HINTS = {
  strong: [
    'how to reset password',
    'change my password',
    'forgot my password',
    'how to change password',
  ],
  partial: [
    'how do I log out',
    'update my settings',
    'what is my billing',
    'how to return a product',
    'how to contact support',
  ],
  weak: [
    'what is convengine',
    'tell me about the platform',
    'how does this work',
    'explain the sdk',
  ],
};

import { NextResponse } from 'next/server';
import { matchResponse } from '../../../../data/fake-chat.js';
import { emitSseEvent }  from '../sse-bus.js';
import { VERBOSE_SEQUENCES } from '../../../../data/fake-stream.js';

/**
 * POST /api/v1/conversation/message
 *
 * Drop-in demo handler. Matches the same request/response shape as the real
 * ConvEngine backend so the chat widget works without any live server.
 *
 * Request body (from convengine-chat client.js):
 *   { conversationId, message, reset, inputParams }
 *
 * Response (parsed by useChat.js via stringifyPayload):
 *   { payload: <string | object> }
 *
 * The `payload` field is passed through stringifyPayload() in the library:
 *   - string  → used as-is
 *   - object  → JSON.stringified → renderer picks it up by `type`
 *
 * ── Message Enrichment ──────────────────────────────────────────────────────
 * When config.messageEnrichment.prefix/suffix is set in the widget, they're
 * baked directly into `message`: "<prefix> <userText> <suffix>" — the wrapping
 * happens client-side, so this route always receives a single plain string.
 * `inputParams` is arbitrary consumer data (e.g. `{ userId }`) merged in via
 * `messageEnrichment.inputParams` — it carries no routing metadata anymore.
 *
 * We auto-detect a leading "/word" prefix in `message` here so matchResponse()
 * can route by prefix (/faq, /order, etc.) and match against the clean text —
 * invisible to the user but visible in the audit trail.
 */
export async function POST(request) {
  const body = await request.json();
  const { message, inputParams, conversationId } = body;

  const cleanMessage  = message ?? '';
  const enrichOptions = {
    inputParams: inputParams ?? {},
  };

  // ── Fire mock SSE VERBOSE events asynchronously ─────────────────────────
  // If a stream subscriber is connected for this conversation, emit fake
  // step events so the typing indicator shows live progress text.
  if (conversationId) {
    const sequence = VERBOSE_SEQUENCES[Math.floor(Math.random() * VERBOSE_SEQUENCES.length)];
    // Don't await — fire and forget alongside the REST think-time below
    (async () => {
      for (const { text, delay: stepDelay } of sequence) {
        await new Promise((r) => setTimeout(r, stepDelay));
        emitSseEvent(conversationId, 'VERBOSE', { verbose: { text } });
      }
      // Give REST response a moment to land, then signal ENGINE_RETURN
      await new Promise((r) => setTimeout(r, 200));
      emitSseEvent(conversationId, 'ENGINE_RETURN', { stage: 'ENGINE_RETURN' });
    })();
  }

  // Simulate realistic think-time (300–900ms)
  const delay = 300 + Math.random() * 600;
  await new Promise((r) => setTimeout(r, delay));

  // ── Attachments (convengine-chat >= 1.6) ────────────────────────────────
  // The widget delivers picked files on inputParams.files, base64-encoded.
  // This handler DECODES them and reports the byte count it recovered, which
  // is the only way to prove the bytes actually arrived — echoing the filename
  // back would pass even if the content never left the browser.
  const files = Array.isArray(inputParams?.files) ? inputParams.files : [];
  if (files.length) {
    const lines = files.map((f) => {
      let decoded = null;
      try {
        decoded = Buffer.from(String(f?.content ?? ''), 'base64');
      } catch {
        decoded = null;
      }
      const size = decoded ? decoded.length : 0;
      let preview = '';
      if (decoded) {
        const text = decoded.toString('utf8').slice(0, 300);
        // Only preview when it really is text — a PDF rendered as mojibake
        // helps nobody.
        const binary = Array.from(text).some((ch) => {
          const c = ch.charCodeAt(0);
          return c < 9 || (c > 13 && c < 32);
        });
        if (!binary) preview = text.split('\n').slice(0, 3).join(' / ').slice(0, 150);
      }
      const type = f?.mimeType || 'unknown type';
      const head = `- **${f?.name}** — ${type}, ${size} bytes decoded server-side`;
      return preview ? `${head}\n  \`${preview}\`` : head;
    });

    const asked = cleanMessage.trim();
    const parts = [
      `Got ${files.length} file(s):`,
      '',
      lines.join('\n'),
    ];
    if (asked) parts.push('', `You also said: "${asked}"`);
    parts.push('', '_(demo handler — a real backend would parse these)_');
    return NextResponse.json({ payload: parts.join('\n') });
  }

  const agent = matchResponse(cleanMessage, enrichOptions);

  return NextResponse.json({ payload: agent });
}

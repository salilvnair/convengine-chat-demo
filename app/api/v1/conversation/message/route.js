import { NextResponse } from 'next/server';
import { matchResponse } from '../../../../data/fake-chat.js';

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
 * When config.messageEnrichment is active in the widget, the body changes:
 *
 *   text mode: `message` = "<prefix><userText><postfix>"  (concatenated string)
 *              `inputParams` = {} (empty or renderer's own params)
 *
 *   json mode: `message` = "<userText>"  (original, unmodified)
 *              `inputParams` = { prefix, userText, postfix, ...extraProps }
 *
 * In both cases we extract the original user text and the prefix here so that
 * matchResponse() can route by prefix (/faq, /order, etc.) and match against
 * the clean text — invisible to the user but visible in the audit trail.
 */
export async function POST(request) {
  const { message, inputParams } = await request.json();

  // JSON enrichment mode: inputParams.userText carries the original user text,
  // inputParams.prefix carries the routing prefix.
  // Text enrichment mode: the prefix is embedded at the start of message.
  // No enrichment: message is the raw user text.
  const cleanMessage  = inputParams?.userText ?? message ?? '';
  const enrichOptions = {
    prefix:      inputParams?.prefix  ?? '',
    postfix:     inputParams?.postfix ?? '',
    inputParams: inputParams ?? {},
  };

  // Simulate realistic think-time (300–900ms)
  const delay = 300 + Math.random() * 600;
  await new Promise((r) => setTimeout(r, delay));

  const agent = matchResponse(cleanMessage, enrichOptions);

  return NextResponse.json({ payload: agent });
}

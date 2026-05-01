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
 */
export async function POST(request) {
  const { message } = await request.json();

  // Simulate realistic think-time (300–900ms)
  const delay = 300 + Math.random() * 600;
  await new Promise((r) => setTimeout(r, delay));

  const agent = matchResponse(message ?? '');

  return NextResponse.json({ payload: agent });
}

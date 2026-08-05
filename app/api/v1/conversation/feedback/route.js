import { NextResponse } from 'next/server';

/**
 * POST /api/v1/conversation/feedback
 *
 * Drop-in demo handler for the 👍/👎 row. Matches the same request shape the
 * real ConvEngine backend would receive so the widget's feedback UI (active
 * green/red state) actually has something to succeed against — without this
 * route the client POST 404s, submitFeedback()'s catch clears feedbackBusy
 * without ever setting `feedback`, and the thumb never shows as voted.
 *
 * Request body (from convengine-chat client.js submitFeedback):
 *   { conversationId, feedbackType, messageId, assistantResponse, metadata }
 *
 * The library doesn't read the response body at all — it just needs a 2xx —
 * so this only needs to exist and succeed, not do anything with the data.
 */
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true, received: body.feedbackType ?? null });
}

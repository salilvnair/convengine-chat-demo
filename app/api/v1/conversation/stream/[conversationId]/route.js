/**
 * GET /api/v1/conversation/stream/[conversationId]
 *
 * Server-Sent Events endpoint for the demo.  Keeps the connection open and
 * pushes events that the message route emits via the shared sse-bus.
 *
 * The library connects here when `config.stream = { enabled: true, transport: 'sse' }`
 * and `apiHost` is '' (same-origin).  The SSE URL becomes:
 *   /api/v1/conversation/stream/{conversationId}
 *
 * which matches the library's default SSE URL:
 *   {apiHost}/api/v1/conversation/stream/{conversationId}
 */
import { registerSseController, unregisterSseController } from '../../sse-bus.js';

// Force dynamic so Next.js never caches this response
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { conversationId } = await params;

  let streamController;

  const stream = new ReadableStream({
    start(controller) {
      streamController = controller;
      registerSseController(conversationId, controller);

      // Send initial CONNECTED event so the library's onConnected fires
      const enc       = new TextEncoder();
      const connected = enc.encode(
        `event: CONNECTED\ndata: ${JSON.stringify({ conversationId })}\n\n`,
      );
      controller.enqueue(connected);
    },
    cancel() {
      // Client disconnected (tab closed, component unmounted, etc.)
      unregisterSseController(conversationId, streamController);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no', // disable Nginx proxy buffering if present
    },
  });
}

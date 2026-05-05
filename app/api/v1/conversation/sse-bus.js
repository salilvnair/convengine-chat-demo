/**
 * In-memory SSE connection registry — demo / development only.
 *
 * Maps conversationId → Set<ReadableStreamDefaultController>
 *
 * NOTE: This lives in module scope (singleton per process). It works for a
 *       single-instance dev server. A production system would use Redis
 *       pub/sub or a message broker instead.
 */

const controllers = new Map(); // conversationId → Set<ReadableStreamDefaultController>

export function registerSseController(conversationId, controller) {
  if (!controllers.has(conversationId)) controllers.set(conversationId, new Set());
  controllers.get(conversationId).add(controller);
}

export function unregisterSseController(conversationId, controller) {
  const set = controllers.get(conversationId);
  if (!set) return;
  set.delete(controller);
  if (set.size === 0) controllers.delete(conversationId);
}

/**
 * Emits a named SSE event to all subscribers of a conversation.
 * Returns true if at least one subscriber received the event.
 */
export function emitSseEvent(conversationId, stage, data) {
  const set = controllers.get(conversationId);
  if (!set || set.size === 0) return false;
  const enc     = new TextEncoder();
  const payload = enc.encode(`event: ${stage}\ndata: ${JSON.stringify(data)}\n\n`);
  set.forEach((c) => {
    try { c.enqueue(payload); } catch { /* stream already closed — ignore */ }
  });
  return true;
}

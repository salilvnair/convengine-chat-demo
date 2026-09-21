/**
 * In-memory audit trail store — demo / development only.
 *
 * Rows are shaped like the real backend's `CeAudit` entity
 * (convengine/src/main/java/.../entity/CeAudit.java), because
 * GET /api/v1/conversation/audit/{conversationId} on the real
 * ConversationController returns `List<CeAudit>` straight out of the
 * repository — Jackson serialises the entity fields verbatim:
 *
 *   {
 *     "auditId":        1,                       // IDENTITY column
 *     "conversationId": "<uuid>",
 *     "stage":          "ASSISTANT_OUTPUT",      // ConvEngineAuditStage name
 *     "payloadJson":    "{\"output\":\"…\"}",    // JSON *string*, not an object
 *     "createdAt":      "2026-09-19T02:52:47.402Z"
 *   }
 *
 * payloadJson being a string is not an accident of this mock: the column is
 * @JdbcTypeCode(SqlTypes.JSON) over a String field, and AuditService.audit()
 * runs every payload through JsonUtil.toJson() before it is stored. The
 * widget's AuditPanel JSON.parse()s it back, so sending a bare object here
 * would render as a text blob instead of a card.
 *
 * NOTE: module scope (singleton per process), same as sse-bus.js. Fine for a
 *       single-instance dev server; the real thing is a Postgres table.
 */

// Pinned to globalThis on purpose. In Next dev each route handler gets its
// own compiled bundle, so a plain module-scope Map can end up as TWO Maps —
// the message route writes into one, the audit route reads the other, and the
// panel says "No audit entries yet" for a conversation that definitely has
// rows. Hot reload has the same effect: a recompile of this file would
// otherwise silently reset the trail mid-session.
const trails = (globalThis.__ceAuditTrails ??= new Map()); // conversationId → rows[]

// A long demo session shouldn't grow without bound. ~10 turns of a full trail.
const MAX_ROWS = 200;

// Stands in for the IDENTITY column — unique across the whole process, not
// per conversation, exactly like a real sequence.
const ids = (globalThis.__ceAuditIds ??= { next: 1 });

/**
 * @param {string} conversationId
 * @param {string} stage    a ConvEngineAuditStage name — including the dynamic
 *                          forms: `intentResolvedBy()` builds
 *                          INTENT_RESOLVED_BY_<SOURCE>, and `withStage()`
 *                          builds "RULE_MATCH (SomeStep)".
 * @param {object|string} payload  an object (stringified here, like
 *                          AuditService's Map overload) or an already-encoded
 *                          JSON string (like its String overload — which is
 *                          how PIPELINE_TIMING is written).
 */
export function recordAuditEntry(conversationId, stage, payload) {
  if (!conversationId) return;
  if (!trails.has(conversationId)) trails.set(conversationId, []);
  const rows = trails.get(conversationId);
  rows.push({
    auditId:        ids.next++,
    conversationId,
    stage,
    payloadJson:    typeof payload === 'string' ? payload : JSON.stringify(payload ?? {}),
    createdAt:      new Date().toISOString(),
  });
  if (rows.length > MAX_ROWS) rows.splice(0, rows.length - MAX_ROWS);
}

/** Rows oldest-first, matching findByConversationIdOrderByCreatedAtAsc. */
export function getAuditTrail(conversationId) {
  return trails.get(conversationId) ?? [];
}

export function clearAuditTrail(conversationId) {
  trails.delete(conversationId);
}

/**
 * Searches audit rows across EVERY conversation the store still holds.
 *
 * Backs the panel's search box, which exists because the trail you want is
 * usually the one from an hour ago whose conversation id nobody wrote down.
 * Matching is a case-insensitive substring over the stage name and the payload
 * — the payload is already a JSON string, so this searches user text, intents,
 * rule ids, prompts and tool names in one pass without indexing anything.
 *
 * Newest first, because a search for "loan" wants the most recent one.
 */
/**
 * The searchable text of a row: its payload WITHOUT the _meta envelope.
 *
 * _meta carries a session snapshot that repeats the user's text and names
 * every step run so far, so matching it makes one hit return the entire
 * conversation — searching "form submitted" returned all 89 rows of the turn
 * rather than the USER_INPUT row that actually contains it.
 */
function bodyText(row) {
  try {
    const { _meta, ...body } = JSON.parse(row.payloadJson);
    return JSON.stringify(body).toLowerCase();
  } catch {
    return row.payloadJson.toLowerCase();
  }
}

/**
 * Same contract as convengine-demo's AuditSearchController, so the widget
 * behaves identically against the mock and the real engine:
 *   - an empty query returns the newest rows (the explorer's landing page
 *     uses this to list recent conversations)
 *   - a query that looks like a conversation id (8+ hex chars) matches the
 *     id prefix — the id is on the row, not in the body text search reads
 *   - optional filters: stage (comma list, exact or "NAME (sub)" prefix),
 *     conversationId, intent, state (from _meta), errorsOnly, offset
 */
const FAILURE_RE = /(ERROR|FAILURE|FAILED|VIOLATION|DENY|REJECTED|NOT_FOUND|POLICY_BLOCK)/;

function metaOf(row) {
  try { return JSON.parse(row.payloadJson)._meta ?? null; } catch { return null; }
}

export function searchAuditTrails(query, limit = 50, filters = {}) {
  const q = String(query ?? '').trim().toLowerCase();
  const idPrefix = /^[0-9a-f]{8}[0-9a-f-]{0,28}$/.test(q) ? q : null;
  const stages = String(filters.stage ?? '').split(',').map((x) => x.trim()).filter(Boolean);

  const hits = [];
  for (const rows of trails.values()) {
    for (const row of rows) {
      if (q) {
        const hit = idPrefix
          ? String(row.conversationId).toLowerCase().startsWith(idPrefix)
          : row.stage.toLowerCase().includes(q) || bodyText(row).includes(q);
        if (!hit) continue;
      }
      if (stages.length && !stages.some((st) => row.stage === st || row.stage.startsWith(st + ' ('))) continue;
      if (filters.conversationId && row.conversationId !== filters.conversationId) continue;
      if (filters.errorsOnly && !FAILURE_RE.test(row.stage)) continue;
      if (filters.intent || filters.state) {
        const m = metaOf(row);
        if (filters.intent && m?.intent !== filters.intent) continue;
        if (filters.state && m?.state !== filters.state) continue;
      }
      hits.push(row);
    }
  }
  hits.sort((a, b) => b.auditId - a.auditId);
  const offset = Math.max(0, Number(filters.offset) || 0);
  return { results: hits.slice(offset, offset + limit), total: hits.length };
}

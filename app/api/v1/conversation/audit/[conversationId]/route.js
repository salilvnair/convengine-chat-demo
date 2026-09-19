import { NextResponse } from 'next/server';
import { getAuditTrail } from '../../audit-store.js';

/**
 * GET /api/v1/conversation/audit/:conversationId
 *
 * Drop-in demo handler for the audit trail panel (fullscreen mode, or the
 * playground's "Show Audit Trail" toggle). The library's client.js builds this
 * URL as {auditBase}/{conversationId} and throws on any non-2xx, which the
 * AuditPanel surfaces as a raw "ConvEngine API error: 404" — so without this
 * route the toggle is a switch that only ever shows an error.
 *
 * The entries are recorded by the message route as each turn is handled, so
 * this trail reflects the conversation you actually had rather than a canned
 * script: which matcher stage answered, and with what score.
 *
 * An unknown conversationId returns [] — the panel renders its empty state.
 */
export async function GET(request, { params }) {
  const { conversationId } = await params;
  return NextResponse.json(getAuditTrail(conversationId));
}

import { NextResponse } from 'next/server';
import { searchAuditTrails } from '../../audit-store.js';

/**
 * GET /api/v1/conversation/audit/search?q=…&limit=…
 *
 * Audit search across conversations, backing the search box in the widget's
 * audit panel (config.showAuditSearch). The real engine has no such route yet
 * — it exposes /audit/{conversationId} and /audit/{conversationId}/trace — so
 * this is the demo's proposal for one, in the shape the widget expects:
 *
 *   { results: [ …CeAudit rows… ], total }
 *
 * Rows come back in the same shape as a single conversation's trail, each
 * carrying its own conversationId, so a hit renders with the same card as the
 * live trail and can say which conversation it came from.
 *
 * NOTE this lives at a STATIC segment beside the dynamic [conversationId] one.
 * Next resolves static before dynamic, so /audit/search reaches this handler
 * rather than being read as a conversation whose id is "search".
 */
export async function GET(request) {
  const { searchParams: p } = new URL(request.url);
  const limit = Math.min(Number(p.get('limit')) || 50, 500);
  return NextResponse.json(searchAuditTrails(p.get('q') ?? '', limit, {
    stage:          p.get('stage'),
    conversationId: p.get('conversationId'),
    intent:         p.get('intent'),
    state:          p.get('state'),
    errorsOnly:     p.get('errorsOnly') === 'true',
    offset:         p.get('offset'),
  }));
}

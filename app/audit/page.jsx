'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuditExplorer } from '@salilvnair/convengine-chat';

/**
 * /audit — the full-page Audit Explorer.
 *
 * This is where the widget's "Open Audit Explorer" header button lands
 * (config.showAuditExplorer + auditExplorerUrl: '/audit'). The button appends
 * ?conversationId=…, so the explorer opens on the conversation you were in;
 * without it you get the search landing page.
 *
 * URL parameters, so a link can carry a whole view:
 *   conversationId  open straight on one conversation
 *   q               start with a search
 *   palette         aurora | lagoon | ember | indigo
 *   scheme          light | dark | system (default)
 *   apiHost         point at a real backend, e.g. http://localhost:8085
 *                   (convengine-demo running ConvEngine 2.x)
 */
function AuditExplorerPage() {
  const p = useSearchParams();
  const scheme = p.get('scheme');
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <AuditExplorer
        config={{
          apiHost:        p.get('apiHost') ?? '',
          conversationId: p.get('conversationId') ?? undefined,
          initialQuery:   p.get('q') ?? '',
          palette:        p.get('palette') ?? 'aurora',
          colorScheme:    scheme === 'light' || scheme === 'dark' ? scheme : undefined,
          subtitle:       p.get('apiHost') ? `Live · ${p.get('apiHost')}` : undefined,
        }}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuditExplorerPage />
    </Suspense>
  );
}

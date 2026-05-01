'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ConvEngineChat } from '@salilvnair/convengine-chat';
import { interactiveRenderers } from '../components/InteractiveRenderers.jsx';

/* ─────────────────────────────────────────────────────────────────────────────
   Inner component — reads URL params so it can be wrapped in Suspense
───────────────────────────────────────────────────────────────────────────── */
function FullscreenChat() {
  const params   = useSearchParams();
  const accent   = params.get('accent')   ?? '#6366f1';
  const feedback = params.get('feedback') !== 'false';
  const audit    = params.get('audit')    === 'true';
  const darkMode = params.get('darkMode') !== 'false';
  const title         = params.get('title')       || 'ConvEngine Assistant';
  const subtitle      = params.get('subtitle')    || "Ask me anything — I'll do my best to help.";
  const placeholder   = params.get('placeholder') || 'Ask ConvEngine…';
  const headerDot     = params.get('headerDot')   !== 'false';
  const landingAvatar   = params.get('landingAvatar')   !== 'false';
  const landingSubtitle = params.get('landingSubtitle') !== 'false';
  const showNewChat      = params.get('showNewChat')      !== 'false';
  const showLayoutPicker = params.get('showLayoutPicker') !== 'false';
  const showMaximize     = params.get('showMaximize')     !== 'false';
  const showMinimize     = params.get('showMinimize')     !== 'false';
  const composerShape    = params.get('composerShape')    === 'rect' ? 'rect' : 'round';

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#fff' }}>
      <ConvEngineChat
        mode="fullscreen"
        config={{
          apiHost:               '',
          title,
          subtitle,
          placeholder,
          showFeedback:          feedback,
          showAudit:             audit,
          showDarkModeLightMode: darkMode,
          showHeaderDot:         headerDot,
          showLandingAvatar:     landingAvatar,
          showLandingSubtitle:   landingSubtitle,
          showNewChat,
          showLayoutPicker,
          showMaximize,
          showMinimize,
          composerShape,
          renderers:             interactiveRenderers,
        }}
        theme={{ 'color-accent': accent }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────────── */
export default function FullscreenPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{ width: '100vw', height: '100vh', background: '#0f172a' }}
          className="flex items-center justify-center text-slate-400 text-sm"
        >
          Loading…
        </div>
      }
    >
      <FullscreenChat />
    </Suspense>
  );
}

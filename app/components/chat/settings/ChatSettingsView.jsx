'use client';

import { useState, useEffect } from 'react';
import { CodeBlock }   from './ui/CodeBlock.jsx';
import { Tip }         from './ui/Tip.jsx';
import { PropRow, PropsTable, DefaultBadge } from './ui/PropRow.jsx';
import { SectionHeader, FeatureChip, DocCard, DocCardBody, NavDot } from './ui/DocLayout.jsx';
import { BackToTop }   from './ui/BackToTop.jsx';
import { PlaygroundPanel }  from './PlaygroundPanel.jsx';
import { RendererLiveDemo } from './RendererLiveDemo.jsx';
import { TailwindPlayground, TailwindNotificationPreview, TailwindSidebarPreview, TailwindClassInputDemo } from './TailwindSection.jsx';
import { SvgPreview, svgStringToComponent, DEFAULT_ICON_SVGS, ICON_META } from './IconSection.jsx';

export function ChatSettingsView({ onSettingsChange, hideHeader = false, chatActionsRef = null, darkMode = false }) {
  const [settings, setSettings] = useState({
    showFeedback:          true,
    showAudit:             false,
    showEngineStatus:      true,
    showDarkModeLightMode: true,
    chatMode:              'panel',
    accentColor:           '#6366f1',
    // Text
    title:       'ConvEngine Assistant',
    subtitle:    "Ask me anything \u2014 I'll do my best to help.",
    placeholder: 'Ask ConvEngine\u2026',
    // Visibility
    showHeaderDot:       true,
    showLandingAvatar:   true,
    showLandingSubtitle: true,
    // Header controls
    showNewChat:       true,
    showLayoutPicker:  true,
    showMaximize:      true,
    showMinimize:      true,
    // Color overrides — { light, dark } like iOS Color Assets
    bubbleUserBg:    { light: '', dark: '' },
    bubbleUserText:  { light: '', dark: '' },
    bubbleAgentBg:   { light: '', dark: '' },
    bubbleAgentText: { light: '', dark: '' },
    panelBg:         { light: '', dark: '' },
    composerBg:      { light: '', dark: '' },
    iconColor:       { light: '', dark: '' },
    userIconBg:      { light: '', dark: '' },
    userIconColor:   { light: '', dark: '' },
    agentIconBg:     { light: '', dark: '' },
    agentIconColor:  { light: '', dark: '' },
    composerShape:   'round',
    // Preview
    previewDark:     false,
    // Message enrichment
    messageEnrichment: { mode: 'none', prefix: '', postfix: '', props: {} },
    // Stream / SSE / STOMP
    streamEnabled:      false,
    streamTransport:    'sse',
    showTransportBadge: false,
    // Landing chips
    landingChips:                   [],
    landingChipsOrientation:        'row',
    landingChipsShape:              'round',
    landingChipsAnchor:             'landingAgent',
    landingChipsAnchorPadding:      '',
    landingChipsAnchorPaddingUnit:  'px',
  });

  const [iconSvgs, setIconSvgs] = useState({ ...DEFAULT_ICON_SVGS });

  // Auto-sync preview dark with the app-level dark mode toggle
  useEffect(() => {
    setSettings((s) => ({ ...s, previewDark: darkMode }));
  }, [darkMode]);

  function buildIconComponents(svgs) {
    const result = {};
    for (const [key, svg] of Object.entries(svgs)) {
      if (svg !== DEFAULT_ICON_SVGS[key]) {
        result[key] = svgStringToComponent(svg, ICON_META[key]?.fill ?? false);
      }
    }
    return result;
  }

  function handleChange(next) {
    setSettings(next);
    onSettingsChange?.(next, buildIconComponents(iconSvgs));
  }

  function handleIconChange(key, value) {
    const next = { ...iconSvgs, [key]: value };
    setIconSvgs(next);
    onSettingsChange?.(settings, buildIconComponents(next));
  }

  function handleIconReset() {
    setIconSvgs({ ...DEFAULT_ICON_SVGS });
    onSettingsChange?.(settings, {});
  }

  return (
    <div className="space-y-8">
      {!hideHeader && (
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Chat Settings &amp; Docs</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure the widget live, then browse the full API reference below.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <FeatureChip label="⚛️ React 18+" color="sky" />
            <FeatureChip label="🎨 CSS tokens" color="violet" />
            <FeatureChip label="🔌 Pluggable renderers" color="emerald" />
            <FeatureChip label="🌙 Dark mode" color="indigo" />
            <FeatureChip label="📐 3 layout modes" color="pink" />
          </div>
        </div>
      )}

      <PlaygroundPanel
        settings={settings}
        onChange={handleChange}
        iconSvgs={iconSvgs}
        onIconChange={handleIconChange}
        onIconReset={handleIconReset}
      />

      {/* Docs: sidebar + content */}
      <div className="flex gap-8 items-start">
        <nav className="hidden lg:flex flex-col gap-1 sticky top-20 w-44 flex-shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1">On this page</p>
          <NavDot href="#install">Installation</NavDot>
          <NavDot href="#quickstart">Quick Start</NavDot>
          <NavDot href="#props">Component Props</NavDot>
          <NavDot href="#config">config Object</NavDot>
          <NavDot href="#backend">Backend Routes</NavDot>
          <NavDot href="#stream">Streaming (SSE/STOMP)</NavDot>
          <NavDot href="#debug">Dev Mode Guide</NavDot>
          <NavDot href="#timestamps">Timestamps &amp; Dates</NavDot>
          <NavDot href="#landing-chips">Landing Chips</NavDot>
          <NavDot href="#colors">Color Theming</NavDot>
          <NavDot href="#theme">Theme Tokens</NavDot>
          <NavDot href="#tailwind">Tailwind Integration</NavDot>
          <NavDot href="#icons">Custom Icons</NavDot>
          <NavDot href="#renderers">Custom Renderers</NavDot>
          <NavDot href="#actions">Actions API</NavDot>
          <NavDot href="#hooks">Hooks</NavDot>
        </nav>

        <div className="flex-1 min-w-0 space-y-8">

          {/* ── Installation ── */}
          <DocCard id="install">
            <SectionHeader gradient="bg-gradient-to-r from-sky-500 to-indigo-600" icon="📦" title="Installation" subtitle="Get convengine-chat into your project" />
            <DocCardBody>
              <Tip color="blue" icon="💡" title="Requirements">React 18+ and react-dom. Peer dependencies only — no bundled React copy.</Tip>
              <CodeBlock lang="bash" code={`npm install @salilvnair/convengine-chat\n# or link a local build during development\nnpm install ../convengine-chat`} />
              <p className="text-sm text-slate-600 dark:text-slate-300">Import the CSS once in your app entry:</p>
              <CodeBlock lang="jsx" code={`// app/layout.jsx  (or any JS/JSX entry file)\nimport '@salilvnair/convengine-chat/style.css';`} />
              <Tip color="amber" icon="⚡" title="Next.js users">
                Add <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">transpilePackages: [&apos;@salilvnair/convengine-chat&apos;]</code> to your <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">next.config.mjs</code>.{' '}
                <strong>Only needed when using a local <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">file:</code> path during development</strong> — not required once the package is published to npm,
                because the published version ships only the pre-built <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">dist/</code> output (no raw JSX).
              </Tip>
              <CodeBlock lang="js" code={`// next.config.mjs\nconst nextConfig = {\n  transpilePackages: ['@salilvnair/convengine-chat'],\n};\nexport default nextConfig;`} />
            </DocCardBody>
          </DocCard>

          {/* ── Quick Start ── */}
          <DocCard id="quickstart">
            <SectionHeader gradient="bg-gradient-to-r from-emerald-500 to-teal-600" icon="🚀" title="Quick Start" subtitle="Every option in one place — copy, trim, ship" />
            <DocCardBody>
              <div className="flex flex-wrap gap-2">
                <FeatureChip label="mode=panel" color="indigo" />
                <FeatureChip label="mode=sidepanel" color="violet" />
                <FeatureChip label="mode=fullscreen" color="pink" />
                <FeatureChip label="all config keys" color="emerald" />
                <FeatureChip label="theme tokens" color="amber" />
                <FeatureChip label="custom icons" color="sky" />
                <FeatureChip label="renderers" color="rose" />
              </div>
              <Tip color="green" icon="💡" title="How to use this snippet">
                This is the <strong>complete reference</strong> — every prop and config key shown with its default.
                Delete the lines you don&apos;t need; unchanged defaults are automatically applied.
              </Tip>
              <CodeBlock lang="jsx" code={
`import { ConvEngineChat, useChatActions } from '@salilvnair/convengine-chat';
import '@salilvnair/convengine-chat/style.css';

function MyFabIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor"
      className="ce-icon" aria-hidden="true" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12
               17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

const myRenderer = {
  key:      'MyCard',
  priority: 200,
  match:    (ctx) => ctx.effectiveType === 'MyCard',
  Component({ payload, actions }) {
    return (
      <button
        className="ce-interactive-submit"
        onClick={() => actions.submit(payload.label, { choice: payload.value })}
      >
        {payload.label}
      </button>
    );
  },
};

<ConvEngineChat
  mode="panel"
  position="bottom"
  align="right"
  onModeChange={(newMode) => console.log('mode changed to', newMode)}
  config={{
    apiHost:        'http://localhost:8080',
    conversationId: undefined,
    icons: { ChatBubbleIcon: MyFabIcon },
    landingChips: [
      { chipText: "📊 Activity",  chatText: "Show my recent account activity" },
      { chipText: "🔑 Password",  chatText: "How do I reset my password?" },
      { chipText: "🛟 Support",   chatText: "I need to contact customer support" },
    ],
    landingChipsAnchor:        'landingAgent',  // 'landingAgent' | 'chatbox'
    landingChipsAnchorPadding: 8,               // gap in px (default 8)
    landingChipsOrientation:   'row',           // 'row' | 'column'
    landingChipsShape:         'round',         // 'round' | 'rect'
    onMessage:  (text) => console.log('user sent:', text),
    onResponse: (text) => console.log('AI replied:', text),
    placeholder: 'Ask ConvEngine…',
    renderers: [myRenderer],
    showAudit:             false,
    showDarkModeLightMode: false,
    showEngineStatus:      true,
    showFeedback:          true,
    showHeaderDot:         true,
    showLandingAvatar:     true,
    showLandingSubtitle:   true,
    showLayoutPicker:      true,
    showMaximize:          true,
    showMinimize:          true,
    showNewChat:           true,
    showTransportBadge:    false,
    subtitle:    "Ask me anything — I'll do my best to help.",
    title:       'ConvEngine Assistant',
  }}
  theme={{
    'color-accent':        '#6366f1',
    'color-accent-hover':  '#4f46e5',
    'panel-width':         '460px',
    'panel-height':        '740px',
    'sidepanel-width':     '400px',
    'bg-panel':            '#ffffff',
    'bg-bubble-user':      '#6366f1',
    'bg-bubble-agent':     '#f1f5f9',
    'font-family':         '"Inter", sans-serif',
  }}
/>`
              } />
              <Tip color="blue" icon="✂️" title="Minimal starter">
                Just need the basics? Here&apos;s the shortest possible usage:
              </Tip>
              <CodeBlock lang="jsx" code={`<ConvEngineChat\n  mode="panel"\n  config={{ apiHost: 'http://localhost:8080' }}\n/>`} />
              <Tip color="green" icon="🔁" title="Mode switching at runtime">
                Pass <code className="font-mono text-xs bg-emerald-100 px-1 rounded">onModeChange</code> to react when the user switches modes from the header picker — the conversation state is preserved.
              </Tip>
            </DocCardBody>
          </DocCard>

          {/* ── Component Props ── */}
          <DocCard id="props">
            <SectionHeader gradient="bg-gradient-to-r from-violet-500 to-purple-600" icon="🧩" title="Component Props" subtitle="All props accepted by <ConvEngineChat />" />
            <DocCardBody>
              <PropsTable>
                <PropRow prop="mode"         type='"panel"|"fullscreen"|"sidepanel"' defaultVal='"panel"'    description='Rendering mode. panel = floating FAB card, fullscreen = fills parent, sidepanel = full-height edge drawer.' />
                <PropRow prop="position"     type='"bottom"|"top"'                  defaultVal='"bottom"'   description='Vertical anchor for panel mode FAB and card.' />
                <PropRow prop="align"        type='"right"|"left"'                  defaultVal='"right"'    description='Horizontal anchor for panel mode and sidepanel side.' />
                <PropRow prop="config"       type='object'                          defaultVal='{}'         description='Configuration bag — see config Object below.' />
                <PropRow prop="theme"        type='object'                          defaultVal='{}'         description='CSS custom-property overrides. Keys auto-prefixed with --ce-.' />
                <PropRow prop="onModeChange" type='function'                        defaultVal='undefined'  description='Called with the new mode string when the user switches mode from the header picker.' />
              </PropsTable>
            </DocCardBody>
          </DocCard>

          {/* ── config Object ── */}
          <DocCard id="config">
            <SectionHeader gradient="bg-gradient-to-r from-orange-500 to-amber-500" icon="⚙️" title="config Object" subtitle="Passed as config={{ ... }} to <ConvEngineChat />" />
            <DocCardBody>
              <Tip color="amber" icon="🔒" title="Security note">
                <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">apiHost</code> is called from the browser. Make sure your ConvEngine backend has CORS enabled for your frontend origin.
              </Tip>
              <PropsTable>
                {/* ── A ── */}
                <PropRow prop="agentIconBg"            type='string | { light, dark }'  defaultVal='undefined'  description='Agent avatar background. Defaults to a transparent tint of the agent bubble bg. Overrides --ce-avatar-agent-bg.' />
                <PropRow prop="agentIconColor"         type='string | { light, dark }'  defaultVal='undefined'  description='Agent avatar icon/text color. Defaults to solid bubbleAgentBg when set; otherwise secondary text color. Overrides --ce-avatar-agent-color.' />
                <PropRow prop="apiEndpoints"           type='object'   defaultVal='undefined'     description='Override individual endpoint paths. Keys: message, feedback, audit. Each is a path ("/api/v1/message") or full URL. Unspecified keys fall back to {apiHost}/api/v1/conversation/{name}. See Backend Routes section.' />
                <PropRow prop="apiHost"                type='string'   defaultVal='""'            description='Base URL of your backend. Omit for same-origin servers. Pass a full URL (e.g. "http://localhost:8080") for a separate backend.' />
                {/* ── B ── */}
                <PropRow prop="bubbleAgentBg"          type='string | { light, dark }'  defaultVal='undefined'  description='Assistant bubble background. Overrides --ce-bg-bubble-agent.' />
                <PropRow prop="bubbleAgentText"        type='string | { light, dark }'  defaultVal='undefined'  description='Assistant bubble text color. Overrides --ce-text-bubble-agent.' />
                <PropRow prop="bubbleUserBg"           type='string | { light, dark }'  defaultVal='undefined'  description='User bubble background. Plain string = both modes; { light, dark } for per-theme. Overrides --ce-bg-bubble-user.' />
                <PropRow prop="bubbleUserText"         type='string | { light, dark }'  defaultVal='undefined'  description='User bubble text color. Overrides --ce-text-bubble-user.' />
                {/* ── C ── */}
                <PropRow prop="composerBg"             type='string | { light, dark }'  defaultVal='undefined'  description='Composer input area background. Overrides --ce-bg-composer.' />
                <PropRow prop="conversationId"         type='string'   defaultVal='undefined'     description='Resume an existing conversation by ID.' />
                {/* ── D ── */}
                <PropRow prop="defaultDark"            type='boolean'                   defaultVal='false'      description='Seed the widget in dark mode on first render.' />
                {/* ── I ── */}
                <PropRow prop="icons"                  type='object'   defaultVal='{}'       description='Override any icon component. Each value must be a React component — see Custom Icons section.' />
                {/* ── L ── */}
                <PropRow prop="landingChips"           type='string[] | {chipText,chatText}[]'  defaultVal='null'  description='Suggestion chips on the landing screen. String array uses same text as label and message. Object array allows a separate chipText (visible) and chatText (sent).' />
                <PropRow prop="landingChipsAnchor"     type='"landingAgent" | "chatbox"'        defaultVal='"landingAgent"'  description='"landingAgent" places chips below the hero avatar. "chatbox" pins chips above the composer with content growing bottom→top (ChatGPT style).' />
                <PropRow prop="landingChipsAnchorPadding" type='number | string'               defaultVal='8'     description='Gap in px between the anchor and the chips. Pass a number (8) or CSS string ("8px"). Default 8px.' />
                <PropRow prop="landingChipsOrientation" type='"row" | "column"'               defaultVal='"row"'  description='Layout direction of the chips container.' />
                <PropRow prop="landingChipsShape"      type='"round" | "rect"'                defaultVal='"round"' description='Border-radius style — pill (round) or card (rect).' />
                {/* ── O ── */}
                <PropRow prop="onMessage"              type='function' defaultVal='undefined'  description='(text: string) => void — fired when the user sends a message.' />
                <PropRow prop="onResponse"             type='function' defaultVal='undefined'  description='(text: string) => void — fired when an assistant response arrives.' />
                {/* ── P ── */}
                <PropRow prop="panelBg"                type='string | { light, dark }'  defaultVal='undefined'  description='Chat panel background color. Overrides --ce-bg-panel.' />
                <PropRow prop="placeholder"            type='string'   defaultVal='"Ask ConvEngine…"'  description='Composer input placeholder text.' />
                {/* ── R ── */}
                <PropRow prop="renderers"              type='Array'    defaultVal='[]'       description='Custom renderer providers injected before built-ins.' />
                {/* ── S ── */}
                <PropRow id="config-showAudit"             prop="showAudit"             type='boolean'  defaultVal='false'     description='Show the audit trail side panel (fullscreen only).' />
                <PropRow id="config-showDarkModeLightMode" prop="showDarkModeLightMode" type='boolean'  defaultVal='false'     description='Show the dark/light mode toggle button in the header.' />
                <PropRow id="config-showEngineStatus"      prop="showEngineStatus"      type='boolean'  defaultVal='true'      description='Show the engine status bar (intent, state, response time) in fullscreen and sidepanel modes.' />
                <PropRow id="config-showFeedback"          prop="showFeedback"          type='boolean'  defaultVal='true'      description='Show 👍👎 feedback buttons under assistant messages.' />
                <PropRow id="config-showHeaderDot"         prop="showHeaderDot"         type='boolean'  defaultVal='true'      description='Show the pulsing accent dot next to the header title.' />
                <PropRow id="config-showLandingAvatar"     prop="showLandingAvatar"     type='boolean'  defaultVal='true'      description='Show the bot avatar icon on the landing screen.' />
                <PropRow id="config-showLandingSubtitle"   prop="showLandingSubtitle"   type='boolean'  defaultVal='true'      description='Show the subtitle text on the landing screen.' />
                <PropRow id="config-showLayoutPicker"      prop="showLayoutPicker"      type='boolean'  defaultVal='true'      description='Show the Chat View Switcher button in the header (panel mode only).' />
                <PropRow id="config-showMaximize"          prop="showMaximize"          type='boolean'  defaultVal='true'      description='Show the Expand to Center (maximize) button in the panel header.' />
                <PropRow id="config-showMinimize"          prop="showMinimize"          type='boolean'  defaultVal='true'      description='Show the Minimize button in the panel header.' />
                <PropRow id="config-showNewChat"           prop="showNewChat"           type='boolean'  defaultVal='true'      description='Show the New Chat button in the header (panel and fullscreen modes).' />
                <PropRow id="config-showTransportBadge"    prop="showTransportBadge"    type='boolean'  defaultVal='false'     description='Show a REST / SSE / STOMP transport badge pill in the chat header. Works in all modes (panel, sidepanel, fullscreen). Independent of streaming — shows REST when stream is off, SSE or STOMP (green) when stream is on. Useful for demos and debugging.' />
                {/* ── T ── */}
                <PropRow prop="subtitle"               type='string'   defaultVal={"\"Ask me anything \u2014 I'll do my best to help.\""} description='Landing screen subtitle shown below the title.' />
                <PropRow prop="title"                  type='string'   defaultVal='"ConvEngine Assistant"'  description='Header title and landing screen heading.' />
                {/* ── U ── */}
                <PropRow prop="userIconBg"             type='string | { light, dark }'  defaultVal='undefined'  description='User avatar background. Defaults to a transparent tint of the accent color. Overrides --ce-avatar-user-bg.' />
                <PropRow prop="userIconColor"          type='string | { light, dark }'  defaultVal='undefined'  description='User avatar icon/text color. Defaults to the accent color. Overrides --ce-avatar-user-color.' />
              </PropsTable>
            </DocCardBody>
          </DocCard>

          {/* ── Backend Routes ── */}
          <DocCard id="backend">
            <SectionHeader gradient="bg-gradient-to-r from-emerald-500 to-teal-600" icon="🔌" title="Backend Routes" subtitle="Default paths and how to override them with apiEndpoints" />
            <DocCardBody>
              <Tip color="green" icon="💡" title="Same-origin? Just omit apiHost">
                When your chat widget and API server are on the same domain, you don&apos;t need <code className="font-mono text-xs bg-emerald-100 px-1 rounded">apiHost</code> at all — it defaults to the page origin automatically.
              </Tip>

              {/* Default routes table */}
              <div>
                <p><span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Default routes</span> <span className="text-xs font-bold text-slate-500 tracking-wider mb-2">(no apiEndpoints needed)</span></p>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-xs uppercase text-slate-400 tracking-wider">
                        <th className="px-4 py-3 text-left font-bold">Method</th>
                        <th className="px-4 py-3 text-left font-bold">Default path</th>
                        <th className="px-4 py-3 text-left font-bold">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 bg-white">
                      {[
                        ['POST', '/api/v1/conversation/message', 'Send user message, receive assistant response'],
                        ['POST', '/api/v1/conversation/feedback', 'Submit 👍 / 👎 feedback on a message'],
                        ['GET',  '/api/v1/conversation/audit/:conversationId', 'Fetch the full conversation audit trail'],
                      ].map(([method, path, desc]) => (
                        <tr key={path} className="hover:bg-emerald-50/30">
                          <td className="px-4 py-2.5">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${method === 'GET' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'}`}>{method}</span>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-xs text-indigo-600 font-semibold">{path}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Same-origin example */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Same-origin server (Express / Hapi / Fastify)</p>
                <CodeBlock lang="js" code={`// Express — register default paths\napp.post('/api/v1/conversation/message',  messageHandler);\napp.post('/api/v1/conversation/feedback', feedbackHandler);\napp.get( '/api/v1/conversation/audit/:conversationId', auditHandler);`} />
                <CodeBlock lang="jsx" code={`// No apiHost or apiEndpoints needed\n<ConvEngineChat config={{}} />`} />
              </div>

              {/* apiEndpoints override */}
              <div>
                <p><span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Custom route paths — </span> <span className="text-xs font-bold text-slate-500 tracking-wider mb-2">apiEndpoints </span></p>
                <p className="text-sm text-slate-600 mb-2">Override only the routes that differ from the defaults. Unspecified keys keep their default paths.</p>
                <CodeBlock lang="js" code={`// Express — your own paths\napp.post('/api/v1/message',  messageHandler);\napp.post('/api/v1/feedback', feedbackHandler);\napp.get( '/api/v1/audit/:conversationId', auditHandler);`} />
                <CodeBlock lang="jsx" code={`<ConvEngineChat\n  config={{\n    apiEndpoints: {\n      message:  '/api/v1/message',\n      feedback: '/api/v1/feedback',\n      audit:    '/api/v1/audit',  // /:conversationId appended automatically\n    },\n  }}\n/>`} />
              </div>

              {/* Cross-origin */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cross-origin backend</p>
                <CodeBlock lang="jsx" code={`// Separate backend server\n<ConvEngineChat\n  config={{\n    apiHost: 'http://localhost:8080',\n  }}\n/>\n\n// Separate backend + custom paths\n<ConvEngineChat\n  config={{\n    apiHost: 'http://localhost:8080',\n    apiEndpoints: {\n      message: 'http://localhost:8080/api/v1/message',\n    },\n  }}\n/>`} />
              </div>

              {/* Request body */}
              <Tip color="blue" icon="📦" title="POST /message request body">
                <code className="block font-mono text-xs mt-1 whitespace-pre-wrap">{`{\n  "conversationId": "abc-123",\n  "message": "I want to know about the pro plan",\n  "reset": false,\n  "inputParams": {}\n}`}</code>
              </Tip>
            </DocCardBody>
          </DocCard>

          {/* ── Streaming (SSE / STOMP) ── */}
          <DocCard id="stream">
            <SectionHeader gradient="bg-gradient-to-r from-green-500 to-teal-500" icon="📡" title="Streaming (SSE / STOMP)" subtitle="Real-time progress text and audit updates via Server-Sent Events or WebSocket" />
            <DocCardBody>
              <Tip color="green" icon="💡" title="How streaming works">
                When <code className="font-mono text-xs bg-emerald-100 px-1 rounded">stream.enabled</code> is true the widget opens a
                persistent SSE or STOMP connection to <code className="font-mono text-xs bg-emerald-100 px-1 rounded">/api/v1/conversation/stream/&#123;conversationId&#125;</code>.
                Each event bumps <code className="font-mono text-xs bg-emerald-100 px-1 rounded">auditRevision</code> (triggering an audit
                refetch) and <code className="font-mono text-xs bg-emerald-100 px-1 rounded">VERBOSE</code> events surface as animated progress
                text in the typing indicator. <code className="font-mono text-xs bg-emerald-100 px-1 rounded">ENGINE_RETURN</code> / <code className="font-mono text-xs bg-emerald-100 px-1 rounded">ASSISTANT_OUTPUT</code> clear the progress text smoothly.
              </Tip>

              <PropsTable>
                <PropRow id="config-stream.enabled" prop="stream.enabled"   type='boolean'             defaultVal='false'   description='Enable streaming. Off by default — REST-only behaviour is preserved when false.' />
                <PropRow prop="stream.transport" type='"sse" | "stomp"'     defaultVal='"sse"'   description='SSE uses a simple EventSource connection. STOMP uses SockJS + @stomp/stompjs (must be on globalThis).' />
                <PropRow prop="stream.wsBase"    type='string'              defaultVal='apiHost' description='STOMP only. The base URL of your WebSocket server — the library appends /ws-convengine to form the SockJS connection URL. Example: wsBase "http://localhost:8080" → connects to "http://localhost:8080/ws-convengine". Omit when the WS server is on the same host as apiHost.' />
              </PropsTable>

              <Tip color="green" icon="🚀" title="Live mock — test without a real backend">
                Copy the file below, run it with <code className="font-mono text-xs bg-emerald-100 px-1 rounded">node mock-sse-server.mjs</code> (Node 18+, no dependencies),
                then set <code className="font-mono text-xs bg-emerald-100 px-1 rounded">apiHost: 'http://localhost:9000'</code> and toggle
                <code className="font-mono text-xs bg-emerald-100 px-1 rounded">stream.enabled</code> on in the Playground.
                You will see the four progress steps appear in the typing indicator, then the echo reply arrive.
              </Tip>

              <CodeBlock lang="jsx" code={`// ── SSE (Server-Sent Events) ────────────────────────────────────\n// The widget opens EventSource to:\n//   GET {apiHost}/api/v1/conversation/stream/{conversationId}\n<ConvEngineChat\n  config={{\n    apiHost: 'http://localhost:9000',  // your backend\n    stream: { enabled: true, transport: 'sse' },\n    showTransportBadge: true,  // shows green 'SSE' badge in header\n  }}\n/>\n\n// ── STOMP (WebSocket) ────────────────────────────────────────────\n// wsBase is your WS server root. The library appends /ws-convengine.\n// e.g. wsBase 'http://localhost:8080' → connects to:\n//      http://localhost:8080/ws-convengine  (SockJS)\n// Then subscribes to STOMP topic:\n//   /topic/convengine/audit/{conversationId}\n// Install first: npm install @stomp/stompjs sockjs-client\n// Then in app entry: globalThis.StompJs = StompJs; globalThis.SockJS = SockJS;\n<ConvEngineChat\n  config={{\n    apiHost: 'http://localhost:8080',\n    stream: {\n      enabled:   true,\n      transport: 'stomp',\n      wsBase:    'http://localhost:8080', // optional — defaults to apiHost\n    },\n    showTransportBadge: true,\n  }}\n/>`} />

              <div className="rounded-xl border border-green-100 bg-green-50/60 p-4 space-y-2">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wider">mock-sse-server.mjs — zero dependencies, Node 18+</p>
                <p className="text-[11px] text-slate-500 mb-1">Save as <code className="font-mono bg-green-50 px-1 rounded">mock-sse-server.mjs</code> and run <code className="font-mono bg-green-50 px-1 rounded">node mock-sse-server.mjs</code>. Point the widget at <code className="font-mono bg-green-50 px-1 rounded">http://localhost:9000</code>.</p>
                <CodeBlock lang="js" code={`// mock-sse-server.mjs
import http from 'node:http';

const registry = new Map(); // conversationId → Set<response>

function sse(res, event, data) {
  res.write('event: ' + event + '\\ndata: ' + JSON.stringify(data) + '\\n\\n');
}

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, 'http://localhost');

  // GET /api/v1/conversation/stream/:conversationId
  if (req.method === 'GET' && url.pathname.startsWith('/api/v1/conversation/stream/')) {
    const id = url.pathname.split('/').pop();
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    if (!registry.has(id)) registry.set(id, new Set());
    registry.get(id).add(res);
    sse(res, 'CONNECTED', {});
    req.on('close', () => registry.get(id)?.delete(res));
    return;
  }

  // POST /api/v1/conversation/message
  if (req.method === 'POST' && url.pathname === '/api/v1/conversation/message') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      const { conversationId, message } = JSON.parse(body);
      const listeners = registry.get(conversationId) ?? new Set();
      // Fire 4 VERBOSE progress steps, 600 ms apart
      const steps = [
        '🔍 Parsing intent…',
        '🧠 Matching context…',
        '⚙️  Running step…',
        '✍️  Generating response…',
      ];
      steps.forEach((text, i) =>
        setTimeout(() =>
          listeners.forEach(r => sse(r, 'VERBOSE', { verbose: { text } })),
          (i + 1) * 600
        )
      );
      // After all steps, signal done and send REST reply
      const delay = steps.length * 600 + 400;
      setTimeout(() => {
        listeners.forEach(r => sse(r, 'ENGINE_RETURN', {}));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response: 'Echo: "' + message + '" — mock reply.' }));
      }, delay);
    });
    return;
  }

  res.writeHead(404); res.end();
}).listen(9000, () => console.log('Mock SSE server → http://localhost:9000'));`} />
              </div>

              <div className="rounded-xl border border-green-100 bg-green-50/60 p-4 space-y-2">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wider">SSE endpoint your server must implement</p>
                <code className="block font-mono text-xs text-emerald-700">GET /api/v1/conversation/stream/&#123;conversationId&#125;</code>
                <p className="text-xs text-slate-600">Keep the connection open and push named SSE events using the <code className="font-mono bg-green-50 px-1 rounded">event: STAGE</code> format. Any event increments the audit revision. <code className="font-mono bg-green-50 px-1 rounded">VERBOSE</code> events must have <code className="font-mono bg-green-50 px-1 rounded">{`{ verbose: { text: "..." } }`}</code> in data.</p>
                <CodeBlock lang="js" code={`// Node.js / Express SSE example\napp.get('/api/v1/conversation/stream/:id', (req, res) => {\n  res.set({\n    'Content-Type': 'text/event-stream',\n    'Cache-Control': 'no-cache',\n    'Connection': 'keep-alive',\n  });\n  res.write('event: CONNECTED\\ndata: {}\\n\\n');\n  // push VERBOSE events as steps run:\n  // res.write('event: VERBOSE\\ndata: {"verbose":{"text":"Thinking…"}}\\n\\n');\n  // push ENGINE_RETURN when done:\n  // res.write('event: ENGINE_RETURN\\ndata: {}\\n\\n');\n});`} />
              </div>

              <Tip color="amber" icon="⚠️" title="STOMP dependencies">
                STOMP transport requires <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">@stomp/stompjs</code> and <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">sockjs-client</code> to be available on <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">globalThis</code> (StompJs and SockJS). SSE has no extra dependencies.
              </Tip>
            </DocCardBody>
          </DocCard>

          {/* ── Dev Mode Guide ── */}
          <DocCard id="debug">
            <SectionHeader gradient="bg-gradient-to-r from-amber-500 to-orange-500" icon="🐞" title="Dev Mode Guide" subtitle="Debug flags for local development — all default false, zero cost in production" />
            <DocCardBody>
              <Tip color="amber" icon="⚠️" title="Safe to ship">
                All <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">debug*</code> flags default to <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">false</code>. When
                false, no extra DOM is rendered and there is no runtime cost. You can leave them in your config and flip them on locally
                without ever reaching production.
              </Tip>

              <PropsTable>
                <PropRow prop="debugShowVerbose"    type='boolean' defaultVal='false' description='Always render the “Agent is thinking…” typing indicator without sending a message. Useful for previewing the typing indicator animation and progress text styles.' />
                <PropRow prop="debugShowPayload"    type='boolean' defaultVal='false' description='Show the raw response payload in a monospace block below every assistant bubble. JSON is auto pretty-printed. Essential when developing custom renderers to see exactly what the backend returns.' />
                <PropRow prop="debugShowRenderer"   type='boolean' defaultVal='false' description='Show a green chip on every assistant bubble with the matched renderer key (e.g. “default”, “faq-answer”, your custom key, or “error”). Use this to verify renderer routing without the audit panel.' />
                <PropRow prop="debugShowTimestamps" type='boolean' defaultVal='false' description='Show an HH:mm:ss chip on every bubble (both user and assistant). Useful for timing analysis in demos.' />
                <PropRow prop="debugShowMessageId"  type='boolean' defaultVal='false' description='Show a truncated bubble id chip on every bubble. Useful for correlating React state with rendered DOM during development.' />
                <PropRow prop="debugSimulateDelay"  type='number'  defaultVal='0'     description='Artificial delay in ms before every API response. Set to 0 to disable. Use to preview the typing indicator animation and loading states without a slow real backend.' />
                <PropRow prop="debugSimulateError"  type='boolean' defaultVal='false' description='Force every send to return an error bubble instead of calling the API. Use to preview error bubble styling and test recovery flows without a failing backend.' />
                <PropRow prop="debugHighlightRenderers" type='boolean' defaultVal='false' description='Add a dashed outline around every message bubble — amber for user, blue for agent. Use to verify renderer region boundaries and layout.' />
                <PropRow prop="debugDisableAnimations" type='boolean' defaultVal='false' description='Disable all CSS transitions and animations on the widget. Useful for screenshot testing or reducing visual noise while inspecting layout.' />
              </PropsTable>

              <CodeBlock lang="jsx" code={`<ConvEngineChat
  config={{
    apiHost: 'http://localhost:8080',

    // — turn on any combination during development —
    debugShowVerbose:        true,   // typing indicator always visible
    debugShowPayload:        true,   // raw payload block under each assistant bubble
    debugShowRenderer:       true,   // green chip: which renderer matched
    debugShowTimestamps:     true,   // HH:mm:ss on every bubble
    debugShowMessageId:      true,   // truncated id chip on every bubble
    debugSimulateDelay:      1500,   // 1.5 s artificial delay before response
    debugSimulateError:      true,   // always return an error bubble
    debugHighlightRenderers: true,   // dashed outline on every bubble
    debugDisableAnimations:  true,   // kill all transitions & animations
  }}
/>`} />

              <Tip color="blue" icon="💡" title="Renderer development workflow">
                Enable <code className="font-mono text-xs bg-blue-100 px-1 rounded">debugShowPayload</code> +
                <code className="font-mono text-xs bg-blue-100 px-1 rounded">debugShowRenderer</code> together while building a custom renderer.
                The payload block shows the exact JSON your renderer receives and the renderer chip confirms the routing key matched.
                No need to open DevTools.
              </Tip>

              <Tip color="green" icon="🚀" title="Preview without a backend">
                Enable <code className="font-mono text-xs bg-emerald-100 px-1 rounded">debugShowVerbose</code> to preview the typing indicator
                animation and progress text (<code className="font-mono text-xs bg-emerald-100 px-1 rounded">progressText</code> prop on the typing indicator)
                before you have a working SSE stream. Combine with <code className="font-mono text-xs bg-emerald-100 px-1 rounded">stream.enabled</code>
                and this demo’s mock SSE server to see the full flow.
              </Tip>
            </DocCardBody>
          </DocCard>

          {/* ── Timestamps & Dates ── */}
          <DocCard id="timestamps">
            <SectionHeader gradient="bg-gradient-to-r from-teal-500 to-cyan-500" icon="🕐" title="Timestamps &amp; Dates" subtitle="Time captions below bubbles and sticky date chips between day groups" />
            <DocCardBody>

              <Tip color="teal" icon="ℹ️" title="How sentAt is stamped">
                ConvEngine automatically records a <code className="font-mono text-xs bg-teal-100 px-1 rounded">sentAt</code> Unix-ms timestamp
                on every message the moment it enters the thread — both user messages (on send) and assistant messages (on arrival).
                You never need to set it manually; enabling <code className="font-mono text-xs bg-teal-100 px-1 rounded">showBubbleTime</code> or{' '}
                <code className="font-mono text-xs bg-teal-100 px-1 rounded">showDateSeparators</code> is all that&apos;s required.
              </Tip>

              {/* ── Bubble time caption ── */}
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">Bubble time caption</p>
              <PropsTable>
                <PropRow prop="showBubbleTime"   type="boolean" defaultVal="false"    description="Show a formatted time caption below every message bubble (both user and assistant). The caption is indented to align with the bubble edge, not the avatar." />
                <PropRow prop="bubbleTimeFormat" type="string"  defaultVal="'h:mm A'" description="Format string for the time caption. Built-in token-based formatter — no external library needed. See the token table below." />
                <PropRow prop="timeLabelBg"          type="string | { light, dark }" defaultVal="transparent"    description="Background fill of the time caption text. Accepts any CSS color or a light/dark object. CSS var: --ce-time-label-bg." />
                <PropRow prop="timeLabelColor"       type="string | { light, dark }" defaultVal="text-secondary" description="Text color of the time caption. CSS var: --ce-time-label-color." />
                <PropRow prop="timeLabelBorderColor" type="string | { light, dark }" defaultVal="transparent"    description="Border color around the time caption. CSS var: --ce-time-label-border." />
              </PropsTable>

              {/* ── Date separator chip ── */}
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">Date separator chip</p>
              <PropsTable>
                <PropRow prop="showDateSeparators"  type="boolean" defaultVal="false"  description="Insert a sticky date chip between messages from different calendar days. The chip uses CSS position: sticky so it stays pinned at the top of the scroll container as you scroll through a day's messages." />
                <PropRow prop="dateSeparatorFormat" type="string"  defaultVal="'auto'" description="Format string for the date chip label. Use 'auto' for smart Today/Yesterday/ddd, MMM D output, or supply any token string. See the token table below." />
                <PropRow prop="dateSeparatorShape"  type="'pill' | 'rect'" defaultVal="'pill'" description="Shape of the date separator chip. 'pill' gives a fully-rounded capsule (border-radius: 999px). 'rect' gives a subtle rectangle (border-radius: 6px) — useful when matching a squared-off UI." />
                <PropRow prop="dateLabelBg"          type="string | { light, dark }" defaultVal="accent-light"   description="Background of the date chip. Defaults to a tint of the accent color. CSS var: --ce-date-chip-bg." />
                <PropRow prop="dateLabelColor"       type="string | { light, dark }" defaultVal="accent"         description="Text color of the date chip. Defaults to the accent color. CSS var: --ce-date-chip-color." />
                <PropRow prop="dateLabelBorderColor" type="string | { light, dark }" defaultVal="transparent"    description="Border color of the date chip. CSS var: --ce-date-chip-border." />
              </PropsTable>

              {/* ── Format token reference ── */}
              <div className="mt-4 space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Format token reference</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Time tokens */}
                  <div className="rounded-xl border border-teal-100 overflow-hidden">
                    <div className="bg-teal-50 px-4 py-2 text-[11px] font-bold text-teal-700 uppercase tracking-wider">Time tokens — bubbleTimeFormat</div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider">
                          <th className="px-3 py-2 text-left font-bold">Token</th>
                          <th className="px-3 py-2 text-left font-bold">Meaning</th>
                          <th className="px-3 py-2 text-left font-bold">Example</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 bg-white text-xs">
                        {[
                          ['h',  '12-hour, no padding',   '2'],
                          ['hh', '12-hour, zero-padded',  '02'],
                          ['H',  '24-hour, no padding',   '14'],
                          ['HH', '24-hour, zero-padded',  '14'],
                          ['mm', 'Minutes, zero-padded',  '05'],
                          ['ss', 'Seconds, zero-padded',  '09'],
                          ['A',  'AM / PM uppercase',     'PM'],
                          ['a',  'am / pm lowercase',     'pm'],
                        ].map(([tok, meaning, ex]) => (
                          <tr key={tok} className="hover:bg-teal-50/30">
                            <td className="px-3 py-2"><code className="font-mono text-teal-700 font-semibold">{tok}</code></td>
                            <td className="px-3 py-2 text-slate-600">{meaning}</td>
                            <td className="px-3 py-2"><code className="font-mono text-slate-500">{ex}</code></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Date tokens */}
                  <div className="rounded-xl border border-cyan-100 overflow-hidden">
                    <div className="bg-cyan-50 px-4 py-2 text-[11px] font-bold text-cyan-700 uppercase tracking-wider">Date tokens — dateSeparatorFormat</div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider">
                          <th className="px-3 py-2 text-left font-bold">Token</th>
                          <th className="px-3 py-2 text-left font-bold">Meaning</th>
                          <th className="px-3 py-2 text-left font-bold">Example</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 bg-white text-xs">
                        {[
                          ['YYYY', 'Full 4-digit year',    '2026'],
                          ['YY',   '2-digit year',         '26'],
                          ['MMMM', 'Full month name',      'April'],
                          ['MMM',  'Short month name',     'Apr'],
                          ['MM',   'Month, zero-padded',   '04'],
                          ['M',    'Month number',         '4'],
                          ['dddd', 'Full weekday name',    'Thursday'],
                          ['ddd',  'Short weekday name',   'Thu'],
                          ['DD',   'Day, zero-padded',     '05'],
                          ['D',    'Day number',           '5'],
                          ["'auto'", 'Smart label',        'Today / Yesterday / Thu, Apr 23'],
                        ].map(([tok, meaning, ex]) => (
                          <tr key={tok} className="hover:bg-cyan-50/30">
                            <td className="px-3 py-2"><code className="font-mono text-cyan-700 font-semibold">{tok}</code></td>
                            <td className="px-3 py-2 text-slate-600">{meaning}</td>
                            <td className="px-3 py-2"><code className="font-mono text-slate-500">{ex}</code></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Common format recipe examples */}
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Common format recipes</div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white text-xs text-slate-400 uppercase tracking-wider">
                        <th className="px-4 py-2 text-left font-bold">Format string</th>
                        <th className="px-4 py-2 text-left font-bold">Output</th>
                        <th className="px-4 py-2 text-left font-bold">Style</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 bg-white text-xs">
                      {[
                        ["'h:mm A'",        '2:14 PM',               '12-hour (default)'],
                        ["'h:mm:ss A'",     '2:14:05 PM',            '12-hour with seconds'],
                        ["'hh:mm A'",       '02:14 PM',              '12-hour zero-padded'],
                        ["'HH:mm'",         '14:14',                 '24-hour / EU style'],
                        ["'H:mm'",          '14:14',                 '24-hour no padding'],
                        ["'HH:mm:ss'",      '14:14:05',              '24-hour with seconds'],
                        ["'auto'",          'Today / Yesterday / Thu, Apr 23', 'Smart date (default for dates)'],
                        ["'ddd, MMM D'",    'Thu, Apr 23',           'Day + month explicit'],
                        ["'MMM D, YYYY'",   'Apr 23, 2026',          'Long date with year'],
                        ["'DD/MM/YYYY'",    '23/04/2026',            'EU numeric date'],
                        ["'YYYY-MM-DD'",    '2026-04-23',            'ISO 8601'],
                        ["'dddd, MMMM D'",  'Thursday, April 23',    'Full day and month'],
                      ].map(([fmt, out, style]) => (
                        <tr key={fmt} className="hover:bg-slate-50">
                          <td className="px-4 py-2"><code className="font-mono text-indigo-600 font-semibold">{fmt}</code></td>
                          <td className="px-4 py-2"><code className="font-mono text-slate-700">{out}</code></td>
                          <td className="px-4 py-2 text-slate-500">{style}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── CSS variable reference ── */}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">CSS variable reference</p>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-xs uppercase text-slate-400 tracking-wider">
                        <th className="px-4 py-3 text-left font-bold">config prop</th>
                        <th className="px-4 py-3 text-left font-bold">CSS variable</th>
                        <th className="px-4 py-3 text-left font-bold">Default</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 bg-white">
                      {[
                        ['timeLabelBg',          '--ce-time-label-bg',     'transparent'],
                        ['timeLabelColor',        '--ce-time-label-color',  'var(--ce-text-secondary)'],
                        ['timeLabelBorderColor',  '--ce-time-label-border', 'transparent'],
                        ['dateLabelBg',           '--ce-date-chip-bg',      'var(--ce-color-accent-light)'],
                        ['dateLabelColor',        '--ce-date-chip-color',   'var(--ce-color-accent)'],
                        ['dateLabelBorderColor',  '--ce-date-chip-border',  'transparent'],
                      ].map(([prop, cssVar, def]) => (
                        <tr key={prop} className="hover:bg-teal-50/30">
                          <td className="px-4 py-2.5"><code className="font-mono text-xs text-indigo-600 font-semibold">{prop}</code></td>
                          <td className="px-4 py-2.5"><code className="font-mono text-xs text-pink-600">{cssVar}</code></td>
                          <td className="px-4 py-2.5 text-xs text-slate-500">{def}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Code examples ── */}
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">Example — 12-hour time + smart date separators</p>
              <CodeBlock lang="jsx" code={`<ConvEngineChat
  config={{
    apiHost: 'http://localhost:8080',

    showBubbleTime:      true,
    bubbleTimeFormat:    'h:mm A',        // → 2:14 PM

    showDateSeparators:  true,
    dateSeparatorFormat: 'auto',          // → Today / Yesterday / Thu, Apr 23
    dateSeparatorShape:  'pill',          // default — fully rounded capsule

    // optional: neutral gray chip that works in both themes
    dateLabelBg:    { light: 'rgba(0,0,0,0.06)',   dark: 'rgba(255,255,255,0.10)' },
    dateLabelColor: { light: '#475569',             dark: '#94a3b8' },
  }}
/>`} />

              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Example — 24-hour time + explicit date format (EU style)</p>
              <CodeBlock lang="jsx" code={`<ConvEngineChat
  config={{
    apiHost: 'http://localhost:8080',

    showBubbleTime:      true,
    bubbleTimeFormat:    'HH:mm',         // → 14:14

    showDateSeparators:  true,
    dateSeparatorFormat: 'DD/MM/YYYY',    // → 23/04/2026
    dateSeparatorShape:  'rect',          // squared chip — matches a flat UI
  }}
/>`} />

              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Example — time with seconds, full date label</p>
              <CodeBlock lang="jsx" code={`<ConvEngineChat
  config={{
    apiHost: 'http://localhost:8080',

    showBubbleTime:      true,
    bubbleTimeFormat:    'h:mm:ss A',     // → 2:14:05 PM

    showDateSeparators:  true,
    dateSeparatorFormat: 'dddd, MMMM D',  // → Thursday, April 23
    dateSeparatorShape:  'pill',

    // match accent to bubble color for a cohesive look
    dateLabelBg:    { light: 'rgba(99,102,241,0.10)', dark: 'rgba(99,102,241,0.20)' },
    dateLabelColor: { light: '#6366f1',                dark: '#818cf8' },
  }}
/>`} />

              {/* ── Tips ── */}
              <Tip color="teal" icon="💡" title="How 'auto' date format works">
                When <code className="font-mono text-xs bg-teal-100 px-1 rounded">dateSeparatorFormat</code> is <code className="font-mono text-xs bg-teal-100 px-1 rounded">'auto'</code>,
                the chip renders <strong>"Today"</strong> for the current calendar day, <strong>"Yesterday"</strong> for the previous day,
                and falls back to <strong>"ddd, MMM D"</strong> (e.g. "Thu, Apr 23") for all older dates.
                This matches the convention used by most messaging apps and requires zero configuration.
              </Tip>

              <Tip color="cyan" icon="📌" title="Sticky date chips — no JS scroll listeners">
                Date separator chips use CSS <code className="font-mono text-xs bg-cyan-100 px-1 rounded">position: sticky; top: 4px</code>
                inside the <code className="font-mono text-xs bg-cyan-100 px-1 rounded">.ce-thread</code> scroll container.
                Each chip stays pinned at the top of the viewport as you scroll through its day&apos;s messages,
                then gets pushed upward when the next day&apos;s chip arrives.
                No JavaScript scroll listeners or IntersectionObserver are involved.
              </Tip>

              <Tip color="blue" icon="🎨" title="Time caption alignment">
                The <code className="font-mono text-xs bg-blue-100 px-1 rounded">.ce-bubble-time</code> caption is
                indented by <code className="font-mono text-xs bg-blue-100 px-1 rounded">calc(--ce-avatar-size + 10px)</code>
                so it aligns with the bubble edge rather than the avatar.
                User captions are right-aligned; assistant captions are left-aligned.
                Override <code className="font-mono text-xs bg-blue-100 px-1 rounded">timeLabelColor</code> / <code className="font-mono text-xs bg-blue-100 px-1 rounded">timeLabelBg</code> to
                style it like a pill (add a background + border) or keep it as plain secondary text (default).
              </Tip>

            </DocCardBody>
          </DocCard>

          {/* ── Landing Chips ── */}
          <DocCard id="landing-chips">
            <SectionHeader gradient="bg-gradient-to-r from-indigo-500 to-purple-600" icon="💬" title="Landing Chips" subtitle="Suggestion chips displayed below the landing avatar — click to send as a user message" />
            <DocCardBody>
              <p className="text-sm text-slate-600 leading-relaxed">
                Landing chips let you pre-populate the empty-chat screen with common prompts. A chip fires as if the user typed and sent that text — the message bubble appears immediately and the backend receives the query.
              </p>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 space-y-3">
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">config props</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { prop: 'landingChips', type: 'string[] | {chipText,chatText}[]', def: 'null', desc: 'Array of chip values. Strings use the same text for both label and message; objects allow a separate visible label and a longer message.' },
                    { prop: 'landingChipsAnchor', type: '"landingAgent" | "chatbox"', def: '"landingAgent"', desc: '"landingAgent" places chips below the avatar (classic). "chatbox" pins them just above the composer with chips growing bottom→top (ChatGPT/Copilot style).' },
                    { prop: 'landingChipsAnchorPadding', type: 'number | string', def: '8', desc: 'Gap in px between the anchor and the chips. Pass a number (e.g. 12) or a CSS string (e.g. "12px"). Defaults to 8px.' },
                    { prop: 'landingChipsOrientation', type: '"row" | "column"', def: '"row"', desc: 'Layout direction of the chip row.' },
                    { prop: 'landingChipsShape', type: '"round" | "rect"', def: '"round"', desc: 'Border-radius style — pill (round) or card (rect).' },
                  ].map(({ prop, type, def, desc }) => (
                    <div key={prop} className="rounded-lg bg-white border border-indigo-100 p-3 space-y-1">
                      <code className="text-xs font-mono text-indigo-700 font-bold">{prop}</code>
                      <p className="text-[10px] text-slate-400 font-mono">{type}</p>
                      <p className="text-[10px] text-slate-500">Default: <code className="bg-indigo-50 px-1 rounded">{def}</code></p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <CodeBlock lang="jsx" code={`<ConvEngineChat\n  config={{\n    // ── Plain text chips ─────────────────────────────\n    landingChips: [\n      "Show recent activity",\n      "How do I reset my password?",\n      "Contact support",\n    ],\n\n    // ── Or label + longer message ───────────────────\n    landingChips: [\n      { chipText: "📊 Activity",  chatText: "Show my recent account activity" },\n      { chipText: "🔑 Password",  chatText: "How do I reset my password?" },\n      { chipText: "🛟 Support",   chatText: "I need to contact customer support" },\n    ],\n\n    landingChipsAnchor:        "landingAgent",  // "landingAgent" | "chatbox"\n    landingChipsAnchorPadding: 8,               // gap in px (default 8)\n    landingChipsOrientation:   "row",           // "row" | "column"\n    landingChipsShape:         "round",         // "round" | "rect"\n  }}\n/>`} />
            </DocCardBody>
          </DocCard>

          {/* ── Per-Theme Color API ── */}
          <DocCard id="colors">
            <SectionHeader gradient="bg-gradient-to-r from-violet-500 to-fuchsia-600" icon="🌗" title="Per-Theme Color API" subtitle="Different colors for light and dark mode — one config, two appearances" />
            <DocCardBody>
              <Tip color="violet" icon="💡" title="The concept — iOS Color Assets for the web">
                Every color config prop accepts <strong>two shapes</strong>: a plain string (applies to both light and dark) or a{' '}
                <code className="font-mono text-xs bg-violet-100 px-1 rounded">{`{ light, dark }`}</code>{' '}
                object that lets you specify a different value per theme. ConvEngine reads the active theme at render time and automatically picks the right variant.
              </Tip>
              <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4 space-y-3">
                <p className="text-xs font-bold text-violet-700 uppercase tracking-wider">Accepted shapes</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white border border-violet-100 p-3 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plain string — same in both modes</p>
                    <code className="block text-xs font-mono text-indigo-600">bubbleUserBg: &quot;#6366f1&quot;</code>
                    <p className="text-xs text-slate-500">One value. ConvEngine uses it for both ☀️ light and 🌙 dark.</p>
                  </div>
                  <div className="rounded-lg bg-white border border-violet-100 p-3 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Object — one value per theme</p>
                    <code className="block text-xs font-mono text-indigo-600">bubbleUserBg: {`{ light: "#6366f1", dark: "..." }`}</code>
                    <p className="text-xs text-slate-500">ConvEngine picks <code className="font-mono bg-violet-50 px-1 rounded">light</code> in ☀️, <code className="font-mono bg-violet-50 px-1 rounded">dark</code> in 🌙.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Color props &amp; their CSS variable targets</p>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-xs uppercase text-slate-400 tracking-wider">
                        <th className="px-4 py-3 text-left font-bold">config prop</th>
                        <th className="px-4 py-3 text-left font-bold">Overrides CSS var</th>
                        <th className="px-4 py-3 text-left font-bold">What it colors</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 bg-white">
                      {[
                        ['bubbleUserBg',    '--ce-bg-bubble-user',       'User message bubble — fill or gradient'],
                        ['bubbleUserText',  '--ce-text-bubble-user',     'User message bubble text'],
                        ['bubbleAgentBg',   '--ce-bg-bubble-agent',      'Assistant message bubble — fill or gradient'],
                        ['bubbleAgentText', '--ce-text-bubble-agent',    'Assistant message bubble text'],
                        ['panelBg',         '--ce-bg-panel',             'Chat panel / sidepanel background'],
                        ['composerBg',      '--ce-bg-composer',          'Composer (input area) background'],
                        ['userIconBg',      '--ce-avatar-user-bg',       'User avatar background (default: tint of accent)'],
                        ['userIconColor',   '--ce-avatar-user-color',    'User avatar icon color (default: accent color)'],
                        ['agentIconBg',     '--ce-avatar-agent-bg',      'Agent avatar background (default: tint of agent bubble bg)'],
                        ['agentIconColor',  '--ce-avatar-agent-color',   'Agent avatar icon color (default: bubbleAgentBg if set, else secondary text)'],
                      ].map(([prop, cssVar, desc]) => (
                        <tr key={prop} className="hover:bg-violet-50/40">
                          <td className="px-4 py-2.5"><code className="font-mono text-xs text-indigo-600 font-semibold">{prop}</code></td>
                          <td className="px-4 py-2.5"><code className="font-mono text-xs text-pink-600">{cssVar}</code></td>
                          <td className="px-4 py-2.5 text-sm text-slate-600">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <CodeBlock lang="jsx" code={`<ConvEngineChat\n  config={{\n    bubbleUserBg: {\n      light: "#6366f1",\n      dark:  "linear-gradient(90deg, rgba(37,99,235,0.55) 0%, rgba(96,165,250,0.38) 100%)",\n    },\n    panelBg: { light: "#ffffff", dark: "#1a1a1a" },\n  }}\n/>`} />
              <Tip color="green" icon="✅" title="Fallback resolution order">
                <code className="font-mono text-xs bg-emerald-100 px-1 rounded">dark ?? light</code> in dark mode —{' '}
                <code className="font-mono text-xs bg-emerald-100 px-1 rounded">light ?? dark</code> in light mode — then the built-in CSS token if neither is set.
              </Tip>
            </DocCardBody>
          </DocCard>

          {/* ── Theme Tokens ── */}
          <DocCard id="theme">
            <SectionHeader gradient="bg-gradient-to-r from-pink-500 to-rose-500" icon="🎨" title="Theme Tokens" subtitle="Re-skin the widget without touching CSS files" />
            <DocCardBody>
              <Tip color="violet" icon="✨" title="How it works">
                Every visual token is a CSS custom property on <code className="font-mono text-xs bg-violet-100 px-1 rounded">.ce-chat-root</code>. Pass shorthand keys (auto-prefixed with <code className="font-mono text-xs bg-violet-100 px-1 rounded">--ce-</code>) or full variable names.
              </Tip>
              <CodeBlock lang="jsx" code={`<ConvEngineChat\n  theme={{\n    'color-accent':       '#6366f1',\n    'color-accent-hover': '#4f46e5',\n    'panel-width':        '480px',\n    'panel-height':       '700px',\n    'sidepanel-width':    '420px',\n    'font-family':        '"Inter", sans-serif',\n    '--ce-bg-panel':      '#0f172a',\n  }}\n/>`} />
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-xs uppercase text-slate-400 tracking-wider">
                      <th className="px-4 py-3 text-left font-bold">Token</th>
                      <th className="px-4 py-3 text-left font-bold">Default</th>
                      <th className="px-4 py-3 text-left font-bold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {[
                      ['--ce-color-accent',       '#6366f1',    'Primary accent — buttons, FAB, highlights'],
                      ['--ce-color-accent-hover',  '#4f46e5',   'Accent hover state'],
                      ['--ce-panel-width',         '460px',     'Width of the floating panel'],
                      ['--ce-panel-height',        '660px',     'Max-height of the floating panel'],
                      ['--ce-sidepanel-width',     '400px',     'Width of the side drawer'],
                      ['--ce-bg-panel',            '#ffffff',   'Panel / sidepanel background'],
                      ['--ce-bg-bubble-user',      '#6366f1',   'User message bubble fill'],
                      ['--ce-bg-bubble-agent',     '#f1f5f9',   'Assistant message bubble fill'],
                      ['--ce-avatar-user-bg',      'color-mix(accent 14%)', 'User avatar background (tint of accent)'],
                      ['--ce-avatar-user-color',   'var(--ce-color-accent)', 'User avatar icon color'],
                      ['--ce-avatar-agent-bg',     'color-mix(agentBubbleBg 30%)', 'Agent avatar background (tint of agent bubble bg)'],
                      ['--ce-avatar-agent-color',  '#64748b',   'Agent avatar icon color'],
                      ['--ce-font-family',         'system-ui', 'Font stack applied inside the widget'],
                    ].map(([t, d, desc]) => (
                      <tr key={t} className="hover:bg-pink-50/40">
                        <td className="px-4 py-2.5 font-mono text-xs text-pink-600 font-semibold">{t}</td>
                        <td className="px-4 py-2.5"><DefaultBadge val={d} /></td>
                        <td className="px-4 py-2.5 text-sm text-slate-600">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Tip color="blue" icon="🎯" title="Tailwind integration">
                Reference CSS tokens in <code className="font-mono text-xs bg-sky-100 px-1 rounded">tailwind.config.js</code>: <code className="font-mono text-xs bg-sky-100 px-1 rounded">{`colors: { brand: "var(--ce-color-accent)" }`}</code>
              </Tip>
            </DocCardBody>
          </DocCard>

          {/* ── Tailwind Integration ── */}
          <DocCard id="tailwind">
            <SectionHeader gradient="bg-gradient-to-r from-sky-500 to-cyan-500" icon="🌊" title="Tailwind Integration" subtitle="Make your app's colors follow the chat widget automatically" />
            <DocCardBody>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tailwind CSS is a utility-first styling library. Instead of writing custom CSS files, you style elements
                directly in JSX using short class names like <code className="font-mono text-xs bg-sky-100 px-1 rounded">bg-blue-500</code>,{' '}
                <code className="font-mono text-xs bg-sky-100 px-1 rounded">text-white</code>, or{' '}
                <code className="font-mono text-xs bg-sky-100 px-1 rounded">rounded-xl</code>.
              </p>
              <TailwindPlayground />
              <TailwindClassInputDemo />
              <p className="text-sm text-slate-600 leading-relaxed mt-2">
                ConvEngine stores its active theme colors as <strong>CSS variables</strong> on the page — e.g.{' '}
                <code className="font-mono text-xs bg-sky-100 px-1 rounded">--ce-color-accent</code>.
                Point a Tailwind color alias at that variable so <code className="font-mono text-xs bg-sky-100 px-1 rounded">bg-brand</code>{' '}
                always matches the chat widget.
              </p>
              <CodeBlock lang="js" code={`// tailwind.config.js\nmodule.exports = {\n  content: ['./src/**/*.{js,jsx,ts,tsx}'],\n  theme: {\n    extend: {\n      colors: {\n        brand:         'var(--ce-color-accent)',\n        'brand-hover': 'var(--ce-color-accent-hover)',\n        'chat-user':   'var(--ce-bg-bubble-user)',\n        'chat-agent':  'var(--ce-bg-bubble-agent)',\n        'chat-panel':  'var(--ce-bg-panel)',\n      },\n    },\n  },\n};`} />
              <CodeBlock lang="jsx" code={`export function AskButton({ onClick }) {\n  return (\n    <button\n      onClick={onClick}\n      className="bg-brand hover:bg-brand-hover text-white\n                 font-semibold px-5 py-2.5 rounded-xl transition-colors"\n    >\n      Ask ConvEngine →\n    </button>\n  );\n}`} />
              <TailwindNotificationPreview />
              <TailwindSidebarPreview />
              <Tip color="amber" icon="⚠️" title="Using Tailwind v4?">
                In Tailwind v4, skip <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">tailwind.config.js</code> and
                add <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">{`@theme { --color-brand: var(--ce-color-accent); }`}</code> to your CSS instead.
              </Tip>
            </DocCardBody>
          </DocCard>

          {/* ── Custom Renderers ── */}
          <DocCard id="renderers">
            <SectionHeader gradient="bg-gradient-to-r from-teal-500 to-cyan-600" icon="🔌" title="Custom Renderers" subtitle="Intercept assistant messages and render rich interactive UI" />
            <DocCardBody>
              <div className="flex flex-wrap gap-2">
                <FeatureChip label="Selection / Radio" color="teal" />
                <FeatureChip label="Multi-select"      color="sky" />
                <FeatureChip label="Inline form"        color="violet" />
                <FeatureChip label="File upload"        color="orange" />
                <FeatureChip label="Confirm step"       color="emerald" />
                <FeatureChip label="✈️ FlightCard"       color="indigo" />
                <FeatureChip label="📦 OrderTracker"     color="pink" />
                <FeatureChip label="🛍️ ProductRecommendation" color="amber" />
                <FeatureChip label="📊 DataTable (hideBubble)" color="emerald" />
              </div>
              <Tip color="green" icon="🏗️" title="How the registry works">
                Providers are sorted by <code className="font-mono text-xs bg-emerald-100 px-1 rounded">priority</code> (highest first). The first whose <code className="font-mono text-xs bg-emerald-100 px-1 rounded">match(ctx)</code> returns true wins. Built-ins have priority 100.
              </Tip>
              <CodeBlock lang="jsx" code={`const myProvider = {\n  key:      'SelectionPrompt',\n  priority: 200,\n  match:    (ctx) => ctx.effectiveType === 'SelectionPrompt',\n  Component({ payload, actions }) {\n    const [selected, setSelected] = useState(null);\n    return (\n      <div className="ce-interactive-card">\n        <p>{payload.question}</p>\n        {payload.options.map((o) => (\n          <label key={o.value}>\n            <input type="radio" value={o.value}\n              checked={selected === o.value}\n              onChange={() => setSelected(o.value)} />\n            {o.label}\n          </label>\n        ))}\n        <button disabled={!selected}\n          onClick={() => actions.submit(selected, { choice: selected })}>\n          Continue →\n        </button>\n      </div>\n    );\n  },\n};\n\n<ConvEngineChat config={{ renderers: [myProvider] }} />`} />
              <RendererLiveDemo chatActionsRef={chatActionsRef} />
            </DocCardBody>
          </DocCard>

          {/* ── Actions API ── */}
          <DocCard id="actions">
            <SectionHeader gradient="bg-gradient-to-r from-indigo-500 to-blue-600" icon="⚡" title="Actions API" subtitle="Injected into every renderer Component as props.actions" />
            <DocCardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'actions.submit()',       color: 'indigo', desc: 'Add user bubble + send to backend' },
                  { name: 'actions.submitSilent()', color: 'violet', desc: 'Send to backend, no user bubble' },
                  { name: 'actions.appendBubble()', color: 'teal',   desc: 'Client-side bubble, no API call' },
                  { name: 'actions.prefillInput()', color: 'amber',  desc: 'Pre-fill composer for user editing' },
                ].map(({ name, color, desc }) => (
                  <div key={name} className={`rounded-xl p-3 border ${{
                    indigo: 'bg-indigo-50 border-indigo-100',
                    violet: 'bg-violet-50 border-violet-100',
                    teal:   'bg-teal-50 border-teal-100',
                    amber:  'bg-amber-50 border-amber-100',
                  }[color]}`}>
                    <code className="text-xs font-mono font-bold text-slate-700">{name}</code>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
              <CodeBlock lang="ts" code={`interface ChatActions {\n  submit(displayText: string, inputParams?: object): void;\n  submitSilent(inputParams: object): void;\n  appendBubble(text: string, role?: 'user' | 'assistant'): void;\n  prefillInput(text: string): void;\n}`} />
              <Tip color="pink" icon="🔁" title="Backward compat">
                <code className="font-mono text-xs bg-pink-100 px-1 rounded">onSubmit</code> is still passed as an alias for <code className="font-mono text-xs bg-pink-100 px-1 rounded">actions.submit</code> — old renderers keep working.
              </Tip>
            </DocCardBody>
          </DocCard>

          {/* ── Custom Icons ── */}
          <DocCard id="icons">
            <SectionHeader gradient="bg-gradient-to-r from-violet-500 to-indigo-600" icon="🎨" title="Custom Icons" subtitle="Swap any built-in icon with your own React component" />
            <DocCardBody>
              <Tip color="violet" icon="💡" title="How it works">
                Pass an <code className="font-mono text-xs bg-violet-100 px-1 rounded">icons</code> object inside <code className="font-mono text-xs bg-violet-100 px-1 rounded">config</code>.
                Each key maps to a named icon slot. Any icon you don&apos;t override keeps its default.
                Every component receives standard SVG props and <code className="font-mono text-xs bg-violet-100 px-1 rounded">className=&quot;ce-icon&quot;</code>.
              </Tip>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available icon slots</p>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-xs uppercase text-slate-400 tracking-wider">
                        <th className="px-4 py-3 text-left font-bold">Preview</th>
                        <th className="px-4 py-3 text-left font-bold">Key</th>
                        <th className="px-4 py-3 text-left font-bold">Slot</th>
                        <th className="px-4 py-3 text-left font-bold">Fill mode</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 bg-white">
                      {Object.entries(ICON_META).map(([key, meta]) => (
                        <tr key={key} className="hover:bg-indigo-50/40">
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100">
                              <SvgPreview innerSvg={DEFAULT_ICON_SVGS[key]} fill={meta.fill} size={20} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{key}</code>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{meta.where}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.fill ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                              {meta.fill ? 'filled' : 'stroked'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <CodeBlock lang="jsx" code={`function StarIcon(props) {\n  return (\n    <svg viewBox="0 0 24 24" fill="currentColor"\n      className="ce-icon" aria-hidden="true" {...props}>\n      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77\n               l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>\n    </svg>\n  );\n}\n\n<ConvEngineChat\n  config={{\n    icons: {\n      ChatBubbleIcon: StarIcon,\n      // AgentIcon: MyRobotIcon,\n      // UserIcon:  MyPersonIcon,\n    },\n  }}\n/>`} />
              <Tip color="amber" icon="⚠️" title="Sizing">
                Always omit <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">width</code> / <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">height</code> attributes — CSS handles sizing via <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 px-1 rounded">.ce-icon</code>.
              </Tip>
            </DocCardBody>
          </DocCard>

          {/* ── Hooks ── */}
          <DocCard id="hooks">
            <SectionHeader gradient="bg-gradient-to-r from-fuchsia-500 to-pink-600" icon="🪝" title="Hooks &amp; Context" subtitle="Access chat actions from any component inside the widget tree" />
            <DocCardBody>
              <Tip color="violet" icon="📌" title="Scope">
                <code className="font-mono text-xs bg-violet-100 px-1 rounded">useChatActions</code> only works inside components rendered within <code className="font-mono text-xs bg-violet-100 px-1 rounded">&lt;ConvEngineChat&gt;</code> — i.e. custom renderer components.
              </Tip>
              <CodeBlock lang="jsx" code={`import { useChatActions } from '@salilvnair/convengine-chat';\n\nfunction HelpButton() {\n  const { actions } = useChatActions();\n  return (\n    <button\n      className="ce-interactive-submit"\n      onClick={() => actions.submitSilent({ intent: 'help' })}\n    >\n      Get Help\n    </button>\n  );\n}`} />
            </DocCardBody>
          </DocCard>

        </div>
      </div>
      <BackToTop accentColor={settings.accentColor} />
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { ConvEngineChat }       from '@salilvnair/convengine-chat';
import { MetricCard }           from './components/demo/MetricCard.jsx';
import { RevenueChart }         from './components/demo/RevenueChart.jsx';
import { OrdersTable }          from './components/demo/OrdersTable.jsx';
import { ChannelsPanel }        from './components/demo/ChannelsPanel.jsx';
import { OrdersView }           from './components/demo/OrdersView.jsx';
import { AnalyticsView }        from './components/demo/AnalyticsView.jsx';
import { ProfileView }          from './components/demo/ProfileView.jsx';
import { ChatSettingsView }     from './components/chat/settings/ChatSettingsView.jsx';
import { ProfileDropdown }      from './components/demo/ProfileDropdown.jsx';
import { interactiveRenderers } from './components/chat/InteractiveRenderers.jsx';
import { METRICS, WEEKLY_REVENUE, RECENT_ORDERS, TOP_CHANNELS } from './data/dashboard.js';

/* ─────────────────────────────────────────────────────────────────────────────
   SVG Icons for landing tiles
───────────────────────────────────────────────────────────────────────────── */
function BrowserIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="3" width="20" height="15" rx="2" />
      <path d="M2 8h20" />
      <circle cx="5.5" cy="5.5" r=".7" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="5.5" r=".7" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="5.5" r=".7" fill="currentColor" stroke="none" />
      <path d="M8 22h8M12 18v4" />
    </svg>
  );
}

function ZapIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ChevronLeftIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 5l-5 5 5 5" />
    </svg>
  );
}

function DarkModeToggle({ darkMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex-shrink-0"
    >
      {darkMode ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Dashboard overview content
───────────────────────────────────────────────────────────────────────────── */
function DashboardContent() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back, Salil. Here&apos;s what&apos;s happening today.</p>
        </div>
        <span className="text-sm text-slate-400 dark:text-slate-500">April 29, 2026</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {METRICS.map((m) => <MetricCard key={m.id} {...m} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart data={WEEKLY_REVENUE} />
        </div>
        <ChannelsPanel channels={TOP_CHANNELS} />
      </div>

      <OrdersTable orders={RECENT_ORDERS} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Landing page
───────────────────────────────────────────────────────────────────────────── */
function LandingPage({ onSelect, darkMode, onToggleDark }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 flex flex-col">
      {/* Top bar */}
      <header className="bg-white/80 dark:bg-slate-900/90 backdrop-blur border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              CE
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">ConvEngine</span>
          </div>
          <DarkModeToggle darkMode={darkMode} onToggle={onToggleDark} />
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* CE badge */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-200">
            CE
          </div>
          <BrowserIcon className="w-10 h-10 text-indigo-300" />
          <ZapIcon className="w-10 h-10 text-violet-300" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mb-3">
          ConvEngine Chat
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md mx-auto mb-14">
          Embed a fully-featured AI chat widget into any React app — in minutes.
        </p>

        {/* Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Demo tile */}
          <button
            onClick={() => onSelect('demo')}
            className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-600 transition-all duration-300 p-8 text-left flex flex-col items-start gap-5 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/50 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors flex items-center justify-center">
              <BrowserIcon className="w-7 h-7 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Demo</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Explore a full analytics dashboard with ConvEngine Chat integrated as a floating widget or side panel.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 px-3 py-1 rounded-full transition-colors">
              Open Dashboard →
            </span>
          </button>

          {/* Quickstart tile */}
          <button
            onClick={() => onSelect('quickstart')}
            className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-violet-200 dark:hover:border-violet-600 transition-all duration-300 p-8 text-left flex flex-col items-start gap-5 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-900/50 group-hover:bg-violet-100 dark:group-hover:bg-violet-900 transition-colors flex items-center justify-center">
              <ZapIcon className="w-7 h-7 text-violet-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Quickstart</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Configure the chat widget, browse the full API reference, and grab copy-paste code snippets to ship fast.
              </p>
            </div>
            <span className="text-xs font-semibold text-violet-500 bg-violet-50 dark:bg-violet-900/50 group-hover:bg-violet-100 dark:group-hover:bg-violet-900 px-3 py-1 rounded-full transition-colors">
              Configure &amp; Ship →
            </span>
          </button>
        </div>
      </main>

      <footer className="text-center pb-8 text-xs text-slate-400 dark:text-slate-500">
        ConvEngine Chat SDK &mdash; v0.1.0
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Shared app shell (nav + content)
───────────────────────────────────────────────────────────────────────────── */
function AppShell({ title, accentClass = 'text-indigo-600 bg-indigo-50', tabs, activeTab, onTab, onBack, right, children, darkMode, onToggleDark }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40">
        <div className="px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo + back */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 flex-shrink-0 group"
            aria-label="Back to home"
          >
            <span className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              CE
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">{title}</span>
            <ChevronLeftIcon className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors ml-0.5" />
          </button>

          {/* Tabs */}
          {tabs && (
            <nav className="hidden md:flex items-center gap-1 text-sm flex-1 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTab(tab)}
                  className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
                    activeTab === tab ? accentClass : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          )}

          {/* Right slot */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {tabs && (
              <select
                className="md:hidden text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-400 dark:bg-slate-800 dark:text-slate-200"
                value={activeTab}
                onChange={(e) => onTab(e.target.value)}
              >
                {tabs.map((t) => <option key={t}>{t}</option>)}
              </select>
            )}
            {right}
            <DarkModeToggle darkMode={darkMode} onToggle={onToggleDark} />
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-6 py-8">
        {children}
        <div className="h-28" />
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Demo app  (Dashboard / Orders / Analytics / Profile)
───────────────────────────────────────────────────────────────────────────── */
const DEMO_TABS = ['Dashboard', 'Orders', 'Analytics', 'Profile'];

function DemoApp({ onBack, darkMode, onToggleDark }) {
  const [activeTab,   setActiveTab]   = useState('Dashboard');
  const [chatMode,    setChatMode]    = useState('panel');
  const [chatSettings, setChatSettings] = useState({
    showFeedback:          true,
    showAudit:             false,
    showDarkModeLightMode: true,
    accentColor:           '#6366f1',
  });

  const resolvedMode  = chatMode === 'fullscreen' ? 'fullscreen' : chatMode.startsWith('sidepanel') ? 'sidepanel' : 'panel';
  const resolvedAlign = chatMode === 'sidepanel-left' ? 'left' : 'right';

  return (
    <>
      <AppShell
        title="ConvEngine Demo"
        tabs={DEMO_TABS}
        activeTab={activeTab}
        onTab={setActiveTab}
        onBack={onBack}
        right={<ProfileDropdown onNavigate={(tab) => setActiveTab(tab)} />}
        darkMode={darkMode}
        onToggleDark={onToggleDark}
      >
        {activeTab === 'Dashboard'  && <DashboardContent />}
        {activeTab === 'Orders'     && <OrdersView />}
        {activeTab === 'Analytics'  && <AnalyticsView />}
        {activeTab === 'Profile'    && <ProfileView />}
      </AppShell>

      {/* Chat widget */}
      {resolvedMode !== 'fullscreen' && (
        <ConvEngineChat
          mode={resolvedMode}
          position="bottom"
          align={resolvedAlign}
          onModeChange={(m) => setChatMode(m === 'fullscreen' ? 'panel' : m)}
          config={{
            apiHost:               '',
            title:                 'ConvEngine Assistant',
            placeholder:           'Ask anything about your data…',
            showAudit:             chatSettings.showAudit,
            showFeedback:          chatSettings.showFeedback,
            showDarkModeLightMode: chatSettings.showDarkModeLightMode,
            defaultDark:           darkMode,
            renderers:             interactiveRenderers,
          }}
          theme={{
            'color-accent':       chatSettings.accentColor,
          }}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Quickstart app  (Chat Settings only)
───────────────────────────────────────────────────────────────────────────── */
function QuickstartApp({ onBack, darkMode, onToggleDark }) {
  const [chatMode,    setChatMode]    = useState('panel');
  const [chatSettings, setChatSettings] = useState({
    showFeedback:          true,
    showAudit:             false,
    showDarkModeLightMode: true,
    accentColor:           '#6366f1',
    title:                 'ConvEngine Assistant',
    subtitle:              "Ask me anything — I'll do my best to help.",
    placeholder:           'Ask ConvEngine…',
    showHeaderDot:         true,
    showLandingAvatar:     true,
    showLandingSubtitle:   true,
    showNewChat:           true,
    showLayoutPicker:      true,
    showMaximize:          true,
    showMinimize:          true,
    bubbleUserBg:          { light: '', dark: '' },
    bubbleUserText:        { light: '', dark: '' },
    bubbleAgentBg:         { light: '', dark: '' },
    bubbleAgentText:       { light: '', dark: '' },
    panelBg:               { light: '', dark: '' },
    composerBg:            { light: '', dark: '' },
    iconColor:             { light: '', dark: '' },
    userIconBg:            { light: '', dark: '' },
    userIconColor:         { light: '', dark: '' },
    agentIconBg:           { light: '', dark: '' },
    agentIconColor:        { light: '', dark: '' },
    previewDark:           false,
    messageEnrichment:     { mode: 'none', prefix: '', postfix: '', props: {} },
    streamEnabled:         false,
    streamTransport:       'sse',
    showTransportBadge:    false,
    debugShowVerbose:      false,
    debugShowPayload:      false,
    debugShowRenderer:     false,
    debugShowTimestamps:   false,
    debugShowMessageId:    false,
    debugSimulateDelay:    0,
    debugSimulateError:    false,
    debugHighlightRenderers: false,
    debugDisableAnimations:  false,
    showBubbleTime:        false,
    bubbleTimeFormat:      'h:mm A',
    showDateSeparators:    false,
    dateSeparatorFormat:   'auto',
    dateSeparatorShape:    'round',
    timeLabelBg:           { light: '', dark: '' },
    timeLabelColor:        { light: '', dark: '' },
    timeLabelBorderColor:  { light: '', dark: '' },
    dateLabelBg:           { light: '', dark: '' },
    dateLabelColor:        { light: '', dark: '' },
    dateLabelBorderColor:  { light: '', dark: '' },
  });
  const [iconComponents, setIconComponents] = useState({});
  const chatActionsRef = useRef(null);

  // Sync previewDark with app-level dark mode
  useEffect(() => {
    setChatSettings((s) => ({ ...s, previewDark: darkMode }));
  }, [darkMode]);

  const resolvedMode  = chatMode === 'fullscreen' ? 'panel' : chatMode.startsWith('sidepanel') ? 'sidepanel' : 'panel';
  const resolvedAlign = chatMode === 'sidepanel-left' ? 'left' : 'right';

  return (
    <>
      <AppShell
        title="Chat Quickstart, Settings & Docs"
        accentClass="text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-900/30"
        onBack={onBack}
        darkMode={darkMode}
        onToggleDark={onToggleDark}
      >
        <ChatSettingsView
          hideHeader
          darkMode={darkMode}
          chatActionsRef={chatActionsRef}
          onSettingsChange={(s, icons) => {
            setChatSettings(s);
            setIconComponents(icons ?? {});
            if (s.chatMode && s.chatMode !== chatMode) setChatMode(s.chatMode);
          }}
        />
      </AppShell>

      {resolvedMode !== 'fullscreen' && (
        <ConvEngineChat
          mode={resolvedMode}
          position="bottom"
          align={resolvedAlign}
          actionsRef={chatActionsRef}
          onModeChange={(m) => setChatMode(m === 'fullscreen' ? 'panel' : m)}
          config={{
            apiHost:               '',
            title:                 chatSettings.title,
            subtitle:              chatSettings.subtitle,
            placeholder:           chatSettings.placeholder,
            showAudit:             chatSettings.showAudit,
            showFeedback:          chatSettings.showFeedback,
            showDarkModeLightMode: chatSettings.showDarkModeLightMode,
            showHeaderDot:         chatSettings.showHeaderDot,
            showLandingAvatar:     chatSettings.showLandingAvatar,
            showLandingSubtitle:   chatSettings.showLandingSubtitle,
            showNewChat:           chatSettings.showNewChat,
            showLayoutPicker:      chatSettings.showLayoutPicker,
            showMaximize:          chatSettings.showMaximize,
            showMinimize:          chatSettings.showMinimize,
            defaultDark:           darkMode || chatSettings.previewDark,
            bubbleUserBg:          chatSettings.bubbleUserBg,
            bubbleUserText:        chatSettings.bubbleUserText,
            bubbleAgentBg:         chatSettings.bubbleAgentBg,
            bubbleAgentText:       chatSettings.bubbleAgentText,
            panelBg:               chatSettings.panelBg,
            composerBg:            chatSettings.composerBg,
            iconColor:             chatSettings.iconColor,
            userIconBg:            chatSettings.userIconBg,
            userIconColor:         chatSettings.userIconColor,
            agentIconBg:           chatSettings.agentIconBg,
            agentIconColor:        chatSettings.agentIconColor,
            composerShape:         chatSettings.composerShape,
            icons:                 iconComponents,
            renderers:             interactiveRenderers,
            messageEnrichment:     chatSettings.messageEnrichment?.mode !== 'none' ? chatSettings.messageEnrichment : undefined,
            stream:                chatSettings.streamEnabled
              ? { enabled: true, transport: chatSettings.streamTransport ?? 'sse' }
              : undefined,
            showTransportBadge:    chatSettings.showTransportBadge ?? false,
            debugShowVerbose:        chatSettings.debugShowVerbose        ?? false,
            debugShowPayload:        chatSettings.debugShowPayload        ?? false,
            debugShowRenderer:       chatSettings.debugShowRenderer       ?? false,
            debugShowTimestamps:     chatSettings.debugShowTimestamps     ?? false,
            debugShowMessageId:      chatSettings.debugShowMessageId      ?? false,
            debugSimulateDelay:      chatSettings.debugSimulateDelay      ?? 0,
            debugSimulateError:      chatSettings.debugSimulateError      ?? false,
            debugHighlightRenderers: chatSettings.debugHighlightRenderers ?? false,
            debugDisableAnimations:  chatSettings.debugDisableAnimations  ?? false,
            showBubbleTime:          chatSettings.showBubbleTime          ?? false,
            bubbleTimeFormat:        chatSettings.bubbleTimeFormat         ?? 'h:mm A',
            showDateSeparators:      chatSettings.showDateSeparators      ?? false,
            dateSeparatorFormat:     chatSettings.dateSeparatorFormat     ?? 'auto',
            dateSeparatorShape:      chatSettings.dateSeparatorShape      ?? 'round',
            timeLabelBg:             chatSettings.timeLabelBg,
            timeLabelColor:          chatSettings.timeLabelColor,
            timeLabelBorderColor:    chatSettings.timeLabelBorderColor,
            dateLabelBg:             chatSettings.dateLabelBg,
            dateLabelColor:          chatSettings.dateLabelColor,
            dateLabelBorderColor:    chatSettings.dateLabelBorderColor,
            landingChips:               chatSettings.landingChips?.length ? chatSettings.landingChips : undefined,
            landingChipsOrientation:    chatSettings.landingChipsOrientation    ?? 'row',
            landingChipsShape:          chatSettings.landingChipsShape          ?? 'round',
            landingChipsAnchor:         chatSettings.landingChipsAnchor         ?? 'landingAgent',
            landingChipsAnchorPadding:  (chatSettings.landingChipsAnchorPadding !== '' && chatSettings.landingChipsAnchorPadding != null)
                ? `${chatSettings.landingChipsAnchorPadding}${chatSettings.landingChipsAnchorPaddingUnit ?? 'px'}`
                : undefined,
          }}
          theme={{
            'color-accent': chatSettings.accentColor,
          }}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Root
───────────────────────────────────────────────────────────────────────────── */
export default function RootPage() {
  const [view, setView] = useState('landing'); // 'landing' | 'demo' | 'quickstart'
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  function toggleDark() { setDarkMode((d) => !d); }

  if (view === 'demo')       return <DemoApp       darkMode={darkMode} onToggleDark={toggleDark} onBack={() => setView('landing')} />;
  if (view === 'quickstart') return <QuickstartApp darkMode={darkMode} onToggleDark={toggleDark} onBack={() => setView('landing')} />;
  return <LandingPage darkMode={darkMode} onToggleDark={toggleDark} onSelect={setView} />;
}


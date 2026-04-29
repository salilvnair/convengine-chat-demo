'use client';

import { useState }            from 'react';
import { ConvEngineChat }       from 'convengine-chat';
import { MetricCard }           from './components/MetricCard.jsx';
import { RevenueChart }         from './components/RevenueChart.jsx';
import { OrdersTable }          from './components/OrdersTable.jsx';
import { ChannelsPanel }        from './components/ChannelsPanel.jsx';
import { OrdersView }           from './components/OrdersView.jsx';
import { AnalyticsView }        from './components/AnalyticsView.jsx';
import { SettingsView }         from './components/SettingsView.jsx';
import { ChatSettingsView }     from './components/ChatSettingsView.jsx';
import { ProfileDropdown }      from './components/ProfileDropdown.jsx';
import { interactiveRenderers } from './components/InteractiveRenderers.jsx';
import { METRICS, WEEKLY_REVENUE, RECENT_ORDERS, TOP_CHANNELS } from './data/dashboard.js';

const TABS = ['Dashboard', 'Orders', 'Analytics', 'Settings', 'Chat Settings', 'Fullscreen Chat'];

function DashboardContent() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, Salil. Here&apos;s what&apos;s happening today.</p>
        </div>
        <span className="text-sm text-slate-400">April 29, 2026</span>
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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [chatMode, setChatMode] = useState('panel');
  // chatMode: 'panel' | 'sidepanel-right' | 'sidepanel-left' | 'fullscreen'
  const [chatSettings, setChatSettings] = useState({
    showFeedback:          true,
    showAudit:             false,
    showDarkModeLightMode: true,
    accentColor:           '#6366f1',
  });

  const resolvedMode  = chatMode === 'fullscreen' ? 'fullscreen' : chatMode.startsWith('sidepanel') ? 'sidepanel' : 'panel';
  const resolvedAlign = chatMode === 'sidepanel-left' ? 'left' : 'right';

  function handleModeChange(newMode) {
    if (newMode === 'fullscreen') {
      setActiveTab('Fullscreen Chat');
    } else {
      setChatMode(newMode);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Top nav ──────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              CE
            </span>
            <span className="font-semibold text-slate-800 hidden sm:block">ConvEngine Demo</span>
          </div>

          {/* Nav tabs (desktop) */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Mobile nav */}
            <select
              className="md:hidden text-sm border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-400"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              {TABS.map((t) => <option key={t}>{t}</option>)}
            </select>

            <ProfileDropdown onNavigate={(tab) => setActiveTab(tab)} />
          </div>
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'Dashboard'     && <DashboardContent />}
        {activeTab === 'Orders'        && <OrdersView />}
        {activeTab === 'Analytics'     && <AnalyticsView />}
        {activeTab === 'Settings'      && <SettingsView />}
        {activeTab === 'Chat Settings' && (
          <ChatSettingsView
            onSettingsChange={(s) => {
              setChatSettings(s);
              if (s.chatMode !== chatMode) handleModeChange(s.chatMode);
            }}
          />
        )}
        {activeTab === 'Fullscreen Chat' && (
          <div className="w-full rounded-2xl overflow-hidden border border-slate-100 shadow-sm" style={{ height: '75vh' }}>
            <ConvEngineChat
              mode="fullscreen"
              config={{
                apiHost: 'http://localhost:8080',
                title: 'ConvEngine Assistant',
                placeholder: 'Ask anything about your data…',
                showAudit: chatSettings.showAudit,
                showFeedback: chatSettings.showFeedback,
                showDarkModeLightMode: chatSettings.showDarkModeLightMode,
                renderers: interactiveRenderers,
              }}
              theme={{ 'color-accent': chatSettings.accentColor, 'color-accent-hover': '#4f46e5' }}
            />
          </div>
        )}

        {/* Bottom padding so FAB / side-tab doesn't overlap last row */}
        <div className="h-28" />
      </main>

      {/* ── ConvEngine Chat widget (panel / sidepanel modes only) ───── */}
      {activeTab !== 'Fullscreen Chat' && resolvedMode !== 'fullscreen' && (
        <ConvEngineChat
          key={resolvedMode}
          mode={resolvedMode}
          position="bottom"
          align={resolvedAlign}
          onModeChange={handleModeChange}
          config={{
            apiHost: 'http://localhost:8080',
            title: 'ConvEngine Assistant',
            placeholder: 'Ask anything about your data…',
            showAudit: chatSettings.showAudit,
            showFeedback: chatSettings.showFeedback,
            showDarkModeLightMode: chatSettings.showDarkModeLightMode,
            renderers: interactiveRenderers,
          }}
          theme={{
            'color-accent':       chatSettings.accentColor,
            'color-accent-hover': '#4f46e5',
          }}
        />
      )}
    </div>
  );
}

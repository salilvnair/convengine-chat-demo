'use client';

import { useState } from 'react';

// ── Section wrapper ────────────────────────────────────────────────────────
function DocSection({ id, title, children }) {
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">{title}</h2>
      {children}
    </section>
  );
}

function PropRow({ prop, type, defaultVal, description }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-semibold">{prop}</td>
      <td className="px-4 py-3 font-mono text-xs text-slate-500">{type}</td>
      <td className="px-4 py-3 font-mono text-xs text-amber-600">{defaultVal}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{description}</td>
    </tr>
  );
}

function CodeBlock({ code, lang = 'jsx' }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2">
        <span className="text-xs text-slate-400 font-mono">{lang}</span>
        <button onClick={copy} className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-slate-900 text-slate-100 px-4 py-4 text-xs leading-relaxed overflow-x-auto font-mono whitespace-pre">{code}</pre>
    </div>
  );
}

// ── Live settings playground ───────────────────────────────────────────────
function PlaygroundPanel({ settings, onChange }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Live Config Playground</h3>
      <p className="text-xs text-slate-400">Toggle settings below — the chat widget updates instantly.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'showFeedback',          label: 'Show Feedback (👍👎)',          hint: 'config.showFeedback' },
          { key: 'showAudit',             label: 'Show Audit Trail',             hint: 'config.showAudit' },
          { key: 'showDarkModeLightMode', label: 'Dark/Light Mode Toggle',       hint: 'config.showDarkModeLightMode' },
        ].map(({ key, label, hint }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer">
            <button
              role="switch"
              aria-checked={settings[key]}
              onClick={() => onChange({ ...settings, [key]: !settings[key] })}
              className={`relative flex-shrink-0 transition-colors rounded-full ${settings[key] ? 'bg-indigo-500' : 'bg-slate-200'}`}
              style={{ width: 40, height: 22 }}
            >
              <span
                className="absolute top-0.5 bg-white rounded-full shadow-sm transition-transform"
                style={{ width: 18, height: 18, transform: settings[key] ? 'translateX(20px)' : 'translateX(2px)' }}
              />
            </button>
            <div>
              <p className="text-sm font-medium text-slate-700">{label}</p>
              <p className="text-xs text-slate-400 font-mono">{hint}</p>
            </div>
          </label>
        ))}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm font-medium text-slate-700">Panel Mode</label>
          <div className="flex gap-2 flex-wrap">
            {['panel', 'sidepanel-right', 'sidepanel-left'].map((m) => (
              <button
                key={m}
                onClick={() => onChange({ ...settings, chatMode: m })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  settings.chatMode === m
                    ? 'bg-indigo-500 border-indigo-500 text-white'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {m === 'panel' ? 'Panel (FAB)' : m === 'sidepanel-right' ? 'Side → Right' : '← Left Side'}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm font-medium text-slate-700">Accent Color</label>
          <div className="flex gap-2 flex-wrap items-center">
            {['#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6'].map((c) => (
              <button
                key={c}
                onClick={() => onChange({ ...settings, accentColor: c })}
                style={{ background: c }}
                className={`w-7 h-7 rounded-full border-2 transition-all ${settings.accentColor === c ? 'border-slate-700 scale-110' : 'border-transparent'}`}
              />
            ))}
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => onChange({ ...settings, accentColor: e.target.value })}
              className="w-7 h-7 rounded-full cursor-pointer border border-slate-200"
              title="Custom color"
            />
          </div>
        </div>
      </div>

      {/* Generated config snippet */}
      <div className="mt-2">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">Generated usage</p>
        <CodeBlock lang="jsx" code={`<ConvEngineChat
  mode="${settings.chatMode.startsWith('sidepanel') ? 'sidepanel' : 'panel'}"
  align="${settings.chatMode === 'sidepanel-left' ? 'left' : 'right'}"
  config={{
    apiHost: "http://localhost:8080",
    showFeedback: ${settings.showFeedback},
    showAudit: ${settings.showAudit},
    showDarkModeLightMode: ${settings.showDarkModeLightMode},
  }}
  theme={{
    "color-accent": "${settings.accentColor}",
  }}
/>`} />
      </div>
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────────────
export function ChatSettingsView({ onSettingsChange }) {
  const [settings, setSettings] = useState({
    showFeedback:          true,
    showAudit:             false,
    showDarkModeLightMode: true,
    chatMode:              'panel',
    accentColor:           '#6366f1',
  });

  function handleChange(next) {
    setSettings(next);
    onSettingsChange?.(next);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Chat Settings &amp; Docs</h1>
        <p className="text-slate-500 text-sm mt-1">Configure the ConvEngine Chat widget and explore the full API reference.</p>
      </div>

      {/* Playground */}
      <PlaygroundPanel settings={settings} onChange={handleChange} />

      {/* Docs */}
      <div className="space-y-8">

        <DocSection id="install" title="Installation">
          <p className="text-sm text-slate-600">Install from npm or link locally during development:</p>
          <CodeBlock lang="bash" code={`npm install convengine-chat
# or link a local build
npm install ../convengine-chat`} />
          <p className="text-sm text-slate-600 mt-2">Import the CSS in your root layout (Next.js example):</p>
          <CodeBlock lang="jsx" code={`// app/globals.css  (or your root layout)
import 'convengine-chat/style.css';`} />
          <p className="text-sm text-slate-600 mt-2">If using Next.js, add to <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">next.config.mjs</code>:</p>
          <CodeBlock lang="js" code={`transpilePackages: ['convengine-chat']`} />
        </DocSection>

        <DocSection id="quickstart" title="Quick Start">
          <CodeBlock lang="jsx" code={`import { ConvEngineChat } from 'convengine-chat';

export default function App() {
  return (
    <ConvEngineChat
      mode="panel"
      position="bottom"
      align="right"
      config={{ apiHost: 'http://localhost:8080' }}
    />
  );
}`} />
        </DocSection>

        <DocSection id="props" title="Component Props">
          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase text-slate-400 tracking-wide">
                  <th className="px-4 py-3 text-left font-semibold">Prop</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Default</th>
                  <th className="px-4 py-3 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                <PropRow prop="mode" type='"panel"|"fullscreen"|"sidepanel"' defaultVal='"panel"' description='Rendering mode. panel = floating FAB card, fullscreen = fills parent, sidepanel = full-height edge drawer.' />
                <PropRow prop="position" type='"bottom"|"top"' defaultVal='"bottom"' description='Vertical anchor for panel mode FAB and card.' />
                <PropRow prop="align" type='"right"|"left"' defaultVal='"right"' description='Horizontal anchor for panel mode and sidepanel side.' />
                <PropRow prop="config" type='object' defaultVal='{}' description='Configuration bag — see Config table below.' />
                <PropRow prop="theme" type='object' defaultVal='{}' description='CSS custom-property overrides. Keys auto-prefixed with --ce-.' />
              </tbody>
            </table>
          </div>
        </DocSection>

        <DocSection id="config" title="config Object">
          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase text-slate-400 tracking-wide">
                  <th className="px-4 py-3 text-left font-semibold">Key</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Default</th>
                  <th className="px-4 py-3 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                <PropRow prop="apiHost" type='string' defaultVal='"http://localhost:8080"' description='Base URL of your ConvEngine backend.' />
                <PropRow prop="conversationId" type='string' defaultVal='undefined' description='Resume an existing conversation by ID.' />
                <PropRow prop="title" type='string' defaultVal='"ConvEngine Chat"' description='Panel/landing screen title.' />
                <PropRow prop="placeholder" type='string' defaultVal='"Ask ConvEngine…"' description='Input placeholder text.' />
                <PropRow prop="showFeedback" type='boolean' defaultVal='true' description='Show 👍👎 feedback buttons under assistant messages.' />
                <PropRow prop="showAudit" type='boolean' defaultVal='false' description='Show the audit trail side panel.' />
                <PropRow prop="showDarkModeLightMode" type='boolean' defaultVal='false' description='Show the dark/light mode toggle button in the header.' />
                <PropRow prop="renderers" type='RendererProvider[]' defaultVal='[]' description='Array of custom renderer providers injected before built-ins.' />
                <PropRow prop="onMessage" type='(text: string) => void' defaultVal='undefined' description='Callback fired when the user sends a message.' />
                <PropRow prop="onResponse" type='(text: string) => void' defaultVal='undefined' description='Callback fired when an assistant response arrives.' />
              </tbody>
            </table>
          </div>
        </DocSection>

        <DocSection id="theme" title="theme Tokens">
          <p className="text-sm text-slate-600">Pass any CSS custom-property as a shorthand key (auto-prefixed with <code className="bg-slate-100 px-1 rounded text-xs">--ce-</code>) or as the full variable name:</p>
          <CodeBlock lang="jsx" code={`<ConvEngineChat
  theme={{
    'color-accent':       '#6366f1',  // → --ce-color-accent
    'color-accent-hover': '#4f46e5',  // → --ce-color-accent-hover
    'panel-width':        '480px',    // → --ce-panel-width
    'panel-height':       '680px',    // → --ce-panel-height
    'sidepanel-width':    '420px',    // → --ce-sidepanel-width
    'font-family':        '"Inter", sans-serif',
    '--ce-bg-panel':      '#0f172a',  // full name also works
  }}
/>`} />
          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase text-slate-400 tracking-wide">
                  <th className="px-4 py-3 text-left font-semibold">Token</th>
                  <th className="px-4 py-3 text-left font-semibold">Default</th>
                  <th className="px-4 py-3 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {[
                  ['--ce-color-accent',       '#6366f1', 'Primary accent (buttons, FAB, highlights)'],
                  ['--ce-color-accent-hover',  '#4f46e5', 'Accent hover state'],
                  ['--ce-panel-width',         '460px',   'Width of the floating panel'],
                  ['--ce-panel-height',        '660px',   'Max-height of the floating panel'],
                  ['--ce-sidepanel-width',     '400px',   'Width of the side drawer'],
                  ['--ce-bg-panel',            '#ffffff', 'Panel / sidepanel background'],
                  ['--ce-bg-bubble-user',      '#6366f1', 'User message bubble fill'],
                  ['--ce-bg-bubble-agent',     '#f1f5f9', 'Assistant message bubble fill'],
                  ['--ce-font-family',         'system-ui', 'Font stack applied inside the widget'],
                ].map(([t, d, desc]) => (
                  <tr key={t} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-mono text-xs text-indigo-600">{t}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-amber-600">{d}</td>
                    <td className="px-4 py-2.5 text-sm text-slate-600">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>

        <DocSection id="renderers" title="Custom Renderers">
          <p className="text-sm text-slate-600">Supply a renderer provider to intercept assistant messages and render rich UI:</p>
          <CodeBlock lang="jsx" code={`const myRenderer = {
  key: 'my-card',
  priority: 10,
  match: (ctx) => ctx.type === 'my-card',
  Component: ({ payload, actions }) => (
    <div className="ce-interactive-card">
      <p>{payload.message}</p>
      <button onClick={() => actions.submit('Yes', { choice: 'yes' })}>
        Confirm
      </button>
    </div>
  ),
};

<ConvEngineChat
  config={{ renderers: [myRenderer] }}
/>`} />
          <p className="text-sm text-slate-600 mt-3">The <code className="bg-slate-100 px-1 rounded text-xs">actions</code> object passed to every renderer:</p>
          <CodeBlock lang="ts" code={`interface ChatActions {
  /** Send a message (with optional visible display text + backend params) */
  submit(displayText: string, inputParams?: object): void;
  /** Send params to backend silently (no user bubble shown) */
  submitSilent(inputParams: object): void;
  /** Append a bubble to the thread without an API call */
  appendBubble(text: string, role?: 'user' | 'assistant'): void;
  /** Pre-fill the composer input */
  prefillInput(text: string): void;
}`} />
        </DocSection>

        <DocSection id="hooks" title="Hooks &amp; Context">
          <CodeBlock lang="jsx" code={`import { useChatActions } from 'convengine-chat';

// Inside any component rendered inside <ConvEngineChat>:
function MyButton() {
  const { actions } = useChatActions();
  return (
    <button onClick={() => actions.submitSilent({ intent: 'help' })}>
      Get Help
    </button>
  );
}`} />
        </DocSection>

      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function CodeBlock({ code, lang = 'jsx' }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 shadow-lg">
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2">
        <span className="text-xs text-slate-400 font-mono font-semibold">{lang}</span>
        <button onClick={copy}
          className="text-xs text-slate-400 hover:text-white transition-colors font-medium flex items-center gap-1.5">
          {copied
            ? <><span className="text-emerald-400">✓</span> Copied</>
            : <>
                <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"/>
                </svg>
                Copy
              </>
          }
        </button>
      </div>
      <pre className="bg-slate-900 text-slate-100 px-5 py-4 text-xs leading-relaxed overflow-x-auto font-mono whitespace-pre">{code}</pre>
    </div>
  );
}

const TYPE_COLORS = {
  string:   'bg-sky-100 text-sky-700 border-sky-200',
  boolean:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  object:   'bg-violet-100 text-violet-700 border-violet-200',
  function: 'bg-orange-100 text-orange-700 border-orange-200',
  Array:    'bg-teal-100 text-teal-700 border-teal-200',
  number:   'bg-pink-100 text-pink-700 border-pink-200',
};
function TypeBadge({ type }) {
  const base = TYPE_COLORS[type.split('|')[0].trim().replace(/['"]/g, '')] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  return <span className={`inline-block px-1.5 py-0.5 rounded-md border text-[10px] font-mono font-semibold ${base}`}>{type}</span>;
}
function DefaultBadge({ val }) {
  if (!val || val === 'undefined') return <span className="text-slate-400 text-xs font-mono">—</span>;
  return <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold">{val}</span>;
}

function PropRow({ prop, type, defaultVal, description }) {
  return (
    <tr className="hover:bg-indigo-50/40 transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-bold whitespace-nowrap">{prop}</td>
      <td className="px-4 py-3"><TypeBadge type={type} /></td>
      <td className="px-4 py-3"><DefaultBadge val={defaultVal} /></td>
      <td className="px-4 py-3 text-sm text-slate-600">{description}</td>
    </tr>
  );
}

function Tip({ color = 'blue', icon, title, children }) {
  const schemes = {
    blue:   'bg-sky-50 border-sky-300 text-sky-800',
    green:  'bg-emerald-50 border-emerald-300 text-emerald-800',
    amber:  'bg-amber-50 border-amber-300 text-amber-800',
    violet: 'bg-violet-50 border-violet-300 text-violet-800',
    pink:   'bg-pink-50 border-pink-300 text-pink-800',
  };
  return (
    <div className={`flex gap-3 rounded-xl border p-4 ${schemes[color]}`}>
      <span className="text-lg leading-none flex-shrink-0">{icon}</span>
      <div>
        {title && <p className="font-semibold text-sm mb-0.5">{title}</p>}
        <p className="text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function SectionHeader({ gradient, icon, title, subtitle }) {
  return (
    <div className={`rounded-t-2xl p-5 ${gradient}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
          {subtitle && <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function FeatureChip({ label, color }) {
  const c = {
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    sky:    'bg-sky-100 text-sky-700 border-sky-200',
    violet: 'bg-violet-100 text-violet-700 border-violet-200',
    emerald:'bg-emerald-100 text-emerald-700 border-emerald-200',
    pink:   'bg-pink-100 text-pink-700 border-pink-200',
    amber:  'bg-amber-100 text-amber-700 border-amber-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    teal:   'bg-teal-100 text-teal-700 border-teal-200',
  }[color] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${c}`}>{label}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Color picker
// ─────────────────────────────────────────────────────────────────────────────
const COLOR_PALETTE = [
  '#6366f1','#818cf8','#a855f7','#8b5cf6','#d946ef',
  '#3b82f6','#0ea5e9','#06b6d4','#0891b2','#0e7490',
  '#10b981','#22c55e','#84cc16','#65a30d','#166534',
  '#f59e0b','#f97316','#ef4444','#e11d48','#ec4899',
  '#1e293b','#475569','#94a3b8','#334155','#0f172a',
];

function ColorPicker({ value, onChange }) {
  const [hex, setHex] = useState(value);

  function applyHex(raw) {
    const clean = raw.startsWith('#') ? raw : `#${raw}`;
    if (/^#[0-9a-fA-F]{6}$/.test(clean)) {
      onChange(clean);
      setHex(clean);
    }
  }

  function handleSwatchClick(c) {
    onChange(c);
    setHex(c);
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl shadow-inner border border-white ring-1 ring-slate-200 flex-shrink-0"
          style={{ background: value }}
        />
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Current Accent</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={hex}
              maxLength={7}
              onChange={(e) => setHex(e.target.value)}
              onBlur={() => applyHex(hex)}
              onKeyDown={(e) => e.key === 'Enter' && applyHex(hex)}
              className="w-28 px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
              placeholder="#6366f1"
            />
            <label className="relative cursor-pointer">
              <span className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors font-medium select-none">
                🎨 Custom
              </span>
              <input
                type="color"
                value={value}
                onChange={(e) => { onChange(e.target.value); setHex(e.target.value); }}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {COLOR_PALETTE.map((c) => (
          <button
            key={c}
            title={c}
            onClick={() => handleSwatchClick(c)}
            style={{ background: c }}
            className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 active:scale-95 ${
              value === c ? 'border-slate-800 ring-2 ring-offset-1 ring-slate-400 scale-110' : 'border-white shadow-sm'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toggle (fixed — no overlay)
// ─────────────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, hint }) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 ${checked ? 'bg-indigo-500' : 'bg-slate-200'}`}
        style={{ width: 40, height: 22 }}
      >
        <span
          className="absolute top-[2px] bg-white rounded-full shadow transition-transform duration-200"
          style={{ width: 18, height: 18, transform: checked ? 'translateX(20px)' : 'translateX(2px)' }}
        />
      </button>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-700 leading-snug">{label}</p>
        <p className="text-xs text-slate-400 font-mono mt-0.5">{hint}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Playground
// ─────────────────────────────────────────────────────────────────────────────
function PlaygroundPanel({ settings, onChange }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>🎛️</span> Live Config Playground
        </h3>
        <p className="text-xs text-indigo-200 mt-0.5">Toggle settings below — the chat widget updates instantly.</p>
      </div>

      <div className="p-5 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Toggle checked={settings.showFeedback}          onChange={(v) => onChange({ ...settings, showFeedback: v })}          label="Show Feedback (👍👎)"    hint="config.showFeedback" />
          <Toggle checked={settings.showAudit}             onChange={(v) => onChange({ ...settings, showAudit: v })}             label="Show Audit Trail"        hint="config.showAudit" />
          <Toggle checked={settings.showDarkModeLightMode} onChange={(v) => onChange({ ...settings, showDarkModeLightMode: v })} label="Dark/Light Mode Toggle"  hint="config.showDarkModeLightMode" />
        </div>

        <hr className="border-slate-100" />

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Panel Mode</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'panel',           label: '⊞ FAB Panel' },
              { id: 'sidepanel-right', label: '▷ Right Side' },
              { id: 'sidepanel-left',  label: '◁ Left Side' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => onChange({ ...settings, chatMode: id })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  settings.chatMode === id
                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-200'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accent Color</p>
          <ColorPicker value={settings.accentColor} onChange={(c) => onChange({ ...settings, accentColor: c })} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generated Usage</p>
          <CodeBlock lang="jsx" code={`<ConvEngineChat
  mode="${settings.chatMode.startsWith('sidepanel') ? 'sidepanel' : 'panel'}"
  align="${settings.chatMode === 'sidepanel-left' ? 'left' : 'right'}"
  config={{
    apiHost: "http://localhost:8080",
    showFeedback: ${settings.showFeedback},
    showAudit: ${settings.showAudit},
    showDarkModeLightMode: ${settings.showDarkModeLightMode},
  }}
  theme={{ "color-accent": "${settings.accentColor}" }}
/>`} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Doc layout helpers
// ─────────────────────────────────────────────────────────────────────────────
function DocCard({ id, children }) {
  return <section id={id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">{children}</section>;
}
function DocCardBody({ children }) {
  return <div className="p-6 space-y-4">{children}</div>;
}
function PropsTable({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-xs uppercase text-slate-400 tracking-wider">
            <th className="px-4 py-3 text-left font-bold">Prop / Key</th>
            <th className="px-4 py-3 text-left font-bold">Type</th>
            <th className="px-4 py-3 text-left font-bold">Default</th>
            <th className="px-4 py-3 text-left font-bold">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">{children}</tbody>
      </table>
    </div>
  );
}
function NavDot({ href, children }) {
  return (
    <a href={href} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors py-1 rounded-lg hover:bg-indigo-50 px-2 -mx-2">
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 flex-shrink-0" />
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main view
// ─────────────────────────────────────────────────────────────────────────────
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
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Chat Settings &amp; Docs</h1>
          <p className="text-slate-500 text-sm mt-1">Configure the widget live, then browse the full API reference below.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FeatureChip label="⚛️ React 18+" color="sky" />
          <FeatureChip label="🎨 CSS tokens" color="violet" />
          <FeatureChip label="🔌 Pluggable renderers" color="emerald" />
          <FeatureChip label="🌙 Dark mode" color="indigo" />
          <FeatureChip label="📐 3 layout modes" color="pink" />
        </div>
      </div>

      <PlaygroundPanel settings={settings} onChange={handleChange} />

      {/* Docs: sidebar + content */}
      <div className="flex gap-8 items-start">
        <nav className="hidden lg:flex flex-col gap-1 sticky top-20 w-44 flex-shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">On this page</p>
          <NavDot href="#install">Installation</NavDot>
          <NavDot href="#quickstart">Quick Start</NavDot>
          <NavDot href="#props">Component Props</NavDot>
          <NavDot href="#config">config Object</NavDot>
          <NavDot href="#theme">Theme Tokens</NavDot>
          <NavDot href="#renderers">Custom Renderers</NavDot>
          <NavDot href="#actions">Actions API</NavDot>
          <NavDot href="#hooks">Hooks</NavDot>
        </nav>

        <div className="flex-1 min-w-0 space-y-8">

          {/* Installation */}
          <DocCard id="install">
            <SectionHeader gradient="bg-gradient-to-r from-sky-500 to-indigo-600" icon="📦" title="Installation" subtitle="Get convengine-chat into your project" />
            <DocCardBody>
              <Tip color="blue" icon="💡" title="Requirements">React 18+ and react-dom. Peer dependencies only — no bundled React copy.</Tip>
              <CodeBlock lang="bash" code={`npm install convengine-chat\n# or link a local build during development\nnpm install ../convengine-chat`} />
              <p className="text-sm text-slate-600">Import the CSS once in your app entry:</p>
              <CodeBlock lang="jsx" code={`// app/globals.css  (or your root layout)\nimport 'convengine-chat/style.css';`} />
              <Tip color="amber" icon="⚡" title="Next.js users">
                Add <code className="font-mono text-xs bg-amber-100 px-1 rounded">transpilePackages: [&apos;convengine-chat&apos;]</code> to your <code className="font-mono text-xs bg-amber-100 px-1 rounded">next.config.mjs</code>.
              </Tip>
              <CodeBlock lang="js" code={`// next.config.mjs\nconst nextConfig = {\n  transpilePackages: ['convengine-chat'],\n};\nexport default nextConfig;`} />
            </DocCardBody>
          </DocCard>

          {/* Quick Start */}
          <DocCard id="quickstart">
            <SectionHeader gradient="bg-gradient-to-r from-emerald-500 to-teal-600" icon="🚀" title="Quick Start" subtitle="Up and running in 2 minutes" />
            <DocCardBody>
              <div className="flex flex-wrap gap-2">
                <FeatureChip label="mode=panel" color="indigo" />
                <FeatureChip label="mode=sidepanel" color="violet" />
                <FeatureChip label="mode=fullscreen" color="pink" />
              </div>
              <CodeBlock lang="jsx" code={`import { ConvEngineChat } from 'convengine-chat';\n\n// Floating FAB panel (default)\n<ConvEngineChat\n  mode="panel"\n  position="bottom"\n  align="right"\n  config={{ apiHost: 'http://localhost:8080' }}\n/>\n\n// Full-height side drawer\n<ConvEngineChat\n  mode="sidepanel"\n  align="right"\n  config={{ apiHost: 'http://localhost:8080' }}\n/>\n\n// Fills parent container\n<div style={{ height: '80vh' }}>\n  <ConvEngineChat\n    mode="fullscreen"\n    config={{ apiHost: 'http://localhost:8080' }}\n  />\n</div>`} />
              <Tip color="green" icon="🔁" title="Mode switching at runtime">
                Pass an <code className="font-mono text-xs bg-emerald-100 px-1 rounded">onModeChange</code> prop to let users switch between panel, sidepanel, and fullscreen without losing their conversation.
              </Tip>
            </DocCardBody>
          </DocCard>

          {/* Component Props */}
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

          {/* config Object */}
          <DocCard id="config">
            <SectionHeader gradient="bg-gradient-to-r from-orange-500 to-amber-500" icon="⚙️" title="config Object" subtitle="Passed as config={{ ... }} to <ConvEngineChat />" />
            <DocCardBody>
              <Tip color="amber" icon="🔒" title="Security note">
                <code className="font-mono text-xs bg-amber-100 px-1 rounded">apiHost</code> is called from the browser. Make sure your ConvEngine backend has CORS enabled for your frontend origin.
              </Tip>
              <PropsTable>
                <PropRow prop="apiHost"              type='string'   defaultVal='"http://localhost:8080"' description='Base URL of your ConvEngine backend.' />
                <PropRow prop="conversationId"       type='string'   defaultVal='undefined'              description='Resume an existing conversation by ID.' />
                <PropRow prop="title"                type='string'   defaultVal='"ConvEngine Chat"'      description='Panel / landing screen title.' />
                <PropRow prop="placeholder"          type='string'   defaultVal='"Ask ConvEngine…"'      description='Input placeholder text.' />
                <PropRow prop="showFeedback"         type='boolean'  defaultVal='true'                   description='Show 👍👎 feedback buttons under assistant messages.' />
                <PropRow prop="showAudit"            type='boolean'  defaultVal='false'                  description='Show the audit trail side panel.' />
                <PropRow prop="showDarkModeLightMode"type='boolean'  defaultVal='false'                  description='Show the dark/light mode toggle button in the header.' />
                <PropRow prop="renderers"            type='Array'    defaultVal='[]'                     description='Custom renderer providers injected before built-ins.' />
                <PropRow prop="onMessage"            type='function' defaultVal='undefined'              description='(text: string) => void — fired when the user sends a message.' />
                <PropRow prop="onResponse"           type='function' defaultVal='undefined'              description='(text: string) => void — fired when an assistant response arrives.' />
              </PropsTable>
            </DocCardBody>
          </DocCard>

          {/* Theme Tokens */}
          <DocCard id="theme">
            <SectionHeader gradient="bg-gradient-to-r from-pink-500 to-rose-500" icon="🎨" title="Theme Tokens" subtitle="Re-skin the widget without touching CSS files" />
            <DocCardBody>
              <Tip color="violet" icon="✨" title="How it works">
                Every visual token is a CSS custom property on <code className="font-mono text-xs bg-violet-100 px-1 rounded">.ce-chat-root</code>. Pass shorthand keys (auto-prefixed with <code className="font-mono text-xs bg-violet-100 px-1 rounded">--ce-</code>) or full variable names.
              </Tip>
              <CodeBlock lang="jsx" code={`<ConvEngineChat\n  theme={{\n    'color-accent':       '#6366f1',  // → --ce-color-accent\n    'color-accent-hover': '#4f46e5',\n    'panel-width':        '480px',\n    'panel-height':       '700px',\n    'sidepanel-width':    '420px',\n    'font-family':        '"Inter", sans-serif',\n    '--ce-bg-panel':      '#0f172a',  // full name also works\n  }}\n/>`} />
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
                      ['--ce-color-accent',      '#6366f1', 'Primary accent — buttons, FAB, highlights'],
                      ['--ce-color-accent-hover', '#4f46e5', 'Accent hover state'],
                      ['--ce-panel-width',        '460px',   'Width of the floating panel'],
                      ['--ce-panel-height',       '660px',   'Max-height of the floating panel'],
                      ['--ce-sidepanel-width',    '400px',   'Width of the side drawer'],
                      ['--ce-bg-panel',           '#ffffff', 'Panel / sidepanel background'],
                      ['--ce-bg-bubble-user',     '#6366f1', 'User message bubble fill'],
                      ['--ce-bg-bubble-agent',    '#f1f5f9', 'Assistant message bubble fill'],
                      ['--ce-font-family',        'system-ui','Font stack applied inside the widget'],
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
                Reference CSS tokens in <code className="font-mono text-xs bg-sky-100 px-1 rounded">tailwind.config.js</code>: <code className="font-mono text-xs bg-sky-100 px-1 rounded">{'colors: { brand: "var(--ce-color-accent)" }'}</code>
              </Tip>
            </DocCardBody>
          </DocCard>

          {/* Custom Renderers */}
          <DocCard id="renderers">
            <SectionHeader gradient="bg-gradient-to-r from-teal-500 to-cyan-600" icon="🔌" title="Custom Renderers" subtitle="Intercept assistant messages and render rich interactive UI" />
            <DocCardBody>
              <div className="flex flex-wrap gap-2">
                <FeatureChip label="Selection / Radio" color="teal" />
                <FeatureChip label="Multi-select" color="sky" />
                <FeatureChip label="Inline form" color="violet" />
                <FeatureChip label="File upload" color="orange" />
                <FeatureChip label="Confirm step" color="emerald" />
              </div>
              <Tip color="green" icon="🏗️" title="How the registry works">
                Providers are sorted by <code className="font-mono text-xs bg-emerald-100 px-1 rounded">priority</code> (highest first). The first whose <code className="font-mono text-xs bg-emerald-100 px-1 rounded">match(ctx)</code> returns true wins. Built-ins have priority 100.
              </Tip>
              <CodeBlock lang="jsx" code={`// SelectionPromptRenderer.jsx\nexport function SelectionPromptRenderer({ payload, actions }) {\n  const [selected, setSelected] = useState(null);\n  return (\n    <div className="ce-interactive-card">\n      <p>{payload.question}</p>\n      {payload.options.map((o) => (\n        <label key={o.value}>\n          <input type="radio" value={o.value}\n            checked={selected === o.value}\n            onChange={() => setSelected(o.value)} />\n          {o.label}\n        </label>\n      ))}\n      <button disabled={!selected}\n        onClick={() => actions.submit(selected, { choice: selected })}>\n        Continue →\n      </button>\n    </div>\n  );\n}\n\n// Register it\nconst myProvider = {\n  key:      'SelectionPrompt',\n  priority: 200,\n  match:    (ctx) => ctx.effectiveType === 'SelectionPrompt',\n  Component: SelectionPromptRenderer,\n};\n\n<ConvEngineChat config={{ renderers: [myProvider] }} />`} />
            </DocCardBody>
          </DocCard>

          {/* Actions API */}
          <DocCard id="actions">
            <SectionHeader gradient="bg-gradient-to-r from-indigo-500 to-blue-600" icon="⚡" title="Actions API" subtitle="Injected into every renderer Component as props.actions" />
            <DocCardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'actions.submit()',        color: 'indigo', desc: 'Add user bubble + send to backend' },
                  { name: 'actions.submitSilent()',  color: 'violet', desc: 'Send to backend, no user bubble' },
                  { name: 'actions.appendBubble()',  color: 'teal',   desc: 'Client-side bubble, no API call' },
                  { name: 'actions.prefillInput()',  color: 'amber',  desc: 'Pre-fill composer for user editing' },
                ].map(({ name, color, desc }) => (
                  <div key={name} className={`rounded-xl p-3 border ${{
                    indigo:'bg-indigo-50 border-indigo-100',
                    violet:'bg-violet-50 border-violet-100',
                    teal:  'bg-teal-50 border-teal-100',
                    amber: 'bg-amber-50 border-amber-100',
                  }[color]}`}>
                    <code className="text-xs font-mono font-bold text-slate-700">{name}</code>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
              <CodeBlock lang="ts" code={`interface ChatActions {\n  /** Add a user bubble and send message to backend */\n  submit(displayText: string, inputParams?: object): void;\n\n  /** Send inputParams silently — no user bubble shown */\n  submitSilent(inputParams: object): void;\n\n  /** Inject a bubble without an API call */\n  appendBubble(text: string, role?: 'user' | 'assistant'): void;\n\n  /** Pre-populate the composer — user reviews and sends */\n  prefillInput(text: string): void;\n}`} />
              <Tip color="pink" icon="🔁" title="Backward compat">
                <code className="font-mono text-xs bg-pink-100 px-1 rounded">onSubmit</code> is still passed as an alias for <code className="font-mono text-xs bg-pink-100 px-1 rounded">actions.submit</code> — old renderers keep working.
              </Tip>
            </DocCardBody>
          </DocCard>

          {/* Hooks */}
          <DocCard id="hooks">
            <SectionHeader gradient="bg-gradient-to-r from-fuchsia-500 to-pink-600" icon="🪝" title="Hooks &amp; Context" subtitle="Access chat actions from any component inside the widget tree" />
            <DocCardBody>
              <Tip color="violet" icon="📌" title="Scope">
                <code className="font-mono text-xs bg-violet-100 px-1 rounded">useChatActions</code> only works inside components rendered within <code className="font-mono text-xs bg-violet-100 px-1 rounded">&lt;ConvEngineChat&gt;</code> — i.e. custom renderer components.
              </Tip>
              <CodeBlock lang="jsx" code={`import { useChatActions } from 'convengine-chat';\n\n// Inside a renderer or any child of <ConvEngineChat>:\nfunction HelpButton() {\n  const { actions } = useChatActions();\n  return (\n    <button\n      className="ce-interactive-submit"\n      onClick={() => actions.submitSilent({ intent: 'help' })}\n    >\n      Get Help\n    </button>\n  );\n}`} />
            </DocCardBody>
          </DocCard>

        </div>
      </div>
    </div>
  );
}

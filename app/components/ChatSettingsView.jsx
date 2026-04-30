'use client';

import { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark }   from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx        from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx        from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import bash       from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css        from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json       from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markup     from 'react-syntax-highlighter/dist/esm/languages/prism/markup';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('html', markup);
SyntaxHighlighter.registerLanguage('xml', markup);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const LANG_BADGE_COLOR = {
  jsx:  '#61AFEF',
  tsx:  '#4FC1FF',
  js:   '#E5C07B',
  ts:   '#569CD6',
  bash: '#98C379',
  sh:   '#98C379',
  css:  '#C678DD',
  json: '#E06C75',
  html: '#E5995C',
};

// Map display lang → Prism registered language id
const PRISM_LANG = {
  jsx: 'jsx', tsx: 'tsx',
  js: 'javascript', ts: 'typescript',
  bash: 'bash', sh: 'bash',
  css: 'css', json: 'json', html: 'html',
};

function CodeBlock({ code, lang = 'jsx' }) {
  const [copied, setCopied] = useState(false);
  const key         = lang.toLowerCase();
  const badgeColor  = LANG_BADGE_COLOR[key] ?? '#94a3b8';
  const hljsLang    = PRISM_LANG[key] ?? 'jsx';

  function copy() {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#1c2030] px-4 py-2">
        <div className="flex items-center gap-2">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: badgeColor, flexShrink: 0, display: 'inline-block' }} />
          <span className="text-xs font-mono font-semibold" style={{ color: badgeColor }}>{lang}</span>
        </div>
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

      {/* Syntax-highlighted body */}
      <SyntaxHighlighter
        language={hljsLang}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1rem 1.25rem',
          background: '#171c2b',
          fontSize: '0.72rem',
          lineHeight: '1.65',
          overflowX: 'auto',
          borderRadius: 0,
        }}
        codeTagProps={{ style: { fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace" } }}
      >
        {code}
      </SyntaxHighlighter>
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
      <div className="flex flex-wrap gap-1.5">
        {COLOR_PALETTE.map((c) => (
          <button
            key={c}
            title={c}
            onClick={() => handleSwatchClick(c)}
            style={{ background: c }}
            className={`w-7 h-7 flex-shrink-0 rounded-lg border-2 transition-all hover:scale-110 active:scale-95 ${
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
        className={`relative mt-0.5 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${checked ? 'bg-indigo-500' : 'bg-slate-200'}`}
        style={{ width: 40, height: 22, overflow: 'hidden' }}
      >
        <span
          className="absolute top-[2px] left-0 bg-white rounded-full shadow transition-transform duration-200"
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
// Default SVG bodies for the five user-facing icons
// (wrapping <svg> is added at runtime; only the inner path/shape goes here)
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_ICON_SVGS = {
  // ── Content icons ────────────────────────────────────────────────────────
  ChatBubbleIcon: `<path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" fill="currentColor"/>`,
  AgentIcon: `<path d="M6 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4"/><path d="M12 2v2"/><path d="M9 12v9"/><path d="M15 12v9"/><path d="M5 16l4-2"/><path d="M15 14l4 2"/><path d="M9 18h6"/><circle cx="10" cy="8" r=".7" fill="currentColor"/><circle cx="14" cy="8" r=".7" fill="currentColor"/>`,
  UserIcon: `<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>`,
  SendIcon: `<path d="M3 20L21 12L3 4L3 10L15 12L3 14L3 20Z" fill="currentColor"/>`,
  ThumbUpIcon: `<path d="M7 10v10"/><path d="M3 10h4v10H3z"/><path d="M7 20h8.2a2.3 2.3 0 0 0 2.2-1.7l1.3-4.6a2.3 2.3 0 0 0-2.2-2.9H12l.8-4.1a2 2 0 0 0-2-2.4H10l-3 5.7V20z"/>`,
  ThumbDownIcon: `<path d="M7 14V4"/><path d="M3 4h4v10H3z"/><path d="M7 4h8.2a2.3 2.3 0 0 1 2.2 1.7l1.3 4.6a2.3 2.3 0 0 1-2.2 2.9H12l.8 4.1a2 2 0 0 1-2 2.4H10l-3-5.7V4z"/>`,
  // ── UI control icons ─────────────────────────────────────────────────────
  CloseIcon:          `<path d="M18 6L6 18M6 6l12 12"/>`,
  MinimizeIcon:       `<path d="M5 12h14"/>`,
  MaximizeIcon:       `<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>`,
  RestoreIcon:        `<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>`,
  RestoreFromMinIcon: `<path d="M5 15l7-6 7 6"/><line x1="4" y1="20" x2="20" y2="20"/>`,
  SunIcon:            `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>`,
  MoonIcon:           `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
  AuditIcon:          `<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 14l2 2 4-4"/>`,
  NewChatIcon:        `<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>`,
  LayoutIcon:         `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>`,
  PopoutIcon:         `<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>`,
  PanelLeftIcon:      `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>`,
  PanelRightIcon:     `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/>`,
};

const ICON_META = {
  // ── Content icons ──────────────────────────────────────────────────────
  ChatBubbleIcon:     { label: 'FAB / Launcher',      hint: 'config.icons.ChatBubbleIcon',     fill: true,  where: 'FAB open button',              group: 'Content Icons' },
  AgentIcon:          { label: 'Agent Avatar',         hint: 'config.icons.AgentIcon',          fill: false, where: 'Every assistant message',      group: 'Content Icons' },
  UserIcon:           { label: 'User Avatar',          hint: 'config.icons.UserIcon',           fill: false, where: 'Every user message',            group: 'Content Icons' },
  SendIcon:           { label: 'Send Button',          hint: 'config.icons.SendIcon',           fill: true,  where: 'Composer send button',         group: 'Content Icons' },
  ThumbUpIcon:        { label: 'Feedback Thumbs Up',   hint: 'config.icons.ThumbUpIcon',        fill: false, where: 'Feedback row (below AI)',       group: 'Content Icons' },
  ThumbDownIcon:      { label: 'Feedback Thumbs Down', hint: 'config.icons.ThumbDownIcon',      fill: false, where: 'Feedback row (below AI)',       group: 'Content Icons' },
  // ── UI control icons ───────────────────────────────────────────────────
  CloseIcon:          { label: 'Close',                hint: 'config.icons.CloseIcon',          fill: false, where: 'Panel close button',            group: 'UI Control Icons' },
  MinimizeIcon:       { label: 'Minimize',             hint: 'config.icons.MinimizeIcon',       fill: false, where: 'Panel minimize button',         group: 'UI Control Icons' },
  MaximizeIcon:       { label: 'Maximize',             hint: 'config.icons.MaximizeIcon',       fill: false, where: 'Panel maximize to fullscreen',  group: 'UI Control Icons' },
  RestoreIcon:        { label: 'Restore',              hint: 'config.icons.RestoreIcon',        fill: false, where: 'Panel restore from fullscreen', group: 'UI Control Icons' },
  RestoreFromMinIcon: { label: 'Restore from Min',     hint: 'config.icons.RestoreFromMinIcon', fill: false, where: 'Panel restore from minimized',  group: 'UI Control Icons' },
  SunIcon:            { label: 'Light Mode Toggle',    hint: 'config.icons.SunIcon',            fill: false, where: 'Header dark/light toggle',      group: 'UI Control Icons' },
  MoonIcon:           { label: 'Dark Mode Toggle',     hint: 'config.icons.MoonIcon',           fill: false, where: 'Header dark/light toggle',      group: 'UI Control Icons' },
  AuditIcon:          { label: 'Audit Trail Toggle',   hint: 'config.icons.AuditIcon',          fill: false, where: 'Header audit toggle button',    group: 'UI Control Icons' },
  NewChatIcon:        { label: 'New Chat',             hint: 'config.icons.NewChatIcon',        fill: false, where: 'Header new chat button',        group: 'UI Control Icons' },
  LayoutIcon:         { label: 'Mode Picker',          hint: 'config.icons.LayoutIcon',         fill: false, where: 'Header mode picker button',     group: 'UI Control Icons' },
  PopoutIcon:         { label: 'Popout',               hint: 'config.icons.PopoutIcon',         fill: false, where: 'Panel popout button',           group: 'UI Control Icons' },
  PanelLeftIcon:      { label: 'Panel Left',           hint: 'config.icons.PanelLeftIcon',      fill: false, where: 'Mode picker → left sidepanel',  group: 'UI Control Icons' },
  PanelRightIcon:     { label: 'Panel Right',          hint: 'config.icons.PanelRightIcon',     fill: false, where: 'Mode picker → right sidepanel', group: 'UI Control Icons' },
};

/** Renders a live SVG preview from raw inner-SVG markup */
function SvgPreview({ innerSvg, fill = false, size = 28 }) {
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${fill ? 'currentColor' : 'none'}" stroke="${fill ? 'none' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${innerSvg}</svg>`;
  return (
    <div
      style={{ color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', width: size + 8, height: size + 8 }}
      dangerouslySetInnerHTML={{ __html: svgStr }}
    />
  );
}

/** Converts raw inner-SVG string to a React component usable as a config.icons value */
function svgStringToComponent(innerSvg, fill = false) {
  return function DynamicIcon(props) {
    return (
      <svg
        className="ce-icon"
        viewBox="0 0 24 24"
        fill={fill ? 'currentColor' : 'none'}
        stroke={fill ? 'none' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: innerSvg }}
        {...props}
      />
    );
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Color asset inputs — light & dark variants (like iOS Color Assets)
// ─────────────────────────────────────────────────────────────────────────────
const COLOR_DEFAULTS = {
  bubbleUserBg:    { light: '#6366f1', dark: 'linear-gradient(90deg, rgba(37,99,235,0.55) 0%, rgba(96,165,250,0.38) 100%)' },
  bubbleUserText:  { light: '#ffffff',  dark: '#eaf2ff' },
  bubbleAgentBg:   { light: '#f1f5f9',  dark: '#2b2b2b' },
  bubbleAgentText: { light: '#1e293b',  dark: '#f2f6fa' },
  panelBg:         { light: '#ffffff',  dark: '#212121' },
  composerBg:      { light: '#ffffff',  dark: '#2b2b2b' },
};

function ColorVariantRow({ isDarkMode, value, defaultVal, onChange }) {
  const isHex = /^#[0-9a-fA-F]{6}$/.test(value);
  const swatchBg = value || defaultVal || null;
  return (
    <div className={`flex items-center gap-2 rounded-xl px-2.5 py-2 ${
      isDarkMode
        ? 'bg-[#1c1c1c] border border-[#333]'
        : 'bg-white border border-slate-100'
    }`}>
      <span className="text-sm flex-shrink-0 w-5 text-center select-none leading-none">
        {isDarkMode ? '🌙' : '☀️'}
      </span>
      <div
        className="w-6 h-6 rounded-md flex-shrink-0"
        style={{
          background: swatchBg ?? 'repeating-linear-gradient(45deg,#e2e8f0 0,#e2e8f0 4px,#f8fafc 4px,#f8fafc 8px)',
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
        }}
      />
      <input
        type="text"
        value={value}
        placeholder={defaultVal || (isDarkMode ? 'dark value…' : 'light value…')}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 text-[10px] font-mono rounded-lg px-2.5 py-1.5 outline-none border focus:ring-1 ${
          isDarkMode
            ? 'bg-[#252525] border-[#3a3a3a] text-slate-200 placeholder:text-[#555] focus:border-indigo-500 focus:ring-indigo-900/60'
            : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-300 focus:border-indigo-400 focus:ring-indigo-100'
        }`}
      />
      <label className="cursor-pointer flex-shrink-0 relative">
        <span className={`flex items-center justify-center w-6 h-6 rounded-md border text-xs select-none transition-colors ${
          isDarkMode
            ? 'bg-[#2b2b2b] border-[#3a3a3a] text-slate-400 hover:border-indigo-500'
            : 'bg-white border-slate-200 hover:bg-slate-50'
        }`}>🎨</span>
        <input
          type="color"
          value={isHex ? value : '#6366f1'}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </label>
      {value && (
        <button
          onClick={() => onChange('')}
          title="Clear — revert to built-in default"
          className={`w-6 h-6 flex items-center justify-center rounded-md border text-[10px] transition-colors ${
            isDarkMode
              ? 'border-[#3a3a3a] bg-[#2b2b2b] text-slate-500 hover:text-rose-400 hover:border-rose-800'
              : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-300'
          }`}
        >✕</button>
      )}
    </div>
  );
}

function ColorAssetInput({ configKey, label, hint, value, onChange }) {
  const defaults = COLOR_DEFAULTS[configKey] ?? { light: '', dark: '' };
  const v = value ?? { light: '', dark: '' };
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-slate-700 leading-none">{label}</p>
        <p className="text-[10px] text-slate-400 font-mono">{hint}</p>
      </div>
      <div className="space-y-1">
        <ColorVariantRow
          isDarkMode={false}
          value={v.light}
          defaultVal={defaults.light}
          onChange={(s) => onChange({ ...v, light: s })}
        />
        <ColorVariantRow
          isDarkMode={true}
          value={v.dark}
          defaultVal={defaults.dark}
          onChange={(s) => onChange({ ...v, dark: s })}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Playground
// ─────────────────────────────────────────────────────────────────────────────
function buildGeneratedCode(settings, iconSvgs) {
  const m     = settings.chatMode;
  const mode  = m === 'fullscreen' ? 'fullscreen' : m.startsWith('sidepanel') ? 'sidepanel' : 'panel';
  const align = m.startsWith('sidepanel') ? `\n  align="${m === 'sidepanel-left' ? 'left' : 'right'}"` : '';
  const extras = [
    settings.title       !== 'ConvEngine Assistant'               ? `    title: "${settings.title}",` : null,
    settings.subtitle    !== "Ask me anything \u2014 I'll do my best to help." ? `    subtitle: "${settings.subtitle}",` : null,
    settings.placeholder !== 'Ask ConvEngine\u2026'               ? `    placeholder: "${settings.placeholder}",` : null,
    !settings.showHeaderDot       ? '    showHeaderDot: false,'       : null,
    !settings.showLandingAvatar   ? '    showLandingAvatar: false,'   : null,
    !settings.showLandingSubtitle ? '    showLandingSubtitle: false,' : null,
    !settings.showNewChat         ? '    showNewChat: false,'         : null,
    !settings.showLayoutPicker    ? '    showLayoutPicker: false,'    : null,
    !settings.showMaximize        ? '    showMaximize: false,'        : null,
    !settings.showMinimize        ? '    showMinimize: false,'        : null,
    ...(['bubbleUserBg','bubbleUserText','bubbleAgentBg','bubbleAgentText','panelBg','composerBg'].map((key) => {
      const v = settings[key];
      const l = v?.light?.trim(); const d = v?.dark?.trim();
      if (!l && !d) return null;
      const ser = (l && d) ? `{ light: "${l}", dark: "${d}" }` : l ? `"${l}"` : `{ dark: "${d}" }`;
      return `    ${key}: ${ser},`;
    })),
  ].filter(Boolean).join('\n');
  const changedIcons = Object.keys(ICON_META).filter(k => iconSvgs[k] !== DEFAULT_ICON_SVGS[k]);
  const iconsSnippet = changedIcons.length
    ? `\n    icons: {\n${changedIcons.map(k => `      // custom ${k} \u2014 replace with your React component\n      ${k}: My${k},`).join('\n')}\n    },`
    : '';
  return `<ConvEngineChat\n  mode="${mode}"${align}\n  config={{\n    apiHost: "http://localhost:8080",\n    showFeedback: ${settings.showFeedback},\n    showAudit: ${settings.showAudit},\n    showDarkModeLightMode: ${settings.showDarkModeLightMode},${extras ? '\n' + extras : ''}${iconsSnippet}\n  }}\n  theme={{ "color-accent": "${settings.accentColor}" }}\n/>`;
}

function PlaygroundPanel({ settings, onChange, iconSvgs, onIconChange, onIconReset }) {
  const generatedCode = buildGeneratedCode(settings, iconSvgs);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 rounded-t-2xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>🎛️</span> Live Config Playground
        </h3>
        <p className="text-xs text-indigo-200 mt-0.5">Toggle settings below — the chat widget updates instantly.</p>
      </div>

      {/* ── Sticky Generated Usage ── */}
      <div className="sticky top-14 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm px-5 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generated Usage</p>
          <span className="text-[10px] text-slate-400">Updates live as you change settings ↓</span>
        </div>
        <CodeBlock lang="jsx" code={generatedCode} />
      </div>

      <div className="p-5 space-y-6">
        {/* ── Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Toggle checked={settings.showFeedback}          onChange={(v) => onChange({ ...settings, showFeedback: v })}          label="Show Feedback (👍👎)"    hint="config.showFeedback" />
          <Toggle checked={settings.showAudit}             onChange={(v) => onChange({ ...settings, showAudit: v })}             label="Show Audit Trail"        hint="config.showAudit" />
          <Toggle checked={settings.showDarkModeLightMode} onChange={(v) => onChange({ ...settings, showDarkModeLightMode: v })} label="Dark/Light Mode Toggle"  hint="config.showDarkModeLightMode" />
          <Toggle checked={settings.showHeaderDot}       onChange={(v) => onChange({ ...settings, showHeaderDot: v })}       label="Header Dot"          hint="config.showHeaderDot" />
          <Toggle checked={settings.showLandingAvatar}   onChange={(v) => onChange({ ...settings, showLandingAvatar: v })}   label="Landing Avatar"      hint="config.showLandingAvatar" />
          <Toggle checked={settings.showLandingSubtitle} onChange={(v) => onChange({ ...settings, showLandingSubtitle: v })} label="Landing Subtitle"    hint="config.showLandingSubtitle" />
          <Toggle checked={settings.showNewChat}       onChange={(v) => onChange({ ...settings, showNewChat: v })}       label="New Chat Button"      hint="config.showNewChat" />
          <Toggle checked={settings.showLayoutPicker}  onChange={(v) => onChange({ ...settings, showLayoutPicker: v })}  label="Chat View Switcher"   hint="config.showLayoutPicker" />
          <Toggle checked={settings.showMaximize}      onChange={(v) => onChange({ ...settings, showMaximize: v })}      label="Expand to Center"     hint="config.showMaximize" />
          <Toggle checked={settings.showMinimize}      onChange={(v) => onChange({ ...settings, showMinimize: v })}      label="Minimize Button"      hint="config.showMinimize" />
        </div>

        <hr className="border-slate-100" />

        {/* ── Text labels */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Text &amp; Labels</p>
          <div className="space-y-3">
            {[
              { key: 'title',       label: 'Header title',          hint: 'config.title',       placeholder: 'ConvEngine Assistant' },
              { key: 'subtitle',    label: 'Landing subtitle',       hint: 'config.subtitle',    placeholder: "Ask me anything..." },
              { key: 'placeholder', label: 'Composer placeholder',   hint: 'config.placeholder', placeholder: 'Ask ConvEngine…' },
            ].map(({ key, label, hint, placeholder }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-36 flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-700">{label}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{hint}</p>
                </div>
                <input
                  type="text"
                  value={settings[key]}
                  placeholder={placeholder}
                  onChange={(e) => onChange({ ...settings, [key]: e.target.value })}
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 font-mono"
                />
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-100" />

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Panel Mode</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'panel',           label: '⊞ FAB Panel' },
              { id: 'sidepanel-right', label: '\u25b7 Right Side' },
              { id: 'sidepanel-left',  label: '\u25c1 Left Side' },
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
            {/* Fullscreen — opens new tab */}
            <button
              onClick={() => {
                onChange({ ...settings, chatMode: 'fullscreen' });
                const p = new URLSearchParams({
                  accent:          settings.accentColor,
                  feedback:        String(settings.showFeedback),
                  audit:           String(settings.showAudit),
                  darkMode:        String(settings.showDarkModeLightMode),
                  title:           settings.title       || '',
                  subtitle:        settings.subtitle    || '',
                  placeholder:     settings.placeholder || '',
                  headerDot:       String(settings.showHeaderDot),
                  landingAvatar:   String(settings.showLandingAvatar),
                  landingSubtitle: String(settings.showLandingSubtitle),
                  showNewChat:     String(settings.showNewChat),
                  showLayoutPicker: String(settings.showLayoutPicker),
                  showMaximize:    String(settings.showMaximize),
                  showMinimize:    String(settings.showMinimize),
                });
                window.open(`/fullscreen?${p.toString()}`, '_blank', 'noopener,noreferrer');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                settings.chatMode === 'fullscreen'
                  ? 'bg-violet-500 border-violet-500 text-white shadow-md shadow-violet-200'
                  : 'border-violet-200 text-violet-600 hover:bg-violet-50'
              }`}>
              ⛶ Fullscreen
              <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 1h4v4M11 1l-5 5M5 11H1V7M1 11l5-5" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accent Color</p>
          <ColorPicker value={settings.accentColor} onChange={(c) => onChange({ ...settings, accentColor: c })} />
        </div>

        <hr className="border-slate-100" />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chat Colors</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Light &amp; dark variants — like iOS Color Assets. Placeholder = built-in default. Leave blank to inherit it.</p>
            </div>
            <button
              type="button"
              onClick={() => onChange({ ...settings, previewDark: !settings.previewDark })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border flex-shrink-0 transition-all select-none ${
                settings.previewDark
                  ? 'bg-[#1c1c1c] border-[#444] text-slate-200 shadow-inner'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {settings.previewDark ? '🌙 Dark preview' : '☀️ Light preview'}
            </button>
          </div>
          <div className="space-y-4">
            <ColorAssetInput configKey="bubbleUserBg"    label="User bubble bg"    hint="config.bubbleUserBg"    value={settings.bubbleUserBg}    onChange={(v) => onChange({ ...settings, bubbleUserBg:    v })} />
            <ColorAssetInput configKey="bubbleUserText"  label="User bubble text"  hint="config.bubbleUserText"  value={settings.bubbleUserText}  onChange={(v) => onChange({ ...settings, bubbleUserText:  v })} />
            <ColorAssetInput configKey="bubbleAgentBg"   label="Agent bubble bg"   hint="config.bubbleAgentBg"   value={settings.bubbleAgentBg}   onChange={(v) => onChange({ ...settings, bubbleAgentBg:   v })} />
            <ColorAssetInput configKey="bubbleAgentText" label="Agent bubble text" hint="config.bubbleAgentText" value={settings.bubbleAgentText} onChange={(v) => onChange({ ...settings, bubbleAgentText: v })} />
            <ColorAssetInput configKey="panelBg"         label="Panel bg"          hint="config.panelBg"         value={settings.panelBg}         onChange={(v) => onChange({ ...settings, panelBg:         v })} />
            <ColorAssetInput configKey="composerBg"      label="Composer bg"       hint="config.composerBg"      value={settings.composerBg}      onChange={(v) => onChange({ ...settings, composerBg:      v })} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Icons</p>
            <button
              onClick={onIconReset}
              className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-400 px-2.5 py-1 rounded-lg transition-all bg-indigo-50 hover:bg-indigo-100"
            >
              ↺ Reset to defaults
            </button>
          </div>
          <p className="text-[11px] text-slate-400">Paste inner SVG markup (paths/shapes only, no outer &lt;svg&gt; tag). Updates live.</p>
          <div className="space-y-3">
            {Object.entries(ICON_META).reduce((acc, [key, meta], idx, arr) => {
              const { label, hint, fill, where, group } = meta;
              const prevGroup = idx > 0 ? arr[idx - 1][1].group : null;
              if (group !== prevGroup) {
                acc.push(
                  <div key={`grp-${group}`} className="pt-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{group}</p>
                  </div>
                );
              }
              const isDefault = iconSvgs[key] === DEFAULT_ICON_SVGS[key];
              acc.push(
                <div key={key} className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-slate-200 flex-shrink-0">
                      <SvgPreview innerSvg={iconSvgs[key]} fill={fill} size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700">{label}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{hint}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Used in: {where}</p>
                    </div>
                    {!isDefault && (
                      <button
                        onClick={() => onIconChange(key, DEFAULT_ICON_SVGS[key])}
                        className="text-[10px] text-slate-400 hover:text-indigo-500 px-2 py-0.5 rounded border border-slate-200 hover:border-indigo-300 bg-white transition-all"
                      >
                        reset
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={iconSvgs[key]}
                    onChange={(e) => onIconChange(key, e.target.value)}
                    spellCheck={false}
                    className="w-full text-[10px] font-mono border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white resize-y"
                  />
                </div>
              );
              return acc;
            }, [])}
          </div>
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
export function ChatSettingsView({ onSettingsChange, hideHeader = false }) {
  const [settings, setSettings] = useState({
    showFeedback:          true,
    showAudit:             false,
    showDarkModeLightMode: true,
    chatMode:              'panel',
    accentColor:           '#6366f1',
    // Text
    title:       'ConvEngine Assistant',
    subtitle:    "Ask me anything — I'll do my best to help.",
    placeholder: 'Ask ConvEngine…',
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
    // Preview
    previewDark:     false,
  });

  const [iconSvgs, setIconSvgs] = useState({ ...DEFAULT_ICON_SVGS });

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

  function buildIconComponents(svgs) {
    const result = {};
    for (const [key, svg] of Object.entries(svgs)) {
      if (svg !== DEFAULT_ICON_SVGS[key]) {
        result[key] = svgStringToComponent(svg, ICON_META[key]?.fill ?? false);
      }
    }
    return result;
  }

  return (
    <div className="space-y-8">
      {/* Page header — hidden in quickstart mode (title shown in shell nav) */}
      {!hideHeader && (
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
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">On this page</p>
          <NavDot href="#install">Installation</NavDot>
          <NavDot href="#quickstart">Quick Start</NavDot>
          <NavDot href="#props">Component Props</NavDot>
          <NavDot href="#config">config Object</NavDot>
          <NavDot href="#colors">Color Theming</NavDot>
          <NavDot href="#theme">Theme Tokens</NavDot>
          <NavDot href="#icons">Custom Icons</NavDot>
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
`import { ConvEngineChat, useChatActions } from 'convengine-chat';
import 'convengine-chat/style.css'; // once in your app entry

// ─── Optional: custom icon components ───────────────────────────────────────
// Each icon receives className="ce-icon" — omit width/height; CSS sizes it.
function MyFabIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor"
      className="ce-icon" aria-hidden="true" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12
               17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

// ─── Optional: custom renderer provider ─────────────────────────────────────
// priority > 100 runs before built-ins. match() receives the parsed payload.
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

// ─── Mode 1: Floating FAB panel ──────────────────────────────────────────────
<ConvEngineChat
  mode="panel"           // "panel" | "sidepanel" | "fullscreen"
  position="bottom"      // "bottom" | "top"   — FAB vertical anchor
  align="right"          // "right"  | "left"  — FAB horizontal anchor

  // Called when the user picks a different mode from the header
  onModeChange={(newMode) => console.log('mode changed to', newMode)}

  config={{
    // ── Backend ─────────────────────────────────────────────────────────
    apiHost:        'http://localhost:8080', // ConvEngine server base URL
    conversationId: undefined,              // resume existing conversation

    // ── Text & Labels ───────────────────────────────────────────────────
    title:       'ConvEngine Assistant',    // header + landing heading
    subtitle:    "Ask me anything — I'll do my best to help.",
    placeholder: 'Ask ConvEngine…',         // composer input placeholder

    // ── Visibility flags ────────────────────────────────────────────────
    showFeedback:          true,   // 👍👎 row under every AI message
    showAudit:             false,  // audit trail side panel
    showDarkModeLightMode: false,  // 🌙/☀️ toggle button in header
    showHeaderDot:         true,   // pulsing dot next to title
    showLandingAvatar:     true,   // bot avatar on landing screen
    showLandingSubtitle:   true,   // subtitle on landing screen

    // ── Custom icons ────────────────────────────────────────────────────
    // Each value must be a React component that renders an SVG.
    // Omit any key to keep the default icon.
    icons: {
      ChatBubbleIcon: MyFabIcon,  // FAB open button
      // AgentIcon:   MyRobotIcon, // avatar next to every AI message
      // UserIcon:    MyPersonIcon,// avatar next to every user message
      // SendIcon:    MyArrowIcon, // send button inside composer
      // ThumbUpIcon: MyThumbUp,
      // ThumbDownIcon: MyThumbDown,
    },

    // ── Custom renderers ────────────────────────────────────────────────
    // Injected before built-ins. Highest priority wins.
    renderers: [myRenderer],

    // ── Lifecycle callbacks ─────────────────────────────────────────────
    onMessage:  (text) => console.log('user sent:', text),
    onResponse: (text) => console.log('AI replied:', text),
  }}

  // ── Theme: CSS token overrides ─────────────────────────────────────────
  // Keys are shorthand (auto-prefixed --ce-) or full CSS var names.
  theme={{
    'color-accent':        '#6366f1', // → --ce-color-accent
    'color-accent-hover':  '#4f46e5',
    'panel-width':         '460px',   // → --ce-panel-width
    'panel-height':        '740px',   // → --ce-panel-height
    'sidepanel-width':     '400px',   // → --ce-sidepanel-width
    'bg-panel':            '#ffffff', // panel / sidepanel background
    'bg-bubble-user':      '#6366f1', // user message bubble fill
    'bg-bubble-agent':     '#f1f5f9', // AI message bubble fill
    'font-family':         '"Inter", sans-serif',
  }}
/>

// ─── Mode 2: Full-height side drawer ─────────────────────────────────────────
<ConvEngineChat
  mode="sidepanel"
  align="right"           // "right" | "left"
  config={{ apiHost: 'http://localhost:8080' /* + any config keys above */ }}
  theme={{ 'sidepanel-width': '420px' }}
/>

// ─── Mode 3: Fills parent container (full-page / embedded) ───────────────────
<div style={{ height: '100vh' }}>
  <ConvEngineChat
    mode="fullscreen"
    config={{ apiHost: 'http://localhost:8080' /* + any config keys above */ }}
  />
</div>`
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
                <PropRow prop="apiHost"               type='string'   defaultVal='"http://localhost:8080"'                     description='Base URL of your ConvEngine backend.' />
                <PropRow prop="conversationId"        type='string'   defaultVal='undefined'                                   description='Resume an existing conversation by ID.' />
                <PropRow prop="title"                 type='string'   defaultVal='"ConvEngine Assistant"'                      description='Header title and landing screen heading.' />
                <PropRow prop="subtitle"              type='string'   defaultVal={"\"Ask me anything \u2014 I'll do my best to help.\""} description='Landing screen subtitle shown below the title.' />
                <PropRow prop="placeholder"           type='string'   defaultVal='"Ask ConvEngine…"'                           description='Composer input placeholder text.' />
                <PropRow prop="showFeedback"          type='boolean'  defaultVal='true'                                        description='Show 👍👎 feedback buttons under assistant messages.' />
                <PropRow prop="showAudit"             type='boolean'  defaultVal='false'                                       description='Show the audit trail side panel.' />
                <PropRow prop="showDarkModeLightMode" type='boolean'  defaultVal='false'                                       description='Show the dark/light mode toggle button in the header.' />
                <PropRow prop="showHeaderDot"         type='boolean'  defaultVal='true'                                        description='Show the pulsing accent dot next to the header title.' />
                <PropRow prop="showLandingAvatar"     type='boolean'  defaultVal='true'                                        description='Show the bot avatar icon on the landing screen.' />
                <PropRow prop="showLandingSubtitle"   type='boolean'  defaultVal='true'                                        description='Show the subtitle text on the landing screen.' />
                <PropRow prop="icons"                 type='object'   defaultVal='{}'                                          description='Override any icon component. Slots: ChatBubbleIcon (FAB), AgentIcon (AI avatar), UserIcon (user avatar), SendIcon (composer send), ThumbUpIcon, ThumbDownIcon. Each value must be a React component — see Custom Icons section below.' />
                <PropRow prop="renderers"             type='Array'    defaultVal='[]'                                          description='Custom renderer providers injected before built-ins.' />
                <PropRow prop="bubbleUserBg"          type='string | { light, dark }'  defaultVal='undefined'  description='User bubble background. Plain string applies to both modes; pass { light, dark } for per-theme values. Accepts hex, rgba, or any CSS gradient. Overrides --ce-bg-bubble-user.' />
                <PropRow prop="bubbleUserText"        type='string | { light, dark }'  defaultVal='undefined'  description='User bubble text color. Supports per-theme { light, dark } object. Overrides --ce-text-bubble-user.' />
                <PropRow prop="bubbleAgentBg"         type='string | { light, dark }'  defaultVal='undefined'  description='Assistant bubble background. Supports per-theme { light, dark } object or gradient string. Overrides --ce-bg-bubble-agent.' />
                <PropRow prop="bubbleAgentText"       type='string | { light, dark }'  defaultVal='undefined'  description='Assistant bubble text color. Supports per-theme { light, dark } object. Overrides --ce-text-bubble-agent.' />
                <PropRow prop="panelBg"               type='string | { light, dark }'  defaultVal='undefined'  description='Chat panel background color. Supports per-theme { light, dark } object. Overrides --ce-bg-panel.' />
                <PropRow prop="composerBg"            type='string | { light, dark }'  defaultVal='undefined'  description='Composer input area background. Supports per-theme { light, dark } object. Overrides --ce-bg-composer.' />
                <PropRow prop="defaultDark"           type='boolean'                   defaultVal='false'       description='Seed the widget in dark mode on first render. Useful for playground preview or apps that default to dark theme.' />
                <PropRow prop="onMessage"             type='function' defaultVal='undefined'                                   description='(text: string) => void — fired when the user sends a message.' />
                <PropRow prop="onResponse"            type='function' defaultVal='undefined'                                   description='(text: string) => void — fired when an assistant response arrives.' />
              </PropsTable>
            </DocCardBody>
          </DocCard>

          {/* Per-Theme Color API */}
          <DocCard id="colors">
            <SectionHeader gradient="bg-gradient-to-r from-violet-500 to-fuchsia-600" icon="🌗" title="Per-Theme Color API" subtitle="Different colors for light and dark mode — one config, two appearances" />
            <DocCardBody>
              <Tip color="violet" icon="💡" title="The concept — iOS Color Assets for the web">
                Every color config prop accepts <strong>two shapes</strong>: a plain string (applies to both light and dark) or a{' '}
                <code className="font-mono text-xs bg-violet-100 px-1 rounded">{'{'}{ ' light, dark ' }{'}'}</code>{' '}
                object that lets you specify a different value per theme. ConvEngine reads the active theme at render time and automatically picks the right variant — just like iOS Color Assets or Android night-mode resources. If only one key is present, the other falls back to what is set.
              </Tip>

              {/* Shape comparison */}
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
                    <code className="block text-xs font-mono text-indigo-600">bubbleUserBg: {'{'} light: &quot;#6366f1&quot;, dark: &quot;...&quot; {'}'}</code>
                    <p className="text-xs text-slate-500">ConvEngine picks <code className="font-mono bg-violet-50 px-1 rounded">light</code> in ☀️, <code className="font-mono bg-violet-50 px-1 rounded">dark</code> in 🌙.</p>
                  </div>
                </div>
              </div>

              {/* Prop → CSS var table */}
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
                        ['bubbleUserBg',    '--ce-bg-bubble-user',    'User message bubble — fill or gradient'],
                        ['bubbleUserText',  '--ce-text-bubble-user',  'User message bubble text'],
                        ['bubbleAgentBg',   '--ce-bg-bubble-agent',   'Assistant message bubble — fill or gradient'],
                        ['bubbleAgentText', '--ce-text-bubble-agent', 'Assistant message bubble text'],
                        ['panelBg',         '--ce-bg-panel',          'Chat panel / sidepanel background'],
                        ['composerBg',      '--ce-bg-composer',       'Composer (input area) background'],
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

              {/* Example 1 */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Example 1 — Plain string (same color in both modes)</p>
                <p className="text-sm text-slate-600">Pass a hex, rgba, or CSS color string. ConvEngine applies it regardless of whether the widget is in light or dark mode.</p>
                <CodeBlock lang="jsx" code={`<ConvEngineChat\n  config={{\n    bubbleUserBg:   "#6366f1",  // indigo — both modes\n    bubbleUserText: "#ffffff",\n    bubbleAgentBg:  "#f1f5f9",\n  }}\n/>`} />
              </div>

              {/* Example 2 */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Example 2 — Per-theme object (different color per mode)</p>
                <p className="text-sm text-slate-600">
                  Pass <code className="font-mono text-xs bg-slate-100 px-1 rounded">{'{ light: "...", dark: "..." }'}</code>. ConvEngine resolves the correct value every time the theme changes — no extra state needed on your side.
                </p>
                <CodeBlock lang="jsx" code={`<ConvEngineChat\n  config={{\n    bubbleUserBg: {\n      light: "#6366f1",   // ☀️ solid indigo\n      dark:  "#1e3a5f",   // 🌙 deep navy\n    },\n    bubbleAgentBg: {\n      light: "#f1f5f9",   // ☀️ slate-100\n      dark:  "#2b2b2b",   // 🌙 dark neutral\n    },\n    panelBg: {\n      light: "#ffffff",\n      dark:  "#1a1a1a",\n    },\n    composerBg: {\n      light: "#f8fafc",\n      dark:  "#212121",\n    },\n  }}\n/>`} />
              </div>

              {/* Example 3 */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Example 3 — Gradient user bubble for dark mode</p>
                <Tip color="blue" icon="🎨" title="Gradients work everywhere">
                  Any valid CSS <code className="font-mono text-xs bg-sky-100 px-1 rounded">background</code> value is accepted — including{' '}
                  <code className="font-mono text-xs bg-sky-100 px-1 rounded">linear-gradient</code>,{' '}
                  <code className="font-mono text-xs bg-sky-100 px-1 rounded">radial-gradient</code>, and multi-stop gradients.
                  Mix a solid hex in light mode with a gradient in dark mode — fully supported.
                </Tip>
                <CodeBlock lang="jsx" code={`<ConvEngineChat\n  config={{\n    bubbleUserBg: {\n      light: "#6366f1",\n      // 🌙 glass-blue gradient — matches convengine-ui dark default\n      dark:  "linear-gradient(90deg, rgba(37,99,235,0.55) 0%, rgba(96,165,250,0.38) 100%)",\n    },\n    bubbleAgentBg: {\n      light: "#f1f5f9",\n      dark:  "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",\n    },\n  }}\n/>`} />
              </div>

              {/* Example 4 */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Example 4 — Seed initial dark mode with <code className="font-mono text-pink-600">defaultDark</code></p>
                <Tip color="amber" icon="🌙" title="defaultDark">
                  The widget opens in light mode unless you set <code className="font-mono text-xs bg-amber-100 px-1 rounded">defaultDark: true</code>.
                  This seeds the first render. The user can still toggle if you also enable{' '}
                  <code className="font-mono text-xs bg-amber-100 px-1 rounded">showDarkModeLightMode</code>.
                </Tip>
                <CodeBlock lang="jsx" code={`<ConvEngineChat\n  config={{\n    defaultDark:          true,   // 🌙 widget opens in dark mode\n    showDarkModeLightMode: true,  // ☀️/🌙 toggle visible in header\n    bubbleUserBg: {\n      light: "#6366f1",\n      dark:  "linear-gradient(90deg, rgba(37,99,235,0.55) 0%, rgba(96,165,250,0.38) 100%)",\n    },\n    panelBg: {\n      light: "#ffffff",\n      dark:  "#1a1a1a",\n    },\n  }}\n/>`} />
              </div>

              {/* Example 5 */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Example 5 — Partial object (override only one mode)</p>
                <p className="text-sm text-slate-600">
                  You don&apos;t have to provide both keys. Omit one and it falls back to whatever the other key is set to.
                  If neither key has a value, the built-in CSS token default is used.
                </p>
                <CodeBlock lang="jsx" code={`// Only customise dark — light keeps the built-in default\n<ConvEngineChat\n  config={{\n    bubbleUserBg: {\n      dark: "linear-gradient(90deg, rgba(37,99,235,0.55) 0%, rgba(96,165,250,0.38) 100%)",\n    },\n  }}\n/>\n\n// Only customise light — dark keeps the built-in default\n<ConvEngineChat\n  config={{\n    panelBg: {\n      light: "#fdf4ff",   // lavender tint in light mode only\n    },\n  }}\n/>`} />
                <Tip color="green" icon="✅" title="Fallback resolution order">
                  <code className="font-mono text-xs bg-emerald-100 px-1 rounded">dark ?? light</code> in dark mode —{' '}
                  <code className="font-mono text-xs bg-emerald-100 px-1 rounded">light ?? dark</code> in light mode —{' '}
                  then the built-in CSS token if neither is set.
                </Tip>
              </div>
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

          {/* Custom Icons */}
          <DocCard id="icons">
            <SectionHeader gradient="bg-gradient-to-r from-violet-500 to-indigo-600" icon="🎨" title="Custom Icons" subtitle="Swap any built-in icon with your own React component" />
            <DocCardBody>
              <Tip color="violet" icon="💡" title="How it works">
                Pass an <code className="font-mono text-xs bg-violet-100 px-1 rounded">icons</code> object inside <code className="font-mono text-xs bg-violet-100 px-1 rounded">config</code>.
                Each key maps to a named icon slot. Any icon you don&apos;t override keeps its default.
                Every component receives standard SVG props and <code className="font-mono text-xs bg-violet-100 px-1 rounded">className=&quot;ce-icon&quot;</code>.
              </Tip>

              {/* ── Icon Showcase ─────────────────────────────────────────── */}
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
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              meta.fill
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {meta.fill ? 'filled' : 'stroked'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Full example ─────────────────────────────────────────── */}
              <CodeBlock lang="jsx" code={`import { ConvEngineChat } from 'convengine-chat';

// 1. Create your icon components.
//    Use className="ce-icon" so the library can size them correctly.
function StarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor"
      className="ce-icon" aria-hidden="true" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77
               l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function RocketIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="ce-icon" aria-hidden="true" {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2
               c.55-.67.53-1.67-.06-2.28a1.95 1.95 0 0 0-2.94.28z"/>
      <path d="M12 8 c0 0 .5-8 8-8 0 8-8 8-8 8"/>
      <path d="M6 18 L2 22"/>
    </svg>
  );
}

function HeartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor"
      className="ce-icon" aria-hidden="true" {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
               a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23
               l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

// 2. Pass them via config.icons — override only what you need.
<ConvEngineChat
  mode="panel"
  config={{
    apiHost: 'http://localhost:8080',
    icons: {
      // FAB button that opens the chat
      ChatBubbleIcon: StarIcon,

      // Avatar shown next to every assistant message
      AgentIcon: RocketIcon,

      // Avatar shown next to every user message
      UserIcon: HeartIcon,

      // Arrow inside the send button
      // SendIcon: MyArrowIcon,

      // Feedback thumbs
      // ThumbUpIcon: MyThumbUp,
      // ThumbDownIcon: MyThumbDown,
    },
  }}
/>`} />

              <Tip color="amber" icon="⚠️" title="Sizing">
                The library controls icon size via CSS (<code className="font-mono text-xs bg-amber-100 px-1 rounded">.ce-icon &#123; width / height &#125;</code>).
                Always omit <code className="font-mono text-xs bg-amber-100 px-1 rounded">width</code> / <code className="font-mono text-xs bg-amber-100 px-1 rounded">height</code> attributes on your SVG and let CSS handle it.
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

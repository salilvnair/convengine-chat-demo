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
const MODE_BADGE = {
  panel:      'bg-indigo-100 text-indigo-700',
  sidepanel:  'bg-violet-100 text-violet-700',
  fullscreen: 'bg-pink-100   text-pink-700',
};

function Toggle({ checked, onChange, label, hint, modes, accentColor }) {
  const checkedBg = accentColor || '#6366f1';
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${checked ? '' : 'bg-slate-200'}`}
        style={{ width: 40, height: 22, overflow: 'hidden', backgroundColor: checked ? checkedBg : undefined, '--tw-ring-color': checkedBg }}
      >
        <span
          className="absolute top-[2px] left-0 bg-white rounded-full shadow transition-transform duration-200"
          style={{ width: 18, height: 18, transform: checked ? 'translateX(20px)' : 'translateX(2px)' }}
        />
      </button>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-sm font-semibold text-slate-700 leading-snug">{label}</p>
          {modes && modes.map((m) => (
            <span key={m} className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${MODE_BADGE[m] ?? 'bg-slate-100 text-slate-500'}`}>{m}</span>
          ))}
        </div>
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
  LandingAvatarIcon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="currentColor" opacity="0.12"></circle><path d="M12 14a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2v-6z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M20 10v2M17 22v5M23 22v5M13 26l4-2M23 24l4 2M17 28h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><circle cx="17" cy="17" r="1" fill="currentColor"></circle><circle cx="23" cy="17" r="1" fill="currentColor"></circle></svg>`,
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
  LandingAvatarIcon:  { label: 'Landing Avatar',       hint: 'config.icons.LandingAvatarIcon',  fill: false, where: 'Landing screen bot avatar',     group: 'Content Icons',    modes: ['panel','sidepanel','fullscreen'] },
  ChatBubbleIcon:     { label: 'FAB / Launcher',       hint: 'config.icons.ChatBubbleIcon',     fill: true,  where: 'FAB open button',              group: 'Content Icons',    modes: ['panel','sidepanel'] },
  AgentIcon:          { label: 'Agent Avatar',         hint: 'config.icons.AgentIcon',          fill: false, where: 'Every assistant message',      group: 'Content Icons',    modes: ['panel','sidepanel','fullscreen'] },
  UserIcon:           { label: 'User Avatar',          hint: 'config.icons.UserIcon',           fill: false, where: 'Every user message',            group: 'Content Icons',    modes: ['panel','sidepanel','fullscreen'] },
  SendIcon:           { label: 'Send Button',          hint: 'config.icons.SendIcon',           fill: true,  where: 'Composer send button',         group: 'Content Icons',    modes: ['panel','sidepanel','fullscreen'] },
  ThumbUpIcon:        { label: 'Feedback Thumbs Up',   hint: 'config.icons.ThumbUpIcon',        fill: false, where: 'Feedback row (below AI)',       group: 'Content Icons',    modes: ['panel','sidepanel','fullscreen'] },
  ThumbDownIcon:      { label: 'Feedback Thumbs Down', hint: 'config.icons.ThumbDownIcon',      fill: false, where: 'Feedback row (below AI)',       group: 'Content Icons',    modes: ['panel','sidepanel','fullscreen'] },
  // ── UI control icons ───────────────────────────────────────────────────
  CloseIcon:          { label: 'Close',                hint: 'config.icons.CloseIcon',          fill: false, where: 'Panel close button',            group: 'UI Control Icons', modes: ['panel','sidepanel'] },
  MinimizeIcon:       { label: 'Minimize',             hint: 'config.icons.MinimizeIcon',       fill: false, where: 'Panel minimize button',         group: 'UI Control Icons', modes: ['panel'] },
  MaximizeIcon:       { label: 'Maximize',             hint: 'config.icons.MaximizeIcon',       fill: false, where: 'Panel maximize to fullscreen',  group: 'UI Control Icons', modes: ['panel'] },
  RestoreIcon:        { label: 'Restore',              hint: 'config.icons.RestoreIcon',        fill: false, where: 'Panel restore from fullscreen', group: 'UI Control Icons', modes: ['panel'] },
  RestoreFromMinIcon: { label: 'Restore from Min',     hint: 'config.icons.RestoreFromMinIcon', fill: false, where: 'Panel restore from minimized',  group: 'UI Control Icons', modes: ['panel'] },
  SunIcon:            { label: 'Light Mode Toggle',    hint: 'config.icons.SunIcon',            fill: false, where: 'Header dark/light toggle',      group: 'UI Control Icons', modes: ['panel','sidepanel','fullscreen'], themeOnly: 'dark'  },
  MoonIcon:           { label: 'Dark Mode Toggle',     hint: 'config.icons.MoonIcon',           fill: false, where: 'Header dark/light toggle',      group: 'UI Control Icons', modes: ['panel','sidepanel','fullscreen'], themeOnly: 'light' },
  AuditIcon:          { label: 'Audit Trail Toggle',   hint: 'config.icons.AuditIcon',          fill: false, where: 'Header audit toggle button',    group: 'UI Control Icons', modes: ['fullscreen'] },
  NewChatIcon:        { label: 'New Chat',             hint: 'config.icons.NewChatIcon',        fill: false, where: 'Header new chat button',        group: 'UI Control Icons', modes: ['panel','fullscreen'] },
  LayoutIcon:         { label: 'Mode Picker',          hint: 'config.icons.LayoutIcon',         fill: false, where: 'Header mode picker button',     group: 'UI Control Icons', modes: ['panel'] },
  PopoutIcon:         { label: 'Popout',               hint: 'config.icons.PopoutIcon',         fill: false, where: 'Panel popout button',           group: 'UI Control Icons', modes: ['panel'] },
  PanelLeftIcon:      { label: 'Panel Left',           hint: 'config.icons.PanelLeftIcon',      fill: false, where: 'Mode picker → left sidepanel',  group: 'UI Control Icons', modes: ['panel'] },
  PanelRightIcon:     { label: 'Panel Right',          hint: 'config.icons.PanelRightIcon',     fill: false, where: 'Mode picker → right sidepanel', group: 'UI Control Icons', modes: ['panel'] },
};

/** Renders a live SVG preview from raw inner-SVG markup */
function SvgPreview({ innerSvg, fill = false, size = 28, accentColor = '#6366f1' }) {
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${fill ? 'currentColor' : 'none'}" stroke="${fill ? 'none' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${innerSvg}</svg>`;
  return (
    <div
      style={{ color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', width: size + 8, height: size + 8 }}
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
  iconColor:       { light: '#64748b',  dark: '#9ca3af' },
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
// Compact icon tile grid + edit modal
// ─────────────────────────────────────────────────────────────────────────────
function IconGrid({ iconSvgs, onIconChange, onIconReset, currentMode, accentColor = '#6366f1', iconColorSetting, previewDark = false, onIconColorChange }) {
  const [editKey, setEditKey] = useState(null);
  const [copied,  setCopied]  = useState(null);
  const meta    = editKey ? ICON_META[editKey] : null;

  // Resolve the icon preview color: use iconColor setting variant first, fall back to accentColor
  const resolvedIconColor = previewDark
    ? (iconColorSetting?.dark?.trim()  || iconColorSetting?.light?.trim() || accentColor)
    : (iconColorSetting?.light?.trim() || iconColorSetting?.dark?.trim()  || accentColor);

  const currentTheme = previewDark ? 'dark' : 'light';

  function handleCopy(key) {
    navigator.clipboard?.writeText(iconSvgs[key]).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  const groups = {};
  Object.entries(ICON_META)
    .filter(([, m]) => !currentMode || m.modes.includes(currentMode))
    .filter(([, m]) => !m.themeOnly || m.themeOnly === currentTheme)
    .forEach(([k, m]) => {
      (groups[m.group] ??= []).push(k);
    });

  const anyModified = Object.keys(ICON_META).some(k => iconSvgs[k] !== DEFAULT_ICON_SVGS[k]);

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Icons</p>
          {anyModified && (
            <button
              onClick={onIconReset}
              className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-400 px-2.5 py-1 rounded-lg transition-all bg-indigo-50 hover:bg-indigo-100"
            >
              ↺ Reset all
            </button>
          )}
        </div>
        {Object.entries(groups).map(([grpName, keys]) => (
          <div key={grpName}>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{grpName}</p>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
              {keys.map((key) => {
                const m = ICON_META[key];
                const isModified = iconSvgs[key] !== DEFAULT_ICON_SVGS[key];
                return (
                  <div
                    key={key}
                    className="group relative flex flex-col items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl p-2 hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all"
                  >
                    {isModified && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-100">
                      <SvgPreview innerSvg={iconSvgs[key]} fill={m.fill} size={18} accentColor={resolvedIconColor} />
                    </div>
                    <p className="text-[9px] font-medium text-slate-500 text-center leading-tight line-clamp-2 w-full">{m.label}</p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-0.5">
                      <button
                        title="Copy SVG"
                        onClick={() => handleCopy(key)}
                        className="w-5 h-5 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-colors text-[9px] font-bold"
                      >
                        {copied === key ? '✓' : '⎘'}
                      </button>
                      <button
                        title="Edit SVG"
                        onClick={() => setEditKey(key)}
                        className="w-5 h-5 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-colors text-[10px]"
                      >
                        ✏
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {editKey && meta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setEditKey(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-5 w-[340px] space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800 text-sm">{meta.label}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{meta.hint}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Used in: {meta.where}</p>
              </div>
              <button
                onClick={() => setEditKey(null)}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
              >✕</button>
            </div>
            <div className="flex items-center justify-center h-14 bg-slate-50 rounded-xl border border-slate-100">
              <SvgPreview innerSvg={iconSvgs[editKey]} fill={meta.fill} size={32} accentColor={resolvedIconColor} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Inner SVG markup</p>
              <p className="text-[10px] text-slate-400">Paths/shapes only — no outer &lt;svg&gt; tag</p>
              <textarea
                rows={4}
                value={iconSvgs[editKey]}
                onChange={(e) => onIconChange(editKey, e.target.value)}
                spellCheck={false}
                className="w-full text-[10px] font-mono border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white resize-y"
              />
            </div>
            <div className="flex items-center justify-between">
              {iconSvgs[editKey] !== DEFAULT_ICON_SVGS[editKey] ? (
                <button
                  onClick={() => onIconChange(editKey, DEFAULT_ICON_SVGS[editKey])}
                  className="text-xs text-slate-400 hover:text-rose-500 border border-slate-200 hover:border-rose-300 px-2.5 py-1 rounded-lg bg-white transition-all"
                >
                  ↺ Reset
                </button>
              ) : <span />}
              <button
                onClick={() => setEditKey(null)}
                className="text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-1.5 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Compact color tile grid + edit modal
// ─────────────────────────────────────────────────────────────────────────────
const COLOR_TILE_META = [
  { key: 'bubbleUserBg',    label: 'User Bubble Bg',    hint: 'config.bubbleUserBg',    modes: ['panel','sidepanel','fullscreen'] },
  { key: 'bubbleUserText',  label: 'User Bubble Text',  hint: 'config.bubbleUserText',  modes: ['panel','sidepanel','fullscreen'] },
  { key: 'bubbleAgentBg',   label: 'Agent Bubble Bg',   hint: 'config.bubbleAgentBg',   modes: ['panel','sidepanel','fullscreen'] },
  { key: 'bubbleAgentText', label: 'Agent Bubble Text', hint: 'config.bubbleAgentText', modes: ['panel','sidepanel','fullscreen'] },
  { key: 'panelBg',         label: 'Panel Bg',          hint: 'config.panelBg',         modes: ['panel','sidepanel'] },
  { key: 'composerBg',      label: 'Composer Bg',       hint: 'config.composerBg',      modes: ['panel','sidepanel','fullscreen'] },
  { key: 'iconColor',       label: 'Icon Color',        hint: 'config.iconColor',       modes: ['panel','sidepanel','fullscreen'] },
];

function ColorGrid({ settings, onChange, currentMode, accentColor = '#6366f1', previewDark = false }) {
  const [editKey, setEditKey] = useState(null);
  const editMeta = editKey ? COLOR_TILE_META.find((m) => m.key === editKey) : null;
  const visibleMeta = currentMode
    ? COLOR_TILE_META.filter((m) => m.modes.includes(currentMode))
    : COLOR_TILE_META;

  // Resolve the default for a key — bubbleUserBg light defaults to accentColor
  function getDefault(key, variant) {
    if (key === 'bubbleUserBg' && variant === 'light') return accentColor;
    return COLOR_DEFAULTS[key]?.[variant] ?? (variant === 'light' ? '#e2e8f0' : '#374151');
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {visibleMeta.map(({ key, label, hint }) => {
          const v = settings[key] ?? { light: '', dark: '' };
          // Show only the currently-previewed variant
          const displayBg  = previewDark
            ? (v.dark?.trim()  || getDefault(key, 'dark'))
            : (v.light?.trim() || getDefault(key, 'light'));
          const isModified = v.light?.trim() || v.dark?.trim();
          return (
            <button
              key={key}
              onClick={() => setEditKey(key)}
              className="group flex flex-col gap-1.5 bg-slate-50 border border-slate-100 rounded-xl p-2.5 hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all text-left"
            >
              <div className="flex w-full rounded-lg overflow-hidden h-6 border border-slate-200">
                <div
                  className="flex-1 flex items-center justify-center text-[8px] font-semibold select-none"
                  style={{ background: displayBg }}
                >
                  {previewDark ? '🌙' : '☀️'}
                </div>
              </div>
              <div className="flex items-center justify-between gap-1">
                <p className="text-[10px] font-semibold text-slate-600 leading-tight">{label}</p>
                {isModified && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />}
              </div>
              <p className="text-[9px] text-slate-400 font-mono truncate">{hint}</p>
            </button>
          );
        })}
      </div>

      {editKey && editMeta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setEditKey(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-5 w-[360px] space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800 text-sm">{editMeta.label}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{editMeta.hint}</p>
              </div>
              <button
                onClick={() => setEditKey(null)}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
              >✕</button>
            </div>
            <ColorAssetInput
              configKey={editKey}
              label={editMeta.label}
              hint={editMeta.hint}
              value={settings[editKey]}
              onChange={(v) => onChange({ ...settings, [editKey]: v })}
            />
            <div className="flex items-center justify-between">
              {(settings[editKey]?.light?.trim() || settings[editKey]?.dark?.trim()) ? (
                <button
                  onClick={() => onChange({ ...settings, [editKey]: { light: '', dark: '' } })}
                  className="text-xs text-slate-400 hover:text-rose-500 border border-slate-200 hover:border-rose-300 px-2.5 py-1 rounded-lg bg-white transition-all"
                >
                  ↺ Reset
                </button>
              ) : <span />}
              <button
                onClick={() => setEditKey(null)}
                className="text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-1.5 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Live Renderer Demo
// ─────────────────────────────────────────────────────────────────────────────
const RENDERER_DEMOS = [
  {
    key: 'FlightCard',
    icon: '✈️',
    title: 'FlightCard',
    desc: 'Flight booking with price comparison. User selects a flight and confirms.',
    color: 'indigo',
    actions: ['submit → book_flight'],
    // ── payload is FLAT — the registry passes the full top-level JSON as `payload` prop ──
    payload: {
      type: 'FlightCard',
      from: 'New York (JFK)', to: 'San Francisco (SFO)', date: 'May 15, 2026',
      flights: [
        { id: 'f1', carrier: 'United Airlines',   departure: '06:00', arrival: '09:20', duration: '5h 20m', stops: 'Nonstop', price: '$289' },
        { id: 'f2', carrier: 'Delta Air Lines',    departure: '09:45', arrival: '13:15', duration: '5h 30m', stops: 'Nonstop', price: '$249' },
        { id: 'f3', carrier: 'American Airlines',  departure: '14:30', arrival: '19:50', duration: '5h 20m', stops: 'Nonstop', price: '$199' },
      ],
    },
    code: `// FlightCardComponent.jsx
// ── How data flows to your backend ────────────────────────────────────────
// 1. YOUR BACKEND returns this JSON as the assistant response:
//    { "type": "FlightCard", "from": "New York (JFK)", "to": "San Francisco (SFO)",
//      "flights": [{ id, carrier, departure, arrival, duration, stops, price }] }
//    ConvEngine detects "type", finds your renderer, and passes the full
//    JSON object as the \`payload\` prop to your component.
//
// 2. USER selects a flight row and clicks "Book Selected Flight →"
//
// 3. Your component calls:
//    actions.submit("Book Delta Air Lines at $249", {
//      action: "book_flight",
//      flightId: "f2"
//    });
//
// 4. ConvEngine does two things atomically:
//    a) Appends a user chat bubble: "Book Delta Air Lines at $249"
//    b) POSTs to your /chat endpoint:
//       { text: "Book Delta Air Lines at $249",
//         inputParams: { action: "book_flight", flightId: "f2" } }
//
// 5. YOUR BACKEND reads inputParams.action === "book_flight", processes the
//    booking for flightId "f2", and returns a confirmation message.
// ─────────────────────────────────────────────────────────────────────────

function FlightCardComponent({ payload, actions }) {
  const [selected, setSelected] = useState(payload.flights?.[0]?.id ?? null);
  const [booked, setBooked] = useState(false);
  const { from, to, date, flights = [] } = payload;

  if (booked) return <p>✅ Flight booked successfully!</p>;

  return (
    <div className="ce-interactive-card">
      <p className="ce-interactive-question">{from} → {to}</p>
      <p>{date}</p>

      {flights.map((f) => (
        <label key={f.id}>
          <input type="radio" value={f.id}
            checked={selected === f.id}
            onChange={() => setSelected(f.id)} />
          {f.carrier} · {f.departure}–{f.arrival} · {f.price}
        </label>
      ))}

      <button className="ce-interactive-submit" disabled={!selected}
        onClick={() => {
          const f = flights.find((f) => f.id === selected);
          setBooked(true);
          // submit() adds a user bubble AND sends to your backend
          actions.submit(\`Book \${f.carrier} at \${f.price}\`, {
            action: 'book_flight',
            flightId: selected,
          });
        }}>
        Book Selected Flight →
      </button>
    </div>
  );
}

// Register with the renderer registry
export const flightCardRenderer = {
  key: 'FlightCard',
  priority: 200,
  match: ({ effectiveType }) => effectiveType === 'FlightCard',
  Component: FlightCardComponent,
};

// Wire into ConvEngineChat
<ConvEngineChat config={{ renderers: [flightCardRenderer] }} />`,
  },
  {
    key: 'OrderTracker',
    icon: '📦',
    title: 'OrderTracker',
    desc: 'Real-time order status with visual timeline, track detail, and contact support.',
    color: 'pink',
    actions: ['submitSilent → track_detail', 'prefillInput → support message'],
    // ── flat payload — orderId, product, steps are top-level fields ──
    payload: {
      type: 'OrderTracker',
      orderId: 'CE-28471', product: 'MacBook Pro 14"', estimatedDelivery: 'May 3, 2026',
      steps: [
        { label: 'Order Placed',      date: 'Apr 29', done: true },
        { label: 'Packed & Ready',    date: 'Apr 30', done: true },
        { label: 'In Transit',        date: 'May 1',  done: true, current: true },
        { label: 'Out for Delivery',  date: 'May 3',  done: false },
        { label: 'Delivered',         date: 'May 3',  done: false },
      ],
    },
    code: `// OrderTrackerComponent.jsx
// ── How data flows to your backend ────────────────────────────────────────
// 1. YOUR BACKEND returns this JSON as the assistant response:
//    { "type": "OrderTracker", "orderId": "CE-28471", "product": "MacBook Pro 14\"",
//      "estimatedDelivery": "May 3, 2026",
//      "steps": [{ label, date, done, current? }] }
//    ConvEngine passes it as the \`payload\` prop to your component.
//
// Two buttons demonstrate two different actions:
//
// "Track in Detail" → actions.submitSilent({ action: 'track_detail', orderId })
//   • NO user bubble is shown in the chat (silent / invisible)
//   • Immediately POSTs to /chat:
//     { inputParams: { action: "track_detail", orderId: "CE-28471" } }
//   • YOUR BACKEND detects action === "track_detail" and returns a detail card.
//
// "Contact Support" → actions.prefillInput(`I need help with order #${orderId}`)
//   • Fills the chat composer with the string — NOTHING is sent yet
//   • USER reviews/edits the pre-filled text and presses Send manually
//   • Only then does ConvEngine POST to your /chat endpoint with the final text
// ─────────────────────────────────────────────────────────────────────────

function OrderTrackerComponent({ payload, actions }) {
  const { orderId, product, estimatedDelivery, steps = [] } = payload;

  return (
    <div className="ce-interactive-card">
      <p className="ce-interactive-question">📦 Order #{orderId}</p>
      <p>{product} · Est. {estimatedDelivery}</p>

      {steps.map((step, i) => (
        <div key={i} style={{ fontWeight: step.current ? 700 : 400 }}>
          {step.done ? '✓' : '○'} {step.label} · {step.date}
        </div>
      ))}

      <button className="ce-interactive-submit"
        onClick={() =>
          // submitSilent() — sends to backend silently, no user bubble shown
          actions.submitSilent({ action: 'track_detail', orderId })
        }>
        📍 Track in Detail
      </button>

      <button
        onClick={() =>
          // prefillInput() — fills the composer so the user can review & edit
          actions.prefillInput(\`I need help with order #\${orderId}\`)
        }>
        💬 Contact Support
      </button>
    </div>
  );
}

export const orderTrackerRenderer = {
  key: 'OrderTracker',
  priority: 200,
  match: ({ effectiveType }) => effectiveType === 'OrderTracker',
  Component: OrderTrackerComponent,
};`,
  },
  {
    key: 'ProductRecommendation',
    icon: '🛍️',
    title: 'ProductRecommendation',
    desc: 'AI-curated product cards with ratings, badges, and add-to-cart actions.',
    color: 'amber',
    actions: ['appendBubble → cart confirmation', 'submit → show more'],
    // ── flat payload — products array is top-level ──
    payload: {
      type: 'ProductRecommendation',
      products: [
        { id: 'p1', name: 'AirPods Pro 2nd Gen',  price: '$249', rating: 4.8, reviews: 12450, badge: 'Best Seller',  emoji: '🎧' },
        { id: 'p2', name: 'MagSafe Charger 15W',  price: '$39',  rating: 4.6, reviews: 8230,  badge: 'Top Rated',    emoji: '🔋' },
        { id: 'p3', name: 'iPhone 15 Pro Case',   price: '$49',  rating: 4.7, reviews: 5670,  badge: 'New Arrival',  emoji: '📱' },
      ],
    },
    code: `// ProductRecommendationComponent.jsx
// ── How data flows to your backend ────────────────────────────────────────
// 1. YOUR BACKEND returns this JSON as the assistant response:
//    { "type": "ProductRecommendation",
//      "products": [{ id, name, price, rating, reviews, badge?, emoji }] }
//    ConvEngine passes it as the \`payload\` prop to your component.
//
// 2. User taps "+ Cart" — row highlights, button turns green.
//    Multiple products can be added; tap again to remove.
//    Cart state is local React state — nothing sent to backend yet.
//
// 3. "Buy Now" activates once cart has items. Clicking it calls:
//    actions.submit("Buy Now Cart Items: AirPods Pro, MagSafe Charger", {
//      action: "buy_now",
//      items: [{ id: "p1", name: "AirPods Pro", price: "$249" }, ...]
//    });
//
// 4. ConvEngine does two things atomically:
//    a) Appends user bubble: "Buy Now Cart Items: AirPods Pro, MagSafe Charger"
//    b) POSTs to /chat:
//       { text: "...", inputParams: { action: "buy_now", items: [...] } }
//
// 5. YOUR BACKEND reads inputParams.items[], creates the order, and returns
//    an order confirmation or an OrderTracker card.
// ─────────────────────────────────────────────────────────────────────────

function ProductRecommendationComponent({ payload, actions }) {
  const [cart, setCart] = useState({});   // { [id]: true } — toggled
  const [bought, setBought] = useState(false);
  const { products = [] } = payload;

  function toggleCart(p) {
    setCart((prev) => ({ ...prev, [p.id]: !prev[p.id] }));
  }

  function buyNow() {
    const selected = products.filter((p) => cart[p.id]);
    if (!selected.length) return;
    const itemList = selected.map((p) => p.name).join(', ');
    setBought(true);
    // submit() — appends user bubble + sends to backend
    actions.submit(\`Buy Now Cart Items: \${itemList}\`, {
      action: 'buy_now',
      items: selected.map((p) => ({ id: p.id, name: p.name, price: p.price })),
    });
  }

  const cartCount = Object.values(cart).filter(Boolean).length;

  return (
    <div className="ce-interactive-card">
      <p className="ce-interactive-question">🛍️ Recommended for you</p>

      {products.map((p) => {
        const inCart = !!cart[p.id];
        return (
          <div key={p.id}
            style={{ border: \`1.5px solid \${inCart ? 'var(--ce-color-accent)' : 'var(--ce-border)'}\` }}>
            <span>{p.emoji} {p.name} · {p.price}</span>
            <span>⭐ {p.rating} · {p.reviews.toLocaleString()} reviews</span>

            {/* + Cart toggles the item in/out of cart */}
            <button onClick={() => toggleCart(p)}>
              {inCart ? '✓ Added' : '+ Cart'}
            </button>
          </div>
        );
      })}

      {/* Buy Now — active only when cart has items */}
      <button
        className="ce-interactive-submit"
        disabled={cartCount === 0 || bought}
        onClick={buyNow}>
        {bought ? '✓ Order Placed' : \`🛢 Buy Now\${cartCount > 0 ? \` (\${cartCount})\` : ''}\`}
      </button>
    </div>
  );
}

export const productRecommendationRenderer = {
  key: 'ProductRecommendation',
  priority: 200,
  match: ({ effectiveType }) => effectiveType === 'ProductRecommendation',
  Component: ProductRecommendationComponent,
};`,
  },
  {
    key: 'DataTable',
    icon: '📊',
    title: 'DataTable',
    desc: 'Renders structured data as a styled card table. hideBubble:true removes the bubble shell — the card controls its own presentation.',
    color: 'emerald',
    actions: [],
    // ── pre-parsed payload (no nested .payload — fields are top-level) ──
    payload: {
      type: 'DataTable',
      title: 'Q1 Sales Summary',
      caption: 'Source: internal CRM · Updated Apr 30 2026',
      headers: ['Product', 'Region', 'Units Sold', 'Revenue', 'Growth'],
      rows: [
        ['AirPods Pro',        'North America', '42,150', '$10.5M', '+18%'],
        ['MacBook Pro 14"',    'North America', '18,200', '$36.4M', '+12%'],
        ['iPhone 15 Pro',      'Europe',        '61,400', '$73.7M', '+9%'],
        ['Apple Watch Ultra',  'Asia Pacific',  '12,800', '$16.6M', '+31%'],
        ['iPad Pro',           'North America', '23,900', '$21.5M', '+5%'],
      ],
    },
    code: `// DataTableComponent.jsx
// ── How data flows (display-only — no data is sent back to the backend) ───
// This renderer is read-only. It presents a table returned by your backend
// but does NOT call actions.submit / submitSilent — no user action POSTs data.
//
// 1. YOUR BACKEND returns one of two shapes as the assistant response:
//
//    Option A — pre-parsed arrays (no client-side parsing, recommended):
//    { "type": "DataTable", "title": "Q1 Sales",
//      "headers": ["Product", "Revenue"],
//      "rows":    [["AirPods Pro", "$10.5M"], ...],
//      "caption": "Source: internal CRM" }
//
//    Option B — raw markdown table (great when your LLM outputs markdown):
//    { "type": "DataTable", "title": "Q1 Sales",
//      "markdown": "| Product | Revenue |\\n|---|---|\\n| AirPods Pro | $10.5M |" }
//    The parseMdTable() helper converts markdown rows → headers[] + rows[].
//
// 2. ConvEngine passes the full JSON as the \`payload\` prop; the component
//    reads payload.headers / payload.rows (or parses payload.markdown).
//
// 3. hideBubble: true — ConvEngine skips the bubble wrapper entirely.
//    The ce-data-table-card element owns its own card border/shadow/radius.
// ─────────────────────────────────────────────────────────────────────────

// ── Optional: import the helper from the library (also available) ──────────
// import { parseAssistantSegments, prettifyHeader } from '@salilvnair/convengine-chat';

/** Inline markdown table parser — use instead of the import if you prefer */
function parseMdTable(markdown) {
  const lines = markdown.trim().split(/\\r?\\n/);
  const isSep = (l) => /^\\|?\\s*:?-{3,}:?\\s*(\\|\\s*:?-{3,}:?\\s*)*\\|?$/.test(l.trim());
  const splitRow = (l) => l.trim().replace(/^\\|/, '').replace(/\\|$/, '').split('|').map((c) => c.trim());
  let hi = lines.findIndex((l, i) => l.includes('|') && i + 1 < lines.length && isSep(lines[i + 1]));
  if (hi === -1) return null;
  const headers = splitRow(lines[hi]);
  const rows = [];
  for (let i = hi + 2; i < lines.length; i++) {
    if (!lines[i].includes('|') || !lines[i].trim()) break;
    rows.push(splitRow(lines[i]));
  }
  return { headers, rows };
}

function DataTableComponent({ payload }) {
  const { title, caption, markdown } = payload;
  let { headers, rows } = payload;

  // Parse markdown if pre-parsed arrays not provided
  if (markdown && !headers) {
    const parsed = parseMdTable(markdown);
    if (parsed) { headers = parsed.headers; rows = parsed.rows; }
  }

  return (
    // ce-data-table-card is the standalone card shell (no bubble around it)
    <div className="ce-data-table-card">
      <div className="ce-data-table-header">
        {title && <span className="ce-data-table-title">{title}</span>}
        <span className="ce-data-table-count">{rows.length} rows</span>
      </div>

      {/* ce-table-wrap / ce-table / ce-table-th / ce-table-td are built-in */}
      <div className="ce-table-wrap">
        <table className="ce-table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                // prettifyCol converts snake_case / camelCase → Title Case
                <th key={i} className="ce-table-th">{prettifyCol(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="ce-table-tr">
                {row.map((cell, ci) => (
                  <td key={ci} className="ce-table-td">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {caption && <div className="ce-data-table-caption">{caption}</div>}
    </div>
  );
}

// hideBubble: true  →  AssistantMessage skips the bubble wrapper entirely.
// The card's ce-data-table-card CSS controls border / shadow / radius.
export const dataTableRenderer = {
  key: 'DataTable',
  priority: 200,
  hideBubble: true,
  match: ({ effectiveType }) => effectiveType === 'DataTable',
  Component: DataTableComponent,
};

// ── Custom CSS (add to your app stylesheet) ─────────────────────────────
// All rules are scoped under .ce-chat-root — no global leakage.
//
// /* Card shell */
// .ce-chat-root .ce-data-table-card {
//   background: var(--ce-bg-panel);
//   border: 1px solid var(--ce-border-color);
//   border-radius: 14px;
//   overflow: hidden;
//   box-shadow: 0 2px 12px rgba(15, 23, 42, 0.07);
// }
//
// /* Header strip above the table */
// .ce-chat-root .ce-data-table-header {
//   padding: 10px 14px;
//   background: var(--ce-bg-header);
//   border-bottom: 1px solid var(--ce-border-color);
// }
//
// /* Accent hover on body rows */
// .ce-chat-root .ce-data-table-card .ce-table-tr:hover {
//   background: rgba(99, 102, 241, 0.05);
// }
//
// /* Override card look for a specific renderer */
// .ce-chat-root .ce-data-table-card.my-custom-variant {
//   border-color: #10b981;
// }

<ConvEngineChat config={{ renderers: [dataTableRenderer] }} />`,
  },
  {
    key: 'CompleteForm',
    icon: '📋',
    title: 'CompleteForm',
    desc: 'Multi-field registration form with text inputs, dropdown, radio, checkbox, file upload, and date picker.',
    color: 'emerald',
    actions: ['submit → form_submit (sends all field values)'],
    payload: {
      type: 'CompleteForm',
      title: 'Tell us about yourself',
    },
    code: `// CompleteFormComponent.jsx
// ── How data flows to your backend ────────────────────────────────────────
// 1. YOUR BACKEND returns this JSON as the assistant response:
//    { "type": "CompleteForm", "title": "Tell us about yourself" }
//    ConvEngine passes it as the \`payload\` prop to your component.
//
// 2. USER fills all fields: first name, last name, country (dropdown),
//    gender (radio pills), date of birth (calendar), photo (file upload),
//    and checks "Accept terms". All values are local React state.
//
// 3. On clicking "Submit →", handleSubmit() validates, then calls:
//    actions.submit("Form Submitted: Jane Doe, United States, Female, ...", {
//      action: "form_submit",
//      formData: {
//        firstname: "Jane", lastname: "Doe", country: "United States",
//        gender: "Female", dob: "1990-05-01",
//        acceptTerms: true, photo: "profile.jpg"   // filename only, not raw file data
//      }
//    });
//
// 4. ConvEngine does two things atomically:
//    a) Appends user bubble: "Form Submitted: Jane Doe, United States, ..."
//    b) POSTs to your /chat endpoint:
//       { text: "Form Submitted: ...",
//         inputParams: { action: "form_submit", formData: { ... } } }
//
// 5. YOUR BACKEND reads inputParams.formData, stores the registration,
//    and returns an "Information Collected" confirmation message.
// ─────────────────────────────────────────────────────────────────────────

const COUNTRIES = ['United States','United Kingdom','Canada','Australia','India','Other'];
const GENDER_OPTIONS = ['Male','Female','Non-binary','Prefer not to say'];

function CompleteFormComponent({ payload, actions }) {
  const { title = 'Tell us about yourself' } = payload;
  const [form, setForm] = useState({
    firstname: '', lastname: '', country: '', gender: '',
    acceptTerms: false, photo: null, dob: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function handleSubmit() {
    const e = {};
    if (!form.firstname.trim()) e.firstname = 'Required';
    if (!form.lastname.trim())  e.lastname  = 'Required';
    if (!form.country)          e.country   = 'Required';
    if (!form.gender)           e.gender    = 'Required';
    if (!form.acceptTerms)      e.acceptTerms = 'You must accept the terms';
    if (!form.dob)              e.dob       = 'Required';
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
    const parts = [
      \`\${form.firstname} \${form.lastname}\`,
      form.country,
      form.gender,
      form.acceptTerms ? 'Terms Accepted' : 'Terms Not Accepted',
      form.photo ? form.photo.name : 'No photo',
      \`DOB: \${form.dob}\`,
    ];
    // submit() adds a user bubble AND sends text + inputParams to your backend
    actions.submit(\`Form Submitted: \${parts.join(', ')}\`, {
      action: 'form_submit',
      formData: { ...form, photo: form.photo ? form.photo.name : null },
    });
  }

  if (submitted) return <p>✅ Form submitted! Awaiting confirmation…</p>;

  return (
    <div className="ce-interactive-card">
      <p className="ce-interactive-question">{title}</p>

      {/* First + Last name */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label>First Name</label>
          <input value={form.firstname} onChange={(e) => set('firstname', e.target.value)} placeholder="Jane" />
          {errors.firstname && <p style={{ color: 'red' }}>{errors.firstname}</p>}
        </div>
        <div style={{ flex: 1 }}>
          <label>Last Name</label>
          <input value={form.lastname} onChange={(e) => set('lastname', e.target.value)} placeholder="Doe" />
          {errors.lastname && <p style={{ color: 'red' }}>{errors.lastname}</p>}
        </div>
      </div>

      {/* Country dropdown */}
      <select value={form.country} onChange={(e) => set('country', e.target.value)}>
        <option value="">Select country…</option>
        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Gender radio */}
      {GENDER_OPTIONS.map((opt) => (
        <label key={opt}>
          <input type="radio" name="gender" value={opt}
            checked={form.gender === opt} onChange={() => set('gender', opt)} />
          {opt}
        </label>
      ))}

      {/* DOB calendar */}
      <input type="date" value={form.dob}
        max={new Date().toISOString().split('T')[0]}
        onChange={(e) => set('dob', e.target.value)} />

      {/* Photo upload */}
      <input type="file" accept="image/*"
        onChange={(e) => set('photo', e.target.files?.[0] ?? null)} />

      {/* Accept terms checkbox */}
      <label>
        <input type="checkbox" checked={form.acceptTerms}
          onChange={(e) => set('acceptTerms', e.target.checked)} />
        I accept the terms and conditions
      </label>
      {errors.acceptTerms && <p style={{ color: 'red' }}>{errors.acceptTerms}</p>}

      <button className="ce-interactive-submit" onClick={handleSubmit}>
        Submit →
      </button>
    </div>
  );
}

export const completeFormRenderer = {
  key: 'CompleteForm',
  priority: 200,
  hideBubble: true,
  match: ({ effectiveType }) => effectiveType === 'CompleteForm',
  Component: CompleteFormComponent,
};

// Wire into ConvEngineChat
<ConvEngineChat config={{ renderers: [completeFormRenderer] }} />`,
  },
];

const COLOR_BG = { indigo: 'bg-indigo-50 border-indigo-100', pink: 'bg-pink-50 border-pink-100', amber: 'bg-amber-50 border-amber-100', emerald: 'bg-emerald-50 border-emerald-100' };
const COLOR_BADGE = { indigo: 'bg-indigo-100 text-indigo-700', pink: 'bg-pink-100 text-pink-700', amber: 'bg-amber-100 text-amber-700', emerald: 'bg-emerald-100 text-emerald-700' };
const COLOR_BTN = { indigo: 'bg-indigo-500 hover:bg-indigo-600', pink: 'bg-pink-500 hover:bg-pink-600', amber: 'bg-amber-500 hover:bg-amber-600', emerald: 'bg-emerald-500 hover:bg-emerald-600' };

function RendererLiveDemo({ chatActionsRef }) {
  const [injected, setInjected] = useState({});
  const [expanded, setExpanded] = useState({});

  function tryDemo(demo) {
    if (!chatActionsRef?.current?.appendBubble) {
      alert('Open the chat widget first — click the chat bubble in the corner of the page!');
      return;
    }
    chatActionsRef.current.appendBubble(JSON.stringify(demo.payload));
    setInjected((prev) => ({ ...prev, [demo.key]: true }));
    setTimeout(() => setInjected((prev) => ({ ...prev, [demo.key]: false })), 2000);
  }

  return (
    <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-lg mt-0.5">🚀</span>
        <div>
          <p className="text-sm font-bold text-teal-800">Live Renderer Demo</p>
          <p className="text-xs text-teal-600 mt-0.5">
            Click <strong>▶ Try it</strong> to inject a renderer payload directly into the chat widget via{' '}
            <code className="font-mono bg-teal-100 px-1 rounded">appendBubble</code>.
            In production, your backend returns the same JSON shape.
            Expand <strong>&lt;/&gt; View code</strong> to see the full implementation.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {RENDERER_DEMOS.map((demo) => (
          <div key={demo.key} className={`rounded-xl border overflow-hidden ${COLOR_BG[demo.color]}`}>
            {/* ── Header row ── */}
            <div className="flex items-start justify-between gap-3 p-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-700">{demo.icon} {demo.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${COLOR_BADGE[demo.color]}`}>
                    type: &quot;{demo.key}&quot;
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{demo.desc}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {demo.actions.map((a) => (
                    <code key={a} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">{a}</code>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button
                  onClick={() => tryDemo(demo)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg text-white transition-all ${COLOR_BTN[demo.color]} ${injected[demo.key] ? 'opacity-75' : ''}`}
                >
                  {injected[demo.key] ? '✓ Sent!' : '▶ Try it'}
                </button>
                <button
                  onClick={() => setExpanded((p) => ({ ...p, [demo.key]: !p[demo.key] }))}
                  className="text-[11px] font-mono font-semibold px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {expanded[demo.key] ? '▲ Hide code' : '</> View code'}
                </button>
              </div>
            </div>

            {/* ── Expandable code section ── */}
            {expanded[demo.key] && (
              <div className="border-t border-slate-200">
                <CodeBlock code={demo.code} lang="jsx" />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-teal-500">
        💡 The registry parses the assistant message as JSON, reads <code className="font-mono bg-teal-100 px-1 rounded">type</code>, and routes to the first provider whose <code className="font-mono bg-teal-100 px-1 rounded">match()</code> returns true.
      </p>
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
    settings.composerShape === 'rect' ? `    composerShape: 'rect',` : null,
    ...(['bubbleUserBg','bubbleUserText','bubbleAgentBg','bubbleAgentText','panelBg','composerBg','iconColor'].map((key) => {
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
  return `<ConvEngineChat\n  mode="${mode}"${align}\n  config={{\n    apiHost: "http://localhost:8080",\n    showFeedback: ${settings.showFeedback},\n    showAudit: ${settings.showAudit},\n    showEngineStatus: ${settings.showEngineStatus ?? true},\n    showDarkModeLightMode: ${settings.showDarkModeLightMode},${extras ? '\n' + extras : ''}${iconsSnippet}\n  }}\n  theme={{ "color-accent": "${settings.accentColor}" }}\n/>`;
}

function PlaygroundPanel({ settings, onChange, iconSvgs, onIconChange, onIconReset }) {
  const generatedCode = buildGeneratedCode(settings, iconSvgs);
  const [stickyCode, setStickyCode] = useState(false);
  const normalizedMode = settings.chatMode === 'fullscreen' ? 'fullscreen'
    : settings.chatMode?.startsWith('sidepanel') ? 'sidepanel' : 'panel';
  const showFor = (...modes) => modes.includes(normalizedMode);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="px-6 py-4 rounded-t-2xl" style={{ background: `linear-gradient(135deg, ${settings.accentColor} 0%, ${settings.accentColor}cc 100%)` }}>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>🎛️</span> Live Config Playground
        </h3>
        <p className="text-xs text-white/75 mt-0.5">Toggle settings below — the chat widget updates instantly.</p>
      </div>

      {/* ── Generated Usage ── */}
      <div className={`${stickyCode ? 'sticky top-14 z-20 shadow-sm' : ''} bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 py-3`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generated Usage</p>
          <button
            type="button"
            onClick={() => setStickyCode((v) => !v)}
            className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all select-none ${
              stickyCode
                ? 'text-white'
                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
            }`}
            style={stickyCode ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
          >
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="currentColor"><path d="M3 1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3.586l1.707 1.707A1 1 0 0 1 10 8H8v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2a1 1 0 0 1-.707-1.707L3 4.586V1z"/></svg>
            Stick on top
          </button>
        </div>
        <CodeBlock lang="jsx" code={generatedCode} />
      </div>

      <div className="p-5 space-y-6">
        {/* ── Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Toggle checked={settings.showFeedback}          onChange={(v) => onChange({ ...settings, showFeedback: v })}          label="Show Feedback (👍👎)"   hint="config.showFeedback"          modes={['panel','sidepanel','fullscreen']} accentColor={settings.accentColor} />
          <Toggle checked={settings.showAudit}             onChange={(v) => onChange({ ...settings, showAudit: v })}             label="Show Audit Trail"       hint="config.showAudit"             modes={['fullscreen']}             accentColor={settings.accentColor} />
          <Toggle checked={settings.showEngineStatus ?? true} onChange={(v) => onChange({ ...settings, showEngineStatus: v })} label="Engine Status Bar"      hint="config.showEngineStatus"      modes={['fullscreen','sidepanel']} accentColor={settings.accentColor} />
          <Toggle checked={settings.showDarkModeLightMode} onChange={(v) => onChange({ ...settings, showDarkModeLightMode: v })} label="Dark/Light Mode Toggle" hint="config.showDarkModeLightMode" modes={['panel','sidepanel','fullscreen']} accentColor={settings.accentColor} />
          <Toggle checked={settings.showHeaderDot}       onChange={(v) => onChange({ ...settings, showHeaderDot: v })}       label="Header Dot"         hint="config.showHeaderDot"       modes={['panel','sidepanel','fullscreen']} accentColor={settings.accentColor} />
          <Toggle checked={settings.showLandingAvatar}   onChange={(v) => onChange({ ...settings, showLandingAvatar: v })}   label="Landing Avatar"     hint="config.showLandingAvatar"   modes={['panel','sidepanel','fullscreen']} accentColor={settings.accentColor} />
          <Toggle checked={settings.showLandingSubtitle} onChange={(v) => onChange({ ...settings, showLandingSubtitle: v })} label="Landing Subtitle"   hint="config.showLandingSubtitle" modes={['panel','sidepanel','fullscreen']} accentColor={settings.accentColor} />
          {showFor('panel','fullscreen') && <Toggle checked={settings.showNewChat}       onChange={(v) => onChange({ ...settings, showNewChat: v })}       label="New Chat Button"    hint="config.showNewChat"      modes={['panel','fullscreen']} accentColor={settings.accentColor} />}
          {showFor('panel') && <Toggle checked={settings.showLayoutPicker}  onChange={(v) => onChange({ ...settings, showLayoutPicker: v })}  label="Chat View Switcher" hint="config.showLayoutPicker" modes={['panel']} accentColor={settings.accentColor} />}
          {showFor('panel') && <Toggle checked={settings.showMaximize}      onChange={(v) => onChange({ ...settings, showMaximize: v })}      label="Expand to Center"   hint="config.showMaximize"     modes={['panel']} accentColor={settings.accentColor} />}
          {showFor('panel') && <Toggle checked={settings.showMinimize}      onChange={(v) => onChange({ ...settings, showMinimize: v })}      label="Minimize Button"    hint="config.showMinimize"     modes={['panel']} accentColor={settings.accentColor} />}
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
                    ? 'text-white shadow-md'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                style={settings.chatMode === id ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}>
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
                  engineStatus:    String(settings.showEngineStatus ?? true),
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
                  composerShape:   settings.composerShape,
                });
                window.open(`/fullscreen?${p.toString()}`, '_blank', 'noopener,noreferrer');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                settings.chatMode === 'fullscreen'
                  ? 'text-white shadow-md'
                  : 'border-violet-200 text-violet-600 hover:bg-violet-50'
              }`}
              style={settings.chatMode === 'fullscreen' ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}>
              ⛶ Fullscreen
              <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 1h4v4M11 1l-5 5M5 11H1V7M1 11l5-5" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Composer Shape</p>
          <div className="flex gap-2">
            {[{id:'round',label:'⬭ Round (pill)'},{id:'rect',label:'▭ Rect'}].map(({id,label})=>(
              <button
                key={id}
                onClick={() => onChange({ ...settings, composerShape: id })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  settings.composerShape === id
                    ? 'text-white shadow-md'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                style={settings.composerShape === id ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
              >{label}</button>
            ))}
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
          <ColorGrid settings={settings} onChange={onChange} currentMode={normalizedMode} accentColor={settings.accentColor} previewDark={settings.previewDark} />
        </div>

        <IconGrid iconSvgs={iconSvgs} onIconChange={onIconChange} onIconReset={onIconReset} currentMode={normalizedMode} accentColor={settings.accentColor} iconColorSetting={settings.iconColor} previewDark={settings.previewDark}
          onIconColorChange={(variant, color) => onChange({ ...settings, iconColor: { ...settings.iconColor, [variant]: color } })} />

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
// Tailwind live demos
// ─────────────────────────────────────────────────────────────────────────────
const TW_ACCENT_PRESETS = [
  { name: 'Blue',    hex: '#3b82f6' },
  { name: 'Indigo',  hex: '#6366f1' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Rose',    hex: '#f43f5e' },
  { name: 'Amber',   hex: '#f59e0b' },
  { name: 'Violet',  hex: '#8b5cf6' },
];

function TwAccentPicker({ selected, onSelect, resetExtras }) {
  return (
    <div className="flex items-center gap-2">
      <p className="text-[10px] text-slate-500 font-semibold">Accent:</p>
      <div className="flex gap-1.5">
        {TW_ACCENT_PRESETS.map((p, i) => (
          <button key={p.name} title={p.name}
            onClick={() => { onSelect(i); resetExtras?.(); }}
            className={`w-4 h-4 rounded-full transition-transform ${selected === i ? 'ring-2 ring-offset-1 ring-slate-500 scale-110' : 'opacity-80 hover:opacity-100'}`}
            style={{ backgroundColor: p.hex }}
          />
        ))}
      </div>
    </div>
  );
}

function TailwindPlayground() {
  const [tab, setTab] = useState('button');

  // ── Button ──
  // Inline style values are used for the live preview (Tailwind purges dynamic class strings).
  // The className string in the dark box is shown purely for educational reference.
  const BTN_COLORS = [
    { name: 'Blue',    hex: '#3b82f6', darken: '#2563eb', cls: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Indigo',  hex: '#6366f1', darken: '#4f46e5', cls: 'bg-indigo-500 hover:bg-indigo-600' },
    { name: 'Emerald', hex: '#10b981', darken: '#059669', cls: 'bg-emerald-500 hover:bg-emerald-600' },
    { name: 'Rose',    hex: '#f43f5e', darken: '#e11d48', cls: 'bg-rose-500 hover:bg-rose-600' },
    { name: 'Amber',   hex: '#f59e0b', darken: '#d97706', cls: 'bg-amber-500 hover:bg-amber-600' },
    { name: 'Violet',  hex: '#8b5cf6', darken: '#7c3aed', cls: 'bg-violet-500 hover:bg-violet-600' },
  ];
  const BTN_SIZES = [
    { n: 'sm',  padding: '6px 12px',  fontSize: '12px', cls: 'px-3 py-1.5 text-xs' },
    { n: 'md',  padding: '10px 20px', fontSize: '14px', cls: 'px-5 py-2.5 text-sm' },
    { n: 'lg',  padding: '14px 28px', fontSize: '16px', cls: 'px-7 py-3.5 text-base' },
  ];
  const BTN_SHAPES = [
    { n: 'square',  radius: '0px',    cls: 'rounded-none' },
    { n: 'rounded', radius: '6px',    cls: 'rounded-md' },
    { n: 'xl',      radius: '12px',   cls: 'rounded-xl' },
    { n: 'pill',    radius: '9999px', cls: 'rounded-full' },
  ];
  const [bColor, setBColor] = useState(0);
  const [bSize,  setBSize]  = useState(1);
  const [bShape, setBShape] = useState(2);
  const [bHover, setBHover] = useState(false);
  const bc = BTN_COLORS[bColor];
  const btnPreviewStyle = {
    backgroundColor: bHover ? bc.darken : bc.hex,
    color: 'white', fontWeight: '600',
    padding: BTN_SIZES[bSize].padding, fontSize: BTN_SIZES[bSize].fontSize,
    borderRadius: BTN_SHAPES[bShape].radius,
    border: 'none', cursor: 'pointer', transition: 'background-color 0.15s',
  };
  const btnCls = `${bc.cls} text-white font-semibold ${BTN_SIZES[bSize].cls} ${BTN_SHAPES[bShape].cls} transition-colors`;

  // ── Card ──
  const CARD_PADDINGS = [
    { n: 'p-3',  val: '12px', cls: 'p-3' },
    { n: 'p-6',  val: '24px', cls: 'p-6' },
    { n: 'p-10', val: '40px', cls: 'p-10' },
  ];
  const CARD_RADII = [
    { n: 'none', val: '0px',  cls: 'rounded-none' },
    { n: 'md',   val: '6px',  cls: 'rounded-md' },
    { n: '2xl',  val: '16px', cls: 'rounded-2xl' },
    { n: '3xl',  val: '24px', cls: 'rounded-3xl' },
  ];
  const CARD_BGS = [
    { n: 'white',    hex: '#ffffff', cls: 'bg-white' },
    { n: 'slate-50', hex: '#f8fafc', cls: 'bg-slate-50' },
    { n: 'sky-50',   hex: '#f0f9ff', cls: 'bg-sky-50' },
  ];
  const [cShadow,  setCshadow]  = useState(true);
  const [cBorder,  setCborder]  = useState(true);
  const [cPadding, setCpadding] = useState(1);
  const [cRounded, setCrounded] = useState(2);
  const [cBg,      setCbg]      = useState(0);
  const cardPreviewStyle = {
    backgroundColor: CARD_BGS[cBg].hex,
    padding: CARD_PADDINGS[cPadding].val,
    borderRadius: CARD_RADII[cRounded].val,
    boxShadow: cShadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none',
    border: cBorder ? '1px solid #e2e8f0' : 'none',
    maxWidth: 260, width: '100%',
  };
  const cardCls = [CARD_BGS[cBg].cls, CARD_RADII[cRounded].cls, CARD_PADDINGS[cPadding].cls, cShadow ? 'shadow-lg' : '', cBorder ? 'border border-slate-200' : ''].filter(Boolean).join(' ');

  // ── Text ──
  const TXT_COLORS = [
    { n: 'Default', hex: '#1e293b', cls: 'text-slate-800' },
    { n: 'Sky',     hex: '#0284c7', cls: 'text-sky-600' },
    { n: 'Emerald', hex: '#059669', cls: 'text-emerald-600' },
    { n: 'Rose',    hex: '#e11d48', cls: 'text-rose-600' },
    { n: 'Violet',  hex: '#7c3aed', cls: 'text-violet-600' },
    { n: 'Amber',   hex: '#d97706', cls: 'text-amber-600' },
  ];
  const TXT_SIZES = [
    { n: 'sm',  val: '14px', cls: 'text-sm' },
    { n: 'base',val: '16px', cls: 'text-base' },
    { n: 'lg',  val: '18px', cls: 'text-lg' },
    { n: 'xl',  val: '20px', cls: 'text-xl' },
    { n: '2xl', val: '24px', cls: 'text-2xl' },
  ];
  const TXT_WEIGHTS = [
    { n: 'normal',    val: '400', cls: 'font-normal' },
    { n: 'medium',    val: '500', cls: 'font-medium' },
    { n: 'semibold',  val: '600', cls: 'font-semibold' },
    { n: 'bold',      val: '700', cls: 'font-bold' },
    { n: 'extrabold', val: '800', cls: 'font-extrabold' },
  ];
  const [tColor,  setTcolor]  = useState(0);
  const [tSize,   setTsize]   = useState(1);
  const [tWeight, setTweight] = useState(2);
  const [tItalic, setTitalic] = useState(false);
  const [tUnder,  setTunder]  = useState(false);
  const textPreviewStyle = {
    color: TXT_COLORS[tColor].hex,
    fontSize: TXT_SIZES[tSize].val,
    fontWeight: TXT_WEIGHTS[tWeight].val,
    fontStyle: tItalic ? 'italic' : 'normal',
    textDecoration: tUnder ? 'underline' : 'none',
  };
  const textCls = [TXT_COLORS[tColor].cls, TXT_SIZES[tSize].cls, TXT_WEIGHTS[tWeight].cls, tItalic ? 'italic' : '', tUnder ? 'underline' : ''].filter(Boolean).join(' ');

  const TABS = [{ id: 'button', label: '🔵 Button' }, { id: 'card', label: '🃏 Card' }, { id: 'text', label: '🔤 Text' }];

  return (
    <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-sky-100 flex flex-wrap items-center gap-2">
        <span className="text-base">🎨</span>
        <div>
          <p className="text-sm font-bold text-sky-800">Tailwind Playground — Try it live</p>
          <p className="text-xs text-sky-500">Click an option → watch the preview change → read the Tailwind className that produced it</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sky-100">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors ${tab === id ? 'bg-white text-sky-700 border-b-2 border-sky-500' : 'text-sky-500 hover:bg-sky-100/60'}`}
          >{label}</button>
        ))}
      </div>

      <div className="p-4 space-y-3">

        {/* ── Button tab ── */}
        {tab === 'button' && (
          <>
            {/* Preview first — rendered with inline styles so it always works */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-center min-h-[80px]">
              <button style={btnPreviewStyle}
                onMouseEnter={() => setBHover(true)} onMouseLeave={() => setBHover(false)}>
                Click me
              </button>
            </div>
            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Color</p>
                <div className="flex flex-wrap gap-2">
                  {BTN_COLORS.map((p, i) => (
                    <button key={p.name} title={p.name} onClick={() => setBColor(i)}
                      className={`w-6 h-6 rounded-full transition-transform ${bColor === i ? 'ring-2 ring-offset-1 ring-slate-600 scale-110' : ''}`}
                      style={{ backgroundColor: p.hex }} />
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Size</p>
                <div className="flex gap-1">
                  {BTN_SIZES.map((s, i) => (
                    <button key={s.n} onClick={() => setBSize(i)}
                      className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${bSize === i ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
                    >{s.n}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Shape</p>
                <div className="flex flex-wrap gap-1">
                  {BTN_SHAPES.map((s, i) => (
                    <button key={s.n} onClick={() => setBShape(i)}
                      className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${bShape === i ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
                    >{s.n}</button>
                  ))}
                </div>
              </div>
            </div>
            {/* className output */}
            <div className="bg-slate-900 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 mb-1 font-mono uppercase tracking-wider">The Tailwind className that styles the button above:</p>
              <p className="text-xs font-mono text-emerald-300 break-all">&quot;{btnCls}&quot;</p>
            </div>
          </>
        )}

        {/* ── Card tab ── */}
        {tab === 'card' && (
          <>
            {/* Preview first */}
            <div className="bg-slate-100 rounded-xl p-6 flex items-center justify-center min-h-[120px]">
              <div style={cardPreviewStyle}>
                <p style={{ fontWeight: '600', color: '#334155', fontSize: '14px', marginBottom: 4 }}>Card Title</p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Composed entirely from Tailwind utility classes — no custom CSS file needed.</p>
              </div>
            </div>
            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              {[{ label: 'Shadow', val: cShadow, set: setCshadow }, { label: 'Border', val: cBorder, set: setCborder }].map(({ label, val, set }) => (
                <button key={label} onClick={() => set(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${val ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
                ><span>{val ? '✓' : '○'}</span>{label}</button>
              ))}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500 font-semibold">Padding:</span>
                {CARD_PADDINGS.map((p, i) => (
                  <button key={p.n} onClick={() => setCpadding(i)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${cPadding === i ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
                  >{p.n}</button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500 font-semibold">Corners:</span>
                {CARD_RADII.map((r, i) => (
                  <button key={r.n} onClick={() => setCrounded(i)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${cRounded === i ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
                  >{r.n}</button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500 font-semibold">BG:</span>
                {CARD_BGS.map((b, i) => (
                  <button key={b.n} onClick={() => setCbg(i)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${cBg === i ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
                  >{b.n}</button>
                ))}
              </div>
            </div>
            {/* className output */}
            <div className="bg-slate-900 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 mb-1 font-mono uppercase tracking-wider">The Tailwind className that styles the card above:</p>
              <p className="text-xs font-mono text-emerald-300 break-all">&quot;{cardCls}&quot;</p>
            </div>
          </>
        )}

        {/* ── Text tab ── */}
        {tab === 'text' && (
          <>
            {/* Preview first */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-center min-h-[80px]">
              <p style={textPreviewStyle}>The quick brown fox jumps over the lazy dog</p>
            </div>
            {/* Controls */}
            <div className="flex flex-wrap gap-3">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-semibold">Color</p>
                <div className="flex flex-wrap gap-1">
                  {TXT_COLORS.map((c, i) => (
                    <button key={c.n} onClick={() => setTcolor(i)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${tColor === i ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
                    >{c.n}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-semibold">Size</p>
                <div className="flex flex-wrap gap-1">
                  {TXT_SIZES.map((s, i) => (
                    <button key={s.n} onClick={() => setTsize(i)}
                      className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${tSize === i ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
                    >{s.n}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-semibold">Weight</p>
                <div className="flex flex-wrap gap-1">
                  {TXT_WEIGHTS.map((w, i) => (
                    <button key={w.n} onClick={() => setTweight(i)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${tWeight === i ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
                    >{w.n}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-semibold">Style</p>
                <div className="flex gap-1">
                  {[{ label: 'italic', val: tItalic, set: setTitalic }, { label: 'underline', val: tUnder, set: setTunder }].map(({ label, val, set }) => (
                    <button key={label} onClick={() => set(v => !v)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${val ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
                    >{label}</button>
                  ))}
                </div>
              </div>
            </div>
            {/* className output */}
            <div className="bg-slate-900 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 mb-1 font-mono uppercase tracking-wider">The Tailwind className that styles the text above:</p>
              <p className="text-xs font-mono text-emerald-300 break-all">&quot;{textCls}&quot;</p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

function TailwindNotificationPreview() {
  const [accent, setAccent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [opened, setOpened] = useState(false);
  const hex = TW_ACCENT_PRESETS[accent].hex;
  return (
    <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-sky-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">▶</span>
          <p className="text-sm font-bold text-sky-800">Live Preview</p>
        </div>
        <TwAccentPicker selected={accent} onSelect={setAccent} resetExtras={() => { setDismissed(false); setOpened(false); }} />
      </div>
      <div className="p-4">
        {opened ? (
          <div className="rounded-xl border px-4 py-3 flex items-center gap-3" style={{ backgroundColor: hex + '18', borderColor: hex + '50' }}>
            <span className="text-lg">💬</span>
            <p className="flex-1 text-sm font-medium" style={{ color: hex }}>Chat is open — type a message!</p>
            <button onClick={() => setOpened(false)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: hex }}
            >Minimize</button>
          </div>
        ) : dismissed ? (
          <div className="text-center py-4">
            <p className="text-xs text-slate-400">Banner dismissed.</p>
            <button onClick={() => setDismissed(false)} className="text-xs text-sky-500 hover:underline mt-1">Show again</button>
          </div>
        ) : (
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: hex + '18', border: `1px solid ${hex}45` }}>
            <div className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: hex }} />
            <p className="flex-1 text-sm font-medium" style={{ color: hex }}>You have a new response in the chat!</p>
            <button onClick={() => setOpened(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: hex }}
            >Open chat</button>
            <button onClick={() => setDismissed(true)} className="text-slate-300 hover:text-slate-500 text-sm leading-none">✕</button>
          </div>
        )}
        <p className="text-[10px] text-sky-400 mt-3">Try switching the accent color above — all elements update instantly.</p>
      </div>
    </div>
  );
}

function TailwindSidebarPreview() {
  const [accent, setAccent] = useState(0);
  const [activeNav, setActiveNav] = useState('Messages');
  const [unread, setUnread] = useState(3);
  const hex = TW_ACCENT_PRESETS[accent].hex;
  const NAV_ITEMS = ['Dashboard', 'Messages', 'Settings', 'Profile'];
  return (
    <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-sky-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">▶</span>
          <p className="text-sm font-bold text-sky-800">Live Preview</p>
        </div>
        <TwAccentPicker selected={accent} onSelect={setAccent} resetExtras={() => setUnread(3)} />
      </div>
      <div className="p-4">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex">
          {/* Sidebar */}
          <div className="w-40 border-r border-slate-100 p-2 space-y-0.5 flex-shrink-0">
            {NAV_ITEMS.map((item) => {
              const isActive = item === activeNav;
              return (
                <button key={item} onClick={() => setActiveNav(item)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left"
                  style={isActive
                    ? { backgroundColor: hex + '18', color: hex, borderLeft: `2px solid ${hex}` }
                    : { color: '#64748b' }
                  }
                >
                  <span>{item}</span>
                  {item === 'Messages' && unread > 0 && (
                    <span className="text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: hex }}>{unread}</span>
                  )}
                </button>
              );
            })}
          </div>
          {/* Content */}
          <div className="flex-1 p-4 min-w-0">
            <p className="font-semibold text-sm text-slate-700">{activeNav}</p>
            {activeNav === 'Messages' ? (
              <div className="mt-2 space-y-1.5">
                <p className="text-xs text-slate-500">{unread > 0 ? `${unread} unread messages` : 'All caught up!'}</p>
                {unread > 0 && (
                  <button onClick={() => setUnread(0)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg text-white" style={{ backgroundColor: hex }}
                  >Mark all read</button>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-2">Click nav items to see active state.</p>
            )}
          </div>
        </div>
        <p className="text-[10px] text-sky-400 mt-3">Click nav items to toggle active state. Switch accent to see the badge and highlight update.</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tailwind class-input demo (type-your-own)
// ─────────────────────────────────────────────────────────────────────────────
const TW_COLOR_MAP = {
  white:'#ffffff', black:'#000000', transparent:'transparent',
  'slate-50':'#f8fafc','slate-100':'#f1f5f9','slate-200':'#e2e8f0','slate-300':'#cbd5e1',
  'slate-400':'#94a3b8','slate-500':'#64748b','slate-600':'#475569','slate-700':'#334155',
  'slate-800':'#1e293b','slate-900':'#0f172a',
  'gray-50':'#f9fafb','gray-100':'#f3f4f6','gray-200':'#e5e7eb','gray-300':'#d1d5db',
  'gray-400':'#9ca3af','gray-500':'#6b7280','gray-600':'#4b5563','gray-700':'#374151',
  'gray-800':'#1f2937','gray-900':'#111827',
  'red-50':'#fef2f2','red-100':'#fee2e2','red-200':'#fecaca','red-300':'#fca5a5',
  'red-400':'#f87171','red-500':'#ef4444','red-600':'#dc2626','red-700':'#b91c1c',
  'orange-50':'#fff7ed','orange-100':'#ffedd5','orange-200':'#fed7aa',
  'orange-400':'#fb923c','orange-500':'#f97316','orange-600':'#ea580c','orange-700':'#c2410c',
  'amber-50':'#fffbeb','amber-100':'#fef3c7','amber-200':'#fde68a',
  'amber-400':'#fbbf24','amber-500':'#f59e0b','amber-600':'#d97706','amber-700':'#b45309',
  'yellow-100':'#fef9c3','yellow-200':'#fef08a','yellow-400':'#facc15','yellow-500':'#eab308',
  'green-50':'#f0fdf4','green-100':'#dcfce7','green-200':'#bbf7d0',
  'green-400':'#4ade80','green-500':'#22c55e','green-600':'#16a34a','green-700':'#15803d',
  'emerald-50':'#ecfdf5','emerald-100':'#d1fae5','emerald-200':'#a7f3d0',
  'emerald-400':'#34d399','emerald-500':'#10b981','emerald-600':'#059669','emerald-700':'#047857',
  'teal-50':'#f0fdfa','teal-100':'#ccfbf1','teal-400':'#2dd4bf',
  'teal-500':'#14b8a6','teal-600':'#0d9488','teal-700':'#0f766e',
  'cyan-100':'#cffafe','cyan-400':'#22d3ee','cyan-500':'#06b6d4','cyan-600':'#0891b2',
  'sky-50':'#f0f9ff','sky-100':'#e0f2fe','sky-200':'#bae6fd','sky-300':'#7dd3fc',
  'sky-400':'#38bdf8','sky-500':'#0ea5e9','sky-600':'#0284c7','sky-700':'#0369a1',
  'blue-50':'#eff6ff','blue-100':'#dbeafe','blue-200':'#bfdbfe','blue-300':'#93c5fd',
  'blue-400':'#60a5fa','blue-500':'#3b82f6','blue-600':'#2563eb','blue-700':'#1d4ed8',
  'blue-800':'#1e40af','blue-900':'#1e3a8a',
  'indigo-50':'#eef2ff','indigo-100':'#e0e7ff','indigo-200':'#c7d2fe','indigo-300':'#a5b4fc',
  'indigo-400':'#818cf8','indigo-500':'#6366f1','indigo-600':'#4f46e5','indigo-700':'#4338ca',
  'violet-50':'#f5f3ff','violet-100':'#ede9fe','violet-200':'#ddd6fe','violet-300':'#c4b5fd',
  'violet-400':'#a78bfa','violet-500':'#8b5cf6','violet-600':'#7c3aed','violet-700':'#6d28d9',
  'purple-400':'#c084fc','purple-500':'#a855f7','purple-600':'#9333ea',
  'pink-50':'#fdf2f8','pink-100':'#fce7f3','pink-200':'#fbcfe8',
  'pink-400':'#f472b6','pink-500':'#ec4899','pink-600':'#db2777','pink-700':'#be185d',
  'rose-50':'#fff1f2','rose-100':'#ffe4e6','rose-200':'#fecdd3','rose-300':'#fda4af',
  'rose-400':'#fb7185','rose-500':'#f43f5e','rose-600':'#e11d48','rose-700':'#be123c',
  // ConvEngine brand tokens — these are CSS variables, not hex values
  'brand':        'var(--ce-color-accent)',
  'brand-hover':  'var(--ce-color-accent-hover)',
  'chat-user':    'var(--ce-bg-bubble-user)',
  'chat-agent':   'var(--ce-bg-bubble-agent)',
  'chat-panel':   'var(--ce-bg-panel)',
};

const TW_PX = { 0:'0px',0.5:'2px',1:'4px',1.5:'6px',2:'8px',2.5:'10px',3:'12px',3.5:'14px',4:'16px',5:'20px',6:'24px',7:'28px',8:'32px',9:'36px',10:'40px',11:'44px',12:'48px',14:'56px',16:'64px',20:'80px',24:'96px' };

function twToStyle(classString) {
  const styles = {};
  const resolved = [];
  const unknown = [];
  for (const cls of classString.trim().split(/\s+/).filter(Boolean)) {
    let hit = false;
    const trySet = (prop, val, displayProp, displayVal) => {
      styles[prop] = val; resolved.push({ cls, prop: displayProp || prop, val: displayVal || val }); hit = true;
    };
    // bg-{color}
    const bgM = cls.match(/^bg-(.+)$/);
    if (!hit && bgM && TW_COLOR_MAP[bgM[1]] !== undefined) trySet('backgroundColor', TW_COLOR_MAP[bgM[1]], 'background-color');
    // text-{color}
    const tcM = cls.match(/^text-(.+)$/);
    if (!hit && tcM && TW_COLOR_MAP[tcM[1]] !== undefined) trySet('color', TW_COLOR_MAP[tcM[1]], 'color');
    // text-{size}
    const tSizeMap = {'text-xs':'12px','text-sm':'14px','text-base':'16px','text-lg':'18px','text-xl':'20px','text-2xl':'24px','text-3xl':'30px','text-4xl':'36px','text-5xl':'48px'};
    if (!hit && tSizeMap[cls]) trySet('fontSize', tSizeMap[cls], 'font-size');
    // font-{weight}
    const fwMap = {'font-thin':'100','font-extralight':'200','font-light':'300','font-normal':'400','font-medium':'500','font-semibold':'600','font-bold':'700','font-extrabold':'800','font-black':'900'};
    if (!hit && fwMap[cls]) trySet('fontWeight', fwMap[cls], 'font-weight');
    // rounded
    const rMap = {'rounded-none':'0','rounded-sm':'2px','rounded':'4px','rounded-md':'6px','rounded-lg':'8px','rounded-xl':'12px','rounded-2xl':'16px','rounded-3xl':'24px','rounded-full':'9999px'};
    if (!hit && rMap[cls]) trySet('borderRadius', rMap[cls], 'border-radius');
    // p px py
    const pM  = cls.match(/^p-(\d+(?:\.\d+)?)$/);
    if (!hit && pM  && TW_PX[pM[1]])  { styles.padding = TW_PX[pM[1]]; resolved.push({ cls, prop:'padding', val:TW_PX[pM[1]] }); hit = true; }
    const pxM = cls.match(/^px-(\d+(?:\.\d+)?)$/);
    if (!hit && pxM && TW_PX[pxM[1]]) { styles.paddingLeft = styles.paddingRight = TW_PX[pxM[1]]; resolved.push({ cls, prop:'padding-inline', val:TW_PX[pxM[1]] }); hit = true; }
    const pyM = cls.match(/^py-(\d+(?:\.\d+)?)$/);
    if (!hit && pyM && TW_PX[pyM[1]]) { styles.paddingTop = styles.paddingBottom = TW_PX[pyM[1]]; resolved.push({ cls, prop:'padding-block', val:TW_PX[pyM[1]] }); hit = true; }
    // border width
    const bwMap = {'border':'1px solid','border-0':'none','border-2':'2px solid','border-4':'4px solid','border-8':'8px solid'};
    if (!hit && bwMap[cls]) trySet('border', bwMap[cls], 'border');
    // border-{color}
    const bcM = cls.match(/^border-(.+)$/);
    if (!hit && bcM && TW_COLOR_MAP[bcM[1]] !== undefined) { styles.borderColor = TW_COLOR_MAP[bcM[1]]; if (!styles.border) styles.border = '1px solid'; resolved.push({ cls, prop:'border-color', val:TW_COLOR_MAP[bcM[1]] }); hit = true; }
    // shadow
    const shMap = {'shadow-sm':'0 1px 2px 0 rgb(0 0 0/0.05)','shadow':'0 1px 3px 0 rgb(0 0 0/0.1)','shadow-md':'0 4px 6px -1px rgb(0 0 0/0.1)','shadow-lg':'0 10px 15px -3px rgb(0 0 0/0.1)','shadow-xl':'0 20px 25px -5px rgb(0 0 0/0.1)','shadow-2xl':'0 25px 50px -12px rgb(0 0 0/0.25)','shadow-none':'none'};
    if (!hit && shMap[cls]) trySet('boxShadow', shMap[cls], 'box-shadow');
    // opacity
    const opM = cls.match(/^opacity-(\d+)$/);
    if (!hit && opM) trySet('opacity', parseInt(opM[1]) / 100, 'opacity', opM[1] + '%');
    // font-style / text-decoration
    if (!hit && cls === 'italic')     trySet('fontStyle',      'italic',     'font-style');
    if (!hit && cls === 'not-italic') trySet('fontStyle',      'normal',     'font-style');
    if (!hit && cls === 'underline')  trySet('textDecoration', 'underline',  'text-decoration');
    if (!hit && cls === 'line-through') trySet('textDecoration', 'line-through', 'text-decoration');
    if (!hit) unknown.push(cls);
  }
  return { styles, resolved, unknown };
}

function TailwindClassInputDemo() {
  const DEFAULT_INPUT = 'bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl';
  const [input, setInput] = useState(DEFAULT_INPUT);
  const { styles, resolved, unknown } = twToStyle(input);
  const activeSet = new Set(input.trim().split(/\s+/).filter(Boolean));

  const CHIPS = [
    { label: 'bg-brand',      brand: true },
    { label: 'text-brand',    brand: true },
    { label: 'border-brand',  brand: true },
    { label: 'bg-blue-500' },
    { label: 'bg-emerald-500' },
    { label: 'bg-rose-500' },
    { label: 'bg-violet-500' },
    { label: 'bg-amber-100' },
    { label: 'text-white' },
    { label: 'text-slate-800' },
    { label: 'font-bold' },
    { label: 'text-lg' },
    { label: 'italic' },
    { label: 'underline' },
    { label: 'rounded-full' },
    { label: 'rounded-xl' },
    { label: 'rounded-none' },
    { label: 'shadow-lg' },
    { label: 'shadow-none' },
    { label: 'border-2' },
    { label: 'border-blue-300' },
    { label: 'px-6' },
    { label: 'py-3' },
    { label: 'opacity-50' },
  ];

  function toggleChip(label) {
    const parts = input.trim().split(/\s+/).filter(Boolean);
    setInput(parts.includes(label) ? parts.filter(c => c !== label).join(' ') : [...parts, label].join(' '));
  }

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-indigo-100">
        <p className="text-sm font-bold text-indigo-800">🎛️  Click classes to toggle — including bg-brand</p>
        <p className="text-xs text-indigo-500 mt-0.5">
          Click any chip below to add or remove it. The preview and breakdown update instantly.
          The <code className="bg-indigo-100 px-1 rounded font-mono">bg-brand</code>,{' '}
          <code className="bg-indigo-100 px-1 rounded font-mono">text-brand</code>, and{' '}
          <code className="bg-indigo-100 px-1 rounded font-mono">border-brand</code> chips are ConvEngine&apos;s accent — marked ✦
        </p>
      </div>
      <div className="p-4 space-y-3">
        {/* Quick-add chips */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Click to add / remove — ✦ = ConvEngine accent</p>
          <div className="flex flex-wrap gap-1.5">
            {CHIPS.map(({ label, brand }) => {
              const active = activeSet.has(label);
              return (
                <button key={label} onClick={() => toggleChip(label)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors border ${
                    active
                      ? brand ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-sky-600 text-white border-sky-700'
                      : brand ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {label}{brand ? ' ✦' : ''}
                </button>
              );
            })}
          </div>
        </div>
        {/* Live preview */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Preview</p>
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-center min-h-[80px]">
            <span style={{ ...styles, display: 'inline-block' }}>I am styled by your classes</span>
          </div>
        </div>
        {/* Class breakdown */}
        {(resolved.length > 0 || unknown.length > 0) && (
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">What each class does</p>
            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-400">
                    <th className="px-3 py-2 text-left font-mono font-semibold">class</th>
                    <th className="px-3 py-2 text-left font-mono font-semibold">CSS property</th>
                    <th className="px-3 py-2 text-left font-mono font-semibold">resolves to</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700/50">
                  {resolved.map(({ cls, prop, val }, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-mono text-amber-300">{cls}</td>
                      <td className="px-3 py-2 font-mono text-sky-300">{prop}</td>
                      <td className="px-3 py-2 font-mono text-emerald-300 break-all">{val}</td>
                    </tr>
                  ))}
                  {unknown.map((cls, i) => (
                    <tr key={`u${i}`} className="opacity-40">
                      <td className="px-3 py-2 font-mono text-rose-400">{cls}</td>
                      <td className="px-3 py-2 text-slate-500 italic" colSpan={2}>not in this demo&apos;s parser</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main view
// ─────────────────────────────────────────────────────────────────────────────
export function ChatSettingsView({ onSettingsChange, hideHeader = false, chatActionsRef = null }) {
  const [settings, setSettings] = useState({
    showFeedback:          true,
    showAudit:             false,
    showEngineStatus:      true,
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
    iconColor:       { light: '', dark: '' },
    composerShape:   'round',
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
          <NavDot href="#tailwind">Tailwind Integration</NavDot>
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
              <CodeBlock lang="bash" code={`npm install @salilvnair/convengine-chat\n# or link a local build during development\nnpm install ../convengine-chat`} />
              <p className="text-sm text-slate-600">Import the CSS once in your app entry:</p>
              <CodeBlock lang="jsx" code={`// app/layout.jsx  (or any JS/JSX entry file)\nimport '@salilvnair/convengine-chat/style.css';`} />
              <Tip color="amber" icon="⚡" title="Next.js users">
                Add <code className="font-mono text-xs bg-amber-100 px-1 rounded">transpilePackages: [&apos;@salilvnair/convengine-chat&apos;]</code> to your <code className="font-mono text-xs bg-amber-100 px-1 rounded">next.config.mjs</code>.{' '}
                <strong>Only needed when using a local <code className="font-mono text-xs bg-amber-100 px-1 rounded">file:</code> path during development</strong> — not required once the package is published to npm,
                because the published version ships only the pre-built <code className="font-mono text-xs bg-amber-100 px-1 rounded">dist/</code> output (no raw JSX).
              </Tip>
              <CodeBlock lang="js" code={`// next.config.mjs\nconst nextConfig = {\n  transpilePackages: ['@salilvnair/convengine-chat'],\n};\nexport default nextConfig;`} />
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
`import { ConvEngineChat, useChatActions } from '@salilvnair/convengine-chat';
import '@salilvnair/convengine-chat/style.css'; // once in your app entry

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
    showEngineStatus:      true,   // intent/state/time bar (fullscreen only)
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
                <PropRow prop="showEngineStatus"      type='boolean'  defaultVal='true'                                        description='Show the engine status bar (intent, state, response time) in fullscreen and sidepanel modes.' />
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

          {/* Tailwind Integration */}
          <DocCard id="tailwind">
            <SectionHeader gradient="bg-gradient-to-r from-sky-500 to-cyan-500" icon="🌊" title="Tailwind Integration" subtitle="Make your app's colors follow the chat widget automatically" />
            <DocCardBody>

              {/* ── What is Tailwind ───────────────────────────────────── */}
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">What is Tailwind CSS?</p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tailwind CSS is a utility-first styling library. Instead of writing custom CSS files, you style elements
                directly in your HTML/JSX using short class names like <code className="font-mono text-xs bg-sky-100 px-1 rounded">bg-blue-500</code> (blue background),{' '}
                <code className="font-mono text-xs bg-sky-100 px-1 rounded">text-white</code> (white text), or{' '}
                <code className="font-mono text-xs bg-sky-100 px-1 rounded">rounded-xl</code> (rounded corners).
                It&apos;s widely used because it&apos;s fast to write, easy to read, and produces small CSS bundles.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                The key feature relevant here is <strong>custom color aliases</strong> — you can teach Tailwind new color names
                (like <code className="font-mono text-xs bg-sky-100 px-1 rounded">brand</code>) and then use them exactly like built-in colors:
                {' '}<code className="font-mono text-xs bg-sky-100 px-1 rounded">bg-brand</code>,{' '}
                <code className="font-mono text-xs bg-sky-100 px-1 rounded">text-brand</code>,{' '}
                <code className="font-mono text-xs bg-sky-100 px-1 rounded">border-brand</code>, and so on.
              </p>

              {/* ── Interactive Tailwind playground */}
              <div className="space-y-1 mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tailwind in 60 seconds — try it live</p>
                <p className="text-xs text-slate-500">Click the options below and watch the className and preview update in real time — no setup needed.</p>
              </div>
              <TailwindPlayground />

              {/* ── Type-your-own demo */}
              <div className="space-y-1 mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Click classes and see them live — including bg-brand</p>
                <p className="text-xs text-slate-500">
                  Click any chip to toggle it on/off. The preview updates instantly and the table shows exactly what CSS each class produces.
                  Try <code className="font-mono bg-slate-100 px-1 rounded text-[11px]">bg-brand</code> — it picks up ConvEngine&apos;s accent color live.
                </p>
              </div>
              <TailwindClassInputDemo />

              {/* ── How ConvEngine fits in ─────────────────────────────── */}
              <div className="space-y-1 mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">How ConvEngine works with Tailwind</p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                ConvEngine stores its active theme colors as <strong>CSS variables</strong> on the page — for example,
                the accent color lives in <code className="font-mono text-xs bg-sky-100 px-1 rounded">--ce-color-accent</code>.
                When you change the accent via the <code className="font-mono text-xs bg-sky-100 px-1 rounded">theme</code> prop,
                that variable updates instantly across the whole page.
              </p>
              <Tip color="sky" icon="💡" title="The connection">
                Point a Tailwind color alias at that CSS variable. Now <code className="font-mono text-xs bg-sky-100 px-1 rounded">bg-brand</code> in
                any of your own components will always match the chat widget&apos;s accent — no manual syncing, no hard-coded hex values ever.
              </Tip>

              {/* ── Step 1 ────────────────────────────────────────────── */}
              <div className="space-y-1 mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step 1 — Add aliases to tailwind.config.js</p>
                <p className="text-xs text-slate-500">Do this once. It&apos;s just a name pointing at a CSS variable.</p>
              </div>
              <CodeBlock lang="js" code={`// tailwind.config.js\nmodule.exports = {\n  content: ['./src/**/*.{js,jsx,ts,tsx}'],\n  theme: {\n    extend: {\n      colors: {\n        brand:         'var(--ce-color-accent)',       // the main accent\n        'brand-hover': 'var(--ce-color-accent-hover)', // hover shade\n        'chat-user':   'var(--ce-bg-bubble-user)',     // user bubble fill\n        'chat-agent':  'var(--ce-bg-bubble-agent)',    // agent bubble fill\n        'chat-panel':  'var(--ce-bg-panel)',           // chat background\n      },\n    },\n  },\n};`} />

              {/* ── Step 2 ────────────────────────────────────────────── */}
              <div className="space-y-1 mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step 2 — Use bg-brand / text-brand in your components</p>
                <p className="text-xs text-slate-500">Write Tailwind classes as you normally would — colors just happen to live-sync with the chat.</p>
              </div>
              <CodeBlock lang="jsx" code={`// A simple call-to-action button that matches the chat accent\nexport function AskButton({ onClick }) {\n  return (\n    <button\n      onClick={onClick}\n      className="bg-brand hover:bg-brand-hover text-white\n                 font-semibold px-5 py-2.5 rounded-xl transition-colors"\n    >\n      Ask ConvEngine →\n    </button>\n  );\n}`} />

              {/* ── Step 3 ────────────────────────────────────────────── */}
              <div className="space-y-1 mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step 3 — Change the accent once, everything updates</p>
                <p className="text-xs text-slate-500">
                  Pass a new accent to <code className="font-mono bg-slate-100 px-1 rounded text-[11px]">ConvEngineChat</code> via the <code className="font-mono bg-slate-100 px-1 rounded text-[11px]">theme</code> prop.
                  Every component using <code className="font-mono bg-slate-100 px-1 rounded text-[11px]">bg-brand</code> or <code className="font-mono bg-slate-100 px-1 rounded text-[11px]">text-brand</code> updates automatically.
                </p>
              </div>
              <CodeBlock lang="jsx" code={`// Switch to emerald theme — the button above turns green instantly\n<ConvEngineChat\n  theme={{\n    'color-accent':       '#10b981',\n    'color-accent-hover': '#059669',\n  }}\n/>\n\n// Switch to indigo — everything turns indigo\n<ConvEngineChat\n  theme={{ 'color-accent': '#6366f1', 'color-accent-hover': '#4f46e5' }}\n/>`} />

              {/* ── Real-world example 1 ──────────────────────────────── */}
              <div className="space-y-1 mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Real-world example — notification banner</p>
                <p className="text-xs text-slate-500">
                  A banner that tells users the chat has a reply. It uses a soft tint of the accent for the background
                  and the full accent for the button — all from <code className="font-mono bg-slate-100 px-1 rounded text-[11px]">bg-brand</code>.
                </p>
              </div>
              <CodeBlock lang="jsx" code={`export function ChatNotificationBanner({ message, onOpen }) {\n  return (\n    <div className="bg-brand/10 border border-brand/30 rounded-2xl\n                    px-4 py-3 flex items-center gap-3">\n\n      {/* Pulsing dot in accent color */}\n      <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />\n\n      <p className="flex-1 text-sm text-brand font-medium">{message}</p>\n\n      <button\n        onClick={onOpen}\n        className="bg-brand hover:bg-brand-hover text-white\n                   text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"\n      >\n        Open chat\n      </button>\n    </div>\n  );\n}\n\n// Usage\n<ChatNotificationBanner message="ConvEngine has a response for you!" onOpen={openChat} />`} />
              <TailwindNotificationPreview />

              {/* ── Real-world example 2 ──────────────────────────────── */}
              <div className="space-y-1 mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Real-world example — sidebar badge &amp; nav highlight</p>
                <p className="text-xs text-slate-500">
                  An unread count badge and an active navigation link — both automatically brand-colored.
                </p>
              </div>
              <CodeBlock lang="jsx" code={`// Unread message badge in your sidebar\nexport function UnreadBadge({ count }) {\n  return (\n    <span className="bg-brand text-white text-xs font-bold\n                     w-5 h-5 rounded-full flex items-center justify-center">\n      {count}\n    </span>\n  );\n}\n\n// Active nav item that matches the chat accent\nexport function NavItem({ label, active, onClick }) {\n  return (\n    <button\n      onClick={onClick}\n      className={\`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium\n        transition-colors\n        \${active\n          ? 'bg-brand/10 text-brand border-l-2 border-brand'\n          : 'text-slate-500 hover:bg-slate-100'\n        }\`}\n    >\n      {label}\n    </button>\n  );\n}`} />
              <TailwindSidebarPreview />

              {/* ── Token table ───────────────────────────────────────── */}
              <div className="space-y-1 mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">All available CSS variables</p>
                <p className="text-xs text-slate-500">Map any of these to a Tailwind alias and use it freely in your own components.</p>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-xs uppercase text-slate-400 tracking-wider">
                      <th className="px-4 py-3 text-left font-bold">CSS Variable</th>
                      <th className="px-4 py-3 text-left font-bold">Suggested alias</th>
                      <th className="px-4 py-3 text-left font-bold">Tailwind utilities you get</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {[
                      ['--ce-color-accent',       'brand',        'bg-brand  text-brand  border-brand  ring-brand'],
                      ['--ce-color-accent-hover',  'brand-hover',  'hover:bg-brand-hover  hover:text-brand-hover'],
                      ['--ce-bg-bubble-user',      'chat-user',    'bg-chat-user  text-chat-user'],
                      ['--ce-bg-bubble-agent',     'chat-agent',   'bg-chat-agent  text-chat-agent'],
                      ['--ce-bg-panel',            'chat-panel',   'bg-chat-panel'],
                      ['--ce-font-family',         'font-chat (fontFamily)',  'font-chat'],
                    ].map(([token, alias, utilities]) => (
                      <tr key={token} className="hover:bg-sky-50/40">
                        <td className="px-4 py-2.5 font-mono text-xs text-sky-600 font-semibold">{token}</td>
                        <td className="px-4 py-2.5"><code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{alias}</code></td>
                        <td className="px-4 py-2.5 text-xs text-slate-500 font-mono">{utilities}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Tip color="amber" icon="⚠️" title="Using Tailwind v4?">
                In Tailwind v4, skip <code className="font-mono text-xs bg-amber-100 px-1 rounded">tailwind.config.js</code> and
                add one line to your CSS instead:{' '}
                <code className="font-mono text-xs bg-amber-100 px-1 rounded">{'@theme { --color-brand: var(--ce-color-accent); }'}</code>
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
                <FeatureChip label="✈️ FlightCard" color="indigo" />
                <FeatureChip label="📦 OrderTracker" color="pink" />
                <FeatureChip label="🛍️ ProductRecommendation" color="amber" />
                <FeatureChip label="📊 DataTable (hideBubble)" color="emerald" />
              </div>
              <Tip color="green" icon="🏗️" title="How the registry works">
                Providers are sorted by <code className="font-mono text-xs bg-emerald-100 px-1 rounded">priority</code> (highest first). The first whose <code className="font-mono text-xs bg-emerald-100 px-1 rounded">match(ctx)</code> returns true wins. Built-ins have priority 100.
              </Tip>
              <CodeBlock lang="jsx" code={`// SelectionPromptRenderer.jsx\nexport function SelectionPromptRenderer({ payload, actions }) {\n  const [selected, setSelected] = useState(null);\n  return (\n    <div className="ce-interactive-card">\n      <p>{payload.question}</p>\n      {payload.options.map((o) => (\n        <label key={o.value}>\n          <input type="radio" value={o.value}\n            checked={selected === o.value}\n            onChange={() => setSelected(o.value)} />\n          {o.label}\n        </label>\n      ))}\n      <button disabled={!selected}\n        onClick={() => actions.submit(selected, { choice: selected })}>\n        Continue →\n      </button>\n    </div>\n  );\n}\n\n// Register it\nconst myProvider = {\n  key:      'SelectionPrompt',\n  priority: 200,\n  match:    (ctx) => ctx.effectiveType === 'SelectionPrompt',\n  Component: SelectionPromptRenderer,\n};\n\n<ConvEngineChat config={{ renderers: [myProvider] }} />`} />

              {/* ── Live Renderer Demo ───────────────────────────────────── */}
              <RendererLiveDemo chatActionsRef={chatActionsRef} />
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
              <CodeBlock lang="jsx" code={`import { ConvEngineChat } from '@salilvnair/convengine-chat';

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
              <CodeBlock lang="jsx" code={`import { useChatActions } from '@salilvnair/convengine-chat';\n\n// Inside a renderer or any child of <ConvEngineChat>:\nfunction HelpButton() {\n  const { actions } = useChatActions();\n  return (\n    <button\n      className="ce-interactive-submit"\n      onClick={() => actions.submitSilent({ intent: 'help' })}\n    >\n      Get Help\n    </button>\n  );\n}`} />
            </DocCardBody>
          </DocCard>

        </div>
      </div>
    </div>
  );
}

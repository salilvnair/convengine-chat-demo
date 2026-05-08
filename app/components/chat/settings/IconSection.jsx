'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Default SVG bodies for all user-facing icons
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_ICON_SVGS = {
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

export const ICON_META = {
  LandingAvatarIcon:  { label: 'Landing Avatar',       hint: 'config.icons.LandingAvatarIcon',  fill: false, where: 'Landing screen bot avatar',     group: 'Content Icons',    modes: ['panel','sidepanel','fullscreen'] },
  ChatBubbleIcon:     { label: 'FAB / Launcher',       hint: 'config.icons.ChatBubbleIcon',     fill: true,  where: 'FAB open button',              group: 'Content Icons',    modes: ['panel','sidepanel'] },
  AgentIcon:          { label: 'Agent Avatar',         hint: 'config.icons.AgentIcon',          fill: false, where: 'Every assistant message',      group: 'Content Icons',    modes: ['panel','sidepanel','fullscreen'] },
  UserIcon:           { label: 'User Avatar',          hint: 'config.icons.UserIcon',           fill: false, where: 'Every user message',            group: 'Content Icons',    modes: ['panel','sidepanel','fullscreen'] },
  SendIcon:           { label: 'Send Button',          hint: 'config.icons.SendIcon',           fill: true,  where: 'Composer send button',         group: 'Content Icons',    modes: ['panel','sidepanel','fullscreen'] },
  ThumbUpIcon:        { label: 'Feedback Thumbs Up',   hint: 'config.icons.ThumbUpIcon',        fill: false, where: 'Feedback row (below AI)',       group: 'Content Icons',    modes: ['panel','sidepanel','fullscreen'] },
  ThumbDownIcon:      { label: 'Feedback Thumbs Down', hint: 'config.icons.ThumbDownIcon',      fill: false, where: 'Feedback row (below AI)',       group: 'Content Icons',    modes: ['panel','sidepanel','fullscreen'] },
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

export function SvgPreview({ innerSvg, fill = false, size = 28, accentColor = '#6366f1' }) {
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${fill ? 'currentColor' : 'none'}" stroke="${fill ? 'none' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${innerSvg}</svg>`;
  return (
    <div
      style={{ color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', width: size + 8, height: size + 8 }}
      dangerouslySetInnerHTML={{ __html: svgStr }}
    />
  );
}

export function svgStringToComponent(innerSvg, fill = false) {
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

export function IconGrid({ iconSvgs, onIconChange, onIconReset, currentMode, accentColor = '#6366f1', iconColorSetting, previewDark = false }) {
  const [editKey, setEditKey] = useState(null);
  const [copied,  setCopied]  = useState(null);
  const meta = editKey ? ICON_META[editKey] : null;

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
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">{grpName}</p>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
              {keys.map((key) => {
                const m = ICON_META[key];
                const isModified = iconSvgs[key] !== DEFAULT_ICON_SVGS[key];
                return (
                  <div
                    key={key}
                    className="group relative flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 rounded-xl p-2 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all"
                  >
                    {isModified && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-600">
                      <SvgPreview innerSvg={iconSvgs[key]} fill={m.fill} size={18} accentColor={resolvedIconColor} />
                    </div>
                    <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400 text-center leading-tight line-clamp-2 w-full">{m.label}</p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-0.5">
                      <button
                        title="Copy SVG"
                        onClick={() => handleCopy(key)}
                        className="w-5 h-5 flex items-center justify-center rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors text-[9px] font-bold"
                      >
                        {copied === key ? '✓' : '⎘'}
                      </button>
                      <button
                        title="Edit SVG"
                        onClick={() => setEditKey(key)}
                        className="w-5 h-5 flex items-center justify-center rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors text-[10px]"
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
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-5 w-[340px] space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{meta.label}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{meta.hint}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Used in: {meta.where}</p>
              </div>
              <button
                onClick={() => setEditKey(null)}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
              >✕</button>
            </div>
            <div className="flex items-center justify-center h-14 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
              <SvgPreview innerSvg={iconSvgs[editKey]} fill={meta.fill} size={32} accentColor={resolvedIconColor} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Inner SVG markup</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Paths/shapes only — no outer &lt;svg&gt; tag</p>
              <textarea
                rows={4}
                value={iconSvgs[editKey]}
                onChange={(e) => onIconChange(editKey, e.target.value)}
                spellCheck={false}
                className="w-full text-[10px] font-mono border border-slate-200 dark:border-slate-600 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 bg-white dark:bg-slate-700 dark:text-slate-100 resize-y"
              />
            </div>
            <div className="flex items-center justify-between">
              {iconSvgs[editKey] !== DEFAULT_ICON_SVGS[editKey] ? (
                <button
                  onClick={() => onIconChange(editKey, DEFAULT_ICON_SVGS[editKey])}
                  className="text-xs text-slate-400 dark:text-slate-500 hover:text-rose-500 border border-slate-200 dark:border-slate-600 hover:border-rose-300 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 transition-all"
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

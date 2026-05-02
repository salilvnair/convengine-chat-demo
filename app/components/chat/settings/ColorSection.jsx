'use client';

import { useState } from 'react';

export const COLOR_DEFAULTS = {
  bubbleUserBg:    { light: '#6366f1', dark: 'linear-gradient(90deg, rgba(37,99,235,0.55) 0%, rgba(96,165,250,0.38) 100%)' },
  bubbleUserText:  { light: '#ffffff',  dark: '#eaf2ff' },
  bubbleAgentBg:   { light: '#f1f5f9',  dark: '#2b2b2b' },
  bubbleAgentText: { light: '#1e293b',  dark: '#f2f6fa' },
  panelBg:         { light: '#ffffff',  dark: '#212121' },
  composerBg:      { light: '#ffffff',  dark: '#2b2b2b' },
  iconColor:       { light: '#64748b',  dark: '#9ca3af' },
};

export const COLOR_TILE_META = [
  { key: 'bubbleUserBg',    label: 'User Bubble Bg',    hint: 'config.bubbleUserBg',    modes: ['panel','sidepanel','fullscreen'] },
  { key: 'bubbleUserText',  label: 'User Bubble Text',  hint: 'config.bubbleUserText',  modes: ['panel','sidepanel','fullscreen'] },
  { key: 'bubbleAgentBg',   label: 'Agent Bubble Bg',   hint: 'config.bubbleAgentBg',   modes: ['panel','sidepanel','fullscreen'] },
  { key: 'bubbleAgentText', label: 'Agent Bubble Text', hint: 'config.bubbleAgentText', modes: ['panel','sidepanel','fullscreen'] },
  { key: 'panelBg',         label: 'Panel Bg',          hint: 'config.panelBg',         modes: ['panel','sidepanel'] },
  { key: 'composerBg',      label: 'Composer Bg',       hint: 'config.composerBg',      modes: ['panel','sidepanel','fullscreen'] },
  { key: 'iconColor',       label: 'Icon Color',        hint: 'config.iconColor',       modes: ['panel','sidepanel','fullscreen'] },
];

export function ColorVariantRow({ isDarkMode, value, defaultVal, onChange }) {
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

export function ColorAssetInput({ configKey, label, hint, value, onChange }) {
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

export function ColorGrid({ settings, onChange, currentMode, accentColor = '#6366f1', previewDark = false }) {
  const [editKey, setEditKey] = useState(null);
  const editMeta = editKey ? COLOR_TILE_META.find((m) => m.key === editKey) : null;
  const visibleMeta = currentMode
    ? COLOR_TILE_META.filter((m) => m.modes.includes(currentMode))
    : COLOR_TILE_META;

  function getDefault(key, variant) {
    if (key === 'bubbleUserBg' && variant === 'light') return accentColor;
    return COLOR_DEFAULTS[key]?.[variant] ?? (variant === 'light' ? '#e2e8f0' : '#374151');
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {visibleMeta.map(({ key, label, hint }) => {
          const v = settings[key] ?? { light: '', dark: '' };
          const displayBg = previewDark
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

'use client';

import { useState } from 'react';

const COLOR_PALETTE = [
  '#6366f1','#818cf8','#a855f7','#8b5cf6','#d946ef',
  '#3b82f6','#0ea5e9','#06b6d4','#0891b2','#0e7490',
  '#10b981','#22c55e','#84cc16','#65a30d','#166534',
  '#f59e0b','#f97316','#ef4444','#e11d48','#ec4899',
  '#1e293b','#475569','#94a3b8','#334155','#0f172a',
];

export function ColorPicker({ value, onChange }) {
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

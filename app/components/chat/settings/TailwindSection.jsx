'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Accent presets shared across all Tailwind previews
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

// ─────────────────────────────────────────────────────────────────────────────
// Tailwind Playground — Button / Card / Text tabs
// ─────────────────────────────────────────────────────────────────────────────
export function TailwindPlayground() {
  const [tab, setTab] = useState('button');

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

  const TXT_COLORS = [
    { n: 'Default', hex: '#1e293b', cls: 'text-slate-800' },
    { n: 'Sky',     hex: '#0284c7', cls: 'text-sky-600' },
    { n: 'Emerald', hex: '#059669', cls: 'text-emerald-600' },
    { n: 'Rose',    hex: '#e11d48', cls: 'text-rose-600' },
    { n: 'Violet',  hex: '#7c3aed', cls: 'text-violet-600' },
    { n: 'Amber',   hex: '#d97706', cls: 'text-amber-600' },
  ];
  const TXT_SIZES = [
    { n: 'sm',   val: '14px', cls: 'text-sm' },
    { n: 'base', val: '16px', cls: 'text-base' },
    { n: 'lg',   val: '18px', cls: 'text-lg' },
    { n: 'xl',   val: '20px', cls: 'text-xl' },
    { n: '2xl',  val: '24px', cls: 'text-2xl' },
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
      <div className="px-4 py-3 border-b border-sky-100 flex flex-wrap items-center gap-2">
        <span className="text-base">🎨</span>
        <div>
          <p className="text-sm font-bold text-sky-800">Tailwind Playground — Try it live</p>
          <p className="text-xs text-sky-500">Click an option → watch the preview change → read the Tailwind className that produced it</p>
        </div>
      </div>
      <div className="flex border-b border-sky-100">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors ${tab === id ? 'bg-white text-sky-700 border-b-2 border-sky-500' : 'text-sky-500 hover:bg-sky-100/60'}`}
          >{label}</button>
        ))}
      </div>
      <div className="p-4 space-y-3">
        {tab === 'button' && (
          <>
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-center min-h-[80px]">
              <button style={btnPreviewStyle} onMouseEnter={() => setBHover(true)} onMouseLeave={() => setBHover(false)}>Click me</button>
            </div>
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
            <div className="bg-slate-900 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 mb-1 font-mono uppercase tracking-wider">The Tailwind className that styles the button above:</p>
              <p className="text-xs font-mono text-emerald-300 break-all">&quot;{btnCls}&quot;</p>
            </div>
          </>
        )}
        {tab === 'card' && (
          <>
            <div className="bg-slate-100 rounded-xl p-6 flex items-center justify-center min-h-[120px]">
              <div style={cardPreviewStyle}>
                <p style={{ fontWeight: '600', color: '#334155', fontSize: '14px', marginBottom: 4 }}>Card Title</p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Composed entirely from Tailwind utility classes — no custom CSS file needed.</p>
              </div>
            </div>
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
            <div className="bg-slate-900 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 mb-1 font-mono uppercase tracking-wider">The Tailwind className that styles the card above:</p>
              <p className="text-xs font-mono text-emerald-300 break-all">&quot;{cardCls}&quot;</p>
            </div>
          </>
        )}
        {tab === 'text' && (
          <>
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-center min-h-[80px]">
              <p style={textPreviewStyle}>The quick brown fox jumps over the lazy dog</p>
            </div>
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

// ─────────────────────────────────────────────────────────────────────────────
// Notification banner live preview
// ─────────────────────────────────────────────────────────────────────────────
export function TailwindNotificationPreview() {
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
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: hex + '18', border: `1px solid ${hex}45` }}>
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

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar + nav badge live preview
// ─────────────────────────────────────────────────────────────────────────────
export function TailwindSidebarPreview() {
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
// CSS color map + spacing scale (used by the class-input demo)
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
    const bgM = cls.match(/^bg-(.+)$/);
    if (!hit && bgM && TW_COLOR_MAP[bgM[1]] !== undefined) trySet('backgroundColor', TW_COLOR_MAP[bgM[1]], 'background-color');
    const tcM = cls.match(/^text-(.+)$/);
    if (!hit && tcM && TW_COLOR_MAP[tcM[1]] !== undefined) trySet('color', TW_COLOR_MAP[tcM[1]], 'color');
    const tSizeMap = {'text-xs':'12px','text-sm':'14px','text-base':'16px','text-lg':'18px','text-xl':'20px','text-2xl':'24px','text-3xl':'30px','text-4xl':'36px','text-5xl':'48px'};
    if (!hit && tSizeMap[cls]) trySet('fontSize', tSizeMap[cls], 'font-size');
    const fwMap = {'font-thin':'100','font-extralight':'200','font-light':'300','font-normal':'400','font-medium':'500','font-semibold':'600','font-bold':'700','font-extrabold':'800','font-black':'900'};
    if (!hit && fwMap[cls]) trySet('fontWeight', fwMap[cls], 'font-weight');
    const rMap = {'rounded-none':'0','rounded-sm':'2px','rounded':'4px','rounded-md':'6px','rounded-lg':'8px','rounded-xl':'12px','rounded-2xl':'16px','rounded-3xl':'24px','rounded-full':'9999px'};
    if (!hit && rMap[cls]) trySet('borderRadius', rMap[cls], 'border-radius');
    const pM  = cls.match(/^p-(\d+(?:\.\d+)?)$/);
    if (!hit && pM  && TW_PX[pM[1]])  { styles.padding = TW_PX[pM[1]]; resolved.push({ cls, prop:'padding', val:TW_PX[pM[1]] }); hit = true; }
    const pxM = cls.match(/^px-(\d+(?:\.\d+)?)$/);
    if (!hit && pxM && TW_PX[pxM[1]]) { styles.paddingLeft = styles.paddingRight = TW_PX[pxM[1]]; resolved.push({ cls, prop:'padding-inline', val:TW_PX[pxM[1]] }); hit = true; }
    const pyM = cls.match(/^py-(\d+(?:\.\d+)?)$/);
    if (!hit && pyM && TW_PX[pyM[1]]) { styles.paddingTop = styles.paddingBottom = TW_PX[pyM[1]]; resolved.push({ cls, prop:'padding-block', val:TW_PX[pyM[1]] }); hit = true; }
    const bwMap = {'border':'1px solid','border-0':'none','border-2':'2px solid','border-4':'4px solid','border-8':'8px solid'};
    if (!hit && bwMap[cls]) trySet('border', bwMap[cls], 'border');
    const bcM = cls.match(/^border-(.+)$/);
    if (!hit && bcM && TW_COLOR_MAP[bcM[1]] !== undefined) { styles.borderColor = TW_COLOR_MAP[bcM[1]]; if (!styles.border) styles.border = '1px solid'; resolved.push({ cls, prop:'border-color', val:TW_COLOR_MAP[bcM[1]] }); hit = true; }
    const shMap = {'shadow-sm':'0 1px 2px 0 rgb(0 0 0/0.05)','shadow':'0 1px 3px 0 rgb(0 0 0/0.1)','shadow-md':'0 4px 6px -1px rgb(0 0 0/0.1)','shadow-lg':'0 10px 15px -3px rgb(0 0 0/0.1)','shadow-xl':'0 20px 25px -5px rgb(0 0 0/0.1)','shadow-2xl':'0 25px 50px -12px rgb(0 0 0/0.25)','shadow-none':'none'};
    if (!hit && shMap[cls]) trySet('boxShadow', shMap[cls], 'box-shadow');
    const opM = cls.match(/^opacity-(\d+)$/);
    if (!hit && opM) trySet('opacity', parseInt(opM[1]) / 100, 'opacity', opM[1] + '%');
    if (!hit && cls === 'italic')       trySet('fontStyle',      'italic',       'font-style');
    if (!hit && cls === 'not-italic')   trySet('fontStyle',      'normal',       'font-style');
    if (!hit && cls === 'underline')    trySet('textDecoration', 'underline',    'text-decoration');
    if (!hit && cls === 'line-through') trySet('textDecoration', 'line-through', 'text-decoration');
    if (!hit) unknown.push(cls);
  }
  return { styles, resolved, unknown };
}

// ─────────────────────────────────────────────────────────────────────────────
// Chip-toggle class builder with live CSS breakdown table
// ─────────────────────────────────────────────────────────────────────────────
export function TailwindClassInputDemo() {
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
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Preview</p>
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-center min-h-[80px]">
            <span style={{ ...styles, display: 'inline-block' }}>I am styled by your classes</span>
          </div>
        </div>
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

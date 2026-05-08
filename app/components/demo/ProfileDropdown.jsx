'use client';

import { useState, useRef, useEffect } from 'react';

const MENU_ITEMS = [
  { icon: '👤', label: 'View Profile',   sub: 'salil@example.com' },
  { icon: '💳', label: 'Billing',        sub: 'Pro Plan · $299/mo' },
  { icon: '🔑', label: 'API Keys',       sub: null },
  { icon: '🌐', label: 'Language',       sub: 'English' },
  null, // divider
  { icon: '🚪', label: 'Sign out',       sub: null, danger: true },
];

export function ProfileDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-8 h-8 rounded-full font-semibold text-sm flex items-center justify-center transition-all ${
          open
            ? 'bg-indigo-500 text-white ring-2 ring-indigo-300'
            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
        }`}
      >
        S
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-10 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-fade-in">
          {/* User card */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                S
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">Salil Nair</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">salil@example.com</p>
                <span className="inline-block mt-0.5 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded font-medium">
                  Admin · Pro Plan
                </span>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {MENU_ITEMS.map((item, i) => {
              if (item === null) {
                return <div key={`div-${i}`} className="my-1 border-t border-slate-100 dark:border-slate-700" />;
              }
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setOpen(false);
                    if (item.label === 'View Profile') onNavigate?.('Settings');
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                    item.danger ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">{item.label}</p>
                    {item.sub && (
                      <p className="text-xs text-slate-400 truncate">{item.sub}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

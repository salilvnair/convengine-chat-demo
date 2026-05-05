'use client';

import { useState, useEffect } from 'react';

export function scrollToConfigProp(key) {
  const id = `config-${key}`;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.setAttribute('data-ce-highlight', 'true');
  setTimeout(() => el.removeAttribute('data-ce-highlight'), 1800);
}

export function BackToTop({ accentColor }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() { setVisible(window.scrollY > 400); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Back to top"
      style={accentColor ? { backgroundColor: accentColor } : undefined}
      className="fixed bottom-24 right-12 sm:bottom-24 sm:right-8 z-[1200] w-10 h-10 rounded-full bg-indigo-500 text-white shadow-lg ring-1 ring-white/70 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
    >
      <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12V4M4 8l4-4 4 4"/>
      </svg>
    </button>
  );
}

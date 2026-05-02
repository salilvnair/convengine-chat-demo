'use client';

export function SectionHeader({ gradient, icon, title, subtitle }) {
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

export function FeatureChip({ label, color }) {
  const c = {
    indigo:  'bg-indigo-100 text-indigo-700 border-indigo-200',
    sky:     'bg-sky-100 text-sky-700 border-sky-200',
    violet:  'bg-violet-100 text-violet-700 border-violet-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    pink:    'bg-pink-100 text-pink-700 border-pink-200',
    amber:   'bg-amber-100 text-amber-700 border-amber-200',
    orange:  'bg-orange-100 text-orange-700 border-orange-200',
    teal:    'bg-teal-100 text-teal-700 border-teal-200',
    rose:    'bg-rose-100 text-rose-700 border-rose-200',
  }[color] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${c}`}>{label}</span>;
}

export function DocCard({ id, children }) {
  return (
    <section id={id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {children}
    </section>
  );
}

export function DocCardBody({ children }) {
  return <div className="p-6 space-y-4">{children}</div>;
}

export function NavDot({ href, children }) {
  return (
    <a href={href} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors py-1 rounded-lg hover:bg-indigo-50 px-2 -mx-2">
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 flex-shrink-0" />
      {children}
    </a>
  );
}

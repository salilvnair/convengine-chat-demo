'use client';

export function Tip({ color = 'blue', icon, title, children }) {
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

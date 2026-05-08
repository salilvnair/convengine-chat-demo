'use client';

export function Tip({ color = 'blue', icon, title, children }) {
  const schemes = {
    blue:   'bg-sky-50 border-sky-300 text-sky-800 dark:bg-sky-900/30 dark:border-sky-700 dark:text-sky-200',
    green:  'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-200',
    amber:  'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-200',
    violet: 'bg-violet-50 border-violet-300 text-violet-800 dark:bg-violet-900/30 dark:border-violet-700 dark:text-violet-200',
    pink:   'bg-pink-50 border-pink-300 text-pink-800 dark:bg-pink-900/30 dark:border-pink-700 dark:text-pink-200',
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

'use client';

const TYPE_COLORS = {
  string:   'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700',
  boolean:  'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
  object:   'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700',
  function: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700',
  Array:    'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-700',
  number:   'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-700',
};

export function TypeBadge({ type }) {
  const base = TYPE_COLORS[type.split('|')[0].trim().replace(/['"]/g, '')] ?? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
  return <span className={`inline-block px-1.5 py-0.5 rounded-md border text-[10px] font-mono font-semibold ${base}`}>{type}</span>;
}

export function DefaultBadge({ val }) {
  if (!val || val === 'undefined') return <span className="text-slate-400 dark:text-slate-500 text-xs font-mono">—</span>;
  return <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold">{val}</span>;
}

export function PropRow({ id, prop, type, defaultVal, description }) {
  return (
    <tr id={id} className="hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold whitespace-nowrap">{prop}</td>
      <td className="px-4 py-3"><TypeBadge type={type} /></td>
      <td className="px-4 py-3"><DefaultBadge val={defaultVal} /></td>
      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{description}</td>
    </tr>
  );
}

export function PropsTable({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-700 text-xs uppercase text-slate-400 dark:text-slate-300 tracking-wider">
            <th className="px-4 py-3 text-left font-bold">Prop / Key</th>
            <th className="px-4 py-3 text-left font-bold">Type</th>
            <th className="px-4 py-3 text-left font-bold">Default</th>
            <th className="px-4 py-3 text-left font-bold">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-700 bg-white dark:bg-slate-800">{children}</tbody>
      </table>
    </div>
  );
}

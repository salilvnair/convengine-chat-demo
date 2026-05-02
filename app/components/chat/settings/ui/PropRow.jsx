'use client';

const TYPE_COLORS = {
  string:   'bg-sky-100 text-sky-700 border-sky-200',
  boolean:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  object:   'bg-violet-100 text-violet-700 border-violet-200',
  function: 'bg-orange-100 text-orange-700 border-orange-200',
  Array:    'bg-teal-100 text-teal-700 border-teal-200',
  number:   'bg-pink-100 text-pink-700 border-pink-200',
};

export function TypeBadge({ type }) {
  const base = TYPE_COLORS[type.split('|')[0].trim().replace(/['"]/g, '')] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  return <span className={`inline-block px-1.5 py-0.5 rounded-md border text-[10px] font-mono font-semibold ${base}`}>{type}</span>;
}

export function DefaultBadge({ val }) {
  if (!val || val === 'undefined') return <span className="text-slate-400 text-xs font-mono">—</span>;
  return <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold">{val}</span>;
}

export function PropRow({ id, prop, type, defaultVal, description }) {
  return (
    <tr id={id} className="hover:bg-indigo-50/40 transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-bold whitespace-nowrap">{prop}</td>
      <td className="px-4 py-3"><TypeBadge type={type} /></td>
      <td className="px-4 py-3"><DefaultBadge val={defaultVal} /></td>
      <td className="px-4 py-3 text-sm text-slate-600">{description}</td>
    </tr>
  );
}

export function PropsTable({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-xs uppercase text-slate-400 tracking-wider">
            <th className="px-4 py-3 text-left font-bold">Prop / Key</th>
            <th className="px-4 py-3 text-left font-bold">Type</th>
            <th className="px-4 py-3 text-left font-bold">Default</th>
            <th className="px-4 py-3 text-left font-bold">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">{children}</tbody>
      </table>
    </div>
  );
}

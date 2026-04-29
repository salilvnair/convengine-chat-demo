/**
 * Metric card — shows a KPI value with trend indicator.
 */
export function MetricCard({ icon, label, value, delta, positive, sub }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-2xl" role="img" aria-label={label}>{icon}</span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            positive
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-rose-700 bg-rose-50'
          }`}
        >
          {delta}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{label}</p>
      </div>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  );
}

/**
 * Simple CSS bar chart for weekly revenue — no external chart library needed.
 */
export function RevenueChart({ data }) {
  const max = Math.max(...data.map((d) => d.amount));
  const MAX_PX = 120;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
        Weekly Revenue
      </h3>
      <div className="flex items-end gap-3" style={{ height: `${MAX_PX + 32}px` }}>
        {data.map((item) => {
          const barH = Math.round((item.amount / max) * MAX_PX);
          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-1 group" style={{ height: '100%', justifyContent: 'flex-end' }}>
              <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                ${(item.amount / 1000).toFixed(1)}k
              </span>
              <div
                className="w-full rounded-t-md bg-indigo-500 group-hover:bg-indigo-400 transition-colors"
                style={{ height: `${barH}px`, flexShrink: 0 }}
                title={`${item.day}: $${item.amount.toLocaleString()}`}
              />
              <span className="text-xs text-slate-400 font-medium">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

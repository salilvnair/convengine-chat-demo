/**
 * Horizontal bar chart for traffic channels.
 */
export function ChannelsPanel({ channels }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
        Top Channels
      </h3>
      <div className="flex flex-col gap-3">
        {channels.map((ch) => (
          <div key={ch.channel}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700 dark:text-slate-200">{ch.channel}</span>
              <span className="text-slate-400 dark:text-slate-500 font-mono">{ch.pct}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${ch.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

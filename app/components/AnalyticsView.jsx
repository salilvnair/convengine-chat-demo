'use client';

import { MONTHLY_REVENUE, CONVERSION_FUNNEL, TOP_PRODUCTS } from '../data/dashboard.js';

function MonthlyChart({ data }) {
  const max = Math.max(...data.map((d) => d.amount));
  const MAX_PX = 130;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Monthly Revenue</h3>
        <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">+12.4% MoM</span>
      </div>
      <div className="flex items-end gap-3" style={{ height: `${MAX_PX + 36}px` }}>
        {data.map((item) => {
          const barH = Math.round((item.amount / max) * MAX_PX);
          const isLatest = item.month === data[data.length - 1].month;
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-1 group" style={{ height: '100%', justifyContent: 'flex-end' }}>
              <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                ${(item.amount / 1000).toFixed(0)}k
              </span>
              <div
                className={`w-full rounded-t-md transition-colors ${isLatest ? 'bg-indigo-500' : 'bg-indigo-200 group-hover:bg-indigo-300'}`}
                style={{ height: `${barH}px`, flexShrink: 0 }}
                title={`${item.month}: $${item.amount.toLocaleString()}`}
              />
              <span className="text-xs text-slate-400 font-medium">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConversionFunnel({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Conversion Funnel</h3>
      <div className="space-y-3">
        {data.map((stage, i) => (
          <div key={stage.stage}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">{stage.stage}</span>
              <span className="text-slate-400">{stage.count.toLocaleString()}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${stage.pct}%`,
                  background: `hsl(${240 - i * 30}, 80%, ${55 + i * 5}%)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Performance overview · Last 6 months</p>
        </div>
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 text-slate-600">
          <option>Last 6 months</option>
          <option>Last 3 months</option>
          <option>This year</option>
        </select>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Visitors',    value: '48,200', delta: '+8.2%',  positive: true  },
          { label: 'Conversion Rate',   value: '2.5%',   delta: '+0.3%',  positive: true  },
          { label: 'Avg. Order Value',  value: '$287',   delta: '-1.4%',  positive: false },
          { label: 'Churn Rate',        value: '3.1%',   delta: '-0.5%',  positive: true  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">{s.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{s.value}</p>
            <span className={`text-xs font-semibold ${s.positive ? 'text-emerald-600' : 'text-rose-600'}`}>{s.delta}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MonthlyChart data={MONTHLY_REVENUE} />
        </div>
        <ConversionFunnel data={CONVERSION_FUNNEL} />
      </div>

      {/* Top products */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Top Products by Revenue</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase text-slate-400 tracking-wide">
              <th className="px-5 py-3 text-left font-semibold">Product</th>
              <th className="px-5 py-3 text-right font-semibold">Revenue</th>
              <th className="px-5 py-3 text-right font-semibold">Units</th>
              <th className="px-5 py-3 text-right font-semibold">Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {TOP_PRODUCTS.map((p) => (
              <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-800">{p.name}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-slate-800">{p.revenue}</td>
                <td className="px-5 py-3.5 text-right text-slate-500">{p.units}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`text-xs font-semibold ${p.positive ? 'text-emerald-600' : 'text-rose-600'}`}>{p.growth}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

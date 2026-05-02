'use client';

import { useState } from 'react';
import { ALL_ORDERS } from '../../data/dashboard.js';

const STATUS_STYLES = {
  Completed:  'text-emerald-700 bg-emerald-50',
  Processing: 'text-amber-700   bg-amber-50',
  Refunded:   'text-rose-700    bg-rose-50',
};

const FILTERS = ['All', 'Completed', 'Processing', 'Refunded'];

export function OrdersView() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = ALL_ORDERS.filter((o) => {
    const matchFilter = filter === 'All' || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.customer.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.product.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-500 text-sm mt-1">{ALL_ORDERS.length} total orders this month</p>
        </div>
        <button className="px-4 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-lg hover:bg-indigo-600 transition-colors">
          + New Order
        </button>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Completed',  count: ALL_ORDERS.filter(o => o.status === 'Completed').length,  color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Processing', count: ALL_ORDERS.filter(o => o.status === 'Processing').length, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Refunded',   count: ALL_ORDERS.filter(o => o.status === 'Refunded').length,   color: 'text-rose-600 bg-rose-50 border-rose-100' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border px-5 py-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-sm font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filter === f
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search orders…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 w-full sm:w-52"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase text-slate-400 tracking-wide">
                <th className="px-5 py-3 text-left font-semibold">Order</th>
                <th className="px-5 py-3 text-left font-semibold">Customer</th>
                <th className="px-5 py-3 text-left font-semibold">Product</th>
                <th className="px-5 py-3 text-left font-semibold">Payment</th>
                <th className="px-5 py-3 text-right font-semibold">Amount</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">
                    No orders match your search.
                  </td>
                </tr>
              ) : filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5 font-mono text-slate-500 font-medium">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-800">{o.customer}</p>
                    <p className="text-xs text-slate-400">{o.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{o.product}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{o.payment}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-slate-800">{o.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status] ?? 'text-slate-600 bg-slate-100'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

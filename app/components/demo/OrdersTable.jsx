const STATUS_STYLES = {
  Completed:  'text-emerald-700 bg-emerald-50',
  Processing: 'text-amber-700   bg-amber-50',
  Refunded:   'text-rose-700    bg-rose-50',
};

/**
 * Table of recent orders with status badges.
 */
export function OrdersTable({ orders }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Recent Orders
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase text-slate-400 tracking-wide">
              <th className="px-5 py-3 text-left font-semibold">Order</th>
              <th className="px-5 py-3 text-left font-semibold">Customer</th>
              <th className="px-5 py-3 text-left font-semibold">Product</th>
              <th className="px-5 py-3 text-right font-semibold">Amount</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-slate-500 font-medium">{order.id}</td>
                <td className="px-5 py-3.5 font-medium text-slate-800">{order.customer}</td>
                <td className="px-5 py-3.5 text-slate-600">{order.product}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-slate-800">{order.amount}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] ?? 'text-slate-600 bg-slate-100'}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-400">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

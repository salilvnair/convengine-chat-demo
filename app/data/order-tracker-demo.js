export const ORDER_TRACKER_DEMO_PAYLOAD = {
  type: 'OrderTracker',
  orderId: 'CE-28471', product: 'MacBook Pro 14"', estimatedDelivery: 'May 3, 2026',
  steps: [
    { label: 'Order Placed',     date: 'Apr 29', done: true },
    { label: 'Packed & Ready',   date: 'Apr 30', done: true },
    { label: 'In Transit',       date: 'May 1',  done: true, current: true },
    { label: 'Out for Delivery', date: 'May 3',  done: false },
    { label: 'Delivered',        date: 'May 3',  done: false },
  ],
};

export const ORDER_TRACKER_DEMO_CODE = `// OrderTrackerComponent.jsx
// ── How data flows to your backend ────────────────────────────────────────
// 1. YOUR BACKEND returns this JSON as the assistant response:
//    { "type": "OrderTracker", "orderId": "CE-28471", "product": "MacBook Pro 14\\"",
//      "estimatedDelivery": "May 3, 2026",
//      "steps": [{ label, date, done, current? }] }
//    ConvEngine passes it as the \`payload\` prop to your component.
//
// Two buttons demonstrate two different actions:
//
// "Track in Detail" → actions.submitSilent({ action: 'track_detail', orderId })
//   • NO user bubble is shown in the chat (silent / invisible)
//   • Immediately POSTs to /chat:
//     { inputParams: { action: "track_detail", orderId: "CE-28471" } }
//   • YOUR BACKEND detects action === "track_detail" and returns a detail card.
//
// "Contact Support" → actions.prefillInput(\`I need help with order #\${orderId}\`)
//   • Fills the chat composer with the string — NOTHING is sent yet
//   • USER reviews/edits the pre-filled text and presses Send manually
//   • Only then does ConvEngine POST to your /chat endpoint with the final text
// ─────────────────────────────────────────────────────────────────────────

function OrderTrackerComponent({ payload, actions }) {
  const { orderId, product, estimatedDelivery, steps = [] } = payload;

  return (
    <div className="ce-interactive-card">
      <p className="ce-interactive-question">📦 Order #{orderId}</p>
      <p>{product} · Est. {estimatedDelivery}</p>

      {steps.map((step, i) => (
        <div key={i} style={{ fontWeight: step.current ? 700 : 400 }}>
          {step.done ? '✓' : '○'} {step.label} · {step.date}
        </div>
      ))}

      <button className="ce-interactive-submit"
        onClick={() =>
          // submitSilent() — sends to backend silently, no user bubble shown
          actions.submitSilent({ action: 'track_detail', orderId })
        }>
        📍 Track in Detail
      </button>

      <button
        onClick={() =>
          // prefillInput() — fills the composer so the user can review & edit
          actions.prefillInput(\`I need help with order #\${orderId}\`)
        }>
        💬 Contact Support
      </button>
    </div>
  );
}

export const orderTrackerRenderer = {
  key: 'OrderTracker',
  priority: 200,
  match: ({ effectiveType }) => effectiveType === 'OrderTracker',
  Component: OrderTrackerComponent,
};

// Wire into ConvEngineChat
<ConvEngineChat config={{ renderers: [orderTrackerRenderer] }} />`;

export const FLIGHT_DEMO_PAYLOAD = {
  type: 'FlightCard',
  from: 'New York (JFK)', to: 'San Francisco (SFO)', date: 'May 15, 2026',
  flights: [
    { id: 'f1', carrier: 'United Airlines',   departure: '06:00', arrival: '09:20', duration: '5h 20m', stops: 'Nonstop', price: '$289' },
    { id: 'f2', carrier: 'Delta Air Lines',    departure: '09:45', arrival: '13:15', duration: '5h 30m', stops: 'Nonstop', price: '$249' },
    { id: 'f3', carrier: 'American Airlines',  departure: '14:30', arrival: '19:50', duration: '5h 20m', stops: 'Nonstop', price: '$199' },
  ],
};

export const FLIGHT_DEMO_CODE = `// FlightCardComponent.jsx
// ── How data flows to your backend ────────────────────────────────────────
// 1. YOUR BACKEND returns this JSON as the assistant response:
//    { "type": "FlightCard", "from": "New York (JFK)", "to": "San Francisco (SFO)",
//      "flights": [{ id, carrier, departure, arrival, duration, stops, price }] }
//    ConvEngine detects "type", finds your renderer, and passes the full
//    JSON object as the \`payload\` prop to your component.
//
// 2. USER selects a flight row and clicks "Book Selected Flight →"
//
// 3. Your component calls:
//    actions.submit("Book Delta Air Lines at $249", {
//      action: "book_flight",
//      flightId: "f2"
//    });
//
// 4. ConvEngine does two things atomically:
//    a) Appends a user chat bubble: "Book Delta Air Lines at $249"
//    b) POSTs to your /chat endpoint:
//       { text: "Book Delta Air Lines at $249",
//         inputParams: { action: "book_flight", flightId: "f2" } }
//
// 5. YOUR BACKEND reads inputParams.action === "book_flight", processes the
//    booking for flightId "f2", and returns a confirmation message.
// ─────────────────────────────────────────────────────────────────────────

function FlightCardComponent({ payload, actions }) {
  const [selected, setSelected] = useState(payload.flights?.[0]?.id ?? null);
  const [booked, setBooked] = useState(false);
  const { from, to, date, flights = [] } = payload;

  if (booked) return <p>✅ Flight booked successfully!</p>;

  return (
    <div className="ce-interactive-card">
      <p className="ce-interactive-question">{from} → {to}</p>
      <p>{date}</p>

      {flights.map((f) => (
        <label key={f.id}>
          <input type="radio" value={f.id}
            checked={selected === f.id}
            onChange={() => setSelected(f.id)} />
          {f.carrier} · {f.departure}–{f.arrival} · {f.price}
        </label>
      ))}

      <button className="ce-interactive-submit" disabled={!selected}
        onClick={() => {
          const f = flights.find((f) => f.id === selected);
          setBooked(true);
          // submit() adds a user bubble AND sends to your backend
          actions.submit(\`Book \${f.carrier} at \${f.price}\`, {
            action: 'book_flight',
            flightId: selected,
          });
        }}>
        Book Selected Flight →
      </button>
    </div>
  );
}

// Register with the renderer registry
export const flightCardRenderer = {
  key: 'FlightCard',
  priority: 200,
  match: ({ effectiveType }) => effectiveType === 'FlightCard',
  Component: FlightCardComponent,
};

// Wire into ConvEngineChat
<ConvEngineChat config={{ renderers: [flightCardRenderer] }} />`;

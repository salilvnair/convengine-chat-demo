export const DATA_TABLE_DEMO_PAYLOAD = {
  type: 'DataTable',
  hideBubble: true,
  title: 'Q1 Sales Report',
  columns: ['Region', 'Revenue', 'Units', 'Growth'],
  rows: [
    ['North America', '$1.2M', '4,821', '+18%'],
    ['Europe',        '$0.9M', '3,204', '+12%'],
    ['Asia Pacific',  '$0.7M', '2,876', '+31%'],
    ['Latin America', '$0.3M', '1,102', '+9%'],
  ],
  summary: 'Total revenue $3.1M — all regions above target.',
};

export const DATA_TABLE_DEMO_CODE = `// DataTableComponent.jsx
// ── hideBubble = true ────────────────────────────────────────────────────
// When the payload includes "hideBubble": true, ConvEngine completely hides
// the default text bubble and renders ONLY your custom component.
// Use this for data-heavy responses (tables, charts) where the chat bubble
// would look out of place.
//
// ── How data flows ────────────────────────────────────────────────────────
// 1. YOUR BACKEND returns:
//    { "type": "DataTable", "hideBubble": true,
//      "title": "...", "columns": [...], "rows": [[...], ...], "summary": "..." }
//
// 2. ConvEngine sees hideBubble === true, renders ONLY DataTableComponent.
//
// 3. USER clicks "Export CSV" button in the component.
//
// 4. actions.appendBubble("Q1 report exported to CSV.", "assistant")
//    • Adds a new assistant bubble locally — NO API call is made.
//    • Use this for lightweight client-side feedback.
// ─────────────────────────────────────────────────────────────────────────

function DataTableComponent({ payload, actions }) {
  const { title, columns = [], rows = [], summary } = payload;

  return (
    <div className="ce-interactive-card">
      <p className="ce-interactive-question">📊 {title}</p>

      <table>
        <thead>
          <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>

      {summary && <p>{summary}</p>}

      <button className="ce-interactive-submit"
        onClick={() =>
          // appendBubble() adds a chat bubble without hitting your backend
          actions.appendBubble('Q1 report exported to CSV.', 'assistant')
        }>
        Export CSV
      </button>
    </div>
  );
}

export const dataTableRenderer = {
  key: 'DataTable',
  priority: 200,
  match: ({ effectiveType }) => effectiveType === 'DataTable',
  Component: DataTableComponent,
};

<ConvEngineChat config={{ renderers: [dataTableRenderer] }} />`;

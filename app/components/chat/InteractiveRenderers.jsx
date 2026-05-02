'use client';

import { useState, useRef, useEffect } from 'react';

/* ──────────────────────────────────────────────────────────────────────────
 * EXAMPLE INTERACTIVE RENDERERS
 *
 * Every renderer Component receives:
 *   payload   — parsed JSON from the assistant response
 *   actions   — library-provided chat actions:
 *     actions.submit(displayText, inputParams)  add user bubble + send to backend
 *     actions.submitSilent(inputParams)         send to backend, no visible bubble
 *     actions.appendBubble(text, role?)         add bubble client-side, no API call
 *     actions.prefillInput(text)                pre-fill composer, user edits then sends
 *   onSubmit  — alias for actions.submit (backward compat)
 * ────────────────────────────────────────────────────────────────────────── */

/* ── 1. Single-choice (radio) ─────────────────────────────────────────── */
function SelectionPromptComponent({ payload, actions }) {
  const [selected, setSelected] = useState(null);
  const options = payload?.options ?? [];
  return (
    <div className="ce-interactive-card">
      {payload?.question && <p className="ce-interactive-question">{payload.question}</p>}
      <div className="ce-interactive-options">
        {options.map((opt) => (
          <label key={opt.value} className="ce-interactive-option">
            <input type="radio" name="selection" value={opt.value}
              checked={selected === opt.value} onChange={() => setSelected(opt.value)} />
            {opt.label}
          </label>
        ))}
      </div>
      <button className="ce-interactive-submit" disabled={selected === null}
        onClick={() => actions.submit(selected, { choice: selected })}>
        Continue →
      </button>
    </div>
  );
}
export const selectionPromptRenderer = {
  key: 'SelectionPrompt', priority: 200,
  match: ({ effectiveType }) => effectiveType === 'SelectionPrompt',
  Component: SelectionPromptComponent,
};

/* ── 2. Multi-select (checkboxes) ─────────────────────────────────────── */
function MultiSelectComponent({ payload, actions }) {
  const [checked, setChecked] = useState({});
  const options = payload?.options ?? [];
  function toggle(value) { setChecked((prev) => ({ ...prev, [value]: !prev[value] })); }
  const selected = options.filter((o) => checked[o.value]).map((o) => o.value);
  return (
    <div className="ce-interactive-card">
      {payload?.question && <p className="ce-interactive-question">{payload.question}</p>}
      <div className="ce-interactive-options">
        {options.map((opt) => (
          <label key={opt.value} className="ce-interactive-option">
            <input type="checkbox" value={opt.value} checked={!!checked[opt.value]}
              onChange={() => toggle(opt.value)} />
            {opt.label}
          </label>
        ))}
      </div>
      <button className="ce-interactive-submit" disabled={selected.length === 0}
        onClick={() => actions.submit(selected.join(', '), { selections: selected })}>
        Continue →
      </button>
    </div>
  );
}
export const multiSelectRenderer = {
  key: 'MultiSelect', priority: 200,
  match: ({ effectiveType }) => effectiveType === 'MultiSelect',
  Component: MultiSelectComponent,
};

/* ── 3. Inline mini-form (text/email/number/date/textarea/dropdown) ───── */
function InlineFormComponent({ payload, actions }) {
  const fields = payload?.fields ?? [];
  const [values, setValues] = useState(
    Object.fromEntries(fields.map((f) => [f.name, f.default ?? ''])),
  );
  function handleChange(name, value) { setValues((prev) => ({ ...prev, [name]: value })); }
  function handleSubmit() {
    const displayText = fields.map((f) => `${f.label}: ${values[f.name]}`).join(' | ');
    actions.submit(displayText, { formData: values });
  }
  return (
    <div className="ce-interactive-card">
      {payload?.title && <p className="ce-interactive-question">{payload.title}</p>}
      {fields.map((field) => field.type === 'dropdown' ? (
        <div key={field.name} className="ce-interactive-field">
          <label className="ce-interactive-label">{field.label}</label>
          <select className="ce-interactive-select" value={values[field.name]}
            onChange={(e) => handleChange(field.name, e.target.value)}>
            <option value="">Select…</option>
            {(field.options ?? []).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      ) : (
        <div key={field.name} className="ce-interactive-field">
          <label className="ce-interactive-label">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea className="ce-interactive-input" rows={3}
              value={values[field.name]} placeholder={field.placeholder ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)} />
          ) : (
            <input className="ce-interactive-input" type={field.type ?? 'text'}
              value={values[field.name]} placeholder={field.placeholder ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)} />
          )}
        </div>
      ))}
      <button className="ce-interactive-submit" onClick={handleSubmit}>
        {payload?.submitLabel ?? 'Submit'}
      </button>
    </div>
  );
}
export const inlineFormRenderer = {
  key: 'InlineForm', priority: 200,
  match: ({ effectiveType }) => effectiveType === 'InlineForm',
  Component: InlineFormComponent,
};

/* ── 4. File upload ───────────────────────────────────────────────────── */
function FileUploadComponent({ payload, actions }) {
  const [file, setFile] = useState(null);
  const accept = payload?.accept ?? '*/*';
  function handleSubmit() {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => actions.submit(`Uploaded: ${file.name}`, {
      fileName: file.name, fileType: file.type, fileSize: file.size,
      fileData: reader.result,
    });
    reader.readAsDataURL(file);
  }
  return (
    <div className="ce-interactive-card">
      {payload?.label && <p className="ce-interactive-question">{payload.label}</p>}
      <input type="file" accept={accept} className="ce-interactive-input"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      {file && (
        <p className="ce-interactive-label" style={{ marginTop: 4 }}>
          {file.name} ({Math.round(file.size / 1024)} KB)
        </p>
      )}
      <button className="ce-interactive-submit" disabled={!file} onClick={handleSubmit}>
        Upload & Continue →
      </button>
    </div>
  );
}
export const fileUploadRenderer = {
  key: 'FileUpload', priority: 200,
  match: ({ effectiveType }) => effectiveType === 'FileUpload',
  Component: FileUploadComponent,
};

/* ── 5. Confirm step — demonstrates all 4 actions ────────────────────── */
/*
 * Backend returns: { "type": "ConfirmStep", "summary": "...", "editHint": "..." }
 *
 * Confirm  → submitSilent({ confirmed: true })      no visible user bubble
 * Edit     → prefillInput(hint)                     pre-fills composer, user adjusts
 * Cancel   → appendBubble('Cancelled.', 'user')     local bubble, no API call
 */
function ConfirmStepComponent({ payload, actions }) {
  return (
    <div className="ce-interactive-card">
      <p className="ce-interactive-question">Please confirm:</p>
      <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: 'var(--ce-fg-muted)' }}>
        {payload?.summary}
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="ce-interactive-submit"
          onClick={() => actions.submitSilent({ confirmed: true })}>
          ✓ Confirm
        </button>
        <button className="ce-interactive-submit"
          style={{ background: 'var(--ce-border)', color: 'var(--ce-fg)' }}
          onClick={() => actions.prefillInput(payload?.editHint ?? '')}>
          ✏ Edit
        </button>
        <button className="ce-interactive-submit"
          style={{ background: 'transparent', color: 'var(--ce-fg-muted)', border: '1px solid var(--ce-border)' }}
          onClick={() => actions.appendBubble('Cancelled.', 'user')}>
          ✕ Cancel
        </button>
      </div>
    </div>
  );
}
export const confirmStepRenderer = {
  key: 'ConfirmStep', priority: 200,
  match: ({ effectiveType }) => effectiveType === 'ConfirmStep',
  Component: ConfirmStepComponent,
};

/* ── 6. Flight Card ────────────────────────────────────────────────────────
 * Backend returns: { type: "FlightCard", payload: { from, to, date, flights[] } }
 * Each flight: { id, carrier, departure, arrival, duration, stops, price }
 * ─────────────────────────────────────────────────────────────────────────── */
function FlightCardComponent({ payload, actions }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const flights = payload?.flights ?? [];

  return (
    <div className="ce-interactive-card">
      <p className="ce-interactive-question">✈️ {payload?.from} → {payload?.to}</p>
      <p style={{ fontSize: '0.78rem', color: 'var(--ce-fg-muted)', margin: '-4px 0 10px' }}>{payload?.date}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {flights.map((f) => {
          const isSel = selected === f.id;
          return (
            <label key={f.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 10, border: `2px solid ${isSel ? 'var(--ce-color-accent)' : 'var(--ce-border)'}`,
              background: isSel ? 'var(--ce-color-accent-light)' : 'var(--ce-bg)',
              cursor: submitted ? 'default' : 'pointer', transition: 'all 0.15s',
              opacity: submitted && !isSel ? 0.45 : 1,
            }}>
              <input type="radio" name="ce-flight" value={f.id}
                checked={isSel} onChange={() => !submitted && setSelected(f.id)} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--ce-fg)' }}>{f.carrier}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ce-color-accent)' }}>{f.price}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ce-fg-muted)', marginTop: 2 }}>
                  {f.departure} → {f.arrival} · {f.duration} · {f.stops}
                </div>
              </div>
            </label>
          );
        })}
      </div>
      <button className="ce-interactive-submit" disabled={!selected || submitted} style={{ marginTop: 12 }}
        onClick={() => {
          const f = flights.find((f) => f.id === selected);
          setSubmitted(true);
          actions.submit(`Book ${f.carrier} at ${f.price}`, { action: 'book_flight', flightId: selected });
        }}>
        {submitted ? '✅ Booking submitted — see response below' : 'Book Selected Flight →'}
      </button>
    </div>
  );
}
export const flightCardRenderer = {
  key: 'FlightCard', priority: 200,
  match: ({ effectiveType }) => effectiveType === 'FlightCard',
  Component: FlightCardComponent,
};

/* ── 7. Order Tracker ─────────────────────────────────────────────────────
 * Backend returns: { type: "OrderTracker", payload: { orderId, product, estimatedDelivery, steps[] } }
 * Each step: { label, date, done, current? }
 * ─────────────────────────────────────────────────────────────────────────── */
function OrderTrackerComponent({ payload, actions }) {
  const steps = payload?.steps ?? [];
  return (
    <div className="ce-interactive-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p className="ce-interactive-question" style={{ margin: '0 0 2px' }}>📦 Order #{payload?.orderId}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--ce-fg-muted)', margin: 0 }}>{payload?.product}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--ce-fg-muted)', margin: 0 }}>Est. delivery</p>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ce-fg)', margin: 0 }}>{payload?.estimatedDelivery}</p>
        </div>
      </div>
      <div style={{ position: 'relative', paddingLeft: 20 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ position: 'relative', paddingBottom: i < steps.length - 1 ? 16 : 0 }}>
            {i < steps.length - 1 && (
              <div style={{
                position: 'absolute', left: -12, top: 12, bottom: -4, width: 2,
                background: step.done ? 'var(--ce-color-accent)' : 'var(--ce-border)',
              }} />
            )}
            <div style={{
              position: 'absolute', left: -16, top: 4, width: 10, height: 10, borderRadius: '50%',
              background: step.done ? 'var(--ce-color-accent)' : 'var(--ce-border)',
              boxShadow: step.current ? '0 0 0 3px var(--ce-color-accent-light)' : 'none',
              border: `2px solid ${step.done ? 'var(--ce-color-accent)' : 'var(--ce-border)'}`,
            }} />
            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: step.current ? 700 : 400, color: step.done ? 'var(--ce-fg)' : 'var(--ce-fg-muted)' }}>
              {step.label}
            </p>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--ce-fg-muted)' }}>{step.date}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <button className="ce-interactive-submit"
          onClick={() => actions.submitSilent({ action: 'track_detail', orderId: payload?.orderId })}>
          📍 Track in Detail
        </button>
        <button className="ce-interactive-submit"
          style={{ background: 'transparent', color: 'var(--ce-fg)', border: '1px solid var(--ce-border)' }}
          onClick={() => actions.prefillInput(`I need help with order #${payload?.orderId}`)}>
          💬 Contact Support
        </button>
      </div>
    </div>
  );
}
export const orderTrackerRenderer = {
  key: 'OrderTracker', priority: 200,
  match: ({ effectiveType }) => effectiveType === 'OrderTracker',
  Component: OrderTrackerComponent,
};

/* ── 8. Product Recommendation ────────────────────────────────────────────
 * Backend returns: { type: "ProductRecommendation", payload: { products[] } }
 * Each product: { id, name, price, rating, reviews, badge?, emoji }
 * ─────────────────────────────────────────────────────────────────────────── */
function ProductRecommendationComponent({ payload, actions }) {
  const [cart, setCart] = useState({});   // { [id]: true } — toggled
  const [bought, setBought] = useState(false);
  const products = payload?.products ?? [];

  function toggleCart(p) {
    setCart((prev) => ({ ...prev, [p.id]: !prev[p.id] }));
  }

  function buyNow() {
    const selected = products.filter((p) => cart[p.id]);
    if (!selected.length) return;
    const itemList = selected.map((p) => p.name).join(', ');
    setBought(true);
    // submit() — appends a user bubble AND sends to your backend
    actions.submit(`Buy Now Cart Items: ${itemList}`, {
      action: 'buy_now',
      items: selected.map((p) => ({ id: p.id, name: p.name, price: p.price })),
    });
  }

  const cartCount = Object.values(cart).filter(Boolean).length;

  return (
    <div className="ce-interactive-card">
      <p className="ce-interactive-question">🛍️ Recommended for you</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '8px 0' }}>
        {products.map((p) => {
          const inCart = !!cart[p.id];
          return (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 10, border: `1.5px solid ${inCart ? 'var(--ce-color-accent)' : 'var(--ce-border)'}`,
              background: inCart ? 'var(--ce-color-accent-light)' : 'var(--ce-bg)',
              transition: 'all 0.15s',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                background: 'var(--ce-color-accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>
                {p.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--ce-fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--ce-color-accent)', flexShrink: 0 }}>{p.price}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--ce-fg-muted)' }}>⭐ {p.rating} · {p.reviews.toLocaleString()} reviews</span>
                  {p.badge && (
                    <span style={{
                      background: 'var(--ce-color-accent-light)', color: 'var(--ce-color-accent)',
                      padding: '1px 5px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700,
                    }}>{p.badge}</span>
                  )}
                </div>
              </div>
              {/* Per-item Add to Cart toggle */}
              <button
                style={{
                  padding: '6px 10px', fontSize: '0.72rem', flexShrink: 0,
                  borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600,
                  background: inCart ? '#10b981' : 'var(--ce-color-accent)',
                  color: '#fff', transition: 'background 0.15s',
                }}
                onClick={() => toggleCart(p)}
              >
                {inCart ? '✓ Added' : '+ Cart'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Buy Now — submits cart to backend as a user message */}
      <button
        className="ce-interactive-submit"
        style={{ marginTop: 4, opacity: cartCount === 0 || bought ? 0.5 : 1, cursor: cartCount === 0 || bought ? 'not-allowed' : 'pointer' }}
        disabled={cartCount === 0 || bought}
        onClick={buyNow}
      >
        {bought ? '✓ Order Placed' : `🛢 Buy Now${cartCount > 0 ? ` (${cartCount})` : ''}`}
      </button>
    </div>
  );
}
export const productRecommendationRenderer = {
  key: 'ProductRecommendation', priority: 200,
  match: ({ effectiveType }) => effectiveType === 'ProductRecommendation',
  Component: ProductRecommendationComponent,
};

/* ── 9. DataTable ─────────────────────────────────────────────────────────
 * Backend returns one of two shapes:
 *   Option A (pre-parsed): { type:"DataTable", title, headers[], rows[][], caption? }
 *   Option B (markdown):   { type:"DataTable", title, markdown:"| col | ...\n|---|...\n| ...|" }
 *
 * hideBubble:true — the card controls its own visual shell, no bubble wrapper.
 *
 * Uses built-in ce-table-* CSS classes. Override ce-data-table-card in your
 * own stylesheet to customise the card appearance.
 * ─────────────────────────────────────────────────────────────────────────── */

/** Minimal inline markdown-table parser — no external dep needed */
function parseMdTable(markdown) {
  const lines = markdown.trim().split(/\r?\n/);
  if (lines.length < 2) return null;
  const isSep = (l) => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/.test(l.trim());
  const splitRow = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
  let hi = -1;
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('|') && isSep(lines[i + 1])) { hi = i; break; }
  }
  if (hi === -1) return null;
  const headers = splitRow(lines[hi]);
  const rows = [];
  for (let i = hi + 2; i < lines.length; i++) {
    if (!lines[i].includes('|') || !lines[i].trim()) break;
    rows.push(splitRow(lines[i]));
  }
  return { headers, rows };
}

function prettifyCol(h) {
  const knownAcronyms = { id: 'ID', ui: 'UI', api: 'API', sql: 'SQL', url: 'URL' };
  return String(h ?? '').trim()
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((t) => {
      const lower = t.toLowerCase();
      return knownAcronyms[lower] ?? (lower.charAt(0).toUpperCase() + lower.slice(1));
    })
    .join(' ');
}

function DataTableComponent({ payload }) {
  const { title, caption, markdown } = payload;
  let { headers, rows } = payload;

  // Parse markdown if pre-parsed arrays aren't provided
  if (markdown && !headers) {
    const parsed = parseMdTable(markdown);
    if (parsed) { headers = parsed.headers; rows = parsed.rows; }
  }

  if (!headers?.length || !rows?.length) {
    return (
      <div className="ce-data-table-card">
        <div className="ce-data-table-header">
          <span className="ce-data-table-title">⚠ No table data</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ce-data-table-card">
      <div className="ce-data-table-header">
        {title && <span className="ce-data-table-title">{title}</span>}
        <span className="ce-data-table-count">{rows.length} {rows.length === 1 ? 'row' : 'rows'}</span>
      </div>
      <div className="ce-table-wrap">
        <table className="ce-table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="ce-table-th">{prettifyCol(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="ce-table-tr">
                {row.map((cell, ci) => (
                  <td key={ci} className="ce-table-td">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <div className="ce-data-table-caption">{caption}</div>}
    </div>
  );
}

export const dataTableRenderer = {
  key: 'DataTable',
  priority: 200,
  hideBubble: true,   // ← skip bubble shell; card controls its own presentation
  match: ({ effectiveType }) => effectiveType === 'DataTable',
  Component: DataTableComponent,
};

/* ── FAQResponse ─────────────────────────────────────────────────────────── */
function confidenceColor(score = 0) {
  if (score >= 0.92) return { bg: '#dcfce7', fg: '#166534', border: '#bbf7d0', label: 'High' };
  if (score >= 0.86) return { bg: '#fef3c7', fg: '#92400e', border: '#fde68a', label: 'Medium' };
  return { bg: '#fee2e2', fg: '#991b1b', border: '#fecaca', label: 'Low' };
}

const FAQ_BADGE_PALETTE = [
  { bg: '#dbeafe', fg: '#1e40af', border: '#bfdbfe' },
  { bg: '#dcfce7', fg: '#166534', border: '#bbf7d0' },
  { bg: '#ede9fe', fg: '#5b21b6', border: '#ddd6fe' },
  { bg: '#fef3c7', fg: '#92400e', border: '#fde68a' },
  { bg: '#fce7f3', fg: '#9d174d', border: '#fbcfe8' },
  { bg: '#f0fdf4', fg: '#065f46', border: '#a7f3d0' },
];

function FAQResponseComponent({ payload }) {
  const answer = payload?.answer;
  const confidence = typeof payload?.confidence === 'number' ? payload.confidence : null;
  const matchedFaqs = Array.isArray(payload?.matchedFaqs) ? payload.matchedFaqs : [];

  return (
    <div className="ce-interactive-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* top row: colorful numeric FAQ ID badges left, confidence % right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          {matchedFaqs.map((f, i) => {
            const c = FAQ_BADGE_PALETTE[i % FAQ_BADGE_PALETTE.length];
            return (
              <span key={f.faqId || i} style={{
                fontSize: '0.65rem', fontWeight: 700,
                color: c.fg, background: c.bg, border: `1px solid ${c.border}`,
                borderRadius: 999, padding: '2px 7px',
              }}>
                {f.faqId}
              </span>
            );
          })}
        </div>
        {confidence !== null && (
          <span style={{
            fontSize: '0.68rem', fontWeight: 700,
            color: '#1e40af', background: '#dbeafe', border: '1px solid #bfdbfe',
            borderRadius: 999, padding: '2px 8px', whiteSpace: 'nowrap',
          }}>
            {(confidence * 100).toFixed(0)}%
          </span>
        )}
      </div>

      {/* answer only */}
      {answer && (
        <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--ce-fg)' }}>{answer}</p>
      )}
    </div>
  );
}

export const faqResponseRenderer = {
  key: 'FAQResponse',
  priority: 210,
  hideBubble: true,
  match: ({ effectiveType }) => effectiveType === 'FAQResponse',
  Component: FAQResponseComponent,
};

/* ── CompleteForm ─────────────────────────────────────────────────────────── */
const COUNTRIES = ['United States','United Kingdom','Canada','Australia','India','Germany','France','Singapore','Japan','Other'];
const GENDER_OPTIONS = ['Male','Female','Non-binary','Prefer not to say'];

// ── Custom Dropdown ──────────────────────────────────────────────────────────
function CFDropdown({ value, onChange, options, placeholder, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const base = {
    width: '100%', boxSizing: 'border-box', padding: '7px 32px 7px 10px',
    borderRadius: 8, border: `1.5px solid ${error ? '#ef4444' : open ? 'var(--ce-color-accent)' : 'var(--ce-border-color)'}`,
    background: 'var(--ce-bg-composer)', color: value ? 'var(--ce-text-primary)' : 'var(--ce-text-secondary)',
    fontSize: 13, cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', position: 'relative', transition: 'border-color 0.15s',
  };
  const menuStyle = {
    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
    background: 'var(--ce-bg-panel)', border: '1px solid var(--ce-border-color)',
    borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 999,
    maxHeight: 200, overflowY: 'auto', padding: '4px 0',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={base} onClick={() => setOpen((o) => !o)}>
        <span>{value || placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ position: 'absolute', right: 10, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform 0.2s', flexShrink: 0 }} fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {open && (
        <div style={menuStyle}>
          {options.map((opt) => (
            <div key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: '8px 12px', fontSize: 13, cursor: 'pointer',
                background: value === opt ? 'color-mix(in srgb, var(--ce-color-accent) 12%, transparent)' : 'transparent',
                color: value === opt ? 'var(--ce-color-accent)' : 'var(--ce-text-primary)',
                fontWeight: value === opt ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.background = 'color-mix(in srgb, var(--ce-color-accent) 6%, transparent)'; }}
              onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.background = 'transparent'; }}
            >
              {value === opt && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="var(--ce-color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              {value !== opt && <span style={{ width: 12, display: 'inline-block' }}/>}
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Custom Calendar ──────────────────────────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function CFCalendar({ value, onChange, error }) {
  const today = new Date();
  const parsed = value ? new Date(value + 'T00:00:00') : null;

  const [open, setOpen]   = useState(false);
  const [viewYear, setViewYear]   = useState(parsed ? parsed.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth()    : today.getMonth());
  const [mode, setMode] = useState('day'); // 'day' | 'month' | 'year'
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setMode('day'); } }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function selectDate(y, m, d) {
    const dd = String(d).padStart(2, '0');
    const mm = String(m + 1).padStart(2, '0');
    onChange(`${y}-${mm}-${dd}`);
    setOpen(false);
    setMode('day');
  }

  function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
  function firstDayOfMonth(y, m) { return new Date(y, m, 1).getDay(); }

  const displayValue = parsed
    ? `${MONTH_NAMES[parsed.getMonth()].slice(0,3)} ${parsed.getDate()}, ${parsed.getFullYear()}`
    : '';

  const triggerStyle = {
    width: '100%', boxSizing: 'border-box', padding: '7px 32px 7px 10px',
    borderRadius: 8, border: `1.5px solid ${error ? '#ef4444' : open ? 'var(--ce-color-accent)' : 'var(--ce-border-color)'}`,
    background: 'var(--ce-bg-composer)', color: displayValue ? 'var(--ce-text-primary)' : 'var(--ce-text-secondary)',
    fontSize: 13, cursor: 'pointer', userSelect: 'none', position: 'relative',
    display: 'flex', alignItems: 'center', transition: 'border-color 0.15s',
  };
  const popupStyle = {
    position: 'absolute', top: 'calc(100% + 4px)', left: 0,
    background: 'var(--ce-bg-panel)', border: '1px solid var(--ce-border-color)',
    borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.14)', zIndex: 999,
    width: 272, padding: '12px',
  };
  const navBtnStyle = {
    background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
    borderRadius: 6, color: 'var(--ce-text-primary)', fontSize: 16, lineHeight: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  const accentBtn = {
    background: 'var(--ce-color-accent)', color: '#fff',
    border: 'none', borderRadius: '50%', width: 32, height: 32,
    cursor: 'pointer', fontSize: 13, fontWeight: 700,
  };
  const todayBtn = {
    background: 'none', border: `1.5px solid var(--ce-color-accent)`,
    color: 'var(--ce-color-accent)', borderRadius: '50%', width: 32, height: 32,
    cursor: 'pointer', fontSize: 13, fontWeight: 600,
  };
  const normDayBtn = (isDisabled) => ({
    background: 'none', border: 'none', borderRadius: '50%', width: 32, height: 32,
    cursor: isDisabled ? 'not-allowed' : 'pointer', fontSize: 13,
    color: isDisabled ? 'var(--ce-text-secondary)' : 'var(--ce-text-primary)',
    opacity: isDisabled ? 0.35 : 1,
  });

  // ── Year grid ──────────────────────────────────────────────────────────────
  if (mode === 'year') {
    const startYear = today.getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => startYear - i);
    return (
      <div ref={ref} style={{ position: 'relative' }}>
        <div style={triggerStyle} onClick={() => setOpen((o) => !o)}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6, flexShrink: 0 }}>
            <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M1 7h14M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span>{displayValue || 'Select date…'}</span>
        </div>
        {open && (
          <div style={popupStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <button style={navBtnStyle} onClick={() => setMode('month')}>← Back</button>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ce-text-primary)' }}>Select Year</span>
              <div style={{ width: 48 }}/>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4, maxHeight: 180, overflowY: 'auto' }}>
              {years.map((y) => (
                <button key={y}
                  onClick={() => { setViewYear(y); setMode('month'); }}
                  style={{
                    padding: '6px 4px', fontSize: 12, borderRadius: 6, cursor: 'pointer', fontWeight: y === viewYear ? 700 : 400,
                    background: y === viewYear ? 'color-mix(in srgb,var(--ce-color-accent) 15%,transparent)' : 'none',
                    color: y === viewYear ? 'var(--ce-color-accent)' : 'var(--ce-text-primary)',
                    border: y === viewYear ? `1px solid var(--ce-color-accent)` : '1px solid transparent',
                  }}>
                  {y}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Month grid ─────────────────────────────────────────────────────────────
  if (mode === 'month') {
    return (
      <div ref={ref} style={{ position: 'relative' }}>
        <div style={triggerStyle} onClick={() => setOpen((o) => !o)}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6, flexShrink: 0 }}>
            <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M1 7h14M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span>{displayValue || 'Select date…'}</span>
        </div>
        {open && (
          <div style={popupStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <button style={navBtnStyle} onClick={() => setMode('year')}>← Year</button>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ce-text-primary)' }}>{viewYear}</span>
              <div style={{ width: 48 }}/>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
              {MONTH_NAMES.map((mn, mi) => {
                const isFuture = (viewYear > today.getFullYear()) || (viewYear === today.getFullYear() && mi > today.getMonth());
                return (
                  <button key={mn} disabled={isFuture}
                    onClick={() => { setViewMonth(mi); setMode('day'); }}
                    style={{
                      padding: '7px 4px', fontSize: 12, borderRadius: 8, cursor: isFuture ? 'not-allowed' : 'pointer',
                      opacity: isFuture ? 0.35 : 1, fontWeight: mi === viewMonth && !isFuture ? 700 : 400,
                      background: mi === viewMonth ? 'color-mix(in srgb,var(--ce-color-accent) 15%,transparent)' : 'none',
                      color: mi === viewMonth ? 'var(--ce-color-accent)' : 'var(--ce-text-primary)',
                      border: mi === viewMonth ? `1px solid var(--ce-color-accent)` : '1px solid transparent',
                    }}>
                    {mn.slice(0,3)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Day grid ───────────────────────────────────────────────────────────────
  const dim = daysInMonth(viewYear, viewMonth);
  const firstDay = firstDayOfMonth(viewYear, viewMonth);
  const cells = Array.from({ length: firstDay + dim }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  const selY = parsed?.getFullYear(), selM = parsed?.getMonth(), selD = parsed?.getDate();

  function canGoPrev() {
    return !(viewYear <= today.getFullYear() - 100);
  }
  function canGoNext() {
    return !((viewYear > today.getFullYear()) || (viewYear === today.getFullYear() && viewMonth >= today.getMonth()));
  }
  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={triggerStyle} onClick={() => setOpen((o) => !o)}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6, flexShrink: 0 }}>
          <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M1 7h14M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <span>{displayValue || 'Select date…'}</span>
      </div>
      {open && (
        <div style={popupStyle}>
          {/* Nav row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button style={navBtnStyle} onClick={prevMonth} disabled={!canGoPrev()}>‹</button>
            <button
              onClick={() => setMode('month')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: 'var(--ce-text-primary)', padding: '2px 6px', borderRadius: 6 }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </button>
            <button style={navBtnStyle} onClick={nextMonth} disabled={!canGoNext()}>›</button>
          </div>
          {/* Day-of-week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 4 }}>
            {DAY_NAMES.map((d) => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--ce-text-secondary)', padding: '2px 0' }}>{d}</div>
            ))}
          </div>
          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px 0' }}>
            {cells.map((d, i) => {
              if (!d) return <div key={`e${i}`}/>;
              const isToday    = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
              const isSelected = d === selD && viewMonth === selM && viewYear === selY;
              const isFuture   = new Date(viewYear, viewMonth, d) > today;
              return (
                <div key={d} style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    disabled={isFuture}
                    onClick={() => selectDate(viewYear, viewMonth, d)}
                    style={isSelected ? accentBtn : isToday ? todayBtn : normDayBtn(isFuture)}>
                    {d}
                  </button>
                </div>
              );
            })}
          </div>
          {/* Today shortcut */}
          <div style={{ marginTop: 10, textAlign: 'center' }}>
            <button onClick={() => selectDate(today.getFullYear(), today.getMonth(), today.getDate())}
              style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--ce-color-accent)', cursor: 'pointer', fontWeight: 600 }}>
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CompleteFormComponent ────────────────────────────────────────────────────
function CompleteFormComponent({ payload, actions }) {
  const { title = 'Tell us about yourself' } = payload;
  const [form, setForm] = useState({
    firstname: '', lastname: '', country: '', gender: '',
    acceptTerms: false, photo: null, dob: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function validate() {
    const e = {};
    if (!form.firstname.trim()) e.firstname = 'Required';
    if (!form.lastname.trim())  e.lastname  = 'Required';
    if (!form.country)          e.country   = 'Required';
    if (!form.gender)           e.gender    = 'Required';
    if (!form.acceptTerms)      e.acceptTerms = 'You must accept the terms';
    if (!form.dob)              e.dob       = 'Required';
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
    const parts = [
      `${form.firstname} ${form.lastname}`,
      form.country,
      form.gender,
      form.acceptTerms ? 'Terms Accepted' : 'Terms Not Accepted',
      form.photo ? form.photo.name : 'No photo',
      `DOB: ${form.dob}`,
    ];
    actions.submit(`Form Submitted: ${parts.join(', ')}`, {
      action: 'form_submit',
      formData: { ...form, photo: form.photo ? form.photo.name : null },
    });
  }

  if (submitted) {
    return (
      <div className="ce-interactive-card">
        <p className="ce-interactive-question">✅ Form submitted! Awaiting confirmation…</p>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', padding: '7px 10px', borderRadius: 8,
    border: '1.5px solid var(--ce-border-color)', background: 'var(--ce-bg-composer)',
    color: 'var(--ce-text-primary)', fontSize: 13, boxSizing: 'border-box',
    outline: 'none', transition: 'border-color 0.15s',
  };
  const inputErrStyle = { ...inputStyle, borderColor: '#ef4444' };
  const errStyle  = { color: '#ef4444', fontSize: 11, marginTop: 3 };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--ce-text-secondary)', marginBottom: 4, display: 'block' };

  return (
    <div className="ce-interactive-card" style={{ gap: 14, display: 'flex', flexDirection: 'column' }}>
      <p className="ce-interactive-question" style={{ marginBottom: 2 }}>{title}</p>

      {/* First + Last name */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>First Name</label>
          <input style={errors.firstname ? inputErrStyle : inputStyle} value={form.firstname}
            onChange={(e) => set('firstname', e.target.value)} placeholder="Jane"
            onFocus={(e) => { e.target.style.borderColor = 'var(--ce-color-accent)'; }}
            onBlur={(e)  => { e.target.style.borderColor = errors.firstname ? '#ef4444' : 'var(--ce-border-color)'; }} />
          {errors.firstname && <p style={errStyle}>{errors.firstname}</p>}
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Last Name</label>
          <input style={errors.lastname ? inputErrStyle : inputStyle} value={form.lastname}
            onChange={(e) => set('lastname', e.target.value)} placeholder="Doe"
            onFocus={(e) => { e.target.style.borderColor = 'var(--ce-color-accent)'; }}
            onBlur={(e)  => { e.target.style.borderColor = errors.lastname ? '#ef4444' : 'var(--ce-border-color)'; }} />
          {errors.lastname && <p style={errStyle}>{errors.lastname}</p>}
        </div>
      </div>

      {/* Country — custom dropdown */}
      <div>
        <label style={labelStyle}>Country</label>
        <CFDropdown value={form.country} onChange={(v) => set('country', v)}
          options={COUNTRIES} placeholder="Select a country…" error={!!errors.country} />
        {errors.country && <p style={errStyle}>{errors.country}</p>}
      </div>

      {/* Gender — styled radio pills */}
      <div>
        <label style={labelStyle}>Gender</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {GENDER_OPTIONS.map((opt) => {
            const active = form.gender === opt;
            return (
              <button key={opt} type="button" onClick={() => set('gender', opt)}
                style={{
                  padding: '5px 12px', fontSize: 12, borderRadius: 20, cursor: 'pointer',
                  fontWeight: active ? 700 : 400, transition: 'all 0.15s',
                  background: active ? 'color-mix(in srgb,var(--ce-color-accent) 15%,transparent)' : 'var(--ce-bg-composer)',
                  color: active ? 'var(--ce-color-accent)' : 'var(--ce-text-secondary)',
                  border: active ? '1.5px solid var(--ce-color-accent)' : '1.5px solid var(--ce-border-color)',
                }}>
                {opt}
              </button>
            );
          })}
        </div>
        {errors.gender && <p style={errStyle}>{errors.gender}</p>}
      </div>

      {/* Date of Birth — custom calendar */}
      <div>
        <label style={labelStyle}>Date of Birth</label>
        <CFCalendar value={form.dob} onChange={(v) => set('dob', v)} error={!!errors.dob} />
        {errors.dob && <p style={errStyle}>{errors.dob}</p>}
      </div>

      {/* Photo upload — styled */}
      <div>
        <label style={labelStyle}>Add Photo</label>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
          border: '1.5px dashed var(--ce-border-color)', borderRadius: 8,
          cursor: 'pointer', fontSize: 13, color: 'var(--ce-text-secondary)',
          background: 'var(--ce-bg-composer)', boxSizing: 'border-box',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v8M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {form.photo ? <span style={{ color: 'var(--ce-text-primary)', fontWeight: 500 }}>📎 {form.photo.name}</span> : <span>Upload an image…</span>}
          <input type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => set('photo', e.target.files?.[0] ?? null)} />
        </label>
      </div>

      {/* Accept terms — styled checkbox */}
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <div onClick={() => set('acceptTerms', !form.acceptTerms)}
          style={{
            width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
            border: `2px solid ${form.acceptTerms ? 'var(--ce-color-accent)' : errors.acceptTerms ? '#ef4444' : 'var(--ce-border-color)'}`,
            background: form.acceptTerms ? 'var(--ce-color-accent)' : 'var(--ce-bg-composer)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
          }}>
          {form.acceptTerms && (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1.5 5.5l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span style={{ fontSize: 13, color: 'var(--ce-text-primary)', lineHeight: '1.4' }}>
          I accept the{' '}
          <span style={{ color: 'var(--ce-color-accent)', textDecoration: 'underline', cursor: 'pointer' }}>
            terms and conditions
          </span>
        </span>
      </label>
      {errors.acceptTerms && <p style={{ ...errStyle, marginTop: -10 }}>{errors.acceptTerms}</p>}

      <button className="ce-interactive-submit" onClick={handleSubmit}>
        Submit →
      </button>
    </div>
  );
}

export const completeFormRenderer = {
  key: 'CompleteForm',
  priority: 200,
  hideBubble: true,
  match: ({ effectiveType }) => effectiveType === 'CompleteForm',
  Component: CompleteFormComponent,
};

/* ── Bundle ──────────────────────────────────────────────────────────── */
export const interactiveRenderers = [
  selectionPromptRenderer,
  multiSelectRenderer,
  inlineFormRenderer,
  fileUploadRenderer,
  confirmStepRenderer,
  flightCardRenderer,
  orderTrackerRenderer,
  productRecommendationRenderer,
  faqResponseRenderer,
  dataTableRenderer,
  completeFormRenderer,
];

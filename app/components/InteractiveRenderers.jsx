'use client';

import { useState } from 'react';

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

/* ── Bundle ──────────────────────────────────────────────────────────── */
export const interactiveRenderers = [
  selectionPromptRenderer,
  multiSelectRenderer,
  inlineFormRenderer,
  fileUploadRenderer,
  confirmStepRenderer,
];

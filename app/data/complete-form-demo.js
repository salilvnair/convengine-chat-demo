export const COMPLETE_FORM_DEMO_PAYLOAD = {
  type: 'CompleteForm',
  title: 'Ship to a new address',
  fields: [
    { key: 'name',    label: 'Full Name',    type: 'text',     placeholder: 'Jane Smith',             required: true },
    { key: 'address', label: 'Address',      type: 'text',     placeholder: '123 Main St',            required: true },
    { key: 'city',    label: 'City',         type: 'text',     placeholder: 'San Francisco',          required: true },
    { key: 'zip',     label: 'ZIP / Postal', type: 'text',     placeholder: '94103',                  required: true },
    { key: 'country', label: 'Country',      type: 'select',   options: ['US', 'CA', 'GB', 'AU'],     required: true },
    { key: 'save',    label: 'Save this address for future orders', type: 'checkbox', defaultValue: true },
  ],
  submitLabel: 'Use This Address',
};

export const COMPLETE_FORM_DEMO_CODE = `// CompleteFormComponent.jsx
// ── How data flows to your backend ────────────────────────────────────────
// 1. YOUR BACKEND returns:
//    { "type": "CompleteForm", "title": "Ship to a new address",
//      "fields": [{ key, label, type, placeholder?, options?, required?, defaultValue? }],
//      "submitLabel": "Use This Address" }
//
// 2. ConvEngine passes the JSON as \`payload\` to your form component.
//
// 3. USER fills in the form and clicks "Use This Address".
//
// 4. actions.submit("Shipping to Jane Smith, 123 Main St, San Francisco", {
//      action: "save_address",
//      formData: { name: "Jane Smith", address: "123 Main St", ... }
//    });
//
// 5. ConvEngine atomically:
//    a) Shows user bubble: "Shipping to Jane Smith, ..."
//    b) POSTs { text: "...", inputParams: { action: "save_address", formData: {...} } }
//
// 6. YOUR BACKEND reads inputParams.action === "save_address" and saves it.
// ─────────────────────────────────────────────────────────────────────────

function CompleteFormComponent({ payload, actions }) {
  const { title, fields = [], submitLabel = 'Submit' } = payload;
  const init = Object.fromEntries(
    fields.map((f) => [f.key, f.defaultValue ?? (f.type === 'checkbox' ? false : '')])
  );
  const [values, setValues] = useState(init);
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }));
  const allFilled = fields.filter((f) => f.required).every((f) => values[f.key]);

  if (submitted) return <p>✅ Address saved!</p>;

  return (
    <div className="ce-interactive-card">
      <p className="ce-interactive-question">{title}</p>

      {fields.map((f) => (
        <div key={f.key}>
          <label>{f.label}{f.required && ' *'}</label>
          {f.type === 'checkbox' ? (
            <input type="checkbox" checked={!!values[f.key]}
              onChange={(e) => set(f.key, e.target.checked)} />
          ) : f.type === 'select' ? (
            <select value={values[f.key] || ''}
              onChange={(e) => set(f.key, e.target.value)}>
              <option value="">Select…</option>
              {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input type="text" placeholder={f.placeholder}
              value={values[f.key] || ''}
              onChange={(e) => set(f.key, e.target.value)} />
          )}
        </div>
      ))}

      <button className="ce-interactive-submit" disabled={!allFilled}
        onClick={() => {
          setSubmitted(true);
          actions.submit(
            \`Shipping to \${values.name}, \${values.address}, \${values.city}\`,
            { action: 'save_address', formData: values }
          );
        }}>
        {submitLabel}
      </button>
    </div>
  );
}

export const completeFormRenderer = {
  key: 'CompleteForm',
  priority: 200,
  match: ({ effectiveType }) => effectiveType === 'CompleteForm',
  Component: CompleteFormComponent,
};

<ConvEngineChat config={{ renderers: [completeFormRenderer] }} />`;

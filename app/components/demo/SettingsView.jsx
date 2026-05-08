'use client';

import { useState } from 'react';

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
      <div className="sm:w-48 flex-shrink-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
        {hint && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-indigo-500' : 'bg-slate-200'}`}
      style={{ height: '22px', width: '40px' }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`}
        style={{ height: '18px', width: '18px' }}
      />
    </button>
  );
}

export function SettingsView() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account, workspace and preferences.</p>
      </div>

      {/* Profile */}
      <Section title="Profile">
        <Field label="Full name">
          <input defaultValue="Salil Nair" className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100" />
        </Field>
        <Field label="Email">
          <input defaultValue="salil@example.com" type="email" className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100" />
        </Field>
        <Field label="Role">
          <select className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700">
            <option>Admin</option>
            <option>Editor</option>
            <option>Viewer</option>
          </select>
        </Field>
        <Field label="Timezone">
          <select className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700">
            <option>Asia/Kolkata (IST, UTC+5:30)</option>
            <option>America/New_York (EST, UTC-5)</option>
            <option>Europe/London (GMT, UTC+0)</option>
          </select>
        </Field>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        {[
          { label: 'New order alerts',       hint: 'Get notified when a new order is placed.', on: true  },
          { label: 'Weekly digest',          hint: 'Summary of your metrics every Monday.',    on: true  },
          { label: 'Refund requests',        hint: 'Notify me when a refund is requested.',    on: false },
          { label: 'Product updates',        hint: 'Release notes and new features.',          on: false },
        ].map((n) => (
          <Field key={n.label} label={n.label} hint={n.hint}>
            <Toggle defaultOn={n.on} />
          </Field>
        ))}
      </Section>

      {/* API / Integrations */}
      <Section title="API &amp; Integrations">
        <Field label="API Key" hint="Keep this secret.">
          <div className="flex gap-2">
            <input
              readOnly
              value="sk-ce-••••••••••••••••••••••••••••••••"
              className="flex-1 text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 font-mono text-slate-500 dark:text-slate-400 outline-none"
            />
            <button className="px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
              Reveal
            </button>
            <button className="px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
              Rotate
            </button>
          </div>
        </Field>
        <Field label="Webhook URL">
          <input
            defaultValue="https://hooks.salilvnair.com/convengine"
            className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
          />
        </Field>
      </Section>

      {/* Plan */}
      <Section title="Plan &amp; Billing">
          <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-900 rounded-xl">
          <div>
            <p className="font-semibold text-indigo-800 dark:text-indigo-300">Pro Plan</p>
            <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5">Renews May 27, 2026 · $299 / mo</p>
          </div>
          <button className="px-4 py-1.5 text-xs font-semibold bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
            Manage
          </button>
        </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
          <p>✓ Up to 50,000 conversations / month</p>
          <p>✓ Custom renderers &amp; webhooks</p>
          <p>✓ Priority support</p>
        </div>
      </Section>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Save changes
        </button>
        {saved && <span className="text-sm text-emerald-600 font-medium">✓ Saved!</span>}
      </div>
    </div>
  );
}

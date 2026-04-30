'use client';

import { useState } from 'react';

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
      <div className="sm:w-48 flex-shrink-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function ProfileView() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Your personal details and account preferences.</p>
      </div>

      {/* Avatar row */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          SN
        </div>
        <div>
          <p className="font-semibold text-slate-800">Salil Nair</p>
          <p className="text-sm text-slate-500">salil@example.com · Admin</p>
        </div>
        <button className="ml-auto text-sm text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-4 py-2 transition-colors">
          Change photo
        </button>
      </div>

      <Section title="Personal Information">
        <Field label="Full name">
          <input defaultValue="Salil Nair"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400" />
        </Field>
        <Field label="Email">
          <input defaultValue="salil@example.com" type="email"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400" />
        </Field>
        <Field label="Display name" hint="Shown in chat and reports">
          <input defaultValue="Salil"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400" />
        </Field>
        <Field label="Role">
          <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 text-slate-700">
            <option>Admin</option>
            <option>Editor</option>
            <option>Viewer</option>
          </select>
        </Field>
      </Section>

      <Section title="Locale & Time">
        <Field label="Timezone">
          <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 text-slate-700">
            <option>Asia/Kolkata (IST, UTC+5:30)</option>
            <option>America/New_York (EST, UTC-5)</option>
            <option>Europe/London (GMT, UTC+0)</option>
            <option>America/Los_Angeles (PST, UTC-8)</option>
          </select>
        </Field>
        <Field label="Date format">
          <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 text-slate-700">
            <option>DD / MM / YYYY</option>
            <option>MM / DD / YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </Field>
      </Section>

      <Section title="Notifications">
        {[
          { label: 'Email digests',    hint: 'Weekly summary to your inbox' },
          { label: 'Chat mentions',    hint: 'When someone mentions you' },
          { label: 'Order alerts',     hint: 'New or changed order status' },
        ].map(({ label, hint }) => (
          <div key={label} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">{label}</p>
              <p className="text-xs text-slate-400">{hint}</p>
            </div>
            <Toggle />
          </div>
        ))}
      </Section>

      <div className="flex justify-end gap-3 pt-1">
        <button className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2 rounded-lg transition-colors">
          Discard
        </button>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium transition-colors"
        >
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      style={{ height: '22px', width: '40px', overflow: 'hidden' }}
      className={`relative rounded-full transition-colors flex-shrink-0 ${on ? 'bg-indigo-500' : 'bg-slate-200'}`}
    >
      <span
        style={{ height: '18px', width: '18px' }}
        className={`absolute top-0.5 bg-white rounded-full shadow-sm transition-transform ${on ? 'left-0 translate-x-5' : 'left-0 translate-x-0.5'}`}
      />
    </button>
  );
}

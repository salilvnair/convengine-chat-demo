'use client';

import { useState } from 'react';
import { CodeBlock }   from './ui/CodeBlock.jsx';
import { buildFaqResponsePayloadFromFakeChat, FAQ_RESPONSE_CODE } from '../../../data/faq-demo.js';
import { FAQ_ANSWER_RENDERER_PAYLOAD, FAQ_ANSWER_RENDERER_CODE } from '../../../data/faq-answer-renderer-demo.js';
import { FLIGHT_DEMO_CODE, FLIGHT_DEMO_PAYLOAD }     from '../../../data/flight-demo.js';
import { ORDER_TRACKER_DEMO_CODE, ORDER_TRACKER_DEMO_PAYLOAD }   from '../../../data/order-tracker-demo.js';
import { PRODUCT_DEMO_CODE, PRODUCT_DEMO_PAYLOAD }   from '../../../data/product-demo.js';
import { DATA_TABLE_DEMO_CODE, DATA_TABLE_DEMO_PAYLOAD } from '../../../data/data-table-demo.js';
import { COMPLETE_FORM_DEMO_CODE, COMPLETE_FORM_DEMO_PAYLOAD } from '../../../data/complete-form-demo.js';

const COLOR_BG    = { indigo: 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-900', pink: 'bg-pink-50 dark:bg-pink-900/30 border-pink-100 dark:border-pink-900', amber: 'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-900', emerald: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-900' };
const COLOR_BADGE = { indigo: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300', pink: 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300', amber: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300', emerald: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' };
const COLOR_BTN   = { indigo: 'bg-indigo-500 hover:bg-indigo-600', pink: 'bg-pink-500 hover:bg-pink-600', amber: 'bg-amber-500 hover:bg-amber-600', emerald: 'bg-emerald-500 hover:bg-emerald-600' };

const RENDERER_DEMOS = [
  {
    key: 'FlightCard',
    icon: '✈️',
    title: 'FlightCard',
    desc: 'Flight booking with price comparison. User selects a flight and confirms.',
    color: 'indigo',
    actions: ['submit → book_flight'],
    payload: FLIGHT_DEMO_PAYLOAD,
    code: FLIGHT_DEMO_CODE,
  },
  {
    key: 'OrderTracker',
    icon: '📦',
    title: 'OrderTracker',
    desc: 'Real-time order status with visual timeline, track detail, and contact support.',
    color: 'pink',
    actions: ['submitSilent → track_detail', 'prefillInput → support message'],
    payload: ORDER_TRACKER_DEMO_PAYLOAD,
    code: ORDER_TRACKER_DEMO_CODE,
  },
  {
    key: 'ProductRecommendation',
    icon: '🛍️',
    title: 'ProductRecommendation',
    desc: 'AI-curated product cards with ratings, badges, and add-to-cart actions.',
    color: 'amber',
    actions: ['appendBubble → cart confirmation', 'submit → show more'],
    payload: PRODUCT_DEMO_PAYLOAD,
    code: PRODUCT_DEMO_CODE,
  },
  {
    key: 'DataTable',
    icon: '📊',
    title: 'DataTable',
    desc: 'Renders structured data as a styled card table. hideBubble:true removes the bubble shell — the card controls its own presentation.',
    color: 'emerald',
    actions: [],
    payload: DATA_TABLE_DEMO_PAYLOAD,
    code: DATA_TABLE_DEMO_CODE,
  },
  {
    key: 'CompleteForm',
    icon: '📋',
    title: 'CompleteForm',
    desc: 'Multi-field registration form with text inputs, dropdown, radio, checkbox, file upload, and date picker.',
    color: 'emerald',
    actions: ['submit → form_submit (sends all field values)'],
    payload: COMPLETE_FORM_DEMO_PAYLOAD,
    code: COMPLETE_FORM_DEMO_CODE,
  },
  {
    key: 'FaqAnswer',
    icon: '💡',
    title: 'FaqAnswer (custom renderer)',
    desc: 'Custom renderer for FAQ answer payloads. Shows the answer text, a confidence % badge, and matched FAQ ID chips. Register via config.renderers — no longer built-in.',
    color: 'indigo',
    actions: [],
    payload: FAQ_ANSWER_RENDERER_PAYLOAD,
    code: FAQ_ANSWER_RENDERER_CODE,
  },
  {
    key: 'FAQResponse',
    icon: '❓',
    title: 'FAQResponse',
    desc: 'Assistant FAQ response rendered as a DataTable card with concise, support-ready answers.',
    color: 'indigo',
    actions: ['appendBubble → assistant FAQ snapshot'],
    payloadBuilder: () => buildFaqResponsePayloadFromFakeChat('how to reset password', 3),
    payload: buildFaqResponsePayloadFromFakeChat('how to reset password', 3),
    code: FAQ_RESPONSE_CODE,
  },
];

export function RendererLiveDemo({ chatActionsRef }) {
  const [injected, setInjected] = useState({});
  const [expanded, setExpanded] = useState({});

  function tryDemo(demo) {
    if (!chatActionsRef?.current?.appendBubble) {
      alert('Open the chat widget first — click the chat bubble in the corner of the page!');
      return;
    }
    const payload = typeof demo.payloadBuilder === 'function' ? demo.payloadBuilder() : demo.payload;
    chatActionsRef.current.appendBubble(JSON.stringify(payload));
    setInjected((prev) => ({ ...prev, [demo.key]: true }));
    setTimeout(() => setInjected((prev) => ({ ...prev, [demo.key]: false })), 2000);
  }

  return (
    <div className="rounded-2xl border border-teal-100 dark:border-teal-900 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-lg mt-0.5">🚀</span>
        <div>
          <p className="text-sm font-bold text-teal-800 dark:text-teal-300">Live Renderer Demo</p>
          <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5">
            Click <strong>▶ Try it</strong> to inject a renderer payload directly into the chat widget via{' '}
            <code className="font-mono bg-teal-100 dark:bg-teal-900/40 dark:text-teal-300 px-1 rounded">appendBubble</code>.
            In production, your backend returns the same JSON shape.
            Expand <strong>&lt;/&gt; View code</strong> to see the full implementation.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {RENDERER_DEMOS.map((demo) => (
          <div key={demo.key} className={`rounded-xl border overflow-hidden ${COLOR_BG[demo.color]}`}>
            <div className="flex items-start justify-between gap-3 p-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{demo.icon} {demo.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${COLOR_BADGE[demo.color]}`}>
                    type: &quot;{demo.key}&quot;
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{demo.desc}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {demo.actions.map((a) => (
                    <code key={a} className="text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">{a}</code>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button
                  onClick={() => tryDemo(demo)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg text-white transition-all ${COLOR_BTN[demo.color]} ${injected[demo.key] ? 'opacity-75' : ''}`}
                >
                  {injected[demo.key] ? '✓ Sent!' : '▶ Try it'}
                </button>
                <button
                  onClick={() => setExpanded((p) => ({ ...p, [demo.key]: !p[demo.key] }))}
                  className="text-[11px] font-mono font-semibold px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                >
                  {expanded[demo.key] ? '▲ Hide code' : '</> View code'}
                </button>
              </div>
            </div>
            {expanded[demo.key] && (
              <div className="border-t border-slate-200 dark:border-slate-700">
                <CodeBlock code={demo.code} lang="jsx" />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-teal-500 dark:text-teal-400">
        💡 The registry parses the assistant message as JSON, reads <code className="font-mono bg-teal-100 dark:bg-teal-900/40 dark:text-teal-300 px-1 rounded">type</code>, and routes to the first provider whose <code className="font-mono bg-teal-100 dark:bg-teal-900/40 dark:text-teal-300 px-1 rounded">match()</code> returns true.
      </p>
    </div>
  );
}

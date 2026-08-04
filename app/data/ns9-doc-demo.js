export const NS9_DOC_DEMO_PAYLOAD = {
  type: 'ns9',
  format: 'json',
  headline: 'Drift severity tier',
  rawText:
    "BizMgr's escalation policy defines a fourth internal severity tier called **Drift**, " +
    "for security-adjacent anomalies with no confirmed customer impact yet.\n\n" +
    '- **Beacon** — full outage, ack in 5 min, resolve in 60 min\n' +
    '- **Flare** — workaround exists, ack in 20 min, resolve in 4 hr\n' +
    "- Drift tickets are triaged by the **Security Liaison**, not the Lighthouse rotation.",
  keyPoints: [
    {
      point: 'Drift covers security-adjacent anomalies with no confirmed customer impact yet.',
      sources: ['importantnote:drift_severity_tier'],
    },
    {
      point: 'Drift tickets are triaged by the Security Liaison, not Lighthouse.',
      sources: ['importantnote:drift_severity_tier'],
    },
  ],
  caveats: [],
  citations: [
    {
      // A /brain/remember-taught memory — no document, so the card renders
      // its point without a "Sources" entry for this one specifically.
      node_id: 'importantnote:drift_severity_tier',
      node_type: 'ImportantNote',
      label: 'Drift severity tier',
      summary: "BizMgr's escalation policy defines a fourth internal severity tier called 'Drift'…",
      document: null,
    },
    {
      // A real ingested PDF (ns9 ingest docs --source-url-map) -- gets a
      // document card with Open + Download.
      node_id: 'runbook:bizmgr-support-escalation-policy',
      node_type: 'OperationalNote',
      label: 'bizmgr-support-escalation-policy',
      summary: 'Internal process document — how the support desk classifies and escalates incidents.',
      source_url: 'http://localhost:4320/support-docs/bizmgr-support-escalation-policy.pdf',
      source_pages: '1',
      document: {
        file_name: 'bizmgr-support-escalation-policy.pdf',
        file_stem: 'bizmgr-support-escalation-policy',
        file_ext: '.pdf',
        file_path: 'http://localhost:4320/support-docs/bizmgr-support-escalation-policy.pdf',
      },
    },
  ],
};

export const NS9_DOC_DEMO_CODE = `// Ns9DocRenderer.jsx
// ── How data flows from NS9 ────────────────────────────────────────────────
// 1. Call NS9's convengine bridge with a header opted into structured mode:
//
//    POST /api/v1/conversation/message
//    X-NS9-Response-Format: json
//    { "conversationId": "...", "message": "Does BizMgr have a Drift tier?" }
//
// 2. NS9 returns { payload: { type:"ns9", format:"json", rawText, headline,
//    keyPoints, caveats, citations } } -- rawText is clean prose (no baked-in
//    "Read more: <url>" line the way format:"text" adds), and each citation
//    that traces back to a real ingested file carries a "document" object:
//    { file_name, file_stem, file_ext, file_path }. A citation grounded in a
//    /brain/remember-taught memory (no source document) has document: null.
//
// 3. ConvEngineChat JSON-stringifies the whole payload into the bubble text,
//    then re-parses it to find effectiveType (= payload.type). This renderer
//    matches effectiveType==="ns9" && payload.format==="json" and receives
//    the full object back as \`payload\`.
// ─────────────────────────────────────────────────────────────────────────

export const ns9AnswerRenderer = {
  key: 'Ns9Answer',
  priority: 250,
  hideBubble: true,
  match: ({ payload, effectiveType }) =>
    effectiveType === 'ns9' && payload?.format === 'json',
  Component: Ns9AnswerComponent, // renders rawText as markdown, keyPoints,
                                  // caveats, and one document card per
                                  // unique cited file (Open + Download).
};`;

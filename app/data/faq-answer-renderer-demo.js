export const FAQ_ANSWER_RENDERER_PAYLOAD = {
  type: 'FaqAnswer',
  answer:
    'To reset your password, go to the login page and click "Forgot password?". ' +
    'Enter your registered email address and we will send you a reset link within a few minutes. ' +
    'The link expires after 30 minutes — request a new one if needed.',
  confidence: 0.91,
  matchedFaqIds: ['42', '17'],
};

export const FAQ_ANSWER_RENDERER_CODE = `// FaqAnswerRenderer.jsx — register as a custom renderer in config.renderers
// ── Payload shape your backend returns ───────────────────────────────────
// {
//   type:          "FaqAnswer",   // required — triggers this renderer
//   answer:        string,        // the answer text to display
//   confidence?:   number,        // 0–1 float shown as a % badge
//   matchedFaqIds?: string[],     // optional FAQ ID chips
// }
// ─────────────────────────────────────────────────────────────────────────

function FaqAnswerRenderer({ payload }) {
  const answer = typeof payload?.answer === 'string' ? payload.answer : '';

  const matchedFaqIds = Array.isArray(payload?.matchedFaqIds)
    ? payload.matchedFaqIds
    : [];

  const confidenceRaw =
    typeof payload?.confidence === 'number' ? payload.confidence : null;
  const confidencePercent =
    confidenceRaw === null
      ? null
      : Math.max(0, Math.min(100, Math.round(confidenceRaw * 100)));

  return (
    <div className="ce-faq-answer">
      {confidencePercent !== null && (
        <span
          className="ce-faq-confidence"
          title={\`Confidence \${confidencePercent}%\`}
          aria-label={\`Confidence \${confidencePercent} percent\`}
        >
          {confidencePercent}%
        </span>
      )}

      {matchedFaqIds.length > 0 && (
        <div className="ce-faq-meta">
          {matchedFaqIds.map((id) => (
            <span key={id} className="ce-faq-chip" title={\`FAQ ID: \${id}\`}>
              FAQ {id}
            </span>
          ))}
        </div>
      )}

      <pre className="ce-bubble-text">{answer}</pre>
    </div>
  );
}

// Register in config.renderers:
export const faqAnswerRendererProvider = {
  key: 'FaqAnswer',
  priority: 100,
  match: ({ payload, effectiveType }) => {
    if (!payload || typeof payload !== 'object') return false;
    if (effectiveType === 'FaqAnswer') return true;
    const hasAnswer = typeof payload.answer === 'string';
    const hasFaqArray =
      Array.isArray(payload.matchedFaqIds) ||
      Array.isArray(payload.faqIdsMatched);
    const hasConfidence = typeof payload.confidence === 'number';
    return hasAnswer && (hasFaqArray || hasConfidence);
  },
  Component: FaqAnswerRenderer,
};

// Wire it up:
// <ConvEngineChat config={{ renderers: [faqAnswerRendererProvider] }} />`;

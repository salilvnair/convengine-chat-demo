/**
 * Builds a ConvEngine-shaped audit trail for a demo turn.
 *
 * Stage names and payload KEYS here are taken from the real engine
 * (github.com/salilvnair/convengine):
 *   - stages   → audit/ConvEngineAuditStage.java (107 constants, plus the
 *                dynamic INTENT_RESOLVED_BY_<SOURCE> from intentResolvedBy())
 *   - keys     → engine/constants/ConvEnginePayloadKey.java
 *   - payloads → the step that writes each stage, e.g. AuditUserInputStep
 *                (USER_INPUT), DialogueActStep (DIALOGUE_ACT_CLASSIFIED),
 *                IntentResolutionStep, SchemaExtractionStep (SCHEMA_STATUS),
 *                ResponseResolutionStep (RESOLVE_RESPONSE, ASSISTANT_OUTPUT),
 *                PersistConversationStep (ENGINE_RETURN), PipelineEndGuardStep
 *                (PIPELINE_TIMING).
 *
 * The VALUES are what this demo genuinely knows. There is no LLM here, so the
 * LLM stages (RESOLVE_RESPONSE_LLM_INPUT/OUTPUT, INTENT_AGENT_*, AGENT_PLAN_*)
 * are deliberately NOT emitted — a demo that faked a model prompt would make
 * the panel a prettier lie. What the demo does have is a matcher, so the
 * classifier stages carry its real decision: which stage of fake-chat.js
 * answered, the canned phrase it matched, and the similarity score.
 */

/* Intent codes. The demo has no ce_intent table, so these name what the
   matcher actually did rather than pretending to be a customer's taxonomy. */
const INTENT_BY_MATCHER_STAGE = {
  'buy-now-handler':     'CART_CHECKOUT',
  'book-flight-handler': 'FLIGHT_BOOKING',
  'form-submit-handler': 'FORM_SUBMISSION',
  'faq-knowledge-base':  'FAQ_LOOKUP',
  'enrichment-prefix':   'ENRICHMENT_ROUTED',
  'exact-match':         'CANNED_EXACT',
  'contains-match':      'CANNED_CONTAINS',
  'jaccard-similarity':  'CANNED_FUZZY',
  'levenshtein-typo':    'CANNED_TYPO',
  'random-fallback':     'UNKNOWN',
};

function intentFor(matcherStage) {
  return INTENT_BY_MATCHER_STAGE[matcherStage] ?? 'UNKNOWN';
}

/** QUESTION vs STATEMENT — a real (if simple) classification, not a guess. */
function dialogueActFor(text) {
  const t = (text ?? '').trim();
  if (/\?\s*$/.test(t)) return 'QUESTION';
  if (/^(hi|hey|hello|thanks|thank you|bye)\b/i.test(t)) return 'CHITCHAT';
  if (/^(yes|no|yeah|nope|ok|okay)\b/i.test(t)) return 'CONFIRMATION';
  return 'STATEMENT';
}

/** What the engine would carry in `context` — here, the matcher's own facts. */
function matcherContext(trace) {
  const ctx = { matcherStage: trace.stage ?? 'unknown' };
  if (trace.matchedPhrase) ctx.matchedPhrase = trace.matchedPhrase;
  if (typeof trace.score === 'number') ctx.jaccardScore = Number(trace.score.toFixed(3));
  if (typeof trace.editDistance === 'number') ctx.editDistance = trace.editDistance;
  if (trace.prefix) ctx.enrichmentPrefix = trace.prefix;
  return ctx;
}

/**
 * The stage sequence for one turn, in the order the engine's pipeline writes
 * it. Returns [{ stage, payload }] — payload is an object, or a pre-encoded
 * JSON string where the engine writes one (PIPELINE_TIMING).
 *
 * @param {object} turn
 * @param {string} turn.userText
 * @param {object} turn.trace           fake-chat.js matcher trace (stage, matchedPhrase, score…)
 * @param {*}      turn.agent           the payload being returned to the widget
 * @param {string} turn.previousIntent
 * @param {Array}  turn.files           decoded attachments, if any
 * @param {object} turn.timings         { stepName: ms } measured, not invented
 */
export function buildTurnAudit({
  userText,
  trace = {},
  agent,
  previousIntent = null,
  files = [],
  timings = {},
}) {
  const matcherStage = trace.stage ?? 'unknown';
  const intent       = intentFor(matcherStage);
  const state        = matcherStage === 'random-fallback' ? 'FALLBACK' : 'ANSWERED';
  const matched      = matcherStage !== 'random-fallback';
  const isJson       = typeof agent !== 'string';
  const outputFormat = isJson ? 'JSON' : 'TEXT';
  const output       = isJson ? JSON.stringify(agent) : agent;
  const dialogueAct  = dialogueActFor(userText);
  const context      = matcherContext(trace);

  const rows = [];
  const add = (stage, payload) => rows.push({ stage, payload });

  // ── AuditUserInputStep ──────────────────────────────────────────────────
  add('USER_INPUT', { text: userText });

  // ── DialogueActStep ─────────────────────────────────────────────────────
  add('DIALOGUE_ACT_CLASSIFIED', {
    userText,
    dialogueAct,
    // The real field is a model confidence. This classifier is a regex, so it
    // reports 1 when a rule fired and 0 for the catch-all STATEMENT.
    dialogueActConfidence:  dialogueAct === 'STATEMENT' ? 0 : 1,
    dialogueActSource:      'HEURISTIC',
    dialogueActResolveMode: 'HEURISTIC',
    intent: previousIntent,
    state:  null,
  });

  // ── InteractionPolicyStep ───────────────────────────────────────────────
  add('INTERACTION_POLICY_DECIDED', {
    dialogueAct,
    policyDecision:       'PROCEED',
    skipIntentResolution: false,
    hasPendingAction:     false,
    hasPendingSlot:       false,
    intent: previousIntent,
    state:  null,
  });

  // ── GuardrailStep ───────────────────────────────────────────────────────
  add('GUARDRAIL_ALLOW', {
    result:           'ALLOW',
    sensitive:        false,
    approvalRequired: false,
    approvalGranted:  false,
    intent: previousIntent,
    state:  null,
  });

  // ── IntentResolutionStep ────────────────────────────────────────────────
  add('INTENT_RESOLVE_START', {
    previousIntent,
    intentLocked:     false,
    intentLockReason: null,
  });

  if (matched) {
    // ClassifierIntentResolver — matchedByRule is the canned phrase that won.
    add('INTENT_CLASSIFICATION_MATCHED', {
      intent,
      state,
      matchedByRule: trace.matchedPhrase ?? matcherStage,
    });
    // intentResolvedBy("CLASSIFIER") → INTENT_RESOLVED_BY_CLASSIFIER. The
    // payload is the IntentResolutionResult record itself.
    add('INTENT_RESOLVED_BY_CLASSIFIER', {
      resolvedIntent:   intent,
      source:           'CLASSIFIER',
      classifierIntent: intent,
      agentIntent:      null,
    });
    // RULE_MATCH.withStage(source) — "NAME (stage)" sub-stage labelling.
    add('RULE_MATCH (fake-chat matcher)', {
      ruleId:              matcherStage,
      action:              'SET_INTENT',
      ruleType:            'MATCHER',
      ruleStateCode:       state,
      intent,
      state,
      ruleExecutionSource: 'fake-chat.js matchResponse()',
      ruleExecutionOrigin: 'DemoMessageRoute',
      rulePhase:           'POST_CLASSIFIER_INTENT',
      context,
      schemaJson:          null,
    });
  }
  else {
    add('INTENT_CLASSIFIER_NO_MATCH', { userText, intent, state });
    add('INTENT_MISSING', {
      intent,
      state,
      reason: 'No canned pair cleared the match threshold',
    });
  }

  // ── SchemaExtractionStep — the demo collects no slots, so this is the
  //    "nothing to collect" shape rather than a fabricated schema. ─────────
  add('SCHEMA_STATUS', {
    schemaComplete:        true,
    hasAnySchemaValue:     false,
    missingRequiredFields: [],
    missingFieldOptions:   {},
    schemaId:              null,
    intent,
    state,
    intentLocked:          false,
    intentLockReason:      null,
    context,
    schemaJson:            null,
  });

  // ── AgentToolStep — only when the turn actually ran a "tool". Decoding an
  //    upload is the one thing this demo does that is a tool call. ─────────
  if (files.length) {
    add('AGENT_TOOL_CALL', {
      tool_code:                'attachment_decoder',
      args:                     { files: files.map((f) => f.name) },
      action:                   'TOOL',
      intent,
      state,
      routingDecision:          'AGENT',
      observation_count:        0,
      current_observation_tool: 'FLOW_START',
    });
    add('AGENT_TOOL_RESULT', {
      tool_code:  'attachment_decoder',
      tool_group: 'LOCAL',
      rows:       JSON.stringify(files),
    });
  }

  // ── ResponseResolutionStep ──────────────────────────────────────────────
  add('RESOLVE_RESPONSE', { responseId: `demo-${matcherStage}`, intent, state });
  add('RESOLVE_RESPONSE_SELECTED', {
    templateId: null,
    intent,
    outputFormat,
    // The real value is the OutputFormatResolver bean that ran.
    resolver:   'FakeChatOutputFormatResolver',
  });
  add('ASSISTANT_OUTPUT', {
    output,
    outputFormat,
    // EXACT because the reply is a canned pair, not generated — the same value
    // the engine uses for non-LLM responses.
    responseType: 'EXACT',
    responseId:   `demo-${matcherStage}`,
    intent,
    state,
    context,
    schemaJson:   null,
  });

  // ── PersistConversationStep — final_result is the EngineResult record
  //    (intent, state, payload, contextJson). ──────────────────────────────
  add('ENGINE_RETURN', {
    intent,
    state,
    final_result: {
      intent,
      state,
      payload:     isJson ? { type: 'JSON', json: output } : { type: 'TEXT', text: output },
      contextJson: JSON.stringify(context),
    },
  });

  // ── PipelineEndGuardStep — written as a raw JSON string upstream, and the
  //    millisecond figures here are measured, not invented. ───────────────
  const entries = Object.entries(timings);
  const totalMs = entries.reduce((sum, [, ms]) => sum + ms, 0);
  add('PIPELINE_TIMING', JSON.stringify({
    totalMs,
    steps: entries.map(([name, ms]) => `${name}=${ms}ms`).join(', '),
  }));

  return rows;
}

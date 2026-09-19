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

/* ── Prompts ────────────────────────────────────────────────────────────────
 * The LLM stages carry the largest payloads in a real trail (system_prompt,
 * user_prompt, the returned JSON), and they are the stages the audit panel has
 * to render well. Leaving them out of the demo left that path untested and made
 * the trail look nothing like production.
 *
 * So they ARE emitted — each on the path where this demo does that kind of work
 * for real — and every prompt below describes what the demo genuinely does,
 * with the returned JSON being the decision it genuinely made. No stage claims
 * a model was called: `dialogueActSource` and friends say where it came from,
 * and the prompts say so in the first line.
 */
const DEMO_NOTE = '(Demo build: no model is called — fake-chat.js applies the rules below and reports the result in the shape a deployment with a model behind it produces.)';

const DIALOGUE_ACT_SYSTEM_PROMPT = [
  'Classify the user\'s latest message into exactly one dialogue act:',
  'QUESTION | STATEMENT | CHITCHAT | CONFIRMATION. Reply as JSON matching the schema.',
  '',
  DEMO_NOTE,
  '',
  'Rules applied, in order:',
  '  1. ends with "?"                        -> QUESTION',
  '  2. opens with hi/hey/hello/thanks/bye   -> CHITCHAT',
  '  3. opens with yes/no/yeah/nope/ok/okay  -> CONFIRMATION',
  '  4. otherwise                            -> STATEMENT',
].join('\n');

const DIALOGUE_ACT_SCHEMA = JSON.stringify({
  type: 'object',
  properties: {
    dialogueAct: { type: 'string', enum: ['QUESTION', 'STATEMENT', 'CHITCHAT', 'CONFIRMATION'] },
    confidence:  { type: 'number' },
  },
  required: ['dialogueAct'],
}, null, 2);

const INTENT_AGENT_SYSTEM_PROMPT = [
  'Pick the best intent for the user\'s message from the catalogue, or return',
  'UNKNOWN with a reason. Reply as JSON.',
  '',
  DEMO_NOTE,
  '',
  'The classifier already walked its stages and found nothing above threshold:',
  '  exact match -> contains match -> Jaccard similarity >= 0.35 -> Levenshtein',
  '  (short inputs only). The catalogue is the canned user/agent pair list in',
  '  app/data/fake-chat.json.',
].join('\n');

const AGENT_PLANNER_SYSTEM_PROMPT = [
  'You are the tool planner. Given the user message and the observations so far,',
  'either call a tool or produce a final answer. Reply as JSON.',
  '',
  DEMO_NOTE,
  '',
  'Tools available in this demo:',
  '  attachment_decoder — base64-decodes the files on inputParams.files and',
  '  reports the byte count recovered server-side.',
].join('\n');

const AGENT_PLAN_SCHEMA = JSON.stringify({
  type: 'object',
  properties: {
    action:    { type: 'string', enum: ['TOOL', 'FINAL'] },
    tool_code: { type: 'string' },
    args:      { type: 'object' },
  },
  required: ['action'],
}, null, 2);

const SCHEMA_EXTRACTION_SYSTEM_PROMPT = [
  'Extract the schema fields from the user\'s message. Return JSON with one key',
  'per field, using null for anything not supplied.',
  '',
  DEMO_NOTE,
  '',
  'The demo\'s form flow sends "form submitted: <name>, <country>, DOB: <dob>",',
  'so extraction here is a split on commas rather than a model call.',
].join('\n');

const RESPONSE_SYSTEM_PROMPT = [
  'Write the assistant reply for the resolved intent using the retrieved context.',
  'Stay within the context; do not invent facts.',
  '',
  DEMO_NOTE,
  '',
  'The reply below was assembled by fake-chat.js from the canned corpus — the',
  'derived/JSON response types are the ones a real deployment renders with a model.',
].join('\n');

/** Parses the demo form flow's "form submitted: <name>, <country>, DOB: <dob>". */
function extractFormFields(text) {
  const details = String(text ?? '').slice(String(text ?? '').indexOf(':') + 1).trim();
  const parts   = details.split(',').map((s) => s.trim());
  const dobPart = parts.find((p) => /^dob:/i.test(p));
  return {
    name:    parts[0] || null,
    country: parts[1] && !/^dob:/i.test(parts[1]) ? parts[1] : null,
    dob:     dobPart ? dobPart.replace(/^dob:\s*/i, '') : null,
  };
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

  // ── DialogueActStep, LLM resolve mode ───────────────────────────────────
  // The prompt is the demo's ACTUAL rule set written out, and the output JSON
  // is the classification it actually made — so the pair is a true record of
  // the decision, in the shape a deployment with a model behind it produces.
  add('DIALOGUE_ACT_LLM_INPUT', {
    system_prompt: DIALOGUE_ACT_SYSTEM_PROMPT,
    user_prompt:   userText,
    schema:        DIALOGUE_ACT_SCHEMA,
  });
  add('DIALOGUE_ACT_LLM_OUTPUT', {
    json: JSON.stringify({
      dialogueAct,
      confidence: dialogueAct === 'STATEMENT' ? 0 : 1,
    }),
  });
  add('DIALOGUE_ACT_CLASSIFIED', {
    userText,
    dialogueAct,
    // The real field is a model confidence. These rules are regexes, so this is
    // 1 when a rule fired and 0 for the catch-all STATEMENT.
    dialogueActConfidence:  dialogueAct === 'STATEMENT' ? 0 : 1,
    dialogueActSource:      'LLM',
    dialogueActResolveMode: 'LLM',
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
    // No classifier match is exactly when the engine escalates to the intent
    // agent, so that LLM pair belongs on this path and no other.
    add('INTENT_CLASSIFIER_NO_MATCH', { userText, intent, state });
    add('INTENT_AGENT_LLM_INPUT', {
      // The engine's own key, verbatim — it names the ce_config row the
      // prompts came from. (Note the camelCase here vs system_prompt
      // elsewhere; that inconsistency is the engine's, mirrored on purpose.)
      'templateFromCeConfig (AgentIntentResolver)': 'USER_PROMPT, SYSTEM_PROMPT',
      systemPrompt: INTENT_AGENT_SYSTEM_PROMPT,
      userPrompt:   userText,
    });
    add('INTENT_AGENT_LLM_OUTPUT', {
      json: JSON.stringify({
        resolvedIntent: 'UNKNOWN',
        confidence:     0,
        reason:         'No canned pair cleared the match threshold.',
      }, null, 2),
    });
    add('INTENT_AGENT_REJECTED', { intent, state, reason: 'confidence below threshold' });
    add('INTENT_MISSING', {
      intent,
      state,
      reason: 'No canned pair cleared the match threshold',
    });
  }

  // ── SchemaExtractionStep ────────────────────────────────────────────────
  // The demo has exactly one slot-collection flow — the form demo, which sends
  // "form submitted: <name>, <country>, DOB: <dob>". That is the one turn where
  // extraction genuinely happens, so it is the one that emits the LLM pair.
  if (matcherStage === 'form-submit-handler') {
    const fields = extractFormFields(userText);
    add('SCHEMA_EXTRACTION_START', { schemaId: 'demo-form', intent, state });
    add('SCHEMA_EXTRACTION_LLM_INPUT', {
      system_prompt: SCHEMA_EXTRACTION_SYSTEM_PROMPT,
      user_prompt:   userText,
      schema:        JSON.stringify({
        type: 'object',
        properties: { name: { type: 'string' }, country: { type: 'string' }, dob: { type: 'string' } },
        required: ['name'],
      }, null, 2),
      userInput:     userText,
    });
    add('SCHEMA_EXTRACTION_LLM_OUTPUT', { json: JSON.stringify(fields, null, 2) });
  }

  // The demo collects no slots outside that flow, so this is the "nothing to
  // collect" shape rather than a fabricated schema.
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
    // A real agent plans before it calls, so the plan pair goes here.
    add('AGENT_PLAN_LLM_INPUT', {
      'templateFromCeConfig (AgentPlanner)': 'AGENT_PLANNER_PROMPT',
      system_prompt: AGENT_PLANNER_SYSTEM_PROMPT,
      user_prompt:   userText || '(no text — files only)',
      schema:        AGENT_PLAN_SCHEMA,
      agent_observations_compacted:   false,
      agent_observations_raw_chars:   0,
      agent_observations_final_chars: 0,
    });
    add('AGENT_PLAN_LLM_OUTPUT', {
      json: JSON.stringify({
        action:    'TOOL',
        tool_code: 'attachment_decoder',
        args:      { files: files.map((f) => f.name) },
      }, null, 2),
    });
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

  // A DERIVED response is the one a deployment renders with a model; an EXACT
  // canned string is not. So the response LLM pair rides with the JSON/derived
  // payloads (FAQ answers, the interactive renderers) and is absent when the
  // reply is a flat canned string — same as the engine.
  if (isJson) {
    add('RESOLVE_RESPONSE_LLM_INPUT', {
      system_prompt:   RESPONSE_SYSTEM_PROMPT,
      user_prompt:     userText,
      derivation_hint: `Render as ${outputFormat} for intent ${intent}.`,
      session: {
        conversationId: null,
        intent,
        state,
        context,
      },
    });
    add('RESOLVE_RESPONSE_LLM_OUTPUT', { output });
  }
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

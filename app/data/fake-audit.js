/**
 * ConvEngine-shaped audit trail for the demo backend.
 *
 * Rebuilt from a REAL capture, not from reading the engine's call sites. A live
 * ConvEngine (2.0.28) was run against Postgres with a stub LLM and one turn was
 * recorded: 98 rows, 39 distinct stages. Reading the Java only ever showed the
 * body each call site writes — the capture showed three things no call site
 * mentions, all of which the audit panel has to survive:
 *
 *   1. Every payload is wrapped in a `_meta` envelope injected centrally
 *      (stage/state/intent/session/emittedAt/contextDict/inputParams/
 *      conversationId). It is ~91% of every real row: the average payload is
 *      15KB, but only 1.4KB of that is what the call site wrote.
 *   2. STEP_ENTER / STEP_EXIT bracket every pipeline step — 54 of the 98 rows —
 *      and are not ConvEngineAuditStage constants at all; they come from the
 *      step hook.
 *   3. PROMPT_RENDERING (8 rows, up to 48KB each), SET_STATE as a stage in its
 *      own right, and RULE_NO_MATCH (StepName) on nearly every step.
 *
 * What is mirrored here: the 27-step pipeline order, the stage sequence within
 * each step, the body keys of every stage, and the `_meta` envelope including
 * stepInfos accumulating as the pipeline runs.
 *
 * What is deliberately trimmed: rendered templates and prompts are short here.
 * A faithful turn is 1.7MB, which is not something to ship through a demo's
 * dev server on every message. Shape is exact; volume is not.
 */

const ENGINE_STEP_PACKAGE = 'com.github.salilvnair.convengine.engine.steps';

/* The pipeline, in the order the engine logged it. Steps with no stages of
   their own still appear — they are half the rows in a real trail. */
const PIPELINE = [
  'LoadOrCreateConversationStep',
  'ResetConversationStep',
  'PersistConversationBootstrapStep',
  'AuditUserInputStep',
  'DialogueActStep',
  'InteractionPolicyStep',
  'ActionLifecycleStep',
  'CorrectionStep',
  'DisambiguationStep',
  'GuardrailStep',
  'IntentResolutionStep',
  'PolicyEnforcementStep',
  'ResetResolvedIntentStep',
  'FallbackIntentStateStep',
  'AddContainerDataStep',
  'SchemaExtractionStep',
  'AutoAdvanceStep',
  'PendingActionStep',
  'ToolOrchestrationStep',
  'AgentToolStep',
  'RulesStep',
  'StateGraphStep',
  'ResponseResolutionStep',
  'PostResponseRulesStep',
  'MemoryStep',
  'PersistConversationStep',
  'PipelineEndGuardStep',
];

/* Intent codes. The demo has no ce_intent table, so these name what the matcher
   actually did rather than pretending to be a customer's taxonomy. */
const INTENT_BY_MATCHER_STAGE = {
  'buy-now-handler':     'CART_CHECKOUT',
  'book-flight-handler': 'FLIGHT_BOOKING',
  'form-submit-handler': 'FORM_SUBMISSION',
  'faq-knowledge-base':  'FAQ_LOOKUP',
  'enrichment-prefix':   'ENRICHMENT_ROUTED',
  'attachment-handler':  'FILE_ANALYSIS',
  'exact-match':         'CANNED_EXACT',
  'contains-match':      'CANNED_CONTAINS',
  'jaccard-similarity':  'CANNED_FUZZY',
  'levenshtein-typo':    'CANNED_TYPO',
  'random-fallback':     'UNKNOWN',
};

const DEMO_NOTE = '(Demo build: no model is called — fake-chat.js applies the rules below and reports the result in the shape a deployment with a model behind it produces.)';

const DIALOGUE_ACT_SYSTEM_PROMPT = [
  'Classify the user\'s latest message into exactly one dialogue act:',
  'AFFIRM | NEGATE | EDIT | RESET | QUESTION | NEW_REQUEST | GREETING.',
  'Reply as JSON matching the schema.',
  '',
  DEMO_NOTE,
  '',
  'Rules applied, in order:',
  '  1. opens with yes/ok/sure                -> AFFIRM',
  '  2. opens with no/nope                    -> NEGATE',
  '  3. opens with a greeting or thanks       -> GREETING',
  '  4. mentions reset/start over             -> RESET',
  '  5. ends with "?"                         -> QUESTION',
  '  6. otherwise                             -> NEW_REQUEST',
].join('\n');

const DIALOGUE_ACT_SCHEMA = JSON.stringify({
  type: 'object',
  required: ['dialogueAct', 'confidence'],
  properties: {
    dialogueAct: { type: 'string', enum: ['AFFIRM', 'NEGATE', 'EDIT', 'RESET', 'QUESTION', 'NEW_REQUEST', 'GREETING'] },
    confidence:  { type: 'number' },
  },
  additionalProperties: false,
});

const INTENT_AGENT_SYSTEM_PROMPT = [
  'You are an intent resolution agent for a conversational engine.',
  'Return JSON only, with intent, state, confidence, intentScores and followups.',
  '',
  DEMO_NOTE,
  '',
  'The classifier already walked its stages and found nothing above threshold:',
  '  exact match -> contains match -> Jaccard similarity >= 0.35 -> Levenshtein',
  '  (short inputs only). The catalogue is the canned pair list in fake-chat.json.',
].join('\n');

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
  'The reply below was assembled by fake-chat.js from the canned corpus.',
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

function intentFor(matcherStage) {
  return INTENT_BY_MATCHER_STAGE[matcherStage] ?? 'UNKNOWN';
}

/** QUESTION vs NEW_REQUEST etc — a real (if simple) classification. */
function dialogueActFor(text) {
  const t = (text ?? '').trim();
  if (/^(yes|yeah|yep|sure|ok|okay|correct)\b/i.test(t)) return 'AFFIRM';
  if (/^(no|nope|nah|not really)\b/i.test(t)) return 'NEGATE';
  if (/^(hi|hey|hello|thanks|thank you|bye)\b/i.test(t)) return 'GREETING';
  if (/\b(reset|start over|clear)\b/i.test(t)) return 'RESET';
  if (/\?\s*$/.test(t)) return 'QUESTION';
  return 'NEW_REQUEST';
}

/** Parses the demo form flow's "form submitted: <name>, <country>, DOB: <dob>". */
function extractFormFields(text) {
  const raw     = String(text ?? '');
  const details = raw.slice(raw.indexOf(':') + 1).trim();
  const parts   = details.split(',').map((s) => s.trim());
  const dobPart = parts.find((p) => /^dob:/i.test(p));
  return {
    name:    parts[0] || null,
    country: parts[1] && !/^dob:/i.test(parts[1]) ? parts[1] : null,
    dob:     dobPart ? dobPart.replace(/^dob:\s*/i, '') : null,
  };
}

/** What the engine carries in `context` — here, the matcher's own facts. */
function matcherContext(trace) {
  const ctx = { matcherStage: trace.stage ?? 'unknown' };
  if (trace.matchedPhrase) ctx.matchedPhrase = trace.matchedPhrase;
  if (typeof trace.score === 'number') ctx.jaccardScore = Number(trace.score.toFixed(3));
  if (typeof trace.editDistance === 'number') ctx.editDistance = trace.editDistance;
  if (trace.prefix) ctx.enrichmentPrefix = trace.prefix;
  return ctx;
}

/**
 * Tracks what the engine's EngineSession tracks, so `_meta` can be rebuilt for
 * every row exactly as the real one is — including stepInfos, which accumulate
 * an entry per step as the pipeline advances.
 */
class SessionMirror {
  constructor({ conversationId, userText, inputParams }) {
    this.conversationId = conversationId ?? null;
    this.userText       = userText ?? '';
    this.inputParams    = inputParams ?? {};
    this.state          = 'UNKNOWN';
    this.intent         = 'UNKNOWN';
    this.context        = {};
    this.schemaJson     = {};
    this.stepInfos      = {};
    this.intentLocked   = false;
    this.lastLlmStage   = null;
    this.lastLlmOutput  = {};
    this.postIntentRule = false;
    this.schemaComplete = false;
    this.hasAnySchemaValue = false;
    this.intentLockReason  = null;
    this.missingRequiredFields = [];
    this.missingFieldOptions   = {};
    this.ruleExecutionOrigin   = null;
    this.ruleExecutionSource   = null;
    // Nanosecond clock, like the engine's startedAtNs/endedAtNs.
    this.baseNs = Date.now() * 1e6;
    this.ns     = this.baseNs;
  }

  tick(ms) {
    this.ns += ms * 1e6;
    return this.ns;
  }

  enterStep(step) {
    this.stepInfos[step] = {
      data:        {},
      status:      'IN_PROGRESS',
      outcome:     null,
      metadata:    { state: this.state, intent: this.intent },
      stepName:    step,
      endedAtNs:   null,
      errorType:   null,
      stepClass:   `${ENGINE_STEP_PACKAGE}.${step}`,
      durationMs:  null,
      determinant: 'STEP_ENTER',
      startedAtNs: this.ns,
      errorMessage: null,
    };
  }

  exitStep(step, durationMs) {
    const info = this.stepInfos[step];
    if (!info) return;
    info.status      = 'COMPLETED';
    info.outcome     = 'Continue';
    info.determinant = 'STEP_EXIT';
    info.durationMs  = durationMs;
    info.endedAtNs   = this.tick(durationMs);
    info.metadata    = { state: this.state, intent: this.intent };
  }

  sessionSnapshot() {
    return {
      state:          this.state,
      intent:         this.intent,
      context:        this.context,
      userText:       this.userText,
      stepInfos:      JSON.parse(JSON.stringify(this.stepInfos)),
      schemaJson:     this.schemaJson,
      intentLocked:   this.intentLocked,
      lastLlmStage:   this.lastLlmStage,
      containerData:  {},
      lastLlmOutput:  this.lastLlmOutput,
      conversationId: this.conversationId,
      postIntentRule: this.postIntentRule,
      schemaComplete: this.schemaComplete,
      standaloneQuery: null,
      hasContainerData: false,
      intentLockReason: this.intentLockReason,
      hasAnySchemaValue: this.hasAnySchemaValue,
      resolvedUserInput: this.userText,
      missingFieldOptions: this.missingFieldOptions,
      ruleExecutionOrigin: this.ruleExecutionOrigin,
      ruleExecutionSource: this.ruleExecutionSource,
      missingRequiredFields: this.missingRequiredFields,
      pendingClarificationQuestion: null,
    };
  }

  /** The envelope every real row carries. */
  meta(stage) {
    return {
      stage,
      state:   this.state,
      intent:  this.intent,
      session: this.sessionSnapshot(),
      emittedAt: new Date().toISOString().replace('Z', '000000Z'),
      contextDict: this.context,
      inputParams: {
        standalone_query:    null,
        resolved_user_input: this.userText,
      },
      conversationId: this.conversationId,
    };
  }
}

/* Rule payloads repeat across every RULE_* row, so they are built once here.
   Key names and casing are the engine's. */
function ruleTraceFields(session, { phase, origin, source }) {
  return {
    state:  session.state,
    intent: session.intent,
    rulePhase:           phase,
    ruleAgentPostTool:   false,
    ruleAgentPostIntent: phase === 'POST_CLASSIFIER_INTENT',
    ruleExecutionOrigin: origin,
    ruleExecutionSource: source,
    ruleToolPostExecution: false,
  };
}

/**
 * One turn's audit trail, in the order and shape the real engine writes it.
 *
 * @param {object} turn
 * @param {string} turn.conversationId
 * @param {string} turn.userText
 * @param {object} turn.trace        fake-chat.js matcher trace (stage, matchedPhrase, score…)
 * @param {*}      turn.agent        the payload being returned to the widget
 * @param {Array}  turn.files        decoded attachments, if any
 * @param {object} turn.inputParams
 * @returns {Array<{stage: string, payload: object|string}>}
 */
export function buildTurnAudit({
  conversationId = null,
  userText = '',
  trace = {},
  agent,
  files = [],
  inputParams = {},
}) {
  const matcherStage = trace.stage ?? 'unknown';
  const intent       = intentFor(matcherStage);
  const matched      = matcherStage !== 'random-fallback';
  const isJson       = typeof agent !== 'string';
  const outputFormat = isJson ? 'JSON' : 'TEXT';
  const output       = isJson ? JSON.stringify(agent) : agent;
  const dialogueAct  = dialogueActFor(userText);
  const context      = matcherContext(trace);
  const isForm       = matcherStage === 'form-submit-handler';

  const s    = new SessionMirror({ conversationId, userText, inputParams });
  const rows = [];
  const timings = {};

  /** Emits one audit row with the live `_meta` envelope. */
  const add = (stage, body = {}) => {
    rows.push({ stage, payload: { ...body, _meta: s.meta(stage) } });
  };

  /** Runs one pipeline step: STEP_ENTER, its stages, STEP_EXIT. */
  const step = (name, ms, emit) => {
    s.enterStep(name);
    add('STEP_ENTER', { step: name, stepClass: `${ENGINE_STEP_PACKAGE}.${name}` });
    if (emit) emit();
    s.exitStep(name, ms);
    timings[name] = ms;
    add('STEP_EXIT', {
      step:       name,
      outcome:    'Continue',
      stepClass:  `${ENGINE_STEP_PACKAGE}.${name}`,
      durationMs: ms,
    });
  };

  /** PROMPT_RENDERING — the engine emits one per template it renders. */
  const promptRendering = (templateDesc, rendered, vars) => {
    add('PROMPT_RENDERING', {
      promptVars: vars,
      rendered_template: rendered,
    });
  };

  step('LoadOrCreateConversationStep', 7);
  step('ResetConversationStep', 5);
  step('PersistConversationBootstrapStep', 6);

  step('AuditUserInputStep', 11, () => {
    add('USER_INPUT', { text: userText });
  });

  step('DialogueActStep', 61, () => {
    promptRendering('DialogueActStep SYSTEM_PROMPT', DIALOGUE_ACT_SYSTEM_PROMPT, { userText });
    promptRendering('DialogueActStep USER_PROMPT', userText, { userText });
    add('DIALOGUE_ACT_LLM_INPUT', {
      schema:        DIALOGUE_ACT_SCHEMA,
      user_prompt:   userText,
      system_prompt: DIALOGUE_ACT_SYSTEM_PROMPT,
    });
    const actJson = JSON.stringify({ dialogueAct, confidence: dialogueAct === 'NEW_REQUEST' ? 0.62 : 0.94 });
    s.lastLlmStage  = 'DIALOGUE_ACT';
    s.lastLlmOutput = { json: actJson };
    add('DIALOGUE_ACT_LLM_OUTPUT', { json: actJson });
    add('DIALOGUE_ACT_CLASSIFIED', {
      state:  s.state,
      intent: s.intent,
      userText,
      dialogueAct,
      dialogueActSource:      'LLM',
      dialogueActConfidence:  dialogueAct === 'NEW_REQUEST' ? 0.62 : 0.94,
      dialogueActResolveMode: 'LLM',
    });
    add('RULE_NO_MATCH (DialogueActStep)', ruleTraceFields(s, {
      phase: 'POST_DIALOGUE_ACT', origin: 'DialogueActStep', source: 'DialogueActStep',
    }));
  });

  step('InteractionPolicyStep', 10, () => {
    add('INTERACTION_POLICY_DECIDED', {
      state:  s.state,
      intent: s.intent,
      dialogueAct,
      hasPendingSlot:       false,
      policyDecision:       'PROCEED',
      hasPendingAction:     false,
      skipIntentResolution: false,
    });
  });

  step('ActionLifecycleStep', 6);
  step('CorrectionStep', 5);
  step('DisambiguationStep', 6);

  step('GuardrailStep', 13, () => {
    add('GUARDRAIL_ALLOW', {
      state:  s.state,
      intent: s.intent,
      result: 'ALLOW',
      sensitive:        false,
      approvalGranted:  false,
      approvalRequired: false,
    });
  });

  step('IntentResolutionStep', 112, () => {
    add('INTENT_RESOLVE_START', {
      intentLocked:     false,
      previousIntent:   null,
      intentLockReason: null,
    });

    if (matched) {
      // The demo's matcher IS a pattern classifier, so this is the classifier
      // branch: match, then the POST_CLASSIFIER_INTENT rule that sets state.
      add('INTENT_CLASSIFICATION_MATCHED', {
        state:  'ANSWERED',
        intent,
        matchedByRule: trace.matchedPhrase ?? matcherStage,
      });
      s.intent = intent;
      add('RULE_MATCH (IntentResolutionStep Classifier)', {
        ...ruleTraceFields(s, {
          phase: 'POST_CLASSIFIER_INTENT',
          origin: 'IntentResolutionStep Classifier',
          source: 'fake-chat.js matchResponse()',
        }),
        action:  'SET_STATE',
        ruleId:  matcherStage,
        context,
        ruleType:      'MATCHER',
        schemaJson:    {},
        ruleStateCode: 'UNKNOWN',
      });
      add('SET_STATE', {
        intent,
        ruleId:    matcherStage,
        context,
        toState:   'ANSWERED',
        fromState: 'UNKNOWN',
      });
      s.state = 'ANSWERED';
      s.postIntentRule = true;
      s.ruleExecutionOrigin = 'IntentResolutionStep Classifier';
      s.ruleExecutionSource = 'fake-chat.js matchResponse()';
      add('RULE_APPLIED (IntentResolutionStep Classifier)', {
        ...ruleTraceFields(s, {
          phase: 'POST_CLASSIFIER_INTENT',
          origin: 'IntentResolutionStep Classifier',
          source: 'fake-chat.js matchResponse()',
        }),
        type:        'MATCHER',
        action:      'SET_STATE',
        ruleId:      matcherStage,
        pattern:     trace.matchedPhrase ?? '.*',
        actionValue: 'ANSWERED',
        ruleStateCode: 'UNKNOWN',
      });
      add('INTENT_RESOLVED_BY_CLASSIFIER', {
        source:           'CLASSIFIER',
        agentIntent:      null,
        resolvedIntent:   intent,
        classifierIntent: intent,
      });
    }
    else {
      // No classifier match is exactly when the engine escalates to the intent
      // agent, so the agent's LLM pair belongs on this path and no other.
      add('INTENT_CLASSIFIER_NO_MATCH', { state: s.state, intent: s.intent, userText });
      promptRendering('AgentIntentResolver SYSTEM_PROMPT', INTENT_AGENT_SYSTEM_PROMPT, { userText });
      promptRendering('AgentIntentResolver USER_PROMPT', userText, { userText });
      add('INTENT_AGENT_LLM_INPUT', {
        userPrompt:   userText,
        systemPrompt: INTENT_AGENT_SYSTEM_PROMPT,
        // The engine's own key, verbatim — it names the ce_config row the
        // prompts came from. (Note the camelCase here vs system_prompt
        // elsewhere; that inconsistency is the engine's, mirrored on purpose.)
        'templateFromCeConfig (AgentIntentResolver)': 'USER_PROMPT, SYSTEM_PROMPT',
      });
      const agentJson = JSON.stringify({
        intent: null,
        state: 'IDLE',
        confidence: 0,
        needsClarification: true,
        clarificationResolved: false,
        clarificationQuestion: 'Could you rephrase that? I did not find a close match.',
        intentScores: [],
        followups: [],
      });
      s.lastLlmStage  = 'INTENT_AGENT';
      s.lastLlmOutput = { json: agentJson };
      add('INTENT_AGENT_LLM_OUTPUT', { json: agentJson });
      add('INTENT_AGENT_SCORES', { scores: [], followups: [] });
      add('INTENT_AGENT_REJECTED', {
        state: s.state, intent: s.intent, confidence: 0, reason: 'confidence below MIN_CONFIDENCE',
      });
      add('INTENT_RESOLVE_NO_CHANGE', { state: s.state, intent: s.intent });
    }
  });

  step('PolicyEnforcementStep', 6);
  step('ResetResolvedIntentStep', 6);
  step('FallbackIntentStateStep', 5);

  step('AddContainerDataStep', 11, () => {
    add('CONTAINER_DATA_SKIPPED', {
      state:  s.state,
      intent: s.intent,
      reason: 'No container config bound to this intent',
    });
  });

  step('SchemaExtractionStep', isForm ? 80 : 9, () => {
    // The demo has exactly one slot-collection flow — the form demo. That is
    // the only turn where extraction genuinely happens, so it is the only one
    // that emits the LLM pair, the same way the engine only emits it when a
    // schema is bound to the intent/state.
    if (!isForm) return;
    const fields = extractFormFields(userText);
    const schema = JSON.stringify({
      type: 'object',
      properties: { name: { type: 'string' }, country: { type: 'string' }, dob: { type: 'string' } },
      required: ['name'],
    });
    add('SCHEMA_EXTRACTION_START', { schemaId: 'demo-form' });
    promptRendering('SchemaExtraction SYSTEM_PROMPT', SCHEMA_EXTRACTION_SYSTEM_PROMPT, { userText });
    promptRendering('SchemaExtraction USER_PROMPT', userText, { userText });
    add('SCHEMA_EXTRACTION_LLM_INPUT', {
      schema,
      userInput:     userText,
      user_prompt:   userText,
      system_prompt: SCHEMA_EXTRACTION_SYSTEM_PROMPT,
    });
    const extracted = JSON.stringify(fields);
    s.lastLlmStage  = 'SCHEMA_EXTRACTION';
    s.lastLlmOutput = { json: extracted };
    add('SCHEMA_EXTRACTION_LLM_OUTPUT', { json: extracted });

    s.schemaJson = fields;
    s.hasAnySchemaValue = Object.values(fields).some(Boolean);
    s.schemaComplete = Boolean(fields.name);
    s.missingRequiredFields = fields.name ? [] : ['name'];
    add('SCHEMA_STATUS', {
      state:  s.state,
      intent: s.intent,
      context,
      schemaId:   'demo-form',
      schemaJson: fields,
      intentLocked:     s.intentLocked,
      schemaComplete:   s.schemaComplete,
      intentLockReason: s.intentLockReason,
      hasAnySchemaValue: s.hasAnySchemaValue,
      missingFieldOptions:   {},
      missingRequiredFields: s.missingRequiredFields,
    });
    add('RULE_NO_MATCH (SchemaExtractionStep)', ruleTraceFields(s, {
      phase: 'POST_SCHEMA_EXTRACTION', origin: 'SchemaExtractionStep', source: 'SchemaExtractionStep',
    }));
  });

  step('AutoAdvanceStep', 11, () => {
    if (isForm) {
      add('AUTO_ADVANCE_FACTS', {
        state:  s.state,
        intent: s.intent,
        schemaComplete:    s.schemaComplete,
        hasAnySchemaValue: s.hasAnySchemaValue,
      });
    }
    else {
      add('AUTO_ADVANCE_SKIPPED_NO_SCHEMA', { state: s.state, intent: s.intent });
    }
  });

  step('PendingActionStep', 6);
  step('ToolOrchestrationStep', 6);

  step('AgentToolStep', files.length ? 40 : 20, () => {
    add('RULE_NO_MATCH (AgentToolStep PreAgent)', ruleTraceFields(s, {
      phase: 'PRE_AGENT', origin: 'AgentToolStep PreAgent', source: 'AgentToolStep',
    }));
    if (!files.length) {
      add('AGENT_NO_TOOLS_AVAILABLE', { state: s.state, intent: s.intent });
      return;
    }
    // Decoding an upload is the one thing this demo does that is a tool call.
    promptRendering('AgentPlanner SYSTEM_PROMPT', AGENT_PLANNER_SYSTEM_PROMPT, { userText });
    add('AGENT_PLAN_LLM_INPUT', {
      'templateFromCeConfig (AgentPlanner)': 'AGENT_PLANNER_PROMPT',
      system_prompt: AGENT_PLANNER_SYSTEM_PROMPT,
      user_prompt:   userText || '(no text — files only)',
      schema:        JSON.stringify({ type: 'object', properties: { action: { type: 'string' }, tool_code: { type: 'string' } }, required: ['action'] }),
      agent_observations_compacted:   false,
      agent_observations_raw_chars:   0,
      agent_observations_final_chars: 0,
    });
    const planJson = JSON.stringify({
      action: 'CALL_TOOL',
      tool_code: 'attachment_decoder',
      args: { files: files.map((f) => f.name) },
    });
    s.lastLlmStage  = 'AGENT_PLAN';
    s.lastLlmOutput = { json: planJson };
    add('AGENT_PLAN_LLM_OUTPUT', { json: planJson });
    add('AGENT_TOOL_CALL', {
      tool_code: 'attachment_decoder',
      args:      { files: files.map((f) => f.name) },
      action:    'CALL_TOOL',
      intent:    s.intent,
      state:     s.state,
      routingDecision:          'AGENT',
      observation_count:        0,
      current_observation_tool: 'FLOW_START',
    });
    add('AGENT_TOOL_RESULT', {
      tool_code:  'attachment_decoder',
      tool_group: 'LOCAL',
      rows:       JSON.stringify(files),
    });
  });

  step('RulesStep', 18, () => {
    add('RULE_NO_MATCH (RulesStep)', {
      ...ruleTraceFields(s, { phase: 'MAIN', origin: 'RulesStep', source: 'RulesStep' }),
      type:    'REGEX',
      action:  null,
      reason:  'no rule matched intent/state',
      ruleId:  null,
      pattern: null,
      ruleDbPhase:    null,
      ruleStateCode:  null,
      evaluatedState: s.state,
    });
  });

  step('StateGraphStep', 6);

  step('ResponseResolutionStep', 95, () => {
    add('RESOLVE_RESPONSE', {
      state:      s.state,
      intent:     s.intent,
      responseId: `demo-${matcherStage}`,
    });
    add('RESOLVE_RESPONSE_SELECTED', {
      intent:       s.intent,
      resolver:     'FakeChatOutputFormatResolver',
      templateId:   null,
      outputFormat,
      templateDesc: 'fake-chat canned corpus',
    });
    // A DERIVED response is the one a deployment renders with a model; an EXACT
    // canned string is not. So the response LLM pair rides with the JSON/derived
    // payloads and is absent for a flat canned string — as in the engine.
    if (isJson) {
      promptRendering('Response SYSTEM_PROMPT', RESPONSE_SYSTEM_PROMPT, { intent: s.intent, userText });
      promptRendering('Response USER_PROMPT', userText, { intent: s.intent, userText });
      add('RESOLVE_RESPONSE_LLM_INPUT', {
        session:         s.sessionSnapshot(),
        user_prompt:     userText,
        system_prompt:   RESPONSE_SYSTEM_PROMPT,
        derivation_hint: `Render as ${outputFormat} for intent ${s.intent}.`,
      });
      s.lastLlmStage  = 'RESPONSE_TEXT';
      s.lastLlmOutput = { output };
      add('RESOLVE_RESPONSE_LLM_OUTPUT', { output });
    }
    else {
      add('RESPONSE_EXACT', { state: s.state, intent: s.intent, responseId: `demo-${matcherStage}` });
    }
    add('ASSISTANT_OUTPUT', {
      state:  s.state,
      intent: s.intent,
      output,
      context,
      responseId:   `demo-${matcherStage}`,
      schemaJson:   s.schemaJson,
      outputFormat,
      responseType: isJson ? 'DERIVED' : 'EXACT',
    });
  });

  step('PostResponseRulesStep', 13, () => {
    add('RULE_NO_MATCH (PostResponseRulesStep)', ruleTraceFields(s, {
      phase: 'POST_RESPONSE', origin: 'PostResponseRulesStep', source: 'PostResponseRulesStep',
    }));
  });

  step('MemoryStep', 14, () => {
    const summary = `intent=${s.intent}, state=${s.state}, user=${userText}`;
    add('MEMORY_UPDATED', {
      state:    s.state,
      intent:   s.intent,
      stores:   ['session_summary'],
      recalled: 0,
      summaryChars: summary.length,
    });
  });

  step('PersistConversationStep', 35, () => {
    add('ENGINE_RETURN', {
      state:  s.state,
      intent: s.intent,
      final_result: {
        intent:  s.intent,
        state:   s.state,
        payload: isJson ? { type: 'JSON', json: output } : { type: 'TEXT', text: output },
        contextJson: JSON.stringify(context),
      },
    });
  });

  step('PipelineEndGuardStep', 27, () => {
    // PipelineEndGuardStep hands AuditService a pre-encoded JSON string rather
    // than a map — but the stored row still carries _meta, because the
    // enrichment layer parses the string and injects the envelope either way.
    // Verified against the capture: 98 of 98 rows have _meta, this one included.
    const totalMs = Object.values(timings).reduce((a, b) => a + b, 0);
    add('PIPELINE_TIMING', {
      totalMs,
      steps: Object.entries(timings).map(([name, ms]) => `${name}=${ms}ms`).join(', '),
    });
  });

  return rows;
}

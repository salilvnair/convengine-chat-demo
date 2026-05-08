'use client';

import { useState, useEffect } from 'react';
import { CodeBlock }        from './ui/CodeBlock.jsx';
import { JsonEditorField }  from './ui/JsonEditorField.jsx';
import { Toggle }           from './ui/Toggle.jsx';
import { scrollToConfigProp } from './ui/BackToTop.jsx';
import { ColorPicker }      from './ColorPicker.jsx';
import { ColorGrid }        from './ColorSection.jsx';
import { IconGrid, DEFAULT_ICON_SVGS, ICON_META } from './IconSection.jsx';

function buildEnrichmentSnippet(enrich) {
  if (!enrich || enrich.mode === 'none') return null;
  const { mode, prefix, postfix, props = {} } = enrich;
  const propEntries = Object.entries(props).filter(([, v]) => String(v).trim() !== '');
  if (mode === 'text') {
    if (!prefix && !postfix) return null;
    const lines = ['    messageEnrichment: {', `      mode: "text",`];
    if (prefix)  lines.push(`      prefix: ${JSON.stringify(prefix)},`);
    if (postfix) lines.push(`      postfix: ${JSON.stringify(postfix)},`);
    lines.push('    },');
    return lines.join('\n');
  }
  if (mode === 'json') {
    const lines = ['    messageEnrichment: {', `      mode: "json",`];
    if (prefix)  lines.push(`      prefix: ${JSON.stringify(prefix)},`);
    if (postfix) lines.push(`      postfix: ${JSON.stringify(postfix)},`);
    if (propEntries.length) {
      lines.push('      props: {');
      propEntries.forEach(([k, v]) => lines.push(`        ${k}: ${JSON.stringify(v)},`));
      lines.push('      },');
    }
    lines.push('    },');
    return lines.join('\n');
  }
  return null;
}

function buildGeneratedCode(settings, iconSvgs) {
  const m    = settings.chatMode;
  const mode = m === 'fullscreen' ? 'fullscreen' : m.startsWith('sidepanel') ? 'sidepanel' : 'panel';
  const align = m.startsWith('sidepanel') ? `\n  align="${m === 'sidepanel-left' ? 'left' : 'right'}"` : '';

  const COLOR_KEYS = [
    'bubbleUserBg','bubbleUserText','bubbleAgentBg','bubbleAgentText',
    'panelBg','composerBg','iconColor',
    'userIconBg','userIconColor','agentIconBg','agentIconColor',
    'timeLabelBg','timeLabelColor','timeLabelBorderColor',
    'dateLabelBg','dateLabelColor','dateLabelBorderColor',
  ];

  const lines = [
    `    apiHost: "http://localhost:8080",`,
    `    showFeedback: ${settings.showFeedback},`,
    `    showAudit: ${settings.showAudit},`,
    `    showEngineStatus: ${settings.showEngineStatus ?? true},`,
    `    showDarkModeLightMode: ${settings.showDarkModeLightMode},`,
    settings.title       !== 'ConvEngine Assistant'                           ? `    title: "${settings.title}",`       : null,
    settings.subtitle    !== "Ask me anything \u2014 I'll do my best to help." ? `    subtitle: "${settings.subtitle}",` : null,
    settings.placeholder !== 'Ask ConvEngine\u2026'                           ? `    placeholder: "${settings.placeholder}",` : null,
    !settings.showHeaderDot       ? `    showHeaderDot: false,`       : null,
    !settings.showLandingAvatar   ? `    showLandingAvatar: false,`   : null,
    !settings.showLandingSubtitle ? `    showLandingSubtitle: false,` : null,
    !settings.showNewChat         ? `    showNewChat: false,`         : null,
    !settings.showLayoutPicker    ? `    showLayoutPicker: false,`    : null,
    !settings.showMaximize        ? `    showMaximize: false,`        : null,
    !settings.showMinimize        ? `    showMinimize: false,`        : null,
    settings.composerShape === 'rect' ? `    composerShape: 'rect',`  : null,
    // Time & Date
    settings.showBubbleTime   ? `    showBubbleTime: true,`    : null,
    (settings.showBubbleTime && settings.bubbleTimeFormat && settings.bubbleTimeFormat !== 'h:mm A')
      ? `    bubbleTimeFormat: "${settings.bubbleTimeFormat}",` : null,
    settings.showDateSeparators ? `    showDateSeparators: true,` : null,
    (settings.showDateSeparators && settings.dateSeparatorFormat && settings.dateSeparatorFormat !== 'auto')
      ? `    dateSeparatorFormat: "${settings.dateSeparatorFormat}",` : null,
    (settings.showDateSeparators && settings.dateSeparatorShape && settings.dateSeparatorShape !== 'round')
      ? `    dateSeparatorShape: "${settings.dateSeparatorShape}",` : null,
    // Colors
    ...COLOR_KEYS.map((key) => {
      const v = settings[key];
      const l = v?.light?.trim(); const d = v?.dark?.trim();
      if (!l && !d) return null;
      const ser = (l && d) ? `{ light: "${l}", dark: "${d}" }` : l ? `"${l}"` : `{ dark: "${d}" }`;
      return `    ${key}: ${ser},`;
    }),
  ].filter(Boolean);

  // Icons
  const changedIcons = Object.keys(ICON_META).filter(k => iconSvgs[k] !== DEFAULT_ICON_SVGS[k]);
  if (changedIcons.length) {
    lines.push(`    icons: {`);
    changedIcons.forEach(k => {
      lines.push(`      // custom ${k} \u2014 replace with your React component`);
      lines.push(`      ${k}: My${k},`);
    });
    lines.push(`    },`);
  }

  // Enrichment
  const enrichSnippet = buildEnrichmentSnippet(settings.messageEnrichment);
  if (enrichSnippet) lines.push(enrichSnippet);

  // Stream
  if (settings.streamEnabled)       lines.push(`    stream: { enabled: true, transport: "${settings.streamTransport ?? 'sse'}" },`);
  if (settings.showTransportBadge)  lines.push(`    showTransportBadge: true,`);

  // Debug flags (only when non-default)
  if (settings.debugShowVerbose)          lines.push(`    debugShowVerbose: true,`);
  if (settings.debugShowPayload)          lines.push(`    debugShowPayload: true,`);
  if (settings.debugShowRenderer)         lines.push(`    debugShowRenderer: true,`);
  if (settings.debugShowTimestamps)       lines.push(`    debugShowTimestamps: true,`);
  if (settings.debugShowMessageId)        lines.push(`    debugShowMessageId: true,`);
  if ((settings.debugSimulateDelay ?? 0) > 0) lines.push(`    debugSimulateDelay: ${settings.debugSimulateDelay},`);
  if (settings.debugSimulateError)        lines.push(`    debugSimulateError: true,`);
  if (settings.debugHighlightRenderers)   lines.push(`    debugHighlightRenderers: true,`);
  if (settings.debugDisableAnimations)    lines.push(`    debugDisableAnimations: true,`);

  // Chips — emit only if at least one chip is defined
  const validChips = (settings.landingChips ?? []).filter(c =>
    typeof c === 'string' ? c.trim() : (c?.chipText?.trim() || c?.chatText?.trim())
  );
  if (validChips.length) {
    const isStringArr = validChips.every(c => typeof c === 'string');
    if (isStringArr) {
      lines.push(`    landingChips: ${JSON.stringify(validChips)},`);
    } else {
      lines.push(`    landingChips: [`);
      validChips.forEach(c => lines.push(`      { chipText: ${JSON.stringify(c.chipText ?? '')}, chatText: ${JSON.stringify(c.chatText ?? '')} },`));
      lines.push(`    ],`);
    }
    if ((settings.landingChipsOrientation ?? 'row') !== 'row')                lines.push(`    landingChipsOrientation: "${settings.landingChipsOrientation}",`);
    if ((settings.landingChipsShape ?? 'round') !== 'round')                   lines.push(`    landingChipsShape: "${settings.landingChipsShape}",`);
    if ((settings.landingChipsAnchor ?? 'landingAgent') !== 'landingAgent')    lines.push(`    landingChipsAnchor: "${settings.landingChipsAnchor}",`);
    if (settings.landingChipsAnchorPadding !== '' && settings.landingChipsAnchorPadding != null) {
      const _unit = settings.landingChipsAnchorPaddingUnit ?? 'px';
      const _val  = settings.landingChipsAnchorPadding;
      lines.push(`    landingChipsAnchorPadding: "${_val}${_unit}",`);
    }
  }

  return `<ConvEngineChat\n  mode="${mode}"${align}\n  config={{\n${lines.join('\n')}\n  }}\n  theme={{ "color-accent": "${settings.accentColor}" }}\n/>`;
}

function MessageEnrichmentSection({ enrich, onChange, accentColor }) {
  const { mode, prefix, postfix, props = {} } = enrich;

  const [propsJson, setPropsJson] = useState(() => JSON.stringify(props, null, 2));

  // Reset editor when mode is cleared to none
  useEffect(() => {
    if (mode === 'none') { setPropsJson('{}'); }
  }, [mode]);

  const btnBase = 'px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all';
  const activeStyle = { backgroundColor: accentColor, borderColor: accentColor };

  function setMode(m) {
    onChange({ ...enrich, mode: m });
    if (m === 'none') { setPropsJson('{}'); }
  }

  function handlePropsChange(raw) {
    setPropsJson(raw);
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        onChange({ ...enrich, props: parsed });
      }
    } catch { /* editor shows its own error */ }
  }

  // For the preview
  const safeProps = props;

  const textFields = [
    { key: 'prefix',  label: 'Prefix',  hint: 'messageEnrichment.prefix',  placeholder: 'e.g. /faq ' },
    { key: 'postfix', label: 'Postfix', hint: 'messageEnrichment.postfix', placeholder: 'e.g.  [END]' },
  ];

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Message Enrichment</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
          Prefix/postfix are sent to the backend only — invisible in chat UI, visible in audit panel.
        </p>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'none', label: '— None' },
          { id: 'text', label: 'T  Text mode' },
          { id: 'json', label: '{ }  JSON mode' },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setMode(id)}
            className={`${btnBase} ${mode === id ? 'text-white shadow-md' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            style={mode === id ? activeStyle : {}}
          >{label}</button>
        ))}
      </div>

      {mode !== 'none' && (
        <div className="rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-700/40 p-4 space-y-3">

          {/* Prefix + Postfix — stacked label/hint above input to avoid overflow */}
          {textFields.map(({ key, label, hint, placeholder }) => (
            <div key={key} className="space-y-1">
              <div className="flex items-baseline gap-2">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</p>
                <p className="text-[10px] text-slate-400 font-mono">config.{hint}</p>
              </div>
              <input
                type="text"
                value={enrich[key] ?? ''}
                placeholder={placeholder}
                onChange={(e) => onChange({ ...enrich, [key]: e.target.value })}
                className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 font-mono bg-white dark:bg-slate-700 dark:text-slate-100 bg-white"
              />
            </div>
          ))}

          {/* JSON mode — CodeMirror editor for props */}
          {mode === 'json' && (
            <div className="space-y-1.5">
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Additional props</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">config.messageEnrichment.props</p>
              </div>
              <JsonEditorField
                value={propsJson}
                onChange={handlePropsChange}
                placeholder={'{\n  "context": "dashboard",\n  "userId": "u_123"\n}'}
                minHeight="120px"
              />
            </div>
          )}

          {/* Preview banner */}
          <div className="rounded-lg bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-600 px-3 py-2 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {mode === 'text' ? 'Reaches backend — message string' : 'Reaches backend — inputParams object'}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5">
                <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="6" cy="6" r="5"/><path d="M6 4v3M6 8.5v.5"/>
                </svg>
                invisible in UI · audit panel only
              </span>
            </div>
            {mode === 'text' ? (
              <code className="block text-xs text-indigo-600 break-all">
                &quot;{prefix.trim() ? prefix.trim() + '\u00a0' : ''}<span className="text-slate-400 italic">&lt;user text&gt;</span>{postfix.trim() ? '\u00a0' + postfix.trim() : ''}&quot;
              </code>
            ) : (
              <code className="block text-xs text-indigo-600 whitespace-pre-wrap break-all">
                {JSON.stringify(
                  { prefix: prefix || '', userText: '<user text>', postfix: postfix || '', ...safeProps },
                  null, 2,
                )}
              </code>
            )}
            <p className="text-[10px] text-slate-400">
              User bubble shows: <span className="font-mono italic">&ldquo;&lt;user text&gt;&rdquo;</span> — original text, no enrichment.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}

function LandingChipsSection({ settings, onChange }) {
  const { accentColor } = settings;
  const chips         = settings.landingChips          ?? [];
  const orientation   = settings.landingChipsOrientation  ?? 'row';
  const shape         = settings.landingChipsShape        ?? 'round';
  const anchor        = settings.landingChipsAnchor       ?? 'landingAgent';
  const anchorPadding     = settings.landingChipsAnchorPadding     ?? '';
  const anchorPaddingUnit = settings.landingChipsAnchorPaddingUnit ?? 'px';

  // Draft state for the new-chip input row
  const [draft, setDraft] = useState({ mode: 'string', text: '', chipText: '', chatText: '' });

  function addStringChip() {
    const t = draft.text.trim();
    if (!t) return;
    onChange({ ...settings, landingChips: [...chips, t] });
    setDraft({ ...draft, text: '' });
  }

  function addObjectChip() {
    const ct = draft.chipText.trim(); const msg = draft.chatText.trim();
    if (!ct) return;
    onChange({ ...settings, landingChips: [...chips, { chipText: ct, chatText: msg || ct }] });
    setDraft({ ...draft, chipText: '', chatText: '' });
  }

  function removeChip(i) {
    const next = chips.filter((_, idx) => idx !== i);
    onChange({ ...settings, landingChips: next });
  }

  function handleKeyDown(e, add) { if (e.key === 'Enter') { e.preventDefault(); add(); } }

  const btnBase = 'px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all';
  const active  = (id) => ({ className: `${btnBase} text-white shadow-md`, style: { backgroundColor: accentColor, borderColor: accentColor }, 'data-active': true });
  const inact   = (id) => ({ className: `${btnBase} border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700` });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Landing Chips</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
          Suggestion chips shown below the landing avatar. Click sends the text as a user message.
        </p>
      </div>

      {/* Mode toggle: string vs object */}
      <div className="flex gap-2">
        {[{ id: 'string', label: 'A  Plain text' }, { id: 'object', label: '{ }  Label / message' }].map(({ id, label }) => {
          const isActive = draft.mode === id;
          return (
            <button key={id}
              onClick={() => setDraft({ ...draft, mode: id })}
              {...(isActive ? active(id) : inact(id))}
            >{label}</button>
          );
        })}
      </div>

      {/* Input row */}
      {draft.mode === 'string' ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={draft.text}
            placeholder='e.g. "Show recent data"'
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
            onKeyDown={(e) => handleKeyDown(e, addStringChip)}
            className="flex-1 text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 font-mono bg-white dark:bg-slate-700 dark:text-slate-100"
          />
          <button
            onClick={addStringChip}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border text-white transition-all"
            style={{ backgroundColor: accentColor, borderColor: accentColor }}
          >+ Add</button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <p className="text-[10px] text-slate-400 font-mono">chipText (label)</p>
              <input
                type="text"
                value={draft.chipText}
                placeholder='e.g. "Show recent Data"'
                onChange={(e) => setDraft({ ...draft, chipText: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, addObjectChip)}
                className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 font-mono bg-white dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-[10px] text-slate-400 font-mono">chatText (sent message)</p>
              <input
                type="text"
                value={draft.chatText}
                placeholder='e.g. "Show recent data of user …"'
                onChange={(e) => setDraft({ ...draft, chatText: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, addObjectChip)}
                className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 font-mono bg-white dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
          </div>
          <button
            onClick={addObjectChip}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border text-white transition-all"
            style={{ backgroundColor: accentColor, borderColor: accentColor }}
          >+ Add chip</button>
        </div>
      )}

      {/* Chip list */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700">
          {chips.map((chip, i) => {
            const label   = typeof chip === 'string' ? chip : chip.chipText;
            const message = typeof chip === 'string' ? chip : chip.chatText;
            const isObj   = typeof chip === 'object';
            return (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium"
                style={{ borderColor: `${accentColor}55`, backgroundColor: `${accentColor}12`, color: accentColor }}>
                <span>{label}</span>
                {isObj && message !== label && (
                  <span className="text-[9px] opacity-60 font-mono truncate max-w-[80px]">→ {message}</span>
                )}
                <button type="button" onClick={() => removeChip(i)}
                  className="ml-0.5 text-slate-400 hover:text-red-500 transition-colors leading-none" aria-label="Remove chip"
                >×</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Orientation, shape & anchor */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-400 font-mono">config.landingChipsOrientation</p>
          <div className="flex gap-2">
            {[{ id: 'row', label: '⇢ Row' }, { id: 'column', label: '↓ Column' }].map(({ id, label }) => {
              const isActive = orientation === id;
              return (
                <button key={id}
                  onClick={() => onChange({ ...settings, landingChipsOrientation: id })}
                  className={`px-3 py-1 text-xs font-bold border transition-all rounded-lg ${isActive ? 'text-white shadow-sm' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  style={isActive ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                >{label}</button>
              );
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-400 font-mono">config.landingChipsShape</p>
          <div className="flex gap-2">
            {[{ id: 'round', label: 'Round' }, { id: 'rect', label: 'Rect' }].map(({ id, label }) => {
              const isActive = shape === id;
              return (
                <button key={id}
                  onClick={() => onChange({ ...settings, landingChipsShape: id })}
                  className={`px-3 py-1 text-xs font-bold border transition-all ${id === 'round' ? 'rounded-full' : 'rounded'} ${isActive ? 'text-white shadow-sm' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  style={isActive ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                >{label}</button>
              );
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-400 font-mono">config.landingChipsAnchor</p>
          <div className="flex gap-2">
            {[
              { id: 'landingAgent', label: '↑ Agent',   title: 'Below the landing avatar (classic)' },
              { id: 'chatbox',      label: '↓ Chatbox', title: 'Above the composer, bottom→top (ChatGPT style)' },
            ].map(({ id, label, title }) => {
              const isActive = anchor === id;
              return (
                <button key={id}
                  onClick={() => onChange({ ...settings, landingChipsAnchor: id })}
                  title={title}
                  className={`px-3 py-1 text-xs font-bold border transition-all rounded-lg ${isActive ? 'text-white shadow-sm' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  style={isActive ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                >{label}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Anchor padding */}
      <div className="space-y-1.5">
        <p className="text-[10px] text-slate-400 font-mono">config.landingChipsAnchorPadding</p>
        <p className="text-[10px] text-slate-400">Gap between the anchor and chips. Leave blank for default (8px).</p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={anchorPadding}
            placeholder="8"
            onChange={(e) => onChange({ ...settings, landingChipsAnchorPadding: e.target.value })}
            className="w-20 text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 font-mono bg-white dark:bg-slate-700 dark:text-slate-100"
          />
          {/* iPhone-style unit pill toggle */}
          <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-0.5 gap-0.5">
            {['px', 'rem', 'em'].map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => onChange({ ...settings, landingChipsAnchorPaddingUnit: unit })}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all select-none ${
                  anchorPaddingUnit === unit
                    ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-500'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
          {anchorPadding !== '' && (
            <button onClick={() => onChange({ ...settings, landingChipsAnchorPadding: '', landingChipsAnchorPaddingUnit: 'px' })}
              className="text-[10px] text-slate-400 hover:text-red-500 transition-colors">reset</button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PlaygroundPanel({ settings, onChange, iconSvgs, onIconChange, onIconReset }) {
  const generatedCode = buildGeneratedCode(settings, iconSvgs);
  const [stickyCode, setStickyCode] = useState(false);
  const normalizedMode = settings.chatMode === 'fullscreen' ? 'fullscreen'
    : settings.chatMode?.startsWith('sidepanel') ? 'sidepanel' : 'panel';
  const showFor = (...modes) => modes.includes(normalizedMode);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="px-6 py-4 rounded-t-2xl" style={{ background: `linear-gradient(135deg, ${settings.accentColor} 0%, ${settings.accentColor}cc 100%)` }}>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>🎛️</span> Live Config Playground
        </h3>
        <p className="text-xs text-white/75 mt-0.5">Toggle settings below — the chat widget updates instantly.</p>
      </div>

      {/* Generated Usage */}
      <div className={`${stickyCode ? 'sticky top-14 z-20 shadow-sm' : ''} bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-700 px-5 py-3`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Generated Usage</p>
          <button
            type="button"
            onClick={() => setStickyCode((v) => !v)}
            className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all select-none ${
              stickyCode
                ? 'text-white'
                : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            style={stickyCode ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
          >
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="currentColor">
              <path d="M3 1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3.586l1.707 1.707A1 1 0 0 1 10 8H8v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2a1 1 0 0 1-.707-1.707L3 4.586V1z"/>
            </svg>
            Stick on top
          </button>
        </div>
        <CodeBlock lang="jsx" code={generatedCode} />
      </div>

      <div className="p-5 space-y-6">
        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Toggle checked={settings.showFeedback}             onChange={(v) => onChange({ ...settings, showFeedback: v })}             label="Show Feedback (👍👎)"   hint="config.showFeedback"          modes={['panel','sidepanel','fullscreen']} accentColor={settings.accentColor} onLabelClick={() => scrollToConfigProp('showFeedback')} />
          <Toggle checked={settings.showAudit}                onChange={(v) => onChange({ ...settings, showAudit: v })}                label="Show Audit Trail"       hint="config.showAudit"             modes={['fullscreen']}                    accentColor={settings.accentColor} onLabelClick={() => scrollToConfigProp('showAudit')} />
          <Toggle checked={settings.showEngineStatus ?? true} onChange={(v) => onChange({ ...settings, showEngineStatus: v })}         label="Engine Status Bar"      hint="config.showEngineStatus"      modes={['fullscreen','sidepanel']}         accentColor={settings.accentColor} onLabelClick={() => scrollToConfigProp('showEngineStatus')} />
          <Toggle checked={settings.showDarkModeLightMode}    onChange={(v) => onChange({ ...settings, showDarkModeLightMode: v })}    label="Dark/Light Mode Toggle" hint="config.showDarkModeLightMode" modes={['panel','sidepanel','fullscreen']} accentColor={settings.accentColor} onLabelClick={() => scrollToConfigProp('showDarkModeLightMode')} />
          <Toggle checked={settings.showHeaderDot}            onChange={(v) => onChange({ ...settings, showHeaderDot: v })}            label="Header Dot"             hint="config.showHeaderDot"         modes={['panel','sidepanel','fullscreen']} accentColor={settings.accentColor} onLabelClick={() => scrollToConfigProp('showHeaderDot')} />
          <Toggle checked={settings.showLandingAvatar}        onChange={(v) => onChange({ ...settings, showLandingAvatar: v })}        label="Landing Avatar"         hint="config.showLandingAvatar"     modes={['panel','sidepanel','fullscreen']} accentColor={settings.accentColor} onLabelClick={() => scrollToConfigProp('showLandingAvatar')} />
          <Toggle checked={settings.showLandingSubtitle}      onChange={(v) => onChange({ ...settings, showLandingSubtitle: v })}      label="Landing Subtitle"       hint="config.showLandingSubtitle"   modes={['panel','sidepanel','fullscreen']} accentColor={settings.accentColor} onLabelClick={() => scrollToConfigProp('showLandingSubtitle')} />
          {showFor('panel','fullscreen') && <Toggle checked={settings.showNewChat}       onChange={(v) => onChange({ ...settings, showNewChat: v })}       label="New Chat Button"    hint="config.showNewChat"      modes={['panel','fullscreen']} accentColor={settings.accentColor} onLabelClick={() => scrollToConfigProp('showNewChat')} />}
          {showFor('panel') && <Toggle checked={settings.showLayoutPicker} onChange={(v) => onChange({ ...settings, showLayoutPicker: v })}  label="Chat View Switcher" hint="config.showLayoutPicker" modes={['panel']} accentColor={settings.accentColor} onLabelClick={() => scrollToConfigProp('showLayoutPicker')} />}
          {showFor('panel') && <Toggle checked={settings.showMaximize}     onChange={(v) => onChange({ ...settings, showMaximize: v })}      label="Expand to Center"   hint="config.showMaximize"     modes={['panel']} accentColor={settings.accentColor} onLabelClick={() => scrollToConfigProp('showMaximize')} />}
          {showFor('panel') && <Toggle checked={settings.showMinimize}     onChange={(v) => onChange({ ...settings, showMinimize: v })}      label="Minimize Button"    hint="config.showMinimize"     modes={['panel']} accentColor={settings.accentColor} onLabelClick={() => scrollToConfigProp('showMinimize')} />}
          <Toggle checked={settings.showTransportBadge ?? false} onChange={(v) => onChange({ ...settings, showTransportBadge: v })} label="Transport Badge in Header" hint="config.showTransportBadge" modes={['panel','sidepanel','fullscreen']} accentColor={settings.accentColor} onLabelClick={() => scrollToConfigProp('showTransportBadge')} />
        </div>

        <hr className="border-slate-100 dark:border-slate-700" />

        {/* Timestamps & Dates */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timestamps &amp; Dates</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Time captions below bubbles and sticky date chips between day groups.</p>
          </div>
          <Toggle
            label="Show time below bubbles"
            hint="config.showBubbleTime"
            checked={settings.showBubbleTime ?? false}
            onChange={(v) => onChange({ ...settings, showBubbleTime: v })}
            accentColor={settings.accentColor}
            modes={['panel','sidepanel','fullscreen']}
            onLabelClick={() => scrollToConfigProp('showBubbleTime')}
          />
          {settings.showBubbleTime && (
            <div className="pl-1 space-y-1">
              <p className="text-[10px] text-slate-400 font-mono">config.bubbleTimeFormat</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'h:mm A',    label: '12:14 PM' },
                  { id: 'HH:mm',     label: '14:14' },
                  { id: 'h:mm:ss A', label: '12:14:05 PM' },
                ].map(({ id, label }) => {
                  const active = (settings.bubbleTimeFormat ?? 'h:mm A') === id;
                  return (
                    <button key={id}
                      onClick={() => onChange({ ...settings, bubbleTimeFormat: id })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${active ? 'text-white shadow-sm' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                      style={active ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
                    >{label}</button>
                  );
                })}
              </div>
            </div>
          )}
          <Toggle
            label="Show date separator chips"
            hint="config.showDateSeparators"
            checked={settings.showDateSeparators ?? false}
            onChange={(v) => onChange({ ...settings, showDateSeparators: v })}
            accentColor={settings.accentColor}
            modes={['panel','sidepanel','fullscreen']}
            onLabelClick={() => scrollToConfigProp('showDateSeparators')}
          />
          {settings.showDateSeparators && (
            <div className="pl-1 space-y-1">
              <p className="text-[10px] text-slate-400 font-mono">config.dateSeparatorFormat</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'auto',         label: 'Auto' },
                  { id: 'ddd, MMM D',   label: 'Thu, Apr 23' },
                  { id: 'MMMM D, YYYY', label: 'April 23, 2026' },
                  { id: 'DD/MM/YYYY',   label: '23/04/2026' },
                  { id: 'MM/DD/YYYY',   label: '04/23/2026' },
                ].map(({ id, label }) => {
                  const active = (settings.dateSeparatorFormat ?? 'auto') === id;
                  return (
                    <button key={id}
                      onClick={() => onChange({ ...settings, dateSeparatorFormat: id })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${active ? 'text-white shadow-sm' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                      style={active ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
                    >{label}</button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-1">config.dateSeparatorShape</p>
              <div className="flex gap-2">
                {[{ id: 'round', label: 'Round' }, { id: 'rect', label: 'Rect' }].map(({ id, label }) => {
                  const active = (settings.dateSeparatorShape ?? 'round') === id;
                  return (
                    <button key={id}
                      onClick={() => onChange({ ...settings, dateSeparatorShape: id })}
                      className={`px-3 py-1 text-xs font-bold border transition-all ${active ? 'text-white shadow-sm' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'} ${id === 'round' ? 'rounded-full' : 'rounded'}`}
                      style={active ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
                    >{label}</button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Streaming */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Streaming</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Mock live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Toggle on to test SSE right here — this demo serves the stream endpoint and fires fake VERBOSE steps from <code className="font-mono bg-slate-100 dark:bg-slate-700 px-0.5 rounded text-slate-500 dark:text-slate-400">data/fake-stream.js</code> on every message.
            </p>
          </div>
          <Toggle
            label="Stream enabled"
            hint="config.stream.enabled"
            checked={settings.streamEnabled ?? false}
            onChange={(v) => onChange({ ...settings, streamEnabled: v })}
            accentColor={settings.accentColor}
            modes={['panel','sidepanel','fullscreen']}
            onLabelClick={() => scrollToConfigProp('stream.enabled')}
          />
          {settings.streamEnabled && (
            <>
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'sse',   label: '📡 SSE' },
                  { id: 'stomp', label: '🔌 STOMP' },
                ].map(({ id, label }) => {
                  const active = (settings.streamTransport ?? 'sse') === id;
                  return (
                    <button
                      key={id}
                      onClick={() => onChange({ ...settings, streamTransport: id })}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${active ? 'text-white shadow-md' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                      style={active ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <hr className="border-slate-100 dark:border-slate-700" />

        {/* Debug */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Debug</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-600 border border-amber-200">Dev only</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Flags for local development and demos. All default <code className="font-mono bg-slate-100 dark:bg-slate-700 px-0.5 rounded text-slate-500 dark:text-slate-400">false</code> — safe to ship. Each flag is independent and works in any consumer.</p>
          </div>
          <Toggle
            label="Always show Agent is thinking…"
            hint="config.debugShowVerbose"
            checked={settings.debugShowVerbose ?? false}
            onChange={(v) => onChange({ ...settings, debugShowVerbose: v })}
            accentColor={settings.accentColor}
          />
          <Toggle
            label="Show raw payload under bubbles"
            hint="config.debugShowPayload"
            checked={settings.debugShowPayload ?? false}
            onChange={(v) => onChange({ ...settings, debugShowPayload: v })}
            accentColor={settings.accentColor}
          />
          <Toggle
            label="Show matched renderer name"
            hint="config.debugShowRenderer"
            checked={settings.debugShowRenderer ?? false}
            onChange={(v) => onChange({ ...settings, debugShowRenderer: v })}
            accentColor={settings.accentColor}
          />
          <Toggle
            label="Show timestamps on bubbles"
            hint="config.debugShowTimestamps"
            checked={settings.debugShowTimestamps ?? false}
            onChange={(v) => onChange({ ...settings, debugShowTimestamps: v })}
            accentColor={settings.accentColor}
          />
          <Toggle
            label="Show message IDs on bubbles"
            hint="config.debugShowMessageId"
            checked={settings.debugShowMessageId ?? false}
            onChange={(v) => onChange({ ...settings, debugShowMessageId: v })}
            accentColor={settings.accentColor}
          />
          {/* Simulated delay toggle + input */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={(settings.debugSimulateDelay ?? 0) > 0}
              onClick={() => onChange({ ...settings, debugSimulateDelay: (settings.debugSimulateDelay ?? 0) > 0 ? 0 : 1500 })}
              className="relative mt-0.5 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ width: 40, height: 22, backgroundColor: (settings.debugSimulateDelay ?? 0) > 0 ? settings.accentColor : '#e2e8f0' }}
            >
              <span
                className="absolute top-[2px] left-0 bg-white rounded-full shadow transition-transform duration-200"
                style={{ width: 18, height: 18, transform: (settings.debugSimulateDelay ?? 0) > 0 ? 'translateX(20px)' : 'translateX(2px)' }}
              />
            </button>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug text-slate-700">Response delay</p>
              <p className="text-xs font-mono mt-0.5 text-slate-400">config.debugSimulateDelay</p>
              {(settings.debugSimulateDelay ?? 0) > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min="100" max="10000" step="100"
                    value={settings.debugSimulateDelay}
                    onChange={(e) => onChange({ ...settings, debugSimulateDelay: Math.max(0, Number(e.target.value)) })}
                    className="w-24 text-sm border border-amber-200 rounded-lg px-3 py-1 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 font-mono text-center"
                  />
                  <span className="text-[11px] text-slate-400 font-mono">ms</span>
                </div>
              )}
            </div>
          </div>
          <Toggle
            label="Simulate error response"
            hint="config.debugSimulateError"
            checked={settings.debugSimulateError ?? false}
            onChange={(v) => onChange({ ...settings, debugSimulateError: v })}
            accentColor={settings.accentColor}
          />
          <Toggle
            label="Highlight renderer regions"
            hint="config.debugHighlightRenderers"
            checked={settings.debugHighlightRenderers ?? false}
            onChange={(v) => onChange({ ...settings, debugHighlightRenderers: v })}
            accentColor={settings.accentColor}
          />
          <Toggle
            label="Disable all animations"
            hint="config.debugDisableAnimations"
            checked={settings.debugDisableAnimations ?? false}
            onChange={(v) => onChange({ ...settings, debugDisableAnimations: v })}
            accentColor={settings.accentColor}
          />
        </div>

        <hr className="border-slate-100 dark:border-slate-700" />

        {/* Text & Labels */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Text &amp; Labels</p>
          <div className="space-y-3">
            {[
              { key: 'title',       label: 'Header title',        hint: 'config.title',       placeholder: 'ConvEngine Assistant' },
              { key: 'subtitle',    label: 'Landing subtitle',     hint: 'config.subtitle',    placeholder: "Ask me anything..." },
              { key: 'placeholder', label: 'Composer placeholder', hint: 'config.placeholder', placeholder: 'Ask ConvEngine…' },
            ].map(({ key, label, hint, placeholder }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-36 flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{hint}</p>
                </div>
                <input
                  type="text"
                  value={settings[key]}
                  placeholder={placeholder}
                  onChange={(e) => onChange({ ...settings, [key]: e.target.value })}
                  className="flex-1 text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 font-mono bg-white dark:bg-slate-700 dark:text-slate-100"
                />
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-700" />

        {/* Landing Chips */}
        <LandingChipsSection settings={settings} onChange={onChange} />

        <hr className="border-slate-100 dark:border-slate-700" />

        {/* Panel Mode */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Panel Mode</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'panel',           label: '⊞ FAB Panel' },
              { id: 'sidepanel-right', label: '\u25b7 Right Side' },
              { id: 'sidepanel-left',  label: '\u25c1 Left Side' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => onChange({ ...settings, chatMode: id })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  settings.chatMode === id ? 'text-white shadow-md' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                style={settings.chatMode === id ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
              >{label}</button>
            ))}
            <button
              onClick={() => {
                onChange({ ...settings, chatMode: 'fullscreen' });
                const p = new URLSearchParams({
                  accent:           settings.accentColor,
                  feedback:         String(settings.showFeedback),
                  audit:            String(settings.showAudit),
                  engineStatus:     String(settings.showEngineStatus ?? true),
                  darkMode:         String(settings.showDarkModeLightMode),
                  title:            settings.title       || '',
                  subtitle:         settings.subtitle    || '',
                  placeholder:      settings.placeholder || '',
                  headerDot:        String(settings.showHeaderDot),
                  landingAvatar:    String(settings.showLandingAvatar),
                  landingSubtitle:  String(settings.showLandingSubtitle),
                  showNewChat:      String(settings.showNewChat),
                  showLayoutPicker: String(settings.showLayoutPicker),
                  showMaximize:     String(settings.showMaximize),
                  showMinimize:     String(settings.showMinimize),
                  composerShape:    settings.composerShape,
                });
                window.open(`/fullscreen?${p.toString()}`, '_blank', 'noopener,noreferrer');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                settings.chatMode === 'fullscreen' ? 'text-white shadow-md' : 'border-violet-200 text-violet-600 hover:bg-violet-50'
              }`}
              style={settings.chatMode === 'fullscreen' ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
            >
              ⛶ Fullscreen
              <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 1h4v4M11 1l-5 5M5 11H1V7M1 11l5-5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Composer Shape */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Composer Shape</p>
          <div className="flex gap-2">
            {[{ id: 'round', label: '⬭ Round (pill)' }, { id: 'rect', label: '▭ Rect' }].map(({ id, label }) => (
              <button key={id} onClick={() => onChange({ ...settings, composerShape: id })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  settings.composerShape === id ? 'text-white shadow-md' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                style={settings.composerShape === id ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Accent Color</p>
          <ColorPicker value={settings.accentColor} onChange={(c) => onChange({ ...settings, accentColor: c })} />
        </div>

        <hr className="border-slate-100 dark:border-slate-700" />

        {/* Message Enrichment */}
        <MessageEnrichmentSection
          enrich={settings.messageEnrichment ?? { mode: 'none', prefix: '', postfix: '', props: {} }}
          onChange={(enrich) => onChange({ ...settings, messageEnrichment: enrich })}
          accentColor={settings.accentColor}
        />

        <hr className="border-slate-100 dark:border-slate-700" />

        {/* Chat Colors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Chat Colors</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Light &amp; dark variants — like iOS Color Assets. Placeholder = built-in default. Leave blank to inherit it.</p>
            </div>
            <button
              type="button"
              onClick={() => onChange({ ...settings, previewDark: !settings.previewDark })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border flex-shrink-0 transition-all select-none ${
                settings.previewDark
                  ? 'bg-[#1c1c1c] border-[#444] text-slate-200 shadow-inner'
                  : 'bg-white border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {settings.previewDark ? '🌙 Dark preview' : '☀️ Light preview'}
            </button>
          </div>
          <ColorGrid settings={settings} onChange={onChange} currentMode={normalizedMode} accentColor={settings.accentColor} previewDark={settings.previewDark} />
        </div>

        {/* Icons */}
        <IconGrid
          iconSvgs={iconSvgs}
          onIconChange={onIconChange}
          onIconReset={onIconReset}
          currentMode={normalizedMode}
          accentColor={settings.accentColor}
          iconColorSetting={settings.iconColor}
          previewDark={settings.previewDark}
        />
      </div>
    </div>
  );
}

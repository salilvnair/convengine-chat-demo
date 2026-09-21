'use client';

import { useMemo, useState } from 'react';
import { AuditExplorer, AUDIT_EXPLORER_PALETTES } from '@salilvnair/convengine-chat';
import { CodeBlock } from './ui/CodeBlock.jsx';
import { Tip } from './ui/Tip.jsx';
import { PropRow, PropsTable } from './ui/PropRow.jsx';
import { SectionHeader, DocCard, DocCardBody } from './ui/DocLayout.jsx';
import { AUDIT_SEARCH_CONTROLLER_JAVA } from '../../../data/audit-search-controller.js';

/* Every switch here maps to one AuditExplorer config key, and the generated
   snippet below the preview prints only the keys you changed. */
const SECTIONS = [
  ['showLanding',    'Search landing',   true],
  ['showFilters',    'Filters pane',     true],
  ['showWaterfall',  'Pipeline waterfall', true],
  ['showInspector',  'Inspector',        true],
  ['showKpis',       'KPI tiles',        true],
  ['showApiReadout', 'Request readout',  true],
  ['keyboardShortcuts', 'Keyboard (/ j k)', true],
];

const PALETTE_BLURB = {
  aurora: 'violet → pink',
  lagoon: 'teal → sky',
  ember:  'orange → rose',
  indigo: 'matches the chat widget',
};

function Swatch({ name, active, dark, onClick }) {
  const p = AUDIT_EXPLORER_PALETTES[name][dark ? 'dark' : 'light'];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all ${active ? 'border-violet-500 ring-2 ring-violet-500/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}
      style={{ background: p.surface }}
    >
      <span className="h-8 w-8 flex-none rounded-lg" style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accent2})`, boxShadow: `0 0 0 3px ${p.surface2}` }} />
      <span className="min-w-0">
        <span className="block text-sm font-semibold capitalize" style={{ color: p.ink }}>{name}</span>
        <span className="block text-[11px]" style={{ color: p.muted }}>{PALETTE_BLURB[name]}</span>
      </span>
    </button>
  );
}

export function AuditExplorerSection({ darkMode }) {
  const [palette, setPalette] = useState('aurora');
  const [scheme, setScheme] = useState(darkMode ? 'dark' : 'light');
  const [accent, setAccent] = useState('');
  const [title, setTitle] = useState('Audit Explorer');
  const [flags, setFlags] = useState(() => Object.fromEntries(SECTIONS.map(([k, , d]) => [k, d])));

  const config = useMemo(() => ({
    apiHost: '',
    palette,
    colorScheme: scheme,
    title,
    ...flags,
    ...(accent ? { accentColor: accent } : {}),
    // The embedded preview shouldn't grab the page's keyboard.
    keyboardShortcuts: false,
    loadFonts: true,
  }), [palette, scheme, title, flags, accent]);

  const snippet = useMemo(() => {
    const lines = [`    apiHost: 'http://localhost:8080',`];
    if (palette !== 'aurora') lines.push(`    palette: '${palette}',`);
    lines.push(`    colorScheme: '${scheme}',`);
    if (title !== 'Audit Explorer') lines.push(`    title: ${JSON.stringify(title)},`);
    if (accent) lines.push(`    accentColor: '${accent}',`);
    for (const [k, , d] of SECTIONS) if (flags[k] !== d) lines.push(`    ${k}: ${flags[k]},`);
    return `import { AuditExplorer } from '@salilvnair/convengine-chat';\n\n<div style={{ height: '100vh' }}>\n  <AuditExplorer\n    config={{\n${lines.map((l) => '  ' + l).join('\n')}\n    }}\n  />\n</div>`;
  }, [palette, scheme, title, accent, flags]);

  const p = AUDIT_EXPLORER_PALETTES[palette][scheme];

  return (
    <DocCard id="audit-explorer">
      <SectionHeader
        gradient="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500"
        icon="🔎"
        title="Audit Explorer"
        subtitle="Search every conversation — see what went into the model, what came out, and what each pipeline step changed"
      />
      <DocCardBody>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
            <code className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-1 rounded">&lt;AuditExplorer /&gt;</code> is a full-page
            companion to the chat widget. It opens on a search landing page; searching, a quick filter or a
            conversation card opens the explorer — timeline, pipeline waterfall and an <b>In → Out</b> inspector
            that pairs every prompt with its reply.
          </p>
          <a
            href="/audit"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90"
          >
            Open full page ↗
          </a>
        </div>

        {/* ── Live playground ───────────────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Palette <span className="font-mono normal-case tracking-normal">config.palette</span></p>
              <div className="grid grid-cols-1 gap-2">
                {Object.keys(AUDIT_EXPLORER_PALETTES).map((name) => (
                  <Swatch key={name} name={name} dark={scheme === 'dark'} active={palette === name} onClick={() => setPalette(name)} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Scheme <span className="font-mono normal-case tracking-normal">config.colorScheme</span></p>
              <div className="grid grid-cols-2 rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
                {['light', 'dark'].map((s) => (
                  <button key={s} type="button" onClick={() => setScheme(s)} aria-pressed={scheme === s}
                    className={`py-1.5 text-sm capitalize ${scheme === s ? 'bg-violet-50 text-violet-700 font-semibold dark:bg-violet-900/40 dark:text-violet-200' : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="ax-accent" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Accent override <span className="font-mono normal-case tracking-normal">config.accentColor</span></label>
              <div className="flex items-center gap-2">
                <input id="ax-accent" type="color" value={accent || p.accent} onChange={(e) => setAccent(e.target.value)} className="h-8 w-10 rounded border border-slate-200 dark:border-slate-600 bg-transparent" />
                <code className="font-mono text-xs text-slate-500 dark:text-slate-400">{accent || `${p.accent} (palette)`}</code>
                {accent && <button type="button" onClick={() => setAccent('')} className="ml-auto text-xs text-violet-600 dark:text-violet-300">reset</button>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="ax-title" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title <span className="font-mono normal-case tracking-normal">config.title</span></label>
              <input id="ax-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-sm text-slate-700 dark:text-slate-200" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sections</p>
              {SECTIONS.map(([k, label]) => (
                <label key={k} htmlFor={`ax-${k}`} className="flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                  <span>{label} <span className="font-mono text-[10px] text-slate-400">{k}</span></span>
                  <input id={`ax-${k}`} type="checkbox" checked={flags[k]} onChange={(e) => setFlags((f) => ({ ...f, [k]: e.target.checked }))} className="h-4 w-4 accent-violet-600" />
                </label>
              ))}
            </div>
          </div>

          <div className="min-w-0 space-y-3">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700" style={{ height: 640 }}>
              {/* Remount on landing toggle so the preview starts from the chosen view. */}
              <AuditExplorer key={`${flags.showLanding}`} config={config} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live against this demo’s mock backend — send a few messages in the chat, then press <b>Refresh</b> in the preview.
            </p>
            <CodeBlock lang="jsx" code={snippet} />
          </div>
        </div>

        {/* ── From the chat widget ──────────────────────────────────────── */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Open it from the chat widget</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            An audit icon in the widget header opens the explorer in a new tab, deep-linked to the conversation you’re in.
            Toggle it in the playground above with <b>Audit Explorer Button</b>.
          </p>
          <CodeBlock lang="jsx" code={`<ConvEngineChat
  config={{
    showAuditExplorer: true,
    auditExplorerUrl:  '/audit',   // opened as /audit?conversationId=<current>
    // or route it yourself:
    // onOpenAuditExplorer: (conversationId) => router.push(\`/audit?conversationId=\${conversationId}\`),
  }}
/>

// app/audit/page.jsx
const conversationId = useSearchParams().get('conversationId') ?? undefined;
<AuditExplorer config={{ apiHost, conversationId }} />`} />
          <PropsTable>
            <PropRow id="config-showAuditExplorer" prop="showAuditExplorer" type="boolean" defaultVal="false" description="Header button (panel, sidepanel, fullscreen) that opens the Audit Explorer." />
            <PropRow prop="auditExplorerUrl" type="string" defaultVal="undefined" description="Where the explorer lives. The current conversation id is appended as ?conversationId=." />
            <PropRow prop="onOpenAuditExplorer" type="(conversationId) => void" defaultVal="undefined" description="Handle the click yourself — in-app routing. Wins over auditExplorerUrl." />
            <PropRow prop="auditExplorerTarget" type="string" defaultVal="'_blank'" description="window.open target." />
            <PropRow prop="auditExplorerParam" type="string" defaultVal="'conversationId'" description="Query parameter the conversation id is written to." />
            <PropRow prop="auditExplorerLinkConversation" type="boolean" defaultVal="true" description="false opens the URL without the conversation id." />
            <PropRow prop="auditExplorerLabel" type="string" defaultVal="'Open Audit Explorer'" description="Tooltip and aria-label. The icon is AuditExplorerIcon — override it via config.icons." />
          </PropsTable>
        </div>

        {/* ── Explorer reference ────────────────────────────────────────── */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">AuditExplorer config</h3>
          <PropsTable>
            <PropRow prop="apiHost" type="string" defaultVal="''" description="Backend base URL. Same-origin when empty." />
            <PropRow prop="apiEndpoints" type="object" defaultVal="undefined" description="Same overrides as the widget — audit, auditSearch." />
            <PropRow prop="rows" type="CeAudit[]" defaultVal="undefined" description="Static rows; skips all fetching. For fixtures, tests and offline review." />
            <PropRow prop="conversationId" type="string" defaultVal="undefined" description="Open straight on one conversation, skipping the landing page." />
            <PropRow prop="conversationIds" type="string[]" defaultVal="[]" description="Always load these, alongside search results." />
            <PropRow prop="initialQuery" type="string" defaultVal="''" description="Start with a search, skipping the landing page." />
            <PropRow prop="limit" type="number" defaultVal="200" description="Rows per search page." />
            <PropRow prop="searchPageLimit" type="number" defaultVal="5" description="Most search pages read to find enough conversations — one real conversation is ~85 rows." />
            <PropRow prop="maxConversations" type="number" defaultVal="12" description="Most conversations loaded at once." />
            <PropRow prop="defaultFilters" type="object" defaultVal="undefined" description="outcome, hideSteps, errorsOnly, llmOnly, changedOnly, inputParamsChanged, minPayloadKb, families, intents, states, conversations." />
            <PropRow prop="palette" type="'aurora'|'lagoon'|'ember'|'indigo'|{light,dark}" defaultVal="'aurora'" description="A preset, or a partial palette merged over paletteBase." />
            <PropRow prop="paletteBase" type="string" defaultVal="'aurora'" description="Preset a custom palette merges over." />
            <PropRow prop="colorScheme" type="'light'|'dark'" defaultVal="OS" description="Omit to follow prefers-color-scheme. defaultDark also works." />
            <PropRow prop="accentColor … llmColor" type="string | { light, dark }" defaultVal="palette" description="accentColor, accentColor2, groundColor, surfaceColor, surfaceAltColor, textColor, secondaryTextColor, mutedTextColor, borderColor, borderStrongColor, codeBgColor, okColor, warnColor, errorColor, llmColor." />
            <PropRow prop="fontFamily / monoFontFamily" type="string" defaultVal="IBM Plex" description="Override the faces. loadFonts: false skips the Google Fonts link (strict CSP)." />
            <PropRow prop="showLanding … showRefresh" type="boolean" defaultVal="true" description="showLanding, showSearch, showKpis, showApiReadout, showFilters, showWaterfall, showInspector, showRefresh — every section can go." />
            <PropRow prop="inspectorTabs" type="Array<'io'|'body'|'meta'|'raw'>" defaultVal="all four" description="Which inspector tabs to show, in order. defaultTab picks the first one open." />
            <PropRow prop="keyboardShortcuts" type="boolean" defaultVal="true" description="/ focuses search; j and k walk the rows." />
            <PropRow prop="title / subtitle" type="string" defaultVal="'Audit Explorer'" description="Top-bar text." />
            <PropRow prop="landingTitle / landingSubtitle / landingExamples / landingRecentLimit / landingQuickFilters" type="mixed" defaultVal="—" description="Landing page copy, example query chips, how many recent conversations, and the quick-filter tiles." />
            <PropRow prop="stageLabels" type="Record<string,string>" defaultVal="undefined" description="Rename stages: { SCHEMA_STATUS: 'Slots' }." />
            <PropRow prop="familyColors" type="Record<family,string>" defaultVal="undefined" description="Recolour a stage family: { agent: '#f97316' }." />
            <PropRow prop="classifyStage" type="(base) => family | null" defaultVal="undefined" description="Take over classification for your own stages." />
            <PropRow prop="onSelectRow / onFiltersChange / onViewChange / onError" type="function" defaultVal="undefined" description="Callbacks." />
          </PropsTable>
          <Tip color="violet" icon="🎨" title="theme prop — any CSS variable">
            <code className="font-mono text-xs">theme</code> works as on the widget: keys are auto-prefixed with <code className="font-mono text-xs">--ce-</code>.
            e.g. <code className="font-mono text-xs">{`theme={{ 'ax-radius': '14px', 'ax-inspector-width': '520px', 'ax-glow': 'transparent' }}`}</code>.
            Precedence: palette → colour shorthands → theme.
          </Tip>
          <Tip color="blue" icon="🔍" title="Search tips">
            Free text matches stage names and payload bodies — <b>not</b> the <code className="font-mono text-xs">_meta</code> envelope, which repeats the
            user’s text on every row. A stage name matches its <code className="font-mono text-xs">withStage()</code> forms. A conversation id — whole
            or its first 8 characters — opens that conversation; a full id loads directly, even without a search endpoint.
          </Tip>
        </div>

        {/* ── Backend ───────────────────────────────────────────────────── */}
        <div id="audit-search-endpoint" className="space-y-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Audit search endpoint — ConvEngine 2.x.x</h3>
          <Tip color="amber" icon="⚠️" title="On ConvEngine library 2.x.x? Add this controller.">
            The engine exposes <code className="font-mono text-xs">GET /audit/{'{conversationId}'}</code> and <code className="font-mono text-xs">/trace</code> only.
            Without the controller below, <code className="font-mono text-xs">/audit/search</code> is read as a conversation whose id is
            <code className="font-mono text-xs"> "search"</code>, fails UUID parsing and returns <b>400</b> — the explorer then only works for a pasted full id.
          </Tip>
          <CodeBlock lang="bash" code={`GET /api/v1/conversation/audit/search?q=&limit=  →  { results: [CeAudit…], total }

# optional: offset, stage (comma list; RULE_MATCH also matches "RULE_MATCH (x)"),
#           conversationId, intent, state, since, until, errorsOnly`} />
          <CodeBlock lang="java" code={AUDIT_SEARCH_CONTROLLER_JAVA} />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            A literal <code className="font-mono text-xs">/search</code> outranks the engine’s <code className="font-mono text-xs">/{'{conversationId}'}</code> pattern,
            so the handler wins without touching the engine. Rows come back in exactly the shape of <code className="font-mono text-xs">/audit/{'{conversationId}'}</code>,
            newest first. Serving it elsewhere? Point the widget at it with <code className="font-mono text-xs">apiEndpoints.auditSearch</code>.
          </p>
        </div>
      </DocCardBody>
    </DocCard>
  );
}

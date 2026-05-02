'use client';

import { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark }   from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx        from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx        from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import bash       from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css        from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json       from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markup     from 'react-syntax-highlighter/dist/esm/languages/prism/markup';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('html', markup);
SyntaxHighlighter.registerLanguage('xml', markup);

const LANG_BADGE_COLOR = {
  jsx:  '#61AFEF',
  tsx:  '#4FC1FF',
  js:   '#E5C07B',
  ts:   '#569CD6',
  bash: '#98C379',
  sh:   '#98C379',
  css:  '#C678DD',
  json: '#E06C75',
  html: '#E5995C',
};

const PRISM_LANG = {
  jsx: 'jsx', tsx: 'tsx',
  js: 'javascript', ts: 'typescript',
  bash: 'bash', sh: 'bash',
  css: 'css', json: 'json', html: 'html',
};

export function CodeBlock({ code, lang = 'jsx' }) {
  const [copied, setCopied] = useState(false);
  const key        = lang.toLowerCase();
  const badgeColor = LANG_BADGE_COLOR[key] ?? '#94a3b8';
  const hljsLang   = PRISM_LANG[key] ?? 'jsx';

  function copy() {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#1c2030] px-4 py-2">
        <div className="flex items-center gap-2">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: badgeColor, flexShrink: 0, display: 'inline-block' }} />
          <span className="text-xs font-mono font-semibold" style={{ color: badgeColor }}>{lang}</span>
        </div>
        <button onClick={copy}
          className="text-xs text-slate-400 hover:text-white transition-colors font-medium flex items-center gap-1.5">
          {copied
            ? <><span className="text-emerald-400">✓</span> Copied</>
            : <>
                <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"/>
                </svg>
                Copy
              </>
          }
        </button>
      </div>

      {/* Syntax-highlighted body */}
      <SyntaxHighlighter
        language={hljsLang}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1rem 1.25rem',
          background: '#171c2b',
          fontSize: '0.72rem',
          lineHeight: '1.65',
          overflowX: 'auto',
          borderRadius: 0,
        }}
        codeTagProps={{ style: { fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

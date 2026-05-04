'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

function tryParse(text) {
  if (!text || !text.trim()) return { ok: true, error: null };
  try { JSON.parse(text); return { ok: true, error: null }; }
  catch (e) { return { ok: false, error: e.message }; }
}

function normalize(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  try { return JSON.stringify(v, null, 2); } catch { return ''; }
}

/**
 * Self-contained CodeMirror JSON editor with Format button and inline error badge.
 * Props:
 *   value      — string or object (controlled)
 *   onChange   — (string) => void
 *   placeholder — string shown when empty (default: '{}')
 *   minHeight  — CSS string (default: '140px')
 */
export function JsonEditorField({
  value,
  onChange,
  placeholder = '{}',
  minHeight = '140px',
}) {
  const extensions = useMemo(() => [json()], []);
  const [localValue, setLocalValue] = useState(() => normalize(value));
  const [parseError, setParseError] = useState(() => tryParse(normalize(value)).error);
  const lastEmittedRef = useRef(normalize(value));

  useEffect(() => {
    const next = normalize(value);
    if (next !== lastEmittedRef.current) {
      setLocalValue(next);
      setParseError(tryParse(next).error);
    }
  }, [value]);

  const handleChange = useCallback((text) => {
    setLocalValue(text);
    setParseError(tryParse(text).error);
    lastEmittedRef.current = text;
    onChange?.(text);
  }, [onChange]);

  const handleFormat = useCallback(() => {
    try {
      const formatted = JSON.stringify(JSON.parse(localValue), null, 2);
      setLocalValue(formatted);
      setParseError(null);
      lastEmittedRef.current = formatted;
      onChange?.(formatted);
    } catch { /* already invalid */ }
  }, [localValue, onChange]);

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: parseError ? '#fca5a5' : '#e2e8f0' }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-2.5 py-1 bg-[#21252b] border-b border-[#181a1f]">
        <span className="text-[10px] font-mono text-slate-400">JSON</span>
        <div className="flex items-center gap-2">
          {parseError && (
            <span
              title={parseError}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-yellow-300 bg-yellow-900/40 border border-yellow-700/50 rounded-full px-2 py-0.5"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Invalid JSON
            </span>
          )}
          <button
            type="button"
            onClick={handleFormat}
            disabled={!!parseError || !localValue.trim()}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-1.5 py-0.5 rounded"
            title="Format JSON (pretty-print)"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 7 4 4 20 4 20 7"/>
              <line x1="9" y1="20" x2="15" y2="20"/>
              <line x1="12" y1="4" x2="12" y2="20"/>
            </svg>
            Format
          </button>
        </div>
      </div>

      {/* Editor */}
      <CodeMirror
        value={localValue}
        minHeight={minHeight}
        maxHeight="320px"
        theme={oneDark}
        extensions={extensions}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          foldGutter: false,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          indentOnInput: true,
          tabSize: 2,
        }}
        onChange={handleChange}
      />

      {/* Error message below */}
      {parseError && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border-t border-red-100 text-[10px] text-red-500 font-mono">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {parseError}
        </div>
      )}
    </div>
  );
}

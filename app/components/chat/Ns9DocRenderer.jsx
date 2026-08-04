'use client';

/* ──────────────────────────────────────────────────────────────────────────
 * NS9 answer + document citations — custom renderer
 *
 * Matches NS9's convengine bridge response (POST /api/v1/conversation/message
 * with header X-NS9-Response-Format: json — see ns9/api/routes_convengine.py):
 *
 *   {
 *     type: "ns9", format: "json",
 *     rawText: "…markdown prose, no baked-in citation text…",
 *     headline: "…", keyPoints: [{ point, sources: [nodeId] }],
 *     caveats: ["…"],
 *     citations: [{
 *       node_id, node_type, label, summary, source_url, source_pages,
 *       document: { file_name, file_stem, file_ext, file_path } | null,
 *     }],
 *   }
 *
 * Without the header, NS9 keeps its old behavior (a "Read more: <url>" line
 * baked into rawText, format: "text") — that still falls through to the
 * library's built-in DefaultRenderer (plain <pre>), unaffected by this file.
 * Send the header to get this renderer instead of the plain-text bubble.
 * ────────────────────────────────────────────────────────────────────────── */

/* ── Mini markdown → JSX — no external dep, same philosophy as
 * InteractiveRenderers.jsx's own parseMdTable() a few files over. Covers
 * what NS9's LLM-synthesized answers actually produce: headings, **bold**,
 * *italic*, `code`, [text](url) links, "- " bullet lists, paragraphs. Not a
 * full CommonMark implementation — doesn't need to be for chat prose. ── */

function renderInline(text, keyPrefix) {
  // Order matters: links first (so bold/italic inside link text isn't
  // double-processed), then code (so ** inside `code` isn't touched), then
  // bold, then italic.
  const nodes = [];
  let rest = text;
  let i = 0;
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/;
  while (rest.length) {
    const m = pattern.exec(rest);
    if (!m) { nodes.push(rest); break; }
    if (m.index > 0) nodes.push(rest.slice(0, m.index));
    if (m[1] !== undefined) {
      nodes.push(
        <a key={`${keyPrefix}-${i++}`} href={m[2]} target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--ce-color-accent)', textDecoration: 'underline' }}>
          {m[1]}
        </a>,
      );
    } else if (m[3] !== undefined) {
      nodes.push(
        <code key={`${keyPrefix}-${i++}`} style={{
          background: 'var(--ce-bg, #f1f5f9)', border: '1px solid var(--ce-border, #e2e8f0)',
          borderRadius: 4, padding: '1px 5px', fontSize: '0.85em', fontFamily: 'ui-monospace, monospace',
        }}>
          {m[3]}
        </code>,
      );
    } else if (m[4] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{m[4]}</strong>);
    } else if (m[5] !== undefined) {
      nodes.push(<em key={`${keyPrefix}-${i++}`}>{m[5]}</em>);
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return nodes;
}

function MiniMarkdown({ text }) {
  const blocks = String(text ?? '').trim().split(/\n{2,}/);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.trim());
        if (!lines.length) return null;

        const headingMatch = lines.length === 1 && /^(#{1,3})\s+(.*)$/.exec(lines[0]);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const size = level === 1 ? '1.05rem' : level === 2 ? '0.95rem' : '0.88rem';
          return (
            <p key={bi} style={{ margin: 0, fontWeight: 700, fontSize: size, color: 'var(--ce-fg)' }}>
              {renderInline(headingMatch[2], `h${bi}`)}
            </p>
          );
        }

        const isList = lines.every((l) => /^[-*]\s+/.test(l.trim()));
        if (isList) {
          return (
            <ul key={bi} style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {lines.map((l, li) => (
                <li key={li} style={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--ce-fg)' }}>
                  {renderInline(l.trim().replace(/^[-*]\s+/, ''), `l${bi}-${li}`)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={bi} style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.55, color: 'var(--ce-fg)' }}>
            {lines.map((l, li) => (
              <span key={li}>
                {renderInline(l, `p${bi}-${li}`)}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/* ── Document citation card ─────────────────────────────────────────────── */

const EXT_ICON = {
  '.pdf': '📄', '.docx': '📝', '.doc': '📝', '.xlsx': '📊', '.xls': '📊',
  '.md': '📃', '.markdown': '📃', '.txt': '📃', '.rst': '📃',
  '.html': '🌐', '.htm': '🌐', '.epub': '📚',
};

function DocumentCard({ doc, pages }) {
  const icon = EXT_ICON[doc.file_ext?.toLowerCase()] ?? '📎';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px',
      borderRadius: 10, border: '1px solid var(--ce-border, #e2e8f0)',
      background: 'var(--ce-bg, #f8fafc)',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8, flexShrink: 0, fontSize: 17,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--ce-color-accent-light)',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.8rem', fontWeight: 600, color: 'var(--ce-fg)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }} title={doc.file_name}>
          {doc.file_name}
        </div>
        {pages && (
          <div style={{ fontSize: '0.68rem', color: 'var(--ce-fg-muted, #94a3b8)', marginTop: 1 }}>
            page{pages.split(',').length > 1 ? 's' : ''} {pages}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <a href={doc.file_path} target="_blank" rel="noopener noreferrer"
          style={{
            padding: '5px 9px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 7,
            border: '1px solid var(--ce-border, #e2e8f0)', color: 'var(--ce-fg)',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
          Open ↗
        </a>
        {/* download= is honored for same-origin URLs; cross-origin browsers
           just open it instead (no server round-trip needed either way, so
           this degrades to "Open" rather than failing outright). */}
        <a href={doc.file_path} download={doc.file_name} target="_blank" rel="noopener noreferrer"
          style={{
            padding: '5px 9px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 7,
            border: 'none', background: 'var(--ce-color-accent)', color: '#fff',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
          ⬇ Download
        </a>
      </div>
    </div>
  );
}

/* ── Main card ───────────────────────────────────────────────────────────── */

function Ns9AnswerComponent({ payload }) {
  const rawText = payload?.rawText ?? '';
  const headline = payload?.headline ?? '';
  const keyPoints = Array.isArray(payload?.keyPoints) ? payload.keyPoints : [];
  const caveats = Array.isArray(payload?.caveats) ? payload.caveats : [];
  const citations = Array.isArray(payload?.citations) ? payload.citations : [];

  // One card per unique file (several citations — different nodes/pages —
  // can point at the same document; the chat bubble should show it once).
  const docs = [];
  const seen = new Set();
  for (const c of citations) {
    if (!c?.document) continue;
    const key = c.document.file_path;
    if (seen.has(key)) continue;
    seen.add(key);
    docs.push({ doc: c.document, pages: c.source_pages });
  }

  return (
    <div className="ce-interactive-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {headline && (
        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.92rem', color: 'var(--ce-fg)' }}>
          {headline}
        </p>
      )}

      {rawText && <MiniMarkdown text={rawText} />}

      {keyPoints.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {keyPoints.map((kp, i) => (
            <li key={i} style={{ fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--ce-fg)' }}>
              {renderInline(kp?.point ?? '', `kp${i}`)}
            </li>
          ))}
        </ul>
      )}

      {caveats.length > 0 && (
        <div style={{
          background: 'var(--ce-bg, #f8fafc)', border: '1px dashed var(--ce-border, #e2e8f0)',
          borderRadius: 8, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <span style={{
            fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.05em', color: 'var(--ce-fg-muted, #94a3b8)',
          }}>
            Caveats
          </span>
          {caveats.map((c, i) => (
            <span key={i} style={{ fontSize: '0.76rem', color: 'var(--ce-fg-muted, #64748b)' }}>{c}</span>
          ))}
        </div>
      )}

      {docs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{
            fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.05em', color: 'var(--ce-fg-muted, #94a3b8)',
          }}>
            Sources
          </span>
          {docs.map(({ doc, pages }) => (
            <DocumentCard key={doc.file_path} doc={doc} pages={pages} />
          ))}
        </div>
      )}
    </div>
  );
}

export const ns9AnswerRenderer = {
  key: 'Ns9Answer',
  priority: 250,
  hideBubble: true,
  match: ({ payload, effectiveType }) => effectiveType === 'ns9' && payload?.format === 'json',
  Component: Ns9AnswerComponent,
};

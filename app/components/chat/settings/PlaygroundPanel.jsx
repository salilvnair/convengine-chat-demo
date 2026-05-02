'use client';

import { useState } from 'react';
import { CodeBlock }        from './ui/CodeBlock.jsx';
import { Toggle }           from './ui/Toggle.jsx';
import { scrollToConfigProp } from './ui/BackToTop.jsx';
import { ColorPicker }      from './ColorPicker.jsx';
import { ColorGrid }        from './ColorSection.jsx';
import { IconGrid, DEFAULT_ICON_SVGS, ICON_META } from './IconSection.jsx';

function buildGeneratedCode(settings, iconSvgs) {
  const m     = settings.chatMode;
  const mode  = m === 'fullscreen' ? 'fullscreen' : m.startsWith('sidepanel') ? 'sidepanel' : 'panel';
  const align = m.startsWith('sidepanel') ? `\n  align="${m === 'sidepanel-left' ? 'left' : 'right'}"` : '';
  const extras = [
    settings.title       !== 'ConvEngine Assistant'                        ? `    title: "${settings.title}",` : null,
    settings.subtitle    !== "Ask me anything \u2014 I'll do my best to help." ? `    subtitle: "${settings.subtitle}",` : null,
    settings.placeholder !== 'Ask ConvEngine\u2026'                        ? `    placeholder: "${settings.placeholder}",` : null,
    !settings.showHeaderDot       ? '    showHeaderDot: false,'       : null,
    !settings.showLandingAvatar   ? '    showLandingAvatar: false,'   : null,
    !settings.showLandingSubtitle ? '    showLandingSubtitle: false,' : null,
    !settings.showNewChat         ? '    showNewChat: false,'         : null,
    !settings.showLayoutPicker    ? '    showLayoutPicker: false,'    : null,
    !settings.showMaximize        ? '    showMaximize: false,'        : null,
    !settings.showMinimize        ? '    showMinimize: false,'        : null,
    settings.composerShape === 'rect' ? `    composerShape: 'rect',` : null,
    ...(['bubbleUserBg','bubbleUserText','bubbleAgentBg','bubbleAgentText','panelBg','composerBg','iconColor'].map((key) => {
      const v = settings[key];
      const l = v?.light?.trim(); const d = v?.dark?.trim();
      if (!l && !d) return null;
      const ser = (l && d) ? `{ light: "${l}", dark: "${d}" }` : l ? `"${l}"` : `{ dark: "${d}" }`;
      return `    ${key}: ${ser},`;
    })),
  ].filter(Boolean).join('\n');
  const changedIcons = Object.keys(ICON_META).filter(k => iconSvgs[k] !== DEFAULT_ICON_SVGS[k]);
  const iconsSnippet = changedIcons.length
    ? `\n    icons: {\n${changedIcons.map(k => `      // custom ${k} \u2014 replace with your React component\n      ${k}: My${k},`).join('\n')}\n    },`
    : '';
  return `<ConvEngineChat\n  mode="${mode}"${align}\n  config={{\n    apiHost: "http://localhost:8080",\n    showFeedback: ${settings.showFeedback},\n    showAudit: ${settings.showAudit},\n    showEngineStatus: ${settings.showEngineStatus ?? true},\n    showDarkModeLightMode: ${settings.showDarkModeLightMode},${extras ? '\n' + extras : ''}${iconsSnippet}\n  }}\n  theme={{ "color-accent": "${settings.accentColor}" }}\n/>`;
}

export function PlaygroundPanel({ settings, onChange, iconSvgs, onIconChange, onIconReset }) {
  const generatedCode = buildGeneratedCode(settings, iconSvgs);
  const [stickyCode, setStickyCode] = useState(false);
  const normalizedMode = settings.chatMode === 'fullscreen' ? 'fullscreen'
    : settings.chatMode?.startsWith('sidepanel') ? 'sidepanel' : 'panel';
  const showFor = (...modes) => modes.includes(normalizedMode);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="px-6 py-4 rounded-t-2xl" style={{ background: `linear-gradient(135deg, ${settings.accentColor} 0%, ${settings.accentColor}cc 100%)` }}>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>🎛️</span> Live Config Playground
        </h3>
        <p className="text-xs text-white/75 mt-0.5">Toggle settings below — the chat widget updates instantly.</p>
      </div>

      {/* Generated Usage */}
      <div className={`${stickyCode ? 'sticky top-14 z-20 shadow-sm' : ''} bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 py-3`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generated Usage</p>
          <button
            type="button"
            onClick={() => setStickyCode((v) => !v)}
            className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all select-none ${
              stickyCode
                ? 'text-white'
                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
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
        </div>

        <hr className="border-slate-100" />

        {/* Text & Labels */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Text &amp; Labels</p>
          <div className="space-y-3">
            {[
              { key: 'title',       label: 'Header title',        hint: 'config.title',       placeholder: 'ConvEngine Assistant' },
              { key: 'subtitle',    label: 'Landing subtitle',     hint: 'config.subtitle',    placeholder: "Ask me anything..." },
              { key: 'placeholder', label: 'Composer placeholder', hint: 'config.placeholder', placeholder: 'Ask ConvEngine…' },
            ].map(({ key, label, hint, placeholder }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-36 flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-700">{label}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{hint}</p>
                </div>
                <input
                  type="text"
                  value={settings[key]}
                  placeholder={placeholder}
                  onChange={(e) => onChange({ ...settings, [key]: e.target.value })}
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 font-mono"
                />
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Panel Mode */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Panel Mode</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'panel',           label: '⊞ FAB Panel' },
              { id: 'sidepanel-right', label: '\u25b7 Right Side' },
              { id: 'sidepanel-left',  label: '\u25c1 Left Side' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => onChange({ ...settings, chatMode: id })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  settings.chatMode === id ? 'text-white shadow-md' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
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
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Composer Shape</p>
          <div className="flex gap-2">
            {[{ id: 'round', label: '⬭ Round (pill)' }, { id: 'rect', label: '▭ Rect' }].map(({ id, label }) => (
              <button key={id} onClick={() => onChange({ ...settings, composerShape: id })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  settings.composerShape === id ? 'text-white shadow-md' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                style={settings.composerShape === id ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accent Color</p>
          <ColorPicker value={settings.accentColor} onChange={(c) => onChange({ ...settings, accentColor: c })} />
        </div>

        <hr className="border-slate-100" />

        {/* Chat Colors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chat Colors</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Light &amp; dark variants — like iOS Color Assets. Placeholder = built-in default. Leave blank to inherit it.</p>
            </div>
            <button
              type="button"
              onClick={() => onChange({ ...settings, previewDark: !settings.previewDark })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border flex-shrink-0 transition-all select-none ${
                settings.previewDark
                  ? 'bg-[#1c1c1c] border-[#444] text-slate-200 shadow-inner'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
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

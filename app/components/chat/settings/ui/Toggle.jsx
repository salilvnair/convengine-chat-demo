'use client';

const MODE_BADGE = {
  panel:      'bg-indigo-100 text-indigo-700',
  sidepanel:  'bg-violet-100 text-violet-700',
  fullscreen: 'bg-pink-100   text-pink-700',
};

export function Toggle({ checked, onChange, label, hint, modes, accentColor, onLabelClick }) {
  const checkedBg = accentColor || '#6366f1';
  const clickable = !!onLabelClick;
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${checked ? '' : 'bg-slate-200'}`}
        style={{ width: 40, height: 22, overflow: 'hidden', backgroundColor: checked ? checkedBg : undefined, '--tw-ring-color': checkedBg }}
      >
        <span
          className="absolute top-[2px] left-0 bg-white rounded-full shadow transition-transform duration-200"
          style={{ width: 18, height: 18, transform: checked ? 'translateX(20px)' : 'translateX(2px)' }}
        />
      </button>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p
            className={`text-sm font-semibold leading-snug ${
              clickable
                ? 'text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline'
                : 'text-slate-700 dark:text-slate-300'
            }`}
            onClick={onLabelClick}
            title={clickable ? 'View in API docs' : undefined}
          >{label}</p>
          {clickable && (
            <span className="text-[9px] text-indigo-400 font-semibold bg-indigo-50 border border-indigo-100 px-1 py-0.5 rounded leading-none select-none">↓ docs</span>
          )}
          {modes && modes.map((m) => (
            <span key={m} className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${MODE_BADGE[m] ?? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>{m}</span>
          ))}
        </div>
        <p
          className={`text-xs font-mono mt-0.5 ${
            clickable
              ? 'text-indigo-400 cursor-pointer hover:underline hover:text-indigo-600'
              : 'text-slate-400 dark:text-slate-500'
          }`}
          onClick={onLabelClick}
          title={clickable ? 'View in API docs' : undefined}
        >{hint}</p>
      </div>
    </div>
  );
}

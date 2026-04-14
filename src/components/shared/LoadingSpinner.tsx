const FLAVOUR_MESSAGES = [
  'Preparing your quest...',
  'Consulting the Bavarian sages...',
  'Summoning the Sprachgeist...',
  'Brewing the content potion...',
  'Translating ancient runes...',
  'Asking the Wiesn oracle...',
  'Polishing the vocabulary gems...',
  'Waking the grammar guardian...',
];

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message, fullScreen = false }: LoadingSpinnerProps) {
  const msg = message ?? FLAVOUR_MESSAGES[Math.floor(Math.random() * FLAVOUR_MESSAGES.length)];

  if (!fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">{msg}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950">
      {/* Decorative rune ring */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 animate-rune-spin">
          <svg viewBox="0 0 96 96" className="w-full h-full text-amber-500/20">
            <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4" />
          </svg>
        </div>
        <div className="absolute inset-4 animate-rune-spin" style={{ animationDirection: 'reverse', animationDuration: '5s' }}>
          <svg viewBox="0 0 64 64" className="w-full h-full text-amber-500/40">
            <polygon points="32,4 60,20 60,44 32,60 4,44 4,20" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        {/* Center glyph */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-float select-none">ᛞ</span>
        </div>
      </div>

      <p className="text-amber-400 font-semibold text-lg mb-2">DeutschQuest</p>
      <p className="text-slate-400 text-sm">{msg}</p>

      <div className="mt-8 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

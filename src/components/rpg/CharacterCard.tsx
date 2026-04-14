import { usePlayerStore } from '../../store/usePlayerStore';
import { getLevelTitle, CHARACTER_CLASSES } from '../../types/player';
import { LevelBadge } from './LevelBadge';
import { XPBar } from './XPBar';

// SVG avatar changes at level milestones
function AvatarSVG({ avatarLevel }: { avatarLevel: number }) {
  // Visual tier based on avatar level milestone
  const tier = avatarLevel >= 50 ? 5 : avatarLevel >= 40 ? 4 : avatarLevel >= 30 ? 3 : avatarLevel >= 20 ? 2 : avatarLevel >= 10 ? 1 : 0;

  const colors = [
    ['#64748b', '#94a3b8'], // tier 0 - slate
    ['#6366f1', '#818cf8'], // tier 1 - indigo
    ['#0ea5e9', '#38bdf8'], // tier 2 - sky
    ['#10b981', '#34d399'], // tier 3 - emerald
    ['#f59e0b', '#fbbf24'], // tier 4 - amber
    ['#ec4899', '#f9a8d4'], // tier 5 - pink
  ];
  const [primary, secondary] = colors[tier];

  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Background shield */}
      <path
        d="M40 8 L68 20 L68 48 Q68 64 40 76 Q12 64 12 48 L12 20 Z"
        fill={primary}
        opacity="0.15"
        stroke={primary}
        strokeWidth="1"
      />
      {/* Body */}
      <ellipse cx="40" cy="54" rx="16" ry="12" fill={primary} opacity="0.7" />
      {/* Head */}
      <circle cx="40" cy="32" r="14" fill={secondary} />
      {/* Face */}
      <circle cx="36" cy="30" r="2" fill={primary} />
      <circle cx="44" cy="30" r="2" fill={primary} />
      <path d="M36 37 Q40 41 44 37" fill="none" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
      {/* Tier emblem */}
      {tier >= 3 && (
        <g>
          <path d="M40 15 L43 22 L50 22 L44 27 L46 34 L40 30 L34 34 L36 27 L30 22 L37 22 Z"
            fill={secondary} opacity="0.6" />
        </g>
      )}
    </svg>
  );
}

export function CharacterCard() {
  const player = usePlayerStore((s) => s.player);
  if (!player) return null;

  const classInfo = CHARACTER_CLASSES.find((c) => c.id === player.characterClass);
  const levelTitle = getLevelTitle(player.level);

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-4">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex-shrink-0 animate-float">
          <AvatarSVG avatarLevel={player.avatarLevel} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <LevelBadge level={player.level} size="sm" />
            <h2 className="text-slate-100 font-bold text-lg leading-tight truncate">{player.name}</h2>
          </div>
          <p className="text-amber-400 text-sm font-medium">{classInfo?.germanName}</p>
          <p className="text-slate-400 text-xs mt-0.5">{levelTitle}</p>
        </div>
      </div>

      <XPBar />
    </div>
  );
}

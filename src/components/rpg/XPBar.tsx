import { usePlayerStore } from '../../store/usePlayerStore';
import { xpToNextLevel, levelFromTotalXP } from '../../lib/xp';

interface XPBarProps {
  compact?: boolean;
}

export function XPBar({ compact = false }: XPBarProps) {
  const player = usePlayerStore((s) => s.player);
  if (!player) return null;

  const { level, xpIntoLevel } = levelFromTotalXP(player.xp);
  const needed = xpToNextLevel(level);
  const pct = Math.min((xpIntoLevel / needed) * 100, 100);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full xp-bar-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-amber-400 text-xs font-mono">{xpIntoLevel}/{needed}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">XP</span>
        <span className="text-xs text-amber-400 font-mono">
          {xpIntoLevel} / {needed}
        </span>
      </div>
      <div className="h-2.5 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/40">
        <div
          className="h-full rounded-full xp-bar-fill"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 60%, #fde68a 100%)',
            boxShadow: '0 0 8px rgba(251, 191, 36, 0.5)',
          }}
        />
      </div>
    </div>
  );
}

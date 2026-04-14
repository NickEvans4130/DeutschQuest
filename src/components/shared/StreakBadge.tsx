import { Flame, Shield } from 'lucide-react';
import { useStreakStore } from '../../store/useStreakStore';

export function StreakBadge({ compact = false }: { compact?: boolean }) {
  const { currentStreak, hasShieldAvailable } = useStreakStore();
  const shieldAvailable = hasShieldAvailable();

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Flame size={16} className="text-orange-400" />
        <span className="text-orange-300 font-bold text-sm">{currentStreak}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2">
      <Flame size={20} className="text-orange-400" />
      <div className="flex flex-col">
        <span className="text-orange-300 font-bold text-lg leading-none">{currentStreak}</span>
        <span className="text-slate-500 text-[10px] leading-none">
          {currentStreak === 1 ? 'day streak' : 'day streak'}
        </span>
      </div>
      {shieldAvailable && (
        <div className="ml-1 flex items-center gap-1 bg-indigo-500/20 rounded-lg px-1.5 py-0.5">
          <Shield size={12} className="text-indigo-400" />
          <span className="text-indigo-300 text-[10px]">shield</span>
        </div>
      )}
    </div>
  );
}

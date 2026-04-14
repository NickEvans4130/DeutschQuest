import { useLocation } from 'react-router-dom';
import { LevelBadge } from '../rpg/LevelBadge';
import { StreakBadge } from '../shared/StreakBadge';
import { usePlayerStore } from '../../store/usePlayerStore';

const TITLES: Record<string, string> = {
  '/': 'DeutschQuest',
  '/session': 'Daily Session',
  '/progress': 'Progress',
  '/settings': 'Settings',
};

export function Header() {
  const location = useLocation();
  const player = usePlayerStore((s) => s.player);
  const title = TITLES[location.pathname] ?? 'DeutschQuest';

  if (location.pathname === '/session') return null; // Session has its own header

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          {player && <LevelBadge level={player.level} size="sm" />}
          <span className="text-slate-100 font-semibold text-base">{title}</span>
        </div>
        <StreakBadge compact />
      </div>
    </header>
  );
}

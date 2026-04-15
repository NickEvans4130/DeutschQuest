import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';
import { useSessionStore } from '../store/useSessionStore';
import { useStreakStore } from '../store/useStreakStore';
import { useWordBankStore } from '../store/useWordBankStore';
import { CharacterCard } from '../components/rpg/CharacterCard';
import { StatPanel } from '../components/rpg/StatPanel';
import { StreakBadge } from '../components/shared/StreakBadge';
import { Button } from '../components/shared/Button';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { loadDailyContent } from '../lib/contentPipeline';
import { getLevelTitle } from '../types/player';
import { BookOpen, Layers, CheckCircle, Zap } from 'lucide-react';

export function HomeScreen() {
  const navigate = useNavigate();
  const player = usePlayerStore((s) => s.player);
  const {
    setDailyContent,
    setLoadingContent,
    setLoadError,
    isLoadingContent,
    loadError,
    hasCompletedToday,
    startSession,
    activeSession,
  } = useSessionStore();
  const { currentStreak, milestones } = useStreakStore();
  const { getAllCards, getDueCount } = useWordBankStore();

  const [contentReady, setContentReady] = useState(false);

  const completedToday = hasCompletedToday();
  const totalWords = getAllCards().length;
  const dueCount = getDueCount();

  useEffect(() => {
    async function fetchContent() {
      setLoadingContent(true);
      try {
        const { content, source } = await loadDailyContent(
          player?.interests ?? [],
          player?.cefrOverride ?? 'A2',
          player?.dialectIntensity ?? 'occasional'
        );
        setDailyContent(content, source);
        setContentReady(true);
      } catch {
        setLoadError('Failed to load content. Using fallback.');
        setContentReady(true);
      } finally {
        setLoadingContent(false);
      }
    }

    if (!contentReady) fetchContent();
  }, []);

  const handleStartSession = () => {
    startSession();
    navigate('/session');
  };

  if (!player) return null;

  const levelTitle = getLevelTitle(player.level);

  return (
    <div className="flex flex-col gap-4 p-4 pb-6">
      {/* Character card */}
      <CharacterCard />

      {/* Streak + quick stats row */}
      <div className="flex gap-2">
        <StreakBadge />
        <div className="flex-1 flex gap-2">
          <div className="flex-1 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 text-center">
            <p className="text-slate-100 font-bold text-lg">{totalWords}</p>
            <p className="text-slate-500 text-[10px]">words learned</p>
          </div>
          <div className="flex-1 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 text-center">
            <p className="text-slate-100 font-bold text-lg">{player.totalSessionsCompleted}</p>
            <p className="text-slate-500 text-[10px]">sessions</p>
          </div>
        </div>
      </div>

      {/* Milestone badges */}
      {milestones.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {milestones.includes(7) && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
              <span className="text-sm select-none">🔥</span>
              <span className="text-orange-300 text-xs font-medium">7-day streak</span>
            </div>
          )}
          {milestones.includes(30) && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
              <span className="text-sm select-none">⚡</span>
              <span className="text-amber-300 text-xs font-medium">30-day streak</span>
            </div>
          )}
          {milestones.includes(100) && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
              <span className="text-sm select-none">👑</span>
              <span className="text-purple-300 text-xs font-medium">100-day streak</span>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">Your Stats</p>
        <StatPanel stats={player.stats} />
      </div>

      {/* Session CTA */}
      {isLoadingContent ? (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-900/30 to-slate-900 border border-amber-500/40 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <p className="text-amber-300 font-semibold">
                {completedToday ? 'Keep going!' : "Today's Quest Awaits"}
              </p>
            </div>
            {completedToday && (
              <div className="flex items-center gap-1.5 bg-emerald-900/40 border border-emerald-600/40 rounded-lg px-2 py-1">
                <CheckCircle size={12} className="text-emerald-400" />
                <span className="text-emerald-300 text-xs">Streak secured</span>
              </div>
            )}
          </div>
          <div className="flex gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1"><BookOpen size={12} /> News</span>
            <span className="flex items-center gap-1"><Layers size={12} /> Flashcards</span>
            <span className="flex items-center gap-1">🗣️ Dialect</span>
          </div>
          {dueCount > 0 && (
            <p className="text-slate-500 text-xs">{dueCount} cards due for review</p>
          )}
          {loadError && (
            <p className="text-orange-400 text-xs">⚠ Using offline fallback content</p>
          )}
          <Button variant="primary" size="lg" fullWidth onClick={handleStartSession}>
            {completedToday ? 'Start another session' : "Start today's session"}
          </Button>
        </div>
      )}

      {/* Level info footer */}
      <div className="text-center pt-2">
        <p className="text-slate-500 text-xs">
          Level {player.level} · {levelTitle} · {player.characterClass}
        </p>
      </div>
    </div>
  );
}

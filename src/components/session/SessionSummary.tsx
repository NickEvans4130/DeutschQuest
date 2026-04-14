import type { ModuleResult } from '../../types/session';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useStreakStore } from '../../store/useStreakStore';
import { calculateSessionXP, statDeltaFromModule } from '../../lib/xp';
import { Button } from '../shared/Button';
import { XPBar } from '../rpg/XPBar';
import { Star, Flame, BookOpen, Layers, Volume2 } from 'lucide-react';

const MODULE_ICONS: Record<string, React.ElementType> = {
  news: BookOpen,
  flashcard1: Layers,
  dialect: Volume2,
  flashcard2: Layers,
};

interface SessionSummaryProps {
  results: ModuleResult[];
  currentStreak: number;
  onComplete: () => void;
}

export function SessionSummary({ results, currentStreak, onComplete }: SessionSummaryProps) {
  const player = usePlayerStore((s) => s.player);
  const scores = results.map((r) => r.score);
  const xpEarned = calculateSessionXP(scores, currentStreak);
  const totalWords = results.reduce((acc, r) => acc + r.wordsAdded, 0);

  const statDeltas = results.reduce(
    (acc, r) => {
      const d = statDeltaFromModule(r.moduleType, r.score, r.correctAnswers);
      return {
        vocabulary: acc.vocabulary + d.vocabulary,
        listening: acc.listening + d.listening,
        reading: acc.reading + d.reading,
        grammar: acc.grammar + d.grammar,
      };
    },
    { vocabulary: 0, listening: 0, reading: 0, grammar: 0 }
  );

  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  return (
    <div className="flex flex-col gap-6 p-4 animate-fade-in-up">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-900/30 to-slate-900 border border-amber-500/40 rounded-2xl p-6 text-center space-y-2">
        <div className="flex justify-center mb-2">
          {[0, 1, 2].map((i) => (
            <Star
              key={i}
              size={28}
              className={avgScore >= (i + 1) / 3 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
            />
          ))}
        </div>
        <p className="text-slate-400 text-sm">Session complete!</p>
        <p className="text-amber-300 text-4xl font-bold">+{xpEarned} XP</p>
        <div className="flex items-center justify-center gap-1.5 text-orange-400 text-sm">
          <Flame size={16} />
          <span>{currentStreak + 1} day streak</span>
        </div>
      </div>

      {/* XP bar */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-2">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Level Progress</p>
        <XPBar />
      </div>

      {/* Module results */}
      <div className="space-y-2">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide px-1">Module Results</p>
        {results.map((r, i) => {
          const Icon = MODULE_ICONS[r.moduleType] ?? Layers;
          return (
            <div
              key={i}
              className="flex items-center gap-3 bg-slate-800/40 border border-slate-700/60 rounded-xl px-4 py-3"
            >
              <Icon size={16} className="text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-sm font-medium capitalize">
                  {r.moduleType.replace('flashcard1', 'Flashcards (new)').replace('flashcard2', 'Flashcards (review)')}
                </p>
                {r.totalAnswers > 0 && (
                  <p className="text-slate-500 text-xs">
                    {r.correctAnswers}/{r.totalAnswers} correct
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-emerald-400 text-sm font-semibold">
                  {Math.round(r.score * 100)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stat deltas */}
      {Object.values(statDeltas).some((v) => v > 0) && (
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">Stat Gains</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(statDeltas) as [string, number][])
              .filter(([, v]) => v > 0)
              .map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs capitalize">{key}</span>
                  <span className="text-emerald-400 text-xs font-semibold">+{val}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {totalWords > 0 && (
        <p className="text-slate-400 text-sm text-center">
          {totalWords} new word{totalWords !== 1 ? 's' : ''} added to your word bank
        </p>
      )}

      <Button variant="primary" size="lg" fullWidth onClick={onComplete}>
        Back to Home
      </Button>
    </div>
  );
}

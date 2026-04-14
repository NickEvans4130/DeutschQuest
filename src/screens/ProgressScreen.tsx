import { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useSessionStore } from '../store/useSessionStore';
import { useWordBankStore } from '../store/useWordBankStore';
import { useStreakStore } from '../store/useStreakStore';
import { StatPentagon } from '../components/rpg/StatPanel';
import { LevelBadge } from '../components/rpg/LevelBadge';
import { getLevelTitle, LEVEL_TITLES } from '../types/player';
import { todayISO, addDays } from '../lib/srs';
import { Badge } from '../components/shared/Badge';
import { FlashCard } from '../components/modules/flashcard/FlashCard';
import { Search } from 'lucide-react';
import type { WordBankEntry } from '../store/useWordBankStore';

const TABS = ['Overview', 'Word Bank', 'History'] as const;
type Tab = typeof TABS[number];

// 30-day streak heatmap
function StreakHeatmap() {
  const { sessionHistory } = useSessionStore();
  const sessionDates = new Set(sessionHistory.map((s) => s.date));
  const today = todayISO();

  const days = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(today, -(29 - i));
    return { date, active: sessionDates.has(date) };
  });

  return (
    <div className="flex gap-1 flex-wrap">
      {days.map(({ date, active }) => (
        <div
          key={date}
          title={date}
          className={`w-6 h-6 rounded-sm transition-colors ${
            active ? 'bg-amber-500' : 'bg-slate-700'
          } ${date === today ? 'ring-1 ring-amber-300' : ''}`}
        />
      ))}
    </div>
  );
}

// Level timeline
function LevelTimeline({ currentLevel }: { currentLevel: number }) {
  const milestones = [1, 5, 10, 20, 30, 40, 50];
  return (
    <div className="relative">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-700" />
      <div className="space-y-3 pl-8">
        {milestones.map((lvl) => {
          const reached = currentLevel >= lvl;
          return (
            <div key={lvl} className="relative flex items-center gap-3">
              <div
                className={`absolute -left-5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  reached
                    ? 'bg-amber-500 border-amber-400'
                    : 'bg-slate-800 border-slate-600'
                }`}
              >
                {reached && <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />}
              </div>
              <div>
                <span className={`text-sm font-medium ${reached ? 'text-amber-300' : 'text-slate-500'}`}>
                  Level {lvl}
                </span>
                <span className={`text-xs ml-2 ${reached ? 'text-slate-400' : 'text-slate-600'}`}>
                  {LEVEL_TITLES[lvl]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Word bank card row
function WordRow({ entry, onFlip }: { entry: WordBankEntry; onFlip: (id: string) => void }) {
  const today = todayISO();
  const cardIsDue = entry.dueDate <= today;

  return (
    <button
      onClick={() => onFlip(entry.id)}
      className="w-full text-left flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 hover:border-slate-600 transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          {entry.article && <span className="text-amber-400 text-xs">{entry.article}</span>}
          <span className="text-slate-100 font-medium truncate">{entry.german}</span>
        </div>
        <span className="text-slate-400 text-sm truncate">{entry.english}</span>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {cardIsDue && (
          <Badge color="orange" size="xs">Due</Badge>
        )}
        <span className="text-slate-600 text-[10px]">+{entry.interval ?? 0}d</span>
      </div>
    </button>
  );
}

export function ProgressScreen() {
  const [tab, setTab] = useState<Tab>('Overview');
  const [search, setSearch] = useState('');
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const player = usePlayerStore((s) => s.player);
  const { sessionHistory } = useSessionStore();
  const { getAllCards, searchCards, getDueCount } = useWordBankStore();
  const { longestStreak } = useStreakStore();

  if (!player) return null;

  const allCards = getAllCards();
  const dueCount = getDueCount();
  const filteredCards = search.trim() ? searchCards(search) : allCards;
  const flippedCard = flippedId ? allCards.find((c) => c.id === flippedId) : null;

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === t
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t}
            {t === 'Word Bank' && dueCount > 0 && (
              <span className="ml-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {dueCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Overview */}
        {tab === 'Overview' && (
          <div className="space-y-4 animate-fade-in-up">
            {/* Level timeline */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-4">Level Journey</p>
              <LevelTimeline currentLevel={player.level} />
            </div>

            {/* Stat pentagon */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col items-center">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-4 self-start">Stat Profile</p>
              <StatPentagon stats={player.stats} />
            </div>

            {/* Streak heatmap */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">30-Day Activity</p>
                <span className="text-slate-300 text-xs">Best: {longestStreak} days</span>
              </div>
              <StreakHeatmap />
            </div>
          </div>
        )}

        {/* Word Bank */}
        {tab === 'Word Bank' && (
          <div className="space-y-3 animate-fade-in-up">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search words..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <p className="text-slate-500 text-xs">{filteredCards.length} words</p>

            {/* Flip modal */}
            {flippedCard && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80" onClick={() => setFlippedId(null)}>
                <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                  <FlashCard
                    card={flippedCard}
                    onRate={() => setFlippedId(null)}
                  />
                </div>
              </div>
            )}

            {filteredCards.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-slate-400 text-lg">📚</p>
                <p className="text-slate-400">No words yet</p>
                <p className="text-slate-500 text-sm">Complete a session to start building your word bank</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCards.map((entry) => (
                  <WordRow key={entry.id} entry={entry} onFlip={setFlippedId} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* History */}
        {tab === 'History' && (
          <div className="space-y-3 animate-fade-in-up">
            {sessionHistory.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-slate-400 text-lg">📅</p>
                <p className="text-slate-400">No sessions yet</p>
                <p className="text-slate-500 text-sm">Complete your first session to see history</p>
              </div>
            ) : (
              sessionHistory.map((record) => (
                <div
                  key={record.id}
                  className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 font-medium text-sm">
                      {new Date(record.date).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-amber-400 font-bold text-sm">+{record.xpEarned} XP</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {record.modulesCompleted.map((mod) => (
                      <Badge key={mod} color="slate" size="xs">
                        {mod.replace('flashcard1', 'cards').replace('flashcard2', 'review')}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

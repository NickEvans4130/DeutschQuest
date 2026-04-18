import { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useSessionStore } from '../store/useSessionStore';
import { useWordBankStore } from '../store/useWordBankStore';
import { useStreakStore } from '../store/useStreakStore';
import { StatPentagon } from '../components/rpg/StatPanel';
import { LEVEL_TITLES } from '../types/player';
import { todayISO, addDays } from '../lib/srs';
import { Badge } from '../components/shared/Badge';
import { Button } from '../components/shared/Button';
import { Modal } from '../components/shared/Modal';
import { FlashCard } from '../components/modules/flashcard/FlashCard';
import { CardStack } from '../components/modules/flashcard/CardStack';
import { Search, Plus, Layers, CheckCircle, X } from 'lucide-react';
import type { WordBankEntry } from '../store/useWordBankStore';
import type { FlashcardTag } from '../types/content';

const TABS = ['Overview', 'Word Bank', 'History'] as const;
type Tab = typeof TABS[number];

const ALL_TAGS: FlashcardTag[] = ['noun', 'verb', 'adjective', 'adverb', 'phrase', 'bavarian', 'formal', 'informal'];
const TAG_COLORS: Record<FlashcardTag, 'indigo' | 'teal' | 'purple' | 'amber' | 'orange' | 'slate'> = {
  noun: 'indigo', verb: 'teal', adjective: 'purple', adverb: 'amber',
  phrase: 'orange', bavarian: 'amber', formal: 'slate', informal: 'slate',
};

// ─── Streak heatmap ──────────────────────────────────────────────────────────

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
          className={`w-6 h-6 rounded-sm transition-colors ${active ? 'bg-amber-500' : 'bg-slate-700'} ${date === today ? 'ring-1 ring-amber-300' : ''}`}
        />
      ))}
    </div>
  );
}

// ─── Level timeline ───────────────────────────────────────────────────────────

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
              <div className={`absolute -left-5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${reached ? 'bg-amber-500 border-amber-400' : 'bg-slate-800 border-slate-600'}`}>
                {reached && <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />}
              </div>
              <div>
                <span className={`text-sm font-medium ${reached ? 'text-amber-300' : 'text-slate-500'}`}>Level {lvl}</span>
                <span className={`text-xs ml-2 ${reached ? 'text-slate-400' : 'text-slate-600'}`}>{LEVEL_TITLES[lvl]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Word row ─────────────────────────────────────────────────────────────────

function WordRow({ entry, onFlip }: { entry: WordBankEntry; onFlip: (id: string) => void }) {
  const cardIsDue = entry.dueDate <= todayISO();
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
        {cardIsDue && <Badge color="orange" size="xs">Due</Badge>}
        <span className="text-slate-600 text-[10px]">+{entry.interval}d</span>
      </div>
    </button>
  );
}

// ─── Add word modal ───────────────────────────────────────────────────────────

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddWordModal({ isOpen, onClose }: AddWordModalProps) {
  const addCard = useWordBankStore((s) => s.addCard);
  const [german, setGerman] = useState('');
  const [english, setEnglish] = useState('');
  const [article, setArticle] = useState<'der' | 'die' | 'das' | ''>('');
  const [example, setExample] = useState('');
  const [tags, setTags] = useState<FlashcardTag[]>([]);

  const toggleTag = (tag: FlashcardTag) =>
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const handleSubmit = () => {
    if (!german.trim() || !english.trim()) return;
    addCard({
      id: `custom-${Date.now()}`,
      german: german.trim(),
      english: english.trim(),
      article: article || null,
      example: example.trim(),
      tags: tags.length > 0 ? tags : ['phrase'],
      difficulty: 1,
    });
    setGerman(''); setEnglish(''); setArticle(''); setExample(''); setTags([]);
    onClose();
  };

  const inputClass = 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500 transition-colors';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add word">
      <div className="space-y-3">
        <div className="flex gap-2">
          <select
            value={article}
            onChange={(e) => setArticle(e.target.value as typeof article)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500 transition-colors w-24"
          >
            <option value="">—</option>
            <option value="der">der</option>
            <option value="die">die</option>
            <option value="das">das</option>
          </select>
          <input
            type="text"
            value={german}
            onChange={(e) => setGerman(e.target.value)}
            placeholder="German word *"
            className={`${inputClass} flex-1`}
          />
        </div>
        <input
          type="text"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          placeholder="English meaning *"
          className={inputClass}
        />
        <input
          type="text"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="Example sentence (optional)"
          className={inputClass}
        />
        <div className="space-y-1.5">
          <p className="text-slate-400 text-xs">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium border transition-all ${
                  tags.includes(tag)
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          fullWidth
          disabled={!german.trim() || !english.trim()}
          onClick={handleSubmit}
        >
          Add to word bank
        </Button>
      </div>
    </Modal>
  );
}

// ─── Practice overlay ─────────────────────────────────────────────────────────

interface PracticeResult { score: number; correct: number; total: number }

function PracticeOverlay({ cards, onClose }: { cards: WordBankEntry[]; onClose: (result?: PracticeResult) => void }) {
  const [result, setResult] = useState<PracticeResult | null>(null);

  if (result) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center gap-6 p-6 animate-fade-in-up">
        <CheckCircle size={48} className="text-emerald-400" />
        <div className="text-center space-y-1">
          <p className="text-slate-100 text-2xl font-bold">{result.correct}/{result.total}</p>
          <p className="text-slate-400">cards correct</p>
          <p className="text-amber-400 font-semibold mt-2">{Math.round(result.score * 100)}% accuracy</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => onClose(result)}>
          Back to Word Bank
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <p className="text-slate-100 font-semibold">Practice</p>
        <button onClick={() => onClose()} className="text-slate-400 hover:text-slate-200 transition-colors p-1">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <CardStack
          cards={cards}
          onComplete={(score, correct) => setResult({ score, correct, total: cards.length })}
          emptyMessage="No cards to practice"
        />
      </div>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function ProgressScreen() {
  const [tab, setTab] = useState<Tab>('Overview');
  const [search, setSearch] = useState('');
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [addWordOpen, setAddWordOpen] = useState(false);
  const [practiceCards, setPracticeCards] = useState<WordBankEntry[] | null>(null);

  const player = usePlayerStore((s) => s.player);
  const { sessionHistory } = useSessionStore();
  const { getAllCards, getDueCards, searchCards, getDueCount } = useWordBankStore();
  const { longestStreak } = useStreakStore();

  if (!player) return null;

  const allCards = getAllCards();
  const dueCount = getDueCount();
  const filteredCards = search.trim() ? searchCards(search) : allCards;
  const flippedCard = flippedId ? allCards.find((c) => c.id === flippedId) : null;

  const handleStartPractice = () => {
    const due = getDueCards(20);
    if (due.length > 0) {
      setPracticeCards(due);
    } else {
      // No due cards — shuffle all and take up to 10
      const shuffled = [...allCards].sort(() => Math.random() - 0.5).slice(0, 10);
      setPracticeCards(shuffled);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Practice overlay */}
      {practiceCards && (
        <PracticeOverlay cards={practiceCards} onClose={() => setPracticeCards(null)} />
      )}

      {/* Add word modal */}
      <AddWordModal isOpen={addWordOpen} onClose={() => setAddWordOpen(false)} />

      {/* Flip modal */}
      {flippedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80"
          onClick={() => setFlippedId(null)}
        >
          <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <FlashCard card={flippedCard} onRate={() => setFlippedId(null)} />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === t ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-500 hover:text-slate-300'
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

        {/* ── Overview ── */}
        {tab === 'Overview' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-4">Level Journey</p>
              <LevelTimeline currentLevel={player.level} />
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col items-center">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-4 self-start">Stat Profile</p>
              <StatPentagon stats={player.stats} />
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">30-Day Activity</p>
                <span className="text-slate-300 text-xs">Best: {longestStreak} days</span>
              </div>
              <StreakHeatmap />
            </div>
          </div>
        )}

        {/* ── Word Bank ── */}
        {tab === 'Word Bank' && (
          <div className="space-y-3 animate-fade-in-up">

            {/* Action bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search words..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <button
                onClick={() => setAddWordOpen(true)}
                className="flex items-center justify-center w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-all flex-shrink-0"
                title="Add word"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Practice button */}
            {allCards.length > 0 && (
              <button
                onClick={handleStartPractice}
                className="w-full flex items-center gap-3 bg-indigo-900/30 border border-indigo-600/40 rounded-xl px-4 py-3 hover:border-indigo-500/60 transition-all"
              >
                <Layers size={16} className="text-indigo-400 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-indigo-200 text-sm font-medium">
                    Practice flashcards
                  </p>
                  <p className="text-indigo-400/70 text-xs">
                    {dueCount > 0 ? `${dueCount} due for review` : `${Math.min(allCards.length, 10)} random cards`}
                  </p>
                </div>
                <Badge color="indigo" size="xs">{dueCount > 0 ? dueCount : allCards.length}</Badge>
              </button>
            )}

            <p className="text-slate-500 text-xs">{filteredCards.length} words</p>

            {filteredCards.length === 0 && !search ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-3xl">📚</p>
                <p className="text-slate-400 font-medium">No words yet</p>
                <p className="text-slate-500 text-sm">Complete a session or tap + to add your own</p>
                <Button variant="secondary" size="sm" onClick={() => setAddWordOpen(true)}>
                  <Plus size={14} /> Add your first word
                </Button>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No results for "{search}"</p>
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

        {/* ── History ── */}
        {tab === 'History' && (
          <div className="space-y-3 animate-fade-in-up">
            {sessionHistory.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-3xl">📅</p>
                <p className="text-slate-400">No sessions yet</p>
                <p className="text-slate-500 text-sm">Complete your first session to see history</p>
              </div>
            ) : (
              sessionHistory.map((record) => (
                <div key={record.id} className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 font-medium text-sm">
                      {new Date(record.date).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}
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

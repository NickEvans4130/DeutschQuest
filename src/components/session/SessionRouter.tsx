import { useSessionStore } from '../../store/useSessionStore';
import { useWordBankStore } from '../../store/useWordBankStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useStreakStore } from '../../store/useStreakStore';
import { NewsReader } from '../modules/news/NewsReader';
import { CardStack } from '../modules/flashcard/CardStack';
import { DialectCard } from '../modules/dialect/DialectCard';
import { SessionSummary } from './SessionSummary';
import type { ModuleResult } from '../../types/session';
import { calculateSessionXP, statDeltaFromModule, clampStat } from '../../lib/xp';
import { todayISO } from '../../lib/srs';
import { useNavigate } from 'react-router-dom';
import type { PlayerStats } from '../../types/player';

export function SessionRouter() {
  const navigate = useNavigate();
  const {
    dailyContent,
    activeSession,
    completeModule,
    advanceModule,
    finishSession,
  } = useSessionStore();

  const { getDueCards, addCards, getAllCards } = useWordBankStore();
  const { addXP, addStatDeltas, incrementWordsLearned, incrementSessions } = usePlayerStore();
  const { recordSession, currentStreak } = useStreakStore();

  if (!activeSession || !dailyContent) return null;

  const { currentModuleIndex, modules, results } = activeSession;
  const currentModule = modules[currentModuleIndex];

  const handleModuleComplete = (moduleType: string, score: number, extra?: { wordsAdded?: number; correct?: number; total?: number; grammarCorrect?: number }) => {
    const result: ModuleResult = {
      moduleType: moduleType as ModuleResult['moduleType'],
      score,
      wordsAdded: extra?.wordsAdded ?? 0,
      correctAnswers: extra?.correct ?? 0,
      totalAnswers: extra?.total ?? 0,
      completedAt: new Date().toISOString(),
    };
    completeModule(result);
    advanceModule();
  };

  const handleNewsComplete = (score: number) => {
    // Add news vocab cards to word bank
    const vocabCards = dailyContent.news.vocab.map((v, i) => ({
      id: `news-vocab-${todayISO()}-${i}`,
      german: v.article ? `${v.article} ${v.word}` : v.word,
      english: v.english,
      article: v.article as never,
      example: v.example,
      tags: ['noun' as const],
      difficulty: 1 as const,
    }));
    // Also seed today's daily flashcards into the word bank now (safe: inside event handler)
    addCards([...vocabCards, ...dailyContent.flashcards]);
    handleModuleComplete('news', score, { wordsAdded: vocabCards.length });
  };

  const handleFlashcard1Complete = (score: number, correct: number, grammarCorrect: number) => {
    const total = Math.min(dailyContent.flashcards.length + 2, 8);
    handleModuleComplete('flashcard1', score, { correct, total, grammarCorrect });
  };

  const handleDialectComplete = (score: number) => {
    handleModuleComplete('dialect', score);
  };

  const handleFlashcard2Complete = (score: number, correct: number, grammarCorrect: number) => {
    const dueCards = getDueCards(8);
    handleModuleComplete('flashcard2', score, { correct, total: dueCards.length, grammarCorrect });
  };

  const handleSummaryComplete = () => {
    // Calculate XP and stat deltas
    const scores = results.map((r) => r.score);
    const xp = calculateSessionXP(scores, currentStreak);

    const statDeltas = results.reduce(
      (acc, r) => {
        const delta = statDeltaFromModule(r.moduleType, r.score, r.correctAnswers);
        return {
          vocabulary: clampStat(acc.vocabulary + delta.vocabulary),
          listening: clampStat(acc.listening + delta.listening),
          reading: clampStat(acc.reading + delta.reading),
          grammar: clampStat(acc.grammar + delta.grammar),
        };
      },
      { vocabulary: 0, listening: 0, reading: 0, grammar: 0 } as PlayerStats
    );

    const totalWordsAdded = results.reduce((acc, r) => acc + r.wordsAdded, 0);

    finishSession(xp, statDeltas);
    addXP(xp);
    addStatDeltas(statDeltas);
    if (totalWordsAdded > 0) incrementWordsLearned(totalWordsAdded);
    incrementSessions();
    recordSession();

    navigate('/');
  };

  switch (currentModule) {
    case 'news':
      return <NewsReader news={dailyContent.news} onComplete={handleNewsComplete} />;

    case 'flashcard1': {
      // Daily flashcards were added to word bank in handleNewsComplete (safe, in event handler)
      // Round 1: all 6 daily cards + up to 2 due cards from previous sessions
      const dailyIds = new Set(dailyContent.flashcards.map((c) => c.id));
      const dueFromPrevious = getDueCards(10).filter((c) => !dailyIds.has(c.id)).slice(0, 2);
      const round1Cards = [...dailyContent.flashcards, ...dueFromPrevious];
      return (
        <CardStack
          cards={round1Cards}
          onComplete={handleFlashcard1Complete}
        />
      );
    }

    case 'dialect':
      return <DialectCard dialect={dailyContent.dialect} onComplete={handleDialectComplete} />;

    case 'flashcard2': {
      // Round 2: due cards excluding today's daily cards (those are due tomorrow after round 1)
      const dailyIds2 = new Set(dailyContent.flashcards.map((c) => c.id));
      const dueCards2 = getDueCards(8).filter((c) => !dailyIds2.has(c.id));
      return (
        <CardStack
          cards={dueCards2}
          onComplete={handleFlashcard2Complete}
          emptyMessage="No older cards due today"
        />
      );
    }

    case 'summary':
      return (
        <SessionSummary
          results={results}
          currentStreak={currentStreak}
          onComplete={handleSummaryComplete}
        />
      );

    default:
      return null;
  }
}

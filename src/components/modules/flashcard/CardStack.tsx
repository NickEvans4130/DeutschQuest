import { useEffect, useState } from 'react';
import type { Flashcard } from '../../../types/content';
import { FlashCard } from './FlashCard';
import { useWordBankStore } from '../../../store/useWordBankStore';
import { CheckCircle } from 'lucide-react';
import { Button } from '../../shared/Button';

interface CardStackProps {
  cards: Flashcard[];
  onComplete: (score: number, correctCount: number, grammarCorrect: number) => void;
  emptyMessage?: string;
}

export function CardStack({ cards, onComplete, emptyMessage }: CardStackProps) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<{ quality: 0 | 2 | 4 | 5 }[]>([]);
  const rateCard = useWordBankStore((s) => s.rateCard);

  // If cards is empty on mount, auto-complete with a perfect score
  // so the session can advance without freezing
  useEffect(() => {
    if (cards.length === 0) {
      onComplete(1.0, 0, 0);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRate = (quality: 0 | 2 | 4 | 5) => {
    const card = cards[index];
    rateCard(card.id, quality);
    const newResults = [...results, { quality }];
    setResults(newResults);

    if (index + 1 >= cards.length) {
      const correct = newResults.filter((r) => r.quality >= 4).length;
      const score = newResults.length > 0 ? correct / newResults.length : 0;
      const grammarCorrect = newResults.reduce((acc, r, i) => {
        const c = cards[i];
        return acc + (c.tags.includes('verb') || c.tags.includes('adjective') ? (r.quality >= 4 ? 1 : 0) : 0);
      }, 0);
      onComplete(score, correct, grammarCorrect);
    } else {
      setIndex((i) => i + 1);
    }
  };

  // Empty state — show a message while the useEffect fires onComplete
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center animate-fade-in-up">
        <CheckCircle size={40} className="text-emerald-400" />
        <div className="space-y-1">
          <p className="text-slate-100 font-semibold text-lg">
            {emptyMessage ?? 'All caught up!'}
          </p>
          <p className="text-slate-400 text-sm">No cards due for review right now.</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => onComplete(1.0, 0, 0)}>
          Continue
        </Button>
      </div>
    );
  }

  if (index >= cards.length) return null;

  const card = cards[index];
  const progress = index / cards.length;

  return (
    <div className="space-y-4">
      <div className="px-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-slate-400 text-xs">Card {index + 1} of {cards.length}</span>
          <span className="text-slate-400 text-xs">{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <FlashCard key={card.id} card={card} onRate={handleRate} />
    </div>
  );
}

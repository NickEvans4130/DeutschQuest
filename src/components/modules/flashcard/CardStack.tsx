import { useState } from 'react';
import type { Flashcard } from '../../../types/content';
import { FlashCard } from './FlashCard';
import { useWordBankStore } from '../../../store/useWordBankStore';

interface CardStackProps {
  cards: Flashcard[];
  onComplete: (score: number, correctCount: number, grammarCorrect: number) => void;
}

export function CardStack({ cards, onComplete }: CardStackProps) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<{ quality: 0 | 2 | 4 | 5 }[]>([]);
  const rateCard = useWordBankStore((s) => s.rateCard);

  const handleRate = (quality: 0 | 2 | 4 | 5) => {
    const card = cards[index];
    rateCard(card.id, quality);
    const newResults = [...results, { quality }];
    setResults(newResults);

    if (index + 1 >= cards.length) {
      // Done — compute score
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

  if (index >= cards.length) return null;

  const card = cards[index];
  const progress = index / cards.length;

  return (
    <div className="space-y-4">
      {/* Progress */}
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

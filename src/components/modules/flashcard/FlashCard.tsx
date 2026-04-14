import { useState } from 'react';
import type { Flashcard } from '../../../types/content';
import { Badge } from '../../shared/Badge';
import { Button } from '../../shared/Button';

const TAG_COLORS: Record<string, 'amber' | 'indigo' | 'teal' | 'purple' | 'slate' | 'orange'> = {
  noun: 'indigo',
  verb: 'teal',
  adjective: 'purple',
  adverb: 'amber',
  phrase: 'orange',
  bavarian: 'amber',
  formal: 'slate',
  informal: 'slate',
};

interface FlashCardProps {
  card: Flashcard;
  onRate: (quality: 0 | 2 | 4 | 5) => void;
}

export function FlashCard({ card, onRate }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (!flipped) setFlipped(true);
  };

  const handleRate = (quality: 0 | 2 | 4 | 5) => {
    setFlipped(false);
    // Small delay so flip animation resets before next card
    setTimeout(() => onRate(quality), 50);
  };

  return (
    <div className="px-4 animate-fade-in-up">
      {/* Card */}
      <div className="card-flip w-full mb-4" style={{ height: 220 }}>
        <div
          className={`card-flip-inner w-full h-full cursor-pointer ${flipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          {/* Front */}
          <div className="card-face absolute inset-0 bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
            <div className="flex gap-1.5 flex-wrap justify-center">
              {card.tags.map((tag) => (
                <Badge key={tag} color={TAG_COLORS[tag] ?? 'slate'} size="xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-center">
              {card.article && (
                <p className="text-amber-400 text-lg font-medium mb-0.5">{card.article}</p>
              )}
              <p className="text-slate-100 text-3xl font-bold">{card.german}</p>
            </div>
            <p className="text-slate-500 text-xs mt-2">Tap to reveal</p>
          </div>

          {/* Back */}
          <div className="card-face card-back absolute inset-0 bg-slate-800 border border-amber-500/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
            <p className="text-amber-300 text-2xl font-bold">{card.english}</p>
            <p className="text-slate-400 text-sm italic text-center">„{card.example}"</p>
          </div>
        </div>
      </div>

      {/* Rating buttons — only visible after flip */}
      {flipped ? (
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleRate(0)}
            className="flex flex-col items-center gap-1 bg-red-900/40 hover:bg-red-900/60 border border-red-700/40 rounded-xl py-3 transition-all active:scale-95"
          >
            <span className="text-red-400 text-sm font-bold">Again</span>
            <span className="text-red-500 text-[10px]">+1d</span>
          </button>
          <button
            onClick={() => handleRate(2)}
            className="flex flex-col items-center gap-1 bg-orange-900/40 hover:bg-orange-900/60 border border-orange-700/40 rounded-xl py-3 transition-all active:scale-95"
          >
            <span className="text-orange-400 text-sm font-bold">Hard</span>
            <span className="text-orange-500 text-[10px]">+1d</span>
          </button>
          <button
            onClick={() => handleRate(4)}
            className="flex flex-col items-center gap-1 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/40 rounded-xl py-3 transition-all active:scale-95"
          >
            <span className="text-emerald-400 text-sm font-bold">Good</span>
            <span className="text-emerald-500 text-[10px]">+6d</span>
          </button>
          <button
            onClick={() => handleRate(5)}
            className="flex flex-col items-center gap-1 bg-sky-900/40 hover:bg-sky-900/60 border border-sky-700/40 rounded-xl py-3 transition-all active:scale-95"
          >
            <span className="text-sky-400 text-sm font-bold">Easy</span>
            <span className="text-sky-500 text-[10px]">+10d</span>
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-slate-500 text-sm">Tap the card to reveal the answer</p>
        </div>
      )}
    </div>
  );
}

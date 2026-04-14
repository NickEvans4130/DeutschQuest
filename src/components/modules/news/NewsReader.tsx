import { useState } from 'react';
import type { NewsContent, VocabItem } from '../../../types/content';
import { Button } from '../../shared/Button';
import { Badge } from '../../shared/Badge';
import { BookOpen } from 'lucide-react';

const TOPIC_COLORS: Record<string, 'amber' | 'teal' | 'indigo' | 'purple' | 'orange' | 'emerald'> = {
  politics: 'indigo',
  environment: 'teal',
  technology: 'purple',
  culture: 'orange',
  sport: 'emerald',
  local: 'amber',
};

function VocabCard({ item }: { item: VocabItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded((v) => !v)}
      className="w-full text-left bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 transition-all hover:border-amber-500/40"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          {item.article && (
            <span className="text-amber-400 text-xs font-medium">{item.article}</span>
          )}
          <span className="text-slate-100 font-semibold">{item.word}</span>
        </div>
        <span className="text-slate-300 text-sm">{item.english}</span>
      </div>
      {expanded && (
        <p className="mt-2 text-slate-400 text-sm italic border-t border-slate-700 pt-2">
          „{item.example}"
        </p>
      )}
    </button>
  );
}

interface NewsReaderProps {
  news: NewsContent;
  onComplete: (score: number) => void;
}

export function NewsReader({ news, onComplete }: NewsReaderProps) {
  const [showEnglish, setShowEnglish] = useState(false);
  const [step, setStep] = useState<'read' | 'vocab'>('read');

  return (
    <div className="flex flex-col gap-4 p-4 animate-fade-in-up">
      {/* Topic + headline */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-blue-400" />
          <Badge color={TOPIC_COLORS[news.topic] ?? 'slate'}>
            {news.topic.charAt(0).toUpperCase() + news.topic.slice(1)}
          </Badge>
        </div>
        <h2 className="text-slate-100 font-bold text-xl leading-snug">{news.headline}</h2>
      </div>

      {/* Body */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-3">
        <p className="text-slate-200 text-base leading-relaxed">{news.simplified}</p>
        <button
          onClick={() => setShowEnglish((v) => !v)}
          className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors underline underline-offset-2"
        >
          {showEnglish ? 'Hide' : 'Show'} English summary
        </button>
        {showEnglish && (
          <p className="text-slate-400 text-sm italic border-t border-slate-700 pt-2">
            {news.english_summary}
          </p>
        )}
      </div>

      {/* Vocab section */}
      {step === 'read' ? (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setStep('vocab')}
        >
          Review Vocabulary
        </Button>
      ) : (
        <>
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide px-1">
              Key words — tap to see examples
            </p>
            <div className="space-y-2">
              {news.vocab.map((item) => (
                <VocabCard key={item.word} item={item} />
              ))}
            </div>
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => onComplete(1.0)}
          >
            Continue
          </Button>
        </>
      )}
    </div>
  );
}

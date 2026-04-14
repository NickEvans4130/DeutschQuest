import { useState } from 'react';
import type { DialectContent } from '../../../types/content';
import { Button } from '../../shared/Button';
import { Badge } from '../../shared/Badge';
import { ChevronDown, ChevronUp, BookmarkPlus, MessageSquare, Info, Map } from 'lucide-react';
import { useWordBankStore } from '../../../store/useWordBankStore';

interface DialectCardProps {
  dialect: DialectContent;
  onComplete: (score: number) => void;
}

function Accordion({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-700/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-800/40 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-slate-400" />
          <span className="text-slate-300 text-sm font-medium">{title}</span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
      </button>
      {open && (
        <div className="px-4 py-3 bg-slate-900/40 border-t border-slate-700/60">
          {children}
        </div>
      )}
    </div>
  );
}

export function DialectCard({ dialect, onComplete }: DialectCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState(false);
  const addCard = useWordBankStore((s) => s.addCard);

  const handleSave = () => {
    addCard({
      id: `dialect-${Date.now()}`,
      german: dialect.bavarian,
      english: dialect.english,
      article: null,
      example: dialect.standard,
      tags: ['bavarian', 'phrase', 'informal'],
      difficulty: 2,
    });
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-4 p-4 animate-fade-in-up">
      {/* Bavarian phrase — hero */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 rounded-2xl p-6 text-center space-y-2">
        <Badge color="amber" size="sm">Bavarian Dialect</Badge>
        <p className="text-amber-300 text-4xl font-bold mt-3 leading-tight">{dialect.bavarian}</p>

        {!revealed ? (
          <Button
            variant="secondary"
            size="md"
            onClick={() => setRevealed(true)}
            className="mt-4"
          >
            Reveal Standard German
          </Button>
        ) : (
          <div className="mt-3 space-y-1.5 animate-fade-in-up">
            <p className="text-slate-300 text-xl font-medium">{dialect.standard}</p>
            <p className="text-slate-400 text-sm italic">{dialect.english}</p>
          </div>
        )}
      </div>

      {/* Accordions */}
      {revealed && (
        <div className="space-y-2 animate-fade-in-up">
          <Accordion title="Etymology" icon={Info}>
            <p className="text-slate-300 text-sm leading-relaxed">{dialect.etymology}</p>
          </Accordion>

          <Accordion title="When to use it" icon={Map}>
            <p className="text-slate-300 text-sm leading-relaxed">{dialect.usage}</p>
          </Accordion>

          <Accordion title="Example dialogue" icon={MessageSquare}>
            <div className="space-y-2">
              {dialect.example_dialogue.map((line, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${line.speaker === 'B' ? 'justify-end' : ''}`}
                >
                  <div
                    className={`rounded-xl px-3 py-2 max-w-[85%] ${
                      line.speaker === 'A'
                        ? 'bg-slate-700 text-slate-200 rounded-tl-none'
                        : 'bg-indigo-900/60 text-indigo-100 rounded-tr-none'
                    }`}
                  >
                    <p className="text-sm">{line.line}</p>
                  </div>
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      )}

      {/* Actions */}
      {revealed && (
        <div className="flex gap-2">
          <Button
            variant={saved ? 'ghost' : 'secondary'}
            size="md"
            onClick={handleSave}
            disabled={saved}
            className="flex-1"
          >
            <BookmarkPlus size={16} />
            {saved ? 'Saved!' : 'Save to Word Bank'}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => onComplete(1.0)}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}

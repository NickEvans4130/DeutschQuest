import { Check } from 'lucide-react';
import type { ModuleType } from '../../types/session';

const MODULE_LABELS: Record<ModuleType, string> = {
  news: 'News',
  flashcard1: 'Cards',
  dialect: 'Dialect',
  flashcard2: 'Review',
  summary: 'Summary',
};

interface ProgressStepperProps {
  modules: ModuleType[];
  currentIndex: number;
}

export function ProgressStepper({ modules, currentIndex }: ProgressStepperProps) {
  return (
    <div className="flex items-center px-4 py-3 gap-1">
      {modules.map((mod, idx) => {
        const isDone = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const isUpcoming = idx > currentIndex;

        return (
          <div key={mod} className="flex items-center gap-1 flex-1">
            {/* Step indicator */}
            <div className="flex flex-col items-center gap-0.5 min-w-[44px]">
              <div
                className={[
                  'w-7 h-7 rounded-full flex items-center justify-center transition-all',
                  isDone
                    ? 'bg-amber-500 text-slate-900'
                    : isCurrent
                    ? 'border-2 border-amber-500 text-amber-400 bg-slate-900 pulse-glow'
                    : 'w-2 h-2 bg-slate-700 rounded-full',
                ].join(' ')}
              >
                {isDone ? (
                  <Check size={14} strokeWidth={3} />
                ) : isCurrent ? (
                  <span className="text-xs font-bold">{idx + 1}</span>
                ) : null}
              </div>
              <span
                className={`text-[9px] font-medium leading-none ${
                  isDone || isCurrent ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {isUpcoming ? '' : MODULE_LABELS[mod]}
              </span>
            </div>
            {/* Connector */}
            {idx < modules.length - 1 && (
              <div className="flex-1 h-px bg-slate-700 -mt-3">
                {isDone && <div className="h-full bg-amber-500" />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

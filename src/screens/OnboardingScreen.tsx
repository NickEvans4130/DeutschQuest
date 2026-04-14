import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';
import { CHARACTER_CLASSES } from '../types/player';
import type { CharacterClass } from '../types/player';
import { Button } from '../components/shared/Button';
import { Check, ChevronRight } from 'lucide-react';

const INTERESTS = [
  { id: 'politics', label: 'Politik', emoji: '🏛️' },
  { id: 'environment', label: 'Umwelt', emoji: '🌿' },
  { id: 'technology', label: 'Technik', emoji: '💻' },
  { id: 'culture', label: 'Kultur', emoji: '🎭' },
  { id: 'sport', label: 'Sport', emoji: '⚽' },
  { id: 'local', label: 'Lokal', emoji: '🏘️' },
];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const createPlayer = usePlayerStore((s) => s.createPlayer);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    if (!name.trim() || !selectedClass) return;
    createPlayer(name.trim(), selectedClass, interests);
    navigate('/');
  };

  return (
    <div className="app-container min-h-screen flex flex-col">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-8 pb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === step
                ? 'w-6 h-2 bg-amber-500'
                : i < step
                ? 'w-2 h-2 bg-amber-500/60'
                : 'w-2 h-2 bg-slate-700'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 px-4 pb-8 overflow-y-auto">
        {/* Step 0: Name + Class */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center space-y-2">
              <div className="text-5xl mb-3 animate-float select-none">ᛞ</div>
              <h1 className="text-2xl font-bold text-slate-100">Willkommen!</h1>
              <p className="text-slate-400 text-sm">Begin your German adventure</p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={24}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Class selection */}
            <div className="space-y-2">
              <p className="text-slate-300 text-sm font-medium">Choose your class</p>
              <div className="space-y-2">
                {CHARACTER_CLASSES.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedClass === cls.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-700 bg-slate-800/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl select-none">{cls.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-slate-100 font-semibold">{cls.name}</p>
                          {selectedClass === cls.id && (
                            <Check size={16} className="text-amber-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-amber-400/80 text-xs font-medium">{cls.germanName}</p>
                        <p className="text-slate-400 text-sm mt-1">{cls.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!name.trim() || !selectedClass}
              onClick={() => setStep(1)}
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        )}

        {/* Step 1: Interests */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-100">Your interests</h2>
              <p className="text-slate-400 text-sm">We'll personalise your daily news topic</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {INTERESTS.map((item) => {
                const selected = interests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                      selected
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                        : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-3xl select-none">{item.emoji}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                    {selected && <Check size={14} className="text-amber-400" />}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="lg" onClick={() => setStep(0)} className="flex-1">
                Back
              </Button>
              <Button variant="primary" size="lg" onClick={() => setStep(2)} className="flex-1">
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Explainer */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-100">Your daily session</h2>
              <p className="text-slate-400 text-sm">~10 minutes, every day</p>
            </div>

            <div className="space-y-3">
              {[
                { emoji: '📰', label: 'News Digest', desc: 'German news simplified to your level with key vocabulary' },
                { emoji: '🃏', label: 'Flashcards (new)', desc: '6 new words + 2 spaced-repetition reviews' },
                { emoji: '🗣️', label: 'Dialect Moment', desc: 'One authentic Bavarian phrase with etymology' },
                { emoji: '🔁', label: 'Flashcard Review', desc: 'Spaced repetition of your word bank' },
                { emoji: '🏆', label: 'Session Summary', desc: 'XP earned, stat gains, and progress' },
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-lg select-none">
                    {step.emoji}
                  </div>
                  <div>
                    <p className="text-slate-100 text-sm font-semibold">{step.label}</p>
                    <p className="text-slate-400 text-xs">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="lg" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button variant="primary" size="lg" onClick={handleFinish} className="flex-1">
                Begin your quest!
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

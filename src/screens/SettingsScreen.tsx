import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';
import { useStreakStore } from '../store/useStreakStore';
import { useWordBankStore } from '../store/useWordBankStore';
import { useSessionStore } from '../store/useSessionStore';
import { CHARACTER_CLASSES } from '../types/player';
import type { CharacterClass } from '../types/player';
import { Modal } from '../components/shared/Modal';
import { Button } from '../components/shared/Button';
import { Check, ChevronRight, AlertTriangle } from 'lucide-react';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;
const INTERESTS = [
  { id: 'politics', label: 'Politik' },
  { id: 'environment', label: 'Umwelt' },
  { id: 'technology', label: 'Technik' },
  { id: 'culture', label: 'Kultur' },
  { id: 'sport', label: 'Sport' },
  { id: 'local', label: 'Lokal' },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-slate-400 text-xs font-medium uppercase tracking-wide px-1 pt-2">{children}</p>
  );
}

function SettingRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 hover:border-slate-600 transition-colors"
    >
      <span className="text-slate-200 text-sm">{label}</span>
      <div className="flex items-center gap-2 text-slate-400">
        {value && <span className="text-sm">{value}</span>}
        {onClick && <ChevronRight size={16} />}
      </div>
    </button>
  );
}

export function SettingsScreen() {
  const navigate = useNavigate();
  const player = usePlayerStore((s) => s.player);
  const { updateSettings, resetProgress } = usePlayerStore();
  const { resetStreak } = useStreakStore();
  const { clearAll } = useWordBankStore();

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);

  if (!player) return null;

  const handleReset = () => {
    resetProgress();
    resetStreak();
    clearAll();
    setResetModalOpen(false);
    navigate('/onboarding');
  };

  const handleCEFR = (level: typeof CEFR_LEVELS[number]) => {
    updateSettings({ cefrOverride: level });
  };

  const handleDialect = (intensity: 'off' | 'occasional' | 'frequent') => {
    updateSettings({ dialectIntensity: intensity });
  };

  const handleInterestToggle = (id: string) => {
    const current = player.interests;
    const next = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];
    updateSettings({ interests: next });
  };

  const handleClassSelect = (cls: CharacterClass) => {
    updateSettings({ characterClass: cls });
    setClassModalOpen(false);
  };

  const currentClassInfo = CHARACTER_CLASSES.find((c) => c.id === player.characterClass);

  return (
    <div className="flex flex-col gap-3 p-4 pb-8">
      {/* Account */}
      <SectionTitle>Character</SectionTitle>
      <SettingRow label="Name" value={player.name} />
      <button
        onClick={() => setClassModalOpen(true)}
        className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 hover:border-slate-600 transition-colors"
      >
        <span className="text-slate-200 text-sm">Class</span>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-sm">{currentClassInfo?.germanName}</span>
          <ChevronRight size={16} />
        </div>
      </button>

      {/* CEFR */}
      <SectionTitle>CEFR Level</SectionTitle>
      <div className="flex gap-2">
        {CEFR_LEVELS.map((lvl) => (
          <button
            key={lvl}
            onClick={() => handleCEFR(lvl)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              player.cefrOverride === lvl
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Dialect intensity */}
      <SectionTitle>Dialect Intensity</SectionTitle>
      <div className="flex gap-2">
        {(['off', 'occasional', 'frequent'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => handleDialect(opt)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
              player.dialectIntensity === opt
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Interests */}
      <SectionTitle>Topic Interests</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {INTERESTS.map((item) => {
          const selected = player.interests.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleInterestToggle(item.id)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                selected
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <span>{item.label}</span>
              {selected && <Check size={12} className="text-amber-400" />}
            </button>
          );
        })}
      </div>

      {/* Reset */}
      <SectionTitle>Danger Zone</SectionTitle>
      <button
        onClick={() => setResetModalOpen(true)}
        className="w-full flex items-center gap-3 bg-red-900/20 border border-red-700/40 rounded-xl px-4 py-3 hover:border-red-600 transition-colors"
      >
        <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
        <span className="text-red-300 text-sm font-medium">Reset all progress</span>
      </button>

      {/* Reset modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Progress"
      >
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            This will delete all your XP, stats, word bank, streak, and session history. This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="md" fullWidth onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" fullWidth onClick={handleReset}>
              Reset Everything
            </Button>
          </div>
        </div>
      </Modal>

      {/* Class selection modal */}
      <Modal
        isOpen={classModalOpen}
        onClose={() => setClassModalOpen(false)}
        title="Change Class"
      >
        <div className="space-y-2">
          {CHARACTER_CLASSES.map((cls) => (
            <button
              key={cls.id}
              onClick={() => handleClassSelect(cls.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                player.characterClass === cls.id
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-700 bg-slate-800/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg select-none">{cls.icon}</span>
                <div>
                  <p className="text-slate-100 text-sm font-semibold">{cls.name}</p>
                  <p className="text-slate-400 text-xs">{cls.focus}</p>
                </div>
                {player.characterClass === cls.id && (
                  <Check size={14} className="text-amber-400 ml-auto" />
                )}
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

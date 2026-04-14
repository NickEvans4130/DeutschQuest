import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { todayISO, addDays } from '../lib/srs';

interface StreakStore {
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  shieldUsedDate: string | null; // The week-start date when shield was consumed
  milestones: number[]; // Unlocked milestone streaks (7, 30, 100)

  recordSession: () => void;
  getStreakBonus: () => number;
  hasShieldAvailable: () => boolean;
  resetStreak: () => void;
}

function getWeekStart(date: string): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

export const useStreakStore = create<StreakStore>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null,
      shieldUsedDate: null,
      milestones: [],

      recordSession: () => {
        const today = todayISO();
        const state = get();

        if (state.lastSessionDate === today) return; // Already recorded today

        const yesterday = addDays(today, -1);
        const twoDaysAgo = addDays(today, -2);

        let newStreak = state.currentStreak;
        let shieldUsedDate = state.shieldUsedDate;

        if (state.lastSessionDate === yesterday) {
          // Consecutive day
          newStreak += 1;
        } else if (
          state.lastSessionDate === twoDaysAgo &&
          state.shieldUsedDate !== getWeekStart(today)
        ) {
          // Missed one day, use shield
          newStreak += 1;
          shieldUsedDate = getWeekStart(today);
        } else {
          // Streak broken
          newStreak = 1;
        }

        const longestStreak = Math.max(state.longestStreak, newStreak);
        const milestones = [...state.milestones];
        for (const threshold of [7, 30, 100]) {
          if (newStreak >= threshold && !milestones.includes(threshold)) {
            milestones.push(threshold);
          }
        }

        set({ currentStreak: newStreak, longestStreak, lastSessionDate: today, shieldUsedDate, milestones });
      },

      getStreakBonus: () => {
        const { currentStreak } = get();
        return Math.min(1.0 + 0.05 * currentStreak, 2.0);
      },

      hasShieldAvailable: () => {
        const { shieldUsedDate } = get();
        const thisWeek = getWeekStart(todayISO());
        return shieldUsedDate !== thisWeek;
      },

      resetStreak: () =>
        set({ currentStreak: 0, longestStreak: 0, lastSessionDate: null, shieldUsedDate: null, milestones: [] }),
    }),
    { name: 'dq_streak' }
  )
);

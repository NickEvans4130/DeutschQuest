import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, CharacterClass, PlayerStats } from '../types/player';
import { clampStat } from '../lib/xp';

interface PlayerStore {
  player: Player | null;
  isOnboarded: boolean;

  createPlayer: (name: string, characterClass: CharacterClass, interests: string[]) => void;
  addXP: (amount: number) => void;
  addStatDeltas: (deltas: Partial<PlayerStats>) => void;
  incrementWordsLearned: (count: number) => void;
  incrementSessions: () => void;
  updateSettings: (settings: Partial<Pick<Player, 'cefrOverride' | 'dialectIntensity' | 'interests' | 'characterClass'>>) => void;
  resetProgress: () => void;
}

const DEFAULT_STATS: PlayerStats = {
  vocabulary: 0,
  listening: 0,
  reading: 0,
  grammar: 0,
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      player: null,
      isOnboarded: false,

      createPlayer: (name, characterClass, interests) =>
        set({
          isOnboarded: true,
          player: {
            name,
            characterClass,
            level: 1,
            xp: 0,
            stats: { ...DEFAULT_STATS },
            totalWordsLearned: 0,
            totalSessionsCompleted: 0,
            interests,
            cefrOverride: 'A2',
            dialectIntensity: 'occasional',
            avatarLevel: 1,
          },
        }),

      addXP: (amount) =>
        set((state) => {
          if (!state.player) return state;
          const newXP = state.player.xp + amount;
          // Calculate level from cumulative XP
          let level = 1;
          let remaining = newXP;
          while (level < 50) {
            const needed = level * 200;
            if (remaining < needed) break;
            remaining -= needed;
            level++;
          }
          // Determine avatar level milestone
          const milestones = [50, 40, 30, 20, 10, 1];
          const avatarLevel = milestones.find((m) => level >= m) ?? 1;

          return {
            player: {
              ...state.player,
              xp: newXP,
              level,
              avatarLevel,
            },
          };
        }),

      addStatDeltas: (deltas) =>
        set((state) => {
          if (!state.player) return state;
          return {
            player: {
              ...state.player,
              stats: {
                vocabulary: clampStat(state.player.stats.vocabulary + (deltas.vocabulary ?? 0)),
                listening: clampStat(state.player.stats.listening + (deltas.listening ?? 0)),
                reading: clampStat(state.player.stats.reading + (deltas.reading ?? 0)),
                grammar: clampStat(state.player.stats.grammar + (deltas.grammar ?? 0)),
              },
            },
          };
        }),

      incrementWordsLearned: (count) =>
        set((state) => {
          if (!state.player) return state;
          return { player: { ...state.player, totalWordsLearned: state.player.totalWordsLearned + count } };
        }),

      incrementSessions: () =>
        set((state) => {
          if (!state.player) return state;
          return { player: { ...state.player, totalSessionsCompleted: state.player.totalSessionsCompleted + 1 } };
        }),

      updateSettings: (settings) =>
        set((state) => {
          if (!state.player) return state;
          return { player: { ...state.player, ...settings } };
        }),

      resetProgress: () =>
        set({
          player: null,
          isOnboarded: false,
        }),
    }),
    { name: 'dq_player' }
  )
);

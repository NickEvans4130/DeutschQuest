import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Flashcard } from '../types/content';
import { defaultSRSCard, applyRating, isDue, todayISO } from '../lib/srs';

export interface WordBankEntry extends Flashcard {
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: string;
}

interface WordBankStore {
  entries: Record<string, WordBankEntry>;

  addCard: (card: Flashcard) => void;
  addCards: (cards: Flashcard[]) => void;
  rateCard: (id: string, quality: 0 | 2 | 4 | 5) => void;
  getDueCards: (limit?: number) => WordBankEntry[];
  getAllCards: () => WordBankEntry[];
  getDueCount: () => number;
  searchCards: (query: string) => WordBankEntry[];
  filterByTag: (tag: string) => WordBankEntry[];
  clearAll: () => void;
}

export const useWordBankStore = create<WordBankStore>()(
  persist(
    (set, get) => ({
      entries: {},

      addCard: (card) =>
        set((state) => {
          if (state.entries[card.id]) return state;
          const entry: WordBankEntry = {
            ...card,
            ...defaultSRSCard(),
          };
          return { entries: { ...state.entries, [card.id]: entry } };
        }),

      addCards: (cards) =>
        set((state) => {
          const next = { ...state.entries };
          for (const card of cards) {
            if (!next[card.id]) {
              next[card.id] = { ...card, ...defaultSRSCard() };
            }
          }
          return { entries: next };
        }),

      rateCard: (id, quality) =>
        set((state) => {
          const entry = state.entries[id];
          if (!entry) return state;
          const updated = applyRating(entry, quality);
          return { entries: { ...state.entries, [id]: { ...entry, ...updated } } };
        }),

      getDueCards: (limit = 8) => {
        const entries = Object.values(get().entries);
        const due = entries.filter((e) => e.dueDate <= todayISO());
        due.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        return due.slice(0, limit);
      },

      getAllCards: () => Object.values(get().entries),

      getDueCount: () => Object.values(get().entries).filter((e) => e.dueDate <= todayISO()).length,

      searchCards: (query) => {
        const q = query.toLowerCase();
        return Object.values(get().entries).filter(
          (e) =>
            e.german.toLowerCase().includes(q) ||
            e.english.toLowerCase().includes(q)
        );
      },

      filterByTag: (tag) =>
        Object.values(get().entries).filter((e) => e.tags.includes(tag as never)),

      clearAll: () => set({ entries: {} }),
    }),
    { name: 'dq_wordbank' }
  )
);

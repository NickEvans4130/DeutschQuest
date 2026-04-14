import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DailyContent } from '../types/content';
import type { ActiveSession, ModuleResult, ModuleType, SessionRecord } from '../types/session';
import { todayISO } from '../lib/srs';

interface SessionStore {
  // Content
  dailyContent: DailyContent | null;
  contentSource: 'cache' | 'api' | 'fallback' | null;
  isLoadingContent: boolean;
  loadError: string | null;

  // Active session
  activeSession: ActiveSession | null;
  sessionHistory: SessionRecord[];

  // Actions
  setDailyContent: (content: DailyContent, source: 'cache' | 'api' | 'fallback') => void;
  setLoadingContent: (loading: boolean) => void;
  setLoadError: (error: string | null) => void;

  startSession: () => void;
  completeModule: (result: ModuleResult) => void;
  advanceModule: () => void;
  finishSession: (xpEarned: number, statDeltas: SessionRecord['statDeltas']) => void;

  hasCompletedToday: () => boolean;
  getTodayRecord: () => SessionRecord | null;
  clearSession: () => void;
}

const MODULE_ORDER: ModuleType[] = ['news', 'flashcard1', 'dialect', 'flashcard2', 'summary'];

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      dailyContent: null,
      contentSource: null,
      isLoadingContent: false,
      loadError: null,
      activeSession: null,
      sessionHistory: [],

      setDailyContent: (content, source) =>
        set({ dailyContent: content, contentSource: source, loadError: null }),

      setLoadingContent: (loading) => set({ isLoadingContent: loading }),
      setLoadError: (error) => set({ loadError: error }),

      startSession: () =>
        set({
          activeSession: {
            currentModuleIndex: 0,
            modules: MODULE_ORDER,
            results: [],
            startedAt: new Date().toISOString(),
            isComplete: false,
          },
        }),

      completeModule: (result) =>
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              results: [...state.activeSession.results, result],
            },
          };
        }),

      advanceModule: () =>
        set((state) => {
          if (!state.activeSession) return state;
          const next = state.activeSession.currentModuleIndex + 1;
          return {
            activeSession: {
              ...state.activeSession,
              currentModuleIndex: next,
            },
          };
        }),

      finishSession: (xpEarned, statDeltas) => {
        const state = get();
        if (!state.activeSession) return;

        const record: SessionRecord = {
          id: `session-${Date.now()}`,
          date: todayISO(),
          xpEarned,
          modulesCompleted: state.activeSession.results.map((r) => r.moduleType),
          results: state.activeSession.results,
          statDeltas,
        };

        set((s) => ({
          sessionHistory: [record, ...s.sessionHistory].slice(0, 90), // Keep 90 days
          activeSession: s.activeSession ? { ...s.activeSession, isComplete: true } : null,
        }));
      },

      hasCompletedToday: () => {
        const today = todayISO();
        return get().sessionHistory.some((r) => r.date === today);
      },

      getTodayRecord: () => {
        const today = todayISO();
        return get().sessionHistory.find((r) => r.date === today) ?? null;
      },

      clearSession: () => set({ activeSession: null }),
    }),
    {
      name: 'dq_session',
      partialize: (state) => ({
        sessionHistory: state.sessionHistory,
        dailyContent: state.dailyContent,
        contentSource: state.contentSource,
      }),
    }
  )
);

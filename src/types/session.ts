export type ModuleType = 'news' | 'flashcard1' | 'dialect' | 'flashcard2' | 'summary';

export interface ModuleResult {
  moduleType: ModuleType;
  score: number; // 0.0 - 1.0
  wordsAdded: number;
  correctAnswers: number;
  totalAnswers: number;
  completedAt: string;
}

export interface SessionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  xpEarned: number;
  modulesCompleted: ModuleType[];
  results: ModuleResult[];
  statDeltas: {
    vocabulary: number;
    listening: number;
    reading: number;
    grammar: number;
  };
}

export interface ActiveSession {
  currentModuleIndex: number;
  modules: ModuleType[];
  results: ModuleResult[];
  startedAt: string;
  isComplete: boolean;
}

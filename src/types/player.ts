export type CharacterClass = 'warrior' | 'wanderer' | 'scholar' | 'bavarian';

export interface CharacterClassInfo {
  id: CharacterClass;
  name: string;
  germanName: string;
  description: string;
  focus: string;
  icon: string;
}

export const CHARACTER_CLASSES: CharacterClassInfo[] = [
  {
    id: 'warrior',
    name: 'Language Warrior',
    germanName: 'Sprachkrieger',
    description: 'Master grammar and sentence structure with precision.',
    focus: 'Grammar and structure',
    icon: '⚔️',
  },
  {
    id: 'wanderer',
    name: 'Wanderer',
    germanName: 'Wanderer',
    description: 'Learn practical vocabulary for travel and everyday life.',
    focus: 'Practical travel vocab',
    icon: '🗺️',
  },
  {
    id: 'scholar',
    name: 'Scholar',
    germanName: 'Gelehrter',
    description: 'Deepen comprehension through news and reading.',
    focus: 'News comprehension and reading',
    icon: '📚',
  },
  {
    id: 'bavarian',
    name: 'Bavarian',
    germanName: 'Bayer',
    description: 'Immerse yourself in authentic Bavarian dialect and culture.',
    focus: 'Dialect-heavy, informal register',
    icon: '🏔️',
  },
];

export interface PlayerStats {
  vocabulary: number;   // Wortschatz
  listening: number;    // Hörverstehen
  reading: number;      // Leseverstehen
  grammar: number;      // Grammatik
}

export interface Player {
  name: string;
  characterClass: CharacterClass;
  level: number;
  xp: number;
  stats: PlayerStats;
  totalWordsLearned: number;
  totalSessionsCompleted: number;
  interests: string[];
  cefrOverride: 'A1' | 'A2' | 'B1' | 'B2';
  dialectIntensity: 'off' | 'occasional' | 'frequent';
  avatarLevel: number; // 1, 10, 20, 30, 40, 50
}

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Anfänger',
  5: 'Reisender',
  10: 'Stadtbewohner',
  20: 'Einheimischer',
  30: 'Bayer',
  40: 'Kenner',
  50: 'Meister',
};

export function getLevelTitle(level: number): string {
  const thresholds = [50, 40, 30, 20, 10, 5, 1];
  for (const t of thresholds) {
    if (level >= t) return LEVEL_TITLES[t];
  }
  return LEVEL_TITLES[1];
}

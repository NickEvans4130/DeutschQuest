export const MAX_LEVEL = 50;
export const SESSION_BASE_XP = 100;
export const MAX_STREAK_BONUS = 2.0;

export function xpToNextLevel(level: number): number {
  return level * 200;
}

export function totalXPForLevel(level: number): number {
  // Sum of xp required for all previous levels
  let total = 0;
  for (let l = 1; l < level; l++) {
    total += xpToNextLevel(l);
  }
  return total;
}

export function levelFromTotalXP(totalXP: number): { level: number; xpIntoLevel: number } {
  let level = 1;
  let remaining = totalXP;
  while (level < MAX_LEVEL) {
    const needed = xpToNextLevel(level);
    if (remaining < needed) break;
    remaining -= needed;
    level++;
  }
  return { level, xpIntoLevel: remaining };
}

export function streakBonus(consecutiveDays: number): number {
  const bonus = 1.0 + 0.05 * consecutiveDays;
  return Math.min(bonus, MAX_STREAK_BONUS);
}

export function calculateSessionXP(
  moduleScores: number[], // 0.0 - 1.0 per module
  consecutiveDays: number
): number {
  const avgScore = moduleScores.length > 0
    ? moduleScores.reduce((a, b) => a + b, 0) / moduleScores.length
    : 1.0;
  const base = Math.round(SESSION_BASE_XP * avgScore);
  const bonus = streakBonus(consecutiveDays);
  return Math.round(base * bonus);
}

export function statDeltaFromModule(
  moduleType: string,
  score: number,
  correctGrammarCards: number = 0
): { vocabulary: number; listening: number; reading: number; grammar: number } {
  const delta = { vocabulary: 0, listening: 0, reading: 0, grammar: 0 };
  const pts = Math.round(score * 5);

  switch (moduleType) {
    case 'news':
      delta.reading = pts;
      break;
    case 'flashcard1':
    case 'flashcard2':
      delta.vocabulary = pts;
      delta.grammar = Math.round(correctGrammarCards * 0.5);
      break;
    case 'dialect':
      delta.listening = pts;
      break;
  }

  return delta;
}

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

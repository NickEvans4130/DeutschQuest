// SM-2 Spaced Repetition System
// quality: 0=Again, 2=Hard, 4=Good, 5=Easy

export interface SRSCard {
  easeFactor: number;   // starts at 2.5
  interval: number;     // days, starts at 0
  repetitions: number;  // consecutive correct
  dueDate: string;      // YYYY-MM-DD
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isDue(card: SRSCard): boolean {
  return card.dueDate <= todayISO();
}

export function applyRating(card: SRSCard, quality: 0 | 2 | 4 | 5): SRSCard {
  let { easeFactor, interval, repetitions } = card;

  if (quality < 3) {
    // Failed — reset
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const dueDate = addDays(todayISO(), interval);

  return { easeFactor, interval, repetitions, dueDate };
}

export function defaultSRSCard(): SRSCard {
  return {
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: todayISO(),
  };
}

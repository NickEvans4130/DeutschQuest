import type { DailyContent } from '../types/content';
import { generateContent, hasApiKey } from './gemini';
import { FALLBACK_SESSIONS } from './fallbackContent';
import { todayISO } from './srs';

const CACHE_KEY_PREFIX = 'dq_daily_content_';

function getCacheKey(): string {
  return `${CACHE_KEY_PREFIX}${todayISO()}`;
}

function loadFromCache(): DailyContent | null {
  try {
    const cached = localStorage.getItem(getCacheKey());
    if (!cached) return null;
    return JSON.parse(cached) as DailyContent;
  } catch {
    return null;
  }
}

function saveToCache(content: DailyContent): void {
  try {
    localStorage.setItem(getCacheKey(), JSON.stringify(content));
  } catch {
    // Ignore storage errors
  }
}

function getRandomFallback(): DailyContent {
  const idx = Math.floor(Math.random() * FALLBACK_SESSIONS.length);
  return { ...FALLBACK_SESSIONS[idx], generatedAt: todayISO() };
}

function buildPrompt(interests: string[], cefr: string, dialectIntensity: string): string {
  const topicList = interests.length > 0 ? interests.join(', ') : 'politics, environment, technology, culture, sport, local';
  const dialectNote = dialectIntensity === 'off'
    ? 'Keep dialect minimal.'
    : dialectIntensity === 'frequent'
    ? 'Lean heavily into authentic Bavarian dialect expressions.'
    : '';

  return `You are a German language learning content generator. Generate a complete daily session for a ${cefr}-level English speaker learning German with an interest in Bavarian culture. Preferred topics: ${topicList}. ${dialectNote}

Return ONLY valid JSON with no preamble, no markdown fences, and no trailing text. Use this exact structure:

{
  "news": {
    "headline": "string (original German headline, max 12 words)",
    "simplified": "string (3-4 sentences in simple A2/B1 German)",
    "english_summary": "string (one sentence English summary)",
    "vocab": [
      {
        "word": "string",
        "article": "der|die|das|null",
        "english": "string",
        "example": "string (sentence using the word)"
      }
    ],
    "topic": "string (one of: politics, environment, technology, culture, sport, local)"
  },
  "flashcards": [
    {
      "id": "string (uuid v4)",
      "german": "string",
      "english": "string",
      "article": "der|die|das|null",
      "example": "string",
      "tags": ["string"],
      "difficulty": 1
    }
  ],
  "dialect": {
    "bavarian": "string",
    "standard": "string",
    "english": "string",
    "etymology": "string (1-2 sentences)",
    "usage": "string (when/where you would hear this)",
    "example_dialogue": [
      { "speaker": "A", "line": "string" },
      { "speaker": "B", "line": "string" }
    ]
  }
}

Rules:
- vocab array must have exactly 3 items
- flashcards array must have exactly 6 items (new cards only)
- flashcard tags come from: noun, verb, adjective, adverb, phrase, bavarian, formal, informal
- flashcard difficulty is 1, 2, or 3
- The news item should feel current and realistic; vary the topic
- The dialect entry should be authentic everyday Bavarian speech from around Munich, the Isar valley, or Alpine communities
- article field must be exactly "der", "die", "das", or null (not the string "null")`;
}

export async function loadDailyContent(
  interests: string[] = [],
  cefr = 'A2',
  dialectIntensity: 'off' | 'occasional' | 'frequent' = 'occasional'
): Promise<{ content: DailyContent; source: 'cache' | 'api' | 'fallback' }> {
  // 1. Try cache first
  const cached = loadFromCache();
  if (cached) {
    return { content: cached, source: 'cache' };
  }

  // 2. Try API
  if (hasApiKey()) {
    try {
      const prompt = buildPrompt(interests, cefr, dialectIntensity);
      const raw = await generateContent(prompt);

      // Strip markdown fences if model added them despite instructions
      const cleaned = raw
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned) as DailyContent;
      parsed.generatedAt = todayISO();

      // Basic validation
      if (
        !parsed.news ||
        !parsed.flashcards ||
        !parsed.dialect ||
        parsed.flashcards.length < 6 ||
        parsed.news.vocab.length < 3
      ) {
        throw new Error('Content validation failed');
      }

      saveToCache(parsed);
      return { content: parsed, source: 'api' };
    } catch {
      // Fall through to fallback
    }
  }

  // 3. Fallback
  const fallback = getRandomFallback();
  return { content: fallback, source: 'fallback' };
}

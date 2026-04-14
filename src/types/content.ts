export interface VocabItem {
  word: string;
  article: 'der' | 'die' | 'das' | null;
  english: string;
  example: string;
}

export interface NewsContent {
  headline: string;
  simplified: string;
  english_summary: string;
  vocab: VocabItem[];
  topic: 'politics' | 'environment' | 'technology' | 'culture' | 'sport' | 'local';
}

export type FlashcardTag = 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'bavarian' | 'formal' | 'informal';

export interface Flashcard {
  id: string;
  german: string;
  english: string;
  article: 'der' | 'die' | 'das' | null;
  example: string;
  tags: FlashcardTag[];
  difficulty: 1 | 2 | 3;
}

export interface DialogueLine {
  speaker: 'A' | 'B';
  line: string;
}

export interface DialectContent {
  bavarian: string;
  standard: string;
  english: string;
  etymology: string;
  usage: string;
  example_dialogue: DialogueLine[];
}

export interface DailyContent {
  news: NewsContent;
  flashcards: Flashcard[];
  dialect: DialectContent;
  generatedAt: string;
}

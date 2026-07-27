export interface Language {
  id: string;
  code: string;
  name: string;
  flag_emoji: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  description: string | null;
  created_at: string;
}

export interface Word {
  id: string;
  category_id: string;
  language_code: string;
  word: string;
  translation_key: string;
  created_at: string;
}

export interface GameScore {
  id: string;
  language_code: string;
  category_id: string;
  score: number;
  moves: number;
  time_seconds: number;
  created_at: string;
}

export interface TranslationPair {
  translation_key: string;
  source_word: string;
  target_word: string;
}

export interface GameSettings {
  languageCode: string;
  categoryId: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
}

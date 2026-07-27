import { supabase } from './supabase';
import type {
  Language,
  Category,
  Word,
  GameScore,
  TranslationPair,
} from '@/types';

export async function getLanguages(): Promise<Language[]> {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .order('name');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getWordsByCategory(
  categoryId: string
): Promise<Word[]> {
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .eq('category_id', categoryId)
    .order('word');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getTranslationPairs(
  categoryId: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<TranslationPair[]> {
  const words = await getWordsByCategory(categoryId);
  const byKey = new Map<string, Map<string, string>>();

  for (const w of words) {
    if (!byKey.has(w.translation_key)) {
      byKey.set(w.translation_key, new Map());
    }
    byKey.get(w.translation_key)!.set(w.language_code, w.word);
  }

  const pairs: TranslationPair[] = [];
  for (const [key, langMap] of byKey) {
    const source_word = langMap.get(sourceLanguage);
    const target_word = langMap.get(targetLanguage);
    if (source_word && target_word) {
      pairs.push({ translation_key: key, source_word, target_word });
    }
  }
  return pairs;
}

export async function saveGameScore(
  languageCode: string,
  categoryId: string,
  score: number,
  moves: number,
  timeSeconds: number
): Promise<GameScore | null> {
  const { data, error } = await supabase
    .from('game_scores')
    .insert({
      language_code: languageCode,
      category_id: categoryId,
      score,
      moves,
      time_seconds: timeSeconds,
    })
    .select('*')
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getTopScores(limit = 10): Promise<GameScore[]> {
  const { data, error } = await supabase
    .from('game_scores')
    .select('*, categories(name)')
    .order('score', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getWordCountByCategory(categoryId: string): Promise<number> {
  const { count, error } = await supabase
    .from('words')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

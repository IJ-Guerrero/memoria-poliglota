// // import { supabase } from './supabase';
// import type {
//   Language,
//   Category,
//   Word,
//   GameScore,
//   TranslationPair,
// } from '@/types';

// export async function getLanguages(): Promise<Language[]> {
//   const { data, error } = await supabase
//     .from('languages')
//     .select('*')
//     .order('name');
//   if (error) throw new Error(error.message);
//   return data ?? [];
// }

// export async function getCategories(): Promise<Category[]> {
//   const { data, error } = await supabase
//     .from('categories')
//     .select('*')
//     .order('name');
//   if (error) throw new Error(error.message);
//   return data ?? [];
// }

// export async function getCategoryBySlug(slug: string): Promise<Category | null> {
//   const { data, error } = await supabase
//     .from('categories')
//     .select('*')
//     .eq('slug', slug)
//     .maybeSingle();
//   if (error) throw new Error(error.message);
//   return data;
// }

// export async function getWordsByCategory(
//   categoryId: string
// ): Promise<Word[]> {
//   const { data, error } = await supabase
//     .from('words')
//     .select('*')
//     .eq('category_id', categoryId)
//     .order('word');
//   if (error) throw new Error(error.message);
//   return data ?? [];
// }

// export async function getTranslationPairs(
//   categoryId: string,
//   sourceLanguage: string,
//   targetLanguage: string
// ): Promise<TranslationPair[]> {
//   const words = await getWordsByCategory(categoryId);
//   const byKey = new Map<string, Map<string, string>>();

//   for (const w of words) {
//     if (!byKey.has(w.translation_key)) {
//       byKey.set(w.translation_key, new Map());
//     }
//     byKey.get(w.translation_key)!.set(w.language_code, w.word);
//   }

//   const pairs: TranslationPair[] = [];
//   for (const [key, langMap] of byKey) {
//     const source_word = langMap.get(sourceLanguage);
//     const target_word = langMap.get(targetLanguage);
//     if (source_word && target_word) {
//       pairs.push({ translation_key: key, source_word, target_word });
//     }
//   }
//   return pairs;
// }

// export async function saveGameScore(
//   languageCode: string,
//   categoryId: string,
//   score: number,
//   moves: number,
//   timeSeconds: number
// ): Promise<GameScore | null> {
//   const { data, error } = await supabase
//     .from('game_scores')
//     .insert({
//       language_code: languageCode,
//       category_id: categoryId,
//       score,
//       moves,
//       time_seconds: timeSeconds,
//     })
//     .select('*')
//     .maybeSingle();
//   if (error) throw new Error(error.message);
//   return data;
// }

// export async function getTopScores(limit = 10): Promise<GameScore[]> {
//   const { data, error } = await supabase
//     .from('game_scores')
//     .select('*, categories(name)')
//     .order('score', { ascending: false })
//     .limit(limit);
//   if (error) throw new Error(error.message);
//   return data ?? [];
// }

// export async function getWordCountByCategory(categoryId: string): Promise<number> {
//   const { count, error } = await supabase
//     .from('words')
//     .select('*', { count: 'exact', head: true })
//     .eq('category_id', categoryId);
//   if (error) throw new Error(error.message);
//   return count ?? 0;
// }

import type {
  Language,
  Category,
  Word,
  Puntuacion,
  TranslationPair,
} from "@/types";

// const languages: Language[] = [
//   {
//     id: "1",
//     code: "es",
//     name: "Español",
//     flag_emoji: "🇪🇸",
//     created_at: "2026-01-01"
//   },
//   {
//     id: "2",
//     code: "en",
//     name: "English",
//     flag_emoji: "🇺🇸",
//     created_at: "2026-01-01"
//   },
//   {
//     id: "3",
//     code: "pt",
//     name: "Português",
//     flag_emoji: "🇧🇷",
//     created_at: "2026-01-01"
//   }
// ];

const categories: Category[] = [
  {
    id: "1",
    slug: "numeros",
    name: "Números",
    icon: "Hash",
    description: "Aprende los números",
    created_at: "2026-01-01"
  },
  {
    id: "2",
    slug: "casa",
    name: "Casa",
    icon: "Home",
    description: "Objetos del hogar",
    created_at: "2026-01-01"
  },
  {
    id: "3",
    slug: "personas",
    name: "Personas",
    icon: "Users",
    description: "Personas y relaciones",
    created_at: "2026-01-01"
  }
];

// const words: Word[] = [
//   { id: "1", category_id: "1", language_code: "es", word: "uno", translation_key: "UNO", created_at: "2026-01-01" },
//   { id: "2", category_id: "1", language_code: "en", word: "one", translation_key: "UNO", created_at: "2026-01-01" },
//   { id: "3", category_id: "1", language_code: "pt", word: "um", translation_key: "UNO", created_at: "2026-01-01" },

//   { id: "4", category_id: "1", language_code: "es", word: "dos", translation_key: "DOS", created_at: "2026-01-01" },
//   { id: "5", category_id: "1", language_code: "en", word: "two", translation_key: "DOS", created_at: "2026-01-01" },
//   { id: "6", category_id: "1", language_code: "pt", word: "dois", translation_key: "DOS", created_at: "2026-01-01" },

//   { id: "7", category_id: "2", language_code: "es", word: "casa", translation_key: "CASA", created_at: "2026-01-01" },
//   { id: "8", category_id: "2", language_code: "en", word: "house", translation_key: "CASA", created_at: "2026-01-01" },
//   { id: "9", category_id: "2", language_code: "pt", word: "casa", translation_key: "CASA", created_at: "2026-01-01" }
// ];

// const gameScores: Puntuacion[] = [
//   {
//     id: "1",
//     language_code: "en",
//     category_id: "1",
//     score: 980,
//     moves: 12,
//     time_seconds: 48,
//     created_at: "2026-01-01"
//   },
//   {
//     id: "2",
//     language_code: "pt",
//     category_id: "2",
//     score: 870,
//     moves: 15,
//     time_seconds: 62,
//     created_at: "2026-01-01"
//   }
// ];

const API_URL = import.meta.env.VITE_API_URL;

// export async function getLanguages(): Promise<Language[]> {
//   return languages;
// }

export async function getLanguages(): Promise<Language[]> {
        const response = await fetch(`${API_URL}/idiomas/getAll`);
        const idiomas = await response.json();

        return idiomas.map((i: any) => ({
            id: String(i.idIdioma),
            code: i.codigo,
            name: i.nombre,
            flag_emoji: null,
            created_at: ""
        }));
    }

export async function getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/categorias/getAll`);
    const categorias = await response.json();

    return categorias.map((c: any) => ({
        id: String(c.idCategoria),
        slug: c.nombre.toLowerCase(),
        name: c.nombre,
        icon: c.icono,
        description: "",
        created_at: ""
    }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const response = await fetch(`${API_URL}/categorias/getAll`);
    const categorias = await response.json();

    return categorias.map((c: any) => ({
        id: String(c.idCategoria),
        slug: c.nombre.toLowerCase(),
        name: c.nombre,
        icon: c.icono,
        description: "",
        created_at: ""
    })).find((c: any) => c.slug === slug) ?? null;
}

// export async function getWordsByCategory(categoryId: string): Promise<Word[]> {
//   return words.filter(w => w.category_id === categoryId);
// }

export async function getWordsByCategory(categoryId: string): Promise<Word[]> {
    const response = await fetch(`${API_URL}/palabras/getByCategoria/${categoryId}`);
    const palabras = await response.json();

    return palabras.map((p: any) => ({
        id: String(p.idPalabra),
        category_id: categoryId,
        language_code: p.codigoIdioma,
        word: p.palabra,
        pronunciation: p.pronunciacionAfi,
        translation_key: p.codigoConcepto,
        created_at: p.createdAt
    }));
}

export async function getTranslationPairs(categoryId: string, sourceLanguage: string, targetLanguage: string): Promise<TranslationPair[]> {
  const categoryWords = await getWordsByCategory(categoryId);

  const byKey = new Map<string, Map<string, Word>>();

  for (const word of categoryWords) {
    if (!byKey.has(word.translation_key)) byKey.set(word.translation_key, new Map());

    byKey.get(word.translation_key)!.set(word.language_code, word);
  }

  const pairs: TranslationPair[] = [];

  for (const [translation_key, map] of byKey) {
      const source = map.get(sourceLanguage);
      const target = map.get(targetLanguage);

      if (source && target) {
          pairs.push({
              translation_key,

              source_word: source.word,
              source_pronunciation: source.pronunciation,
              source_language: source.language_code,

              target_word: target.word,
              target_pronunciation: target.pronunciation,
              target_language: target.language_code
          });
      }
  }

  return pairs;
}

// export async function saveGameScore(languageCode: string, categoryId: string, score: number, moves: number, timeSeconds: number): Promise<GameScore | null> {
//   const nuevo: GameScore = {
//     id: String(gameScores.length + 1),
//     language_code: languageCode,
//     category_id: categoryId,
//     score,
//     moves,
//     time_seconds: timeSeconds,
//     created_at: new Date().toISOString()
//   };

//   gameScores.push(nuevo);

//   return nuevo;
// }

export async function saveGameScore(
    nombre: string,
    idIdiomaOrigen: number,
    idIdiomaDestino: number,
    idCategoria: number,
    cantidadParejas: number,
    movimientos: number,
    tiempoSegundos: number,
    puntuacion: number
) {

    const response = await fetch(`${API_URL}/puntuaciones/insert`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            nombre,
            idIdiomaOrigen,
            idIdiomaDestino,
            idCategoria,
            cantidadParejas,
            movimientos,
            tiempoSegundos,
            puntuacion
        })
    });


    return await response.json();
}

export async function getTopScores(limit = 10) {
    const response = await fetch(
        `${API_URL}/puntuaciones/getTopScores?limit=${limit}`
    );

    return await response.json();
}

// export async function getTopScores(limit = 10): Promise<GameScore[]> {
//   return [...gameScores]
//     .sort((a, b) => b.score - a.score)
//     .slice(0, limit);
// }

export async function getWordCountByCategory(categoryId: string): Promise<number> {
  const categoryWords = await getWordsByCategory(categoryId);
  return categoryWords.length;
}
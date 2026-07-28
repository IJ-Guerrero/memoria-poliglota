export interface Language {
  id: number;
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
  pronunciation: string;
  translation_key: string;
  created_at: string;
}

export interface Puntuacion {
  idPuntuacion: number;

  nombre: string;

  idCategoria: number;
  nombreCategoria: string;

  idIdiomaOrigen: number;
  codigoIdiomaOrigen: string;
  nombreIdiomaOrigen: string;

  idIdiomaDestino: number;
  codigoIdiomaDestino: string;
  nombreIdiomaDestino: string;

  cantidadParejas: number;

  movimientos: number;
  tiempoSegundos: number;

  puntuacion: number;

  createdAt: string;
}

export interface TranslationPair {
  translation_key: string;

  source_word: string;
  source_pronunciation: string;
  source_language: string;

  target_word: string;
  target_pronunciation: string;
  target_language: string;
}

// export interface GameSettings {
//   languageCode: string;
//   categoryId: string | null;
//   difficulty: 'facil' | 'moderado' | 'dificil';
// }

export interface Difficulty {
  id: 'facil' | 'moderado' | 'dificil' | 'personalizado';
  nombre: string;
  cantidadParejas: number;
}

export interface GameSettings {
  idiomaOrigen: Language | null;
  idiomaDestino: Language | null;
  categoryId: string | null;
  difficulty: Difficulty;
  nombreJugador: string;
}

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, Filter } from 'lucide-react';
import { getCategories, getLanguages, getTranslationPairs, saveGameScore } from '@/lib/api';
import type { Category, Language, TranslationPair } from '@/types';
import { useGameSettings } from '@/lib/useGameSettings';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';
import MemoryBoard from '@/components/MemoryBoard';
import PageHeader from '@/components/PageHeader';
import CategoryIcon from '@/components/CategoryIcon';

export default function PlayPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings, update } = useGameSettings();

  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [pairs, setPairs] = useState<TranslationPair[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingPairs, setLoadingPairs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [mostrarModalNombre, setMostrarModalNombre] = useState(
    !settings.nombreJugador.trim()
  );

  const categoryId = searchParams.get('category') || settings.categoryId || '';
  // const languageCode = settings.languageCode;
  const idiomaOrigen = settings.idiomaOrigen;
  const idiomaDestino = settings.idiomaDestino;

  async function loadMeta() {
    setLoadingMeta(true);
    setError(null);
    try {
      const [cats, langs] = await Promise.all([getCategories(), getLanguages()]);
      setCategories(cats);
      setLanguages(langs);
      const catParam = searchParams.get('category');
      if (catParam && !settings.categoryId) {
        update({ categoryId: catParam });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar los datos del juego');
    } finally {
      setLoadingMeta(false);
    }
  }

  const loadPairs = useCallback(async () => {
      if (!categoryId || !idiomaOrigen || !idiomaDestino) {
          setPairs([]);
          return;
      }

      setLoadingPairs(true);
      setError(null);

      try {
          const result = await getTranslationPairs(
              categoryId,
              idiomaOrigen.code,
              idiomaDestino.code
          );

          setPairs(result);

      } catch (e) {
          setError(
              e instanceof Error 
              ? e.message 
              : 'Error al cargar los pares de palabras'
          );

      } finally {
          setLoadingPairs(false);
      }
  }, [categoryId, idiomaOrigen, idiomaDestino]);

  useEffect(() => {
    loadMeta();
  }, []);

  useEffect(() => {
    loadPairs();
  }, [loadPairs]);

  useEffect(() => {
    setMostrarModalNombre(!settings.nombreJugador.trim());
  }, []);

  const pairCount = Math.min(settings.difficulty.cantidadParejas, pairs.length);

  async function handleWin(moves: number, timeSeconds: number) {
      if (saved || !categoryId || !idiomaOrigen || !idiomaDestino) return;

      setSaved(true);

      const FACTOR_TIEMPO = 2.5;
      const EXPONENTE_TIEMPO = 1.6;
      const PENALIZACION_ERROR = 0.92;

      const base = pairCount * 1000;

      const tiempoObjetivo = FACTOR_TIEMPO * pairCount ** 2;

      const errores = Math.max(0, moves - pairCount);

      const factorTiempo = Math.max(
          0.001,
          Math.min(1, Math.pow(tiempoObjetivo / Math.max(1, timeSeconds), EXPONENTE_TIEMPO))
      );

      const factorErrores = Math.pow(PENALIZACION_ERROR, errores);

      const puntuacion = Math.max(1, Math.round(base * factorTiempo * factorErrores));

      try {
          await saveGameScore(
              settings.nombreJugador.trim() || "Jugador",
              idiomaOrigen.id,
              idiomaDestino.id,
              Number(categoryId),
              pairCount,
              moves,
              timeSeconds,
              puntuacion
          );
      } catch {
          // score save is best-effort
      }
  }

  function selectCategory(id: string) {
    setSearchParams(id ? { category: id } : {});
    update({ categoryId: id });
    setSaved(false);
  }

  if (loadingMeta) return <LoadingSpinner label="Cargando datos" />;
  if (error && categories.length === 0)
    return <ErrorState message={error} onRetry={loadMeta} />;

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const targetLanguage = idiomaDestino;
  // const necesitaNombre = !settings.nombreJugador.trim();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Jugar"
        subtitle="Empareja cada palabra con su traducción. Elige una categoría y tus idiomas para comenzar."
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-slate-100 text-slate-600">
            <Filter className="h-3 w-3" />
            {idiomaOrigen?.flag_emoji} {idiomaOrigen?.name}
            {' → '}
            {idiomaDestino?.flag_emoji} {idiomaDestino?.name}
          </span>
          {selectedCategory && (
            <span className="chip bg-teal-50 text-teal-700">
              <CategoryIcon name={selectedCategory.icon} className="h-3 w-3" />
              {selectedCategory.name}
            </span>
          )}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Category selector */}
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Elige una categoría
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  cat.id === categoryId
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50/50'
                }`}
              >
                {/* <CategoryIcon name={cat.icon} className="h-4 w-4" /> */}
                {cat.icon} 
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Board area */}
        {!idiomaOrigen || !idiomaDestino ? (
            <div className="card flex flex-col items-center justify-center gap-4 py-20 text-center">
              <p className="font-display text-lg font-semibold text-slate-900">
                Selecciona tus idiomas para comenzar
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Debes elegir un idioma base y un idioma de aprendizaje.
              </p>
            </div>
          ) : !categoryId ? (
          <div className="card flex flex-col items-center justify-center gap-4 py-20 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-500">
              <Play className="h-7 w-7" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-slate-900">
                Elige una categoría para comenzar
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Tus palabras aparecerán como tarjetas de memoria abajo.
              </p>
            </div>
          </div>
        ) : loadingPairs ? (
          <LoadingSpinner label="Cargando pares de palabras" />
        ) : error ? (
          <ErrorState message={error} onRetry={loadPairs} />
        ) : pairs.length === 0 ? (
          <div className="card py-16 text-center text-slate-500">
            No hay pares de palabras disponibles para esta combinación todavía.
          </div>
        ) : (
          <div className="card">
            <MemoryBoard
              pairs={pairs}
              difficulty={settings.difficulty}
              onWin={handleWin}
            />
          </div>
        )}
      </div>

      {mostrarModalNombre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-fade-in">

            <h2 className="font-display text-2xl font-semibold text-slate-900">
              ¡Bienvenido!
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Antes de comenzar, escribe el nombre con el que aparecerás en la tabla de posiciones.
            </p>

            <div className="mt-6">
              <label
                htmlFor="nombreJugador"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Nombre del jugador
              </label>

              <input
                id="nombreJugador"
                type="text"
                autoFocus
                maxLength={30}
                value={settings.nombreJugador}
                onChange={(e) =>
                  update({
                    nombreJugador: e.target.value
                  })
                }
                placeholder="Ej: Juan"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <button
              onClick={() => setMostrarModalNombre(false)}
              disabled={!settings.nombreJugador.trim()}
              className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuar
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

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

  const categoryId = searchParams.get('category') || settings.categoryId || '';
  const languageCode = settings.languageCode;

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
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoadingMeta(false);
    }
  }

  const loadPairs = useCallback(async () => {
    if (!categoryId) {
      setPairs([]);
      return;
    }
    setLoadingPairs(true);
    setError(null);
    try {
      const result = await getTranslationPairs(
        categoryId,
        'en',
        languageCode
      );
      setPairs(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load words');
    } finally {
      setLoadingPairs(false);
    }
  }, [categoryId, languageCode]);

  useEffect(() => {
    loadMeta();
  }, []);

  useEffect(() => {
    loadPairs();
  }, [loadPairs]);

  async function handleWin(moves: number, timeSeconds: number) {
    if (saved || !categoryId) return;
    setSaved(true);
    const score = Math.max(100, 1000 - moves * 20 - timeSeconds * 2);
    try {
      await saveGameScore(languageCode, categoryId, score, moves, timeSeconds);
    } catch {
      // score save is best-effort
    }
  }

  function selectCategory(id: string) {
    setSearchParams(id ? { category: id } : {});
    update({ categoryId: id });
    setSaved(false);
  }

  if (loadingMeta) return <LoadingSpinner label="Setting up the game" />;
  if (error && categories.length === 0)
    return <ErrorState message={error} onRetry={loadMeta} />;

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const targetLanguage = languages.find((l) => l.code === languageCode);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Play"
        subtitle="Match each English word with its translation. Pick a category and language to begin."
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-slate-100 text-slate-600">
            <Filter className="h-3 w-3" />
            Language: {targetLanguage?.flag_emoji} {targetLanguage?.name}
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
            Choose a category
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
                <CategoryIcon name={cat.icon} className="h-4 w-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Board area */}
        {!categoryId ? (
          <div className="card flex flex-col items-center justify-center gap-4 py-20 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-500">
              <Play className="h-7 w-7" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-slate-900">
                Select a category to start
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Your words will appear as memory cards below.
              </p>
            </div>
          </div>
        ) : loadingPairs ? (
          <LoadingSpinner label="Loading word pairs" />
        ) : error ? (
          <ErrorState message={error} onRetry={loadPairs} />
        ) : pairs.length === 0 ? (
          <div className="card py-16 text-center text-slate-500">
            No word pairs available for this combination yet.
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
    </div>
  );
}

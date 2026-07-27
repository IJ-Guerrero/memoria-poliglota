import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { getLanguages } from '@/lib/api';
import { useGameSettings } from '@/lib/useGameSettings';
import type { Language } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';
import PageHeader from '@/components/PageHeader';

export default function LanguagesPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings, update } = useGameSettings();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setLanguages(await getLanguages());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load languages');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading languages" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Languages"
        subtitle="Pick the language you want to learn. Your choice is saved and used every time you play."
      />

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((lang, i) => {
            const isActive = settings.languageCode === lang.code;
            return (
              <button
                key={lang.id}
                onClick={() => update({ languageCode: lang.code })}
                className={`card card-hover group flex items-center gap-4 text-left animate-slide-up ${
                  isActive ? 'border-teal-500 ring-2 ring-teal-500/20' : ''
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-3xl">
                  {lang.flag_emoji}
                </span>
                <div className="flex-1">
                  <p className="font-display text-lg font-semibold text-slate-900">
                    {lang.name}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {lang.code}
                  </p>
                </div>
                {isActive ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-white">
                    <Check className="h-4 w-4" />
                  </span>
                ) : (
                  <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-teal-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white p-5">
          <div>
            <p className="text-sm text-slate-500">Currently learning</p>
            <p className="font-display text-lg font-semibold text-slate-900">
              {languages.find((l) => l.code === settings.languageCode)?.name ?? '—'}
            </p>
          </div>
          <Link to="/play" className="btn-primary">
            Start playing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

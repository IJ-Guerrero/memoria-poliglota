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
      setError(e instanceof Error ? e.message : 'Error al cargar los idiomas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Cargando idiomas" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Idiomas"
        subtitle="Selecciona el idioma que conoces y el idioma que quieres aprender."
      />

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((lang, i) => {
            const isOrigen = settings.idiomaOrigen?.id === lang.id;
            const isDestino = settings.idiomaDestino?.id === lang.id;
            const isActive = isOrigen || isDestino;

            return (
              <button
                key={lang.id}
                onClick={() => {
                  if (!settings.idiomaOrigen) {
                    update({
                      idiomaOrigen: lang
                    });
                    return;
                  }

                  if (!settings.idiomaDestino && settings.idiomaOrigen.id !== lang.id) {
                    update({
                      idiomaDestino: lang
                    });
                    return;
                  }

                  update({
                    idiomaOrigen: lang,
                    idiomaDestino: settings.idiomaOrigen
                  });
                }}
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

                  {/* {isOrigen && (
                    <p className="mt-1 text-xs font-bold uppercase text-teal-600">
                      Idioma base
                    </p>
                  )}

                  {isDestino && (
                    <p className="mt-1 text-xs font-bold uppercase text-blue-600">
                      Aprendiendo
                    </p>
                  )} */}
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
            <p className="text-sm text-slate-500">
              Idiomas seleccionados
            </p>

            <p className="font-display text-lg font-semibold text-slate-900">
              - {settings.idiomaOrigen?.name ?? '—'}
            </p>
            <p className="font-display text-lg font-semibold text-slate-900">
              - {settings.idiomaDestino?.name ?? '—'}
            </p>
          </div>

          <Link to="/play" className="btn-primary">
            Empezar a jugar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  LayoutGrid,
  Languages,
  Settings,
  ArrowRight,
  Brain,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { getLanguages, getCategories, getTopScores } from '@/lib/api';
import type { Language, Category, Puntuacion } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';
import CategoryIcon from '@/components/CategoryIcon';

export default function HomePage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [scores, setScores] = useState<Puntuacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [langs, cats, top] = await Promise.all([
        getLanguages(),
        getCategories(),
        getTopScores(5),
      ]);
      setLanguages(langs);
      setCategories(cats);
      setScores(top);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar la página');
    } finally {
      setLoading(false);
    }
  }

  function formatTime(totalSeconds: number): string {
    const horas = Math.floor(totalSeconds / 3600);
    const minutos = Math.floor((totalSeconds % 3600) / 60);
    const segundos = totalSeconds % 60;

    return [horas, minutos, segundos]
    .map(v => String(v).padStart(2, "0"))
    .join(":");
  }

  function getBandera(codigo: string): string {
    switch (codigo) {
        case "es": return "🇪🇸";
        case "en": return "🇺🇸";
        case "pt": return "🇵🇹";
        case "de": return "🇩🇪";
        case "it": return "🇮🇹";
        default: return "🌍";
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Cargando" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-teal-50/60 to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(20,184,166,0.12),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="chip mx-auto mb-5 bg-white/70 text-teal-700 ring-1 ring-teal-200">
              <Sparkles className="h-3.5 w-3.5" />
              Aprende jugando
            </span>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 text-balance sm:text-6xl">
              Entrena tu memoria,
              <br />
              <span className="text-teal-600">aprende un idioma.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
              Da vuelta las cartas, encuentra las parejas de palabras entre distintos idiomas y amplía tu vocabulario una pareja a la vez.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/play" className="btn-primary">
                <Play className="h-4 w-4" />
                Comenzar a jugar
              </Link>
              <Link to="/categories" className="btn-secondary">
                Explorar categorías
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: 'Idiomas', value: languages.length, icon: Languages },
              { label: 'Categorías', value: categories.length, icon: LayoutGrid },
              { label: 'Conceptos', value: 30, icon: Brain },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-center backdrop-blur-sm"
              >
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-teal-500" />
                <p className="font-display text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          Volver
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: '/play', label: 'Jugar una ronda', desc: 'Empareja palabras para ganar', icon: Play },
            { to: '/categories', label: 'Categorías', desc: 'Elige un tema para jugar', icon: LayoutGrid },
            { to: '/languages', label: 'Idiomas', desc: 'Elige qué aprender', icon: Languages },
            { to: '/settings', label: 'Configuración', desc: 'Ajusta la dificultad y el idioma', icon: Settings },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="card card-hover group flex flex-col gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">{item.label}</p>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-teal-500" />
            </Link>
          ))}
        </div>
      </section>

      {/* Categories preview */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            Categorías populares
          </h2>
          <Link to="/categories" className="btn-ghost">
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 3).map((cat) => (
            <Link
              key={cat.id}
              to={`/play?category=${cat.id}`}
              className="card card-hover group flex items-center gap-4"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700">
                <CategoryIcon name={cat.icon} className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{cat.name}</p>
                <p className="line-clamp-1 text-sm text-slate-500">
                  {cat.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-teal-500" />
            </Link>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      {scores.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              Tabla de posiciones
            </h2>
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-5 card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">#</th>
                  <th className="px-5 py-3 font-medium">Jugador</th>
                  <th className="px-5 py-3 font-medium">Categoría</th>
                  <th className="px-5 py-3 font-medium">Idiomas</th>
                  <th className="px-5 py-3 text-center font-medium">Parejas</th>
                  <th className="px-5 py-3 text-right font-medium">Puntuación</th>
                  <th className="hidden px-5 py-3 text-right font-medium sm:table-cell">Movimientos</th>
                  <th className="hidden px-5 py-3 text-right font-medium sm:table-cell">Tiempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {scores.map((s, i) => (
                      <tr key={s.idPuntuacion} className="transition-colors hover:bg-slate-50/50">

                          <td className="px-5 py-3">
                              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                                  i === 0
                                      ? "bg-amber-100 text-amber-700"
                                      : i === 1
                                      ? "bg-slate-200 text-slate-600"
                                      : i === 2
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-slate-100 text-slate-500"
                              }`}>
                                  {i + 1}
                              </span>
                          </td>

                          <td className="px-5 py-3 font-semibold text-slate-800">
                              {s.nombre}
                          </td>

                          <td className="px-5 py-3 text-slate-600">
                              {s.nombreCategoria}
                          </td>

                          <td className="px-5 py-3">
                              <div className="text-sm">
                                {(() => {
                                    const idiomas = [
                                        {
                                            nombre: s.nombreIdiomaOrigen,
                                            codigo: s.codigoIdiomaOrigen,
                                        },
                                        {
                                            nombre: s.nombreIdiomaDestino,
                                            codigo: s.codigoIdiomaDestino,
                                        },
                                    ].sort((a, b) => a.nombre.localeCompare(b.nombre));

                                    return (
                                        <>
                                            {idiomas[0].nombre}
                                            <span className="mx-2 text-slate-400">•</span>
                                            {idiomas[1].nombre}
                                        </>
                                    );
                                })()}
                            </div>
                          </td>

                          <td className="px-5 py-3 text-center">
                              {s.cantidadParejas}
                          </td>

                          <td className="px-5 py-3 text-right font-semibold text-teal-700">
                              {s.puntuacion}
                          </td>

                          <td className="hidden px-5 py-3 text-right text-slate-500 sm:table-cell">
                              {s.movimientos}
                          </td>

                          <td className="hidden px-5 py-3 text-right text-slate-500 sm:table-cell">
                              {formatTime(s.tiempoSegundos)}
                          </td>

                      </tr>
                  ))}
              </tbody>
              
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

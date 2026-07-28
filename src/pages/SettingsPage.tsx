import { Link } from 'react-router-dom';
import { ArrowRight, Gauge } from 'lucide-react';
import { useGameSettings } from '@/lib/useGameSettings';
import PageHeader from '@/components/PageHeader';
import { Difficulty } from '@/types';

const difficulties: Difficulty[] = [
  {
    id: 'facil',
    nombre: 'Fácil',
    cantidadParejas: 4,
  },
  {
    id: 'moderado',
    nombre: 'Moderado',
    cantidadParejas: 6,
  },
  {
    id: 'dificil',
    nombre: 'Difícil',
    cantidadParejas: 8,
  },
];

const personalizada: Difficulty = {
  id: 'personalizado',
  nombre: 'Personalizado',
  cantidadParejas: 10,
};

// const difficulties = [
//   {
//     value: 'facil' as const,
//     label: 'Fácil',
//     pairs: 4,
//     description: '4 parejas — un comienzo ideal',
//   },
//   {
//     value: 'moderado' as const,
//     label: 'Moderado',
//     pairs: 6,
//     description: '6 parejas — el desafío clásico',
//   },
//   {
//     value: 'dificil' as const,
//     label: 'Difícil',
//     pairs: 8,
//     description: '8 parejas — para los maestros de la memoria',
//   },
// ];

export default function SettingsPage() {
  const { settings, update } = useGameSettings();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Configuración"
        subtitle="Ajusta el juego a tu gusto. Tus elecciones se guardan en este dispositivo."
      />

      <div className="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
        <div className="space-y-6">
          {/* Jugador */}
          <section className="card">
            <h2 className="mb-4 font-display text-lg font-semibold text-slate-900">
              Jugador
            </h2>

            <div>
              <label
                htmlFor="nombreJugador"
                className="mb-2 block text-sm font-medium text-slate-600"
              >
                Nombre del jugador
              </label>

              <input
                id="nombreJugador"
                type="text"
                maxLength={30}
                value={settings.nombreJugador}
                onChange={(e) =>
                  update({
                    nombreJugador: e.target.value,
                  })
                }
                placeholder="Ingresa tu nombre"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />

              <p className="mt-2 text-xs text-slate-500">
                Este nombre aparecerá en la tabla de posiciones.
              </p>
            </div>
          </section>

          {/* Difficulty */}
          <section className="card">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Gauge className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Dificultad
                </h2>
                <p className="text-sm text-slate-500">
                  Cuántas parejas de palabras aparecen en el tablero.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {difficulties.map((d) => {
                  const isActive = settings.difficulty.id === d.id;

                  return (
                      <button
                          key={d.id}
                          onClick={() => update({ difficulty: d })}
                          className={`rounded-xl border p-4 text-left transition-all ${
                              isActive
                                  ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/20'
                                  : 'border-slate-200 bg-white hover:border-teal-300'
                          }`}
                      >
                          <p className="font-semibold">{d.nombre}</p>

                          <p className="text-xs text-slate-500">
                              {d.cantidadParejas} parejas
                          </p>
                      </button>
                  );
              })}

              <div
                  className={`rounded-xl border p-4 ${
                      settings.difficulty.id === 'personalizado'
                          ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/20'
                          : 'border-slate-200'
                  }`}
              >
                  <label className="block font-semibold">
                      Personalizado
                  </label>

                  <input
                      type="number"
                      min={2}
                      max={100}
                      value={
                          settings.difficulty.id === 'personalizado'
                              ? settings.difficulty.cantidadParejas
                              : personalizada.cantidadParejas
                      }
                      onFocus={() =>
                          update({
                              difficulty: {
                                  ...personalizada,
                                  cantidadParejas:
                                      settings.difficulty.id === 'personalizado'
                                          ? settings.difficulty.cantidadParejas
                                          : personalizada.cantidadParejas,
                              },
                          })
                      }
                      onChange={(e) =>
                          update({
                              difficulty: {
                                  id: 'personalizado',
                                  nombre: 'Personalizado',
                                  cantidadParejas: Number(e.target.value),
                              },
                          })
                      }
                      className="mt-3 w-full rounded-lg border px-3 py-2"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                      Elige cualquier cantidad de parejas.
                  </p>
              </div>
          </div>
          </section>



          {/* Current selection summary */}
          <section className="card">
            <h2 className="mb-4 font-display text-lg font-semibold text-slate-900">
              Configuración actual
            </h2>
            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Idioma de aprendizaje
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {settings.idiomaOrigen?.name ?? '—'} ({settings.idiomaOrigen?.code.toUpperCase() ?? '—'})
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Dificultad
                </dt>
                <dd className="mt-1 font-semibold capitalize text-slate-900">
                  {settings.difficulty.nombre}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Jugador
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {settings.nombreJugador || 'Sin nombre'}
                </dd>
              </div>
            </dl>
            <div className="mt-5">
              <Link to="/play" className="btn-primary">
                Configuración de la partida
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* About */}
          <section className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-teal-50/50 to-white p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Acerca de Memoria Políglota
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Memoria Políglota es un juego de memoria diseñado para ayudarte a aprender vocabulario en diferentes idiomas. 
              Empareja cada palabra con su traducción correcta para completar el tablero y poner a prueba tu memoria mientras 
              amplías tu vocabulario.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

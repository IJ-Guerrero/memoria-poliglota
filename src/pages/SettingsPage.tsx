import { Link } from 'react-router-dom';
import { ArrowRight, Gauge } from 'lucide-react';
import { useGameSettings } from '@/lib/useGameSettings';
import PageHeader from '@/components/PageHeader';

const difficulties = [
  {
    value: 'easy' as const,
    label: 'Easy',
    pairs: 4,
    description: '4 pairs — a gentle warm-up',
  },
  {
    value: 'medium' as const,
    label: 'Medium',
    pairs: 6,
    description: '6 pairs — the classic challenge',
  },
  {
    value: 'hard' as const,
    label: 'Hard',
    pairs: 8,
    description: '8 pairs — for the memory masters',
  },
];

export default function SettingsPage() {
  const { settings, update } = useGameSettings();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Settings"
        subtitle="Tune the game to your liking. Your choices are saved on this device."
      />

      <div className="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
        <div className="space-y-6">
          {/* Difficulty */}
          <section className="card">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Gauge className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Difficulty
                </h2>
                <p className="text-sm text-slate-500">
                  How many word pairs appear on the board.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {difficulties.map((d) => {
                const isActive = settings.difficulty === d.value;
                return (
                  <button
                    key={d.value}
                    onClick={() => update({ difficulty: d.value })}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      isActive
                        ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/20'
                        : 'border-slate-200 bg-white hover:border-teal-300'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{d.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{d.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Current selection summary */}
          <section className="card">
            <h2 className="mb-4 font-display text-lg font-semibold text-slate-900">
              Your current setup
            </h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Learning language
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {settings.languageCode.toUpperCase()}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Difficulty
                </dt>
                <dd className="mt-1 font-semibold capitalize text-slate-900">
                  {settings.difficulty}
                </dd>
              </div>
            </dl>
            <div className="mt-5">
              <Link to="/play" className="btn-primary">
                Play with these settings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* About */}
          <section className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-teal-50/50 to-white p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              About LinguaMatch
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              LinguaMatch is a memory card game that helps you learn vocabulary in
              five languages. Match each English word with its translation to
              clear the board. Your scores are saved so you can track progress over
              time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getCategories, getWordCountByCategory } from '@/lib/api';
import type { Category } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';
import PageHeader from '@/components/PageHeader';
import CategoryIcon from '@/components/CategoryIcon';

interface CategoryWithCount extends Category {
  wordCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const cats = await getCategories();
      const withCounts = await Promise.all(
        cats.map(async (c) => ({
          ...c,
          wordCount: await getWordCountByCategory(c.id),
        }))
      );
      setCategories(withCounts);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading categories" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Categories"
        subtitle="Each category is a themed set of vocabulary. Pick one to start matching words."
      />

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/play?category=${cat.id}`}
              className="card card-hover group flex flex-col gap-4 animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700 transition-transform group-hover:scale-110">
                  <CategoryIcon name={cat.icon} className="h-7 w-7" />
                </span>
                <span className="chip bg-slate-100 text-slate-500">
                  <BookOpen className="h-3 w-3" />
                  {cat.wordCount} words
                </span>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {cat.description}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-sm font-medium text-teal-600">
                Play now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

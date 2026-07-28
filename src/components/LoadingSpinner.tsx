import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Cargando' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
      <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      <p className="text-sm font-medium">{label}…</p>
    </div>
  );
}

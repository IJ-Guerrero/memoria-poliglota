import type { ReactNode } from 'react';

export default function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-6 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

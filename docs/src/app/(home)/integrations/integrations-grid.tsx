'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

import { cn } from '@/lib/cn';

export type IntegrationCard = {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  owner?: string;
};

type IntegrationsGridProps = {
  integrations: IntegrationCard[];
};

export function IntegrationsGrid({ integrations }: IntegrationsGridProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return integrations;

    return integrations.filter((integration) => {
      const name = integration.name.toLowerCase();
      const description = integration.description.toLowerCase();
      const owner = integration.owner?.toLowerCase() ?? '';

      return name.includes(value) || description.includes(value) || owner.includes(value);
    });
  }, [integrations, query]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <label htmlFor="integration-search" className="sr-only">
          Search integrations
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
        <input
          id="integration-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, provider, or capability"
          className="w-full rounded-xl border border-zinc-200 bg-white/80 py-3 pl-10 pr-4 text-sm text-zinc-900 shadow-sm outline-none ring-0 transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-white dark:focus:border-blue-400 dark:placeholder:text-zinc-500"
          autoComplete="off"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/50 p-6 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
          No integrations match your search yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((integration) => (
            <Link
              key={integration.slug}
              href={`/docs/integrations/${integration.slug}`}
              className="group flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-blue-500/60 dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div
                className={cn(
                  'flex aspect-square size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/60',
                )}
              >
                <img
                  src={integration.logoUrl}
                  alt={integration.name}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white sm:text-base">
                    {integration.name}
                  </h3>
                  <ArrowRight className="size-4 text-zinc-400 transition group-hover:text-blue-500 dark:text-zinc-500" aria-hidden />
                </div>
                <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">{integration.description}</p>
                {integration.owner && (
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                    <span>{integration.owner}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        Missing an integration? Suggest on our{' '}
        <a href="https://github.com/integrate-dev" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
          GitHub
        </a>
        ,{' '}
        <a href="https://discord.gg/integrate" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
          Discord
        </a>{' '}
        or{' '}
        <a href="mailto:support@integrate.dev" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
          email
        </a>{' '}
        and we will reply {'<'}48h.
      </div>
    </div>
  );
}


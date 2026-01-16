'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { motion } from 'motion/react';

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

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function IntegrationsGrid({ integrations }: IntegrationsGridProps) {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [animationOrder, setAnimationOrder] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
    setAnimationOrder(shuffleArray(integrations.map((_, i) => i)));
  }, [integrations.length]);

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

  const getAnimationDelay = (index: number) => {
    if (!mounted || animationOrder.length === 0) return 0;
    const orderIndex = animationOrder.indexOf(index);
    return orderIndex * 0.03;
  };

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
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:placeholder:text-zinc-500"
          autoComplete="off"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
          No integrations match your search yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((integration, index) => {
            const originalIndex = integrations.findIndex((i) => i.slug === integration.slug);
            
            return (
              <motion.div
                key={integration.slug}
                initial={mounted ? { opacity: 0, scale: 0.9, y: 10 } : false}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: getAnimationDelay(originalIndex),
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <Link
                  href={`/docs/integrations/${integration.slug}`}
                  className="group flex h-full items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-900 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-white"
                >
                  <div
                    className={cn(
                      'flex aspect-square size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800',
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
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {integration.name}
                      </h3>
                      <ArrowRight className="size-3.5 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-white" aria-hidden />
                    </div>
                    <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{integration.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
      <div className="text-xs text-zinc-500 dark:text-zinc-500">
        Missing an integration? Suggest on{' '}
        <a href="https://github.com/integrate-dev" className="font-medium text-zinc-900 hover:underline dark:text-white">
          GitHub
        </a>
        ,{' '}
        <a href="https://discord.gg/integrate" className="font-medium text-zinc-900 hover:underline dark:text-white">
          Discord
        </a>{' '}
        or{' '}
        <a href="mailto:support@integrate.dev" className="font-medium text-zinc-900 hover:underline dark:text-white">
          email
        </a>{' '}
        and we will reply {'<'}48h.
      </div>
    </div>
  );
}

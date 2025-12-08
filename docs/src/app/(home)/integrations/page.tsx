import Link from 'next/link';
import { ArrowRight, Plug, Sparkles } from 'lucide-react';

import { IntegrationsGrid, type IntegrationCard } from './integrations-grid';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { Footer } from '@/components/footer';

const layoutWidthClass = 'container mx-auto ';

const primaryCtaClass = cn(
    buttonVariants({ variant: 'primary', size: 'sm' }),
    'h-10 rounded-lg px-4 text-sm font-semibold shadow-sm hover:shadow-md',
);

const secondaryCtaClass = cn(
    buttonVariants({ variant: 'outline', size: 'sm' }),
    'h-10 rounded-lg px-4 text-sm font-semibold backdrop-blur-sm',
);

type IntegrationResponse = {
    integrations: {
        name: string;
        logo_url: string;
        description: string;
        owner?: string;
    }[];
};

function slugifyName(name: string) {
    const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return normalized || 'default';
}

async function getIntegrations(): Promise<IntegrationCard[]> {
    try {
        const response = await fetch('https://mcp.integrate.dev/api/v1/integrations', {
            // Revalidate periodically to keep the list fresh without slowing down page loads.
            next: { revalidate: 60 * 60 },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch integrations');
        }

        const data = (await response.json()) as IntegrationResponse;

        return data.integrations
            .map((integration) => ({
                name: integration.name,
                slug: slugifyName(integration.name),
                description: integration.description,
                logoUrl: integration.logo_url,
                owner: integration.owner,
            }))
            .filter(Boolean);
    } catch {
        return [];
    }
}

export default async function IntegrationsPage() {
    const integrations = await getIntegrations();

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex flex-1 flex-col gap-20 pb-24">
                <section className="relative overflow-hidden border-b border-zinc-200 bg-white/80 py-24 dark:border-zinc-800 dark:bg-zinc-950/60">
                    <div className="absolute inset-0 -z-10 bg-linear-to-br from-blue-500/15 via-transparent to-fuchsia-500/20 dark:from-blue-500/30 dark:to-fuchsia-600/30" />
                    <div className="absolute -right-24 -top-32 size-64 rounded-full bg-fuchsia-500/15 blur-3xl dark:bg-fuchsia-500/25" aria-hidden />
                    <div className="absolute -left-20 bottom-0 size-88 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/30" aria-hidden />
                    <div className={cn(layoutWidthClass, 'relative space-y-7 text-center')}>
                        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                            <Sparkles className="size-3.5" aria-hidden />
                            Integrations directory
                        </span>
                        <h1 className="text-pretty text-4xl font-semibold leading-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
                            Find the integration you need
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
                            Browse Integrate’s MCP-ready integrations. Jump into the docs for setup and tools without rewriting backend glue code.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <a href="https://app.integrate.dev" className={primaryCtaClass}>
                                Get started
                                <ArrowRight className="size-4" aria-hidden />
                            </a>
                            <Link href="/docs" className={secondaryCtaClass}>
                                Explore the docs
                                <ArrowRight className="size-4" aria-hidden />
                            </Link>
                        </div>
                    </div>
                </section>

                <section className={cn(layoutWidthClass, 'space-y-10')}>
                    <div className="md:rounded-3xl border border-zinc-200 bg-white/70 p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div>
                                    <div className="text-xl font-semibold text-zinc-900 dark:text-white">
                                        {integrations.length > 0 ? `${integrations.length} integrations` : 'Integrations'}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                            Each integration links to a focused docs page with credentials, tool details, and usage examples. Click any card to jump straight to its guide.
                        </p>
                        <div className="mt-6">
                            <IntegrationsGrid integrations={integrations} />
                        </div>
                    </div>
                </section>

                <section
                    className={cn(
                        layoutWidthClass,
                        'relative overflow-hidden md:rounded-[32px] border border-zinc-200 bg-white/80 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/70',
                    )}
                >
                    <div className="absolute inset-0 -z-10 bg-linear-to-br from-fuchsia-500/20 via-transparent to-blue-500/20 dark:from-fuchsia-500/25 dark:to-blue-500/25" />
                    <div className="space-y-6">
                        <h2 className="text-3xl font-semibold text-zinc-900 dark:text-white sm:text-4xl">
                            Ready to ship your integration?
                        </h2>
                        <p className="mx-auto max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
                            Configure credentials once, stream MCP tool calls, and keep OAuth on the server. Let agents act safely across every SaaS you use.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <a href="https://app.integrate.dev" className={primaryCtaClass}>
                                Get started
                                <ArrowRight className="size-4" aria-hidden />
                            </a>
                            <Link href="/docs" className={secondaryCtaClass}>
                                Read the docs
                                <ArrowRight className="size-4" aria-hidden />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}


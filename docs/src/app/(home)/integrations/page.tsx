import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { IntegrationsGrid, type IntegrationCard } from './integrations-grid';
import { Footer } from '@/components/footer';

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
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              Integrations
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
              Browse Integrate's MCP-ready integrations. Jump into the docs for setup and tools.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/docs" className="inline-flex h-10 items-center rounded-full border border-zinc-300 bg-zinc-100 px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700">
                View Docs
              </Link>
              <a href="https://app.integrate.dev" className="inline-flex h-10 items-center gap-1 rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                Get Started
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* Grid Section */}
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="container mx-auto px-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {integrations.length > 0 ? `${integrations.length} integrations available` : 'Loading integrations...'}
              </p>
            </div>
            <IntegrationsGrid integrations={integrations} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-zinc-200 bg-zinc-900 py-20 dark:border-zinc-800 dark:bg-black">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Ready to ship your integration?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-zinc-400">
              Configure credentials once, stream MCP tool calls, and keep OAuth on the server.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/docs" className="inline-flex h-10 items-center rounded-full border border-zinc-700 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
                View Docs
              </Link>
              <a href="https://app.integrate.dev" className="inline-flex h-10 items-center gap-1 rounded-full bg-white px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100">
                Get Started
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

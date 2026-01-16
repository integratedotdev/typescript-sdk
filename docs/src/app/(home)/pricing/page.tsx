import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { Footer } from '@/components/footer';

const plans = [
  {
    name: 'Starter',
    tagline: 'For solo devs, hobby projects, and early pilots.',
    price: '$0.20',
    unit: '/ 1,000 requests',
    priceSubtext: '+ 10,000 free requests/month',
    highlight: false,
    features: [
      '10k free requests monthly',
      '2 requests/sec sustained',
      '20 requests/sec burst',
      '7-day log retention',
      'Community support',
    ],
  },
  {
    name: 'Scale',
    tagline: 'For teams moving to production with reliability needs.',
    price: '$149',
    unit: '/ month per org',
    priceSubtext: '+ same $0.20 / 1,000 requests',
    highlight: true,
    features: [
      'Everything in Starter',
      '10 requests/sec sustained',
      '100 requests/sec burst',
      '30-day log retention',
      'SSO + audit logs',
      'Priority support (8×5)',
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'For orgs with advanced compliance or scale needs.',
    price: 'Custom',
    unit: '',
    priceSubtext: 'Annual commit with volume discounts',
    highlight: false,
    features: [
      'Everything in Scale',
      'Custom rate limits',
      'Custom log retention',
      'SLAs & data residency',
      'Dedicated support (24×7)',
      'DPA & invoicing',
    ],
  },
];

const comparisons = [
  {
    provider: 'Integrate',
    isPrimary: true,
    entry: '$0.20 / 1k requests (10k free/mo)',
    model: 'Request-based',
    advantage: 'Baseline reference',
  },
  {
    provider: 'Merge',
    entry: '$650/mo (first 3 linked accounts free)',
    model: 'Per linked account ($65 each)',
    advantage: 'Lower entry, predictable per-request',
  },
  {
    provider: 'Composio',
    entry: '$0 (20k calls) → $29/mo → $229/mo',
    model: 'Tool calls (premium calls 3×)',
    advantage: 'No premium-call multiplier',
  },
  {
    provider: 'Nango',
    entry: '$0 → $50/mo → $500/mo',
    model: 'Connections + requests + compute',
    advantage: 'No per-connection fees',
  },
  {
    provider: 'Unified.to',
    entry: '$750+/mo (750k calls)',
    model: '$1.00 per 1k over',
    advantage: 'Lower entry, pay-for-usage',
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
              Start free, scale as you grow. All plans include the full integration library and MCP server.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="border-t border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative overflow-hidden rounded-2xl border bg-white p-8 dark:bg-zinc-900 ${
                    plan.highlight
                      ? 'border-zinc-900 dark:border-white'
                      : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute right-4 top-4">
                      <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
                        Popular
                      </span>
                    </div>
                  )}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{plan.name}</h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{plan.tagline}</p>
                    </div>
                    <div>
                      <span className="text-4xl font-semibold text-zinc-900 dark:text-white">{plan.price}</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{plan.unit}</span>
                      {plan.priceSubtext && (
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">{plan.priceSubtext}</p>
                      )}
                    </div>
                    <ul className="space-y-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                          <Check className="mt-0.5 size-4 shrink-0 text-zinc-900 dark:text-white" aria-hidden />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="https://app.integrate.dev"
                      className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                        plan.highlight
                          ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100'
                          : 'border border-zinc-200 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800'
                      }`}
                    >
                      Get started
                      <ArrowRight className="size-4" aria-hidden />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="border-t border-zinc-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                How we compare
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-zinc-600 dark:text-zinc-400">
                See how Integrate stacks up against other integration platforms.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="pb-4 pr-4 font-semibold text-zinc-900 dark:text-white">Provider</th>
                    <th className="pb-4 pr-4 font-semibold text-zinc-900 dark:text-white">Entry pricing</th>
                    <th className="pb-4 pr-4 font-semibold text-zinc-900 dark:text-white">Pricing model</th>
                    <th className="pb-4 font-semibold text-zinc-900 dark:text-white">Integrate advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {comparisons.map((row) => (
                    <tr key={row.provider} className={row.isPrimary ? 'bg-zinc-50 dark:bg-zinc-900' : ''}>
                      <td className="py-4 pr-4 font-medium text-zinc-900 dark:text-white">{row.provider}</td>
                      <td className="py-4 pr-4 text-zinc-600 dark:text-zinc-400">{row.entry}</td>
                      <td className="py-4 pr-4 text-zinc-600 dark:text-zinc-400">{row.model}</td>
                      <td className="py-4 text-zinc-900 dark:text-white">{row.advantage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-zinc-200 bg-zinc-900 py-20 dark:border-zinc-800 dark:bg-black">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-zinc-400">
              Start building with Integrate SDK today. No credit card required for the Starter plan.
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

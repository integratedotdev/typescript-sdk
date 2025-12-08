import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { Footer } from '@/components/footer';

const layoutWidthClass = 'container mx-auto px-6 lg:px-12';

const primaryCtaClass = cn(
  buttonVariants({ variant: 'primary', size: 'sm' }),
  'h-10 rounded-lg px-4 text-sm font-semibold shadow-sm hover:shadow-md',
);

const secondaryCtaClass = cn(
  buttonVariants({ variant: 'outline', size: 'sm' }),
  'h-10 rounded-lg px-4 text-sm font-semibold backdrop-blur-sm',
);

const comparisons = [
  {
    provider: 'Integrate',
    isPrimary: true,
    entry: '$0.20 / 1k requests (10k free/mo); Scale $149/org/mo + same rate',
    overages: 'Pay-as-you-go at $0.20 / 1k requests; volume discounts on Enterprise',
    usage: 'Request-based; Starter limits: 2 rps sustained / 20 rps burst; Scale: 10 rps sustained / 100 rps burst; higher on Enterprise',
    features: ['Full integration library + MCP server included', 'Same low usage rate across tiers', 'Org features (SSO + audit logs) on Scale', 'SLAs + data residency on Enterprise'],
    support: 'Community (Starter), Priority (Scale), Dedicated (Enterprise)',
    security: 'SLAs & data residency on Enterprise; audit logs on Scale',
    advantage: 'Baseline reference',
    url: '/pricing',
  },
  {
    provider: 'Merge',
    entry: '$650/mo (first 3 linked accounts free; up to 10 prod accounts)',
    overages: '$65 per additional linked account; higher tiers are contract/volume',
    usage: 'Linked accounts; rate limits roughly 100/400/600 req/min by tier',
    features: ['Normalized APIs', 'Embedded Link/Magic Link', 'Custom fields & scopes (Pro+)'],
    support: 'Email; go-live support on Pro+; SLAs on Enterprise',
    security: 'SOC 2 report; audit trail on Enterprise',
    advantage: 'Lower entry cost; predictable per-request vs per-linked-account pricing; platform/MCP included',
    url: 'https://www.merge.dev/pricing',
  },
  {
    provider: 'Composio',
    entry: '$0 (20k tool calls) → $29/mo (200k calls) → $229/mo (2M calls)',
    overages: '$0.299/$0.249 per 1k calls; premium calls bill 3×',
    usage: 'Tool calls; free includes 20k; higher tiers lift limits',
    features: ['BYO credentials', 'Custom tool builder', 'Agent/MCP gateway'],
    support: 'Community → email → Slack (with spend); 14/30/90d logs',
    security: 'SOC 2 noted for enterprise; RBAC, on-prem/VPC option',
    advantage: 'No premium-call multiplier; MCP/integration library included; usage-based at $0.20/1k req',
    url: 'https://composio.dev/pricing',
  },
  {
    provider: 'Nango',
    entry: '$0 (10 connections, 100k req, 10h compute) → from $50/mo (20 conns) → from $500/mo (100 conns)',
    overages: '$1/connection; $0.0001/request; $0.0000002/ms compute beyond included',
    usage: 'Connections + proxy requests + functions compute',
    features: ['Two-way sync/RAG', 'LLM tool calling & MCP', 'UI components'],
    support: 'Community → standard → priority; SOC2 Type 2 listed',
    security: 'SAML on Enterprise; HIPAA add-on; self-hosting option',
    advantage: 'No per-connection fees; simpler single usage meter; platform included without extra SKU',
    url: 'https://www.nango.dev/pricing',
  },
  {
    provider: 'Unified.to',
    entry: '$750+/mo (750k calls) → $3,000+/mo (6M calls); 30-day free trial',
    overages: '$1.00 per 1k over (Grow); $0.50 per 1k over (Scale)',
    usage: 'API calls; unlimited customers/connections on paid tiers',
    features: ['21+ unified APIs, 357+ integrations', 'Virtual webhooks & DB sync', 'Branding, Auth/API CNAME'],
    support: 'Private Slack/Discord; premium support on Scale; 60d vs 365d logs',
    security: 'SAML on Scale; single-tenant/private/on-prem on Enterprise',
    advantage: 'Lower entry cost; pay-for-usage instead of fixed $750+ commit; MCP server bundled',
    url: 'https://unified.to/pricing',
  },
  {
    provider: 'Alloy Automation',
    entry: 'Not published (sales-led)',
    overages: 'Not published',
    usage: 'Enterprise-focused; connector library and MCP/embedded iPaaS',
    features: ['AI agents', 'Error handling/logging', 'On-prem option'],
    support: 'Enterprise support via sales',
    security: 'Emphasizes compliance/governance; details via sales',
    advantage: 'Transparent self-serve pricing; no sales gate to start; MCP/integration library included',
    url: 'https://runalloy.com/platform/pricing/',
  },
];

const plans = [
  {
    name: 'Starter',
    tagline: 'Ideal for solo devs, hobby projects, and early pilots. Linear cost beyond free.',
    price: '$0.20 / 1,000 requests',
    priceSubtext: '+ 10,000 free requests/month',
    default: true,
    payg: true,
    includedUsage: 'Pay-as-you-go',
    rateLimits: '2 request per second sustained\n20 request per second burst (60s)',
    concurrency: '2 concurrent',
    requestDuration: '10 sec',
    payloadCap: '256 KB',
    logsRetention: '7 days',
    support: 'Community',
    keyFeatures: [],
    highlight: false,
  },
  {
    name: 'Scale',
    tagline: 'For teams moving to production needing reliability & org features.',
    price: '$149 / month per org',
    priceSubtext: '+ same $0.20 / 1,000 requests',
    default: false,
    payg: true,
    includedUsage: 'Pay-as-you-go',
    rateLimits: '10 request per second sustained\n100 request per second burst',
    concurrency: '10 concurrent',
    requestDuration: '30 sec',
    payloadCap: '1 MB',
    logsRetention: '30 days',
    support: 'Priority (8×5, ≤4h first response)',
    keyFeatures: ['SSO + audit logs', 'Prod + Sandbox orgs', 'Same usage rate'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    tagline: 'For orgs with advanced compliance or scale needs.',
    price: 'Custom annual commit',
    priceSubtext: 'Volume discounts',
    default: false,
    payg: false,
    includedUsage: 'Volume discounts',
    rateLimits: 'Custom',
    concurrency: 'Custom',
    requestDuration: 'Custom',
    payloadCap: 'Custom',
    logsRetention: 'Custom',
    support: 'Dedicated (24×5 / 24×7)',
    keyFeatures: ['SLAs', 'Invoicing/POs', 'DPA', 'Private Slack', 'Data residency'],
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col gap-24 pb-24">
        <section className="relative overflow-hidden border-b border-zinc-200 bg-white/80 py-24 dark:border-zinc-800 dark:bg-zinc-950/60">
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-blue-500/15 via-transparent to-fuchsia-500/20 dark:from-blue-500/30 dark:to-fuchsia-600/30" />
          <div className="absolute -right-24 -top-32 size-64 rounded-full bg-fuchsia-500/15 blur-3xl dark:bg-fuchsia-500/25" aria-hidden />
          <div className="absolute -left-20 bottom-0 size-88 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/30" aria-hidden />
          <div className={cn(layoutWidthClass, 'relative space-y-7 text-center')}>
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
              <Sparkles className="size-3.5" aria-hidden />
              Simple, transparent pricing
            </span>
            <h1 className="text-pretty text-4xl font-semibold leading-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
              Choose the plan that fits your needs
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
              Start free, scale as you grow. All plans include access to our full integration library and MCP server infrastructure.
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

        <section className={cn(layoutWidthClass, 'space-y-12')}>
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative overflow-hidden rounded-2xl border bg-white/70 p-8 shadow-sm dark:bg-zinc-900/60',
                  plan.highlight
                    ? 'border-blue-500/50 dark:border-blue-400/50 lg:scale-105'
                    : 'border-zinc-200 dark:border-zinc-800',
                )}
              >
                {plan.highlight && (
                  <div className="absolute inset-0 -z-10 bg-linear-to-br from-blue-500/10 via-transparent to-fuchsia-500/10 dark:from-blue-500/20 dark:to-fuchsia-500/20" />
                )}
                {plan.default && (
                  <span className="mb-4 inline-block rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    Default
                  </span>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">{plan.name}</h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{plan.tagline}</p>
                  </div>
                  <div>
                    <div className="text-3xl font-semibold text-zinc-900 dark:text-white">{plan.price}</div>
                    {plan.priceSubtext && (
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{plan.priceSubtext}</div>
                    )}
                  </div>
                  <div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Included Usage
                      </div>
                      <div className="mt-1 text-sm text-zinc-900 dark:text-white">{plan.includedUsage}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Rate Limits
                      </div>
                      <div className="mt-1 whitespace-pre-line text-sm text-zinc-900 dark:text-white">{plan.rateLimits}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Concurrency
                      </div>
                      <div className="mt-1 text-sm text-zinc-900 dark:text-white">{plan.concurrency}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Request Duration
                      </div>
                      <div className="mt-1 text-sm text-zinc-900 dark:text-white">{plan.requestDuration}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Payload Cap
                      </div>
                      <div className="mt-1 text-sm text-zinc-900 dark:text-white">{plan.payloadCap}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Logs Retention
                      </div>
                      <div className="mt-1 text-sm text-zinc-900 dark:text-white">{plan.logsRetention}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Support
                      </div>
                      <div className="mt-1 text-sm text-zinc-900 dark:text-white">{plan.support}</div>
                    </div>
                    {plan.keyFeatures.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          Key Features
                        </div>
                        <ul className="mt-2 space-y-2">
                          {plan.keyFeatures.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm text-zinc-900 dark:text-white">
                              <Check className="mt-0.5 size-4 shrink-0 text-blue-500" aria-hidden />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="pt-4">
                    <a
                      href="https://app.integrate.dev/signup"
                      className={cn(
                        'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
                        plan.highlight
                          ? 'bg-white text-black hover:bg-white/70 dark:bg-white dark:hover:bg-white/60'
                          : 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700',
                      )}
                    >
                      Get started
                      <ArrowRight className="size-4" aria-hidden />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={cn(layoutWidthClass, 'space-y-6')}>
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-semibold text-zinc-900 dark:text-white sm:text-4xl">
              Pricing & feature comparison
            </h2>
            <p className="mx-auto max-w-3xl text-base text-zinc-600 dark:text-zinc-300">
              Snapshot of similar platforms. Our triggers feature is in development; we&apos;ll announce when it&apos;s generally available.
            </p>
            <div className="mx-auto max-w-3xl text-sm text-left text-zinc-700 dark:text-zinc-200">
              <div className="rounded-2xl border border-blue-200/80 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/40">
                <div className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-200">Why teams pick Integrate</div>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-blue-500" aria-hidden />
                    <span>Predictable usage pricing: $0.20 per 1k requests across tiers (10k free monthly), instead of seat- or account-based jumps.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-blue-500" aria-hidden />
                    <span>Platform included: full integration library + MCP server access on every plan—no separate SKU.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-blue-500" aria-hidden />
                    <span>Enterprise controls when needed: SSO/audit logs on Scale; SLAs, data residency, and volume discounts on Enterprise.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white/70 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                <tr>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Entry pricing</th>
                  <th className="px-4 py-3">Overages / scaling</th>
                  <th className="px-4 py-3">Included usage</th>
                  <th className="px-4 py-3">Feature highlights</th>
                  <th className="px-4 py-3">Support</th>
                  <th className="px-4 py-3">Security / compliance</th>
                  <th className="px-4 py-3 text-blue-700 dark:text-blue-200">Where Integrate wins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {comparisons.map((row) => (
                  <tr
                    key={row.provider}
                    className={cn(
                      'align-top',
                      row.isPrimary
                        ? 'bg-blue-50/70 font-semibold text-zinc-900 ring-1 ring-blue-200/80 dark:bg-blue-950/40 dark:text-white dark:ring-blue-900'
                        : '',
                    )}
                  >
                    <td className="px-4 py-3 font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 dark:text-white">
                      <a href={row.url} rel="noreferrer noopener" className="hover:text-blue-600 dark:hover:text-blue-400">
                        {row.provider}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{row.entry}</td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{row.overages}</td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{row.usage}</td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                      <ul className="list-disc space-y-1 pl-4">
                        {row.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{row.support}</td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{row.security}</td>
                    <td className="px-4 py-3 text-zinc-900 dark:text-white">
                      <span className="inline-flex items-start rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-100 dark:ring-blue-900">
                        {row.advantage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-white">Notes:</span> Composio premium tool calls bill 3×; Merge rate limits scale by tier (~100/400/600 req/min); Unified.to paid tiers include unlimited customers/connections with per-call overage; Alloy pricing is sales-led and not published. Our triggers feature is in development.
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
              Ready to get started?
            </h2>
            <p className="mx-auto max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
              Start building with Integrate SDK today. No credit card required for the Starter plan.
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


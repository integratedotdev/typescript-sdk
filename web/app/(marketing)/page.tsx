import Link from "next/link";

const products = [
  {
    name: "SDK",
    description: "Type-safe TypeScript client for 200+ integrations.",
    href: "/docs/getting-started/installation",
  },
  {
    name: "Agents",
    description: "Hand tools to your AI agent with one init command.",
    href: "/docs/artificial-intelligence/vercel-ai-sdk",
  },
  {
    name: "Dashboard",
    description: "API keys, usage, orgs, and billing in one place.",
    href: "/dashboard/signup",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="sr-only" aria-hidden="true">
        Integrate documentation for AI agents: start at
        https://integrate.dev/llms.txt for a full Markdown index. Per-page
        exports append .mdx to docs paths. Human docs live at
        https://integrate.dev/docs.
      </div>

      <section className="flex min-h-[70vh] flex-col justify-center py-16">
        <p className="mb-6 text-sm font-bold tracking-tight">integrate</p>
        <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          Reliability by design. Agent-ready APIs.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Tell your agent to run this command{" "}
          <code className="rounded border border-dashed border-border bg-muted px-1.5 py-0.5 text-foreground">
            bunx integrate-dev@cli init
          </code>
        </p>
        <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/docs">Documentation</Link>
          <span className="text-muted-foreground" aria-hidden>
            |
          </span>
          <Link href="/dashboard/signup">Get started</Link>
          <span className="text-muted-foreground" aria-hidden>
            |
          </span>
          <Link href="/dashboard/login">Sign in</Link>
        </div>
      </section>

      <section className="border-t border-dashed border-border py-16">
        <h2 className="mb-2 text-xl font-bold">Build on integrate.</h2>
        <p className="mb-8 max-w-xl text-muted-foreground">
          One SDK, one MCP gateway, and a dashboard for keys and usage.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-dashed border-border px-3 py-2 text-left font-bold">
                  Product
                </th>
                <th className="border border-dashed border-border px-3 py-2 text-left font-bold">
                  Description
                </th>
                <th className="border border-dashed border-border px-3 py-2 text-left font-bold">
                  Explore
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((row) => (
                <tr key={row.name}>
                  <td className="border border-dashed border-border px-3 py-2 font-medium">
                    {row.name}
                  </td>
                  <td className="border border-dashed border-border px-3 py-2 text-muted-foreground">
                    {row.description}
                  </td>
                  <td className="border border-dashed border-border px-3 py-2">
                    <Link href={row.href}>Explore {row.name}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

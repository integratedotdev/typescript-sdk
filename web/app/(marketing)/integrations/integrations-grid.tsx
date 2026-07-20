"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type IntegrationCard = {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  owner?: string;
};

export function IntegrationsGrid({
  integrations,
}: {
  integrations: IntegrationCard[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return integrations;
    return integrations.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.slug.includes(q),
    );
  }, [integrations, query]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search integrations…"
        className="mb-6 w-full max-w-md border border-dashed border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-dashed border-border px-3 py-2 text-left font-bold">
                Integration
              </th>
              <th className="border border-dashed border-border px-3 py-2 text-left font-bold">
                Description
              </th>
              <th className="border border-dashed border-border px-3 py-2 text-left font-bold">
                Docs
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((integration) => (
              <tr key={integration.slug}>
                <td className="border border-dashed border-border px-3 py-2">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={integration.logoUrl}
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 object-contain"
                    />
                    <span className="font-medium">{integration.name}</span>
                  </div>
                </td>
                <td className="border border-dashed border-border px-3 py-2 text-muted-foreground">
                  {integration.description}
                </td>
                <td className="border border-dashed border-border px-3 py-2">
                  <Link href={`/docs/integrations/${integration.slug}`}>
                    Explore
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">No matches.</p>
      )}
    </div>
  );
}

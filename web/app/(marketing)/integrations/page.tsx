import Link from "next/link";
import {
  IntegrationsGrid,
  type IntegrationCard,
} from "./integrations-grid";

type IntegrationResponse = {
  integrations: {
    name: string;
    logo_url: string;
    description: string;
    owner?: string;
  }[];
};

function integrationSlug(integration: { name: string; logo_url: string }) {
  const filename = integration.logo_url.split("/").pop();
  if (filename) {
    const id = filename.replace(/\.(png|jpe?g|webp|gif|svg)$/i, "");
    if (/^[a-z0-9_]+$/.test(id)) {
      return id;
    }
  }
  return (
    integration.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_|_$)/g, "") || "default"
  );
}

async function getIntegrations(): Promise<IntegrationCard[]> {
  try {
    const response = await fetch(
      "https://mcp.integrate.dev/api/v1/integrations",
      { next: { revalidate: 60 } },
    );
    if (!response.ok) throw new Error("Failed to fetch integrations");
    const data = (await response.json()) as IntegrationResponse;
    return data.integrations.map((integration) => ({
      name: integration.name,
      slug: integrationSlug(integration),
      description: integration.description,
      logoUrl: integration.logo_url,
      owner: integration.owner,
    }));
  } catch {
    return [];
  }
}

export default async function IntegrationsPage() {
  const integrations = await getIntegrations();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Browse MCP-ready integrations. Jump into the docs for setup and tools.
      </p>
      <p className="mt-4 text-sm">
        <Link href="/docs">Documentation</Link>
        {" · "}
        <Link href="/dashboard/signup">Get started</Link>
      </p>
      <div className="mt-10">
        <IntegrationsGrid integrations={integrations} />
      </div>
    </div>
  );
}

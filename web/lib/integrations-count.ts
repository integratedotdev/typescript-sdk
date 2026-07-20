import "server-only";

type IntegrationResponse = {
  integrations: { name: string }[];
};

/** Live integration count from MCP, floored to nearest 10 for marketing copy (e.g. 183 → 180). */
export async function getIntegrationCountFloor(): Promise<number> {
  try {
    const response = await fetch(
      "https://mcp.integrate.dev/api/v1/integrations",
      { next: { revalidate: 300 } },
    );
    if (!response.ok) return 180;
    const data = (await response.json()) as IntegrationResponse;
    const count = data.integrations?.length ?? 0;
    if (count <= 0) return 180;
    return Math.max(10, Math.floor(count / 10) * 10);
  } catch {
    return 180;
  }
}

export function formatIntegrationCount(floor: number): string {
  return `${floor}+`;
}

import slugMapData from "../../generated/integration-slug-map.json";

type IntegrationSlugMap = {
  byLogoBasename: Record<string, string>;
  docIds: string[];
};

const slugMap = slugMapData as IntegrationSlugMap;

type IntegrationSlugInput = {
  name: string;
  logo_url: string;
};

function logoBasename(logoUrl: string): string | null {
  const filename = logoUrl.split("/").pop();
  if (!filename) return null;
  return filename.replace(/\.(png|jpe?g|webp|gif|svg)$/i, "");
}

function slugifyName(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "");
  return normalized || "default";
}

const docIds = new Set(slugMap.docIds);

/** Map MCP API integration metadata to docs route slug (SDK integration id). */
export function resolveIntegrationDocSlug(
  integration: IntegrationSlugInput,
): string {
  const basename = logoBasename(integration.logo_url);
  if (basename) {
    const mapped = slugMap.byLogoBasename[basename];
    if (mapped) return mapped;
    if (docIds.has(basename)) return basename;
  }

  return slugifyName(integration.name);
}

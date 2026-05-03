import type { MCPIntegration } from "./types.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Phantom");

const PHANTOM_TOOLS = [
  "phantom_build_browse_deeplink",
  "phantom_deeplink_provider_reference",
] as const;

export interface PhantomIntegrationOptions {
  ref?: string;
}

export function buildPhantomBrowseDeeplink(params: { url: string; ref: string }): string {
  const target = new URL(params.url);
  const ref = new URL(params.ref);
  if (target.protocol !== "https:" || ref.protocol !== "https:") {
    throw new Error("Phantom browse deeplinks require https url and ref values");
  }
  return `https://phantom.app/ul/browse/${encodeURIComponent(target.toString())}?ref=${encodeURIComponent(ref.toString())}`;
}

export function phantomIntegration(_options: PhantomIntegrationOptions = {}): MCPIntegration<"phantom"> {
  return {
    id: "phantom",
    name: "Phantom",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/phantom.png",
    description: "Build Phantom mobile universal links and expose provider deeplink reference data",
    category: "Other",
    tools: [...PHANTOM_TOOLS],
    async onInit(_client) {
      logger.debug("Phantom integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("Phantom integration connected");
    },
  };
}

export type PhantomTools = (typeof PHANTOM_TOOLS)[number];
export type { PhantomIntegrationClient } from "./phantom-client.js";

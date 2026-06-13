import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";

const TLDRAW_TOOLS = [
  "tldraw_unfurl_url",
  "tldraw_create_room_snapshot",
  "tldraw_get_room_snapshot",
  "tldraw_get_published_snapshot",
  "tldraw_get_readonly_slug",
] as const;

export interface TldrawIntegrationOptions {
  apiKey?: string;
}

export function tldrawIntegration(options: TldrawIntegrationOptions = {}): MCPIntegration<"tldraw"> {
  const apiKey = options.apiKey ?? getEnv("TLDRAW_API_KEY");
  return {
    id: "tldraw",
    name: "tldraw",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/tldraw.png",
    description: "Create and manage tldraw collaborative whiteboards",
    category: "Productivity",
    tools: [...TLDRAW_TOOLS],
    authType: apiKey ? "apiKey" : undefined,
    getHeaders: apiKey ? () => ({ Authorization: `Bearer ${apiKey}` }) : undefined,
  };
}

export type TldrawTools = (typeof TLDRAW_TOOLS)[number];
export type { TldrawIntegrationClient } from "./tldraw-client.js";

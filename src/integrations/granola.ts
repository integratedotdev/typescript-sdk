/**
 * Granola Integration
 * Enables Granola tools with API key authentication
 */

import type { MCPIntegration } from "./types.js";

export interface GranolaIntegrationOptions {
  /** Granola API key used as a bearer token */
  apiKey: string;
}

const GRANOLA_TOOLS = [
  "granola_list_notes",
  "granola_get_note",
  "granola_list_folders",
] as const;

export function granolaIntegration(
  options: GranolaIntegrationOptions
): MCPIntegration<"granola"> {
  if (!options.apiKey) {
    throw new Error("granolaIntegration requires an apiKey");
  }

  return {
    id: "granola",
    name: "Granola",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/granola.png",
    description: "List and read Granola meeting notes and folders",
    category: "Productivity",
    tools: [...GRANOLA_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        Authorization: `Bearer ${options.apiKey}`,
      };
    },
  };
}

export type GranolaTools = typeof GRANOLA_TOOLS[number];

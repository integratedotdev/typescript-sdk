/**
 * Box Integration
 * Enables Box Content API tools with OAuth configuration.
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Box");

export interface BoxIntegrationOptions {
  /** Box OAuth client ID (defaults to BOX_CLIENT_ID env var) */
  clientId?: string;
  /** Box OAuth client secret (defaults to BOX_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Optional custom scopes. Omit to use the server default root_readwrite scope. */
  scopes?: string[];
  /** Optional OAuth scopes (user may choose to grant or deny) */
  optionalScopes?: string[];
  /** OAuth redirect URI */
  redirectUri?: string;
}

const BOX_TOOLS = [
  "box_get_current_user",
  "box_list_folder_items",
  "box_get_file",
  "box_get_folder",
  "box_create_folder",
  "box_update_file",
  "box_update_folder",
  "box_delete_file",
  "box_delete_folder",
  "box_upload_text_file",
  "box_download_file",
  "box_search",
  "box_create_shared_link",
  "box_create_collaboration",
  "box_list_comments",
  "box_create_comment",
  "box_delete_comment",
] as const;

export function boxIntegration(options: BoxIntegrationOptions = {}): MCPIntegration<"box"> {
  if (
    options.scopes !== undefined &&
    (!Array.isArray(options.scopes) || options.scopes.some((scope) => typeof scope !== "string"))
  ) {
    throw new Error("boxIntegration scopes must be an array of strings");
  }

  const oauth: OAuthConfig = {
    provider: "box",
    clientId: options.clientId ?? getEnv("BOX_CLIENT_ID"),
    clientSecret: options.clientSecret ?? getEnv("BOX_CLIENT_SECRET"),
    scopes: options.scopes,
    optionalScopes: options.optionalScopes,
    redirectUri: options.redirectUri,
    config: options,
  };

  return {
    id: "box",
    name: "Box",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/box.png",
    description: "Manage Box files, folders, sharing, comments, search, and collaborations",
    category: "Storage",
    tools: [...BOX_TOOLS],
    authType: "oauth",
    oauth,

    async onInit(_client) {
      logger.debug("Box integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("Box integration connected");
    },
  };
}

export type BoxTools = (typeof BOX_TOOLS)[number];

export type { BoxIntegrationClient } from "./box-client.js";

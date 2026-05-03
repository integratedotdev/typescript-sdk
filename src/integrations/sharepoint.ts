import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("SharePoint");

const SHAREPOINT_SCOPES = ["Sites.ReadWrite.All", "Files.ReadWrite.All", "offline_access"] as const;

const SHAREPOINT_TOOLS = [
  "sharepoint_create_folder",
  "sharepoint_delete_item",
  "sharepoint_get_item",
  "sharepoint_get_site",
  "sharepoint_list_drives",
  "sharepoint_list_items",
  "sharepoint_search_files",
  "sharepoint_search_sites",
  "sharepoint_share_item",
  "sharepoint_update_item",
  "sharepoint_upload_file",
] as const;

export interface SharePointIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function sharepointIntegration(config: SharePointIntegrationConfig = {}): MCPIntegration<"sharepoint"> {
  const oauth: OAuthConfig = {
    provider: "sharepoint",
    clientId: config.clientId ?? getEnv("SHAREPOINT_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("SHAREPOINT_CLIENT_SECRET"),
    scopes: config.scopes ?? [...SHAREPOINT_SCOPES],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      token_endpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "sharepoint",
    name: "SharePoint",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/sharepoint.png",
    description: "Search SharePoint sites and manage drives, files, folders, and sharing links",
    category: "Productivity",
    tools: [...SHAREPOINT_TOOLS],
    oauth,
    async onInit(_client) {
      logger.debug("SharePoint integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("SharePoint integration connected");
    },
  };
}

export type SharePointTools = (typeof SHAREPOINT_TOOLS)[number];
export type SharePointScopes = (typeof SHAREPOINT_SCOPES)[number];
export type { SharePointIntegrationClient } from "./sharepoint-client.js";

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Microsoft Entra ID");

const MICROSOFT_ENTRA_ID_SCOPES = [
  "User.ReadWrite.All",
  "Group.ReadWrite.All",
  "Application.ReadWrite.All",
  "Directory.Read.All",
  "AuditLog.Read.All",
  "offline_access",
] as const;

const MICROSOFT_ENTRA_ID_TOOLS = [
  "microsoft_entra_id_list_users",
  "microsoft_entra_id_get_user",
  "microsoft_entra_id_create_user",
  "microsoft_entra_id_list_groups",
  "microsoft_entra_id_list_applications",
  "microsoft_entra_id_list_audit_logs",
] as const;

export interface MicrosoftEntraIdIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function microsoftEntraIdIntegration(config: MicrosoftEntraIdIntegrationConfig = {}): MCPIntegration<"microsoft_entra_id"> {
  const oauth: OAuthConfig = { provider: "microsoft_entra_id", clientId: config.clientId ?? getEnv("MICROSOFT_ENTRA_ID_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("MICROSOFT_ENTRA_ID_CLIENT_SECRET"), scopes: config.scopes ?? [...MICROSOFT_ENTRA_ID_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "microsoft_entra_id", name: "Microsoft Entra ID", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/microsoft_entra_id.png", description: "Manage Microsoft Entra ID list users, get user, create user, list groups, list applications", category: "Identity & Access", tools: [...MICROSOFT_ENTRA_ID_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Microsoft Entra ID integration initialized"); },
    async onAfterConnect() { logger.debug("Microsoft Entra ID integration connected"); },
  };
}

export type MicrosoftEntraIdTools = (typeof MICROSOFT_ENTRA_ID_TOOLS)[number];
export type MicrosoftEntraIdScopes = (typeof MICROSOFT_ENTRA_ID_SCOPES)[number];
export type { MicrosoftEntraIdIntegrationClient } from "./microsoft_entra_id-client.js";

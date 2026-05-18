import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Microsoft Graph Education");

const MICROSOFT_GRAPH_EDUCATION_SCOPES = [
  "EduRoster.ReadWrite",
  "EduAssignments.ReadWrite",
  "offline_access",
] as const;

const MICROSOFT_GRAPH_EDUCATION_TOOLS = [
  "microsoft_graph_education_list_classes",
  "microsoft_graph_education_get_class",
  "microsoft_graph_education_list_users",
  "microsoft_graph_education_list_assignments",
  "microsoft_graph_education_create_assignment",
  "microsoft_graph_education_list_schools",
] as const;

export interface MicrosoftGraphEducationIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function microsoftGraphEducationIntegration(config: MicrosoftGraphEducationIntegrationConfig = {}): MCPIntegration<"microsoft_graph_education"> {
  const oauth: OAuthConfig = { provider: "microsoft_graph_education", clientId: config.clientId ?? getEnv("MICROSOFT_GRAPH_EDUCATION_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("MICROSOFT_GRAPH_EDUCATION_CLIENT_SECRET"), scopes: config.scopes ?? [...MICROSOFT_GRAPH_EDUCATION_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "microsoft_graph_education", name: "Microsoft Graph Education", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/microsoft_graph_education.png", description: "Manage Microsoft Graph Education list classes, get class, list users, list assignments, create assignment", category: "Education", tools: [...MICROSOFT_GRAPH_EDUCATION_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Microsoft Graph Education integration initialized"); },
    async onAfterConnect() { logger.debug("Microsoft Graph Education integration connected"); },
  };
}

export type MicrosoftGraphEducationTools = (typeof MICROSOFT_GRAPH_EDUCATION_TOOLS)[number];
export type MicrosoftGraphEducationScopes = (typeof MICROSOFT_GRAPH_EDUCATION_SCOPES)[number];
export type { MicrosoftGraphEducationIntegrationClient } from "./microsoft_graph_education-client.js";

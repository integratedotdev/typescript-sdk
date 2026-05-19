import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Forms");

const GOOGLE_FORMS_SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/forms.body",
  "https://www.googleapis.com/auth/forms.responses.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
] as const;

const GOOGLE_FORMS_TOOLS = [
  "google_forms_create_form",
  "google_forms_get_form",
  "google_forms_batch_update_form",
  "google_forms_list_form_responses",
  "google_forms_get_form_response",
] as const;

export interface GoogleFormsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function googleFormsIntegration(config: GoogleFormsIntegrationConfig = {}): MCPIntegration<"google_forms"> {
  const oauth: OAuthConfig = { provider: "google_forms", clientId: config.clientId ?? getEnv("GOOGLE_FORMS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("GOOGLE_FORMS_CLIENT_SECRET"), scopes: config.scopes ?? [...GOOGLE_FORMS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "google_forms", name: "Google Forms", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_forms.png", description: "Manage Google Forms forms, structure updates, and responses", category: "Productivity", tools: [...GOOGLE_FORMS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Google Forms integration initialized"); },
    async onAfterConnect() { logger.debug("Google Forms integration connected"); },
  };
}

export type GoogleFormsTools = (typeof GOOGLE_FORMS_TOOLS)[number];
export type GoogleFormsScopes = (typeof GOOGLE_FORMS_SCOPES)[number];
export type { GoogleFormsIntegrationClient } from "./google_forms-client.js";

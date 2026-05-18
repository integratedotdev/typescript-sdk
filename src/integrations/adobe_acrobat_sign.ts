import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Adobe Acrobat Sign");

const ADOBE_ACROBAT_SIGN_SCOPES = [
  "user_read",
  "agreement_read",
  "agreement_write",
  "library_read",
  "library_write",
] as const;

const ADOBE_ACROBAT_SIGN_TOOLS = [
  "adobe_acrobat_sign_get_user",
  "adobe_acrobat_sign_list_agreements",
  "adobe_acrobat_sign_get_agreement",
  "adobe_acrobat_sign_create_agreement",
  "adobe_acrobat_sign_list_library_documents",
  "adobe_acrobat_sign_get_signing_urls",
] as const;

export interface AdobeAcrobatSignIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function adobeAcrobatSignIntegration(config: AdobeAcrobatSignIntegrationConfig = {}): MCPIntegration<"adobe_acrobat_sign"> {
  const oauth: OAuthConfig = { provider: "adobe_acrobat_sign", clientId: config.clientId ?? getEnv("ADOBE_ACROBAT_SIGN_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("ADOBE_ACROBAT_SIGN_CLIENT_SECRET"), scopes: config.scopes ?? [...ADOBE_ACROBAT_SIGN_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "adobe_acrobat_sign", name: "Adobe Acrobat Sign", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/adobe_acrobat_sign.png", description: "Manage Adobe Acrobat Sign get user, list agreements, get agreement, create agreement, list library documents", category: "Legal", tools: [...ADOBE_ACROBAT_SIGN_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Adobe Acrobat Sign integration initialized"); },
    async onAfterConnect() { logger.debug("Adobe Acrobat Sign integration connected"); },
  };
}

export type AdobeAcrobatSignTools = (typeof ADOBE_ACROBAT_SIGN_TOOLS)[number];
export type AdobeAcrobatSignScopes = (typeof ADOBE_ACROBAT_SIGN_SCOPES)[number];
export type { AdobeAcrobatSignIntegrationClient } from "./adobe_acrobat_sign-client.js";

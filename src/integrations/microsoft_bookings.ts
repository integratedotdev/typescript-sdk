import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Microsoft Bookings");

const MICROSOFT_BOOKINGS_SCOPES = [
  "offline_access",
  "User.Read",
  "Bookings.ReadWrite.All",
] as const;

const MICROSOFT_BOOKINGS_TOOLS = [
  "microsoft_bookings_list_businesses",
  "microsoft_bookings_get_business",
  "microsoft_bookings_list_services",
  "microsoft_bookings_list_staff_members",
  "microsoft_bookings_list_appointments",
  "microsoft_bookings_create_appointment",
] as const;

export interface MicrosoftBookingsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function microsoftBookingsIntegration(config: MicrosoftBookingsIntegrationConfig = {}): MCPIntegration<"microsoft_bookings"> {
  const oauth: OAuthConfig = { provider: "microsoft_bookings", clientId: config.clientId ?? getEnv("MICROSOFT_BOOKINGS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("MICROSOFT_BOOKINGS_CLIENT_SECRET"), scopes: config.scopes ?? [...MICROSOFT_BOOKINGS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "microsoft_bookings", name: "Microsoft Bookings", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/microsoft_bookings.png", description: "Manage Microsoft Bookings businesses, services, staff members, and appointments", category: "Scheduling", tools: [...MICROSOFT_BOOKINGS_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Microsoft Bookings integration initialized"); },
    async onAfterConnect() { logger.debug("Microsoft Bookings integration connected"); },
  };
}

export type MicrosoftBookingsTools = (typeof MICROSOFT_BOOKINGS_TOOLS)[number];
export type MicrosoftBookingsScopes = (typeof MICROSOFT_BOOKINGS_SCOPES)[number];
export type { MicrosoftBookingsIntegrationClient } from "./microsoft_bookings-client.js";

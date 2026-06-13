import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Resend");

const RESEND_TOOLS = [
  "resend_list_domains",
  "resend_get_domain",
  "resend_create_domain",
  "resend_delete_domain",
  "resend_verify_domain",
  "resend_send_email",
  "resend_get_email",
  "resend_cancel_scheduled_email",
] as const;

export interface ResendIntegrationOptions {
  apiKey?: string;
}

export function resendIntegration(options: ResendIntegrationOptions = {}): MCPIntegration<"resend"> {
  const apiKey = options.apiKey ?? getEnv("RESEND_API_KEY");
  if (!apiKey) {
    throw new Error("resendIntegration requires apiKey or RESEND_API_KEY");
  }

  return {
    id: "resend",
    name: "Resend",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/resend.png",
    description: "Send email and manage domains with the Resend API",
    category: "Communication",
    tools: [...RESEND_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return { Authorization: `Bearer ${apiKey}` };
    },
    async onInit(_client) {
      logger.debug("Resend integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("Resend integration connected");
    },
  };
}

export type ResendTools = (typeof RESEND_TOOLS)[number];
export type { ResendIntegrationClient } from "./resend-client.js";

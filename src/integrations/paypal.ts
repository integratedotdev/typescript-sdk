import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("PayPal");

const PAYPAL_TOOLS = [
  "paypal_create_order",
  "paypal_get_order",
  "paypal_capture_order",
  "paypal_get_capture",
  "paypal_refund_capture",
  "paypal_get_refund",
  "paypal_list_invoices",
  "paypal_get_invoice",
  "paypal_create_invoice",
  "paypal_send_invoice",
  "paypal_list_products",
  "paypal_create_product",
  "paypal_list_plans",
  "paypal_create_plan",
  "paypal_get_subscription",
  "paypal_cancel_subscription",
] as const;

export interface PayPalIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  environment?: "sandbox" | "production";
}

async function fetchPayPalToken(config: Required<PayPalIntegrationConfig>): Promise<string> {
  const base = config.environment === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`PayPal token request failed (${res.status}): ${text}`);
  }
  const data = JSON.parse(text) as { access_token?: string };
  if (!data.access_token) throw new Error("PayPal token response missing access_token");
  return data.access_token;
}

export function paypalIntegration(config: PayPalIntegrationConfig = {}): MCPIntegration<"paypal"> {
  const clientId = config.clientId ?? getEnv("PAYPAL_CLIENT_ID");
  const clientSecret = config.clientSecret ?? getEnv("PAYPAL_CLIENT_SECRET");
  const environment = config.environment ?? (getEnv("PAYPAL_ENVIRONMENT") as "sandbox" | "production" | undefined) ?? "production";
  let accessToken = "";

  return {
    id: "paypal",
    name: "PayPal",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/paypal.png",
    description: "Manage PayPal orders, captures, refunds, invoices, products, plans, and subscriptions",
    category: "Finance",
    tools: [...PAYPAL_TOOLS],
    authType: "apiKey",
    getHeaders: () => {
      const headers: Record<string, string> = {};
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      return headers;
    },
    async onBeforeConnect() {
      if (!clientId || !clientSecret) return;
      accessToken = await fetchPayPalToken({ clientId, clientSecret, environment });
    },
    async onInit() {
      logger.debug("PayPal integration initialized");
    },
    async onAfterConnect() {
      logger.debug("PayPal integration connected");
    },
  };
}

export type PayPalTools = (typeof PAYPAL_TOOLS)[number];
export type { PayPalIntegrationClient } from "./paypal-client.js";

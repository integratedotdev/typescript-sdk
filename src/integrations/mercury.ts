/**
 * Mercury Integration
 * Enables Mercury tools with API token authentication
 */

import type { MCPIntegration } from "./types.js";

export interface MercuryIntegrationOptions {
  /** Mercury API key used as a bearer token */
  apiKey: string;
}

const MERCURY_TOOLS = [
  "mercury_get_organization",
  "mercury_list_accounts",
  "mercury_get_account",
  "mercury_get_account_cards",
  "mercury_list_account_transactions",
  "mercury_get_account_transaction",
  "mercury_list_account_statements",
  "mercury_download_statement_pdf",
  "mercury_list_transactions",
  "mercury_get_transaction",
  "mercury_update_transaction",
  "mercury_upload_transaction_attachment",
  "mercury_list_cards",
  "mercury_get_card",
  "mercury_create_card",
  "mercury_update_card",
  "mercury_freeze_card",
  "mercury_unfreeze_card",
  "mercury_cancel_card",
  "mercury_list_categories",
  "mercury_create_category",
  "mercury_update_category",
  "mercury_list_credit_accounts",
  "mercury_list_users",
  "mercury_get_user",
  "mercury_list_recipients",
  "mercury_get_recipient",
  "mercury_create_recipient",
  "mercury_update_recipient",
  "mercury_list_recipient_attachments",
  "mercury_upload_recipient_attachment",
  "mercury_list_customers",
  "mercury_get_customer",
  "mercury_create_customer",
  "mercury_update_customer",
  "mercury_delete_customer",
  "mercury_list_invoices",
  "mercury_get_invoice",
  "mercury_create_invoice",
  "mercury_update_invoice",
  "mercury_cancel_invoice",
  "mercury_list_invoice_attachments",
  "mercury_get_attachment",
  "mercury_download_invoice_pdf",
  "mercury_list_treasury_accounts",
  "mercury_list_treasury_transactions",
  "mercury_list_treasury_statements",
  "mercury_list_events",
  "mercury_get_event",
  "mercury_list_send_money_requests",
  "mercury_get_send_money_request",
  "mercury_list_safe_requests",
  "mercury_get_safe_request",
  "mercury_download_safe_request_document",
  "mercury_list_webhooks",
  "mercury_get_webhook",
  "mercury_create_webhook",
  "mercury_update_webhook",
  "mercury_delete_webhook",
  "mercury_verify_webhook",
  "mercury_create_internal_transfer",
  "mercury_send_money",
  "mercury_request_send_money",
] as const;

export function mercuryIntegration(
  options: MercuryIntegrationOptions
): MCPIntegration<"mercury"> {
  if (!options.apiKey) {
    throw new Error("mercuryIntegration requires an apiKey");
  }

  return {
    id: "mercury",
    name: "Mercury",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/mercury.png",
    description: "Manage Mercury bank accounts, cards, and transactions",
    category: "Finance",
    tools: [...MERCURY_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        Authorization: `Bearer ${options.apiKey}`,
      };
    },
  };
}

export type MercuryTools = typeof MERCURY_TOOLS[number];

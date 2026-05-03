import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Trello");

const TRELLO_TOOLS = [
  "trello_get_member",
  "trello_list_boards",
  "trello_get_board",
  "trello_list_lists",
  "trello_get_list",
  "trello_list_cards",
  "trello_get_card",
  "trello_create_card",
  "trello_update_card",
  "trello_delete_card",
  "trello_add_card_comment",
  "trello_search",
] as const;

export interface TrelloIntegrationOptions {
  apiKey?: string;
  memberToken?: string;
}

function encodeCredential(apiKey: string, memberToken: string): string {
  const payload = JSON.stringify({ k: apiKey, t: memberToken });
  return `trello:${Buffer.from(payload).toString("base64url")}`;
}

export function trelloIntegration(options: TrelloIntegrationOptions = {}): MCPIntegration<"trello"> {
  const apiKey = options.apiKey ?? getEnv("TRELLO_API_KEY");
  const memberToken = options.memberToken ?? getEnv("TRELLO_TOKEN");
  if (!apiKey || !memberToken) {
    throw new Error("trelloIntegration requires apiKey/memberToken or TRELLO_API_KEY/TRELLO_TOKEN");
  }

  return {
    id: "trello",
    name: "Trello",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/trello.png",
    description: "Manage Trello boards, lists, cards, comments, and search",
    category: "Productivity",
    tools: [...TRELLO_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return { Authorization: `Bearer ${encodeCredential(apiKey, memberToken)}` };
    },
    async onInit(_client) {
      logger.debug("Trello integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("Trello integration connected");
    },
  };
}

export type TrelloTools = (typeof TRELLO_TOOLS)[number];
export type { TrelloIntegrationClient } from "./trello-client.js";

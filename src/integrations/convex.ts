import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Convex");

const CONVEX_TOOLS = [
  "convex_management_token_details",
  "convex_management_list_projects",
  "convex_management_create_project",
  "convex_management_get_project",
  "convex_management_delete_project",
  "convex_management_list_deployments",
  "convex_management_list_team_deployments",
  "convex_management_get_deployment",
  "convex_management_create_deployment",
  "convex_management_update_deployment",
  "convex_management_delete_deployment",
  "convex_management_list_deployment_regions",
  "convex_management_list_deployment_classes",
  "convex_management_list_default_environment_variables",
  "convex_management_update_default_environment_variables",
  "convex_deployment_list_environment_variables",
  "convex_deployment_update_environment_variables",
] as const;

export interface ConvexIntegrationOptions {
  accessToken?: string;
}

export function convexIntegration(options: ConvexIntegrationOptions = {}): MCPIntegration<"convex"> {
  const accessToken = options.accessToken ?? getEnv("CONVEX_ACCESS_TOKEN");
  if (!accessToken) {
    throw new Error("convexIntegration requires accessToken or CONVEX_ACCESS_TOKEN");
  }

  return {
    id: "convex",
    name: "Convex",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/convex.png",
    description: "Manage Convex projects, deployments, regions, classes, and environment variables",
    category: "Infrastructure",
    tools: [...CONVEX_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return { Authorization: `Bearer ${accessToken}` };
    },
    async onInit(_client) {
      logger.debug("Convex integration initialized");
    },
    async onAfterConnect(_client) {
      logger.debug("Convex integration connected");
    },
  };
}

export type ConvexTools = (typeof CONVEX_TOOLS)[number];
export type { ConvexIntegrationClient } from "./convex-client.js";

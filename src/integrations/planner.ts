import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";

const PLANNER_TOOLS = [
  "planner_create_bucket",
  "planner_create_plan",
  "planner_create_task",
  "planner_delete_task",
  "planner_get_plan",
  "planner_get_task",
  "planner_get_task_details",
  "planner_list_buckets",
  "planner_list_group_plans",
  "planner_list_my_plans",
  "planner_list_my_tasks",
  "planner_list_plan_tasks",
  "planner_update_task",
] as const;

export interface PlannerIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  optionalScopes?: string[];
  redirectUri?: string;
}

export function plannerIntegration(config: PlannerIntegrationConfig = {}): MCPIntegration<"planner"> {
  const oauth: OAuthConfig = {
    provider: "planner",
    clientId: config.clientId ?? getEnv("PLANNER_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("PLANNER_CLIENT_SECRET"),
    scopes: config.scopes ?? ["Tasks.ReadWrite", "Group.Read.All", "offline_access"],
    optionalScopes: config.optionalScopes,
    redirectUri: config.redirectUri,
  };

  return {
    id: "planner",
    name: "Microsoft Planner",
    tools: [...PLANNER_TOOLS],
    oauth,
  };
}

export type PlannerTools = (typeof PLANNER_TOOLS)[number];
export type { PlannerIntegrationClient } from "./planner-client.js";

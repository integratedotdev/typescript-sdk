import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Canvas LMS");

const CANVAS_LMS_SCOPES = [
  "url:GET|/api/v1/courses",
  "url:GET|/api/v1/users/:id/profile",
  "url:POST|/api/v1/courses/:course_id/assignments",
] as const;

const CANVAS_LMS_TOOLS = [
  "canvas_lms_list_courses",
  "canvas_lms_get_course",
  "canvas_lms_list_assignments",
  "canvas_lms_create_assignment",
  "canvas_lms_list_submissions",
  "canvas_lms_list_users",
] as const;

export interface CanvasLmsIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
  canvas_domain?: string;
}

export function canvasLmsIntegration(config: CanvasLmsIntegrationConfig = {}): MCPIntegration<"canvas_lms"> {
  const oauth: OAuthConfig = { provider: "canvas_lms", clientId: config.clientId ?? getEnv("CANVAS_LMS_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("CANVAS_LMS_CLIENT_SECRET"), scopes: config.scopes ?? [...CANVAS_LMS_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "canvas_lms", name: "Canvas LMS", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/canvas_lms.png", description: "Manage Canvas LMS list courses, get course, list assignments, create assignment, list submissions", category: "Education", tools: [...CANVAS_LMS_TOOLS], authType: "oauth", oauth,
    getHeaders() {
      const headers: Record<string, string> = {};
      if (config.canvas_domain) headers["X-Canvas-Domain"] = config.canvas_domain;
      return headers;
    },
    async onInit() { logger.debug("Canvas LMS integration initialized"); },
    async onAfterConnect() { logger.debug("Canvas LMS integration connected"); },
  };
}

export type CanvasLmsTools = (typeof CANVAS_LMS_TOOLS)[number];
export type CanvasLmsScopes = (typeof CANVAS_LMS_SCOPES)[number];
export type { CanvasLmsIntegrationClient } from "./canvas_lms-client.js";

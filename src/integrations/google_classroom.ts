import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Google Classroom");

const GOOGLE_CLASSROOM_SCOPES = [
  "https://www.googleapis.com/auth/classroom.courses",
  "https://www.googleapis.com/auth/classroom.coursework.me",
  "https://www.googleapis.com/auth/classroom.rosters",
  "https://www.googleapis.com/auth/classroom.profile.emails",
] as const;

const GOOGLE_CLASSROOM_TOOLS = [
  "google_classroom_list_courses",
  "google_classroom_get_course",
  "google_classroom_create_course",
  "google_classroom_list_coursework",
  "google_classroom_create_coursework",
  "google_classroom_list_students",
] as const;

export interface GoogleClassroomIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function googleClassroomIntegration(config: GoogleClassroomIntegrationConfig = {}): MCPIntegration<"google_classroom"> {
  const oauth: OAuthConfig = { provider: "google_classroom", clientId: config.clientId ?? getEnv("GOOGLE_CLASSROOM_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("GOOGLE_CLASSROOM_CLIENT_SECRET"), scopes: config.scopes ?? [...GOOGLE_CLASSROOM_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "google_classroom", name: "Google Classroom", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/google_classroom.png", description: "Manage Google Classroom list courses, get course, create course, list coursework, create coursework", category: "Education", tools: [...GOOGLE_CLASSROOM_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Google Classroom integration initialized"); },
    async onAfterConnect() { logger.debug("Google Classroom integration connected"); },
  };
}

export type GoogleClassroomTools = (typeof GOOGLE_CLASSROOM_TOOLS)[number];
export type GoogleClassroomScopes = (typeof GOOGLE_CLASSROOM_SCOPES)[number];
export type { GoogleClassroomIntegrationClient } from "./google_classroom-client.js";

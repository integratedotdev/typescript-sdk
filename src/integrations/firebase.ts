import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("Firebase");

const FIREBASE_SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/firebase",
  "https://www.googleapis.com/auth/cloud-platform",
] as const;

const FIREBASE_TOOLS = [
  "firebase_list_projects",
  "firebase_get_project",
  "firebase_list_web_apps",
  "firebase_list_android_apps",
  "firebase_list_ios_apps",
  "firebase_create_web_app",
] as const;

export interface FirebaseIntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  redirectUri?: string;
}

export function firebaseIntegration(config: FirebaseIntegrationConfig = {}): MCPIntegration<"firebase"> {
  const oauth: OAuthConfig = { provider: "firebase", clientId: config.clientId ?? getEnv("FIREBASE_CLIENT_ID"), clientSecret: config.clientSecret ?? getEnv("FIREBASE_CLIENT_SECRET"), scopes: config.scopes ?? [...FIREBASE_SCOPES], redirectUri: config.redirectUri, config };
  return { id: "firebase", name: "Firebase", logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/firebase.png", description: "Manage Firebase projects and registered apps across web, Android, and Apple platforms", category: "Infrastructure", tools: [...FIREBASE_TOOLS], authType: "oauth", oauth,
    async onInit() { logger.debug("Firebase integration initialized"); },
    async onAfterConnect() { logger.debug("Firebase integration connected"); },
  };
}

export type FirebaseTools = (typeof FIREBASE_TOOLS)[number];
export type FirebaseScopes = (typeof FIREBASE_SCOPES)[number];
export type { FirebaseIntegrationClient } from "./firebase-client.js";

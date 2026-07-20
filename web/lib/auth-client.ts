"use client";

import { createAuthClient } from "better-auth/react";
import { organizationClient, adminClient } from "better-auth/client/plugins";
import { apiKeyClient } from "@better-auth/api-key/client";
import { polarClient } from "@polar-sh/better-auth";
import { AUTH_BASE_PATH, getAuthBaseURL } from "./auth-config";

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  basePath: AUTH_BASE_PATH,
  plugins: [
    organizationClient(),
    adminClient(),
    apiKeyClient(),
    polarClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  organization,
  admin,
  usage,
} = authClient;


/** Better Auth routes live under app/dashboard/api/auth */
export const AUTH_BASE_PATH = "/dashboard/api/auth";

/**
 * Site origin for Better Auth (no /dashboard suffix).
 * BETTER_AUTH_URL may still be set to …/dashboard from the migration; strip it.
 */
export function getAuthBaseURL() {
  const url =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    "http://localhost:3000";

  return url.replace(/\/dashboard(\/api\/auth)?\/?$/, "");
}

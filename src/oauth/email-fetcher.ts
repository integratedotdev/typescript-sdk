/**
 * Email Fetcher
 * Fetches user email from OAuth provider APIs after token exchange so the
 * UI can label connected accounts.
 *
 * Implementations are registered in EMAIL_FETCHERS; unknown providers fall
 * back to whatever email the OAuth response itself carried (e.g. Google's
 * id_token JWT, which the MCP server extracts and surfaces on the callback
 * response).
 */

import type { ProviderTokenData } from "./types.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('EmailFetcher');

export type EmailFetcher = (token: ProviderTokenData) => Promise<string | undefined>;

const EMAIL_FETCHERS: Record<string, EmailFetcher> = {
  github: fetchGitHubEmail,
  gmail: fetchGoogleEmail,
  google: fetchGoogleEmail,
  gcal: fetchGoogleEmail,
  gdrive: fetchGoogleEmail,
  gdocs: fetchGoogleEmail,
  gsheets: fetchGoogleEmail,
  gslides: fetchGoogleEmail,
  gcontacts: fetchGoogleEmail,
  gmeet: fetchGoogleEmail,
  gchat: fetchGoogleEmail,
  gtasks: fetchGoogleEmail,
  ga4: fetchGoogleEmail,
  youtube: fetchGoogleEmail,
  notion: fetchNotionEmail,
  linear: fetchLinearEmail,
  hubspot: fetchHubSpotEmail,
  polar: fetchPolarEmail,
  todoist: fetchTodoistEmail,
  vercel: fetchVercelEmail,
  slack: fetchSlackEmail,
  intercom: fetchIntercomEmail,
  jira: fetchAtlassianEmail,
  zendesk: fetchZendeskEmail,
  airtable: fetchAirtableEmail,
  discord: fetchDiscordEmail,
  dropbox: fetchDropboxEmail,
  gitlab: fetchGitLabEmail,
  reddit: fetchRedditEmail,
  outlook: fetchMicrosoftEmail,
  teams: fetchMicrosoftEmail,
  onedrive: fetchMicrosoftEmail,
  sharepoint: fetchMicrosoftEmail,
  excel: fetchMicrosoftEmail,
  word: fetchMicrosoftEmail,
  powerpoint: fetchMicrosoftEmail,
  planner: fetchMicrosoftEmail,
};

/**
 * Register a custom email fetcher for a provider. Useful when downstream
 * apps add integrations that aren't yet in the SDK's built-in registry.
 */
export function registerEmailFetcher(provider: string, fetcher: EmailFetcher): void {
  EMAIL_FETCHERS[provider.toLowerCase()] = fetcher;
}

/**
 * Fetch user email from the OAuth provider after a successful token
 * exchange. Returns undefined if no fetcher is registered or the provider
 * call fails. Caller should fall back to whatever tokenData.email already
 * holds.
 */
export async function fetchUserEmail(
  provider: string,
  tokenData: ProviderTokenData
): Promise<string | undefined> {
  const fetcher = EMAIL_FETCHERS[provider.toLowerCase()];
  if (!fetcher) {
    return tokenData.email;
  }
  try {
    const email = await fetcher(tokenData);
    return email ?? tokenData.email;
  } catch (error) {
    logger.error(`Failed to fetch email for ${provider}:`, error);
    return tokenData.email;
  }
}

// ---------------------------------------------------------------------------
// Per-provider fetchers. Each returns undefined on any error or unexpected
// response — never throws.
// ---------------------------------------------------------------------------

async function fetchGitHubEmail(token: ProviderTokenData): Promise<string | undefined> {
  const headers = {
    Authorization: `Bearer ${token.accessToken}`,
    Accept: "application/vnd.github.v3+json",
  };
  const userResponse = await fetch("https://api.github.com/user", { headers });
  if (!userResponse.ok) return undefined;
  const user = (await userResponse.json()) as { email?: string };
  if (user.email) return user.email;

  const emailsResponse = await fetch("https://api.github.com/user/emails", { headers });
  if (!emailsResponse.ok) return undefined;
  const emails = (await emailsResponse.json()) as Array<{ email: string; primary: boolean; verified: boolean }>;
  const primary = emails.find((e) => e.primary && e.verified);
  if (primary) return primary.email;
  const verified = emails.find((e) => e.verified);
  if (verified) return verified.email;
  return emails[0]?.email;
}

async function fetchGoogleEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });
  if (!response.ok) return undefined;
  const user = (await response.json()) as { email?: string };
  return user.email;
}

async function fetchNotionEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://api.notion.com/v1/users/me", {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      "Notion-Version": "2022-06-28",
    },
  });
  if (!response.ok) return undefined;
  const user = (await response.json()) as { bot?: { owner?: { user?: { person?: { email?: string } } } }; person?: { email?: string } };
  return user.person?.email ?? user.bot?.owner?.user?.person?.email;
}

async function fetchLinearEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: "{ viewer { email } }" }),
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { data?: { viewer?: { email?: string } } };
  return body.data?.viewer?.email;
}

async function fetchHubSpotEmail(token: ProviderTokenData): Promise<string | undefined> {
  const url = `https://api.hubapi.com/oauth/v1/access-tokens/${encodeURIComponent(token.accessToken)}`;
  const response = await fetch(url);
  if (!response.ok) return undefined;
  const body = (await response.json()) as { user?: string };
  return body.user;
}

async function fetchPolarEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://api.polar.sh/v1/oauth2/userinfo", {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { email?: string };
  return body.email;
}

async function fetchTodoistEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://api.todoist.com/sync/v9/sync", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: 'sync_token=*&resource_types=["user"]',
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { user?: { email?: string } };
  return body.user?.email;
}

async function fetchVercelEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://api.vercel.com/v2/user", {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { user?: { email?: string }; email?: string };
  return body.user?.email ?? body.email;
}

async function fetchSlackEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://slack.com/api/users.identity", {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { ok?: boolean; user?: { email?: string } };
  if (!body.ok) return undefined;
  return body.user?.email;
}

async function fetchIntercomEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://api.intercom.io/me", {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { email?: string };
  return body.email;
}

async function fetchAtlassianEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://api.atlassian.com/me", {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { email?: string };
  return body.email;
}

async function fetchZendeskEmail(token: ProviderTokenData): Promise<string | undefined> {
  const subdomain = (token.providerConfig?.subdomain as string | undefined)?.trim();
  if (!subdomain) return undefined;
  const response = await fetch(`https://${subdomain}.zendesk.com/api/v2/users/me.json`, {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { user?: { email?: string } };
  return body.user?.email;
}

async function fetchAirtableEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://api.airtable.com/v0/meta/whoami", {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { email?: string };
  return body.email;
}

async function fetchDiscordEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { email?: string };
  return body.email;
}

async function fetchDropboxEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      // Dropbox requires a Content-Type even for empty bodies; omitting the body argument
      // produces a 400. Send "null" per the API contract.
    },
    body: "null",
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { email?: string };
  return body.email;
}

async function fetchGitLabEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://gitlab.com/api/v4/user", {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { email?: string };
  return body.email;
}

async function fetchRedditEmail(token: ProviderTokenData): Promise<string | undefined> {
  // Reddit does not expose email via OAuth. Return the username so the UI
  // has *something* to disambiguate multiple connected accounts.
  const response = await fetch("https://oauth.reddit.com/api/v1/me", {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      "User-Agent": "integrate-sdk",
    },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { name?: string };
  return body.name;
}

async function fetchMicrosoftEmail(token: ProviderTokenData): Promise<string | undefined> {
  const response = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { mail?: string; userPrincipalName?: string };
  return body.mail ?? body.userPrincipalName;
}

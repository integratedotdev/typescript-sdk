/**
 * Email Fetcher
 * Fetches user email from OAuth provider APIs after token exchange
 */

import type { ProviderTokenData } from "./types.js";
import { createLogger } from "../utils/logger.js";

/**
 * Logger instance
 */
const logger = createLogger('EmailFetcher');

/**
 * Fetch user email from OAuth provider
 * 
 * @param provider - Provider name (e.g., 'github', 'gmail')
 * @param tokenData - Token data with access token
 * @returns User email address or undefined if not available
 */
export async function fetchUserEmail(
  provider: string,
  tokenData: ProviderTokenData
): Promise<string | undefined> {
  try {
    switch (provider.toLowerCase()) {
      case "github":
        return await fetchGitHubEmail(tokenData.accessToken);
      case "gmail":
      case "google":
        return await fetchGoogleEmail(tokenData.accessToken);
      case "notion":
        return await fetchNotionEmail(tokenData.accessToken);
      default:
        // For unknown providers, try to extract from token data if available
        return tokenData.email;
    }
  } catch (error) {
    logger.error(`Failed to fetch email for ${provider}:`, error);
    return undefined;
  }
}

/**
 * Fetch GitHub user email
 */
async function fetchGitHubEmail(accessToken: string): Promise<string | undefined> {
  try {
    // First, get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      return undefined;
    }

    const user = await userResponse.json();

    // If email is public, return it
    if (user.email) {
      return user.email;
    }

    // Otherwise, fetch from emails endpoint
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!emailsResponse.ok) {
      return undefined;
    }

    const emails = await emailsResponse.json() as Array<{ email: string; primary: boolean; verified: boolean }>;
    
    // Find primary email, or first verified email
    const primaryEmail = emails.find((e) => e.primary && e.verified);
    if (primaryEmail) {
      return primaryEmail.email;
    }

    const verifiedEmail = emails.find((e) => e.verified);
    if (verifiedEmail) {
      return verifiedEmail.email;
    }

    // Fallback to first email
    if (emails.length > 0 && emails[0]?.email) {
      return emails[0].email;
    }

    return undefined;
  } catch (error) {
    logger.error("Failed to fetch GitHub email:", error);
    return undefined;
  }
}

/**
 * Fetch Google/Gmail user email
 */
async function fetchGoogleEmail(accessToken: string): Promise<string | undefined> {
  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return undefined;
    }

    const user = await response.json() as { email?: string };
    return user.email;
  } catch (error) {
    logger.error("Failed to fetch Google email:", error);
    return undefined;
  }
}

/**
 * Fetch Notion user email
 */
async function fetchNotionEmail(accessToken: string): Promise<string | undefined> {
  try {
    const response = await fetch("https://api.notion.com/v1/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Notion-Version": "2022-06-28",
      },
    });

    if (!response.ok) {
      return undefined;
    }

    const user = await response.json() as { person?: { email?: string } };
    return user.person?.email;
  } catch (error) {
    logger.error("Failed to fetch Notion email:", error);
    return undefined;
  }
}


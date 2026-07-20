import { createMCPServer, githubIntegration, gmailIntegration, notionIntegration } from 'integrate-sdk/server';
import type { ProviderTokenData, MCPContext } from 'integrate-sdk/server';
import { db } from './db';
import { account } from './db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from './auth';

const MCP_SERVER_URL =
  process.env.INTEGRATE_MCP_SERVER_URL ?? 'https://mcp.integrate.dev/api/v1/mcp';

const integrations = [
  githubIntegration({
    scopes: ['repo', 'user'],
  }),
  gmailIntegration({
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
  }),
  notionIntegration()
];

/**
 * Single MCP server instance with context-aware database token retrieval
 * Uses SDK's built-in OAuth session handling with Better Auth
 */
export const { client: serverClient } = createMCPServer({
  serverUrl: MCP_SERVER_URL,
  apiKey: process.env.INTEGRATE_API_KEY,
  integrations,
  codeMode: process.env.NEXT_PUBLIC_APP_URL
    ? { publicUrl: process.env.NEXT_PUBLIC_APP_URL }
    : undefined,

  // ✨ Extract session context for OAuth flows
  getSessionContext: async (req) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      return {
        userId: session?.user?.id,
        organizationId: session?.session?.activeOrganizationId,
      };
    } catch (error) {
      console.error('[Integrate SDK] Error getting session context:', error);
      return {};
    }
  },

  // ✨ Get provider tokens from database
  getProviderToken: async (provider: string, email?: string, context?: MCPContext) => {
    const userId = context?.userId;

    if (!userId) {
      console.warn('[Integrate SDK] No userId in context');
      return undefined;
    }

    try {
      const tokens = await getUserOAuthTokens(userId, provider);

      if (!tokens?.accessToken) {
        console.log(`[Integrate SDK] No token found for provider: ${provider}, user: ${userId}`);
        return undefined;
      }

      const tokenData: Partial<ProviderTokenData> = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || undefined,
        expiresAt: tokens.expiresAt?.toISOString(),
      };

      console.log(`[Integrate SDK] Token found for provider: ${provider}, user: ${userId}`);
      return tokenData as ProviderTokenData;
    } catch (error) {
      console.error('[Integrate SDK] Error fetching provider token:', error);
      return undefined;
    }
  },

  // ✨ Save provider tokens to database after OAuth
  setProviderToken: async (provider: string, tokenData: ProviderTokenData | null, email?: string, context?: MCPContext) => {
    const userId = context?.userId;

    if (!userId) {
      console.error('[Integrate SDK] Cannot save token: No userId in context');
      return;
    }

    // If tokenData is null, delete the token (fallback for disconnectProvider)
    if (tokenData === null) {
      console.log(`[Integrate SDK] Token data is null, deleting token for provider: ${provider}, user: ${userId}`);
      await removeOAuthTokens(userId, provider);
      return;
    }

    try {
      await saveOAuthTokens(userId, provider, tokenData);
      console.log(`[Integrate SDK] Token saved for provider: ${provider}, user: ${userId}`);
    } catch (error) {
      console.error('[Integrate SDK] Error saving provider token:', error);
      throw error;
    }
  },

  // ✨ Remove provider tokens from database (recommended for disconnectProvider)
  removeProviderToken: async (provider: string, email?: string, context?: MCPContext) => {
    console.log('[Integrate SDK] ========== removeProviderToken CALLBACK START ==========');
    console.log('[Integrate SDK] removeProviderToken called with:', {
      provider,
      context,
      hasContext: !!context,
      userId: context?.userId,
      organizationId: context?.organizationId,
      contextKeys: context ? Object.keys(context) : [],
    });

    const userId = context?.userId;

    if (!userId) {
      console.error('[Integrate SDK] removeProviderToken: No userId in context');
      console.error('[Integrate SDK] ========== removeProviderToken CALLBACK ERROR (NO USER ID) ==========');
      return;
    }

    try {
      console.log('[Integrate SDK] removeProviderToken: Calling removeOAuthTokens...');
      const result = await removeOAuthTokens(userId, provider);
      console.log('[Integrate SDK] removeProviderToken: removeOAuthTokens completed:', {
        result,
        resultType: typeof result,
      });
      console.log(`[Integrate SDK] Token removed for provider: ${provider}, user: ${userId}`);
      console.log('[Integrate SDK] ========== removeProviderToken CALLBACK SUCCESS ==========');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('[Integrate SDK] removeProviderToken: Error in removeOAuthTokens:', {
          error: error.message,
          errorStack: error.stack,
          errorName: error.name,
          errorObject: error,
        });
        console.error('[Integrate SDK] ========== removeProviderToken CALLBACK ERROR ==========');
        throw error;
      }
      throw new Error('Unknown error in removeProviderToken');
    }
  },
});

// Log configuration on module load
console.log('[Integrate SDK] Configuration loaded:', {
  hasGithubIntegration: !!process.env.GITHUB_CLIENT_ID,
  hasGmailIntegration: !!process.env.GMAIL_CLIENT_ID,
  hasNotionIntegration: !!process.env.NOTION_CLIENT_ID,
  serverUrl: MCP_SERVER_URL,
});

// Helper to get user's OAuth tokens from database
export async function getUserOAuthTokens(userId: string, providerId: string) {
  const accounts = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, providerId)))
    .limit(1);

  if (accounts.length === 0) {
    return null;
  }

  const accountData = accounts[0];
  return {
    accessToken: accountData.accessToken,
    refreshToken: accountData.refreshToken,
    expiresAt: accountData.accessTokenExpiresAt,
  };
}

// Helper to save OAuth tokens to database
export async function saveOAuthTokens(
  userId: string,
  providerId: string,
  tokenData: ProviderTokenData
) {
  // Check if account already exists
  const existing = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, providerId)))
    .limit(1);

  const expiresAt = tokenData.expiresAt
    ? new Date(tokenData.expiresAt)
    : null;

  if (existing.length > 0) {
    // Update existing account
    await db
      .update(account)
      .set({
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken || null,
        accessTokenExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(account.id, existing[0].id));
  } else {
    // Create new account entry
    await db.insert(account).values({
      id: `${userId}-${providerId}-${Date.now()}`, // Generate unique ID
      userId,
      providerId,
      accountId: userId, // Use userId as accountId for OAuth providers
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken || null,
      accessTokenExpiresAt: expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

// Helper to remove OAuth tokens from database
export async function removeOAuthTokens(userId: string, providerId: string) {
  console.log('[Integrate SDK] ========== removeOAuthTokens START ==========');
  console.log('[Integrate SDK] removeOAuthTokens called with:', {
    userId,
    providerId,
  });

  try {
    // First, check if account exists
    console.log('[Integrate SDK] removeOAuthTokens: Checking if account exists...');
    const existing = await db
      .select()
      .from(account)
      .where(and(eq(account.userId, userId), eq(account.providerId, providerId)))
      .limit(1);

    console.log('[Integrate SDK] removeOAuthTokens: Account check result:', {
      found: existing.length > 0,
      count: existing.length,
      accountId: existing[0]?.id,
      hasAccessToken: !!existing[0]?.accessToken,
    });

    if (existing.length === 0) {
      console.log('[Integrate SDK] removeOAuthTokens: No account found to delete');
      console.log('[Integrate SDK] ========== removeOAuthTokens END (NO ACCOUNT) ==========');
      return { deleted: false, message: 'No account found' };
    }

    // Delete the account
    console.log('[Integrate SDK] removeOAuthTokens: Deleting account from database...');
    const result = await db
      .delete(account)
      .where(and(eq(account.userId, userId), eq(account.providerId, providerId)));

    console.log('[Integrate SDK] removeOAuthTokens: Delete operation completed:', {
      result,
      resultType: typeof result,
      resultKeys: result ? Object.keys(result) : [],
    });

    // Verify deletion
    console.log('[Integrate SDK] removeOAuthTokens: Verifying deletion...');
    const verify = await db
      .select()
      .from(account)
      .where(and(eq(account.userId, userId), eq(account.providerId, providerId)))
      .limit(1);

    console.log('[Integrate SDK] removeOAuthTokens: Verification result:', {
      stillExists: verify.length > 0,
      count: verify.length,
      deleted: verify.length === 0,
    });

    console.log(`[Integrate SDK] Deleted token record for provider: ${providerId}, user: ${userId}`);
    console.log('[Integrate SDK] ========== removeOAuthTokens SUCCESS ==========');
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[Integrate SDK] removeOAuthTokens: Error deleting token:', {
        providerId,
        userId,
        error: error.message,
        errorStack: error.stack,
        errorName: error.name,
        errorObject: error,
      });
      console.error('[Integrate SDK] ========== removeOAuthTokens ERROR ==========');
      throw error;
    }
    throw new Error('Unknown error in removeOAuthTokens');
  }
}
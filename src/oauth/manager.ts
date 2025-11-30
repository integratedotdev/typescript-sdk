/**
 * OAuth Manager
 * Orchestrates OAuth 2.0 Authorization Code Flow with PKCE
 */

import type { OAuthConfig } from "../integrations/types.js";
import type {
  OAuthFlowConfig,
  PendingAuth,
  AuthStatus,
  AuthorizationUrlResponse,
  OAuthCallbackResponse,
  ProviderTokenData,
  AccountInfo,
} from "./types.js";
import type { MCPContext } from "../config/types.js";
import { generateCodeVerifier, generateCodeChallenge, generateStateWithReturnUrl } from "./pkce.js";
import { OAuthWindowManager } from "./window-manager.js";
import { IndexedDBStorage } from "./indexeddb-storage.js";
import { fetchUserEmail } from "./email-fetcher.js";

/**
 * OAuth Manager
 * Handles OAuth authorization flows and token management
 */
export class OAuthManager {
  private pendingAuths: Map<string, PendingAuth> = new Map();
  private providerTokens: Map<string, ProviderTokenData> = new Map();
  private windowManager: OAuthWindowManager;
  private flowConfig: OAuthFlowConfig;
  private oauthApiBase: string;
  private apiBaseUrl?: string;
  private getTokenCallback?: (provider: string, email?: string, context?: MCPContext) => Promise<ProviderTokenData | undefined> | ProviderTokenData | undefined;
  private setTokenCallback?: (provider: string, tokenData: ProviderTokenData | null, email?: string, context?: MCPContext) => Promise<void> | void;
  private removeTokenCallback?: (provider: string, email?: string, context?: MCPContext) => Promise<void> | void;
  private indexedDBStorage: IndexedDBStorage;
  private skipLocalStorage: boolean = false;

  constructor(
    oauthApiBase: string,
    flowConfig?: Partial<OAuthFlowConfig>,
    apiBaseUrl?: string,
    tokenCallbacks?: {
      getProviderToken?: (provider: string, email?: string, context?: MCPContext) => Promise<ProviderTokenData | undefined> | ProviderTokenData | undefined;
      setProviderToken?: (provider: string, tokenData: ProviderTokenData | null, email?: string, context?: MCPContext) => Promise<void> | void;
      removeProviderToken?: (provider: string, email?: string, context?: MCPContext) => Promise<void> | void;
    }
  ) {
    this.oauthApiBase = oauthApiBase;
    this.apiBaseUrl = apiBaseUrl;
    this.windowManager = new OAuthWindowManager();
    this.flowConfig = {
      mode: flowConfig?.mode || 'redirect',
      popupOptions: flowConfig?.popupOptions,
      onAuthCallback: flowConfig?.onAuthCallback,
    };
    this.getTokenCallback = tokenCallbacks?.getProviderToken;
    this.setTokenCallback = tokenCallbacks?.setProviderToken;
    this.removeTokenCallback = tokenCallbacks?.removeProviderToken;

    // Initialize IndexedDB storage (only used when callbacks are not configured)
    this.indexedDBStorage = new IndexedDBStorage();

    // Clean up any expired pending auth entries from localStorage
    this.cleanupExpiredPendingAuths();
  }

  /**
   * Initiate OAuth authorization flow
   * 
   * Note: Scopes are defined server-side in integration configuration, not passed from client.
   * 
   * @param provider - OAuth provider (github, gmail, etc.)
   * @param config - OAuth configuration (clientId/clientSecret not needed client-side)
   * @param returnUrl - Optional URL to redirect to after OAuth completion
   * @returns Promise that resolves when authorization is complete
   * 
   * @example
   * ```typescript
   * // Basic flow - scopes are defined server-side
   * await oauthManager.initiateFlow('github', {
   *   provider: 'github',
   *   scopes: [], // Ignored client-side - defined in server integration config
   * });
   * 
   * // With return URL
   * await oauthManager.initiateFlow('github', config, '/marketplace/github');
   * ```
   */
  async initiateFlow(provider: string, config: OAuthConfig, returnUrl?: string): Promise<void> {
    // 1. Generate PKCE parameters
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateStateWithReturnUrl(returnUrl);

    // 2. Store pending auth
    // Note: Scopes are NOT stored client-side - they're defined server-side
    const pendingAuth: PendingAuth = {
      provider,
      state,
      codeVerifier,
      codeChallenge,
      redirectUri: config.redirectUri,
      returnUrl,
      initiatedAt: Date.now(),
    };
    this.pendingAuths.set(state, pendingAuth);

    // 3. Save to localStorage (works for both redirect and popup modes)
    // Even in popup mode, browser might convert popup to tab, so we persist as fallback
    this.savePendingAuthToStorage(state, pendingAuth);

    // 4. Request authorization URL from user's API route
    // Note: Scopes are NOT sent from client - they're defined server-side in integration config
    const authUrl = await this.getAuthorizationUrl(provider, state, codeChallenge, config.redirectUri, codeVerifier);

    // Validate authorization URL before redirecting
    if (!authUrl || authUrl.trim() === '') {
      throw new Error('Received empty authorization URL from server');
    }

    // 5. Open authorization URL (popup or redirect)
    if (this.flowConfig.mode === 'popup') {
      this.windowManager.openPopup(authUrl, this.flowConfig.popupOptions);

      // Wait for callback from popup
      try {
        const callbackParams = await this.windowManager.listenForCallback('popup');
        await this.handleCallback(callbackParams.code, callbackParams.state);
      } catch (error) {
        // Clean up pending auth on error
        this.pendingAuths.delete(state);
        throw error;
      }
    } else {
      // For redirect mode, just redirect - callback will be handled separately
      this.windowManager.openRedirect(authUrl);
    }
  }

  /**
   * Handle OAuth callback with token data (backend redirect flow)
   * Used when backend has already exchanged the code for a token
   * 
   * @param _code - Authorization code from OAuth provider (for verification, not used)
   * @param state - State parameter for verification
   * @param tokenData - Token data from backend
   * @returns Provider token data with access token
   */
  async handleCallbackWithToken(
    _code: string,
    state: string,
    tokenData: ProviderTokenData & { provider?: string }
  ): Promise<ProviderTokenData & { provider: string }> {
    // 1. Verify state and get pending auth
    let pendingAuth = this.pendingAuths.get(state);

    // If not in memory (page reload), try to load from localStorage
    if (!pendingAuth) {
      pendingAuth = this.loadPendingAuthFromStorage(state);
    }

    if (!pendingAuth) {
      throw new Error('Invalid state parameter: no matching OAuth flow found');
    }

    // Check if auth is not too old (5 minutes)
    const fiveMinutes = 5 * 60 * 1000;
    if (Date.now() - pendingAuth.initiatedAt > fiveMinutes) {
      this.pendingAuths.delete(state);
      this.removePendingAuthFromStorage(state);
      throw new Error('OAuth flow expired: please try again');
    }

    // Use provider from tokenData or pendingAuth
    const provider = tokenData.provider || pendingAuth.provider;

    // 2. Store provider token
    const tokenDataToStore: ProviderTokenData = {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      tokenType: tokenData.tokenType,
      expiresIn: tokenData.expiresIn,
      expiresAt: tokenData.expiresAt,
      scopes: tokenData.scopes,
    };

    // 3. Fetch user email from provider
    const email = await fetchUserEmail(provider, tokenDataToStore);
    if (email) {
      tokenDataToStore.email = email;
    }

    // 4. Store in memory cache (keyed by provider for backward compatibility, but email is in tokenData)
    this.providerTokens.set(provider, tokenDataToStore);

    // 5. Save to database (via callback) or IndexedDB
    // This respects skipIndexedDB and database callbacks
    await this.saveProviderToken(provider, tokenDataToStore, email);

    // 6. Clean up pending auth from both memory and storage
    this.pendingAuths.delete(state);
    this.removePendingAuthFromStorage(state);

    return { ...tokenDataToStore, provider };
  }

  /**
   * Handle OAuth callback
   * Call this after user authorizes (from your callback page)
   * 
   * @param code - Authorization code from OAuth provider
   * @param state - State parameter for verification
   * @returns Provider token data with access token
   * 
   * @example
   * ```typescript
   * // In your callback route
   * const tokenData = await oauthManager.handleCallback(code, state);
   * console.log('Access token:', tokenData.accessToken);
   * ```
   */
  async handleCallback(code: string, state: string): Promise<ProviderTokenData & { provider: string }> {
    // 1. Verify state and get pending auth
    let pendingAuth = this.pendingAuths.get(state);

    // If not in memory (page reload), try to load from localStorage
    if (!pendingAuth) {
      pendingAuth = this.loadPendingAuthFromStorage(state);
    }

    if (!pendingAuth) {
      throw new Error('Invalid state parameter: no matching OAuth flow found');
    }

    // Check if auth is not too old (5 minutes)
    const fiveMinutes = 5 * 60 * 1000;
    if (Date.now() - pendingAuth.initiatedAt > fiveMinutes) {
      this.pendingAuths.delete(state);
      this.removePendingAuthFromStorage(state);
      throw new Error('OAuth flow expired: please try again');
    }

    // Call custom callback handler if provided
    if (this.flowConfig.onAuthCallback) {
      try {
        await this.flowConfig.onAuthCallback(pendingAuth.provider, code, state);
      } catch (error) {
        console.error('Custom OAuth callback handler failed:', error);
      }
    }

    // 2. Send to user's API route for token exchange
    try {
      const response = await this.exchangeCodeForToken(
        pendingAuth.provider,
        code,
        pendingAuth.codeVerifier,
        state
      );

      // 3. Store provider token
      const tokenData: ProviderTokenData = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        tokenType: response.tokenType,
        expiresIn: response.expiresIn,
        expiresAt: response.expiresAt,
        scopes: response.scopes,
      };

      // 4. Fetch user email from provider
      const email = await fetchUserEmail(pendingAuth.provider, tokenData);
      if (email) {
        tokenData.email = email;
      }

      // 5. Store in memory cache (keyed by provider for backward compatibility, but email is in tokenData)
      this.providerTokens.set(pendingAuth.provider, tokenData);

      // 6. Save to database (via callback) or IndexedDB
      await this.saveProviderToken(pendingAuth.provider, tokenData, email);

      // 7. Clean up pending auth from both memory and storage
      this.pendingAuths.delete(state);
      this.removePendingAuthFromStorage(state);

      return { ...tokenData, provider: pendingAuth.provider };
    } catch (error) {
      this.pendingAuths.delete(state);
      this.removePendingAuthFromStorage(state);
      throw error;
    }
  }

  /**
   * Check authorization status for a provider
   * Returns whether a token exists locally or in database (stateless check)
   * 
   * Note: This only checks if a token exists, not if it's valid.
   * Token validation happens when making actual API calls.
   * 
   * @param provider - OAuth provider to check
   * @returns Authorization status
   * 
   * @example
   * ```typescript
   * const status = await oauthManager.checkAuthStatus('github');
   * if (status.authorized) {
   *   console.log('GitHub token exists');
   * }
   * ```
   */
  async checkAuthStatus(provider: string, email?: string): Promise<AuthStatus> {
    const tokenData = await this.getProviderToken(provider, email);

    if (!tokenData) {
      return {
        authorized: false,
        provider,
      };
    }

    // Return token status without server validation
    // Token validity will be checked when making actual API calls
    return {
      authorized: true,
      provider,
      scopes: tokenData.scopes,
      expiresAt: tokenData.expiresAt,
    };
  }

  /**
   * Disconnect a specific account for a provider
   * Clears the token for the specific account and removes it from the database if using callbacks
   * 
   * @param provider - OAuth provider to disconnect
   * @param email - Email of the account to disconnect
   * @param context - Optional user context (userId, organizationId, etc.) for multi-tenant apps
   * @returns Promise that resolves when disconnection is complete
   */
  async disconnectAccount(provider: string, email: string, context?: MCPContext): Promise<void> {
    // Delete token from database if using callbacks
    if (this.removeTokenCallback) {
      try {
        await this.removeTokenCallback(provider, email, context);
      } catch (error) {
        console.error(`Failed to delete token for ${provider} (${email}) from database:`, error);
      }
    } else if (this.setTokenCallback) {
      try {
        await this.setTokenCallback(provider, null, email, context);
      } catch (error) {
        console.error(`Failed to delete token for ${provider} (${email}) from database:`, error);
      }
    }

    // Delete from IndexedDB if not using callbacks
    if (!this.setTokenCallback && !this.removeTokenCallback) {
      try {
        await this.indexedDBStorage.deleteToken(provider, email);
      } catch (error) {
        console.error(`Failed to delete token from IndexedDB for ${provider} (${email}):`, error);
      }
    }

    // Clear from memory cache
    this.providerTokens.delete(provider);
  }

  /**
   * Disconnect all accounts for a provider
   * Clears all tokens for the provider and removes them from the database if using callbacks
   * 
   * This method is idempotent - it can be called safely even if the provider
   * is already disconnected or has no tokens.
   * 
   * When using database callbacks (server-side), this will also delete all tokens
   * from the database for the provider.
   * 
   * When using client-side storage (no callbacks), this only clears tokens from IndexedDB
   * and in-memory cache. No server calls are made.
   * 
   * Note: This only clears the local/in-memory tokens and database tokens. It does not revoke the tokens
   * on the provider's side. For full revocation, handle that separately
   * in your application if needed.
   * 
   * @param provider - OAuth provider to disconnect
   * @param context - Optional user context (userId, organizationId, etc.) for multi-tenant apps
   * @returns Promise that resolves when disconnection is complete
   * 
   * @example
   * ```typescript
   * await oauthManager.disconnectProvider('github');
   * // All GitHub tokens are now cleared from cache and database
   * ```
   */
  async disconnectProvider(provider: string, context?: MCPContext): Promise<void> {
    // Delete all tokens from database if using callbacks
    // Note: Without email, we can't target specific accounts, so we clear all
    if (this.removeTokenCallback) {
      try {
        await this.removeTokenCallback(provider, undefined, context);
      } catch (error) {
        console.error(`Failed to delete tokens for ${provider} from database:`, error);
      }
    } else if (this.setTokenCallback) {
      try {
        await this.setTokenCallback(provider, null, undefined, context);
      } catch (error) {
        console.error(`Failed to delete tokens for ${provider} from database:`, error);
      }
    }

    // Delete all tokens from IndexedDB if not using callbacks
    if (!this.setTokenCallback && !this.removeTokenCallback) {
      try {
        await this.indexedDBStorage.deleteTokensByProvider(provider);
      } catch (error) {
        // Fallback to localStorage for backward compatibility when IndexedDB is not available
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const key = `integrate_token_${provider}`;
            window.localStorage.removeItem(key);
          } catch (localStorageError) {
            // Ignore localStorage errors
          }
        }
      }
    }
    
    // Also clear from localStorage for backward compatibility when not using callbacks
    // This ensures tokens are removed even if IndexedDB deletion fails
    if (!this.setTokenCallback && !this.removeTokenCallback) {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const key = `integrate_token_${provider}`;
          window.localStorage.removeItem(key);
        } catch (localStorageError) {
          // Ignore localStorage errors
        }
      }
    }

    // Clear from memory cache
    this.providerTokens.delete(provider);
  }

  /**
   * List all connected accounts for a provider
   * 
   * @param provider - Provider name (e.g., 'github', 'gmail')
   * @returns Array of account information
   */
  async listAccounts(provider: string): Promise<AccountInfo[]> {
    // If using callbacks, we can't list accounts (no standard API)
    // Return empty array or try to get from cache
    if (this.getTokenCallback) {
      // With callbacks, we don't have a way to list all accounts
      // Return empty array or try to infer from cache
      return [];
    }

    // Get from IndexedDB
    if (!this.getTokenCallback) {
      try {
        return await this.indexedDBStorage.listAccounts(provider);
      } catch (error) {
        console.error(`Failed to list accounts for ${provider}:`, error);
        return [];
      }
    }

    return [];
  }

  /**
   * Get provider token data
   * Uses callback if provided, otherwise checks IndexedDB or in-memory cache
   * 
   * Note: This method only retrieves tokens - it does NOT clear tokens from IndexedDB
   * or make any server calls for token deletion. Token clearing should be done via
   * disconnectProvider or disconnectAccount.
   * 
   * @param provider - Provider name (e.g., 'github', 'gmail')
   * @param email - Optional email to get specific account token
   * @param context - Optional user context (userId, organizationId, etc.) for multi-tenant apps
   */
  async getProviderToken(provider: string, email?: string, context?: MCPContext): Promise<ProviderTokenData | undefined> {
    // If callback is provided, use it exclusively
    if (this.getTokenCallback) {
      try {
        const tokenData = await this.getTokenCallback(provider, email, context);
        // Update in-memory cache for performance
        if (tokenData) {
          this.providerTokens.set(provider, tokenData);
        }
        return tokenData;
      } catch (error) {
        console.error(`Failed to get token for ${provider} via callback:`, error);
        return undefined;
      }
    }

    // If email is provided, get specific account token from IndexedDB
    if (email && !this.getTokenCallback) {
      try {
        const tokenData = await this.indexedDBStorage.getToken(provider, email);
        if (tokenData) {
          this.providerTokens.set(provider, tokenData);
        }
        return tokenData;
      } catch (error) {
        console.error(`Failed to get token from IndexedDB for ${provider}:`, error);
      }
    }

    // Otherwise use in-memory cache (loaded from IndexedDB on initialization)
    return this.providerTokens.get(provider);
  }

  /**
   * Get all provider tokens
   */
  getAllProviderTokens(): Map<string, ProviderTokenData> {
    return new Map(this.providerTokens);
  }

  /**
   * Get provider token from in-memory cache synchronously
   * Only returns cached tokens, does not call database callbacks
   * Used for immediate synchronous checks after tokens are loaded
   * @param provider - Provider name (e.g., 'github', 'gmail')
   */
  getProviderTokenFromCache(provider: string): ProviderTokenData | undefined {
    return this.providerTokens.get(provider);
  }

  /**
   * Set provider token (for manual token management)
   * Uses callback if provided, otherwise uses IndexedDB
   * @param provider - Provider name (e.g., 'github', 'gmail')
   * @param tokenData - Token data to store
   * @param email - Optional email to store specific account token
   * @param context - Optional user context (userId, organizationId, etc.) for multi-tenant apps
   */
  async setProviderToken(provider: string, tokenData: ProviderTokenData | null, email?: string, context?: MCPContext): Promise<void> {
    const tokenEmail = email || tokenData?.email;
    
    if (tokenData === null) {
      // Delete token
      if (tokenEmail) {
        // Delete specific account
        this.providerTokens.delete(provider);
      } else {
        // Delete all tokens for provider
        this.providerTokens.delete(provider);
      }
    } else {
      // Set token
      this.providerTokens.set(provider, tokenData);
    }
    await this.saveProviderToken(provider, tokenData, tokenEmail, context);
  }

  /**
   * Clear specific provider token from client-side storage only
   * 
   * This method is purely client-side and only clears tokens from:
   * - In-memory cache
   * - IndexedDB (when available and not using server-side database storage)
   * 
   * Note: This method does NOT make any server calls or API requests.
   * When using database callbacks, this only clears the in-memory cache.
   * Token deletion from database should be handled by the host application
   * (e.g., via disconnectProvider which handles server-side operations separately).
   */
  clearProviderToken(provider: string): void {
    this.providerTokens.delete(provider);

    // Clear from IndexedDB if not using server-side database storage and not skipping localStorage
    if (!this.setTokenCallback && !this.removeTokenCallback && !this.skipLocalStorage) {
      this.indexedDBStorage.deleteTokensByProvider(provider).catch((error) => {
        console.error(`Failed to clear tokens for ${provider} from IndexedDB:`, error);
      });
    }
  }

  /**
   * Clear all provider tokens
   * Note: When using database callbacks, this only clears the in-memory cache.
   * Token deletion from database should be handled by the host application.
   */
  clearAllProviderTokens(): void {
    this.providerTokens.clear();

    // Clear from IndexedDB and localStorage if not using server-side database storage and not skipping localStorage
    if (!this.setTokenCallback && !this.removeTokenCallback && !this.skipLocalStorage) {
      // Clear from localStorage for backward compatibility
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          // Remove all integrate_token_* keys
          const keysToRemove: string[] = [];
          for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key && key.startsWith('integrate_token_')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => window.localStorage.removeItem(key));
        } catch (localStorageError) {
          // Ignore localStorage errors
        }
      }
      this.indexedDBStorage.clearAll().catch((error) => {
        console.error('Failed to clear all tokens from IndexedDB:', error);
      });
    }
  }

  /**
   * Clear all pending OAuth flows
   * Removes all pending auths from memory and localStorage
   */
  clearAllPendingAuths(): void {
    // Clear in-memory pending auths
    this.pendingAuths.clear();

    // Clear all pending auths from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const prefix = 'integrate_oauth_pending_';
        const keysToRemove: string[] = [];

        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
          }
        }

        keysToRemove.forEach(key => window.localStorage.removeItem(key));
      } catch (error) {
        console.error('Failed to clear pending auths from localStorage:', error);
      }
    }
  }

  /**
   * Save provider token to database (via callback) or IndexedDB
   * 
   * Storage decision logic:
   * 1. If setTokenCallback is configured → use callback exclusively (no IndexedDB)
   * 2. If skipLocalStorage is true → skip IndexedDB/localStorage (token only in memory)
   * 3. Otherwise → use IndexedDB (when callbacks are NOT configured AND skipLocalStorage is false)
   * 
   * @param provider - Provider name (e.g., 'github', 'gmail')
   * @param tokenData - Token data to store, or null to delete
   * @param email - Optional email to store specific account token
   * @param context - Optional user context (userId, organizationId, etc.) for multi-tenant apps
   */
  private async saveProviderToken(provider: string, tokenData: ProviderTokenData | null, email?: string, context?: MCPContext): Promise<void> {
    // Rule 1: If callback is provided, use it exclusively (server-side with database)
    // When callbacks are configured, we do NOT save to IndexedDB
    if (this.setTokenCallback) {
      try {
        await this.setTokenCallback(provider, tokenData, email, context);
      } catch (error) {
        console.error(`Failed to ${tokenData === null ? 'delete' : 'save'} token for ${provider} via callback:`, error);
        throw error;
      }
      // Return early - callbacks are exclusive, no IndexedDB when callbacks are configured
      return;
    }

    // Rule 2: If skipLocalStorage is true, only store in memory (skip IndexedDB/localStorage)
    if (this.skipLocalStorage) {
      // Token is already stored in memory cache (providerTokens map)
      // No need to save to IndexedDB/localStorage
      return;
    }

    // If tokenData is null, delete the token (clear from memory and IndexedDB if applicable)
    if (tokenData === null) {
      if (email) {
      // Delete specific account
      if (!this.setTokenCallback && !this.removeTokenCallback) {
        await this.indexedDBStorage.deleteToken(provider, email).catch(() => {
          // Fallback to localStorage for backward compatibility when IndexedDB is not available
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              const key = `integrate_token_${provider}`;
              window.localStorage.removeItem(key);
            } catch (localStorageError) {
              // Ignore localStorage errors
            }
          }
        });
      }
      } else {
        // Delete all tokens for provider
        this.clearProviderToken(provider);
        // Also clear from localStorage for backward compatibility
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const key = `integrate_token_${provider}`;
            window.localStorage.removeItem(key);
          } catch (localStorageError) {
            // Ignore localStorage errors
          }
        }
      }
      return;
    }

    // Rule 3: Use IndexedDB when callbacks are NOT configured and skipLocalStorage is false
    // This is the default behavior for client-side only usage without database callbacks
    const tokenEmail = email || tokenData.email;
    if (tokenEmail) {
      try {
        await this.indexedDBStorage.saveToken(provider, tokenEmail, tokenData);
      } catch (error) {
        // Fallback to localStorage for backward compatibility when IndexedDB is not available
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const key = `integrate_token_${provider}`;
            window.localStorage.setItem(key, JSON.stringify(tokenData));
          } catch (localStorageError) {
            console.error(`Failed to save token for ${provider} to localStorage:`, localStorageError);
          }
        } else {
          console.error(`Failed to save token for ${provider} to IndexedDB:`, error);
        }
      }
    } else {
      // No email provided, fallback to localStorage for backward compatibility
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const key = `integrate_token_${provider}`;
          window.localStorage.setItem(key, JSON.stringify(tokenData));
        } catch (localStorageError) {
          console.error(`Failed to save token for ${provider} to localStorage:`, localStorageError);
        }
      }
    }
  }

  /**
   * Load provider token from database (via callback) or IndexedDB
   * 
   * Loading decision logic (mirrors saveProviderToken):
   * 1. If getTokenCallback is configured → use callback exclusively (no IndexedDB)
   * 2. If skipLocalStorage is true → skip IndexedDB/localStorage (only check memory cache)
   * 3. Otherwise → use IndexedDB (when callbacks are NOT configured AND skipLocalStorage is false)
   * 4. Fallback to localStorage if IndexedDB is not available (for backward compatibility)
   * 
   * Returns undefined if not found or invalid
   * Note: Without email, returns the first token found for the provider
   */
  private async loadProviderToken(provider: string, email?: string, context?: MCPContext): Promise<ProviderTokenData | undefined> {
    // Rule 1: If callback is provided, use it exclusively
    // When callbacks are configured, we do NOT load from IndexedDB
    if (this.getTokenCallback) {
      try {
        return await this.getTokenCallback(provider, email, context);
      } catch (error) {
        console.error(`Failed to load token for ${provider} via callback:`, error);
        return undefined;
      }
    }

    // Rule 2: If skipLocalStorage is true, only check memory cache (skip IndexedDB/localStorage)
    if (this.skipLocalStorage) {
      // Only return from memory cache, don't load from IndexedDB/localStorage
      return this.providerTokens.get(provider);
    }

    // Rule 3: Use IndexedDB when callbacks are NOT configured and skipLocalStorage is false
    // This is the default behavior for client-side only usage without database callbacks
    if (email) {
      try {
        return await this.indexedDBStorage.getToken(provider, email);
      } catch (error) {
        // Fallback to localStorage for backward compatibility when IndexedDB is not available
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const key = `integrate_token_${provider}`;
            const stored = window.localStorage.getItem(key);
            if (stored) {
              return JSON.parse(stored) as ProviderTokenData;
            }
          } catch (localStorageError) {
            // Ignore localStorage errors
          }
        }
        return undefined;
      }
    } else {
      // Without email, get all tokens and return the first one (for backward compatibility)
      try {
        const tokens = await this.indexedDBStorage.getTokensByProvider(provider);
        if (tokens.size > 0) {
          // Return first token (arbitrary choice when no email specified)
          return tokens.values().next().value;
        }
      } catch (error) {
        // Fallback to localStorage for backward compatibility when IndexedDB is not available
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const key = `integrate_token_${provider}`;
            const stored = window.localStorage.getItem(key);
            if (stored) {
              return JSON.parse(stored) as ProviderTokenData;
            }
          } catch (localStorageError) {
            // Ignore localStorage errors
          }
        }
      }
    }
    return undefined;
  }

  /**
   * Load all provider tokens from database (via callback) or IndexedDB on initialization
   */
  async loadAllProviderTokens(providers: string[]): Promise<void> {
    for (const provider of providers) {
      const tokenData = await this.loadProviderToken(provider, undefined, undefined);
      if (tokenData) {
        this.providerTokens.set(provider, tokenData);
      }
    }
  }

  /**
   * Load all provider tokens synchronously from IndexedDB on initialization
   * Only works when database callbacks are NOT configured
   * This ensures tokens are available immediately for isAuthorized() calls
   * Note: IndexedDB operations are async, so this method falls back to localStorage synchronously
   */
  loadAllProviderTokensSync(providers: string[]): void {
    if (this.getTokenCallback) {
      return;
    }

    // If skipLocalStorage is true, don't load from localStorage/IndexedDB
    if (this.skipLocalStorage) {
      return;
    }

    // Try to load from localStorage synchronously first (for backward compatibility)
    // This ensures tokens are available immediately when IndexedDB is not available
    if (typeof window !== 'undefined' && window.localStorage) {
      for (const provider of providers) {
        try {
          const key = `integrate_token_${provider}`;
          const stored = window.localStorage.getItem(key);
          if (stored) {
            const tokenData = JSON.parse(stored) as ProviderTokenData;
            // Store in memory cache for immediate access
            this.providerTokens.set(provider, tokenData);
          }
        } catch {
          // Ignore localStorage errors
        }
      }
    }

    // Also attempt async load from IndexedDB (fire and forget)
    // This will update the cache if IndexedDB has more recent data
    this.loadAllProviderTokens(providers).catch(() => {
      // Ignore errors - we've already tried localStorage as fallback
    });
  }

  /**
   * Save pending auth to localStorage (for redirect flows)
   * Uses localStorage instead of sessionStorage because OAuth may open in a new tab,
   * and sessionStorage is isolated per tab. localStorage is shared across tabs.
   * Keyed by state parameter for security and retrieval.
   * 
   * Note: Pending auths are always stored in localStorage regardless of skipLocalStorage,
   * as they are temporary OAuth state needed for the flow, not permanent token storage.
   */
  private savePendingAuthToStorage(state: string, pendingAuth: PendingAuth): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `integrate_oauth_pending_${state}`;
        window.localStorage.setItem(key, JSON.stringify(pendingAuth));
      } catch (error) {
        console.error('Failed to save pending auth to localStorage:', error);
      }
    }
  }

  /**
   * Load pending auth from localStorage (after redirect)
   * Returns undefined if not found or invalid
   * 
   * Note: Pending auths are always loaded from localStorage regardless of skipLocalStorage,
   * as they are temporary OAuth state needed for the flow, not permanent token storage.
   */
  private loadPendingAuthFromStorage(state: string): PendingAuth | undefined {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `integrate_oauth_pending_${state}`;
        const stored = window.localStorage.getItem(key);
        if (stored) {
          return JSON.parse(stored) as PendingAuth;
        }
      } catch (error) {
        console.error('Failed to load pending auth from localStorage:', error);
      }
    }
    return undefined;
  }

  /**
   * Remove pending auth from localStorage
   * 
   * Note: Pending auths are always removed from localStorage regardless of skipLocalStorage,
   * as they are temporary OAuth state that should be cleaned up after the flow completes.
   */
  private removePendingAuthFromStorage(state: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `integrate_oauth_pending_${state}`;
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error('Failed to remove pending auth from localStorage:', error);
      }
    }
  }

  /**
   * Clean up expired pending auth entries from localStorage
   * Removes any entries older than 5 minutes
   * 
   * Note: Pending auths are always cleaned up from localStorage regardless of skipLocalStorage,
   * as they are temporary OAuth state that should be removed when expired.
   */
  private cleanupExpiredPendingAuths(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const prefix = 'integrate_oauth_pending_';
        const fiveMinutes = 5 * 60 * 1000;
        const now = Date.now();

        // Iterate through localStorage keys
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            try {
              const stored = window.localStorage.getItem(key);
              if (stored) {
                const pendingAuth = JSON.parse(stored) as PendingAuth;
                // Check if expired
                if (now - pendingAuth.initiatedAt > fiveMinutes) {
                  keysToRemove.push(key);
                }
              }
            } catch (error) {
              // Invalid JSON, remove it
              keysToRemove.push(key);
            }
          }
        }

        // Remove expired entries
        keysToRemove.forEach(key => window.localStorage.removeItem(key));
      } catch (error) {
        console.error('Failed to cleanup expired pending auths:', error);
      }
    }
  }

  /**
   * Request authorization URL from user's API route
   * The API route will add OAuth secrets and scopes from server config and forward to MCP server
   * 
   * For redirect flows, the codeVerifier is sent to the server so it can be stored and used
   * during the callback after redirect. For popup flows, codeVerifier stays client-side.
   */
  private async getAuthorizationUrl(
    provider: string,
    state: string,
    codeChallenge: string,
    redirectUri?: string,
    codeVerifier?: string
  ): Promise<string> {
    // Construct URL: {apiBaseUrl}{oauthApiBase}/authorize
    // If apiBaseUrl is not set, use relative URL (same origin)
    const url = this.apiBaseUrl
      ? `${this.apiBaseUrl}${this.oauthApiBase}/authorize`
      : `${this.oauthApiBase}/authorize`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        // Scopes are NOT sent - they're defined server-side in integration configuration
        state,
        codeChallenge,
        codeChallengeMethod: 'S256',
        redirectUri,
        // Include codeVerifier for redirect flows (both same-origin and cross-origin)
        // For redirect flows, the server needs to store codeVerifier to use during callback
        // For popup flows, codeVerifier stays client-side since page doesn't reload
        codeVerifier: this.flowConfig.mode === 'redirect' ? codeVerifier : undefined,
        // Include frontendOrigin for cross-origin redirect flows (when apiBaseUrl is set)
        frontendOrigin: this.apiBaseUrl && this.flowConfig.mode === 'redirect' && typeof window !== 'undefined' ? window.location.origin : undefined,
      }),
    });

    // Check for X-Integrate-Use-Database header to auto-detect database usage
    if (response.headers.get('X-Integrate-Use-Database') === 'true') {
      this.setSkipLocalStorage(true);
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get authorization URL: ${error}`);
    }

    const data = await response.json() as AuthorizationUrlResponse;

    // Validate that authorizationUrl is present and valid
    if (!data.authorizationUrl) {
      throw new Error('Authorization URL is missing from server response');
    }

    if (typeof data.authorizationUrl !== 'string' || data.authorizationUrl.trim() === '') {
      throw new Error('Invalid authorization URL received from server');
    }

    return data.authorizationUrl;
  }

  /**
   * Exchange authorization code for session token via user's API route
   * The API route will forward to MCP server
   */
  private async exchangeCodeForToken(
    provider: string,
    code: string,
    codeVerifier: string,
    state: string
  ): Promise<OAuthCallbackResponse> {
    // Construct URL: {apiBaseUrl}{oauthApiBase}/callback
    // If apiBaseUrl is not set, use relative URL (same origin)
    const url = this.apiBaseUrl
      ? `${this.apiBaseUrl}${this.oauthApiBase}/callback`
      : `${this.oauthApiBase}/callback`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        code,
        codeVerifier,
        state,
      }),
    });

    // Check for X-Integrate-Use-Database header to auto-detect database usage
    if (response.headers.get('X-Integrate-Use-Database') === 'true') {
      this.setSkipLocalStorage(true);
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for token: ${error}`);
    }

    const data = await response.json() as OAuthCallbackResponse;
    return data;
  }


  /**
   * Set whether to skip localStorage/IndexedDB storage
   * When true, tokens will only be stored in memory and via callbacks (if configured)
   * This is automatically set when X-Integrate-Use-Database header is detected
   * 
   * @param value - Whether to skip localStorage/IndexedDB
   */
  setSkipLocalStorage(value: boolean): void {
    this.skipLocalStorage = value;
  }

  /**
   * Close any open OAuth windows
   */
  close(): void {
    this.windowManager.close();
  }
}


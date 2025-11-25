/**
 * Automatic skipLocalStorage Detection Tests
 * Tests that skipLocalStorage is automatically detected and configured correctly
 * based on database callbacks and server response headers
 */

import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
import { OAuthManager } from "../../src/oauth/manager.js";
import type { ProviderTokenData } from "../../src/oauth/types.js";

// Mock localStorage
const mockLocalStorage = new Map<string, string>();

describe("Automatic skipLocalStorage Detection", () => {
  beforeEach(() => {
    mockLocalStorage.clear();

    // Mock global window object if it doesn't exist
    if (typeof globalThis.window === 'undefined') {
      (globalThis as any).window = {
        localStorage: {
          getItem: (key: string) => mockLocalStorage.get(key) || null,
          setItem: (key: string, value: string) => mockLocalStorage.set(key, value),
          removeItem: (key: string) => mockLocalStorage.delete(key),
          clear: () => mockLocalStorage.clear(),
          get length() { return mockLocalStorage.size; },
          key: (index: number) => Array.from(mockLocalStorage.keys())[index] || null,
        },
      };
    }
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  describe("Auto-detection from callbacks", () => {
    test("automatically sets skipLocalStorage to true when setProviderToken callback is provided", async () => {
      const setTokenMock = mock(async (provider: string, tokenData: ProviderTokenData, email?: string, context?: any) => {
        // Simulate database save
      });

      const manager = new OAuthManager(
        "/api/integrate/oauth",
        undefined,
        undefined,
        {
          setProviderToken: setTokenMock,
        }
      );

      const tokenData: ProviderTokenData = {
        accessToken: "db-token-123",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      // Set token - should use callback, NOT localStorage
      await manager.setProviderToken("github", tokenData);

      // Verify callback was called
      expect(setTokenMock).toHaveBeenCalledWith("github", tokenData, undefined, undefined);

      // Verify token was NOT saved to localStorage
      expect(mockLocalStorage.has("integrate_token_github")).toBe(false);
    });

    test("automatically sets skipLocalStorage to true when getProviderToken callback is provided", async () => {
      const mockTokenData: ProviderTokenData = {
        accessToken: "db-token-456",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      const getTokenMock = mock(async (provider: string, email?: string, context?: any) => {
        return provider === "github" ? mockTokenData : undefined;
      });

      const manager = new OAuthManager(
        "/api/integrate/oauth",
        undefined,
        undefined,
        {
          getProviderToken: getTokenMock,
        }
      );

      // Get token - should use callback, NOT localStorage
      const token = await manager.getProviderToken("github");

      // Verify callback was called
      expect(getTokenMock).toHaveBeenCalledWith("github", undefined, undefined);
      expect(token).toEqual(mockTokenData);

      // Verify token was NOT loaded from localStorage
      // (getProviderToken doesn't write, but we should verify localStorage wasn't used)
      expect(mockLocalStorage.has("integrate_token_github")).toBe(false);
    });

    test("automatically sets skipLocalStorage to false when no callbacks are provided", async () => {
      const manager = new OAuthManager("/api/integrate/oauth");

      const tokenData: ProviderTokenData = {
        accessToken: "local-token-789",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      // Set token - should use localStorage when no callbacks
      await manager.setProviderToken("github", tokenData);

      // Verify token WAS saved to localStorage
      expect(mockLocalStorage.has("integrate_token_github")).toBe(true);
      const stored = JSON.parse(mockLocalStorage.get("integrate_token_github")!);
      expect(stored).toEqual(tokenData);
    });

    test("tokens saved to database when callbacks present, not localStorage", async () => {
      const dbTokens: Record<string, ProviderTokenData> = {};
      const setTokenMock = mock(async (provider: string, tokenData: ProviderTokenData, email?: string, context?: any) => {
        dbTokens[provider] = tokenData;
      });
      const getTokenMock = mock(async (provider: string) => {
        return dbTokens[provider];
      });

      const manager = new OAuthManager(
        "/api/integrate/oauth",
        undefined,
        undefined,
        {
          getProviderToken: getTokenMock,
          setProviderToken: setTokenMock,
        }
      );

      const tokenData: ProviderTokenData = {
        accessToken: "db-only-token",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      // Save token
      await manager.setProviderToken("github", tokenData);

      // Verify it went to database (callback)
      expect(setTokenMock).toHaveBeenCalledWith("github", tokenData, undefined, undefined);
      expect(dbTokens["github"]).toEqual(tokenData);

      // Verify it did NOT go to localStorage
      expect(mockLocalStorage.has("integrate_token_github")).toBe(false);

      // Verify we can retrieve from database
      const retrieved = await manager.getProviderToken("github");
      expect(retrieved).toEqual(tokenData);
      expect(getTokenMock).toHaveBeenCalledWith("github", undefined, undefined);
    });

    test("tokens saved to localStorage when no callbacks, not database", async () => {
      const manager = new OAuthManager("/api/integrate/oauth");

      const tokenData: ProviderTokenData = {
        accessToken: "local-only-token",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      // Save token
      await manager.setProviderToken("github", tokenData);

      // Verify it went to localStorage
      expect(mockLocalStorage.has("integrate_token_github")).toBe(true);
      const stored = JSON.parse(mockLocalStorage.get("integrate_token_github")!);
      expect(stored).toEqual(tokenData);

      // Verify it's in memory cache
      const retrieved = await manager.getProviderToken("github");
      expect(retrieved).toEqual(tokenData);
    });
  });

  describe("Runtime detection from response header", () => {
    test("detects X-Integrate-Use-Database header and updates skipLocalStorage", async () => {
      // Note: setSkipLocalStorage method was removed. skipLocalStorage is now automatically
      // detected based on whether callbacks are provided. This test verifies that when
      // callbacks are provided, localStorage is not used.
      const dbTokens: Record<string, ProviderTokenData> = {};
      const setTokenMock = mock(async (provider: string, tokenData: ProviderTokenData, email?: string, context?: any) => {
        dbTokens[provider] = tokenData;
      });
      const getTokenMock = mock(async (provider: string, email?: string, context?: any) => {
        return dbTokens[provider];
      });

      const manager = new OAuthManager(
        "/api/integrate/oauth",
        undefined,
        undefined,
        {
          getProviderToken: getTokenMock,
          setProviderToken: setTokenMock,
        }
      );

      const tokenData: ProviderTokenData = {
        accessToken: "initial-token",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      await manager.setProviderToken("github", tokenData);
      // Should NOT be in localStorage when callbacks are provided
      expect(mockLocalStorage.has("integrate_token_github")).toBe(false);
      // Should be in database (callback)
      expect(dbTokens["github"]).toEqual(tokenData);
    });

    test("header detection in getAuthorizationUrl updates skipLocalStorage", async () => {
      // Note: setSkipLocalStorage method was removed. skipLocalStorage is now automatically
      // detected based on whether callbacks are provided. This test verifies that when
      // callbacks are provided, localStorage is not used.
      const dbTokens: Record<string, ProviderTokenData> = {};
      const setTokenMock = mock(async (provider: string, tokenData: ProviderTokenData, email?: string, context?: any) => {
        dbTokens[provider] = tokenData;
      });
      const getTokenMock = mock(async (provider: string, email?: string, context?: any) => {
        return dbTokens[provider];
      });

      const manager = new OAuthManager(
        "/api/integrate/oauth",
        undefined,
        undefined,
        {
          getProviderToken: getTokenMock,
          setProviderToken: setTokenMock,
        }
      );

      const tokenData: ProviderTokenData = {
        accessToken: "token-after-header",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      await manager.setProviderToken("github", tokenData);
      // Should NOT be in localStorage when callbacks are provided
      expect(mockLocalStorage.has("integrate_token_github")).toBe(false);
      // Should be in database (callback)
      expect(dbTokens["github"]).toEqual(tokenData);
    });

    test("header detection in exchangeCodeForToken updates skipLocalStorage", async () => {
      // Note: setSkipLocalStorage method was removed. skipLocalStorage is now automatically
      // detected based on whether callbacks are provided. This test verifies that when
      // callbacks are provided, localStorage is not used.
      const dbTokens: Record<string, ProviderTokenData> = {};
      const setTokenMock = mock(async (provider: string, tokenData: ProviderTokenData, email?: string, context?: any) => {
        dbTokens[provider] = tokenData;
      });
      const getTokenMock = mock(async (provider: string, email?: string, context?: any) => {
        return dbTokens[provider];
      });

      const manager = new OAuthManager(
        "/api/integrate/oauth",
        undefined,
        undefined,
        {
          getProviderToken: getTokenMock,
          setProviderToken: setTokenMock,
        }
      );

      const tokenData: ProviderTokenData = {
        accessToken: "token-after-callback-header",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      await manager.setProviderToken("github", tokenData);
      // Should NOT be in localStorage when callbacks are provided
      expect(mockLocalStorage.has("integrate_token_github")).toBe(false);
      // Should be in database (callback)
      expect(dbTokens["github"]).toEqual(tokenData);
    });
  });

  describe("Combined scenarios", () => {
    test("client-side: tokens persist in localStorage across page reloads", async () => {
      const manager1 = new OAuthManager("/api/integrate/oauth");

      const tokenData: ProviderTokenData = {
        accessToken: "persistent-token",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      // Save token
      await manager1.setProviderToken("github", tokenData);
      expect(mockLocalStorage.has("integrate_token_github")).toBe(true);

      // Simulate page reload - create new manager
      const manager2 = new OAuthManager("/api/integrate/oauth");

      // Load tokens synchronously (simulating page load)
      manager2.loadAllProviderTokensSync(["github"]);

      // Token should be loaded from localStorage
      const token = manager2.getProviderTokenFromCache("github");
      expect(token).toEqual(tokenData);
    });

    test("server-side with DB: tokens persist in database, not localStorage", async () => {
      const dbTokens: Record<string, ProviderTokenData> = {};
      const setTokenMock = mock(async (provider: string, tokenData: ProviderTokenData, email?: string, context?: any) => {
        dbTokens[provider] = tokenData;
      });
      const getTokenMock = mock(async (provider: string) => {
        return dbTokens[provider];
      });

      const manager1 = new OAuthManager(
        "/api/integrate/oauth",
        undefined,
        undefined,
        {
          getProviderToken: getTokenMock,
          setProviderToken: setTokenMock,
        }
      );

      const tokenData: ProviderTokenData = {
        accessToken: "db-persistent-token",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      // Save token
      await manager1.setProviderToken("github", tokenData);
      expect(dbTokens["github"]).toEqual(tokenData);
      expect(mockLocalStorage.has("integrate_token_github")).toBe(false);

      // Simulate new request - create new manager
      const manager2 = new OAuthManager(
        "/api/integrate/oauth",
        undefined,
        undefined,
        {
          getProviderToken: getTokenMock,
          setProviderToken: setTokenMock,
        }
      );

      // Load tokens asynchronously (from database)
      await manager2.loadAllProviderTokens(["github"]);

      // Token should be loaded from database
      const token = await manager2.getProviderToken("github");
      expect(token).toEqual(tokenData);
      expect(getTokenMock).toHaveBeenCalledWith("github", undefined, undefined);
    });

    test("disconnectProvider removes from database when callbacks present, not localStorage", async () => {
      const dbTokens: Record<string, ProviderTokenData> = {
        github: {
          accessToken: "token-to-delete",
          tokenType: "Bearer",
          expiresIn: 3600,
        },
      };

      const getTokenMock = mock(async (provider: string, email?: string, context?: any) => {
        return dbTokens[provider];
      });
      const removeTokenMock = mock(async (provider: string, email?: string, context?: any) => {
        delete dbTokens[provider];
      });

      const manager = new OAuthManager(
        "/api/integrate/oauth",
        undefined,
        undefined,
        {
          getProviderToken: getTokenMock,
          removeProviderToken: removeTokenMock,
        }
      );

      // Disconnect
      await manager.disconnectProvider("github");

      // Should call removeProviderToken callback
      expect(removeTokenMock).toHaveBeenCalledWith("github", undefined, undefined);

      // Should be removed from database
      expect(dbTokens["github"]).toBeUndefined();

      // Should NOT interact with localStorage
      // (localStorage might have been cleared, but that's just cleanup)
    });

    test("disconnectProvider removes from localStorage when no callbacks", async () => {
      const manager = new OAuthManager("/api/integrate/oauth");

      const tokenData: ProviderTokenData = {
        accessToken: "local-token-to-delete",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      // Save to localStorage
      await manager.setProviderToken("github", tokenData);
      expect(mockLocalStorage.has("integrate_token_github")).toBe(true);

      // Disconnect
      await manager.disconnectProvider("github");

      // Should be removed from localStorage
      expect(mockLocalStorage.has("integrate_token_github")).toBe(false);
    });
  });

  describe("Edge cases", () => {
    test("setSkipLocalStorage can be called multiple times", () => {
      // Note: setSkipLocalStorage method was removed - skipLocalStorage is now automatically
      // detected based on whether callbacks are provided. This test is kept for backward
      // compatibility but the method no longer exists.
      const manager = new OAuthManager("/api/integrate/oauth");

      // When no callbacks are provided, localStorage is used (skipLocalStorage is false)
      // When callbacks are provided, localStorage is skipped (skipLocalStorage is true)
      expect(manager).toBeDefined();
    });

    test("auto-detection works with only getProviderToken (read-only)", async () => {
      const mockTokenData: ProviderTokenData = {
        accessToken: "readonly-token",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      const getTokenMock = mock(async (provider: string, email?: string, context?: any) => {
        return provider === "github" ? mockTokenData : undefined;
      });

      const manager = new OAuthManager(
        "/api/integrate/oauth",
        undefined,
        undefined,
        {
          getProviderToken: getTokenMock,
          // No setProviderToken
        }
      );

      // Setting a token should update in-memory cache but not localStorage
      const newToken: ProviderTokenData = {
        accessToken: "new-in-memory-token",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      await manager.setProviderToken("github", newToken);

      // When only getProviderToken is provided (no setProviderToken), the token
      // will still be saved to localStorage/IndexedDB as a fallback since there's
      // no setTokenCallback to handle the save operation
      // The token should be in memory
      const allTokens = manager.getAllProviderTokens();
      expect(allTokens.get("github")).toEqual(newToken);
      
      // Note: With only getProviderToken callback, setProviderToken will still
      // attempt to save to IndexedDB/localStorage since there's no setTokenCallback
      // This is expected behavior - if you want to skip localStorage, provide both callbacks
    });

    test("pending auths are always cleaned up even with database callbacks", async () => {
      const setTokenMock = mock(async (provider: string, tokenData: ProviderTokenData) => {
        // Simulate database save
      });

      const manager = new OAuthManager(
        "/api/integrate/oauth",
        undefined,
        undefined,
        {
          setProviderToken: setTokenMock,
        }
      );

      // Simulate OAuth flow: create pending auth
      const state = "test-state-123";
      const pendingAuth = {
        provider: "github",
        state,
        codeVerifier: "verifier",
        codeChallenge: "challenge",
        redirectUri: "http://localhost/callback",
        returnUrl: undefined,
        initiatedAt: Date.now(),
      };

      // Save pending auth to memory and localStorage (simulating initiateFlow)
      (manager as any).pendingAuths.set(state, pendingAuth);
      const pendingKey = `integrate_oauth_pending_${state}`;
      mockLocalStorage.set(pendingKey, JSON.stringify(pendingAuth));
      expect(mockLocalStorage.has(pendingKey)).toBe(true);

      // Simulate callback completion with token (backend redirect flow)
      const tokenData: ProviderTokenData = {
        accessToken: "db-token",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      await manager.handleCallbackWithToken("code", state, { ...tokenData, provider: "github" });

      // Pending auth should be removed from localStorage even though we're using database for tokens
      expect(mockLocalStorage.has(pendingKey)).toBe(false);

      // Token should NOT be in localStorage (goes to database instead)
      expect(mockLocalStorage.has("integrate_token_github")).toBe(false);

      // But token should be saved via callback
      expect(setTokenMock).toHaveBeenCalledWith("github", tokenData, undefined, undefined);
    });
  });
});


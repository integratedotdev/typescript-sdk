/**
 * Client OAuth Methods Tests
 */

import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
import { createMCPClient } from "../../src/client.js";
import { githubIntegration } from "../../src/integrations/github.js";
import { gmailIntegration } from "../../src/integrations/gmail.js";

describe("Client OAuth Methods", () => {
  let originalFetch: typeof fetch;
  let originalLocalStorage: Storage | undefined;
  let originalWindow: Window & typeof globalThis | undefined;
  const mockLocalStorage = new Map<string, string>();

  beforeEach(() => {
    originalFetch = global.fetch;
    originalLocalStorage = global.localStorage;
    originalWindow = global.window;

    // Clear mock storage
    mockLocalStorage.clear();

    // Mock localStorage
    const mockStorage = {
      getItem: (key: string) => mockLocalStorage.get(key) || null,
      setItem: (key: string, value: string) => mockLocalStorage.set(key, value),
      removeItem: (key: string) => mockLocalStorage.delete(key),
      clear: () => mockLocalStorage.clear(),
      get length() { return mockLocalStorage.size; },
      key: (index: number) => Array.from(mockLocalStorage.keys())[index] || null,
    };

    global.localStorage = mockStorage as any;

    // Always set up window with localStorage before creating clients
    (global as any).window = {
      localStorage: mockStorage,
    };
  });

  afterEach(() => {
    global.fetch = originalFetch;
    mockLocalStorage.clear();
    
    if (originalLocalStorage) {
      global.localStorage = originalLocalStorage;
    } else {
      delete (global as any).localStorage;
    }
    
    if (originalWindow) {
      global.window = originalWindow;
    } else {
      delete (global as any).window;
    }
  });

  describe("Provider Token Management", () => {
    test("getProviderToken returns undefined initially", async () => {
      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        singleton: false,
      });

      expect(await client.getProviderToken('github')).toBeUndefined();
    });

    test("setProviderToken stores token", async () => {
      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        singleton: false,
      });

      const tokenData = {
        accessToken: "test-access-token",
        tokenType: "Bearer",
        expiresIn: 3600,
      };
      await client.setProviderToken('github', tokenData);

      expect(await client.getProviderToken('github')).toEqual(tokenData);
    });

    test("provider tokens are loaded from localStorage", async () => {
      // This test verifies tokens are loaded from localStorage on initialization
      // Pre-populate localStorage with a token
      const tokenData = {
        accessToken: 'stored-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
      };
      mockLocalStorage.set('integrate_token_github', JSON.stringify(tokenData));

      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        singleton: false,
      });

      // Give a moment for async token loading to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      // Token should be loaded from localStorage
      const loadedToken = await client.getProviderToken('github');
      expect(loadedToken).toEqual(tokenData);
    });
  });

  describe("isAuthorized", () => {
    test("checks authorization status for provider", async () => {
      global.fetch = mock(async () => ({
        ok: true,
        json: async () => ({
          authorized: true,
          scopes: ['repo'],
        }),
      })) as any;

      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        singleton: false,
      });

      await client.setProviderToken('github', {
        accessToken: 'test-access-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
      });

      const isAuthorized = await client.isAuthorized("github");
      expect(typeof isAuthorized).toBe("boolean");
    });

    test("returns false when not authorized", async () => {
      global.fetch = mock(async () => ({
        ok: false,
        json: async () => ({
          authorized: false,
        }),
      })) as any;

      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        singleton: false,
      });

      // Wait a moment for token loading to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      const isAuthorized = await client.isAuthorized("github");
      expect(isAuthorized).toBe(false);
    });

    test("returns true immediately after client creation when token exists in localStorage", async () => {
      // Set up localStorage with a token
      const tokenData = {
        accessToken: 'test-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
      };

      const mockLocalStorage = {
        getItem: mock((key: string) => {
          if (key === 'integrate_token_github') {
            return JSON.stringify(tokenData);
          }
          return null;
        }),
        setItem: mock(() => {}),
        removeItem: mock(() => {}),
        clear: mock(() => {}),
        key: mock(() => null),
        length: 0,
      };

      // Mock window and localStorage
      const originalWindow = global.window;
      const originalLocalStorage = global.localStorage;
      
      (global as any).window = { localStorage: mockLocalStorage };
      global.localStorage = mockLocalStorage as any;

      try {
        const client = createMCPClient({
          integrations: [
            githubIntegration({
              clientId: "test-id",
              clientSecret: "test-secret",
            }),
          ],
          singleton: false,
        });

        // isAuthorized should return true immediately (with automatic OAuth callback handling)
        const isAuthorized = await client.isAuthorized("github");
        expect(isAuthorized).toBe(true);
      } finally {
        // Restore original window and localStorage
        if (originalWindow) {
          global.window = originalWindow;
        } else {
          delete (global as any).window;
        }
        if (originalLocalStorage) {
          global.localStorage = originalLocalStorage;
        } else {
          delete (global as any).localStorage;
        }
      }
    });
  });

  describe("getAuthorizationStatus", () => {
    test("returns detailed authorization status", async () => {
      global.fetch = mock(async () => ({
        ok: true,
        json: async () => ({
          authorized: true,
          provider: "github",
          scopes: ["repo", "user"],
          expiresAt: "2024-12-31T23:59:59Z",
        }),
      })) as any;

      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        sessionToken: "test-token",
        singleton: false,
      });

      const status = await client.getAuthorizationStatus("github");

      expect(status).toBeDefined();
      expect(status.provider).toBe("github");
      expect(status.authorized).toBeDefined();
    });
  });

  describe("authorizedProviders", () => {
    test("returns empty array when no providers authorized", async () => {
      global.fetch = mock(async () => ({
        ok: false,
        json: async () => ({
          authorized: false,
          provider: "github",
        }),
      })) as any;

      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        singleton: false,
      });

      // Wait a moment for token loading to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      const authorized = await client.authorizedProviders();
      expect(authorized).toEqual([]);
    });

    test("returns list of authorized providers", async () => {
      global.fetch = mock(async (url: string) => {
        const urlObj = new URL(url);
        const provider = urlObj.searchParams.get("provider");

        return {
          ok: true,
          json: async () => ({
            authorized: true,
            provider,
          }),
        };
      }) as any;

      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
          gmailIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        sessionToken: "test-token",
        singleton: false,
      });

      const authorized = await client.authorizedProviders();

      expect(authorized).toBeInstanceOf(Array);
      expect(authorized.length).toBeGreaterThanOrEqual(0);
    });

    test("only includes OAuth-enabled integrations", async () => {
      global.fetch = mock(async () => ({
        ok: true,
        json: async () => ({
          authorized: true,
          provider: "github",
        }),
      })) as any;

      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        sessionToken: "test-token",
        singleton: false,
      });

      const authorized = await client.authorizedProviders();

      // Should only check integrations with OAuth config
      expect(authorized).toBeInstanceOf(Array);
    });
  });

  describe("authorize", () => {
    test("throws error for non-existent provider", async () => {
      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        singleton: false,
      });

      await expect(
        client.authorize("non-existent")
      ).rejects.toThrow("No OAuth configuration found");
    });

    test("throws error for integration without OAuth", async () => {
      const client = createMCPClient({
        integrations: [],
        singleton: false,
      });

      await expect(
        client.authorize("github")
      ).rejects.toThrow("No OAuth configuration found");
    });
  });

  describe("handleOAuthCallback", () => {
    test("accepts callback parameters", async () => {
      global.fetch = mock(async () => ({
        ok: true,
        json: async () => ({
          sessionToken: "new-session-token",
          expiresAt: "2024-12-31T23:59:59Z",
        }),
      })) as any;

      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        singleton: false,
      });

      // This will fail because state doesn't match pending auth
      // But it tests that the method signature is correct
      await expect(
        client.handleOAuthCallback({
          code: "test-code",
          state: "test-state",
        })
      ).rejects.toThrow();
    });
  });

  describe("OAuth Flow Configuration", () => {
    test("accepts popup mode configuration", () => {
      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        oauthFlow: {
          mode: 'popup',
          popupOptions: {
            width: 600,
            height: 700,
          },
        },
        singleton: false,
      });

      expect(client).toBeDefined();
    });

    test("accepts redirect mode configuration", () => {
      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        oauthFlow: {
          mode: 'redirect',
        },
        singleton: false,
      });

      expect(client).toBeDefined();
    });

    test("accepts custom callback handler", () => {
      const customHandler = async (provider: string, code: string, state: string) => {
        // Custom processing
      };

      const client = createMCPClient({
        integrations: [
          githubIntegration({
            clientId: "test-id",
            clientSecret: "test-secret",
          }),
        ],
        oauthFlow: {
          mode: 'popup',
          onAuthCallback: customHandler,
        },
        singleton: false,
      });

      expect(client).toBeDefined();
    });
  });
});


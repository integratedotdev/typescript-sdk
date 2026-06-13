import type { MCPClient } from "../client.js";
import type { MCPTool } from "../protocol/messages.js";
import type { MCPContext } from "../config/types.js";
import { listConnectedProviders } from "../database/token-store.js";

/** Serializable MCP tool metadata for cross-request / Redis caching. */
export type ToolMetadataStub = Pick<MCPTool, "name" | "description" | "inputSchema">;

export interface ToolDiscoveryCacheAdapter {
  get(key: string): Promise<ToolMetadataStub[] | null>;
  set(key: string, stubs: ToolMetadataStub[], ttlMs?: number): Promise<void>;
  /** Invalidate all keys for a user (prefix match) or a single key when exact. */
  invalidate(userIdOrKey: string): Promise<void>;
}

export interface ToolDiscoveryCacheOptions {
  cache: ToolDiscoveryCacheAdapter;
  /** @default 5 minutes */
  ttlMs?: number;
}

/**
 * Build a cache key from user id and connected integration ids.
 * Include connected providers so reconnecting OAuth invalidates stale tool lists.
 */
export function buildToolDiscoveryCacheKey(
  userId: string,
  connectedIntegrationIds: readonly string[]
): string {
  const sorted = [...connectedIntegrationIds].sort().join(",");
  return `${userId}:${sorted}`;
}

/**
 * In-memory tool discovery cache (single process). Use Redis in production serverless.
 */
export function createMemoryToolDiscoveryCache(): ToolDiscoveryCacheAdapter {
  const store = new Map<string, { stubs: ToolMetadataStub[]; expiresAt: number }>();

  return {
    async get(key) {
      const entry = store.get(key);
      if (!entry) return null;
      if (entry.expiresAt <= Date.now()) {
        store.delete(key);
        return null;
      }
      return entry.stubs;
    },
    async set(key, stubs, ttlMs = 5 * 60 * 1000) {
      store.set(key, { stubs, expiresAt: Date.now() + ttlMs });
    },
    async invalidate(userIdOrKey) {
      for (const key of [...store.keys()]) {
        if (key === userIdOrKey || key.startsWith(`${userIdOrKey}:`)) {
          store.delete(key);
        }
      }
    },
  };
}

/**
 * Hook for database adapter `onTokenChange` — invalidates cached tool metadata for the user.
 */
export function createToolDiscoveryCacheInvalidator(
  cache: ToolDiscoveryCacheAdapter
): (event: { userId: string }) => void {
  return ({ userId }) => {
    void cache.invalidate(userId);
  };
}

export async function resolveToolDiscoveryCacheKey(
  client: MCPClient<any>,
  context: MCPContext,
  options?: {
    integrationIds?: string[];
    connectedOnly?: boolean;
  }
): Promise<string | undefined> {
  const userId = context.userId;
  if (!userId) return undefined;

  const configuredIds = (
    (client as unknown as { integrations?: readonly { id: string }[] })
      .integrations ?? []
  ).map((i) => i.id);

  let targetIds: string[];
  if (options?.integrationIds?.length) {
    targetIds = options.integrationIds;
  } else if (options?.connectedOnly) {
    targetIds = await listConnectedProviders(
      configuredIds,
      (provider, email, ctx) => client.getProviderToken(provider, email, ctx),
      context
    );
  } else {
    targetIds = configuredIds;
  }

  return buildToolDiscoveryCacheKey(userId, targetIds);
}

export function stubsFromTools(tools: readonly MCPTool[]): ToolMetadataStub[] {
  return tools.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema,
  }));
}

/**
 * Hydrate the client tool cache from persisted stubs (serverless cold start).
 */
export function applyToolDiscoveryCache(
  client: MCPClient<any>,
  stubs: readonly ToolMetadataStub[]
): void {
  client.hydrateToolCache(stubs as MCPTool[]);
}

/**
 * Persist current client tool metadata to a cache adapter.
 */
export async function persistToolDiscoveryCache(
  client: MCPClient<any>,
  cache: ToolDiscoveryCacheAdapter,
  cacheKey: string,
  ttlMs?: number
): Promise<void> {
  const tools = client.getAvailableTools();
  if (tools.length === 0) return;
  await cache.set(cacheKey, stubsFromTools(tools), ttlMs);
}

/**
 * Load stubs from cache into the client before tool discovery.
 * @returns true when cache was hydrated
 */
export async function warmToolDiscoveryFromCache(
  client: MCPClient<any>,
  cache: ToolDiscoveryCacheAdapter,
  cacheKey: string
): Promise<boolean> {
  const stubs = await cache.get(cacheKey);
  if (!stubs || stubs.length === 0) return false;
  applyToolDiscoveryCache(client, stubs);
  return true;
}

import { describe, expect, test } from "bun:test";
import {
  buildToolDiscoveryCacheKey,
  createMemoryToolDiscoveryCache,
  createToolDiscoveryCacheInvalidator,
} from "../../src/ai/tool-cache.js";

describe("tool discovery cache", () => {
  test("buildToolDiscoveryCacheKey sorts providers", () => {
    expect(buildToolDiscoveryCacheKey("user-1", ["slack", "github"])).toBe(
      "user-1:github,slack"
    );
  });

  test("memory cache get/set/invalidate by user prefix", async () => {
    const cache = createMemoryToolDiscoveryCache();
    const key = buildToolDiscoveryCacheKey("user-1", ["github"]);
    const stubs = [{ name: "github_list_repos", inputSchema: { type: "object" } }];

    await cache.set(key, stubs);
    expect(await cache.get(key)).toEqual(stubs);

    const invalidate = createToolDiscoveryCacheInvalidator(cache);
    invalidate({ userId: "user-1" });
    expect(await cache.get(key)).toBeNull();
  });
});

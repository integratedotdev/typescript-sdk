import { describe, expect, test } from "bun:test";
import { createDatabaseAdapterCallbacks } from "../../src/database/factory.js";
import type {
  DatabaseDriver,
  ProviderTokenRecord,
  TriggerRecord,
} from "../../src/database/types.js";

function tokenRow(): ProviderTokenRecord {
  const now = new Date("2026-01-01T00:00:00.000Z");
  return {
    id: "tok_1",
    userId: "user_1",
    provider: "github",
    accountEmail: "dev@example.com",
    accountId: "github:1",
    accessToken: "access-token",
    refreshToken: "refresh-token",
    tokenType: "Bearer",
    expiresAt: new Date(Date.now() + 3600_000),
    scope: "repo",
    createdAt: now,
    updatedAt: now,
  };
}

describe("createDatabaseAdapterCallbacks", () => {
  test("getProviderToken returns mapped token data", async () => {
    const driver: DatabaseDriver = {
      tokens: {
        listProviderTokens: async () => [tokenRow()],
        upsertProviderToken: async () => tokenRow(),
        deleteProviderTokens: async () => {},
        deleteDuplicateProviderTokens: async () => {},
      },
    };

    const { getProviderToken } = createDatabaseAdapterCallbacks({ driver });
    const token = await getProviderToken!("github", undefined, {
      userId: "user_1",
    });

    expect(token?.accessToken).toBe("access-token");
    expect(token?.email).toBe("dev@example.com");
  });

  test("setProviderToken upserts and fires onTokenChange hook", async () => {
    const events: string[] = [];
    let upserted = false;

    const driver: DatabaseDriver = {
      tokens: {
        listProviderTokens: async () => [],
        upsertProviderToken: async () => {
          upserted = true;
          return tokenRow();
        },
        deleteProviderTokens: async () => {},
        deleteDuplicateProviderTokens: async () => {},
      },
    };

    const { setProviderToken } = createDatabaseAdapterCallbacks({
      driver,
      hooks: {
        onTokenChange: async ({ action }) => {
          events.push(action);
        },
      },
    });

    await setProviderToken!(
      "github",
      {
        accessToken: "new-access",
        tokenType: "Bearer",
        expiresIn: 3600,
        email: "dev@example.com",
      },
      "dev@example.com",
      { userId: "user_1" }
    );

    expect(upserted).toBe(true);
    expect(events).toEqual(["set"]);
  });

  test("trigger callbacks authorize via hook", async () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const row: TriggerRecord = {
      id: "trig_1",
      userId: "user_1",
      name: null,
      description: null,
      toolName: "github_list_repos",
      toolArguments: {},
      scheduleType: "cron",
      scheduleValue: "0 9 * * *",
      status: "active",
      provider: "github",
      lastRunAt: null,
      nextRunAt: null,
      runCount: 0,
      lastError: null,
      lastResult: null,
      createdAt: now,
      updatedAt: now,
    };

    const driver: DatabaseDriver = {
      tokens: {
        listProviderTokens: async () => [],
        upsertProviderToken: async () => tokenRow(),
        deleteProviderTokens: async () => {},
        deleteDuplicateProviderTokens: async () => {},
      },
      triggers: {
        createTrigger: async () => row,
        getTriggerById: async () => row,
        listTriggers: async () => ({ rows: [row], total: 1 }),
        updateTrigger: async () => row,
        deleteTrigger: async () => {},
      },
    };

    const { triggers } = createDatabaseAdapterCallbacks({
      driver,
      hooks: {
        authorizeTrigger: async (triggerRow, context) =>
          context?.userId === triggerRow.userId ? triggerRow : null,
      },
    });

    const found = await triggers!.get("trig_1", { userId: "user_1" });
    expect(found?.id).toBe("trig_1");

    const denied = await triggers!.get("trig_1", { userId: "other_user" });
    expect(denied).toBeNull();
  });
});

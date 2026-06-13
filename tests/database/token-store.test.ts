import { describe, expect, test } from "bun:test";
import {
  normalizeAccountEmail,
  selectProviderTokenRow,
  providerTokenRecordToData,
  listConnectedProvidersFromRows,
} from "../../src/database/token-store.js";
import type { ProviderTokenRecord } from "../../src/database/types.js";
import { toDbSchedule, toSdkTrigger } from "../../src/database/trigger-store.js";
import type { FlattenedTrigger } from "../../src/database/types.js";

function tokenRow(
  overrides: Partial<ProviderTokenRecord> = {}
): ProviderTokenRecord {
  const now = new Date("2026-01-01T00:00:00.000Z");
  return {
    id: "tok_1",
    userId: "user_1",
    provider: "github",
    accountEmail: "dev@example.com",
    accountId: "github:1",
    accessToken: "access",
    refreshToken: "refresh",
    tokenType: "Bearer",
    expiresAt: new Date(Date.now() + 60_000),
    scope: "repo user",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("token-store", () => {
  test("selectProviderTokenRow prefers exact email match", () => {
    const rows = [
      tokenRow({ id: "a", accountEmail: "other@example.com" }),
      tokenRow({ id: "b", accountEmail: "dev@example.com" }),
    ];

    const selected = selectProviderTokenRow(rows, "dev@example.com");
    expect(selected?.id).toBe("b");
  });

  test("providerTokenRecordToData maps scopes and expiry", () => {
    const data = providerTokenRecordToData(tokenRow());
    expect(data.accessToken).toBe("access");
    expect(data.scopes).toEqual(["repo", "user"]);
    expect(data.email).toBe("dev@example.com");
  });

  test("normalizeAccountEmail lowercases values", () => {
    expect(normalizeAccountEmail(" Dev@Example.com ")).toBe("dev@example.com");
  });

  test("listConnectedProvidersFromRows returns usable providers", () => {
    const rows = [
      tokenRow({ provider: "github" }),
      tokenRow({ id: "tok_2", provider: "gmail", accountEmail: "a@b.com" }),
      tokenRow({
        id: "tok_3",
        provider: "slack",
        accessToken: "",
        refreshToken: null,
      }),
    ];

    expect(listConnectedProvidersFromRows(rows).sort()).toEqual(["github", "gmail"]);
    expect(listConnectedProvidersFromRows(rows, ["github"]).sort()).toEqual(["github"]);
  });
});

describe("trigger-store", () => {
  test("toDbSchedule flattens cron triggers", () => {
    const trigger: FlattenedTrigger = {
      id: "trig_1",
      toolName: "github_list_repos",
      toolArguments: {},
      schedule: { type: "cron", expression: "0 9 * * *" },
      status: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };

    expect(toDbSchedule(trigger)).toEqual({
      scheduleType: "cron",
      scheduleValue: "0 9 * * *",
    });
  });

  test("toSdkTrigger maps database row", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const trigger = toSdkTrigger({
      id: "trig_1",
      userId: "user_1",
      name: "Daily",
      description: null,
      toolName: "github_list_repos",
      toolArguments: { per_page: 5 },
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
    });

    expect(trigger.schedule).toEqual({
      type: "cron",
      expression: "0 9 * * *",
    });
    expect(trigger.toolArguments).toEqual({ per_page: 5 });
  });
});

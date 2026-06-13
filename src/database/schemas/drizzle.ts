/**
 * Reference Drizzle schema for Integrate database adapters.
 * Copy into your app or import directly when using Drizzle.
 */
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const integrateProviderToken = pgTable(
  "provider_token",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    provider: text("provider").notNull(),
    accountEmail: text("account_email"),
    accountId: text("account_id"),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    tokenType: text("token_type").notNull().default("Bearer"),
    expiresAt: timestamp("expires_at"),
    scope: text("scope"),
    createdAt: timestamp("created_at", { mode: "date", precision: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => [
    index("provider_token_user_id_idx").on(table.userId),
    index("provider_token_provider_idx").on(table.provider),
    index("provider_token_user_provider_idx").on(table.userId, table.provider),
    uniqueIndex("provider_token_user_provider_account_email_uidx").on(
      table.userId,
      table.provider,
      table.accountEmail
    ),
  ]
);

export const integrateTrigger = pgTable(
  "trigger",
  {
    id: text("id").primaryKey(),
    userId: text("user_id"),
    name: text("name"),
    description: text("description"),
    toolName: text("tool_name").notNull(),
    toolArguments: jsonb("tool_arguments").notNull(),
    scheduleType: text("schedule_type").notNull(),
    scheduleValue: text("schedule_value").notNull(),
    status: text("status").notNull().default("active"),
    provider: text("provider"),
    lastRunAt: timestamp("last_run_at", { mode: "date", precision: 3 }),
    nextRunAt: timestamp("next_run_at", { mode: "date", precision: 3 }),
    runCount: integer("run_count").notNull().default(0),
    lastError: text("last_error"),
    lastResult: jsonb("last_result"),
    createdAt: timestamp("created_at", { mode: "date", precision: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => [
    index("trigger_user_id_idx").on(table.userId),
    index("trigger_status_idx").on(table.status),
    index("trigger_next_run_at_idx").on(table.nextRunAt),
  ]
);

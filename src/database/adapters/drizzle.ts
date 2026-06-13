import { and, count, desc, eq, ne, or, type SQL } from "drizzle-orm";
import {
  createDatabaseAdapterFactory,
  createDatabaseAdapterCallbacks,
} from "../factory.js";
import {
  normalizeAccountEmail,
  normalizeAccountIdHint,
} from "../token-store.js";
import type {
  CreateTriggerInput,
  DatabaseDriver,
  DeleteDuplicateProviderTokensInput,
  DeleteProviderTokensInput,
  IntegrateAdapterHooks,
  IntegrateDatabaseAdapter,
  ListTriggersQuery,
  ProviderTokenRecord,
  TokenDatabaseDriver,
  TriggerDatabaseDriver,
  TriggerRecord,
} from "../types.js";

export type DrizzleProvider =
  | "pg"
  | "mysql"
  | "sqlite";

export interface DrizzleIntegrateSchema {
  providerToken: object;
  trigger?: object;
}

export interface DrizzleAdapterConfig {
  provider: DrizzleProvider;
  schema: DrizzleIntegrateSchema;
  hooks?: IntegrateAdapterHooks;
  debugLogs?: boolean;
}

type DrizzleDb = {
  select: (...args: any[]) => any;
  insert: (...args: any[]) => any;
  update: (...args: any[]) => any;
  delete: (...args: any[]) => any;
};

function mapProviderTokenRow(row: Record<string, unknown>): ProviderTokenRecord {
  return {
    id: String(row.id),
    userId: String(row.userId),
    provider: String(row.provider),
    accountEmail: (row.accountEmail as string | null) ?? null,
    accountId: (row.accountId as string | null) ?? null,
    accessToken: String(row.accessToken),
    refreshToken: (row.refreshToken as string | null) ?? null,
    tokenType: String(row.tokenType ?? "Bearer"),
    expiresAt: (row.expiresAt as Date | null) ?? null,
    scope: (row.scope as string | null) ?? null,
    createdAt: row.createdAt as Date,
    updatedAt: row.updatedAt as Date,
  };
}

function mapTriggerRow(row: Record<string, unknown>): TriggerRecord {
  return {
    id: String(row.id),
    userId: (row.userId as string | null) ?? null,
    name: (row.name as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    toolName: String(row.toolName),
    toolArguments: (row.toolArguments as Record<string, unknown>) ?? {},
    scheduleType: row.scheduleType as "once" | "cron",
    scheduleValue: String(row.scheduleValue),
    status: String(row.status),
    provider: (row.provider as string | null) ?? null,
    lastRunAt: (row.lastRunAt as Date | null) ?? null,
    nextRunAt: (row.nextRunAt as Date | null) ?? null,
    runCount: Number(row.runCount ?? 0),
    lastError: (row.lastError as string | null) ?? null,
    lastResult: (row.lastResult as Record<string, unknown> | null) ?? null,
    createdAt: row.createdAt as Date,
    updatedAt: row.updatedAt as Date,
  };
}

function createDrizzleTokenDriver(
  db: DrizzleDb,
  table: object
): TokenDatabaseDriver {
  const t = table as any;

  return {
    async listProviderTokens(userId, provider) {
      const rows = await db
        .select()
        .from(table)
        .where(and(eq(t.userId, userId), eq(t.provider, provider)))
        .orderBy(desc(t.updatedAt))
        .limit(32);

      return rows.map((row: Record<string, unknown>) =>
        mapProviderTokenRow(row)
      );
    },

    async upsertProviderToken(input) {
      const now = new Date();
      const values = {
        id: input.existingId ?? input.id,
        userId: input.userId,
        provider: input.provider,
        accountEmail: input.accountEmail,
        accountId: input.accountId,
        accessToken: input.accessToken,
        refreshToken: input.refreshToken,
        tokenType: input.tokenType,
        expiresAt: input.expiresAt,
        scope: input.scope,
        updatedAt: now,
        ...(input.existingId ? {} : { createdAt: now }),
      };

      if (input.existingId) {
        const [updated] = await db
          .update(table)
          .set(values)
          .where(eq(t.id, input.existingId))
          .returning();
        return mapProviderTokenRow(updated);
      }

      const [created] = await db.insert(table).values(values).returning();
      return mapProviderTokenRow(created);
    },

    async deleteProviderTokens(input: DeleteProviderTokensInput) {
      const conditions: SQL[] = [
        eq(t.userId, input.userId),
        eq(t.provider, input.provider),
      ];

      if (input.accountEmail) {
        conditions.push(eq(t.accountEmail, input.accountEmail));
      } else if (input.accountId) {
        conditions.push(eq(t.accountId, input.accountId));
      }

      await db.delete(table).where(and(...conditions));
    },

    async deleteDuplicateProviderTokens(
      input: DeleteDuplicateProviderTokensInput
    ) {
      const normalizedEmail = normalizeAccountEmail(input.accountEmail);
      const normalizedAccountId = normalizeAccountIdHint(input.accountId);

      if (!normalizedEmail && !normalizedAccountId) {
        return;
      }

      const duplicateConditions = [
        eq(t.userId, input.userId),
        eq(t.provider, input.provider),
        ne(t.id, input.keepId),
      ];

      const identityConditions: SQL[] = [];
      if (normalizedEmail) {
        identityConditions.push(eq(t.accountEmail, normalizedEmail));
      }
      if (normalizedAccountId) {
        identityConditions.push(eq(t.accountId, normalizedAccountId));
      }
      if (identityConditions.length === 0) {
        return;
      }

      await db
        .delete(table)
        .where(and(...duplicateConditions, or(...identityConditions)));
    },
  };
}

function createDrizzleTriggerDriver(
  db: DrizzleDb,
  table: object
): TriggerDatabaseDriver {
  const t = table as any;

  return {
    async createTrigger(input: CreateTriggerInput) {
      const now = new Date();
      const [created] = await db
        .insert(table)
        .values({
          id: input.id,
          userId: input.userId,
          name: input.name ?? null,
          description: input.description ?? null,
          toolName: input.toolName,
          toolArguments: input.toolArguments,
          scheduleType: input.scheduleType,
          scheduleValue: input.scheduleValue,
          status: input.status,
          provider: input.provider ?? null,
          nextRunAt: input.nextRunAt ?? null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return mapTriggerRow(created);
    },

    async getTriggerById(triggerId) {
      const [found] = await db
        .select()
        .from(table)
        .where(eq(t.id, triggerId))
        .limit(1);

      return found ? mapTriggerRow(found) : null;
    },

    async listTriggers(query: ListTriggersQuery) {
      const conditions: SQL[] = [];
      if (query.userId) {
        conditions.push(eq(t.userId, query.userId));
      }
      if (query.status) {
        conditions.push(eq(t.status, query.status));
      }
      if (query.toolName) {
        conditions.push(eq(t.toolName, query.toolName));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const rows = await db
        .select()
        .from(table)
        .where(whereClause)
        .limit(query.limit)
        .offset(query.offset);

      const [totalResult] = await db
        .select({ count: count() })
        .from(table)
        .where(whereClause);

      return {
        rows: rows.map((row: Record<string, unknown>) => mapTriggerRow(row)),
        total: Number(totalResult?.count ?? 0),
      };
    },

    async updateTrigger(triggerId, updates) {
      const [updated] = await db
        .update(table)
        .set(updates)
        .where(eq(t.id, triggerId))
        .returning();

      return updated ? mapTriggerRow(updated) : null;
    },

    async deleteTrigger(triggerId) {
      await db.delete(table).where(eq(t.id, triggerId));
    },
  };
}

export function createDrizzleDatabaseDriver(
  db: DrizzleDb,
  schema: DrizzleIntegrateSchema
): DatabaseDriver {
  const driver: DatabaseDriver = {
    tokens: createDrizzleTokenDriver(db, schema.providerToken),
  };

  if (schema.trigger) {
    driver.triggers = createDrizzleTriggerDriver(db, schema.trigger);
  }

  return driver;
}

export function drizzleAdapter(
  db: DrizzleDb,
  config: DrizzleAdapterConfig
): IntegrateDatabaseAdapter {
  void config.provider;
  const driver = () => createDrizzleDatabaseDriver(db, config.schema);

  return createDatabaseAdapterFactory(driver, {
    hooks: config.hooks,
    debugLogs: config.debugLogs,
  });
}

export function drizzleAdapterCallbacks(
  db: DrizzleDb,
  config: DrizzleAdapterConfig
) {
  return createDatabaseAdapterCallbacks({
    driver: createDrizzleDatabaseDriver(db, config.schema),
    hooks: config.hooks,
    debugLogs: config.debugLogs,
  });
}

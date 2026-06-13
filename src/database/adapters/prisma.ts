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

export type PrismaProvider =
  | "sqlite"
  | "postgresql"
  | "mysql"
  | "sqlserver"
  | "cockroachdb"
  | "mongodb";

export interface PrismaIntegrateModelNames {
  providerToken?: string;
  trigger?: string;
}

export interface PrismaAdapterConfig {
  provider: PrismaProvider;
  modelNames?: PrismaIntegrateModelNames;
  hooks?: IntegrateAdapterHooks;
  debugLogs?: boolean;
}

type PrismaClientLike = Record<string, any>;

const DEFAULT_MODEL_NAMES = {
  providerToken: "providerToken",
  trigger: "trigger",
} as const;

function getModel(client: PrismaClientLike, name: string) {
  const model = client[name];
  if (!model) {
    throw new Error(
      `[Integrate SDK] Prisma model "${name}" was not found on the client`
    );
  }
  return model;
}

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

function createPrismaTokenDriver(
  prisma: PrismaClientLike,
  modelName: string
): TokenDatabaseDriver {
  const model = () => getModel(prisma, modelName);

  return {
    async listProviderTokens(userId, provider) {
      const rows = await model().findMany({
        where: { userId, provider },
        orderBy: { updatedAt: "desc" },
        take: 32,
      });
      return rows.map((row: Record<string, unknown>) =>
        mapProviderTokenRow(row)
      );
    },

    async upsertProviderToken(input) {
      const now = new Date();
      const data = {
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
      };

      if (input.existingId) {
        const updated = await model().update({
          where: { id: input.existingId },
          data,
        });
        return mapProviderTokenRow(updated);
      }

      const created = await model().create({
        data: {
          id: input.id,
          ...data,
          createdAt: now,
        },
      });
      return mapProviderTokenRow(created);
    },

    async deleteProviderTokens(input: DeleteProviderTokensInput) {
      const where: Record<string, unknown> = {
        userId: input.userId,
        provider: input.provider,
      };
      if (input.accountEmail) {
        where.accountEmail = input.accountEmail;
      } else if (input.accountId) {
        where.accountId = input.accountId;
      }

      await model().deleteMany({ where });
    },

    async deleteDuplicateProviderTokens(
      input: DeleteDuplicateProviderTokensInput
    ) {
      const normalizedEmail = normalizeAccountEmail(input.accountEmail);
      const normalizedAccountId = normalizeAccountIdHint(input.accountId);

      if (!normalizedEmail && !normalizedAccountId) {
        return;
      }

      const orConditions: Record<string, unknown>[] = [];
      if (normalizedEmail) {
        orConditions.push({ accountEmail: normalizedEmail });
      }
      if (normalizedAccountId) {
        orConditions.push({ accountId: normalizedAccountId });
      }

      await model().deleteMany({
        where: {
          userId: input.userId,
          provider: input.provider,
          id: { not: input.keepId },
          OR: orConditions,
        },
      });
    },
  };
}

function createPrismaTriggerDriver(
  prisma: PrismaClientLike,
  modelName: string
): TriggerDatabaseDriver {
  const model = () => getModel(prisma, modelName);

  return {
    async createTrigger(input: CreateTriggerInput) {
      const now = new Date();
      const created = await model().create({
        data: {
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
        },
      });
      return mapTriggerRow(created);
    },

    async getTriggerById(triggerId) {
      const found = await model().findFirst({ where: { id: triggerId } });
      return found ? mapTriggerRow(found) : null;
    },

    async listTriggers(query: ListTriggersQuery) {
      const where: Record<string, unknown> = {};
      if (query.userId) where.userId = query.userId;
      if (query.status) where.status = query.status;
      if (query.toolName) where.toolName = query.toolName;

      const [rows, total] = await Promise.all([
        model().findMany({
          where,
          take: query.limit,
          skip: query.offset,
          orderBy: { updatedAt: "desc" },
        }),
        model().count({ where }),
      ]);

      return {
        rows: rows.map((row: Record<string, unknown>) => mapTriggerRow(row)),
        total,
      };
    },

    async updateTrigger(triggerId, updates) {
      try {
        const updated = await model().update({
          where: { id: triggerId },
          data: updates,
        });
        return mapTriggerRow(updated);
      } catch {
        return null;
      }
    },

    async deleteTrigger(triggerId) {
      await model().delete({ where: { id: triggerId } });
    },
  };
}

export function createPrismaDatabaseDriver(
  prisma: PrismaClientLike,
  config: PrismaAdapterConfig
): DatabaseDriver {
  const modelNames = {
    ...DEFAULT_MODEL_NAMES,
    ...config.modelNames,
  };

  const driver: DatabaseDriver = {
    tokens: createPrismaTokenDriver(prisma, modelNames.providerToken),
  };

  if (config.modelNames?.trigger !== null) {
    driver.triggers = createPrismaTriggerDriver(prisma, modelNames.trigger);
  }

  return driver;
}

export function prismaAdapter(
  prisma: PrismaClientLike,
  config: PrismaAdapterConfig
): IntegrateDatabaseAdapter {
  void config.provider;
  return createDatabaseAdapterFactory(
    () => createPrismaDatabaseDriver(prisma, config),
    {
      hooks: config.hooks,
      debugLogs: config.debugLogs,
    }
  );
}

export function prismaAdapterCallbacks(
  prisma: PrismaClientLike,
  config: PrismaAdapterConfig
) {
  return createDatabaseAdapterCallbacks({
    driver: createPrismaDatabaseDriver(prisma, config),
    hooks: config.hooks,
    debugLogs: config.debugLogs,
  });
}

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

export interface MongoCollectionNames {
  providerTokens?: string;
  triggers?: string;
}

export interface MongoAdapterConfig {
  client?: import("mongodb").MongoClient;
  collectionNames?: MongoCollectionNames;
  hooks?: IntegrateAdapterHooks;
  debugLogs?: boolean;
}

type MongoDb = import("mongodb").Db;
type MongoCollection = import("mongodb").Collection;

const DEFAULT_COLLECTIONS = {
  providerTokens: "provider_tokens",
  triggers: "triggers",
} as const;

function mapProviderTokenDoc(doc: Record<string, unknown>): ProviderTokenRecord {
  return {
    id: String(doc.id),
    userId: String(doc.userId),
    provider: String(doc.provider),
    accountEmail: (doc.accountEmail as string | null) ?? null,
    accountId: (doc.accountId as string | null) ?? null,
    accessToken: String(doc.accessToken),
    refreshToken: (doc.refreshToken as string | null) ?? null,
    tokenType: String(doc.tokenType ?? "Bearer"),
    expiresAt: doc.expiresAt ? new Date(doc.expiresAt as string | Date) : null,
    scope: (doc.scope as string | null) ?? null,
    createdAt: new Date(doc.createdAt as string | Date),
    updatedAt: new Date(doc.updatedAt as string | Date),
  };
}

function mapTriggerDoc(doc: Record<string, unknown>): TriggerRecord {
  return {
    id: String(doc.id),
    userId: (doc.userId as string | null) ?? null,
    name: (doc.name as string | null) ?? null,
    description: (doc.description as string | null) ?? null,
    toolName: String(doc.toolName),
    toolArguments: (doc.toolArguments as Record<string, unknown>) ?? {},
    scheduleType: doc.scheduleType as "once" | "cron",
    scheduleValue: String(doc.scheduleValue),
    status: String(doc.status),
    provider: (doc.provider as string | null) ?? null,
    lastRunAt: doc.lastRunAt ? new Date(doc.lastRunAt as string | Date) : null,
    nextRunAt: doc.nextRunAt ? new Date(doc.nextRunAt as string | Date) : null,
    runCount: Number(doc.runCount ?? 0),
    lastError: (doc.lastError as string | null) ?? null,
    lastResult: (doc.lastResult as Record<string, unknown> | null) ?? null,
    createdAt: new Date(doc.createdAt as string | Date),
    updatedAt: new Date(doc.updatedAt as string | Date),
  };
}

function createMongoTokenDriver(
  db: MongoDb,
  collectionName: string
): TokenDatabaseDriver {
  const collection = (): MongoCollection =>
    db.collection(collectionName) as MongoCollection;

  return {
    async listProviderTokens(userId, provider) {
      const docs = await collection()
        .find({ userId, provider })
        .sort({ updatedAt: -1 })
        .limit(32)
        .toArray();

      return docs.map((doc: Record<string, unknown>) =>
        mapProviderTokenDoc(doc)
      );
    },

    async upsertProviderToken(input) {
      const now = new Date();
      const id = input.existingId ?? input.id;
      const doc = {
        id,
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

      await collection().updateOne(
        { id },
        { $set: doc },
        { upsert: true }
      );

      const saved = await collection().findOne({ id });
      return mapProviderTokenDoc(saved as Record<string, unknown>);
    },

    async deleteProviderTokens(input: DeleteProviderTokensInput) {
      const filter: Record<string, unknown> = {
        userId: input.userId,
        provider: input.provider,
      };
      if (input.accountEmail) {
        filter.accountEmail = input.accountEmail;
      } else if (input.accountId) {
        filter.accountId = input.accountId;
      }

      await collection().deleteMany(filter);
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

      await collection().deleteMany({
        userId: input.userId,
        provider: input.provider,
        id: { $ne: input.keepId },
        $or: orConditions,
      });
    },
  };
}

function createMongoTriggerDriver(
  db: MongoDb,
  collectionName: string
): TriggerDatabaseDriver {
  const collection = (): MongoCollection =>
    db.collection(collectionName) as MongoCollection;

  return {
    async createTrigger(input: CreateTriggerInput) {
      const now = new Date();
      const doc = {
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
      };

      await collection().insertOne(doc);
      return mapTriggerDoc(doc as Record<string, unknown>);
    },

    async getTriggerById(triggerId) {
      const found = await collection().findOne({ id: triggerId });
      return found ? mapTriggerDoc(found as Record<string, unknown>) : null;
    },

    async listTriggers(query: ListTriggersQuery) {
      const filter: Record<string, unknown> = {};
      if (query.userId) filter.userId = query.userId;
      if (query.status) filter.status = query.status;
      if (query.toolName) filter.toolName = query.toolName;

      const [docs, total] = await Promise.all([
        collection()
          .find(filter)
          .sort({ updatedAt: -1 })
          .skip(query.offset)
          .limit(query.limit)
          .toArray(),
        collection().countDocuments(filter),
      ]);

      return {
        rows: docs.map((doc: Record<string, unknown>) =>
          mapTriggerDoc(doc)
        ),
        total,
      };
    },

    async updateTrigger(triggerId, updates) {
      const result = await collection().findOneAndUpdate(
        { id: triggerId },
        { $set: updates },
        { returnDocument: "after" }
      );

      return result ? mapTriggerDoc(result as Record<string, unknown>) : null;
    },

    async deleteTrigger(triggerId) {
      await collection().deleteOne({ id: triggerId });
    },
  };
}

export function createMongoDatabaseDriver(
  db: MongoDb,
  config: MongoAdapterConfig
): DatabaseDriver {
  const names = {
    ...DEFAULT_COLLECTIONS,
    ...config.collectionNames,
  };

  const driver: DatabaseDriver = {
    tokens: createMongoTokenDriver(db, names.providerTokens),
  };

  if (config.collectionNames?.triggers !== null) {
    driver.triggers = createMongoTriggerDriver(db, names.triggers);
  }

  return driver;
}

export function mongodbAdapter(
  db: MongoDb,
  config: MongoAdapterConfig = {}
): IntegrateDatabaseAdapter {
  return createDatabaseAdapterFactory(
    () => createMongoDatabaseDriver(db, config),
    {
      hooks: config.hooks,
      debugLogs: config.debugLogs,
    }
  );
}

export function mongodbAdapterCallbacks(
  db: MongoDb,
  config: MongoAdapterConfig = {}
) {
  return createDatabaseAdapterCallbacks({
    driver: createMongoDatabaseDriver(db, config),
    hooks: config.hooks,
    debugLogs: config.debugLogs,
  });
}

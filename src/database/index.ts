export type {
  AccountIdentity,
  CreateTriggerInput,
  DatabaseDriver,
  DeleteDuplicateProviderTokensInput,
  DeleteProviderTokensInput,
  FlattenedTrigger,
  IntegrateAdapterHooks,
  IntegrateDatabaseAdapter,
  IntegrateDatabaseCallbacks,
  ListTriggersQuery,
  ProviderTokenRecord,
  TokenChangeEvent,
  TokenDatabaseDriver,
  TriggerDatabaseDriver,
  TriggerRecord,
  UpsertProviderTokenInput,
} from "./types.js";

export {
  createDatabaseAdapterCallbacks,
  createDatabaseAdapterFactory,
} from "./factory.js";

export {
  defaultResolveAccountIdentity,
  hasMeaningfulExpiresAt,
  hasUsableAccessToken,
  isLikelyUsableToken,
  normalizeAccountEmail,
  normalizeAccountEmailHint,
  normalizeAccountIdHint,
  normalizeAccountIdentifier,
  normalizeProviderTokenType,
  parseScopes,
  providerTokenRecordToData,
  selectProviderTokenRow,
  listConnectedProviders,
  listConnectedProvidersFromRows,
} from "./token-store.js";

export {
  flattenedTriggerToCreateInput,
  toDbSchedule,
  toDbTriggerUpdates,
  toSdkSchedule,
  toSdkTrigger,
} from "./trigger-store.js";

export {
  drizzleAdapter,
  drizzleAdapterCallbacks,
  createDrizzleDatabaseDriver,
  type DrizzleAdapterConfig,
  type DrizzleIntegrateSchema,
  type DrizzleProvider,
} from "./adapters/drizzle.js";

export {
  prismaAdapter,
  prismaAdapterCallbacks,
  createPrismaDatabaseDriver,
  type PrismaAdapterConfig,
  type PrismaIntegrateModelNames,
  type PrismaProvider,
} from "./adapters/prisma.js";

export {
  mongodbAdapter,
  mongodbAdapterCallbacks,
  createMongoDatabaseDriver,
  type MongoAdapterConfig,
  type MongoCollectionNames,
} from "./adapters/mongodb.js";

export {
  integrateProviderToken,
  integrateTrigger,
} from "./schemas/drizzle.js";

import type { MCPContext } from "../config/types.js";
import type { ProviderTokenData } from "../oauth/types.js";
import type { Trigger, TriggerCallbacks } from "../triggers/types.js";

/** Normalized provider token row shape used across ORM adapters */
export interface ProviderTokenRecord {
  id: string;
  userId: string;
  provider: string;
  accountEmail: string | null;
  accountId: string | null;
  accessToken: string;
  refreshToken: string | null;
  tokenType: string;
  expiresAt: Date | null;
  scope: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Normalized trigger row shape used across ORM adapters */
export interface TriggerRecord {
  id: string;
  userId: string | null;
  name: string | null;
  description: string | null;
  toolName: string;
  toolArguments: Record<string, unknown>;
  scheduleType: "once" | "cron";
  scheduleValue: string;
  status: string;
  provider: string | null;
  lastRunAt: Date | null;
  nextRunAt: Date | null;
  runCount: number;
  lastError: string | null;
  lastResult: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertProviderTokenInput {
  id?: string;
  userId: string;
  provider: string;
  accountEmail: string | null;
  accountId: string | null;
  accessToken: string;
  refreshToken: string | null;
  tokenType: string;
  expiresAt: Date | null;
  scope: string | null;
}

export interface DeleteProviderTokensInput {
  userId: string;
  provider: string;
  accountEmail?: string | null;
  accountId?: string | null;
}

export interface DeleteDuplicateProviderTokensInput {
  keepId: string;
  userId: string;
  provider: string;
  accountEmail?: string | null;
  accountId?: string | null;
}

export interface CreateTriggerInput {
  id: string;
  userId: string | null;
  name?: string | null;
  description?: string | null;
  toolName: string;
  toolArguments: Record<string, unknown>;
  scheduleType: "once" | "cron";
  scheduleValue: string;
  status: string;
  provider?: string | null;
  nextRunAt?: Date | null;
}

export interface ListTriggersQuery {
  userId?: string;
  status?: string;
  toolName?: string;
  limit: number;
  offset: number;
}

export interface TokenChangeEvent {
  userId: string;
  provider: string;
  action: "set" | "remove";
}

export interface AccountIdentity {
  accountEmail: string | null;
  accountId: string | null;
}

export interface IntegrateAdapterHooks {
  onTokenChange?: (event: TokenChangeEvent) => void | Promise<void>;
  resolveAccountIdentity?: (
    provider: string,
    tokenData: ProviderTokenData,
    emailHint: string | null,
    context?: MCPContext
  ) => Promise<AccountIdentity> | AccountIdentity;
  authorizeTrigger?: (
    row: TriggerRecord,
    context?: MCPContext
  ) => Promise<TriggerRecord | null> | TriggerRecord | null;
}

export interface TokenDatabaseDriver {
  listProviderTokens(
    userId: string,
    provider: string
  ): Promise<ProviderTokenRecord[]>;
  upsertProviderToken(
    input: UpsertProviderTokenInput & { existingId?: string }
  ): Promise<ProviderTokenRecord>;
  deleteProviderTokens(input: DeleteProviderTokensInput): Promise<void>;
  deleteDuplicateProviderTokens(
    input: DeleteDuplicateProviderTokensInput
  ): Promise<void>;
}

export interface TriggerDatabaseDriver {
  createTrigger(input: CreateTriggerInput): Promise<TriggerRecord>;
  getTriggerById(triggerId: string): Promise<TriggerRecord | null>;
  listTriggers(query: ListTriggersQuery): Promise<{
    rows: TriggerRecord[];
    total: number;
  }>;
  updateTrigger(
    triggerId: string,
    updates: Partial<TriggerRecord>
  ): Promise<TriggerRecord | null>;
  deleteTrigger(triggerId: string): Promise<void>;
}

export interface DatabaseDriver {
  tokens: TokenDatabaseDriver;
  triggers?: TriggerDatabaseDriver;
}

export interface IntegrateDatabaseCallbacks {
  getProviderToken?: (
    provider: string,
    email?: string,
    context?: MCPContext
  ) => Promise<ProviderTokenData | undefined> | ProviderTokenData | undefined;
  setProviderToken?: (
    provider: string,
    tokenData: ProviderTokenData | null,
    email?: string,
    context?: MCPContext
  ) => Promise<void> | void;
  removeProviderToken?: (
    provider: string,
    email?: string,
    context?: MCPContext
  ) => Promise<void> | void;
  triggers?: TriggerCallbacks;
}

/** Lazy factory matching Better Auth's database adapter pattern */
export type IntegrateDatabaseAdapter = () => IntegrateDatabaseCallbacks;

export type FlattenedTrigger = Trigger & {
  scheduleType?: "once" | "cron";
  scheduleValue?: string;
};

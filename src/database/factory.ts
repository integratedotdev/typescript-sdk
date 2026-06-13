import type { MCPContext } from "../config/types.js";
import type { ProviderTokenData } from "../oauth/types.js";
import type { Trigger, TriggerCallbacks } from "../triggers/types.js";
import {
  defaultResolveAccountIdentity,
  normalizeAccountEmail,
  normalizeAccountEmailHint,
  normalizeAccountIdHint,
  normalizeProviderTokenType,
  providerTokenRecordToData,
  selectProviderTokenRow,
  hasMeaningfulExpiresAt,
} from "./token-store.js";
import {
  flattenedTriggerToCreateInput,
  toDbTriggerUpdates,
  toSdkTrigger,
} from "./trigger-store.js";
import type {
  DatabaseDriver,
  FlattenedTrigger,
  IntegrateAdapterHooks,
  IntegrateDatabaseAdapter,
  IntegrateDatabaseCallbacks,
  TriggerRecord,
} from "./types.js";

export interface CreateDatabaseAdapterOptions {
  driver: DatabaseDriver;
  hooks?: IntegrateAdapterHooks;
  debugLogs?: boolean;
}

function log(debug: boolean | undefined, message: string, error?: unknown) {
  if (!debug) return;
  if (error !== undefined) {
    console.error(`[Integrate SDK] ${message}`, error);
    return;
  }
  console.log(`[Integrate SDK] ${message}`);
}

async function authorizeTriggerRow(
  row: TriggerRecord | null,
  context: MCPContext | undefined,
  hooks?: IntegrateAdapterHooks
): Promise<TriggerRecord | null> {
  if (!row) return null;

  const repaired = hooks?.authorizeTrigger
    ? await hooks.authorizeTrigger(row, context)
    : row;

  if (!repaired) return null;
  if (context?.userId && repaired.userId !== context.userId) {
    return null;
  }

  return repaired;
}

export function createDatabaseAdapterCallbacks(
  options: CreateDatabaseAdapterOptions
): IntegrateDatabaseCallbacks {
  const { driver, hooks, debugLogs } = options;

  const getProviderToken = async (
    provider: string,
    email?: string,
    context?: MCPContext
  ): Promise<ProviderTokenData | undefined> => {
    const userId = context?.userId;
    if (!userId) {
      return undefined;
    }

    const accountEmailHint =
      normalizeAccountEmailHint(email) ??
      normalizeAccountEmailHint(
        typeof context?.accountEmail === "string" ? context.accountEmail : null
      );
    const accountIdHint = normalizeAccountIdHint(
      typeof context?.accountId === "string" ? context.accountId : null
    );

    try {
      const rows = await driver.tokens.listProviderTokens(userId, provider);
      const selectedRow = selectProviderTokenRow(
        rows,
        accountEmailHint ?? undefined,
        accountIdHint ?? undefined
      );

      if (!selectedRow) {
        return undefined;
      }

      return providerTokenRecordToData(selectedRow);
    } catch (error) {
      log(debugLogs, "Error fetching provider token:", error);
      return undefined;
    }
  };

  const setProviderToken = async (
    provider: string,
    tokenData: ProviderTokenData | null,
    email?: string,
    context?: MCPContext
  ): Promise<void> => {
    const userId = context?.userId;
    if (!userId) {
      console.error("[Integrate SDK] Cannot save token: No userId in context");
      return;
    }

    const accountEmail =
      normalizeAccountEmailHint(email) ??
      normalizeAccountEmail(tokenData?.email ?? null);

    if (tokenData === null) {
      try {
        await driver.tokens.deleteProviderTokens({
          userId,
          provider,
          accountEmail,
          accountId: normalizeAccountIdHint(
            typeof context?.accountId === "string" ? context.accountId : null
          ),
        });
        await hooks?.onTokenChange?.({ userId, provider, action: "remove" });
      } catch (error) {
        log(debugLogs, "Error deleting provider token:", error);
        throw error;
      }
      return;
    }

    try {
      const resolvedIdentity = hooks?.resolveAccountIdentity
        ? await hooks.resolveAccountIdentity(
            provider,
            tokenData,
            accountEmail,
            context
          )
        : defaultResolveAccountIdentity(provider, tokenData, accountEmail);

      const resolvedAccountEmail = resolvedIdentity.accountEmail;
      const resolvedAccountId =
        normalizeAccountIdHint(resolvedIdentity.accountId) ??
        normalizeAccountIdHint(
          typeof context?.accountId === "string" ? context.accountId : null
        ) ??
        null;

      const rows = await driver.tokens.listProviderTokens(userId, provider);
      let existing =
        selectProviderTokenRow(
          rows,
          resolvedAccountEmail ?? accountEmail ?? undefined,
          resolvedAccountId ?? undefined
        ) ??
        rows.find((row) => {
          const sameEmail =
            resolvedAccountEmail &&
            normalizeAccountEmail(row.accountEmail) === resolvedAccountEmail;
          const sameAccountId =
            resolvedAccountId &&
            normalizeAccountIdHint(row.accountId) === resolvedAccountId;
          return Boolean(sameEmail || sameAccountId);
        }) ??
        (rows.length === 1 ? rows[0] : undefined);

      const parsedExpiresAt = tokenData.expiresAt
        ? new Date(tokenData.expiresAt)
        : null;
      const expiresAt = hasMeaningfulExpiresAt(parsedExpiresAt)
        ? parsedExpiresAt
        : null;
      const scope = tokenData.scopes?.join(" ") ?? null;

      const saved = await driver.tokens.upsertProviderToken({
        existingId: existing?.id,
        id:
          existing?.id ??
          `${userId}-${provider}-${resolvedAccountEmail ?? "default"}-${Date.now()}`,
        userId,
        provider,
        accountEmail: resolvedAccountEmail,
        accountId: resolvedAccountId,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken ?? null,
        tokenType: normalizeProviderTokenType(tokenData.tokenType),
        expiresAt,
        scope,
      });

      await driver.tokens.deleteDuplicateProviderTokens({
        keepId: saved.id,
        userId,
        provider,
        accountEmail: resolvedAccountEmail,
        accountId: resolvedAccountId,
      });

      await hooks?.onTokenChange?.({ userId, provider, action: "set" });
    } catch (error) {
      log(debugLogs, "Error saving provider token:", error);
      throw error;
    }
  };

  const removeProviderToken = async (
    provider: string,
    email?: string,
    context?: MCPContext
  ): Promise<void> => {
    const userId = context?.userId;
    if (!userId) {
      console.error("[Integrate SDK] Cannot delete token: No userId in context");
      return;
    }

    try {
      await driver.tokens.deleteProviderTokens({
        userId,
        provider,
        accountEmail: normalizeAccountEmail(email),
      });
      await hooks?.onTokenChange?.({ userId, provider, action: "remove" });
    } catch (error) {
      log(debugLogs, "Error deleting provider token:", error);
      throw error;
    }
  };

  const callbacks: IntegrateDatabaseCallbacks = {
    getProviderToken,
    setProviderToken,
    removeProviderToken,
  };

  if (driver.triggers) {
    const triggerDriver = driver.triggers;
    const triggers: TriggerCallbacks = {
      create: async (triggerData, context) => {
        try {
          const created = await triggerDriver.createTrigger(
            flattenedTriggerToCreateInput(
              triggerData as FlattenedTrigger,
              context?.userId
            )
          );
          return toSdkTrigger(created);
        } catch (error) {
          log(debugLogs, "Error creating trigger:", error);
          throw error;
        }
      },

      get: async (triggerId, context) => {
        try {
          const found = await triggerDriver.getTriggerById(triggerId);
          const authorized = await authorizeTriggerRow(found, context, hooks);
          return authorized ? toSdkTrigger(authorized) : null;
        } catch (error) {
          log(debugLogs, "Error getting trigger:", error);
          throw error;
        }
      },

      list: async (params, context) => {
        try {
          const { rows, total } = await triggerDriver.listTriggers({
            userId: context?.userId,
            status: params.status,
            toolName: params.toolName,
            limit: params.limit ?? 20,
            offset: params.offset ?? 0,
          });

          const triggers: Trigger[] = [];
          for (const row of rows) {
            const authorized = await authorizeTriggerRow(row, context, hooks);
            if (authorized) {
              triggers.push(toSdkTrigger(authorized));
            }
          }

          return { triggers, total };
        } catch (error) {
          log(debugLogs, "Error listing triggers:", error);
          throw error;
        }
      },

      update: async (triggerId, updates, context) => {
        try {
          const existing = await triggerDriver.getTriggerById(triggerId);
          const authorized = await authorizeTriggerRow(existing, context, hooks);
          if (!authorized) {
            throw new Error(`Trigger not found: ${triggerId}`);
          }

          const updated = await triggerDriver.updateTrigger(
            authorized.id,
            toDbTriggerUpdates(updates)
          );
          if (!updated) {
            throw new Error(`Trigger not found: ${triggerId}`);
          }

          return toSdkTrigger(updated);
        } catch (error) {
          log(debugLogs, "Error updating trigger:", error);
          throw error;
        }
      },

      delete: async (triggerId, context) => {
        try {
          const existing = await triggerDriver.getTriggerById(triggerId);
          const authorized = await authorizeTriggerRow(existing, context, hooks);
          if (!authorized) {
            return;
          }

          await triggerDriver.deleteTrigger(authorized.id);
        } catch (error) {
          log(debugLogs, "Error deleting trigger:", error);
          throw error;
        }
      },
    };

    callbacks.triggers = triggers;
  }

  return callbacks;
}

export function createDatabaseAdapterFactory(
  createDriver: () => DatabaseDriver,
  options?: Omit<CreateDatabaseAdapterOptions, "driver">
): IntegrateDatabaseAdapter {
  return () =>
    createDatabaseAdapterCallbacks({
      driver: createDriver(),
      hooks: options?.hooks,
      debugLogs: options?.debugLogs,
    });
}

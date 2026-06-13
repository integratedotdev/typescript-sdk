import type { Trigger } from "../triggers/types.js";
import type { FlattenedTrigger, TriggerRecord } from "./types.js";

function toIsoString(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function toDbSchedule(value: FlattenedTrigger): {
  scheduleType: "once" | "cron";
  scheduleValue: string;
} {
  if (value.scheduleType && value.scheduleValue) {
    return {
      scheduleType: value.scheduleType,
      scheduleValue: value.scheduleValue,
    };
  }

  if (value.schedule.type === "once") {
    const runAt = toIsoString(value.schedule.runAt);
    if (!runAt) {
      throw new Error("Invalid trigger once schedule");
    }
    return {
      scheduleType: "once",
      scheduleValue: runAt,
    };
  }

  return {
    scheduleType: "cron",
    scheduleValue: value.schedule.expression,
  };
}

export function toSdkSchedule(row: TriggerRecord): Trigger["schedule"] {
  if (row.scheduleType === "once") {
    return {
      type: "once",
      runAt: row.scheduleValue,
    };
  }

  return {
    type: "cron",
    expression: row.scheduleValue,
  };
}

export function toSdkTrigger(row: TriggerRecord): Trigger {
  return {
    id: row.id,
    userId: row.userId ?? undefined,
    name: row.name ?? undefined,
    description: row.description ?? undefined,
    toolName: row.toolName,
    toolArguments: row.toolArguments ?? {},
    schedule: toSdkSchedule(row),
    status: row.status as Trigger["status"],
    provider: row.provider ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    lastRunAt: toIsoString(row.lastRunAt) ?? undefined,
    nextRunAt: toIsoString(row.nextRunAt) ?? undefined,
    runCount: row.runCount,
    lastError: row.lastError ?? undefined,
    lastResult: row.lastResult ?? undefined,
  };
}

export function toDbTriggerUpdates(updates: Partial<Trigger>) {
  const dbUpdates: Partial<TriggerRecord> = {
    updatedAt: new Date(),
  };

  if (updates.name !== undefined) dbUpdates.name = updates.name ?? null;
  if (updates.description !== undefined) {
    dbUpdates.description = updates.description ?? null;
  }
  if (updates.toolArguments !== undefined) {
    dbUpdates.toolArguments = updates.toolArguments;
  }
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.provider !== undefined) dbUpdates.provider = updates.provider ?? null;
  if (updates.lastError !== undefined) dbUpdates.lastError = updates.lastError ?? null;
  if (updates.lastResult !== undefined) {
    dbUpdates.lastResult = updates.lastResult ?? null;
  }
  if (updates.lastRunAt !== undefined) {
    dbUpdates.lastRunAt = updates.lastRunAt ? new Date(updates.lastRunAt) : null;
  }
  if (updates.nextRunAt !== undefined) {
    dbUpdates.nextRunAt = updates.nextRunAt ? new Date(updates.nextRunAt) : null;
  }
  if (updates.runCount !== undefined) dbUpdates.runCount = updates.runCount;

  if (updates.schedule) {
    if (updates.schedule.type === "once") {
      dbUpdates.scheduleType = "once";
      dbUpdates.scheduleValue = new Date(updates.schedule.runAt).toISOString();
    } else {
      dbUpdates.scheduleType = "cron";
      dbUpdates.scheduleValue = updates.schedule.expression;
    }
  }

  return dbUpdates;
}

export function flattenedTriggerToCreateInput(
  triggerData: FlattenedTrigger,
  contextUserId?: string
) {
  const schedule = toDbSchedule(triggerData);
  return {
    id: triggerData.id,
    userId: contextUserId ?? triggerData.userId ?? null,
    name: triggerData.name ?? null,
    description: triggerData.description ?? null,
    toolName: triggerData.toolName,
    toolArguments: triggerData.toolArguments ?? {},
    scheduleType: schedule.scheduleType,
    scheduleValue: schedule.scheduleValue,
    status: triggerData.status ?? "active",
    provider: triggerData.provider ?? null,
    nextRunAt: triggerData.nextRunAt ? new Date(triggerData.nextRunAt) : null,
  };
}

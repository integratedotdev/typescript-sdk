import { cache } from "react";
import { db } from "@/lib/db";
import { apiKey } from "@/lib/db/schema/auth";
import { eq, and, desc } from "drizzle-orm";
import { getActiveOrgId } from "./session";
import { checkServerPermission } from "./permissions";

export interface ApiKeyRecord {
  id: string;
  name: string;
  prefix: string | null;
  start: string | null;
  environment: "dev" | "prod";
  enabled: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const getApiKeys = cache(
  async (environment?: "dev" | "prod"): Promise<ApiKeyRecord[]> => {
    const allowed = await checkServerPermission("canManageApiKeys");
    if (!allowed) return [];

    const activeOrgId = await getActiveOrgId();
    if (!activeOrgId) return [];

    const conditions = [eq(apiKey.organizationId, activeOrgId)];
    if (environment) {
      conditions.push(eq(apiKey.environment, environment));
    }

    const keys = await db
      .select({
        id: apiKey.id,
        name: apiKey.name,
        prefix: apiKey.prefix,
        start: apiKey.start,
        environment: apiKey.environment,
        enabled: apiKey.enabled,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
        updatedAt: apiKey.updatedAt,
      })
      .from(apiKey)
      .where(and(...conditions))
      .orderBy(desc(apiKey.createdAt));

    return keys.map((key) => ({
      ...key,
      environment: key.environment as "dev" | "prod",
    }));
  }
);

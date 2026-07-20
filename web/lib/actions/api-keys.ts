"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { apiKey } from "@/lib/db/schema/auth";
import { auth } from "@/lib/auth";
import { getActiveOrgId } from "@/lib/data/session";
import { checkServerPermission } from "@/lib/data/permissions";
import type { ActionResult } from "./settings";

function revalidateApiKeyPaths() {
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/settings/api-keys");
}

export async function createApiKey(
  name: string,
  environment: "dev" | "prod"
): Promise<ActionResult & { key?: string }> {
  const allowed = await checkServerPermission("canManageApiKeys");
  if (!allowed) {
    return { success: false, error: "Permission denied" };
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    return { success: false, error: "No active organization" };
  }

  if (!name) {
    return { success: false, error: "Name is required" };
  }

  if (environment !== "dev" && environment !== "prod") {
    return { success: false, error: "Environment must be 'dev' or 'prod'" };
  }

  try {
    const crypto = await import("crypto");
    const keyId = crypto.randomUUID();
    const prefix = "int";
    const keyValue = `${prefix}_${crypto.randomBytes(32).toString("hex")}`;
    const hashedKey = crypto.createHash("sha256").update(keyValue).digest("hex");
    const start = keyValue.substring(0, 6);
    const now = new Date();

    await db.insert(apiKey).values({
      id: keyId,
      userId: session.user.id,
      organizationId: activeOrgId,
      name,
      key: hashedKey,
      prefix,
      start,
      environment,
      enabled: true,
      createdAt: now,
      updatedAt: now,
      requestCount: 0,
      rateLimitEnabled: false,
    });

    revalidateApiKeyPaths();
    return { success: true, key: keyValue };
  } catch (error) {
    console.error("Error creating API key:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create API key",
    };
  }
}

export async function deleteApiKey(keyId: string): Promise<ActionResult> {
  const allowed = await checkServerPermission("canManageApiKeys");
  if (!allowed) {
    return { success: false, error: "Permission denied" };
  }

  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    return { success: false, error: "No active organization" };
  }

  try {
    await auth.api.deleteApiKey({
      body: { keyId },
      headers: headerList,
    });

    revalidateApiKeyPaths();
    return { success: true };
  } catch (error) {
    console.error("Error deleting API key:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete API key",
    };
  }
}

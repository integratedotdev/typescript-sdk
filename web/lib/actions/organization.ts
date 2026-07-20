"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { member as memberTable } from "@/lib/db/schema/auth";
import { organizationAppConfig } from "@/lib/db/schema/settings";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getActiveOrgId, getServerSession } from "@/lib/data/session";
import { checkServerPermission } from "@/lib/data/permissions";
import {
  canModifyMember,
  type MemberPermissions,
} from "@/lib/permissions";
import type { ActionResult } from "./settings";

function revalidateOrgPaths() {
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/settings/organization");
}

export async function updateAppConfig(data: {
  devUrl: string;
  prodUrl: string;
}): Promise<ActionResult> {
  const allowed = await checkServerPermission("canManageOrganization");
  if (!allowed) {
    return { success: false, error: "Permission denied" };
  }

  const organizationId = await getActiveOrgId();
  if (!organizationId) {
    return { success: false, error: "No active organization" };
  }

  const { devUrl, prodUrl } = data;

  for (const [field, value] of [
    ["devUrl", devUrl],
    ["prodUrl", prodUrl],
  ] as const) {
    if (value && value !== "") {
      try {
        new URL(value);
      } catch {
        return { success: false, error: `Invalid URL for ${field}: "${value}"` };
      }
    }
  }

  try {
    await db
      .insert(organizationAppConfig)
      .values({
        organizationId,
        devUrl: devUrl || null,
        prodUrl: prodUrl || null,
      })
      .onConflictDoUpdate({
        target: organizationAppConfig.organizationId,
        set: {
          devUrl: devUrl || null,
          prodUrl: prodUrl || null,
          updatedAt: new Date(),
        },
      });

    revalidateOrgPaths();
    return { success: true };
  } catch (error) {
    console.error("App config update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update app config",
    };
  }
}

export async function updateOrganization(data: {
  name: string;
  slug: string;
}): Promise<ActionResult> {
  const allowed = await checkServerPermission("canManageOrganization");
  if (!allowed) {
    return { success: false, error: "Permission denied" };
  }

  const organizationId = await getActiveOrgId();
  if (!organizationId) {
    return { success: false, error: "No active organization" };
  }

  try {
    await auth.api.updateOrganization({
      body: {
        organizationId,
        data: {
          name: data.name,
          slug: data.slug,
        },
      },
      headers: await headers(),
    });

    revalidateOrgPaths();
    return { success: true };
  } catch (error) {
    console.error("Organization update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update organization",
    };
  }
}

export async function updateMemberPermissions(
  memberId: string,
  permissions: MemberPermissions
): Promise<ActionResult> {
  const session = await getServerSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const allowed = await checkServerPermission("canManageMembers");
  if (!allowed) {
    return { success: false, error: "Permission denied" };
  }

  const organizationId = await getActiveOrgId();
  if (!organizationId) {
    return { success: false, error: "No active organization" };
  }

  const actorMember = await db
    .select()
    .from(memberTable)
    .where(eq(memberTable.userId, session.user.id))
    .limit(1);

  if (!actorMember[0] || actorMember[0].organizationId !== organizationId) {
    return { success: false, error: "You are not a member of this organization" };
  }

  const targetMember = await db
    .select()
    .from(memberTable)
    .where(eq(memberTable.id, memberId))
    .limit(1);

  if (!targetMember[0]) {
    return { success: false, error: "Member not found" };
  }

  if (targetMember[0].organizationId !== organizationId) {
    return { success: false, error: "Cannot modify members from different organizations" };
  }

  const modifyCheck = canModifyMember(actorMember[0], targetMember[0]);
  if (!modifyCheck.allowed) {
    return { success: false, error: modifyCheck.reason || "Cannot modify member" };
  }

  if (targetMember[0].role.toLowerCase() === "owner") {
    return { success: false, error: "Cannot change owner permissions" };
  }

  try {
    await db
      .update(memberTable)
      .set({
        permissions: permissions as Record<string, boolean>,
        updatedAt: new Date(),
      })
      .where(eq(memberTable.id, memberId));

    revalidateOrgPaths();
    return { success: true };
  } catch (error) {
    console.error("Failed to update member permissions:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update member permissions",
    };
  }
}

import { db } from "@/lib/db";
import { member as memberTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { hasPermission, type Permission, type Member } from "@/lib/permissions";

/**
 * Check if a user has a specific permission in an organization
 * Returns the member record if they have the permission, null otherwise
 */
export async function requirePermission(
  userId: string,
  organizationId: string,
  permission: Permission
): Promise<{ allowed: boolean; member?: Member; reason?: string }> {
  try {
    // Get member record
    const memberRecord = await db
      .select()
      .from(memberTable)
      .where(
        and(
          eq(memberTable.userId, userId),
          eq(memberTable.organizationId, organizationId)
        )
      )
      .limit(1);

    if (!memberRecord[0]) {
      return {
        allowed: false,
        reason: "You are not a member of this organization",
      };
    }

    const member = memberRecord[0] as Member;

    // Check permission
    if (!hasPermission(member, permission)) {
      return {
        allowed: false,
        member,
        reason: `You don't have permission to perform this action`,
      };
    }

    return {
      allowed: true,
      member,
    };
  } catch (error) {
    console.error("Permission check error:", error);
    return {
      allowed: false,
      reason: "Failed to check permissions",
    };
  }
}

/**
 * Get a user's member record in an organization
 */
export async function getMemberInOrg(
  userId: string,
  organizationId: string
): Promise<Member | null> {
  try {
    const memberRecord = await db
      .select()
      .from(memberTable)
      .where(
        and(
          eq(memberTable.userId, userId),
          eq(memberTable.organizationId, organizationId)
        )
      )
      .limit(1);

    return (memberRecord[0] as Member) || null;
  } catch (error) {
    console.error("Failed to get member:", error);
    return null;
  }
}


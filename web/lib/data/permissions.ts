import { cache } from "react";
import { getMemberInOrg } from "@/lib/middleware/permissions";
import {
  getMemberPermissions,
  hasPermission,
  type MemberPermissions,
  type Permission,
} from "@/lib/permissions";
import { getActiveOrgId, getServerSession } from "./session";

export interface ResolvedPermissions extends MemberPermissions {
  role: string | null;
  organizationId: string | null;
}

export const getServerPermissions = cache(async (): Promise<ResolvedPermissions> => {
  const session = await getServerSession();
  const organizationId = await getActiveOrgId();

  if (!session?.user || !organizationId) {
    return {
      role: null,
      organizationId: null,
      canManageApiKeys: false,
      canManageInvitations: false,
      canManageMembers: false,
      canManageOrganization: false,
      canDeleteOrganization: false,
      canCreateOrganization: false,
      canManageBilling: false,
    };
  }

  const member = await getMemberInOrg(session.user.id, organizationId);
  if (!member) {
    return {
      role: null,
      organizationId,
      canManageApiKeys: false,
      canManageInvitations: false,
      canManageMembers: false,
      canManageOrganization: false,
      canDeleteOrganization: false,
      canCreateOrganization: false,
      canManageBilling: false,
    };
  }

  const permissions = getMemberPermissions(member.role, member.permissions ?? null);

  return {
    role: member.role,
    organizationId,
    ...permissions,
  };
});

export async function checkServerPermission(permission: Permission): Promise<boolean> {
  const session = await getServerSession();
  const organizationId = await getActiveOrgId();

  if (!session?.user || !organizationId) return false;

  const member = await getMemberInOrg(session.user.id, organizationId);
  if (!member) return false;

  return hasPermission(member, permission);
}

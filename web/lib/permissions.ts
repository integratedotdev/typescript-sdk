// Permission types
export type Permission =
  | "canManageApiKeys"
  | "canManageInvitations"
  | "canManageMembers"
  | "canManageOrganization"
  | "canDeleteOrganization"
  | "canCreateOrganization"
  | "canManageBilling";

export interface MemberPermissions {
  canManageApiKeys?: boolean;
  canManageInvitations?: boolean;
  canManageMembers?: boolean;
  canManageOrganization?: boolean;
  canDeleteOrganization?: boolean;
  canCreateOrganization?: boolean;
  canManageBilling?: boolean;
}

export interface Member {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  permissions?: MemberPermissions | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get default permissions for a role
 */
export function getDefaultPermissions(role: string): MemberPermissions {
  switch (role.toLowerCase()) {
    case "owner":
      return {
        canManageApiKeys: true,
        canManageInvitations: true,
        canManageMembers: true,
        canManageOrganization: true,
        canDeleteOrganization: true,
        canCreateOrganization: true,
        canManageBilling: true,
      };
    case "admin":
      return {
        canManageApiKeys: true,
        canManageInvitations: true,
        canManageMembers: true,
        canManageOrganization: true,
        canDeleteOrganization: false,
        canCreateOrganization: true,
        canManageBilling: true,
      };
    case "member":
    default:
      return {
        canManageApiKeys: false,
        canManageInvitations: false,
        canManageMembers: false,
        canManageOrganization: false,
        canDeleteOrganization: false,
        canCreateOrganization: false,
        canManageBilling: false,
      };
  }
}

/**
 * Get effective permissions for a member (role defaults + custom overrides)
 * Owner role always has all permissions regardless of custom settings
 */
export function getMemberPermissions(
  role: string,
  customPermissions?: MemberPermissions | null
): MemberPermissions {
  // Owner always has all permissions (hardcoded, cannot be changed)
  if (role.toLowerCase() === "owner") {
    return getDefaultPermissions("owner");
  }

  const defaults = getDefaultPermissions(role);
  
  // If no custom permissions, return defaults
  if (!customPermissions) {
    return defaults;
  }

  // Merge custom permissions with defaults (custom overrides defaults)
  return {
    canManageApiKeys: customPermissions.canManageApiKeys ?? defaults.canManageApiKeys,
    canManageInvitations: customPermissions.canManageInvitations ?? defaults.canManageInvitations,
    canManageMembers: customPermissions.canManageMembers ?? defaults.canManageMembers,
    canManageOrganization: customPermissions.canManageOrganization ?? defaults.canManageOrganization,
    canDeleteOrganization: customPermissions.canDeleteOrganization ?? defaults.canDeleteOrganization,
    canCreateOrganization: customPermissions.canCreateOrganization ?? defaults.canCreateOrganization,
    canManageBilling: customPermissions.canManageBilling ?? defaults.canManageBilling,
  };
}

/**
 * Check if a member has a specific permission
 */
export function hasPermission(
  member: Member | { role: string; permissions?: MemberPermissions | null },
  permission: Permission
): boolean {
  const effectivePermissions = getMemberPermissions(member.role, member.permissions);
  return effectivePermissions[permission] === true;
}

/**
 * Check if actor can modify target member
 * Rules:
 * - Cannot modify owner (owner is protected)
 * - Cannot elevate to owner (only system can make owners)
 * - Actor must have canManageMembers permission
 */
export function canModifyMember(
  actor: Member | { role: string; permissions?: MemberPermissions | null },
  target: Member | { role: string },
  newRole?: string
): { allowed: boolean; reason?: string } {
  // Cannot modify owner
  if (target.role.toLowerCase() === "owner") {
    return {
      allowed: false,
      reason: "Cannot modify organization owner",
    };
  }

  // Cannot elevate to owner
  if (newRole && newRole.toLowerCase() === "owner") {
    return {
      allowed: false,
      reason: "Cannot promote members to owner role",
    };
  }

  // Actor must have canManageMembers permission
  if (!hasPermission(actor, "canManageMembers")) {
    return {
      allowed: false,
      reason: "You don't have permission to manage members",
    };
  }

  return { allowed: true };
}

/**
 * Get a user-friendly label for a permission
 */
export function getPermissionLabel(permission: Permission): string {
  const labels: Record<Permission, string> = {
    canManageApiKeys: "Manage API Keys",
    canManageInvitations: "Manage Invitations",
    canManageMembers: "Manage Members",
    canManageOrganization: "Manage Organization",
    canDeleteOrganization: "Delete Organization",
    canCreateOrganization: "Create Organizations",
    canManageBilling: "Manage Billing",
  };
  return labels[permission];
}

/**
 * Get a user-friendly description for a permission
 */
export function getPermissionDescription(permission: Permission): string {
  const descriptions: Record<Permission, string> = {
    canManageApiKeys: "Create, view, update, and delete all organization API keys",
    canManageInvitations: "Send, view, and revoke organization invitations",
    canManageMembers: "Update member roles and permissions (cannot affect owner)",
    canManageOrganization: "Update organization details (name, slug, settings)",
    canDeleteOrganization: "Delete the organization",
    canCreateOrganization: "Create new organizations",
    canManageBilling: "Access billing portal, view and manage spending alerts and limits",
  };
  return descriptions[permission];
}

/**
 * Get all available permissions
 */
export function getAllPermissions(): Permission[] {
  return [
    "canManageApiKeys",
    "canManageInvitations",
    "canManageMembers",
    "canManageOrganization",
    "canDeleteOrganization",
    "canCreateOrganization",
    "canManageBilling",
  ];
}


"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import {
  getMemberPermissions,
  hasPermission as checkPermission,
  type Permission,
  type MemberPermissions,
  type Member,
} from "@/lib/permissions";

interface UsePermissionsReturn {
  permissions: MemberPermissions | null;
  hasPermission: (permission: Permission) => boolean;
  isOwner: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  member: Member | null;
}

/**
 * Hook to check current user's permissions in the active organization
 * Uses Better Auth's getActiveMember for efficient permission fetching
 */
export function usePermissions(): UsePermissionsReturn {
  const { data: session, isPending } = useSession();
  const { data: activeOrg, isPending: isOrgPending } = authClient.useActiveOrganization();
  const [permissions, setPermissions] = useState<MemberPermissions | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastOrgId = useRef<string | null>(null);

  useEffect(() => {
    async function loadPermissions() {
      // Wait for session and org to load
      if (isPending || isOrgPending) {
        return;
      }

      if (!session?.user) {
        setPermissions(null);
        setMember(null);
        setLoading(false);
        return;
      }

      // If no active org, don't show error - just set loading to false
      if (!activeOrg) {
        setPermissions(null);
        setMember(null);
        setLoading(false);
        return;
      }

      // Skip if we already loaded for this org
      if (lastOrgId.current === activeOrg.id && member) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use Better Auth's getActiveMember - more efficient than fetching all members
        const result = await authClient.organization.getActiveMember();

        if (result.error || !result.data) {
          setPermissions(null);
          setMember(null);
          setLoading(false);
          return;
        }

        const activeMember = result.data;
        lastOrgId.current = activeOrg.id;

        // Calculate effective permissions based on role
        const effectivePermissions = getMemberPermissions(
          activeMember.role,
          null // Better Auth handles permissions through roles
        );

        setMember({
          id: activeMember.id,
          userId: activeMember.userId,
          organizationId: activeMember.organizationId,
          role: activeMember.role,
          permissions: null,
        } as Member);
        setPermissions(effectivePermissions);
      } catch (err) {
        console.error("Failed to load permissions:", err);
        setError("Failed to load permissions");
        setPermissions(null);
        setMember(null);
      } finally {
        setLoading(false);
      }
    }

    loadPermissions();
  }, [session, isPending, activeOrg, isOrgPending, member]);

  const hasPermissionCheck = (permission: Permission): boolean => {
    // During loading, return false to not show protected content
    if (loading || !member) return false;
    return checkPermission(member, permission);
  };

  return {
    permissions,
    hasPermission: hasPermissionCheck,
    isOwner: member?.role?.toLowerCase() === "owner",
    isAdmin:
      member?.role?.toLowerCase() === "admin" ||
      member?.role?.toLowerCase() === "owner",
    loading,
    error,
    member,
  };
}


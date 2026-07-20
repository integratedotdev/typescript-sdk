import { cache } from "react";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  member as memberTable,
  user as userTable,
  organization as organizationTable,
} from "@/lib/db/schema/auth";
import { organizationAppConfig } from "@/lib/db/schema/settings";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getActiveOrgId } from "./session";

export interface OrgMember {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  permissions: unknown;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export interface OrgAppConfig {
  devUrl: string;
  prodUrl: string;
}

export interface OrganizationData {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  metadata: unknown;
  createdAt: Date;
}

export const getOrganizationMembers = cache(async (): Promise<OrgMember[]> => {
  const organizationId = await getActiveOrgId();
  if (!organizationId) return [];

  const members = await db
    .select({
      id: memberTable.id,
      userId: memberTable.userId,
      organizationId: memberTable.organizationId,
      role: memberTable.role,
      permissions: memberTable.permissions,
      createdAt: memberTable.createdAt,
      updatedAt: memberTable.updatedAt,
      userName: userTable.name,
      userEmail: userTable.email,
      userImage: userTable.image,
    })
    .from(memberTable)
    .innerJoin(userTable, eq(memberTable.userId, userTable.id))
    .where(eq(memberTable.organizationId, organizationId));

  return members.map((member) => ({
    id: member.id,
    userId: member.userId,
    organizationId: member.organizationId,
    role: member.role,
    permissions: member.permissions,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
    user: {
      id: member.userId,
      name: member.userName,
      email: member.userEmail,
      image: member.userImage,
    },
  }));
});

export const getOrgAppConfig = cache(async (): Promise<OrgAppConfig> => {
  const organizationId = await getActiveOrgId();
  if (!organizationId) return { devUrl: "", prodUrl: "" };

  const rows = await db
    .select()
    .from(organizationAppConfig)
    .where(eq(organizationAppConfig.organizationId, organizationId))
    .limit(1);

  if (rows.length === 0) {
    return { devUrl: "", prodUrl: "" };
  }

  return {
    devUrl: rows[0].devUrl ?? "",
    prodUrl: rows[0].prodUrl ?? "",
  };
});

export const getActiveOrganization = cache(async (): Promise<OrganizationData | null> => {
  const organizationId = await getActiveOrgId();
  if (!organizationId) return null;

  const rows = await db
    .select()
    .from(organizationTable)
    .where(eq(organizationTable.id, organizationId))
    .limit(1);

  if (rows.length === 0) return null;

  return rows[0] as OrganizationData;
});

export const getUserOrganizations = cache(async () => {
  const headerList = await headers();
  return auth.api.listOrganizations({ headers: headerList });
});

/** Simplified member list for notification email settings */
export const getOrgMembersForSettings = cache(async () => {
  const members = await getOrganizationMembers();
  return members.map((m) => ({
    email: m.user.email,
    name: m.user.name || m.user.email,
    role: m.role,
  }));
});

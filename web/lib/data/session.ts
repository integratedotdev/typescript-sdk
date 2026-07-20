import { cache } from "react";
import { headers } from "next/headers";
import { connection } from "next/server";
import { auth } from "@/lib/auth";

export const getServerSession = cache(async () => {
  await connection();
  const headerList = await headers();
  return auth.api.getSession({ headers: headerList });
});

export async function getActiveOrgId(): Promise<string | null> {
  const session = await getServerSession();
  if (!session) return null;

  let activeOrgId = session.session?.activeOrganizationId ?? null;

  if (!activeOrgId) {
    try {
      const headerList = await headers();
      const organizations = await auth.api.listOrganizations({
        headers: headerList,
      });

      if (organizations && organizations.length > 0) {
        const firstOrg = organizations[0];
        await auth.api.setActiveOrganization({
          body: { organizationId: firstOrg.id },
          headers: headerList,
        });
        activeOrgId = firstOrg.id;
      }
    } catch (error) {
      console.error("Error setting active organization:", error);
      return null;
    }
  }

  return activeOrgId;
}

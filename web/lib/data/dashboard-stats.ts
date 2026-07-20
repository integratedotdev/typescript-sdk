import { cache } from "react";
import { db } from "@/lib/db";
import { userBillingSettings } from "@/lib/db/schema/settings";
import { organizationUsage } from "@/lib/db/schema/organization";
import { member as memberTable } from "@/lib/db/schema/auth";
import { eq, and } from "drizzle-orm";
import { Polar } from "@polar-sh/sdk";
import { getActiveOrgId, getServerSession } from "./session";

const PLAN_DETAILS = {
  starter: {
    name: "Starter Plan",
    pricing: "$0.20/1k requests",
  },
  grow: {
    name: "Grow Plan",
    pricing: "$149/month + $0.20/1k requests",
  },
  enterprise: {
    name: "Enterprise Plan",
    pricing: "Custom pricing",
  },
} as const;

export interface SubscriptionData {
  plan: string;
  pricing: string;
  spendingCap: number;
  currentSpend: number;
  usagePercentage: number;
}

export interface PolarMeter {
  id: string;
  meterId: string;
  consumedUnits: number;
  creditedUnits: number;
  balance: number;
  meter: {
    name: string;
  };
}

export interface UsageSummary {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalSpent: number;
}

export interface DashboardStats {
  subscription: SubscriptionData;
  meters: PolarMeter[];
  summary: UsageSummary | null;
}

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "",
  server: process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
});

async function fetchSubscriptionData(
  userId: string,
  activeOrgId: string | null
): Promise<SubscriptionData> {
  const billingSettings = await db
    .select()
    .from(userBillingSettings)
    .where(eq(userBillingSettings.userId, userId))
    .limit(1);

  const settings = billingSettings[0] || {
    plan: "starter",
    spendingCap: 10000,
  };

  const planType = settings.plan as keyof typeof PLAN_DETAILS;
  const planInfo = PLAN_DETAILS[planType] || PLAN_DETAILS.starter;

  let currentSpend = 0;
  if (activeOrgId) {
    const usage = await db
      .select()
      .from(organizationUsage)
      .where(eq(organizationUsage.organizationId, activeOrgId))
      .limit(1);

    if (usage.length > 0) {
      currentSpend = Math.round((usage[0].totalSpent || 0) / 100);
    }
  }

  const spendingCap = settings.spendingCap || 10000;
  const usagePercentage =
    spendingCap > 0
      ? Math.min((currentSpend / spendingCap) * 100, 100)
      : 0;

  return {
    plan: planInfo.name,
    pricing: planInfo.pricing,
    spendingCap,
    currentSpend,
    usagePercentage: Math.round(usagePercentage * 10) / 10,
  };
}

async function fetchPolarMeters(
  userId: string,
  activeOrgId: string | null
): Promise<PolarMeter[]> {
  let userIdForCustomer = userId;

  if (activeOrgId) {
    const owner = await db
      .select()
      .from(memberTable)
      .where(
        and(
          eq(memberTable.organizationId, activeOrgId),
          eq(memberTable.role, "owner")
        )
      )
      .limit(1);

    if (owner.length > 0) {
      userIdForCustomer = owner[0].userId;
    }
  }

  try {
    const customers = await polarClient.customers.list({ limit: 100 });

    const matchingCustomer = customers.result?.items?.find(
      (customer) => customer.externalId === userIdForCustomer
    );

    if (!matchingCustomer) return [];

    const metersResponse = await polarClient.customerMeters.list({
      customerId: matchingCustomer.id,
      page: 1,
      limit: 10,
    });

    return (metersResponse.result?.items || []) as PolarMeter[];
  } catch (error) {
    console.error("Error fetching Polar meters:", error);
    return [];
  }
}

async function fetchUsageSummary(
  activeOrgId: string | null
): Promise<UsageSummary | null> {
  if (!activeOrgId) return null;

  const usage = await db
    .select()
    .from(organizationUsage)
    .where(eq(organizationUsage.organizationId, activeOrgId))
    .limit(1);

  if (usage.length === 0) return null;

  return {
    totalRequests: usage[0].totalRequests || 0,
    successfulRequests: usage[0].successfulRequests || 0,
    failedRequests: usage[0].failedRequests || 0,
    totalSpent: usage[0].totalSpent || 0,
  };
}

export const getDashboardStats = cache(async (): Promise<DashboardStats> => {
  const session = await getServerSession();
  if (!session) {
    return {
      subscription: {
        plan: "Starter Plan",
        pricing: "$0.20/1k requests",
        spendingCap: 10000,
        currentSpend: 0,
        usagePercentage: 0,
      },
      meters: [],
      summary: null,
    };
  }

  const activeOrgId = await getActiveOrgId();

  const [subscription, meters, summary] = await Promise.all([
    fetchSubscriptionData(session.user.id, activeOrgId),
    fetchPolarMeters(session.user.id, activeOrgId),
    fetchUsageSummary(activeOrgId),
  ]);

  return { subscription, meters, summary };
});

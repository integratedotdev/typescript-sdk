import { cache } from "react";
import { getUsageRecords, getOrganizationUsage } from "@/lib/db/queries";
import { getActiveOrgId, getServerSession } from "./session";
import { getDashboardStats, type PolarMeter, type UsageSummary } from "./dashboard-stats";

export interface UsageRecord {
  id: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  requestSize?: number | null;
  responseSize?: number | null;
  createdAt: Date;
}

export interface UsagePageData {
  records: UsageRecord[];
  summary: UsageSummary | null;
  meters: PolarMeter[];
}

export const getUsagePageData = cache(
  async (limit = 50): Promise<UsagePageData> => {
    const session = await getServerSession();
    const activeOrgId = await getActiveOrgId();

    if (!session) {
      return { records: [], summary: null, meters: [] };
    }

    const [records, summary, stats] = await Promise.all([
      getUsageRecords({
        userId: session.user.id,
        organizationId: activeOrgId ?? undefined,
        limit,
      }),
      activeOrgId ? getOrganizationUsage(activeOrgId) : Promise.resolve(null),
      getDashboardStats(),
    ]);

    return {
      records: records as UsageRecord[],
      summary: summary
        ? {
            totalRequests: summary.totalRequests || 0,
            successfulRequests: summary.successfulRequests || 0,
            failedRequests: summary.failedRequests || 0,
            totalSpent: summary.totalSpent || 0,
          }
        : null,
      meters: stats.meters,
    };
  }
);

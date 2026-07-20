import { cache } from "react";
import { db } from "@/lib/db";
import { userBillingSettings } from "@/lib/db/schema/settings";
import { eq } from "drizzle-orm";
import { getServerSession } from "./session";

export interface Alert {
  id: string;
  percentage: number;
  enabled: boolean;
}

export interface BillingSettings {
  alerts: Alert[];
  spendingCap: string;
  notificationEmails: Record<string, boolean>;
  plan: string;
}

const DEFAULT_SETTINGS: BillingSettings = {
  alerts: [
    { id: "1", percentage: 50, enabled: true },
    { id: "2", percentage: 75, enabled: true },
    { id: "3", percentage: 100, enabled: true },
  ],
  spendingCap: "0",
  notificationEmails: {},
  plan: "starter",
};

export const getBillingSettings = cache(async (): Promise<BillingSettings> => {
  const session = await getServerSession();
  if (!session) return DEFAULT_SETTINGS;

  const settings = await db
    .select()
    .from(userBillingSettings)
    .where(eq(userBillingSettings.userId, session.user.id))
    .limit(1);

  if (settings.length === 0) {
    return DEFAULT_SETTINGS;
  }

  const userSettings = settings[0];

  return {
    alerts: [
      { id: "1", percentage: 50, enabled: userSettings.alert50Enabled },
      { id: "2", percentage: 75, enabled: userSettings.alert75Enabled },
      { id: "3", percentage: 100, enabled: userSettings.alert100Enabled },
    ],
    spendingCap: userSettings.spendingCap
      ? (userSettings.spendingCap / 100).toString()
      : "0",
    notificationEmails:
      (userSettings.notificationEmails as Record<string, boolean>) || {},
    plan: userSettings.plan ?? "starter",
  };
});

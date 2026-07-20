"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { userBillingSettings } from "@/lib/db/schema/settings";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/data/session";
import type { Alert } from "@/lib/data/settings";

export interface SaveSettingsInput {
  alerts: Alert[];
  spendingCap: string;
  notificationEmails: Record<string, boolean>;
}

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function saveBillingSettings(
  data: SaveSettingsInput
): Promise<ActionResult> {
  const session = await getServerSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const { alerts, spendingCap, notificationEmails } = data;

  if (notificationEmails) {
    for (const email of Object.keys(notificationEmails)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: `Invalid email address: ${email}` };
      }
    }
  }

  const spendingCapNumber = parseFloat(spendingCap);
  if (isNaN(spendingCapNumber) || spendingCapNumber < 0) {
    return { success: false, error: "Invalid spending cap value" };
  }

  const spendingCapCents = Math.round(spendingCapNumber * 100);

  let alert50Enabled = true;
  let alert75Enabled = true;
  let alert100Enabled = true;

  if (alerts && Array.isArray(alerts)) {
    alerts.forEach((alert) => {
      if (alert.percentage === 50) alert50Enabled = alert.enabled;
      if (alert.percentage === 75) alert75Enabled = alert.enabled;
      if (alert.percentage === 100) alert100Enabled = alert.enabled;
    });
  }

  try {
    await db
      .insert(userBillingSettings)
      .values({
        userId: session.user.id,
        spendingCap: spendingCapCents,
        alert50Enabled,
        alert75Enabled,
        alert100Enabled,
        notificationEmails: notificationEmails || {},
      })
      .onConflictDoUpdate({
        target: userBillingSettings.userId,
        set: {
          spendingCap: spendingCapCents,
          alert50Enabled,
          alert75Enabled,
          alert100Enabled,
          notificationEmails: notificationEmails || {},
          updatedAt: new Date(),
        },
      });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/home");
    return { success: true };
  } catch (error) {
    console.error("Settings update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update settings",
    };
  }
}

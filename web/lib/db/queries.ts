import { db } from "./index";
import { usageRecords, organizationUsage } from "./schema/organization";
import { userBillingSettings, spendingAlertsSent } from "./schema/settings";
import { user as userTable, member as memberTable } from "./schema/auth";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { sendEmail } from "../resend";
import { UsageAlertEmail } from "../email-templates/usage-alert";
import { createElement } from "react";

// Pricing configuration
// $0.20 per 1,000 requests = 20 cents per 1,000 requests = 0.02 cents per request
// Since totalSpent is stored in cents (integers), we calculate cost per request as:
// (20 cents / 1000 requests) = 0.02 cents per request
// To store as integer, we use hundredths of cents: 0.02 * 100 = 2 units per request
// When displaying, divide by 10000 to convert from hundredths of cents to dollars
const PRICE_PER_1000_REQUESTS_CENTS = 20; // $0.20 = 20 cents per 1000 requests
const COST_PER_REQUEST_HUNDREDTHS_OF_CENTS = Math.round((PRICE_PER_1000_REQUESTS_CENTS * 100) / 1000); // 2 units per request

export async function trackUsage(data: {
  userId: string;
  organizationId?: string;
  apiKeyId?: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  requestSize?: number;
  responseSize?: number;
  metadata?: unknown;
}) {
  try {
    // Create usage record
    await db.insert(usageRecords).values({
      ...data,
      createdAt: new Date(),
    });

    // Update organization usage summary
    if (data.organizationId) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const isSuccess = data.statusCode >= 200 && data.statusCode < 300;
      
      await db
        .insert(organizationUsage)
        .values({
          organizationId: data.organizationId,
          currentPeriodStart: startOfMonth,
          currentPeriodEnd: endOfMonth,
          totalRequests: 1,
          successfulRequests: isSuccess ? 1 : 0,
          failedRequests: isSuccess ? 0 : 1,
          totalSpent: COST_PER_REQUEST_HUNDREDTHS_OF_CENTS,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: organizationUsage.organizationId,
          set: {
            totalRequests: sql`${organizationUsage.totalRequests} + 1`,
            successfulRequests: isSuccess
              ? sql`${organizationUsage.successfulRequests} + 1`
              : sql`${organizationUsage.successfulRequests}`,
            failedRequests: !isSuccess
              ? sql`${organizationUsage.failedRequests} + 1`
              : sql`${organizationUsage.failedRequests}`,
            totalSpent: sql`${organizationUsage.totalSpent} + ${COST_PER_REQUEST_HUNDREDTHS_OF_CENTS}`,
            updatedAt: new Date(),
          },
        });
      
      // Check if spending alerts should be sent
      await checkAndSendSpendingAlerts(data.userId, data.organizationId);
    }
  } catch (error) {
    console.error("Failed to track usage:", error);
  }
}

export async function getOrganizationUsage(organizationId: string) {
  try {
    const result = await db
      .select()
      .from(organizationUsage)
      .where(eq(organizationUsage.organizationId, organizationId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Failed to get organization usage:", error);
    return null;
  }
}

export async function getUsageRecords(params: {
  userId?: string;
  organizationId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  try {
    let query = db.select().from(usageRecords);

    const conditions = [];
    if (params.userId) {
      conditions.push(eq(usageRecords.userId, params.userId));
    }
    if (params.organizationId) {
      conditions.push(eq(usageRecords.organizationId, params.organizationId));
    }
    if (params.startDate) {
      conditions.push(gte(usageRecords.createdAt, params.startDate));
    }
    if (params.endDate) {
      conditions.push(lte(usageRecords.createdAt, params.endDate));
    }

    if (conditions.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.limit(params.limit || 100);
    return result;
  } catch (error) {
    console.error("Failed to get usage records:", error);
    return [];
  }
}

// Get billing settings and notification emails for a user
async function getSpendingAlertSettings(userId: string) {
  try {
    const settings = await db
      .select()
      .from(userBillingSettings)
      .where(eq(userBillingSettings.userId, userId))
      .limit(1);
    
    return settings[0] || null;
  } catch (error) {
    console.error("Failed to get spending alert settings:", error);
    return null;
  }
}

// Check if an alert has already been sent for this threshold in this billing period
async function hasAlertBeenSent(
  userId: string,
  organizationId: string | undefined,
  threshold: number,
  billingPeriodStart: Date,
  billingPeriodEnd: Date
): Promise<boolean> {
  try {
    const conditions = [
      eq(spendingAlertsSent.userId, userId),
      eq(spendingAlertsSent.threshold, threshold),
      eq(spendingAlertsSent.billingPeriodStart, billingPeriodStart),
      eq(spendingAlertsSent.billingPeriodEnd, billingPeriodEnd),
    ];

    if (organizationId) {
      conditions.push(eq(spendingAlertsSent.organizationId, organizationId));
    }

    const result = await db
      .select()
      .from(spendingAlertsSent)
      .where(and(...conditions))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("Failed to check if alert was sent:", error);
    return false; // Assume not sent to be safe
  }
}

// Mark an alert as sent
async function markAlertAsSent(
  userId: string,
  organizationId: string | undefined,
  threshold: number,
  billingPeriodStart: Date,
  billingPeriodEnd: Date
) {
  try {
    await db.insert(spendingAlertsSent).values({
      userId,
      organizationId,
      threshold,
      sentAt: new Date(),
      billingPeriodStart,
      billingPeriodEnd,
    });
  } catch (error) {
    console.error("Failed to mark alert as sent:", error);
  }
}

// Get organization owner's email for notifications
async function getOrganizationOwnerEmail(organizationId: string): Promise<string | null> {
  try {
    const owner = await db
      .select({
        userId: memberTable.userId,
      })
      .from(memberTable)
      .where(
        and(
          eq(memberTable.organizationId, organizationId),
          eq(memberTable.role, "owner")
        )
      )
      .limit(1);

    if (owner.length === 0) return null;

    const ownerUser = await db
      .select({ email: userTable.email })
      .from(userTable)
      .where(eq(userTable.id, owner[0].userId))
      .limit(1);

    return ownerUser.length > 0 ? ownerUser[0].email : null;
  } catch (error) {
    console.error("Failed to get organization owner email:", error);
    return null;
  }
}

// Check spending and send alerts if thresholds are crossed
export async function checkAndSendSpendingAlerts(
  userId: string,
  organizationId: string | undefined
) {
  try {
    // Get billing settings
    const settings = await getSpendingAlertSettings(userId);
    if (!settings || !settings.spendingCap || settings.spendingCap === 0) {
      return; // No spending cap set or unlimited spending
    }

    // Get organization usage
    if (!organizationId) return;
    
    const usage = await getOrganizationUsage(organizationId);
    if (!usage) return;

    const currentSpending = usage.totalSpent || 0; // in hundredths of cents
    const spendingCap = settings.spendingCap; // in cents, convert to hundredths of cents
    const spendingCapInHundredthsOfCents = (spendingCap || 0) * 100;
    const percentage = Math.floor((currentSpending / spendingCapInHundredthsOfCents) * 100);

    // Determine billing period
    const now = new Date();
    const billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const billingPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Check which thresholds have been crossed
    const thresholdsToCheck = [
      { threshold: 50, enabled: settings.alert50Enabled },
      { threshold: 75, enabled: settings.alert75Enabled },
      { threshold: 100, enabled: settings.alert100Enabled },
    ];

    // Get notification emails
    const notificationEmails = settings.notificationEmails as Record<string, boolean> | null;
    const enabledEmails: string[] = [];
    
    if (notificationEmails) {
      Object.entries(notificationEmails).forEach(([email, enabled]) => {
        if (enabled) enabledEmails.push(email);
      });
    }

    // If no notification emails configured, try to use organization owner's email
    if (enabledEmails.length === 0) {
      const ownerEmail = await getOrganizationOwnerEmail(organizationId);
      if (ownerEmail) enabledEmails.push(ownerEmail);
    }

    if (enabledEmails.length === 0) {
      console.log("No notification emails configured for spending alerts");
      return;
    }

    // Get organization name and user name for email
    const ownerUser = await db
      .select({ name: userTable.name, email: userTable.email })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    const recipientName = ownerUser[0]?.name || ownerUser[0]?.email || "User";
    const organizationName = "Your Organization"; // We'd need to query this if we stored org names

    // Check each threshold
    for (const { threshold, enabled } of thresholdsToCheck) {
      if (!enabled || percentage < threshold) continue;

      // Check if we've already sent this alert
      const alreadySent = await hasAlertBeenSent(
        userId,
        organizationId,
        threshold,
        billingPeriodStart,
        billingPeriodEnd
      );

      if (alreadySent) continue;

      // Send alert emails
      const dashboardUrl = `${process.env.INTEGRATE_URL || "http://localhost:3000"}/dashboard/home`;

      for (const email of enabledEmails) {
        try {
          await sendEmail({
            to: email,
            subject: `⚠️ Spending Alert: ${percentage}% of your budget used`,
            react: createElement(UsageAlertEmail, {
              recipientName,
              organizationName,
              percentage,
              currentSpending: Math.round(currentSpending / 100), // Convert from hundredths of cents to cents
              spendingCap: spendingCap || 0,
              currentRequests: usage.totalRequests || 0,
              dashboardUrl,
            }),
          });
          
          console.log(`Sent ${threshold}% spending alert to ${email}`);
        } catch (emailError) {
          console.error(`Failed to send alert email to ${email}:`, emailError);
        }
      }

      // Mark alert as sent
      await markAlertAsSent(
        userId,
        organizationId,
        threshold,
        billingPeriodStart,
        billingPeriodEnd
      );
    }
  } catch (error) {
    console.error("Failed to check and send spending alerts:", error);
  }
}


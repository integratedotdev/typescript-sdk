import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, admin } from "better-auth/plugins";
import { apiKey } from "@better-auth/api-key";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { db } from "./db";
import {
  apiKey as apiKeyTable,
  session as sessionTable,
  user as userTable,
  organization as organizationTable,
  account as accountTable,
  verification as verificationTable,
  member as memberTable,
  invitation as invitationTable,
} from "./db/schema/auth";
import { usageRecords, organizationUsage, userOnboarding } from "./db/schema/organization";
import { userBillingSettings } from "./db/schema/settings";
import { sendEmail } from "./resend";
import { OrganizationInviteEmail } from "./email-templates/organization-invite";
import { PasswordResetEmail } from "./email-templates/password-reset";
import { EmailVerificationEmail } from "./email-templates/email-verification";
import { createElement } from "react";
import { AUTH_BASE_PATH, getAuthBaseURL } from "./auth-config";

// Initialize Polar client
const polarAccessToken = process.env.POLAR_ACCESS_TOKEN || "";
const polarServer = process.env.POLAR_SERVER === "production" ? "production" : "sandbox";
const polarStarterProductId = process.env.POLAR_STARTER_PRODUCT_ID || "";
const polarScaleProductId = process.env.POLAR_SCALE_PRODUCT_ID || "";

// Validate Polar configuration
if (!polarAccessToken) {
  console.warn("[Polar] WARNING: POLAR_ACCESS_TOKEN is not set");
}
if (!polarStarterProductId) {
  console.warn("[Polar] WARNING: POLAR_STARTER_PRODUCT_ID is not set");
}
if (!polarScaleProductId) {
  console.warn("[Polar] WARNING: POLAR_SCALE_PRODUCT_ID is not set");
}

console.log("[Polar] Configuration:", {
  server: polarServer,
  hasAccessToken: !!polarAccessToken,
  accessTokenLength: polarAccessToken.length,
  hasStarterProductId: !!polarStarterProductId,
  hasScaleProductId: !!polarScaleProductId,
});

const polarClient = new Polar({
  accessToken: polarAccessToken,
  server: polarServer,
});

export const auth = betterAuth({
  baseURL: getAuthBaseURL(),
  basePath: AUTH_BASE_PATH,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      // Better Auth core tables
      user: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable,
      // Organization plugin tables
      organization: organizationTable,
      member: memberTable,
      invitation: invitationTable,
      // API Key plugin tables
      apikey: apiKeyTable,
      // Custom app tables
      usageRecords,
      organizationUsage,
      userOnboarding,
      userBillingSettings,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url }: { user: any; url: string }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password - integrate.dev",
        react: createElement(PasswordResetEmail, {
          recipientName: user.name || user.email,
          resetUrl: url,
        }),
      });
    },
    onPasswordReset: async ({ user }: { user: any }) => {
      console.log(`Password for user ${user.email} has been reset.`);
      // You could send a confirmation email here
    },
  },
  emailVerification: {
    enabled: true,
    sendVerificationEmail: async ({ user, url }: { user: any; url: string }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address - integrate.dev",
        react: createElement(EmailVerificationEmail, {
          recipientName: user.name || user.email,
          verificationUrl: url,
        }),
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (session will be updated if it's older than this)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes - session is cached in a signed cookie to avoid DB calls
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    organization({
      // Called after an invitation is created
      sendInvitationEmail: async ({ email, organization, inviter, invitation }) => {
        const inviteLink = `${process.env.INTEGRATE_URL}/dashboard/accept-invitation?invitationId=${invitation.id}`;
        const recipientName = inviter.user.name ?? inviter.user.email;
        const inviterName = inviter.user.name ?? inviter.user.email;
        const role = invitation.role || "member";

        await sendEmail({
          to: email,
          subject: `You've been invited to join ${organization.name}`,
          react: createElement(OrganizationInviteEmail, {
            recipientName,
            organizationName: organization.name,
            inviterName,
            inviteUrl: inviteLink,
            role,
          }),
        });
      },
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      creatorRole: "owner",
      membershipLimit: 100,
    }),
    admin({
      impersonationSessionDuration: 60 * 60, // 1 hour
    }),
    apiKey(),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true, // Let Polar plugin handle customer creation automatically
      use: [
        checkout({
          products: [
            {
              productId: polarStarterProductId,
              slug: "starter",
            },
            {
              productId: polarScaleProductId,
              slug: "scale",
            },
          ],
          successUrl: "/dashboard/onboarding?step=3&from=polar",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET || "",
          onOrderPaid: async (payload) => {
            console.log("Order paid:", payload);
            // Handle successful payment
          },
          onCustomerStateChanged: async (payload) => {
            console.log("Customer state changed:", payload);
            // Update customer state in your database
          },
        }),
      ],
    }),
  ],
  databaseHooks: {
    session: {
      create: {
        before: async (session: Record<string, any>) => {
          // Auto-set active organization if user has organizations but no active one
          if (!session.activeOrganizationId && session.userId) {
            try {
              // Find the user's first organization membership
              const membership = await db.query.member.findFirst({
                where: (members, { eq }) => eq(members.userId, session.userId),
                orderBy: (members, { asc }) => [asc(members.createdAt)],
              });

              if (membership?.organizationId) {
                return {
                  data: {
                    ...session,
                    activeOrganizationId: membership.organizationId,
                  },
                };
              }
            } catch (error) {
              console.error("[Auth] Failed to auto-set active organization:", error);
            }
          }
          return { data: session };
        },
      },
    },
    user: {
      create: {
        before: async (user: Record<string, any>) => {
          // Ensure timestamp fields are properly handled
          const now = new Date();

          // Helper to convert timestamp fields to Date or null
          const cleanTimestamp = (value: any): Date | null => {
            if (!value) return null;
            if (value instanceof Date) return value;
            if (typeof value === "string") {
              const parsed = new Date(value);
              return isNaN(parsed.getTime()) ? null : parsed;
            }
            if (typeof value === "number") {
              const parsed = new Date(value);
              return isNaN(parsed.getTime()) ? null : parsed;
            }
            // If it's a boolean or other invalid type, return null
            return null;
          };

          // Build clean object with only valid fields
          // DO NOT spread the entire user object to avoid unexpected fields
          const cleaned: any = {
            name: user.name,
            email: user.email,
            createdAt: now,
            updatedAt: now,
          };

          // Add optional string/text fields if present
          if (user.image) cleaned.image = user.image;
          if (user.role) cleaned.role = user.role;
          if (user.banReason) cleaned.banReason = user.banReason;

          // Add boolean fields with proper defaults
          cleaned.banned = user.banned === true;
          cleaned.emailVerified = user.emailVerified === true;

          // Handle timestamp fields - must be Date or null
          const banExpires = cleanTimestamp(user.banExpires);
          if (banExpires) {
            cleaned.banExpires = banExpires;
          }

          // Polar plugin will handle customer creation automatically
          return cleaned;
        },
      },
    },
    apiKey: {
      create: {
        before: async (apiKey: Record<string, any>) => {
          // Ensure custom fields have proper defaults and timestamps
          const now = new Date();

          // Helper to convert timestamp fields to Date or remove them entirely
          const cleanTimestamp = (value: any): Date | undefined => {
            if (!value) return undefined;
            if (value instanceof Date) return value;
            // If it's not a Date and not falsy, it's invalid - return undefined
            return undefined;
          };

          // Build clean object, only including valid timestamp fields
          const cleaned: any = {
            ...apiKey,
            environment: apiKey.environment || "dev",
            requestCount: apiKey.requestCount ?? 0,
            rateLimitEnabled: apiKey.rateLimitEnabled ?? false,
            createdAt: now,
            updatedAt: now,
          };

          // Only add optional timestamp fields if they have valid values
          const expiresAt = cleanTimestamp(apiKey.expiresAt);
          if (expiresAt) cleaned.expiresAt = expiresAt;

          const rateLimitTimeWindow = cleanTimestamp(apiKey.rateLimitTimeWindow);
          if (rateLimitTimeWindow) cleaned.rateLimitTimeWindow = rateLimitTimeWindow;

          const lastRequest = cleanTimestamp(apiKey.lastRequest);
          if (lastRequest) cleaned.lastRequest = lastRequest;

          const lastRefillAt = cleanTimestamp(apiKey.lastRefillAt);
          if (lastRefillAt) cleaned.lastRefillAt = lastRefillAt;

          return cleaned;
        },
      },
    },
  },
  advanced: {
    cookiePrefix: "integrate",
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});

export type Session = typeof auth.$Infer.Session;


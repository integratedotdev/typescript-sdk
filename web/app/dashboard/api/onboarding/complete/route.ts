import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userOnboarding, userBillingSettings } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const headerList = request.headers;
    const session = await auth.api.getSession({
      headers: headerList,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { 
      organizationName, 
      companyName, 
      useCase, 
      teamSize,
      plan,
      spendingCap,
      alerts 
    } = data;

    // Check if organization already exists (created during Polar checkout flow)
    let organization = null;
    try {
      const organizations = await auth.api.listOrganizations({
        headers: headerList,
      });
      
      // If user already has an organization, use it
      if (organizations && organizations.length > 0) {
        organization = organizations[0];
        
        // Set it as active if not already
        await auth.api.setActiveOrganization({
          body: {
            organizationId: organization.id,
          },
          headers: headerList,
        });
      } else {
        // Create organization if it doesn't exist (fallback/error recovery)
        organization = await auth.api.createOrganization({
          body: {
            name: organizationName || companyName || "My Organization",
            slug: (organizationName || companyName || "my-org")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, ""),
          },
          headers: headerList,
        });

        // Set the newly created organization as active
        if (organization) {
          await auth.api.setActiveOrganization({
            body: {
              organizationId: organization.id,
            },
            headers: headerList,
          });
        }
      }
    } catch (orgError) {
      console.error("Organization handling error:", orgError);
      // Continue anyway, as we can still save onboarding data
    }

    // Save onboarding data with pricing information
    await db
      .insert(userOnboarding)
      .values({
        userId: session.user.id,
        hasCompletedOnboarding: true,
        onboardingStep: 4,
        companyName: companyName || organizationName,
        useCase,
        teamSize,
        completedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userOnboarding.userId,
        set: {
          hasCompletedOnboarding: true,
          onboardingStep: 4,
          companyName: companyName || organizationName,
          useCase,
          teamSize,
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      });

    // Save pricing configuration to user's account (account-level, not org-level)
    // Initialize notification emails with user's email by default
    const notificationEmails = {
      [session.user.email]: true,
    };

    await db
      .insert(userBillingSettings)
      .values({
        userId: session.user.id,
        plan: plan || "starter",
        spendingCap: spendingCap ? parseInt(spendingCap) * 100 : null, // Convert dollars to cents
        alert50Enabled: alerts?.alert50 ?? true,
        alert75Enabled: alerts?.alert75 ?? true,
        alert100Enabled: alerts?.alert100 ?? true,
        notificationEmails,
        hasPaymentMethod: false, // Will be updated when actual payment method is added
      })
      .onConflictDoUpdate({
        target: userBillingSettings.userId,
        set: {
          plan: plan || "starter",
          spendingCap: spendingCap ? parseInt(spendingCap) * 100 : null,
          alert50Enabled: alerts?.alert50 ?? true,
          alert75Enabled: alerts?.alert75 ?? true,
          alert100Enabled: alerts?.alert100 ?? true,
          // Only update notification emails if they don't exist yet
          notificationEmails,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error: unknown) {
    console.error("Onboarding error:", error);
    const message = error instanceof Error ? error.message : "Failed to complete onboarding";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userOnboarding } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check onboarding status
    const onboarding = await db
      .select()
      .from(userOnboarding)
      .where(eq(userOnboarding.userId, session.user.id))
      .limit(1);

    const hasCompletedOnboarding = onboarding[0]?.hasCompletedOnboarding ?? false;

    return NextResponse.json({
      hasCompletedOnboarding,
      onboardingStep: onboarding[0]?.onboardingStep ?? 0,
    });
  } catch (error: unknown) {
    console.error("Failed to check onboarding status:", error);
    const message = error instanceof Error ? error.message : "Failed to check onboarding status";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}


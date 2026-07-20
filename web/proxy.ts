import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "./lib/auth";
import { db } from "./lib/db";
import { userOnboarding, member } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const publicPaths = [
  "/dashboard/login",
  "/dashboard/signup",
  "/dashboard/forgot-password",
  "/dashboard/reset-password",
  "/dashboard/accept-invitation",
  "/dashboard/api/auth",
  "/dashboard/api/integrate",
  "/dashboard/api/validate-key",
  "/dashboard/api/usage",
];
const authPaths = ["/dashboard/login", "/dashboard/signup"];

const protectedAppPaths = [
  "/dashboard/home",
  "/dashboard/account",
  "/dashboard/settings",
  "/dashboard/usage",
  "/dashboard/test",
  "/dashboard/chat",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Marketing, docs, and public assets — no auth
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  if (pathname === "/dashboard") {
    return NextResponse.next();
  }

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    if (authPaths.some((path) => pathname === path)) {
      const { data: session } = await betterFetch<Session>(
        "/dashboard/api/auth/get-session",
        {
          baseURL: request.nextUrl.origin,
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        },
      );

      if (session) {
        try {
          const onboarding = await db
            .select()
            .from(userOnboarding)
            .where(eq(userOnboarding.userId, session.user.id))
            .limit(1);

          const hasCompletedOnboarding =
            onboarding[0]?.hasCompletedOnboarding ?? false;

          if (!hasCompletedOnboarding) {
            const memberships = await db
              .select()
              .from(member)
              .where(eq(member.userId, session.user.id))
              .limit(1);

            if (memberships.length > 0) {
              return NextResponse.redirect(
                new URL("/dashboard/home", request.url),
              );
            }

            return NextResponse.redirect(
              new URL("/dashboard/onboarding", request.url),
            );
          }
        } catch (error) {
          console.error("Failed to check onboarding status:", error);
        }

        return NextResponse.redirect(new URL("/dashboard/home", request.url));
      }
    }
    return NextResponse.next();
  }

  const { data: session } = await betterFetch<Session>(
    "/dashboard/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  if (!session) {
    const loginUrl = new URL("/dashboard/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    protectedAppPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    ) &&
    !pathname.startsWith("/dashboard/onboarding")
  ) {
    try {
      const onboarding = await db
        .select()
        .from(userOnboarding)
        .where(eq(userOnboarding.userId, session.user.id))
        .limit(1);

      const hasCompletedOnboarding =
        onboarding[0]?.hasCompletedOnboarding ?? false;

      if (!hasCompletedOnboarding) {
        const memberships = await db
          .select()
          .from(member)
          .where(eq(member.userId, session.user.id))
          .limit(1);

        const isInvitedUser = memberships.length > 0;

        if (isInvitedUser) {
          return NextResponse.next();
        }

        if (
          pathname.startsWith("/dashboard/test") ||
          pathname.startsWith("/dashboard/chat")
        ) {
          const isAdmin = session.user.role?.includes("admin");
          if (isAdmin) {
            return NextResponse.next();
          }
        }

        return NextResponse.redirect(
          new URL("/dashboard/onboarding", request.url),
        );
      }
    } catch (error) {
      console.error("[Proxy] Failed to check onboarding status:", error);

      try {
        const memberships = await db
          .select()
          .from(member)
          .where(eq(member.userId, session.user.id))
          .limit(1);

        if (memberships.length > 0) {
          return NextResponse.next();
        }
      } catch (memberError) {
        console.error("[Proxy] Failed to check membership:", memberError);
      }

      return NextResponse.redirect(
        new URL("/dashboard/onboarding", request.url),
      );
    }
  }

  if (
    pathname.startsWith("/dashboard/test") ||
    pathname.startsWith("/dashboard/chat")
  ) {
    const isAdmin = session.user.role?.includes("admin");
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

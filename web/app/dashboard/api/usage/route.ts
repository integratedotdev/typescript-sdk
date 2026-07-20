import { NextResponse } from "next/server";
import { trackUsage } from "@/lib/db/queries";

export async function POST(request: Request) {
  const startTime = Date.now();
  console.log("[Usage API] POST /api/usage - Request received");

  try {
    const authHeader = request.headers.get("authorization");
    const mcpSecret = process.env.MCP_SERVER_SECRET;

    console.log("[Usage API] Auth check:", {
      hasAuthHeader: !!authHeader,
      authHeaderPrefix: authHeader?.substring(0, 20) + "...",
      hasMcpSecret: !!mcpSecret,
    });

    if (!mcpSecret) {
      console.error("[Usage API] ERROR: MCP_SERVER_SECRET is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("[Usage API] WARNING: Missing or invalid authorization header");
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const providedSecret = authHeader.substring(7);
    const secretMatch = providedSecret === mcpSecret;
    console.log("[Usage API] Secret validation:", {
      secretMatch,
      providedSecretLength: providedSecret.length,
      expectedSecretLength: mcpSecret.length,
    });

    if (!secretMatch) {
      console.warn("[Usage API] WARNING: Invalid authentication credentials");
      return NextResponse.json(
        { error: "Invalid authentication credentials" },
        { status: 401 }
      );
    }

    console.log("[Usage API] Parsing request body...");
    const body = await request.json();
    console.log("[Usage API] Request body received:", {
      userId: body.userId,
      endpoint: body.endpoint,
      method: body.method,
      statusCode: body.statusCode,
      responseTime: body.responseTime,
      organizationId: body.organizationId || null,
      apiKeyId: body.apiKeyId || null,
      requestSize: body.requestSize || null,
      responseSize: body.responseSize || null,
      hasMetadata: !!body.metadata,
      fullBody: JSON.stringify(body, null, 2),
    });

    const {
      userId,
      endpoint,
      method,
      statusCode,
      responseTime,
      organizationId,
      apiKeyId,
      requestSize,
      responseSize,
      metadata,
    } = body;

    const missingFields = [];
    if (!userId) missingFields.push("userId");
    if (!endpoint) missingFields.push("endpoint");
    if (!method) missingFields.push("method");
    if (statusCode === undefined) missingFields.push("statusCode");
    if (responseTime === undefined) missingFields.push("responseTime");

    if (missingFields.length > 0) {
      console.warn("[Usage API] WARNING: Missing required fields:", missingFields);
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["userId", "endpoint", "method", "statusCode", "responseTime"],
          missing: missingFields,
        },
        { status: 400 }
      );
    }

    const typeErrors = [];
    if (typeof userId !== "string") typeErrors.push("userId must be string");
    if (typeof endpoint !== "string") typeErrors.push("endpoint must be string");
    if (typeof method !== "string") typeErrors.push("method must be string");
    if (typeof statusCode !== "number") typeErrors.push("statusCode must be number");
    if (typeof responseTime !== "number") typeErrors.push("responseTime must be number");

    if (typeErrors.length > 0) {
      console.warn("[Usage API] WARNING: Invalid field types:", typeErrors);
      return NextResponse.json(
        {
          error: "Invalid field types",
          errors: typeErrors,
        },
        { status: 400 }
      );
    }

    console.log("[Usage API] Validation passed. Calling trackUsage with:", {
      userId,
      endpoint,
      method,
      statusCode,
      responseTime,
      organizationId: organizationId || null,
      apiKeyId: apiKeyId || null,
      requestSize: requestSize || null,
      responseSize: responseSize || null,
      hasMetadata: !!metadata,
    });

    const trackStartTime = Date.now();
    await trackUsage({
      userId,
      endpoint,
      method,
      statusCode,
      responseTime,
      organizationId,
      apiKeyId,
      requestSize,
      responseSize,
      metadata,
    });
    const trackDuration = Date.now() - trackStartTime;

    try {
      const { Polar } = await import("@polar-sh/sdk");
      const polarClient = new Polar({
        accessToken: process.env.POLAR_ACCESS_TOKEN || "",
        server: (process.env.POLAR_SERVER === "production" ? "production" : "sandbox") as
          | "production"
          | "sandbox",
      });

      const eventName = process.env.POLAR_USAGE_EVENT_NAME || "api_request";

      await polarClient.events.ingest({
        events: [
          {
            name: eventName,
            externalCustomerId: userId,
            metadata: {
              endpoint,
              method,
              statusCode: String(statusCode),
              ...(organizationId && { organizationId }),
            },
          },
        ],
      });

      console.log(`[Usage API] Polar event ingested for user ${userId}`);
    } catch (polarError) {
      console.error(
        "[Usage API] Failed to ingest Polar event:",
        polarError instanceof Error ? polarError.message : String(polarError)
      );
    }

    const totalDuration = Date.now() - startTime;
    console.log("[Usage API] ✅ Usage tracked successfully", {
      trackDuration: `${trackDuration}ms`,
      totalDuration: `${totalDuration}ms`,
      userId,
      endpoint,
      method,
      statusCode,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Usage tracked successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const totalDuration = Date.now() - startTime;
    console.error("[Usage API] ❌ Usage tracking error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${totalDuration}ms`,
    });
    const message = error instanceof Error ? error.message : "Failed to track usage";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

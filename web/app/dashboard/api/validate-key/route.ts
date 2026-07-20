import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKey as apiKeySchema } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";

// POST - Validate API key
export async function POST(request: Request) {
  try {
    // 1. Authenticate the MCP server using bearer token
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bearerToken = authHeader.substring(7); // Remove "Bearer " prefix
    const mcpServerSecret = process.env.MCP_SERVER_SECRET;

    if (!mcpServerSecret || bearerToken !== mcpServerSecret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Extract API key from request body
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "apiKey is required in request body" },
        { status: 400 }
      );
    }

    // 3. Validate the API key ourselves (Better Auth has timestamp issues)
    // Hash the incoming key
    const crypto = await import('crypto');
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    // Look up the key in the database
    const fullKey = await db
      .select({
        id: apiKeySchema.id,
        userId: apiKeySchema.userId,
        organizationId: apiKeySchema.organizationId,
        name: apiKeySchema.name,
        environment: apiKeySchema.environment,
        enabled: apiKeySchema.enabled,
        expiresAt: apiKeySchema.expiresAt,
      })
      .from(apiKeySchema)
      .where(eq(apiKeySchema.key, hashedKey))
      .limit(1);

    // 4. Return validation result
    if (fullKey.length === 0) {
      return NextResponse.json({
        valid: false,
        error: {
          message: "Invalid API key",
          code: "INVALID_KEY",
        },
      });
    }

    const key = fullKey[0];

    // Check if key is enabled
    if (!key.enabled) {
      return NextResponse.json({
        valid: false,
        error: {
          message: "API key is disabled",
          code: "KEY_DISABLED",
        },
      });
    }

    // Check if key is expired
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
      return NextResponse.json({
        valid: false,
        error: {
          message: "API key has expired",
          code: "KEY_EXPIRED",
        },
      });
    }

    // Return successful validation with customerId (userId) and organizationId as expected by MCP server
    return NextResponse.json({
      customerId: key.userId,
      organizationId: key.organizationId,
      valid: true,
    });
  } catch (error: unknown) {
    console.error("Error validating API key:", error);
    const message = error instanceof Error ? error.message : "Failed to validate API key";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}


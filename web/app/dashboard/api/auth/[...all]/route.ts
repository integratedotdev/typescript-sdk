import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth.handler);

// Wrap handlers to transform error messages
async function handleRequest(
  request: NextRequest,
  method: "GET" | "POST"
): Promise<Response> {
  try {
    // Log headers for usage meters endpoint to verify cookies are being sent
    if (request.nextUrl.pathname.includes('/usage/meters')) {
      const cookieHeader = request.headers.get('cookie');
      const allHeaders = Object.fromEntries(request.headers.entries());
      
      console.log('[Better Auth] Usage Meters Request:', {
        pathname: request.nextUrl.pathname,
        method,
        hasCookie: !!cookieHeader,
        cookieLength: cookieHeader?.length || 0,
        cookiePreview: cookieHeader ? cookieHeader.substring(0, 50) + '...' : null,
        headerKeys: Object.keys(allHeaders),
        userAgent: request.headers.get('user-agent'),
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
      });
    }
    
    const response = await handler[method](request);
    
    // Log response for usage meters endpoint
    if (request.nextUrl.pathname.includes('/usage/meters')) {
      const responseClone = response.clone();
      try {
        const responseData = await responseClone.json();
        console.log('[Better Auth] Usage Meters Response:', {
          status: response.status,
          statusText: response.statusText,
          hasData: !!responseData,
          dataKeys: responseData && typeof responseData === 'object' ? Object.keys(responseData) : null,
          error: responseData?.error,
        });
      } catch (e) {
        console.log('[Better Auth] Usage Meters Response:', {
          status: response.status,
          statusText: response.statusText,
          note: 'Could not parse response body',
        });
      }
    }
    
    // If it's an error response, check if we need to transform the error message
    if (!response.ok) {
      try {
        const data = await response.clone().json();
        
        // Log Polar checkout errors for debugging
        if (
          request.nextUrl.pathname.includes('/checkout') ||
          data?.error?.code === "CHECKOUT_CREATION_FAILED" ||
          data?.error?.message?.includes("checkout") ||
          data?.error?.message?.includes("Checkout")
        ) {
          console.error("[Polar Checkout Error]:", {
            pathname: request.nextUrl.pathname,
            method,
            error: data?.error,
            fullResponse: data,
            envCheck: {
              hasAccessToken: !!process.env.POLAR_ACCESS_TOKEN,
              accessTokenLength: process.env.POLAR_ACCESS_TOKEN?.length || 0,
              server: process.env.POLAR_SERVER,
              hasStarterProductId: !!process.env.POLAR_STARTER_PRODUCT_ID,
              hasScaleProductId: !!process.env.POLAR_SCALE_PRODUCT_ID,
              starterProductId: process.env.POLAR_STARTER_PRODUCT_ID?.substring(0, 10) + "...",
              scaleProductId: process.env.POLAR_SCALE_PRODUCT_ID?.substring(0, 10) + "...",
            },
          });
        }
        
        // Check if it's a Polar customer creation error
        if (
          data?.error?.message?.includes("Polar customer creation failed") ||
          data?.error?.message?.includes("customer with this email address already exists") ||
          JSON.stringify(data).toLowerCase().includes("customer with this email address already exists")
        ) {
          return NextResponse.json(
            {
              error: {
                message: "An account with this email already exists. Please sign in instead.",
                code: "EMAIL_ALREADY_EXISTS",
              },
            },
            { status: 400 } // Change from 500 to 400 (Bad Request)
          );
        }
        
        // Check for other duplicate email errors
        if (
          data?.error?.message?.toLowerCase().includes("already exists") ||
          data?.error?.message?.toLowerCase().includes("unique constraint") ||
          data?.error?.message?.toLowerCase().includes("duplicate")
        ) {
          return NextResponse.json(
            {
              error: {
                message: "An account with this email already exists. Please sign in instead.",
                code: "EMAIL_ALREADY_EXISTS",
              },
            },
            { status: 400 }
          );
        }
      } catch {
        // If we can't parse the response, return it as-is
      }
    }
    
    return response;
  } catch (error: unknown) {
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorString = JSON.stringify(error);
    
    // Check if it's a duplicate email error
    if (
      errorMessage.toLowerCase().includes("customer with this email address already exists") ||
      errorString.toLowerCase().includes("customer with this email address already exists") ||
      errorMessage.toLowerCase().includes("already exists")
    ) {
      return NextResponse.json(
        {
          error: {
            message: "An account with this email already exists. Please sign in instead.",
            code: "EMAIL_ALREADY_EXISTS",
          },
        },
        { status: 400 }
      );
    }
    
    // Re-throw other errors
    throw error;
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return handleRequest(request, "POST");
}

// export const runtime = "nodejs";


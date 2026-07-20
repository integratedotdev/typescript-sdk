import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { serverClient } from '@/lib/integrate';

/**
 * POST /api/integrations/disconnect
 * 
 * Disconnect an OAuth provider using server-side SDK
 * This ensures database callbacks (removeProviderToken) are called
 */
export async function POST(request: Request) {
  const startTime = Date.now();
  console.log('[Disconnect API] ========== DISCONNECT REQUEST START ==========');
  console.log('[Disconnect API] Timestamp:', new Date().toISOString());
  
  try {
    // Step 1: Get request headers
    const requestHeaders = request.headers;
    console.log('[Disconnect API] Step 1: Headers received:', {
      hasHeaders: !!requestHeaders,
      contentType: requestHeaders.get('content-type'),
      authorization: requestHeaders.get('authorization') ? 'PRESENT' : 'MISSING',
    });

    // Step 2: Get session
    console.log('[Disconnect API] Step 2: Getting session...');
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });
    console.log('[Disconnect API] Step 2: Session retrieved:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      sessionKeys: session ? Object.keys(session) : [],
    });

    if (!session?.user) {
      console.error('[Disconnect API] Step 2: No session or user found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Step 3: Parse request body
    console.log('[Disconnect API] Step 3: Parsing request body...');
    let body;
    try {
      body = await request.json();
      console.log('[Disconnect API] Step 3: Request body parsed:', {
        body,
        hasProvider: !!body?.provider,
        provider: body?.provider,
      });
    } catch (parseError: any) {
      console.error('[Disconnect API] Step 3: Failed to parse request body:', {
        error: parseError.message,
        errorStack: parseError.stack,
      });
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { provider } = body;

    // Step 4: Validate provider
    console.log('[Disconnect API] Step 4: Validating provider...');
    const validProviders = ['github', 'gmail', 'notion'];
    console.log('[Disconnect API] Step 4: Provider validation:', {
      provider,
      isValid: provider && validProviders.includes(provider),
      validProviders,
    });

    if (!provider || !validProviders.includes(provider)) {
      console.error('[Disconnect API] Step 4: Invalid provider');
      return NextResponse.json(
        { error: `Invalid provider. Must be one of: ${validProviders.join(', ')}` },
        { status: 400 }
      );
    }

    // Step 5: Extract context
    const userId = session.user.id;
    const organizationId = (session as any)?.session?.activeOrganizationId;
    console.log('[Disconnect API] Step 5: Context extracted:', {
      userId,
      organizationId,
      hasOrganizationId: !!organizationId,
    });

    // Step 6: Check if token exists before disconnecting (for verification)
    console.log('[Disconnect API] Step 6: Checking if token exists in database...');
    const { getUserOAuthTokens } = await import('@/lib/integrate');
    const existingTokens = await getUserOAuthTokens(userId, provider);
    console.log('[Disconnect API] Step 6: Token check result:', {
      hasTokens: !!existingTokens,
      hasAccessToken: !!existingTokens?.accessToken,
      hasRefreshToken: !!existingTokens?.refreshToken,
      expiresAt: existingTokens?.expiresAt?.toISOString(),
    });

    // Step 7: Call server-side disconnect with context
    console.log('[Disconnect API] Step 7: Calling serverClient.disconnectProvider with context...');
    console.log('[Disconnect API] Step 7: Disconnect parameters:', {
      provider,
      context: { userId, organizationId },
      serverClientType: typeof serverClient,
      hasDisconnectMethod: typeof serverClient.disconnectProvider === 'function',
    });

    try {
      await serverClient.disconnectProvider(provider, { userId, organizationId });
      console.log('[Disconnect API] Step 7: serverClient.disconnectProvider completed successfully');
    } catch (disconnectError: any) {
      console.error('[Disconnect API] Step 7: Error in serverClient.disconnectProvider:', {
        error: disconnectError.message,
        errorStack: disconnectError.stack,
        errorName: disconnectError.name,
        errorObject: disconnectError,
      });
      throw disconnectError;
    }

    // Step 8: Verify token was removed
    console.log('[Disconnect API] Step 8: Verifying token was removed...');
    const tokensAfterDisconnect = await getUserOAuthTokens(userId, provider);
    console.log('[Disconnect API] Step 8: Token verification result:', {
      hasTokens: !!tokensAfterDisconnect,
      hasAccessToken: !!tokensAfterDisconnect?.accessToken,
      wasRemoved: !tokensAfterDisconnect?.accessToken,
    });

    const duration = Date.now() - startTime;
    console.log('[Disconnect API] ========== DISCONNECT REQUEST SUCCESS ==========');
    console.log('[Disconnect API] Duration:', `${duration}ms`);
    console.log('[Disconnect API] Provider:', provider);
    console.log('[Disconnect API] UserId:', userId);

    return NextResponse.json({
      success: true,
      provider,
      message: `${provider} disconnected successfully`,
      debug: {
        duration: `${duration}ms`,
        hadTokenBefore: !!existingTokens?.accessToken,
        hasTokenAfter: !!tokensAfterDisconnect?.accessToken,
        tokenRemoved: !tokensAfterDisconnect?.accessToken,
      }
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('[Disconnect API] ========== DISCONNECT REQUEST ERROR ==========');
    console.error('[Disconnect API] Duration:', `${duration}ms`);
    console.error('[Disconnect API] Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      errorObject: error,
    });
    return NextResponse.json(
      { 
        error: error.message || 'Failed to disconnect provider',
        debug: {
          duration: `${duration}ms`,
          errorName: error.name,
        }
      },
      { status: 500 }
    );
  }
}


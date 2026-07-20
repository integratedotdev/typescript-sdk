import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { serverClient } from '@/lib/integrate';

/**
 * POST /api/integrations/disconnect-all
 * 
 * Disconnect all OAuth providers using server-side SDK
 * This ensures database callbacks (removeProviderToken) are called for all providers
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const organizationId = (session as any)?.session?.activeOrganizationId;

    console.log('[Disconnect All API] Disconnecting all providers:', {
      userId,
      organizationId,
    });

    const providers = ['github', 'gmail', 'notion'] as const;
    const context = { userId, organizationId };

    // Disconnect all providers using server-side SDK with context
    const results = await Promise.allSettled(
      providers.map(async (provider) => {
        console.log(`[Disconnect All API] Disconnecting ${provider}...`);
        
        try {
          await serverClient.disconnectProvider(provider, context);
          console.log(`[Disconnect All API] ${provider} disconnected successfully`);
          return provider;
        } catch (error: any) {
          console.error(`[Disconnect All API] Failed to disconnect ${provider}:`, error);
          throw error;
        }
      })
    );

    const disconnected: string[] = [];
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        disconnected.push(providers[index]);
        console.log(`[Disconnect All API] ${providers[index]} disconnected successfully`);
      } else {
        errors.push(`${providers[index]}: ${result.reason?.message || 'Unknown error'}`);
        console.error(`[Disconnect All API] Failed to disconnect ${providers[index]}:`, result.reason);
      }
    });

    console.log('[Disconnect All API] Disconnect all completed:', {
      disconnected,
      errors,
    });

    return NextResponse.json({
      success: true,
      disconnected,
      errors: errors.length > 0 ? errors : undefined,
      message: `Disconnected ${disconnected.length} provider(s)`,
    });
  } catch (error: any) {
    console.error('[Disconnect All API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to disconnect all providers' },
      { status: 500 }
    );
  }
}


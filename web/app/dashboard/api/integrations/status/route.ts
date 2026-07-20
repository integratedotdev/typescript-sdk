import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserOAuthTokens } from '@/lib/integrate';

/**
 * GET /api/integrations/status
 * 
 * Check which OAuth providers the current user has connected
 * Checks database directly for tokens instead of relying on SDK's internal authState cache
 * This ensures accurate status immediately after OAuth connection without needing an API call first
 */
export async function GET(request: Request) {
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
    const organizationId = (
      session as { session?: { activeOrganizationId?: string } }
    ).session?.activeOrganizationId;

    // Check authorization status by querying database directly for tokens
    // This is more reliable than isAuthorized() which relies on in-memory cache
    const [githubTokens, gmailTokens, notionTokens] = await Promise.all([
      getUserOAuthTokens(userId, 'github'),
      getUserOAuthTokens(userId, 'gmail'),
      getUserOAuthTokens(userId, 'notion'),
    ]);

    const githubAuthorized = !!(githubTokens?.accessToken);
    const gmailAuthorized = !!(gmailTokens?.accessToken);
    const notionAuthorized = !!(notionTokens?.accessToken);

    console.log('[Integration Status] Authorization check:', {
      userId,
      organizationId,
      github: {
        authorized: githubAuthorized,
        hasToken: !!githubTokens,
        hasAccessToken: !!githubTokens?.accessToken,
      },
      gmail: {
        authorized: gmailAuthorized,
        hasToken: !!gmailTokens,
        hasAccessToken: !!gmailTokens?.accessToken,
      },
      notion: {
        authorized: notionAuthorized,
        hasToken: !!notionTokens,
        hasAccessToken: !!notionTokens?.accessToken,
      },
    });

    return NextResponse.json({
      github: githubAuthorized,
      gmail: gmailAuthorized,
      notion: notionAuthorized,
      userId,
      debug: {
        envNotionId: process.env.NOTION_CLIENT_ID ? 'SET' : 'NOT_SET',
        envNotionSecret: process.env.NOTION_CLIENT_SECRET ? 'SET' : 'NOT_SET',
      }
    });
  } catch (error) {
    console.error('[Integration Status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check integration status' },
      { status: 500 }
    );
  }
}


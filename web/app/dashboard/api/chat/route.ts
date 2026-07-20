import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai';
import { getVercelAITools } from 'integrate-sdk/server';
import { serverClient } from '@/lib/integrate';
import { auth } from '@/lib/auth';

export const maxDuration = 30;

export async function POST(req: Request) {
  const requestBody = await req.json();
  const { messages }: { messages: UIMessage[] } = requestBody;

  // Get request headers - these contain the session cookie
  const requestHeaders = req.headers;

  // Get user session for authentication
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Get active organization for usage tracking
  const activeOrgId = (session as { session?: { activeOrganizationId?: string } }).session?.activeOrganizationId;

  // Log final usage tracking summary
  console.log('[API /chat] Usage tracking summary:', {
    userId: session.user.id,
    organizationId: activeOrgId,
    messageCount: messages.length,
    timestamp: new Date().toISOString(),
  });

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    // Enable multi-step tool calls (up to 5 steps)
    stopWhen: stepCountIs(5),
    // ✨ NEW: Pass context for user-specific token retrieval
    tools: await getVercelAITools(serverClient, {
      context: {
        userId: session.user.id,
        organizationId: activeOrgId,
      },
      connectedOnly: true,
      mode: 'code',
    }),
    onStepFinish: ({ toolResults, toolCalls }) => {
      // Log tool results and calls for debugging
      if (toolResults && toolResults.length > 0) {
        console.log('[API /chat] Tool results:', {
          count: toolResults.length,
          toolNames: toolResults.map((r: any) => r.toolName),
        });
      }
      if (toolCalls && toolCalls.length > 0) {
        console.log('[API /chat] Tool calls:', {
          count: toolCalls.length,
          toolNames: toolCalls.map((c: any) => c.toolName),
        });
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
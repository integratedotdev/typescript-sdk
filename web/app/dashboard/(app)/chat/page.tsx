'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bot, User } from 'lucide-react';

function ChatContent() {
  const [input, setInput] = useState('');
  const [githubAuthorized, setGithubAuthorized] = useState(false);
  const [gmailAuthorized, setGmailAuthorized] = useState(false);

  // Configure useChat hook - tokens are automatically injected by useIntegrateAI!
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === 'streaming';

  // Check auth status using server-side API
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/dashboard/api/integrations/status');
        if (response.ok) {
          const data = await response.json();
          setGithubAuthorized(data.github);
          setGmailAuthorized(data.gmail);
          console.log('[Chat] Integration status:', data);
        }
      } catch (err) {
        console.error('[Chat] Failed to check auth status:', err);
      }
    };
    checkAuthStatus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({ text: input });
    setInput('');
  };

  const connectedServices = [
    githubAuthorized && 'GitHub',
    gmailAuthorized && 'Gmail',
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>AI Chat with Integrate SDK Tools</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>Chat with GPT-4o that has access to GitHub and Gmail tools via integrate-sdk</span>
              {connectedServices.length > 0 ? (
                <Badge variant="default">
                  Connected: {connectedServices.join(', ')}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  No accounts connected - Connect on test page first
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[500px] w-full pr-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-12">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation! Try asking about GitHub repos or sending emails.</p>
                    <div className="mt-4 text-sm space-y-2">
                      <p className="font-medium">Example prompts:</p>
                      <ul className="text-left max-w-md mx-auto space-y-1">
                        <li>• "List my GitHub repositories"</li>
                        <li>• "Send an email to test@example.com"</li>
                        <li>• "Create a new GitHub issue in my repo"</li>
                      </ul>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                          }`}
                      >
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>

                      <div className="space-y-2 flex-1">
                        {message.parts.map((part, i) => {
                          switch (part.type) {
                            case 'text':
                              return (
                                <div
                                  key={`${message.id}-${i}`}
                                  className={`rounded-lg px-4 py-2 ${message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                    }`}
                                >
                                  <p className="whitespace-pre-wrap break-words">
                                    {part.text}
                                  </p>
                                </div>
                              );

                            default:
                              // Handle tool calls
                              if (part.type.startsWith('tool-')) {
                                const toolName = part.type.replace('tool-', '');
                                return (
                                  <div
                                    key={`${message.id}-${i}`}
                                    className="border border-border rounded-lg p-3 bg-card"
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline">Tool Call</Badge>
                                      <span className="text-sm font-medium">
                                        {toolName}
                                      </span>
                                    </div>
                                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                                      {JSON.stringify(part, null, 2)}
                                    </pre>
                                  </div>
                                );
                              }
                              return null;
                          }
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg px-4 py-2 bg-muted flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Available Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>GitHub Tools</Badge>
              <Badge>Gmail Tools</Badge>
              <Badge>Multi-step Reasoning</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              The AI can use multiple tools in sequence to accomplish complex tasks
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading fallback component
function ChatLoading() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>AI Chat with Integrate SDK Tools</CardTitle>
            <CardDescription>
              Chat with GPT-4o that has access to GitHub and Gmail tools via integrate-sdk
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[500px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Wrap ChatContent in Suspense to handle useChat's Math.random() usage
// Next.js requires Suspense boundaries for components that use non-deterministic values
// Also ensures React is fully initialized before rendering ChatContent
export default function ChatPage() {
  // Ensure we're in browser before rendering
  if (typeof window === 'undefined') {
    return <ChatLoading />;
  }

  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatContent />
    </Suspense>
  );
}


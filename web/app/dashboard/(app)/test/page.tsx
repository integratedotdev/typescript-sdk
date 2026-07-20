"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { client } from "@/lib/integrate-client";
import { useSession } from "@/lib/auth-client";

interface TestResult {
  name: string;
  status: "pending" | "running" | "success" | "error";
  data?: any;
  error?: string;
  duration?: number;
}

interface AuthorizationStatus {
  github: boolean;
  gmail: boolean;
  notion: boolean;
  userId?: string;
  debug?: any;
}

interface Trigger {
  id: string;
  name?: string;
  toolName: string;
  toolArguments: any;
  schedule: {
    type: 'cron' | 'once';
    expression?: string;
    runAt?: string;
  };
  status: string;
  lastExecutedAt?: string;
  lastResult?: any;
  lastError?: string;
  lastDuration?: number;
  createdAt: string;
  updatedAt: string;
}

interface ToolMetadata {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

interface ConfiguredIntegration {
  id: string;
  name: string;
  tools: readonly string[];
  hasOAuth: boolean;
  scopes?: readonly string[];
  provider?: string;
  toolMetadata?: ToolMetadata[];
  logoUrl?: string;
}

export default function TestHarness() {
  // Check if user is logged in
  const { data: session, isPending: sessionLoading } = useSession();
  
  // ✨ Server-side authorization status
  const [authStatus, setAuthStatus] = useState<AuthorizationStatus>({
    github: false,
    gmail: false,
    notion: false,
  });
  const [authStatusLoading, setAuthStatusLoading] = useState(true);
  const [authStatusError, setAuthStatusError] = useState<string | null>(null);
  
  // Derive authorization status from server-side check
  const githubAuthorized = authStatus.github;
  const gmailAuthorized = authStatus.gmail;
  const notionAuthorized = authStatus.notion;
  
  // Fetch authorization status from server
  const fetchAuthStatus = async () => {
    console.log('[Test Harness] Fetching authorization status from server...');
    setAuthStatusLoading(true);
    setAuthStatusError(null);
    
    try {
      const response = await fetch('/dashboard/api/integrations/status');
      console.log('[Test Harness] Status API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[Test Harness] Status API error:', errorData);
        setAuthStatusError(errorData.error || 'Failed to fetch authorization status');
        setAuthStatusLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('[Test Harness] Authorization status received:', {
        github: data.github,
        gmail: data.gmail,
        notion: data.notion,
        userId: data.userId,
        debug: data.debug,
      });
      
      setAuthStatus({
        github: data.github || false,
        gmail: data.gmail || false,
        notion: data.notion || false,
        userId: data.userId,
        debug: data.debug,
      });
      console.log('[Test Harness] State updated - authStatus:', {
        github: data.github || false,
        gmail: data.gmail || false,
        notion: data.notion || false,
      });
    } catch (error: any) {
      console.error('[Test Harness] Error fetching authorization status:', error);
      setAuthStatusError(error.message || 'Failed to fetch authorization status');
    } finally {
      setAuthStatusLoading(false);
      console.log('[Test Harness] Authorization status fetch completed');
    }
  };
  
  // Fetch status on mount and when session changes
  useEffect(() => {
    console.log('[Test Harness] useEffect triggered - session:', {
      hasSession: !!session?.user,
      userId: session?.user?.id,
      sessionLoading,
    });
    
    if (session?.user && !sessionLoading) {
      fetchAuthStatus();
    } else if (!sessionLoading && !session?.user) {
      console.log('[Test Harness] No session, resetting auth status');
      setAuthStatus({ github: false, gmail: false, notion: false });
      setAuthStatusLoading(false);
    }
  }, [session?.user?.id, sessionLoading]);
  
  // OAuth state
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Test state
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Get Repository Info", status: "pending" },
    { name: "List Repository Issues", status: "pending" },
    { name: "Get User Info", status: "pending" },
    { name: "List User Repositories", status: "pending" },
    { name: "Search Notion", status: "pending" },
    { name: "Get Notion Page", status: "pending" },
    { name: "List All Tools", status: "pending" },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);

  // Triggers state
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [triggersLoading, setTriggersLoading] = useState(false);
  const [triggersError, setTriggersError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    toolName: '',
    toolArguments: '{}',
    scheduleType: 'cron' as 'cron' | 'once',
    cronExpression: '0 9 * * *',
    runAt: '',
  });

  // Configured integrations state
  const [configuredIntegrations, setConfiguredIntegrations] = useState<ConfiguredIntegration[]>([]);
  const [integrationsLoading, setIntegrationsLoading] = useState(false);
  const [integrationsError, setIntegrationsError] = useState<string | null>(null);
  const [expandedIntegration, setExpandedIntegration] = useState<string | null>(null);

  // Log authorization status changes
  useEffect(() => {
    console.log('[Test Harness] Authorization status changed:', {
      github: githubAuthorized,
      gmail: gmailAuthorized,
      notion: notionAuthorized,
      loading: authStatusLoading,
      error: authStatusError,
      userId: authStatus.userId,
    });
  }, [githubAuthorized, gmailAuthorized, notionAuthorized, authStatusLoading, authStatusError, authStatus.userId]);

  // Log connecting state changes
  useEffect(() => {
    console.log('[Test Harness] Connecting state changed:', {
      isConnecting,
      connectingProvider,
      authError,
    });
  }, [isConnecting, connectingProvider, authError]);

  // Log tests state changes
  useEffect(() => {
    console.log('[Test Harness] Tests state changed:', {
      testCount: tests.length,
      tests: tests.map(t => ({
        name: t.name,
        status: t.status,
        hasData: !!t.data,
        hasError: !!t.error,
        duration: t.duration,
      })),
      isRunning,
      selectedTestName: selectedTest?.name,
    });
  }, [tests, isRunning, selectedTest]);

  // ✨ OAuth connection functions - using modern SDK patterns
  const connectProvider = async (provider: 'github' | 'gmail' | 'notion') => {
    console.log('[Test Harness] connectProvider called:', {
      provider,
      hasSession: !!session?.user,
      userId: session?.user?.id,
    });
    
    // Check if user is logged in
    if (!session?.user) {
      console.warn('[Test Harness] connectProvider: No session, setting error');
      setAuthError('Please log in first before connecting OAuth providers');
      return;
    }

    console.log('[Test Harness] Setting connecting state:', { provider });
    setIsConnecting(true);
    setConnectingProvider(provider);
    setAuthError(null);

    try {
      console.log('[Test Harness] Calling client.authorize for:', provider);
      // SDK will handle OAuth flow and return to current page
      await client.authorize(provider, {
        returnUrl: '/dashboard/test'
      });
      console.log('[Test Harness] client.authorize completed for:', provider);
      
      // Refetch authorization status after successful connection
      console.log('[Test Harness] Refetching authorization status after connect');
      await fetchAuthStatus();
    } catch (err: any) {
      console.error('[Test Harness] Error in connectProvider:', {
        provider,
        error: err.message || String(err),
        errorObject: err,
      });
      setAuthError(err.message || `Failed to authorize ${provider}`);
    } finally {
      console.log('[Test Harness] Clearing connecting state for:', provider);
      setIsConnecting(false);
      setConnectingProvider(null);
    }
  };

  const disconnect = async (provider: 'github' | 'gmail' | 'notion') => {
    console.log('[Test Harness] disconnect called:', {
      provider,
      hasSession: !!session?.user,
      userId: session?.user?.id,
    });
    
    setAuthError(null);
    setIsConnecting(true);
    setConnectingProvider(provider);

    try {
      console.log('[Test Harness] Calling disconnect API for:', provider);
      
      // Call server-side API instead of client-side SDK
      const response = await fetch('/dashboard/api/integrations/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to disconnect');
      }

      const data = await response.json();
      console.log('[Test Harness] Disconnect API completed for:', provider, data);
      
      // Refetch authorization status after successful disconnection
      console.log('[Test Harness] Refetching authorization status after disconnect');
      await fetchAuthStatus();
    } catch (err: any) {
      console.error('[Test Harness] Error in disconnect:', {
        provider,
        error: err.message || String(err),
        errorObject: err,
      });
      setAuthError(err.message || `Failed to disconnect ${provider}`);
    } finally {
      console.log('[Test Harness] Clearing connecting state for:', provider);
      setIsConnecting(false);
      setConnectingProvider(null);
    }
  };

  const disconnectAll = async () => {
    console.log('[Test Harness] disconnectAll called:', {
      hasSession: !!session?.user,
      userId: session?.user?.id,
    });
    
    setAuthError(null);
    setIsConnecting(true);
    setConnectingProvider('all');

    try {
      console.log('[Test Harness] Calling disconnect-all API');
      
      // Call server-side API instead of client-side SDK
      const response = await fetch('/dashboard/api/integrations/disconnect-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to disconnect all providers');
      }

      const data = await response.json();
      console.log('[Test Harness] Disconnect-all API completed:', data);
      
      // Refetch authorization status after successful logout
      console.log('[Test Harness] Refetching authorization status after logout');
      await fetchAuthStatus();
    } catch (err: any) {
      console.error('[Test Harness] Error in disconnectAll:', {
        error: err.message || String(err),
        errorObject: err,
      });
      setAuthError(err.message || 'Failed to disconnect all providers');
    } finally {
      console.log('[Test Harness] Clearing connecting state');
      setIsConnecting(false);
      setConnectingProvider(null);
    }
  };

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    console.log('[Test Harness] updateTest called:', {
      index,
      testName: tests[index]?.name,
      updates,
    });
    setTests((prev) => {
      const updated = prev.map((test, i) => (i === index ? { ...test, ...updates } : test));
      console.log('[Test Harness] Test state updated:', {
        index,
        oldStatus: prev[index]?.status,
        newStatus: updated[index]?.status,
        allTests: updated.map(t => ({ name: t.name, status: t.status })),
      });
      return updated;
    });
  };

  const runTest = async (index: number, testFn: () => Promise<any>) => {
    const startTime = Date.now();
    const testName = tests[index]?.name;
    console.log('[Test Harness] runTest started:', {
      index,
      testName,
      timestamp: new Date().toISOString(),
    });
    
    updateTest(index, { status: "running", error: undefined, data: undefined });

    try {
      console.log('[Test Harness] Executing test function:', testName);
      const result = await testFn();
      const duration = Date.now() - startTime;
      console.log('[Test Harness] Test completed successfully:', {
        index,
        testName,
        duration,
        resultSize: JSON.stringify(result).length,
      });
      
      updateTest(index, {
        status: "success",
        data: result,
        duration,
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error('[Test Harness] Test failed:', {
        index,
        testName,
        duration,
        error: error.message || String(error),
        errorStack: error.stack,
      });
      
      updateTest(index, {
        status: "error",
        error: error.message || String(error),
        duration,
      });
    }
  };

  const runAllTests = async () => {
    console.log('[Test Harness] runAllTests called');
    setIsRunning(true);
    setSelectedTest(null);
    console.log('[Test Harness] State updated - isRunning: true, selectedTest: null');

    try {
      console.log('[Test Harness] Starting all tests execution');

      // Test 1: Get Repository Info
      await runTest(0, async () => {
        return await client.github.getRepo({
          owner: "Revyo",
          repo: "integrate-sdk",
        });
      });

      // Test 2: List Repository Issues
      await runTest(1, async () => {
        return await client.github.listIssues({
          owner: "Revyo",
          repo: "integrate-sdk",
          state: "open",
        });
      });

      // Test 3: Get User Info
      await runTest(2, async () => {
        return await client.github.getUser({
          username: "Revyo",
        });
      });

      // Test 4: List User Repositories
      await runTest(3, async () => {
        return await client.github.listRepos({
          owner: "Revyo",
          type: "all",
        });
      });

      // Test 5: Search Notion
      await runTest(4, async () => {
        return await (client as any).notion.search({
          query: "",
        });
      });

      // Test 6: Get Notion Page
      await runTest(5, async () => {
        // First, try to get a page from search results
        const searchResults = await (client as any).notion.search({
          query: "",
        });
        
        // If we have results, use the first page ID
        if (searchResults?.results && searchResults.results.length > 0) {
          const firstPage = searchResults.results[0];
          return await (client as any).notion.getPage({
            pageId: firstPage.id,
          });
        } else {
          return { message: "No pages found in workspace" };
        }
      });

      // Test 7: List All Tools
      await runTest(6, async () => {
        return await client.server.listAllProviders();
      });
      
      console.log('[Test Harness] All tests completed successfully');
    } catch (error: any) {
      console.error('[Test Harness] Failed to run all tests:', {
        error: error.message || String(error),
        errorStack: error.stack,
      });

      // Check if it's a session-related error
      const errorMessage = error.message || String(error);
      if (errorMessage.includes("Session") || errorMessage.includes("session")) {
        console.log("[Test Harness] ⚠️ Session error detected");
        // Clear client cache if method exists
        if (typeof client.clearSessionToken === 'function') {
          console.log('[Test Harness] Clearing session token');
          await client.clearSessionToken();
        }
      }

      // Update all pending/running tests with the connection error
      console.log('[Test Harness] Updating all pending/running tests with error');
      setTests((prev) => {
        const updated = prev.map((test) =>
          test.status === "pending" || test.status === "running"
            ? {
              ...test,
              status: "error" as const,
              error: `Connection failed: ${errorMessage}`,
            }
            : test
        );
        console.log('[Test Harness] Tests updated with error:', updated.map(t => ({ name: t.name, status: t.status })));
        return updated;
      });
    } finally {
      console.log('[Test Harness] runAllTests completed, setting isRunning: false');
      setIsRunning(false);
    }
  };

  const runSingleTest = async (index: number) => {
    const testName = tests[index]?.name;
    console.log('[Test Harness] runSingleTest called:', {
      index,
      testName,
    });
    setIsRunning(true);
    console.log('[Test Harness] State updated - isRunning: true');

    try {
      console.log('[Test Harness] Starting single test execution:', testName);

      switch (index) {
        case 0:
          await runTest(0, async () => {
            return await client.github.getRepo({
              owner: "Revyo",
              repo: "integrate-sdk",
            });
          });
          break;
        case 1:
          await runTest(1, async () => {
            return await client.github.listIssues({
              owner: "Revyo",
              repo: "integrate-sdk",
              state: "open",
            });
          });
          break;
        case 2:
          await runTest(2, async () => {
            return await client.github.getUser({
              username: "Revyo",
            });
          });
          break;
        case 3:
          await runTest(3, async () => {
            return await client.github.listRepos({
              owner: "Revyo",
              type: "all",
            });
          });
          break;
        case 4:
          await runTest(4, async () => {
            return await (client as any).notion.search({
              query: "",
            });
          });
          break;
        case 5:
          await runTest(5, async () => {
            // First, try to get a page from search results
            const searchResults = await (client as any).notion.search({
              query: "",
            });
            
            // If we have results, use the first page ID
            if (searchResults?.results && searchResults.results.length > 0) {
              const firstPage = searchResults.results[0];
              return await (client as any).notion.getPage({
                pageId: firstPage.id,
              });
            } else {
              return { message: "No pages found in workspace" };
            }
          });
          break;
        case 6:
          await runTest(6, async () => {
            return await client.server.listAllProviders();
          });
          break;
      }
      
      console.log('[Test Harness] Single test completed:', testName);
    } catch (error: any) {
      console.error('[Test Harness] Failed to run single test:', {
        index,
        testName,
        error: error.message || String(error),
        errorStack: error.stack,
      });

      // Check if it's a session-related error and clear cache
      const errorMessage = error.message || String(error);
      if (errorMessage.includes("Session") || errorMessage.includes("session")) {
        console.log("[Test Harness] ⚠️ Session error detected - clearing cache");
        await client.clearSessionToken();
      }

      updateTest(index, {
        status: "error",
        error: `Connection failed: ${errorMessage}`,
      });
    } finally {
      console.log('[Test Harness] runSingleTest completed, setting isRunning: false');
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-gray-500";
      case "running":
        return "text-blue-500";
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "○";
      case "running":
        return "◐";
      case "success":
        return "✓";
      case "error":
        return "✗";
      default:
        return "○";
    }
  };

  // Load triggers
  const loadTriggers = async () => {
    if (!session?.user) return;
    
    setTriggersLoading(true);
    setTriggersError(null);
    
    try {
      const response = await fetch('/dashboard/api/integrate/triggers?status=active&limit=50');
      if (!response.ok) {
        throw new Error('Failed to load triggers');
      }
      const result = await response.json();
      setTriggers(result.triggers || []);
    } catch (error: any) {
      console.error('[Test Harness] Error loading triggers:', error);
      setTriggersError(error.message || 'Failed to load triggers');
    } finally {
      setTriggersLoading(false);
    }
  };

  // Load configured integrations
  const loadConfiguredIntegrations = async () => {
    console.log('[Test Harness] Fetching configured integrations...');
    setIntegrationsLoading(true);
    setIntegrationsError(null);
    
    try {
      const response = await fetch('/dashboard/api/integrations/configured');
      console.log('[Test Harness] Configured integrations API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[Test Harness] Configured integrations API error:', errorData);
        throw new Error(errorData.error || 'Failed to load configured integrations');
      }
      
      const data = await response.json();
      console.log('[Test Harness] Configured integrations received:', {
        count: data.integrations.length,
        integrations: data.integrations.map((i: ConfiguredIntegration) => ({
          id: i.id,
          name: i.name,
          toolCount: i.tools.length,
          hasOAuth: i.hasOAuth,
          logoUrl: i.logoUrl,
        })),
      });
      
      // Log full data for debugging
      console.log('[Test Harness] Full configured integrations data:', JSON.stringify(data, null, 2));
      
      setConfiguredIntegrations(data.integrations || []);
    } catch (error: any) {
      console.error('[Test Harness] Error loading configured integrations:', error);
      setIntegrationsError(error.message || 'Failed to load configured integrations');
    } finally {
      setIntegrationsLoading(false);
    }
  };

  // Create trigger
  const createTrigger = async () => {
    if (!session?.user) {
      setTriggersError('Please log in first');
      return;
    }

    try {
      const toolArguments = JSON.parse(createForm.toolArguments);
      const schedule = createForm.scheduleType === 'cron'
        ? { type: 'cron' as const, expression: createForm.cronExpression }
        : { type: 'once' as const, runAt: createForm.runAt };

      const response = await fetch('/dashboard/api/integrate/triggers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: createForm.toolName,
          toolArguments,
          schedule,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to create trigger' }));
        throw new Error(error.error || 'Failed to create trigger');
      }

      // Reset form and reload triggers
      setCreateForm({
        toolName: '',
        toolArguments: '{}',
        scheduleType: 'cron',
        cronExpression: '0 9 * * *',
        runAt: '',
      });
      setShowCreateForm(false);
      await loadTriggers();
    } catch (error: any) {
      console.error('[Test Harness] Error creating trigger:', error);
      setTriggersError(error.message || 'Failed to create trigger');
    }
  };

  // Pause trigger
  const pauseTrigger = async (id: string) => {
    try {
      const response = await fetch(`/api/integrate/triggers/${id}/pause`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to pause trigger');
      }
      await loadTriggers();
    } catch (error: any) {
      console.error('[Test Harness] Error pausing trigger:', error);
      setTriggersError(error.message || 'Failed to pause trigger');
    }
  };

  // Resume trigger
  const resumeTrigger = async (id: string) => {
    try {
      const response = await fetch(`/api/integrate/triggers/${id}/resume`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to resume trigger');
      }
      await loadTriggers();
    } catch (error: any) {
      console.error('[Test Harness] Error resuming trigger:', error);
      setTriggersError(error.message || 'Failed to resume trigger');
    }
  };

  // Run trigger now
  const runTriggerNow = async (id: string) => {
    try {
      const response = await fetch(`/api/integrate/triggers/${id}/run`, {
        method: 'POST',
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to run trigger');
      }
      if (result.success) {
        alert('Trigger executed successfully!');
      } else {
        alert(`Trigger execution failed: ${result.error || 'Unknown error'}`);
      }
      await loadTriggers();
    } catch (error: any) {
      console.error('[Test Harness] Error running trigger:', error);
      alert(`Failed to run trigger: ${error.message || 'Unknown error'}`);
    }
  };

  // Delete trigger
  const deleteTrigger = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trigger?')) {
      return;
    }

    try {
      const response = await fetch(`/api/integrate/triggers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete trigger');
      }
      await loadTriggers();
    } catch (error: any) {
      console.error('[Test Harness] Error deleting trigger:', error);
      setTriggersError(error.message || 'Failed to delete trigger');
    }
  };

  // Load triggers when session is available
  useEffect(() => {
    if (session?.user && !sessionLoading) {
      loadTriggers();
    }
  }, [session?.user?.id, sessionLoading]);

  // Load configured integrations on mount
  useEffect(() => {
    loadConfiguredIntegrations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black font-sans">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link
            href="/dashboard/login"
            className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-white">
            Integrate SDK Test Harness
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Connect providers and test API integrations
          </p>
        </div>
        <div className="mb-6">
          <button
            onClick={() => setIsConfigExpanded(!isConfigExpanded)}
            className="w-full p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-left transition-colors hover:bg-amber-100 dark:hover:bg-amber-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                  Configuration Required
                </h3>
              </div>
              <svg
                className={`w-5 h-5 text-amber-700 dark:text-amber-300 transition-transform ${isConfigExpanded ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
          {isConfigExpanded && (
            <div className="mt-2 p-4 bg-amber-50 dark:bg-amber-950 border border-t-0 border-amber-200 dark:border-amber-800 rounded-b-lg">
              <p className="text-amber-800 dark:text-amber-300 text-sm mb-2">
                Make sure you have set the following environment variables:
              </p>
              <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 font-mono">
                <li>• GITHUB_CLIENT_ID (required)</li>
                <li>• GITHUB_CLIENT_SECRET (required)</li>
                <li>• GMAIL_CLIENT_ID (optional)</li>
                <li>• GMAIL_CLIENT_SECRET (optional)</li>
                <li>• NOTION_CLIENT_ID (optional)</li>
                <li>• NOTION_CLIENT_SECRET (optional)</li>
              </ul>
            </div>
          )}
        </div>

        {/* OAuth Connection Section */}
        <div className="mb-8 bg-white dark:bg-zinc-900 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              OAuth Connections
            </h2>
            <button
              onClick={fetchAuthStatus}
              disabled={authStatusLoading || !session?.user}
              className="px-3 py-1.5 text-sm bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authStatusLoading ? 'Refreshing...' : 'Refresh Status'}
            </button>
          </div>

          {!session?.user && !sessionLoading && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-700 dark:text-yellow-300 text-sm">
              ⚠️ You must be logged in to connect OAuth providers. <Link href="/dashboard/login" className="underline font-medium">Log in here</Link>
            </div>
          )}

          {authError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
              {authError}
            </div>
          )}

          {authStatusError && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-700 dark:text-yellow-300 text-sm">
              Status check error: {authStatusError}
            </div>
          )}

          {authStatusLoading && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-blue-700 dark:text-blue-300 text-sm">
              Loading authorization status...
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* GitHub */}
            <div className="p-4 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-zinc-900 dark:text-white">GitHub</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${githubAuthorized
                  ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                  {githubAuthorized ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <button
                onClick={githubAuthorized ? () => disconnect('github') : () => connectProvider('github')}
                disabled={isConnecting || !session?.user || authStatusLoading}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${githubAuthorized
                  ? 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {connectingProvider === 'github'
                  ? (githubAuthorized ? 'Disconnecting...' : 'Connecting...')
                  : authStatusLoading ? 'Loading...' : githubAuthorized ? 'Disconnect' : (!session?.user ? 'Login Required' : 'Connect')}
              </button>
            </div>

            {/* Gmail */}
            <div className="p-4 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-zinc-900 dark:text-white">Gmail</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${gmailAuthorized
                  ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                  {gmailAuthorized ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <button
                onClick={gmailAuthorized ? () => disconnect('gmail') : () => connectProvider('gmail')}
                disabled={isConnecting || !session?.user || authStatusLoading}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${gmailAuthorized
                  ? 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {connectingProvider === 'gmail'
                  ? (gmailAuthorized ? 'Disconnecting...' : 'Connecting...')
                  : authStatusLoading ? 'Loading...' : gmailAuthorized ? 'Disconnect' : (!session?.user ? 'Login Required' : 'Connect')}
              </button>
            </div>

            {/* Notion */}
            <div className="p-4 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-zinc-900 dark:text-white">Notion</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${notionAuthorized
                  ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                  {notionAuthorized ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <button
                onClick={notionAuthorized ? () => disconnect('notion') : () => connectProvider('notion')}
                disabled={isConnecting || !session?.user || authStatusLoading}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${notionAuthorized
                  ? 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {connectingProvider === 'notion'
                  ? (notionAuthorized ? 'Disconnecting...' : 'Connecting...')
                  : authStatusLoading ? 'Loading...' : notionAuthorized ? 'Disconnect' : (!session?.user ? 'Login Required' : 'Connect')}
              </button>
            </div>
          </div>

          {(githubAuthorized || gmailAuthorized || notionAuthorized) && (
            <button
              onClick={disconnectAll}
              disabled={isConnecting}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors"
            >
              {connectingProvider === 'all' ? 'Disconnecting All...' : 'Disconnect All'}
            </button>
          )}
        </div>

        {/* Configured Integrations Section */}
        <div className="mb-8 bg-white dark:bg-zinc-900 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Configured Integrations
            </h2>
            <button
              onClick={loadConfiguredIntegrations}
              disabled={integrationsLoading}
              className="px-3 py-1.5 text-sm bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {integrationsLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Local integrations configured in this SDK instance with their metadata
          </p>

          {integrationsError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
              {integrationsError}
            </div>
          )}

          {integrationsLoading && (
            <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
              Loading configured integrations...
            </div>
          )}

          {!integrationsLoading && configuredIntegrations.length === 0 && (
            <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
              No integrations configured
            </div>
          )}

          {!integrationsLoading && configuredIntegrations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {configuredIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="p-4 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950"
                >
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {integration.logoUrl && (
                          <img
                            src={integration.logoUrl}
                            alt={`${integration.name} logo`}
                            className="w-8 h-8 rounded-md object-cover"
                          />
                        )}
                        <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">
                          {integration.name}
                        </h3>
                      </div>
                      {integration.hasOAuth && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          OAuth
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      {integration.id}
                    </p>
                  </div>

                  {integration.scopes && integration.scopes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Scopes:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {integration.scopes.map((scope, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono"
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-2">
                    <button
                      onClick={() => setExpandedIntegration(
                        expandedIntegration === integration.id ? null : integration.id
                      )}
                      className="w-full flex items-center justify-between text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      <span>
                        Tools ({integration.tools.length})
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expandedIntegration === integration.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {expandedIntegration === integration.id && (
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                      {integration.toolMetadata && integration.toolMetadata.length > 0 ? (
                        integration.toolMetadata.map((tool, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-xs"
                          >
                            <p className="font-mono font-medium text-zinc-900 dark:text-white mb-1">
                              {tool.name}
                            </p>
                            {tool.description && (
                              <p className="text-zinc-600 dark:text-zinc-400">
                                {tool.description}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        integration.tools.map((tool, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded"
                          >
                            <p className="font-mono text-xs text-zinc-900 dark:text-white">
                              {tool}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Triggers Section */}
        <div className="mb-8 bg-white dark:bg-zinc-900 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Scheduled Triggers
            </h2>
            <div className="flex gap-2">
              <button
                onClick={loadTriggers}
                disabled={triggersLoading || !session?.user}
                className="px-3 py-1.5 text-sm bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {triggersLoading ? 'Loading...' : 'Refresh'}
              </button>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                disabled={!session?.user}
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showCreateForm ? 'Cancel' : 'Create Trigger'}
              </button>
            </div>
          </div>

          {!session?.user && !sessionLoading && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-700 dark:text-yellow-300 text-sm">
              ⚠️ You must be logged in to manage triggers. <Link href="/dashboard/login" className="underline font-medium">Log in here</Link>
            </div>
          )}

          {triggersError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
              {triggersError}
            </div>
          )}

          {showCreateForm && session?.user && (
            <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">Create New Trigger</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Tool Name
                  </label>
                  <input
                    type="text"
                    value={createForm.toolName}
                    onChange={(e) => setCreateForm({ ...createForm, toolName: e.target.value })}
                    placeholder="e.g., gmail_send_email"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Tool Arguments (JSON)
                  </label>
                  <textarea
                    value={createForm.toolArguments}
                    onChange={(e) => setCreateForm({ ...createForm, toolArguments: e.target.value })}
                    placeholder='{"to": "example@email.com", "subject": "Hello", "body": "World"}'
                    rows={3}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Schedule Type
                  </label>
                  <select
                    value={createForm.scheduleType}
                    onChange={(e) => setCreateForm({ ...createForm, scheduleType: e.target.value as 'cron' | 'once' })}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  >
                    <option value="cron">Cron (Recurring)</option>
                    <option value="once">Once (One-time)</option>
                  </select>
                </div>
                {createForm.scheduleType === 'cron' ? (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Cron Expression
                    </label>
                    <input
                      type="text"
                      value={createForm.cronExpression}
                      onChange={(e) => setCreateForm({ ...createForm, cronExpression: e.target.value })}
                      placeholder="0 9 * * *"
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-mono"
                    />
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Format: minute hour day month weekday (e.g., "0 9 * * *" = 9 AM daily)
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Run At (ISO 8601)
                    </label>
                    <input
                      type="datetime-local"
                      value={createForm.runAt}
                      onChange={(e) => setCreateForm({ ...createForm, runAt: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                  </div>
                )}
                <button
                  onClick={createTrigger}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Create Trigger
                </button>
              </div>
            </div>
          )}

          {triggersLoading && (
            <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
              Loading triggers...
            </div>
          )}

          {!triggersLoading && triggers.length === 0 && session?.user && (
            <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
              No triggers found. Create one to get started!
            </div>
          )}

          {!triggersLoading && triggers.length > 0 && (
            <div className="space-y-3">
              {triggers.map((trigger) => (
                <div
                  key={trigger.id}
                  className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-zinc-900 dark:text-white">
                          {trigger.name || trigger.toolName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          trigger.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                            : trigger.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
                            : trigger.status === 'completed'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}>
                          {trigger.status}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                        {trigger.toolName}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Schedule: {trigger.schedule.type === 'cron' 
                          ? `Cron: ${trigger.schedule.expression}`
                          : `Once: ${trigger.schedule.runAt}`
                        }
                      </p>
                      {trigger.lastExecutedAt && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Last run: {new Date(trigger.lastExecutedAt).toLocaleString()}
                          {trigger.lastDuration && ` (${trigger.lastDuration}ms)`}
                        </p>
                      )}
                      {trigger.lastError && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Error: {trigger.lastError}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {trigger.status === 'active' ? (
                        <button
                          onClick={() => pauseTrigger(trigger.id)}
                          className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white rounded font-medium transition-colors"
                        >
                          Pause
                        </button>
                      ) : trigger.status === 'paused' ? (
                        <button
                          onClick={() => resumeTrigger(trigger.id)}
                          className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
                        >
                          Resume
                        </button>
                      ) : null}
                      <button
                        onClick={() => runTriggerNow(trigger.id)}
                        className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
                      >
                        Run Now
                      </button>
                      <button
                        onClick={() => deleteTrigger(trigger.id)}
                        className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6 flex gap-4 items-center">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-6 py-3 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center"
          >
            {isRunning ? "Running Tests..." : "Run All Tests"}
          </button>
          <button
            onClick={async () => {
              console.log('[Test Harness] Reset Tests button clicked');
              setTests((prev) => {
                const updated = prev.map((test) => ({ ...test, status: "pending" as const, data: undefined, error: undefined }));
                console.log('[Test Harness] Tests reset to pending:', updated.map(t => ({ name: t.name, status: t.status })));
                return updated;
              });
              setSelectedTest(null);
              console.log('[Test Harness] selectedTest cleared');
              
              // Clear the SDK client cache to get a fresh MCP session
              if (typeof client.clearSessionToken === 'function') {
                console.log('[Test Harness] Clearing session token');
                await client.clearSessionToken();
              }
              console.log("[Test Harness] ✓ Cache cleared - fresh session will be created on next test");
              
              // Refetch authorization status
              if (session?.user) {
                console.log('[Test Harness] Refetching authorization status after reset');
                await fetchAuthStatus();
              }
            }}
            disabled={isRunning}
            className="px-6 py-3 h-12 bg-zinc-200 hover:bg-zinc-300 disabled:bg-zinc-100 text-zinc-900 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            Reset Tests
          </button>
          <Link
            href="/dashboard/chat"
            className="px-6 py-3 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Test Chat
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              Test Cases
            </h2>
            {tests.map((test, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedTest === test
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                onClick={() => {
                  console.log('[Test Harness] Test selected:', {
                    testName: test.name,
                    status: test.status,
                    hasData: !!test.data,
                    hasError: !!test.error,
                  });
                  setSelectedTest(test);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-2xl ${getStatusColor(test.status)}`}
                    >
                      {getStatusIcon(test.status)}
                    </span>
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-white">
                        {test.name}
                      </h3>
                      {test.duration && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {test.duration}ms
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      runSingleTest(index);
                    }}
                    disabled={isRunning}
                    className="px-3 py-1 text-sm bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded font-medium transition-colors"
                  >
                    Run
                  </button>
                </div>
                {test.error && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400 font-mono">
                    {test.error}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              Test Results
            </h2>
            {selectedTest ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    {selectedTest.name}
                  </h3>
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${selectedTest.status === "success"
                      ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                      : selectedTest.status === "error"
                        ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        : selectedTest.status === "running"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                  >
                    {selectedTest.status.toUpperCase()}
                  </div>
                </div>

                {selectedTest.data && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Response Data:
                    </h4>
                    <pre className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded border border-zinc-200 dark:border-zinc-800 text-xs overflow-x-auto max-h-[500px] overflow-y-auto">
                      {JSON.stringify(selectedTest.data, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedTest.error && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                      Error:
                    </h4>
                    <pre className="bg-red-50 dark:bg-red-950 p-4 rounded border border-red-200 dark:border-red-800 text-xs overflow-x-auto text-red-900 dark:text-red-200">
                      {selectedTest.error}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-500 dark:text-zinc-400 text-center py-12">
                Select a test to view its results
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
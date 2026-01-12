/**
 * Trigger Handler Tests for Server
 * 
 * Tests the trigger API routes in server.ts to improve coverage
 */

import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
import { createMCPServer } from "../../src/server.js";
import { githubIntegration } from "../../src/integrations/github.js";
import type { Trigger, TriggerCallbacks } from "../../src/triggers/types.js";

describe("Trigger Handler Tests", () => {
  let mockTriggers: Map<string, Trigger>;
  let mockTriggerCallbacks: TriggerCallbacks;
  let mockFetch: any;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    // Ensure server context
    delete (globalThis as any).window;
    
    // Reset mock triggers storage
    mockTriggers = new Map();
    
    // Mock fetch for scheduler calls
    originalFetch = global.fetch;
    mockFetch = mock(async (url: string, options?: any) => {
      // Mock scheduler API responses
      if (url.includes('/scheduler/register') || url.includes('/scheduler/unregister') || 
          url.includes('/scheduler/update') || url.includes('/scheduler/pause') || 
          url.includes('/scheduler/resume')) {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
      return originalFetch(url, options);
    });
    global.fetch = mockFetch as any;

    // Create mock trigger callbacks
    mockTriggerCallbacks = {
      create: async (trigger: Trigger) => {
        mockTriggers.set(trigger.id, trigger);
        return trigger;
      },
      get: async (triggerId: string) => {
        return mockTriggers.get(triggerId) || null;
      },
      list: async (params: any) => {
        let triggers = Array.from(mockTriggers.values());
        
        // Apply filters
        if (params.status) {
          triggers = triggers.filter(t => t.status === params.status);
        }
        if (params.toolName) {
          triggers = triggers.filter(t => t.toolName === params.toolName);
        }
        
        // Apply pagination
        const offset = params.offset || 0;
        const limit = params.limit || 50;
        const total = triggers.length;
        triggers = triggers.slice(offset, offset + limit);
        
        // Return format expected by SDK (no hasMore, SDK calculates it)
        return {
          triggers,
          total,
        };
      },
      update: async (triggerId: string, updates: Partial<Trigger>) => {
        const trigger = mockTriggers.get(triggerId);
        if (!trigger) {
          throw new Error('Trigger not found');
        }
        const updated = { ...trigger, ...updates };
        mockTriggers.set(triggerId, updated);
        return updated;
      },
      delete: async (triggerId: string) => {
        mockTriggers.delete(triggerId);
      },
    };
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("POST /api/integrate/triggers - Create Trigger", () => {
    test("should create a trigger successfully", async () => {
      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [
          githubIntegration({
            clientId: 'test-id',
            clientSecret: 'test-secret',
          }),
        ],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Trigger',
          toolName: 'github_create_issue',
          toolArguments: { repo: 'test/repo', title: 'Test' },
          schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
        }),
      });

      const response = await server.client.handler(request, {
        params: { all: ['triggers'] }
      });
      
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.id).toContain('trig_');
      // Verify nanoid format: trig_ followed by 12 characters
      expect(data.id).toMatch(/^trig_[a-zA-Z0-9_-]{12}$/);
      expect(data.name).toBe('Test Trigger');
      expect(data.provider).toBe('github');
      expect(data.status).toBe('active');
    });

    test("should use nanoid for ID generation", async () => {
      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [
          githubIntegration({
            clientId: 'test-id',
            clientSecret: 'test-secret',
          }),
        ],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: 'gmail_send_email',
          toolArguments: { to: 'test@example.com' },
          schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
        }),
      });

      const response = await server.client.handler(request, {
        params: { all: ['triggers'] }
      });
      
      expect(response.status).toBe(201);
      const data = await response.json();
      // Verify ID uses nanoid format (not Date.now format)
      expect(data.id).toMatch(/^trig_[a-zA-Z0-9_-]{12}$/);
      expect(data.id).not.toMatch(/^trig_\d+_/); // Should NOT match old format
    });

    test("should respect custom status if provided", async () => {
      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [
          githubIntegration({
            clientId: 'test-id',
            clientSecret: 'test-secret',
          }),
        ],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: 'github_create_issue',
          toolArguments: { repo: 'test/repo' },
          schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
          status: 'paused', // Custom status
        }),
      });

      const response = await server.client.handler(request, {
        params: { all: ['triggers'] }
      });
      
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.status).toBe('paused');
    });
  });

  describe("GET /api/integrate/triggers - List Triggers", () => {
    test("should list all triggers", async () => {
      // Add test triggers
      await mockTriggerCallbacks.create({
        id: 'trig_1',
        name: 'Trigger 1',
        toolName: 'github_create_issue',
        toolArguments: {},
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: 'github',
        runCount: 0,
      });

      const server = createMCPServer({
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers');
      const response = await server.client.handler(request, { params: { all: ['triggers'] } });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.triggers).toHaveLength(1);
      expect(data.total).toBe(1);
      expect(data.hasMore).toBe(false);
    });

    test("should filter triggers by status", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_active',
        toolName: 'test_tool',
        toolArguments: {},
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 0,
      });

      const server = createMCPServer({
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers?status=active');
      const response = await server.client.handler(request, { params: { all: ['triggers'] } });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.triggers).toHaveLength(1);
      expect(data.triggers[0].status).toBe('active');
      expect(data.hasMore).toBe(false);
    });

    test("should calculate hasMore correctly", async () => {
      // Create 25 triggers
      for (let i = 0; i < 25; i++) {
        await mockTriggerCallbacks.create({
          id: `trig_${i}`,
          toolName: 'test_tool',
          toolArguments: {},
          schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          runCount: 0,
        });
      }

      const server = createMCPServer({
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      // First page: offset=0, limit=10
      let request = new Request('http://localhost:3000/api/integrate/triggers?offset=0&limit=10');
      let response = await server.client.handler(request, { params: { all: ['triggers'] } });
      let data = await response.json();
      expect(data.triggers).toHaveLength(10);
      expect(data.total).toBe(25);
      expect(data.hasMore).toBe(true); // 0 + 10 < 25

      // Second page: offset=10, limit=10
      request = new Request('http://localhost:3000/api/integrate/triggers?offset=10&limit=10');
      response = await server.client.handler(request, { params: { all: ['triggers'] } });
      data = await response.json();
      expect(data.triggers).toHaveLength(10);
      expect(data.total).toBe(25);
      expect(data.hasMore).toBe(true); // 10 + 10 < 25

      // Third page: offset=20, limit=10
      request = new Request('http://localhost:3000/api/integrate/triggers?offset=20&limit=10');
      response = await server.client.handler(request, { params: { all: ['triggers'] } });
      data = await response.json();
      expect(data.triggers).toHaveLength(5);
      expect(data.total).toBe(25);
      expect(data.hasMore).toBe(false); // 20 + 5 >= 25
    });
  });

  describe("GET /api/integrate/triggers/:id - Get Trigger", () => {
    test("should get a trigger by ID", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_test',
        name: 'Test Trigger',
        toolName: 'github_create_issue',
        toolArguments: {},
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: 'github',
        runCount: 0,
      });

      const server = createMCPServer({
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_test');
      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_test'] } });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe('trig_test');
    });

    test("should return 404 for non-existent trigger", async () => {
      const server = createMCPServer({
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/nonexistent');
      const response = await server.client.handler(request, { params: { all: ['triggers', 'nonexistent'] } });
      
      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/integrate/triggers/:id - Update Trigger", () => {
    test("should update a trigger", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_update',
        name: 'Original',
        toolName: 'github_create_issue',
        toolArguments: {},
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: 'github',
        runCount: 0,
      });

      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated' }),
      });

      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_update'] } });
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.name).toBe('Updated');
    });
  });

  describe("DELETE /api/integrate/triggers/:id - Delete Trigger", () => {
    test("should delete a trigger", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_delete',
        toolName: 'test_tool',
        toolArguments: {},
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 0,
      });

      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_delete', { method: 'DELETE' });
      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_delete'] } });
      
      expect(response.status).toBe(204);
      expect(await mockTriggerCallbacks.get('trig_delete')).toBeNull();
    });
  });

  describe("POST /api/integrate/triggers/:id/pause - Pause Trigger", () => {
    test("should pause a trigger", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_pause',
        toolName: 'test_tool',
        toolArguments: {},
        schedule: { type: 'cron', expression: '0 9 * * *' },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 0,
      });

      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_pause/pause', { method: 'POST' });
      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_pause', 'pause'] } });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('paused');
      expect(data.updatedAt).toBeDefined();
    });

    test("should reject pause for non-active triggers", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_paused',
        toolName: 'test_tool',
        toolArguments: {},
        schedule: { type: 'cron', expression: '0 9 * * *' },
        status: 'paused',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 0,
      });

      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_paused/pause', { method: 'POST' });
      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_paused', 'pause'] } });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Cannot pause trigger with status 'paused'");
    });

    test("should reject pause for completed triggers", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_completed',
        toolName: 'test_tool',
        toolArguments: {},
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 1,
      });

      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_completed/pause', { method: 'POST' });
      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_completed', 'pause'] } });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Cannot pause trigger with status 'completed'");
    });
  });

  describe("POST /api/integrate/triggers/:id/resume - Resume Trigger", () => {
    test("should resume a paused trigger", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_resume',
        toolName: 'test_tool',
        toolArguments: {},
        schedule: { type: 'cron', expression: '0 9 * * *' },
        status: 'paused',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 0,
      });

      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_resume/resume', { method: 'POST' });
      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_resume', 'resume'] } });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('active');
      expect(data.updatedAt).toBeDefined();
    });

    test("should reject resume for non-paused triggers", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_active',
        toolName: 'test_tool',
        toolArguments: {},
        schedule: { type: 'cron', expression: '0 9 * * *' },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 0,
      });

      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_active/resume', { method: 'POST' });
      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_active', 'resume'] } });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Cannot resume trigger with status 'active'");
    });

    test("should reject resume for failed triggers", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_failed',
        toolName: 'test_tool',
        toolArguments: {},
        schedule: { type: 'cron', expression: '0 9 * * *' },
        status: 'failed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 1,
        lastError: 'Some error',
      });

      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_failed/resume', { method: 'POST' });
      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_failed', 'resume'] } });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Cannot resume trigger with status 'failed'");
    });
  });

  describe("POST /api/integrate/triggers/:id/run - Execute Immediately", () => {
    test("should return 404 for non-existent trigger", async () => {
      const server = createMCPServer({
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/nonexistent/run', { method: 'POST' });
      const response = await server.client.handler(request, { params: { all: ['triggers', 'nonexistent', 'run'] } });
      
      expect(response.status).toBe(404);
    });

    test("should return 400 if trigger has no provider", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_no_provider',
        toolName: 'test_tool',
        toolArguments: {},
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 0,
      });

      const server = createMCPServer({
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_no_provider/run', { method: 'POST' });
      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_no_provider', 'run'] } });
      
      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/integrate/triggers/:id/execute - MCP Server Callback", () => {
    test("should return trigger details with OAuth token", async () => {
      const mockToken = { accessToken: 'test-token', tokenType: 'Bearer' };
      
      await mockTriggerCallbacks.create({
        id: 'trig_execute',
        toolName: 'github_create_issue',
        toolArguments: {},
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
        status: 'active',
        provider: 'github',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 0,
      });

      const server = createMCPServer({
        apiKey: 'test-api-key',
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
        getProviderToken: async () => mockToken,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_execute/execute', {
        headers: { 'x-api-key': 'test-api-key' },
      });
      
      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_execute', 'execute'] } });
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.trigger.id).toBe('trig_execute');
      expect(data.accessToken).toBe('test-token');
    });

    test("should return 401 if API key is missing", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_auth',
        toolName: 'test_tool',
        toolArguments: {},
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
        status: 'active',
        provider: 'github',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 0,
      });

      const server = createMCPServer({
        apiKey: 'test-api-key',
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_auth/execute');
      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_auth', 'execute'] } });
      
      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/integrate/triggers/:id/complete - MCP Server Callback", () => {
    test("should update trigger with successful execution result", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_complete',
        toolName: 'github_create_issue',
        toolArguments: {},
        schedule: { type: 'cron', expression: '0 9 * * *' },
        status: 'active',
        provider: 'github',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 5,
      });

      const server = createMCPServer({
        apiKey: 'test-api-key',
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const executedAt = new Date().toISOString();
      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_complete/complete', {
        method: 'POST',
        headers: { 'x-api-key': 'test-api-key', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          result: { issueNumber: 123 },
          executedAt,
        }),
      });

      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_complete', 'complete'] } });
      expect(response.status).toBe(200);
      
      const trigger = await mockTriggerCallbacks.get('trig_complete');
      expect(trigger?.runCount).toBe(6);
      expect(trigger?.lastRunAt).toBe(executedAt);
    });

    test("should mark one-time trigger as completed on success", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_once',
        toolName: 'test_tool',
        toolArguments: {},
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        runCount: 0,
      });

      const server = createMCPServer({
        apiKey: 'test-api-key',
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
        triggers: mockTriggerCallbacks,
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers/trig_once/complete', {
        method: 'POST',
        headers: { 'x-api-key': 'test-api-key', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          result: {},
          executedAt: new Date().toISOString(),
        }),
      });

      const response = await server.client.handler(request, { params: { all: ['triggers', 'trig_once', 'complete'] } });
      expect(response.status).toBe(200);
      
      const trigger = await mockTriggerCallbacks.get('trig_once');
      expect(trigger?.status).toBe('completed');
    });
  });

  describe("Error Handling", () => {
    test("should return 501 when triggers not configured", async () => {
      const server = createMCPServer({
        integrations: [githubIntegration({ clientId: 'test-id', clientSecret: 'test-secret' })],
      });

      const request = new Request('http://localhost:3000/api/integrate/triggers');
      const response = await server.client.handler(request, { params: { all: ['triggers'] } });
      
      expect(response.status).toBe(501);
      const data = await response.json();
      expect(data.error).toContain('not configured');
    });
  });
});

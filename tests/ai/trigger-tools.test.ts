/**
 * Trigger Tools for AI Tests
 * 
 * Tests for automatic trigger tool inclusion in AI provider helpers
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { createMCPServer } from "../../src/server.js";
import { githubIntegration } from "../../src/integrations/github.js";
import { getVercelAITools } from "../../src/ai/vercel-ai.js";
import { getOpenAITools } from "../../src/ai/openai.js";
import { getAnthropicTools } from "../../src/ai/anthropic.js";
import { getGoogleTools } from "../../src/ai/google.js";
import type { Trigger, TriggerCallbacks } from "../../src/triggers/types.js";

describe("Trigger Tools for AI", () => {
  let mockTriggers: Map<string, Trigger>;
  let mockTriggerCallbacks: TriggerCallbacks;

  beforeEach(() => {
    // Ensure server context
    delete (globalThis as any).window;
    
    // Reset mock triggers storage
    mockTriggers = new Map();
    
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
        
        if (params.status) {
          triggers = triggers.filter(t => t.status === params.status);
        }
        if (params.toolName) {
          triggers = triggers.filter(t => t.toolName === params.toolName);
        }
        
        const offset = params.offset || 0;
        const limit = params.limit || 50;
        const total = triggers.length;
        triggers = triggers.slice(offset, offset + limit);
        
        return { triggers, total };
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

  describe("getVercelAITools", () => {
    test("should include trigger tools when triggers configured", async () => {
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

      // Mock client state to prevent connection attempts
      (server.client as any).availableTools = new Map();
      (server.client as any).initialized = true;
      (server.client as any).transport = { isConnected: () => true };

      const tools = await getVercelAITools(server.client);

      // Should have MCP tools + trigger tools
      expect(tools).toBeDefined();
      expect(tools.trigger_create).toBeDefined();
      expect(tools.trigger_list).toBeDefined();
      expect(tools.trigger_get).toBeDefined();
      expect(tools.trigger_update).toBeDefined();
      expect(tools.trigger_delete).toBeDefined();
      expect(tools.trigger_pause).toBeDefined();
      expect(tools.trigger_resume).toBeDefined();

      // Verify tool structure
      expect(tools.trigger_create.description).toBeDefined();
      expect(tools.trigger_create.inputSchema).toBeDefined();
      expect(tools.trigger_create.execute).toBeInstanceOf(Function);
    });

    test("should not include trigger tools when triggers not configured", async () => {
      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [
          githubIntegration({
            clientId: 'test-id',
            clientSecret: 'test-secret',
          }),
        ],
      });

      // Mock client state to prevent connection attempts
      (server.client as any).availableTools = new Map();
      (server.client as any).initialized = true;
      (server.client as any).transport = { isConnected: () => true };

      const tools = await getVercelAITools(server.client);

      // Should only have MCP tools, no trigger tools
      expect(tools.trigger_create).toBeUndefined();
      expect(tools.trigger_list).toBeUndefined();
    });

    test("should execute trigger_create tool", async () => {
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

      // Mock client state to prevent connection attempts
      (server.client as any).availableTools = new Map();
      (server.client as any).initialized = true;
      (server.client as any).transport = { isConnected: () => true };

      const tools = await getVercelAITools(server.client);

      const result = await tools.trigger_create.execute({
        name: 'Test Trigger',
        toolName: 'github_create_issue',
        toolArguments: { repo: 'test/repo', title: 'Test' },
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
      });

      expect(result).toBeDefined();
      expect(result.id).toMatch(/^trig_[a-zA-Z0-9_-]{12}$/);
      expect(result.name).toBe('Test Trigger');
      expect(result.provider).toBe('github');
      expect(result.status).toBe('active');
    });

    test("should execute trigger_list tool", async () => {
      // Create test triggers
      await mockTriggerCallbacks.create({
        id: 'trig_1',
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
        integrations: [
          githubIntegration({
            clientId: 'test-id',
            clientSecret: 'test-secret',
          }),
        ],
        triggers: mockTriggerCallbacks,
      });

      // Mock client state to prevent connection attempts
      (server.client as any).availableTools = new Map();
      (server.client as any).initialized = true;
      (server.client as any).transport = { isConnected: () => true };

      const tools = await getVercelAITools(server.client);
      const result = await tools.trigger_list.execute({});

      expect(result.triggers).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.hasMore).toBe(false);
    });

    test("should execute trigger_pause tool with validation", async () => {
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
        integrations: [
          githubIntegration({
            clientId: 'test-id',
            clientSecret: 'test-secret',
          }),
        ],
        triggers: mockTriggerCallbacks,
      });

      // Mock client state to prevent connection attempts
      (server.client as any).availableTools = new Map();
      (server.client as any).initialized = true;
      (server.client as any).transport = { isConnected: () => true };

      const tools = await getVercelAITools(server.client);
      const result = await tools.trigger_pause.execute({ triggerId: 'trig_pause' });

      expect(result.status).toBe('paused');
    });

    test("should reject invalid status transition", async () => {
      await mockTriggerCallbacks.create({
        id: 'trig_already_paused',
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
        integrations: [
          githubIntegration({
            clientId: 'test-id',
            clientSecret: 'test-secret',
          }),
        ],
        triggers: mockTriggerCallbacks,
      });

      // Mock client state to prevent connection attempts
      (server.client as any).availableTools = new Map();
      (server.client as any).initialized = true;
      (server.client as any).transport = { isConnected: () => true };

      const tools = await getVercelAITools(server.client);

      await expect(
        tools.trigger_pause.execute({ triggerId: 'trig_already_paused' })
      ).rejects.toThrow("Cannot pause trigger with status 'paused'");
    });
  });

  describe("getOpenAITools", () => {
    test("should include trigger tools when triggers configured", async () => {
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

      // Mock client state to prevent connection attempts
      (server.client as any).availableTools = new Map();
      (server.client as any).initialized = true;
      (server.client as any).transport = { isConnected: () => true };

      const tools = await getOpenAITools(server.client);

      // Should have trigger tools
      const toolNames = tools.map(t => t.name);
      expect(toolNames).toContain('trigger_create');
      expect(toolNames).toContain('trigger_list');
      expect(toolNames).toContain('trigger_pause');
      expect(toolNames).toContain('trigger_resume');

      // Verify tool structure
      const createTrigger = tools.find(t => t.name === 'trigger_create');
      expect(createTrigger?.type).toBe('function');
      expect(createTrigger?.description).toBeDefined();
      expect(createTrigger?.parameters).toBeDefined();
    });

    test("should not include trigger tools when not configured", async () => {
      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [
          githubIntegration({
            clientId: 'test-id',
            clientSecret: 'test-secret',
          }),
        ],
      });

      // Mock client state to prevent connection attempts
      (server.client as any).availableTools = new Map();
      (server.client as any).initialized = true;
      (server.client as any).transport = { isConnected: () => true };

      const tools = await getOpenAITools(server.client);
      const toolNames = tools.map(t => t.name);
      
      expect(toolNames).not.toContain('trigger_create');
      expect(toolNames).not.toContain('trigger_list');
    });
  });

  describe("getAnthropicTools", () => {
    test("should include trigger tools when triggers configured", async () => {
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

      // Mock client state to prevent connection attempts
      (server.client as any).availableTools = new Map();
      (server.client as any).initialized = true;
      (server.client as any).transport = { isConnected: () => true };

      const tools = await getAnthropicTools(server.client);

      // Should have trigger tools
      const toolNames = tools.map(t => t.name);
      expect(toolNames).toContain('trigger_create');
      expect(toolNames).toContain('trigger_list');

      // Verify tool structure
      const createTrigger = tools.find(t => t.name === 'trigger_create');
      expect(createTrigger?.description).toBeDefined();
      expect(createTrigger?.input_schema).toBeDefined();
      expect(createTrigger?.input_schema.type).toBe('object');
    });
  });

  describe("getGoogleTools", () => {
    test("should include trigger tools when triggers configured", async () => {
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

      // Mock client state to prevent connection attempts
      (server.client as any).availableTools = new Map();
      (server.client as any).initialized = true;
      (server.client as any).transport = { isConnected: () => true };

      const tools = await getGoogleTools(server.client);

      // Should have trigger tools
      const toolNames = tools.map(t => t.name);
      expect(toolNames).toContain('trigger_create');
      expect(toolNames).toContain('trigger_list');

      // Verify tool structure
      const createTrigger = tools.find(t => t.name === 'trigger_create');
      expect(createTrigger?.description).toBeDefined();
      expect(createTrigger?.parameters).toBeDefined();
    });
  });

  describe("Tool execution with context", () => {
    test("should pass context to trigger callbacks", async () => {
      let capturedContext: any = null;
      
      const contextAwareCallbacks: TriggerCallbacks = {
        create: async (trigger, context) => {
          capturedContext = context;
          mockTriggers.set(trigger.id, trigger);
          return trigger;
        },
        get: mockTriggerCallbacks.get,
        list: mockTriggerCallbacks.list,
        update: mockTriggerCallbacks.update,
        delete: mockTriggerCallbacks.delete,
      };

      const server = createMCPServer({
        apiKey: 'test-key',
        integrations: [
          githubIntegration({
            clientId: 'test-id',
            clientSecret: 'test-secret',
          }),
        ],
        triggers: contextAwareCallbacks,
      });

      // Mock client state to prevent connection attempts
      (server.client as any).availableTools = new Map();
      (server.client as any).initialized = true;
      (server.client as any).transport = { isConnected: () => true };

      const context = { userId: 'user123', organizationId: 'org456' };
      const tools = await getVercelAITools(server.client, { mode: 'tools', context });

      await tools.trigger_create.execute({
        toolName: 'github_create_issue',
        toolArguments: { repo: 'test/repo' },
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
      });

      expect(capturedContext).toEqual(context);
    });
  });
});

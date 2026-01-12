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
      expect(tools.create_trigger).toBeDefined();
      expect(tools.list_triggers).toBeDefined();
      expect(tools.get_trigger).toBeDefined();
      expect(tools.update_trigger).toBeDefined();
      expect(tools.delete_trigger).toBeDefined();
      expect(tools.pause_trigger).toBeDefined();
      expect(tools.resume_trigger).toBeDefined();
      
      // Verify tool structure
      expect(tools.create_trigger.description).toBeDefined();
      expect(tools.create_trigger.inputSchema).toBeDefined();
      expect(tools.create_trigger.execute).toBeInstanceOf(Function);
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
      expect(tools.create_trigger).toBeUndefined();
      expect(tools.list_triggers).toBeUndefined();
    });

    test("should execute create_trigger tool", async () => {
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

      const result = await tools.create_trigger.execute({
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

    test("should execute list_triggers tool", async () => {
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
      const result = await tools.list_triggers.execute({});

      expect(result.triggers).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.hasMore).toBe(false);
    });

    test("should execute pause_trigger tool with validation", async () => {
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
      const result = await tools.pause_trigger.execute({ triggerId: 'trig_pause' });

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
        tools.pause_trigger.execute({ triggerId: 'trig_already_paused' })
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
      expect(toolNames).toContain('create_trigger');
      expect(toolNames).toContain('list_triggers');
      expect(toolNames).toContain('pause_trigger');
      expect(toolNames).toContain('resume_trigger');
      
      // Verify tool structure
      const createTrigger = tools.find(t => t.name === 'create_trigger');
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
      
      expect(toolNames).not.toContain('create_trigger');
      expect(toolNames).not.toContain('list_triggers');
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
      expect(toolNames).toContain('create_trigger');
      expect(toolNames).toContain('list_triggers');
      
      // Verify tool structure
      const createTrigger = tools.find(t => t.name === 'create_trigger');
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
      expect(toolNames).toContain('create_trigger');
      expect(toolNames).toContain('list_triggers');
      
      // Verify tool structure
      const createTrigger = tools.find(t => t.name === 'create_trigger');
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
      const tools = await getVercelAITools(server.client, { context });

      await tools.create_trigger.execute({
        toolName: 'github_create_issue',
        toolArguments: { repo: 'test/repo' },
        schedule: { type: 'once', runAt: '2024-12-20T10:00:00Z' },
      });

      expect(capturedContext).toEqual(context);
    });
  });
});

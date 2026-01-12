/**
 * Trigger Client Tests
 * Tests for TriggerClient functionality
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import { TriggerClient } from "../../src/triggers/client.js";
import type { Trigger, CreateTriggerParams, UpdateTriggerParams, ListTriggersResponse, TriggerExecutionResult } from "../../src/triggers/types.js";

// Mock fetch globally
global.fetch = mock(() => Promise.resolve(new Response(JSON.stringify({}), { status: 200 })));

describe("TriggerClient", () => {
  let client: TriggerClient;
  const mockHeaders = { 'X-Integrations': 'github,gmail' };
  
  beforeEach(() => {
    client = new TriggerClient({
      apiRouteBase: '/api/integrate',
      getHeaders: () => mockHeaders,
    });
    
    // Reset mock
    (global.fetch as any).mockClear();
  });

  describe("create", () => {
    it("should create a trigger", async () => {
      const mockTrigger: Trigger = {
        id: 'trig_123',
        toolName: 'gmail_send_email',
        toolArguments: { to: 'test@example.com' },
        schedule: { type: 'once', runAt: '2024-12-13T22:00:00Z' },
        status: 'active',
        createdAt: '2024-12-01T00:00:00Z',
        updatedAt: '2024-12-01T00:00:00Z',
        runCount: 0,
      };

      (global.fetch as any).mockResolvedValueOnce(
        new Response(JSON.stringify(mockTrigger), { status: 201 })
      );

      const params: CreateTriggerParams = {
        toolName: 'gmail_send_email',
        toolArguments: { to: 'test@example.com' },
        schedule: { type: 'once', runAt: '2024-12-13T22:00:00Z' },
      };

      const result = await client.create(params);

      expect(result).toEqual(mockTrigger);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/integrate/triggers',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Integrations': 'github,gmail',
          }),
          body: JSON.stringify(params),
        })
      );
    });
  });

  describe("list", () => {
    it("should list triggers without filters", async () => {
      const mockResponse: ListTriggersResponse = {
        triggers: [],
        total: 0,
        hasMore: false,
      };

      (global.fetch as any).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 })
      );

      const result = await client.list();

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/integrate/triggers',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it("should list triggers with filters", async () => {
      const mockResponse: ListTriggersResponse = {
        triggers: [],
        total: 0,
        hasMore: false,
      };

      (global.fetch as any).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 })
      );

      const result = await client.list({
        status: 'active',
        limit: 10,
        offset: 0,
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/integrate/triggers?status=active&limit=10&offset=0',
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe("get", () => {
    it("should get a trigger by ID", async () => {
      const mockTrigger: Trigger = {
        id: 'trig_123',
        toolName: 'gmail_send_email',
        toolArguments: { to: 'test@example.com' },
        schedule: { type: 'once', runAt: '2024-12-13T22:00:00Z' },
        status: 'active',
        createdAt: '2024-12-01T00:00:00Z',
        updatedAt: '2024-12-01T00:00:00Z',
        runCount: 0,
      };

      (global.fetch as any).mockResolvedValueOnce(
        new Response(JSON.stringify(mockTrigger), { status: 200 })
      );

      const result = await client.get('trig_123');

      expect(result).toEqual(mockTrigger);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/integrate/triggers/trig_123',
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe("update", () => {
    it("should update a trigger", async () => {
      const mockTrigger: Trigger = {
        id: 'trig_123',
        toolName: 'gmail_send_email',
        toolArguments: { to: 'updated@example.com' },
        schedule: { type: 'once', runAt: '2024-12-13T22:00:00Z' },
        status: 'active',
        createdAt: '2024-12-01T00:00:00Z',
        updatedAt: '2024-12-02T00:00:00Z',
        runCount: 0,
      };

      (global.fetch as any).mockResolvedValueOnce(
        new Response(JSON.stringify(mockTrigger), { status: 200 })
      );

      const params: UpdateTriggerParams = {
        toolArguments: { to: 'updated@example.com' },
      };

      const result = await client.update('trig_123', params);

      expect(result).toEqual(mockTrigger);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/integrate/triggers/trig_123',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(params),
        })
      );
    });
  });

  describe("delete", () => {
    it("should delete a trigger", async () => {
      (global.fetch as any).mockResolvedValueOnce(
        new Response(null, { status: 204 })
      );

      await client.delete('trig_123');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/integrate/triggers/trig_123',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe("pause", () => {
    it("should pause a trigger", async () => {
      const mockTrigger: Trigger = {
        id: 'trig_123',
        toolName: 'gmail_send_email',
        toolArguments: { to: 'test@example.com' },
        schedule: { type: 'cron', expression: '0 9 * * *' },
        status: 'paused',
        createdAt: '2024-12-01T00:00:00Z',
        updatedAt: '2024-12-02T00:00:00Z',
        runCount: 0,
      };

      (global.fetch as any).mockResolvedValueOnce(
        new Response(JSON.stringify(mockTrigger), { status: 200 })
      );

      const result = await client.pause('trig_123');

      expect(result).toEqual(mockTrigger);
      expect(result.status).toBe('paused');
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/integrate/triggers/trig_123/pause',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe("resume", () => {
    it("should resume a trigger", async () => {
      const mockTrigger: Trigger = {
        id: 'trig_123',
        toolName: 'gmail_send_email',
        toolArguments: { to: 'test@example.com' },
        schedule: { type: 'cron', expression: '0 9 * * *' },
        status: 'active',
        createdAt: '2024-12-01T00:00:00Z',
        updatedAt: '2024-12-02T00:00:00Z',
        runCount: 0,
      };

      (global.fetch as any).mockResolvedValueOnce(
        new Response(JSON.stringify(mockTrigger), { status: 200 })
      );

      const result = await client.resume('trig_123');

      expect(result).toEqual(mockTrigger);
      expect(result.status).toBe('active');
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/integrate/triggers/trig_123/resume',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe("run", () => {
    it("should execute a trigger immediately", async () => {
      const mockResult: TriggerExecutionResult = {
        success: true,
        result: { message: 'Email sent successfully' },
        executedAt: '2024-12-02T10:00:00Z',
        duration: 1523,
      };

      (global.fetch as any).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResult), { status: 200 })
      );

      const result = await client.run('trig_123');

      expect(result).toEqual(mockResult);
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/integrate/triggers/trig_123/run',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe("error handling", () => {
    it("should throw error on failed request", async () => {
      (global.fetch as any).mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Trigger not found' }), { status: 404 })
      );

      await expect(client.get('invalid_id')).rejects.toThrow('Trigger not found');
    });

    it("should handle non-JSON error responses", async () => {
      (global.fetch as any).mockResolvedValueOnce(
        new Response('Internal Server Error', { status: 500, statusText: 'Internal Server Error' })
      );

      await expect(client.get('trig_123')).rejects.toThrow('Request failed:');
    });
  });

  describe("cross-origin requests", () => {
    it("should use apiBaseUrl when provided", async () => {
      const crossOriginClient = new TriggerClient({
        apiRouteBase: '/api/integrate',
        apiBaseUrl: 'https://api.example.com',
        getHeaders: () => mockHeaders,
      });

      (global.fetch as any).mockResolvedValueOnce(
        new Response(JSON.stringify({ triggers: [], total: 0, hasMore: false }), { status: 200 })
      );

      await crossOriginClient.list();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/integrate/triggers',
        expect.anything()
      );
    });
  });
});

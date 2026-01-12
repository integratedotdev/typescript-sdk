/**
 * Trigger Management Tools for AI
 * 
 * SDK-level tools that call trigger callbacks directly
 * Automatically included in AI provider helpers when triggers are configured
 */

import { z } from "zod";
import type { MCPContext } from "../config/types.js";
import type { TriggerCallbacks } from "../triggers/types.js";
import { 
  generateTriggerId, 
  extractProviderFromToolName, 
  validateStatusTransition, 
  calculateHasMore 
} from "../triggers/utils.js";

/**
 * Configuration for trigger tools
 */
export interface TriggerToolsConfig {
  /** Trigger storage callbacks */
  callbacks: TriggerCallbacks;
  /** Session context extraction function */
  getSessionContext?: (request: Request) => Promise<MCPContext | undefined> | MCPContext | undefined;
}

/**
 * Create trigger management tools for AI providers
 * These tools call the trigger callbacks directly with pre-processing
 * 
 * @param config - Trigger configuration including callbacks
 * @param context - Optional user context for multi-tenant support
 * @returns Object containing trigger management tools
 */
export function createTriggerTools(config: TriggerToolsConfig, context?: MCPContext) {
  const { callbacks } = config;
  
  return {
    create_trigger: {
      description: "Schedule a tool to run at a specific time or on a recurring schedule. Use this when the user wants to do something later.",
      inputSchema: z.object({
        name: z.string().optional().describe("Human-readable trigger name"),
        description: z.string().optional().describe("Trigger description"),
        toolName: z.string().describe("MCP tool name to execute (e.g., gmail_send_email, github_create_issue)"),
        toolArguments: z.record(z.unknown()).describe("Arguments to pass to the tool when it executes"),
        schedule: z.union([
          z.object({ 
            type: z.literal("once"), 
            runAt: z.string().describe("ISO datetime string (e.g., 2024-12-13T22:00:00Z)") 
          }),
          z.object({ 
            type: z.literal("cron"), 
            expression: z.string().describe("Cron expression (e.g., '0 9 * * *' for daily at 9 AM)") 
          }),
        ]).describe("When to execute the tool"),
      }),
      execute: async (args: any) => {
        // Pre-process trigger data (same as server.ts)
        const triggerId = generateTriggerId();
        const provider = extractProviderFromToolName(args.toolName);
        const now = new Date().toISOString();
        
        const trigger = {
          id: triggerId,
          ...args,
          provider,
          status: 'active' as const,
          createdAt: now,
          updatedAt: now,
          runCount: 0,
        };
        
        return callbacks.create(trigger, context);
      },
    },
    
    list_triggers: {
      description: "List all scheduled triggers with optional filtering by status or tool name",
      inputSchema: z.object({
        status: z.enum(['active', 'paused', 'completed', 'failed']).optional().describe("Filter by trigger status"),
        toolName: z.string().optional().describe("Filter by tool name"),
        limit: z.number().optional().describe("Maximum number of results (default: 20)"),
        offset: z.number().optional().describe("Number of results to skip for pagination (default: 0)"),
      }),
      execute: async (args: any) => {
        const params = {
          status: args.status,
          toolName: args.toolName,
          limit: args.limit || 20,
          offset: args.offset || 0,
        };
        
        // Call list callback
        const result = await callbacks.list(params, context);
        
        // Calculate hasMore
        const hasMore = calculateHasMore(params.offset, result.triggers.length, result.total);
        
        return {
          triggers: result.triggers,
          total: result.total,
          hasMore,
        };
      },
    },
    
    get_trigger: {
      description: "Get details of a specific trigger by its ID",
      inputSchema: z.object({
        triggerId: z.string().describe("The trigger ID to retrieve"),
      }),
      execute: async (args: any) => {
        const trigger = await callbacks.get(args.triggerId, context);
        
        if (!trigger) {
          throw new Error(`Trigger ${args.triggerId} not found`);
        }
        
        return trigger;
      },
    },
    
    update_trigger: {
      description: "Update a trigger's properties like name, description, arguments, or schedule",
      inputSchema: z.object({
        triggerId: z.string().describe("The trigger ID to update"),
        name: z.string().optional().describe("New trigger name"),
        description: z.string().optional().describe("New trigger description"),
        toolArguments: z.record(z.unknown()).optional().describe("New tool arguments"),
        schedule: z.union([
          z.object({ 
            type: z.literal("once"), 
            runAt: z.string().describe("ISO datetime string") 
          }),
          z.object({ 
            type: z.literal("cron"), 
            expression: z.string().describe("Cron expression") 
          }),
        ]).optional().describe("New schedule"),
      }),
      execute: async (args: any) => {
        const { triggerId, ...updates } = args;
        
        // Add updatedAt timestamp
        const updatesWithTimestamp = {
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        return callbacks.update(triggerId, updatesWithTimestamp, context);
      },
    },
    
    delete_trigger: {
      description: "Delete a trigger permanently. This cannot be undone.",
      inputSchema: z.object({
        triggerId: z.string().describe("The trigger ID to delete"),
      }),
      execute: async (args: any) => {
        await callbacks.delete(args.triggerId, context);
        return { success: true, message: `Trigger ${args.triggerId} deleted` };
      },
    },
    
    pause_trigger: {
      description: "Pause a trigger to temporarily stop it from executing. Can be resumed later.",
      inputSchema: z.object({
        triggerId: z.string().describe("The trigger ID to pause"),
      }),
      execute: async (args: any) => {
        // Get current trigger to validate status
        const trigger = await callbacks.get(args.triggerId, context);
        
        if (!trigger) {
          throw new Error(`Trigger ${args.triggerId} not found`);
        }
        
        // Validate status transition
        const validation = validateStatusTransition(trigger.status, 'paused');
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        
        // Update with validated status and timestamp
        return callbacks.update(
          args.triggerId, 
          { 
            status: 'paused',
            updatedAt: new Date().toISOString(),
          }, 
          context
        );
      },
    },
    
    resume_trigger: {
      description: "Resume a paused trigger to start executing it again on schedule",
      inputSchema: z.object({
        triggerId: z.string().describe("The trigger ID to resume"),
      }),
      execute: async (args: any) => {
        // Get current trigger to validate status
        const trigger = await callbacks.get(args.triggerId, context);
        
        if (!trigger) {
          throw new Error(`Trigger ${args.triggerId} not found`);
        }
        
        // Validate status transition
        const validation = validateStatusTransition(trigger.status, 'active');
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        
        // Update with validated status and timestamp
        return callbacks.update(
          args.triggerId, 
          { 
            status: 'active',
            updatedAt: new Date().toISOString(),
          }, 
          context
        );
      },
    },
  };
}

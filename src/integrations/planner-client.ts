import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface PlannerIntegrationClient {
  createBucket(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  createPlan(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  createTask(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  deleteTask(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getPlan(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getTask(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  getTaskDetails(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listBuckets(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listGroupPlans(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listMyPlans(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listMyTasks(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  listPlanTasks(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;

  updateTask(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
}

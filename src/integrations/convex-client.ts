import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ConvexIntegrationClient {
  managementTokenDetails(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  managementListProjects(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  managementCreateProject(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  managementGetProject(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  managementDeleteProject(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  managementListDeployments(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  managementListTeamDeployments(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  managementGetDeployment(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  managementCreateDeployment(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  managementUpdateDeployment(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  managementDeleteDeployment(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  managementListDeploymentRegions(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  managementListDeploymentClasses(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  managementListDefaultEnvironmentVariables(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  managementUpdateDefaultEnvironmentVariables(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  deploymentListEnvironmentVariables(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  deploymentUpdateEnvironmentVariables(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
}

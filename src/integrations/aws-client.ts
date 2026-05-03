/**
 * AWS Integration Client Types
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface AwsIntegrationClient {
  stsGetCallerIdentity(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  ec2DescribeRegions(params?: { region_names?: string }): Promise<MCPToolCallResponse>;
  ec2DescribeInstances(params?: {
    instance_ids?: string;
    max_results?: number;
    next_token?: string;
  }): Promise<MCPToolCallResponse>;
  s3ListBuckets(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  lambdaListFunctions(params?: { max_items?: number; marker?: string }): Promise<MCPToolCallResponse>;
  cloudformationListStacks(params?: { stack_status_filter?: string; next_token?: string }): Promise<MCPToolCallResponse>;
  iamListAccountAliases(params?: Record<string, never>): Promise<MCPToolCallResponse>;
}

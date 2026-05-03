/**
 * Cloudflare integration client types
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface CloudflareIntegrationClient {
  verifyToken(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listAccounts(params?: {
    name?: string;
    direction?: string;
    page?: number;
    per_page?: number;
  }): Promise<MCPToolCallResponse>;
  getAccount(params: { account_id: string }): Promise<MCPToolCallResponse>;
  listZones(params?: {
    account_id?: string;
    name?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<MCPToolCallResponse>;
  getZone(params: { zone_id: string }): Promise<MCPToolCallResponse>;
  listDnsRecords(params: {
    zone_id: string;
    type?: string;
    name?: string;
    content?: string;
    page?: number;
    per_page?: number;
  }): Promise<MCPToolCallResponse>;
  createDnsRecord(params: {
    zone_id: string;
    type: string;
    name: string;
    content: string;
    ttl?: number;
    priority?: number;
    proxied?: boolean;
  }): Promise<MCPToolCallResponse>;
  updateDnsRecord(params: {
    zone_id: string;
    record_id: string;
    type: string;
    name: string;
    content: string;
    ttl?: number;
    priority?: number;
    proxied?: boolean;
  }): Promise<MCPToolCallResponse>;
  deleteDnsRecord(params: { zone_id: string; record_id: string }): Promise<MCPToolCallResponse>;
  purgeZoneCache(params: {
    zone_id: string;
    purge_everything?: boolean;
    files?: string;
    hosts?: string;
    tags?: string;
  }): Promise<MCPToolCallResponse>;
  listWorkerScripts(params: { account_id: string }): Promise<MCPToolCallResponse>;
}

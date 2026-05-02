/**
 * Netlify Integration Client Types
 * Fully typed interface for Netlify integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface NetlifyIntegrationClient {
  // User & Accounts
  getCurrentUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listAccounts(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getAccount(params: { account_id: string }): Promise<MCPToolCallResponse>;

  // Sites
  listSites(params?: { filter?: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  getSite(params: { site_id: string }): Promise<MCPToolCallResponse>;
  createSite(params: { name?: string; account_slug?: string; repo_url?: string; repo_branch?: string; build_command?: string; publish_dir?: string }): Promise<MCPToolCallResponse>;
  updateSite(params: { site_id: string; name?: string; build_command?: string; publish_dir?: string; repo_branch?: string }): Promise<MCPToolCallResponse>;
  deleteSite(params: { site_id: string }): Promise<MCPToolCallResponse>;
  enableSite(params: { site_id: string }): Promise<MCPToolCallResponse>;
  disableSite(params: { site_id: string }): Promise<MCPToolCallResponse>;

  // Deploys
  listDeploys(params: { site_id: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  getDeploy(params: { deploy_id: string }): Promise<MCPToolCallResponse>;
  createDeploy(params: { site_id: string; title?: string; branch?: string }): Promise<MCPToolCallResponse>;
  cancelDeploy(params: { site_id: string; deploy_id: string }): Promise<MCPToolCallResponse>;
  restoreDeploy(params: { site_id: string; deploy_id: string }): Promise<MCPToolCallResponse>;
  lockDeploy(params: { deploy_id: string }): Promise<MCPToolCallResponse>;
  unlockDeploy(params: { deploy_id: string }): Promise<MCPToolCallResponse>;

  // Builds
  listBuilds(params: { site_id: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  getBuild(params: { site_id: string; build_id: string }): Promise<MCPToolCallResponse>;
  triggerBuild(params: { site_id: string; clear_cache?: boolean }): Promise<MCPToolCallResponse>;

  // Environment Variables
  listEnvVars(params: { account_id: string; site_id?: string; context?: string; scope?: string }): Promise<MCPToolCallResponse>;
  getEnvVar(params: { account_id: string; key: string; site_id?: string }): Promise<MCPToolCallResponse>;
  createEnvVars(params: { account_id: string; key: string; value: string; context?: string; scope?: string; site_id?: string }): Promise<MCPToolCallResponse>;
  updateEnvVar(params: { account_id: string; key: string; value: string; context?: string; site_id?: string }): Promise<MCPToolCallResponse>;
  deleteEnvVar(params: { account_id: string; key: string; site_id?: string }): Promise<MCPToolCallResponse>;

  // Build Hooks
  listBuildHooks(params: { site_id: string }): Promise<MCPToolCallResponse>;
  createBuildHook(params: { site_id: string; title: string; branch?: string }): Promise<MCPToolCallResponse>;
  deleteBuildHook(params: { site_id: string; hook_id: string }): Promise<MCPToolCallResponse>;

  // Forms
  listForms(params: { site_id: string }): Promise<MCPToolCallResponse>;
  listFormSubmissions(params: { form_id: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;

  // DNS
  listDnsZones(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getDnsRecords(params: { zone_id: string }): Promise<MCPToolCallResponse>;
  createDnsRecord(params: { dns_zone_id: string; type: string; hostname: string; value: string; ttl?: number; priority?: number }): Promise<MCPToolCallResponse>;
  deleteDnsRecord(params: { record_id: string }): Promise<MCPToolCallResponse>;

  // Functions & Files
  listFunctions(params: { site_id: string }): Promise<MCPToolCallResponse>;
  listFiles(params: { site_id: string }): Promise<MCPToolCallResponse>;

  // Cache
  purgeCache(params?: { site_id?: string; cache_tags?: string }): Promise<MCPToolCallResponse>;
}

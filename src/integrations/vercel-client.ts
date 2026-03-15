/**
 * Vercel Integration Client Types
 * Fully typed interface for Vercel integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Vercel Project
 */
export interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  framework?: string;
  devCommand?: string;
  installCommand?: string;
  buildCommand?: string;
  outputDirectory?: string;
  rootDirectory?: string;
  nodeVersion?: string;
  createdAt: number;
  updatedAt: number;
  latestDeployments?: VercelDeployment[];
  link?: {
    type: string;
    repo: string;
    repoId: number;
    org: string;
    gitCredentialId: string;
    productionBranch: string;
    createdAt: number;
    updatedAt: number;
  };
}

/**
 * Vercel Deployment
 */
export interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  state: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED";
  type: "LAMBDAS";
  created: number;
  createdAt: number;
  buildingAt?: number;
  ready?: number;
  readyState: string;
  target?: "production" | "staging";
  creator: {
    uid: string;
    email: string;
    username: string;
  };
  meta?: Record<string, string>;
  source?: string;
  inspectorUrl?: string;
}

/**
 * Vercel Domain
 */
export interface VercelDomain {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string;
  redirectStatusCode?: number;
  gitBranch?: string;
  updatedAt: number;
  createdAt: number;
  verified: boolean;
  verification?: Array<{
    type: string;
    domain: string;
    value: string;
    reason: string;
  }>;
}

/**
 * Vercel Environment Variable
 */
export interface VercelEnvVar {
  id: string;
  key: string;
  value: string;
  type: "system" | "secret" | "encrypted" | "plain";
  target: Array<"production" | "preview" | "development">;
  gitBranch?: string;
  configurationId?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Vercel Domain Configuration
 */
export interface VercelDomainConfig {
  configuredBy?: "CNAME" | "A" | "http";
  acceptedChallenges?: Array<"dns-01" | "http-01">;
  misconfigured: boolean;
}

/**
 * Vercel DNS Record
 */
export interface VercelDnsRecord {
  id: string;
  slug: string;
  name: string;
  type: "A" | "AAAA" | "ALIAS" | "CAA" | "CNAME" | "MX" | "SRV" | "TXT" | "NS";
  value: string;
  mxPriority?: number;
  priority?: number;
  creator: string;
  created: number;
  updated: number;
  createdAt: number;
  updatedAt: number;
  ttl?: number;
}

/**
 * Vercel Integration Client Interface
 * Provides type-safe methods for all Vercel operations
 */
export interface VercelIntegrationClient {
  /**
   * List projects in Vercel
   * 
   * @example
   * ```typescript
   * const projects = await client.vercel.listProjects({
   *   limit: 20
   * });
   * ```
   */
  listProjects(params?: {
    /** Maximum number of projects to return */
    limit?: number;
    /** Pagination cursor */
    from?: string;
    /** Search query */
    search?: string;
    /** Filter by Git repo */
    repo?: string;
    /** Filter by Git repo ID */
    repoId?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific project
   * 
   * @example
   * ```typescript
   * const project = await client.vercel.getProject({
   *   projectId: "prj_xxxxx"
   * });
   * ```
   */
  getProject(params: {
    /** Project ID or name */
    projectId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List deployments
   * 
   * @example
   * ```typescript
   * const deployments = await client.vercel.listDeployments({
   *   projectId: "prj_xxxxx",
   *   limit: 10
   * });
   * ```
   */
  listDeployments(params?: {
    /** Project ID to filter by */
    projectId?: string;
    /** Team ID to filter by */
    teamId?: string;
    /** Filter by state */
    state?: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED";
    /** Filter by target environment */
    target?: "production" | "staging";
    /** Maximum number of deployments to return */
    limit?: number;
    /** Pagination cursor */
    from?: string;
    /** Return deployments created after this timestamp */
    since?: number;
    /** Return deployments created before this timestamp */
    until?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific deployment
   * 
   * @example
   * ```typescript
   * const deployment = await client.vercel.getDeployment({
   *   deploymentId: "dpl_xxxxx"
   * });
   * ```
   */
  getDeployment(params: {
    /** Deployment ID or URL */
    deploymentId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new deployment
   * 
   * @example
   * ```typescript
   * const deployment = await client.vercel.createDeployment({
   *   name: "my-project",
   *   target: "production"
   * });
   * ```
   */
  createDeployment(params: {
    /** Project name */
    name: string;
    /** Target environment */
    target?: "production" | "staging";
    /** Git source information */
    gitSource?: {
      type: "github" | "gitlab" | "bitbucket";
      ref: string;
      repoId: string | number;
    };
    /** Deployment meta */
    meta?: Record<string, string>;
    /** Force new deployment even if nothing changed */
    forceNew?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Cancel a deployment
   * 
   * @example
   * ```typescript
   * await client.vercel.cancelDeployment({
   *   deploymentId: "dpl_xxxxx"
   * });
   * ```
   */
  cancelDeployment(params: {
    /** Deployment ID to cancel */
    deploymentId: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List domains for a project
   * 
   * @example
   * ```typescript
   * const domains = await client.vercel.listDomains({
   *   projectId: "prj_xxxxx"
   * });
   * ```
   */
  listDomains(params?: {
    /** Project ID to filter by */
    projectId?: string;
    /** Maximum number of domains to return */
    limit?: number;
    /** Pagination cursor */
    since?: number;
    /** Return domains created before this timestamp */
    until?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * List environment variables for a project
   * 
   * @example
   * ```typescript
   * const envVars = await client.vercel.listEnvVars({
   *   projectId: "prj_xxxxx"
   * });
   * ```
   */
  listEnvVars(params: {
    /** Project ID */
    projectId: string;
    /** Filter by target environment */
    target?: "production" | "preview" | "development";
    /** Filter by git branch */
    gitBranch?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get deployment logs
   * 
   * @example
   * ```typescript
   * const logs = await client.vercel.getDeploymentLogs({
   *   deploymentId: "dpl_xxxxx"
   * });
   * ```
   */
  getDeploymentLogs(params: {
    /** Deployment ID */
    deploymentId: string;
    /** Filter by log type */
    type?: "build" | "runtime";
    /** Return logs after this timestamp */
    since?: number;
    /** Return logs before this timestamp */
    until?: number;
    /** Maximum number of log lines */
    limit?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new project
   */
  createProject(params: {
    /** Project name */
    name: string;
    /** Framework preset */
    framework?: string;
    /** Git repository to connect */
    gitRepository?: {
      type: "github" | "gitlab" | "bitbucket";
      repo: string;
    };
  }): Promise<MCPToolCallResponse>;

  /**
   * Update an existing project
   */
  updateProject(params: {
    /** Project ID or name */
    project: string;
    /** New project name */
    name?: string;
    /** Framework preset */
    framework?: string;
    /** Build command override */
    buildCommand?: string;
    /** Output directory override */
    outputDirectory?: string;
    /** Install command override */
    installCommand?: string;
    /** Dev command override */
    devCommand?: string;
    /** Root directory */
    rootDirectory?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a project
   */
  deleteProject(params: {
    /** Project ID or name */
    project: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a deployment
   */
  deleteDeployment(params: {
    /** Deployment ID */
    deployment: string;
    /** Deployment URL (alternative identifier) */
    url?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Promote a deployment to production
   */
  promoteDeployment(params: {
    /** Project ID or name */
    project: string;
    /** Deployment ID to promote */
    deployment: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create an environment variable
   */
  createEnvVar(params: {
    /** Project ID or name */
    project: string;
    /** Variable key */
    key: string;
    /** Variable value */
    value: string;
    /** Target environments */
    target: Array<"production" | "preview" | "development">;
    /** Variable type */
    type?: "system" | "secret" | "encrypted" | "plain";
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete an environment variable
   */
  deleteEnvVar(params: {
    /** Project ID or name */
    project: string;
    /** Environment variable ID */
    id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Add a domain to a project
   */
  addDomain(params: {
    /** Project ID or name */
    project: string;
    /** Domain name to add */
    domain: string;
    /** Redirect target domain */
    redirect?: string;
    /** Redirect status code */
    redirectStatusCode?: 301 | 302 | 307 | 308;
  }): Promise<MCPToolCallResponse>;

  /**
   * Remove a domain from a project
   */
  removeDomain(params: {
    /** Project ID or name */
    project: string;
    /** Domain name to remove */
    domain: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get domain configuration
   */
  getDomainConfig(params: {
    /** Domain name */
    domain: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List DNS records for a domain
   */
  listDnsRecords(params: {
    /** Domain name */
    domain: string;
    /** Maximum number of records to return */
    limit?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a DNS record
   */
  createDnsRecord(params: {
    /** Domain name */
    domain: string;
    /** Record name (subdomain or @ for root) */
    name: string;
    /** DNS record type */
    type: "A" | "AAAA" | "ALIAS" | "CAA" | "CNAME" | "MX" | "SRV" | "TXT" | "NS";
    /** Record value */
    value: string;
    /** TTL in seconds */
    ttl?: number;
    /** MX priority (required for MX records) */
    mxPriority?: number;
  }): Promise<MCPToolCallResponse>;
}


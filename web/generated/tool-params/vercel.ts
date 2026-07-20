/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface VercelListProjectsParams {
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
  }

export interface VercelGetProjectParams {
    /** Project ID or name */
    projectId: string;
  }

export interface VercelListDeploymentsParams {
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
  }

export interface VercelGetDeploymentParams {
    /** Deployment ID or URL */
    deploymentId: string;
  }

export interface VercelCreateDeploymentParams {
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
  }

export interface VercelCancelDeploymentParams {
    /** Deployment ID to cancel */
    deploymentId: string;
  }

export interface VercelListDomainsParams {
    /** Project ID to filter by */
    projectId?: string;
    /** Maximum number of domains to return */
    limit?: number;
    /** Pagination cursor */
    since?: number;
    /** Return domains created before this timestamp */
    until?: number;
  }

export interface VercelListEnvVarsParams {
    /** Project ID */
    projectId: string;
    /** Filter by target environment */
    target?: "production" | "preview" | "development";
    /** Filter by git branch */
    gitBranch?: string;
  }

export interface VercelGetDeploymentLogsParams {
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
  }

export interface VercelCreateProjectParams {
    /** Project name */
    name: string;
    /** Framework preset */
    framework?: string;
    /** Git repository to connect */
    gitRepository?: {
      type: "github" | "gitlab" | "bitbucket";
      repo: string;
    };
  }

export interface VercelUpdateProjectParams {
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
  }

export interface VercelDeleteProjectParams {
    /** Project ID or name */
    project: string;
  }

export interface VercelDeleteDeploymentParams {
    /** Deployment ID */
    deployment: string;
    /** Deployment URL (alternative identifier) */
    url?: string;
  }

export interface VercelPromoteDeploymentParams {
    /** Project ID or name */
    project: string;
    /** Deployment ID to promote */
    deployment: string;
  }

export interface VercelCreateEnvVarParams {
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
  }

export interface VercelDeleteEnvVarParams {
    /** Project ID or name */
    project: string;
    /** Environment variable ID */
    id: string;
  }

export interface VercelAddDomainParams {
    /** Project ID or name */
    project: string;
    /** Domain name to add */
    domain: string;
    /** Redirect target domain */
    redirect?: string;
    /** Redirect status code */
    redirectStatusCode?: 301 | 302 | 307 | 308;
  }

export interface VercelRemoveDomainParams {
    /** Project ID or name */
    project: string;
    /** Domain name to remove */
    domain: string;
  }

export interface VercelGetDomainConfigParams {
    /** Domain name */
    domain: string;
  }

export interface VercelListDnsRecordsParams {
    /** Domain name */
    domain: string;
    /** Maximum number of records to return */
    limit?: number;
  }

export interface VercelCreateDnsRecordParams {
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
  }


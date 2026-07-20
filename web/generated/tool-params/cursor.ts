/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface CursorListAgentsParams {
    /** Filter by status */
    status?: "running" | "completed" | "failed" | "stopped";
    /** Maximum number of results */
    limit?: number;
    /** Pagination offset */
    offset?: number;
  }

export interface CursorGetAgentParams {
    /** Agent ID */
    agent_id: string;
  }

export interface CursorGetConversationParams {
    /** Conversation ID */
    conversation_id: string;
    /** Include messages */
    include_messages?: boolean;
  }

export interface CursorLaunchAgentParams {
    /** Task description */
    task: string;
    /** Model to use */
    model?: string;
    /** Repository context */
    repository?: string;
    /** Additional context */
    context?: Record<string, any>;
    /** Conversation ID to continue */
    conversation_id?: string;
  }

export interface CursorFollowupAgentParams {
    /** Agent ID */
    agent_id: string;
    /** Follow-up instruction */
    instruction: string;
  }

export interface CursorStopAgentParams {
    /** Agent ID */
    agent_id: string;
    /** Reason for stopping */
    reason?: string;
  }

export interface CursorDeleteAgentParams {
    /** Agent ID */
    agent_id: string;
  }

export interface CursorListModelsParams {
    /** Filter by provider */
    provider?: string;
    /** Include capabilities */
    include_capabilities?: boolean;
  }

export interface CursorListRepositoriesParams {
    /** Maximum number of results */
    limit?: number;
    /** Pagination offset */
    offset?: number;
    /** Sort by */
    sort?: "created" | "updated" | "name" | "stars";
    /** Sort order */
    order?: "asc" | "desc";
    /** Filter by visibility */
    visibility?: "public" | "private" | "all";
  }


/**
 * Dropbox Paper Integration Client Types
 * Typed methods map to paper_* MCP tools (Dropbox OAuth, Paper /files API).
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface PaperIntegrationClient {
  createDoc(params: {
    path: string;
    import_format: "html" | "markdown" | "plain_text";
    content: string;
  }): Promise<MCPToolCallResponse>;

  updateDoc(params: {
    path: string;
    import_format: "html" | "markdown" | "plain_text";
    doc_update_policy: "update" | "overwrite" | "append" | "prepend";
    content: string;
    paper_revision?: number;
  }): Promise<MCPToolCallResponse>;

  exportDoc(params: { path: string; export_format?: string }): Promise<MCPToolCallResponse>;
}

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GkeepIntegrationClient {
  listNotes(params?: {
    page_size?: number;
    page_token?: string;
    filter?: string;
  }): Promise<MCPToolCallResponse>;

  getNote(params: {
    name: string;
  }): Promise<MCPToolCallResponse>;

  createTextNote(params: {
    title?: string;
    text: string;
  }): Promise<MCPToolCallResponse>;

  createListNote(params: {
    title?: string;
    /** JSON array of strings or { text, checked, childListItems } objects */
    items: string;
  }): Promise<MCPToolCallResponse>;

  deleteNote(params: {
    name: string;
  }): Promise<MCPToolCallResponse>;

  downloadAttachment(params: {
    name: string;
    mime_type?: string;
  }): Promise<MCPToolCallResponse>;

  batchCreatePermissions(params: {
    parent: string;
    /** JSON array of Google Keep Permission objects */
    permissions: string;
  }): Promise<MCPToolCallResponse>;

  batchDeletePermissions(params: {
    parent: string;
    /** JSON array of permission resource names */
    names: string;
  }): Promise<MCPToolCallResponse>;
}

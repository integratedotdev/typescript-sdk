import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface BoxIntegrationClient {
  getCurrentUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;

  listFolderItems(params: {
    folder_id: string;
    limit?: number;
    offset?: number;
    fields?: string;
  }): Promise<MCPToolCallResponse>;

  getFile(params: {
    file_id: string;
    fields?: string;
  }): Promise<MCPToolCallResponse>;

  getFolder(params: {
    folder_id: string;
    fields?: string;
  }): Promise<MCPToolCallResponse>;

  createFolder(params: {
    parent_id: string;
    name: string;
  }): Promise<MCPToolCallResponse>;

  updateFile(params: {
    file_id: string;
    name?: string;
    description?: string;
    parent_id?: string;
  }): Promise<MCPToolCallResponse>;

  updateFolder(params: {
    folder_id: string;
    name?: string;
    description?: string;
    parent_id?: string;
  }): Promise<MCPToolCallResponse>;

  deleteFile(params: {
    file_id: string;
  }): Promise<MCPToolCallResponse>;

  deleteFolder(params: {
    folder_id: string;
    recursive?: boolean;
  }): Promise<MCPToolCallResponse>;

  uploadTextFile(params: {
    parent_id: string;
    name: string;
    content: string;
  }): Promise<MCPToolCallResponse>;

  downloadFile(params: {
    file_id: string;
  }): Promise<MCPToolCallResponse>;

  search(params: {
    query: string;
    type?: "file" | "folder" | "web_link";
    limit?: number;
    offset?: number;
    fields?: string;
  }): Promise<MCPToolCallResponse>;

  createSharedLink(params: {
    item_type: "file" | "folder";
    item_id: string;
    access?: "open" | "company" | "collaborators";
    can_download?: boolean;
    can_preview?: boolean;
  }): Promise<MCPToolCallResponse>;

  createCollaboration(params: {
    item_type: "file" | "folder";
    item_id: string;
    accessible_by_type: "user" | "group";
    login?: string;
    accessible_by_id?: string;
    role: "editor" | "viewer" | "previewer" | "uploader" | "previewer uploader" | "viewer uploader" | "co-owner";
  }): Promise<MCPToolCallResponse>;

  listComments(params: {
    file_id: string;
    fields?: string;
  }): Promise<MCPToolCallResponse>;

  createComment(params: {
    file_id: string;
    message: string;
  }): Promise<MCPToolCallResponse>;

  deleteComment(params: {
    comment_id: string;
  }): Promise<MCPToolCallResponse>;
}

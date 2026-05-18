import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface MiroIntegrationClient {
  getCurrentUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listBoards(params: { limit?: number; cursor?: string }): Promise<MCPToolCallResponse>;
  getBoard(params: { board_id: string }): Promise<MCPToolCallResponse>;
  createBoard(params: { board_json: string }): Promise<MCPToolCallResponse>;
  listBoardItems(params: { board_id: string; limit?: number; cursor?: string; type?: string }): Promise<MCPToolCallResponse>;
  createBoardItem(params: { board_id: string; item_json: string }): Promise<MCPToolCallResponse>;
  listComments(params: { board_id: string; limit?: number; cursor?: string }): Promise<MCPToolCallResponse>;
  listBoardMembers(params: { board_id: string }): Promise<MCPToolCallResponse>;
}

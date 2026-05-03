/**
 * Monday.com Integration Client Types
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface MondayIntegrationClient {
  me(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listWorkspaces(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listBoards(params: { workspace_ids?: string; limit?: number }): Promise<MCPToolCallResponse>;
  getBoard(params: { board_id: string }): Promise<MCPToolCallResponse>;
  listBoardItems(params: { board_id: string; limit?: number }): Promise<MCPToolCallResponse>;
  nextItemsPage(params: { cursor: string }): Promise<MCPToolCallResponse>;
  getItems(params: { item_ids: string }): Promise<MCPToolCallResponse>;
  createItem(params: {
    board_id: string;
    item_name: string;
    group_id?: string;
    column_values?: string;
  }): Promise<MCPToolCallResponse>;
  updateItemColumns(params: {
    board_id: string;
    item_id: string;
    column_values: string;
  }): Promise<MCPToolCallResponse>;
  createUpdate(params: { item_id: string; body: string }): Promise<MCPToolCallResponse>;
  deleteItem(params: { item_id: string }): Promise<MCPToolCallResponse>;
}

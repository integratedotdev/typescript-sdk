import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface TrelloIntegrationClient {
  getMember(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listBoards(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getBoard(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listLists(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getList(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listCards(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getCard(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  createCard(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  updateCard(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  deleteCard(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  addCardComment(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  search(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
}

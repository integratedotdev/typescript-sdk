import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface PinterestIntegrationClient {
  getUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listBoards(params: { page_size?: number; bookmark?: string }): Promise<MCPToolCallResponse>;
  getBoard(params: { board_id: string }): Promise<MCPToolCallResponse>;
  createPin(params: { pin_json: string }): Promise<MCPToolCallResponse>;
  getPin(params: { pin_id: string }): Promise<MCPToolCallResponse>;
  searchPins(params: { query?: string; ad_account_id?: string; bookmark?: string; page_size?: number }): Promise<MCPToolCallResponse>;
  listAdAccounts(params: { page_size?: number; bookmark?: string }): Promise<MCPToolCallResponse>;
  listCampaigns(params: { ad_account_id: string; page_size?: number; bookmark?: string }): Promise<MCPToolCallResponse>;
}

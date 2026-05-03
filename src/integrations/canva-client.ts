/**
 * Canva Integration Client Types
 * Typed methods map to MCP tool names via camelCase → canva_snake_case
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface CanvaIntegrationClient {
  getMe(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getProfile(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listDesigns(params?: {
    query?: string;
    continuation?: string;
    limit?: number;
    ownership?: string;
    sort_by?: string;
  }): Promise<MCPToolCallResponse>;
  getDesign(params: { design_id: string }): Promise<MCPToolCallResponse>;
  getDesignExportFormats(params: { design_id: string }): Promise<MCPToolCallResponse>;
  createDesign(params: {
    title: string;
    preset_name?: string;
    custom_width?: number;
    custom_height?: number;
    asset_id?: string;
  }): Promise<MCPToolCallResponse>;
  getFolder(params: { folder_id: string }): Promise<MCPToolCallResponse>;
  listFolderItems(params: {
    folder_id: string;
    continuation?: string;
    limit?: number;
    item_types?: string;
    sort_by?: string;
    pin_status?: string;
  }): Promise<MCPToolCallResponse>;
  createFolder(params: { name: string; parent_folder_id: string }): Promise<MCPToolCallResponse>;
  updateFolder(params: { folder_id: string; name: string }): Promise<MCPToolCallResponse>;
  deleteFolder(params: { folder_id: string }): Promise<MCPToolCallResponse>;
  listBrandTemplates(params?: {
    query?: string;
    continuation?: string;
    limit?: number;
    ownership?: string;
    sort_by?: string;
    dataset?: string;
  }): Promise<MCPToolCallResponse>;
  getBrandTemplate(params: { brand_template_id: string }): Promise<MCPToolCallResponse>;
  createExportJob(params: { design_id: string; format: string }): Promise<MCPToolCallResponse>;
  getExportJob(params: { job_id: string }): Promise<MCPToolCallResponse>;
}

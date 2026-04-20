/**
 * Google Slides Integration Client Types
 * Fully typed interface for Google Slides integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GSlidesPresentation {
  presentationId: string;
  pageSize: {
    width: { magnitude: number; unit: string };
    height: { magnitude: number; unit: string };
  };
  slides: Array<{
    objectId: string;
    pageElements?: Array<{
      objectId: string;
      shape?: {
        shapeType: string;
        text?: {
          textElements: Array<{
            textRun?: { content: string; style?: Record<string, any> };
          }>;
        };
      };
    }>;
  }>;
  title: string;
  revisionId: string;
}

export interface GSlidesIntegrationClient {
  list(params?: {
    page_size?: number;
    page_token?: string;
    query?: string;
  }): Promise<MCPToolCallResponse>;

  get(params: {
    presentation_id: string;
  }): Promise<MCPToolCallResponse>;

  getPage(params: {
    presentation_id: string;
    page_id: string;
  }): Promise<MCPToolCallResponse>;

  create(params: {
    title: string;
  }): Promise<MCPToolCallResponse>;

  addSlide(params: {
    presentation_id: string;
    insertion_index?: number;
    layout?: "BLANK" | "TITLE" | "TITLE_AND_BODY" | "TITLE_AND_TWO_COLUMNS" | "TITLE_ONLY" | "SECTION_HEADER" | "SECTION_TITLE_AND_DESCRIPTION" | "ONE_COLUMN_TEXT" | "MAIN_POINT" | "BIG_NUMBER";
  }): Promise<MCPToolCallResponse>;

  deleteSlide(params: {
    presentation_id: string;
    page_id: string;
  }): Promise<MCPToolCallResponse>;

  updateText(params: {
    presentation_id: string;
    find: string;
    replace: string;
    match_case?: boolean;
  }): Promise<MCPToolCallResponse>;
}

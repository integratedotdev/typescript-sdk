/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface GoogleSlidesListParams {
    page_size?: number;
    page_token?: string;
    query?: string;
  }

export interface GoogleSlidesGetParams {
    presentation_id: string;
  }

export interface GoogleSlidesGetPageParams {
    presentation_id: string;
    page_id: string;
  }

export interface GoogleSlidesCreateParams {
    title: string;
  }

export interface GoogleSlidesDeleteParams {
    presentation_id: string;
  }

export interface GoogleSlidesAddSlideParams {
    presentation_id: string;
    insertion_index?: number;
    layout?: "BLANK" | "TITLE" | "TITLE_AND_BODY" | "TITLE_AND_TWO_COLUMNS" | "TITLE_ONLY" | "SECTION_HEADER" | "SECTION_TITLE_AND_DESCRIPTION" | "ONE_COLUMN_TEXT" | "MAIN_POINT" | "BIG_NUMBER";
  }

export interface GoogleSlidesDeleteSlideParams {
    presentation_id: string;
    page_id: string;
  }

export interface GoogleSlidesUpdateTextParams {
    presentation_id: string;
    find: string;
    replace: string;
    match_case?: boolean;
  }

export interface GoogleSlidesBatchUpdateParams {
    presentation_id: string;
    requests: string;
    write_control?: string;
  }


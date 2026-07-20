/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface OnenoteListNotebooksParams {
    "$top"?: number;
    "$skip"?: number;
  }

export interface OnenoteGetNotebookParams {
    "notebook_id": string;
  }

export interface OnenoteListSectionsParams {
    "notebook_id": string;
    "$top"?: number;
    "$skip"?: number;
  }

export interface OnenoteCreateSectionParams {
    "notebook_id": string;
    "section_json": string;
  }

export interface OnenoteListPagesParams {
    "section_id": string;
    "$top"?: number;
    "$skip"?: number;
  }

export interface OnenoteGetPageParams {
    "page_id": string;
  }


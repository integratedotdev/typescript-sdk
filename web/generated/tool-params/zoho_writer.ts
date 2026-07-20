/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ZohoWriterListDocumentsParams {
    "page"?: number;
    "per_page"?: number;
  }

export interface ZohoWriterGetDocumentParams {
    "document_id": string;
  }

export interface ZohoWriterCreateDocumentParams {
    "document_json": string;
  }

export interface ZohoWriterListTemplatesParams {
    "page"?: number;
    "per_page"?: number;
  }

export interface ZohoWriterMergeDocumentParams {
    "document_id": string;
    "merge_json": string;
  }

export interface ZohoWriterExportDocumentParams {
    "document_id": string;
    "format"?: string;
  }


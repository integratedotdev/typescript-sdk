/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface PaperCreateDocParams {
    path: string;
    import_format: "html" | "markdown" | "plain_text";
    content: string;
  }

export interface PaperUpdateDocParams {
    path: string;
    import_format: "html" | "markdown" | "plain_text";
    doc_update_policy: "update" | "overwrite" | "append" | "prepend";
    content: string;
    paper_revision?: number;
  }

export interface PaperExportDocParams { path: string; export_format?: string }


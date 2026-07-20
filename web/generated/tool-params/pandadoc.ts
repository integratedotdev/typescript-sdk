/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface PandadocListDocumentsParams { "q"?: string; "status"?: string; "count"?: number; "page"?: number }

export interface PandadocGetDocumentParams { document_id: string }

export interface PandadocCreateDocumentParams { document_json: string }

export interface PandadocSendDocumentParams { document_id: string; send_json: string }

export interface PandadocListTemplatesParams { "q"?: string; "count"?: number; "page"?: number }

export interface PandadocCreateSessionParams { document_id: string; session_json: string }


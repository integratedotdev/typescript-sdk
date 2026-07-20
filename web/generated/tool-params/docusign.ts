/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface DocusignListEnvelopesParams { account_id: string; from_date?: string; status?: string; count?: number; start_position?: number; base_uri: string }

export interface DocusignGetEnvelopeParams { account_id: string; envelope_id: string; base_uri: string }

export interface DocusignCreateEnvelopeParams { account_id: string; envelope_json: string; base_uri: string }

export interface DocusignListRecipientsParams { account_id: string; envelope_id: string; base_uri: string }

export interface DocusignGetDocumentParams { account_id: string; envelope_id: string; document_id: string; base_uri: string }

export interface DocusignListTemplatesParams { account_id: string; count?: number; start_position?: number; search_text?: string; base_uri: string }


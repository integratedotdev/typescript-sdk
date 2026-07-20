/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ZohoMailListFoldersParams { account_id: string }

export interface ZohoMailListMessagesParams { account_id: string; folderId?: string; limit?: number; start?: number }

export interface ZohoMailGetMessageParams { account_id: string; message_id: string }

export interface ZohoMailSendMessageParams { account_id: string; message_json: string }

export interface ZohoMailSearchMessagesParams { account_id: string; searchKey?: string; limit?: number; start?: number }

export interface ZohoMailListLabelsParams { account_id: string }


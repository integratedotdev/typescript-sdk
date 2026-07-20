/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface AirtableListBasesParams {
    /** Offset for pagination */
    offset?: string;
  }

export interface AirtableGetBaseParams {
    /** Base ID */
    baseId: string;
  }

export interface AirtableListTablesParams {
    /** Base ID */
    baseId: string;
  }

export interface AirtableGetTableParams {
    /** Base ID */
    baseId: string;
    /** Table ID or name */
    tableId: string;
  }

export interface AirtableListRecordsParams {
    /** Base ID */
    baseId: string;
    /** Table ID or name */
    tableId: string;
    /** Fields to include */
    fields?: string[];
    /** Filter by formula */
    filterByFormula?: string;
    /** Maximum records to return */
    maxRecords?: number;
    /** Page size */
    pageSize?: number;
    /** Sort configuration */
    sort?: Array<{
      field: string;
      direction?: "asc" | "desc";
    }>;
    /** View ID or name */
    view?: string;
    /** Cell format */
    cellFormat?: "json" | "string";
    /** Time zone */
    timeZone?: string;
    /** User locale */
    userLocale?: string;
    /** Offset for pagination */
    offset?: string;
  }

export interface AirtableGetRecordParams {
    /** Base ID */
    baseId: string;
    /** Table ID or name */
    tableId: string;
    /** Record ID */
    recordId: string;
    /** Cell format */
    cellFormat?: "json" | "string";
    /** Time zone */
    timeZone?: string;
    /** User locale */
    userLocale?: string;
  }

export interface AirtableCreateRecordParams {
    /** Base ID */
    baseId: string;
    /** Table ID or name */
    tableId: string;
    /** Record fields */
    fields: Record<string, unknown>;
    /** Whether to typecast values */
    typecast?: boolean;
  }

export interface AirtableUpdateRecordParams {
    /** Base ID */
    baseId: string;
    /** Table ID or name */
    tableId: string;
    /** Record ID */
    recordId: string;
    /** Fields to update */
    fields: Record<string, unknown>;
    /** Whether to typecast values */
    typecast?: boolean;
  }

export interface AirtableSearchRecordsParams {
    /** Base ID */
    baseId: string;
    /** Table ID or name */
    tableId: string;
    /** Airtable formula to filter records */
    filterByFormula: string;
    /** Fields to include in results */
    fields?: string[];
    /** Maximum records to return */
    maxRecords?: number;
    /** Sort configuration */
    sort?: Array<{
      field: string;
      direction?: "asc" | "desc";
    }>;
    /** View ID or name */
    view?: string;
  }

export interface AirtableDeleteRecordParams {
    /** Base ID */
    base_id: string;
    /** Table ID or name */
    table_id: string;
    /** Record ID */
    record_id: string;
  }

export interface AirtableCreateBaseParams {
    /** Workspace ID */
    workspace_id: string;
    /** Base name */
    name: string;
    /** Tables configuration as JSON string */
    tables_json: string;
  }

export interface AirtableCreateTableParams {
    /** Base ID */
    base_id: string;
    /** Table name */
    name: string;
    /** Fields configuration as JSON string */
    fields_json: string;
    /** Table description */
    description?: string;
  }

export interface AirtableUpdateTableParams {
    /** Base ID */
    base_id: string;
    /** Table ID */
    table_id: string;
    /** New table name */
    name?: string;
    /** New table description */
    description?: string;
  }

export interface AirtableCreateFieldParams {
    /** Base ID */
    base_id: string;
    /** Table ID */
    table_id: string;
    /** Field name */
    name: string;
    /** Field type */
    type: string;
    /** Field description */
    description?: string;
    /** Field options as JSON string */
    options_json?: string;
  }

export interface AirtableUpdateFieldParams {
    /** Base ID */
    base_id: string;
    /** Table ID */
    table_id: string;
    /** Field ID */
    field_id: string;
    /** New field name */
    name?: string;
    /** New field description */
    description?: string;
  }

export interface AirtableListCommentsParams {
    /** Base ID */
    base_id: string;
    /** Table ID */
    table_id: string;
    /** Record ID */
    record_id: string;
    /** Pagination offset */
    offset?: string;
    /** Page size */
    page_size?: number;
  }

export interface AirtableCreateCommentParams {
    /** Base ID */
    base_id: string;
    /** Table ID */
    table_id: string;
    /** Record ID */
    record_id: string;
    /** Comment text */
    text: string;
  }

export interface AirtableUpdateCommentParams {
    /** Base ID */
    base_id: string;
    /** Table ID */
    table_id: string;
    /** Record ID */
    record_id: string;
    /** Comment ID */
    comment_id: string;
    /** New comment text */
    text: string;
  }

export interface AirtableDeleteCommentParams {
    /** Base ID */
    base_id: string;
    /** Table ID */
    table_id: string;
    /** Record ID */
    record_id: string;
    /** Comment ID */
    comment_id: string;
  }

export interface AirtableListWebhooksParams {
    /** Base ID */
    base_id: string;
  }

export interface AirtableCreateWebhookParams {
    /** Base ID */
    base_id: string;
    /** Webhook specification as JSON string */
    specification_json: string;
    /** Notification URL */
    notification_url?: string;
  }

export interface AirtableDeleteWebhookParams {
    /** Base ID */
    base_id: string;
    /** Webhook ID */
    webhook_id: string;
  }

export interface AirtableListWebhookPayloadsParams {
    /** Base ID */
    base_id: string;
    /** Webhook ID */
    webhook_id: string;
    /** Cursor for pagination */
    cursor?: string;
  }

export interface AirtableRefreshWebhookParams {
    /** Base ID */
    base_id: string;
    /** Webhook ID */
    webhook_id: string;
  }


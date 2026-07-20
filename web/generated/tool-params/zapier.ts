/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ZapierListZapsParams {
    limit?: number;
    offset?: number;
    expand?: string;
    include_shared?: boolean;
    inputs?: string;
  }

export interface ZapierListAppsParams {
    category?: string;
    query?: string;
    ids?: string;
    limit?: number;
    offset?: number;
  }

export interface ZapierListActionsParams { app: string; action_type?: string }

export interface ZapierListAuthenticationsParams { app: string; limit?: number; offset?: number }

export interface ZapierListZapRunsParams {
    zap_id?: number;
    from_date?: string;
    to_date?: string;
    statuses?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }


/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface CloudflareListAccountsParams {
    name?: string;
    direction?: string;
    page?: number;
    per_page?: number;
  }

export interface CloudflareGetAccountParams { account_id: string }

export interface CloudflareListZonesParams {
    account_id?: string;
    name?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }

export interface CloudflareGetZoneParams { zone_id: string }

export interface CloudflareListDnsRecordsParams {
    zone_id: string;
    type?: string;
    name?: string;
    content?: string;
    page?: number;
    per_page?: number;
  }

export interface CloudflareCreateDnsRecordParams {
    zone_id: string;
    type: string;
    name: string;
    content: string;
    ttl?: number;
    priority?: number;
    proxied?: boolean;
  }

export interface CloudflareUpdateDnsRecordParams {
    zone_id: string;
    record_id: string;
    type: string;
    name: string;
    content: string;
    ttl?: number;
    priority?: number;
    proxied?: boolean;
  }

export interface CloudflareDeleteDnsRecordParams { zone_id: string; record_id: string }

export interface CloudflarePurgeZoneCacheParams {
    zone_id: string;
    purge_everything?: boolean;
    files?: string;
    hosts?: string;
    tags?: string;
  }

export interface CloudflareListWorkerScriptsParams { account_id: string }


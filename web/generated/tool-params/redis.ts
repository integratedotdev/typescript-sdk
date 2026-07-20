/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface RedisGetSubscriptionParams { subscription_id: string }

export interface RedisGetFixedSubscriptionParams { subscription_id: string }

export interface RedisListDatabasesParams { subscription_id: string }

export interface RedisGetDatabaseParams { subscription_id: string; database_id: string }

export interface RedisCreateDatabaseParams {
    subscription_id: string;
    name: string;
    dataset_size_gb?: number;
    protocol?: string;
    extra_json?: string;
  }

export interface RedisUpdateDatabaseParams {
    subscription_id: string;
    database_id: string;
    extra_json: string;
  }

export interface RedisDeleteDatabaseParams { subscription_id: string; database_id: string }

export interface RedisListEssentialsDatabasesParams { subscription_id: string }

export interface RedisGetEssentialsDatabaseParams { subscription_id: string; database_id: string }

export interface RedisCreateEssentialsDatabaseParams {
    subscription_id: string;
    name: string;
    extra_json?: string;
  }

export interface RedisUpdateEssentialsDatabaseParams {
    subscription_id: string;
    database_id: string;
    extra_json: string;
  }

export interface RedisDeleteEssentialsDatabaseParams { subscription_id: string; database_id: string }

export interface RedisGetTaskParams { task_id: string }

export interface RedisListLogsParams { limit?: number; offset?: number }


/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface UpstashRedisRunParams { command: unknown[] }

export interface UpstashRedisGetParams { key: string }

export interface UpstashRedisSetParams { key: string; value: string; ex?: number }

export interface UpstashRedisDelParams { keys: string }

export interface UpstashQstashPublishParams {
    destination: string;
    body?: string;
    content_type?: string;
    delay?: string;
    method?: string;
  }


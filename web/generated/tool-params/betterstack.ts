/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface BetterstackListSourcesParams {
    page?: number;
    per_page?: number;
    team_name?: string;
  }

export interface BetterstackGetSourceParams { source_id: string }

export interface BetterstackCreateSourceParams {
    name: string;
    platform: string;
    data_region: string;
    source_group_id?: number;
  }

export interface BetterstackUpdateSourceParams {
    source_id: string;
    name?: string;
    ingesting_paused?: boolean;
    source_group_id?: number;
    live_tail_pattern?: string;
    logs_retention?: number;
    metrics_retention?: number;
    vrl_transformation?: string;
  }

export interface BetterstackDeleteSourceParams { source_id: string }

export interface BetterstackListSourceGroupsParams {
    page?: number;
    per_page?: number;
    team_name?: string;
  }

export interface BetterstackGetSourceGroupParams { source_group_id: string }

export interface BetterstackUpdateSourceGroupParams {
    source_group_id: string;
    name?: string;
    sort_index?: number;
  }

export interface BetterstackListCollectorsParams {
    name?: string;
    team_name?: string;
    page?: number;
    per_page?: number;
  }

export interface BetterstackListSourceMetricsParams { source_id: string }

export interface BetterstackIngestLogsParams {
    ingesting_host: string;
    source_token: string;
    payload: string;
  }


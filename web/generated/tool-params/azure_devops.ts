/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface AzureDevopsListProjectsParams {
    "organization": string;
  }

export interface AzureDevopsListRepositoriesParams {
    "organization": string;
    "project": string;
  }

export interface AzureDevopsListPullRequestsParams {
    "organization": string;
    "project": string;
    "repository_id": string;
    "searchCriteria.status"?: string;
  }

export interface AzureDevopsListBuildsParams {
    "organization": string;
    "project": string;
  }

export interface AzureDevopsQueueBuildParams {
    "organization": string;
    "project": string;
    "build_json": string;
  }

export interface AzureDevopsGetWorkItemParams {
    "organization": string;
    "work_item_id": string;
  }


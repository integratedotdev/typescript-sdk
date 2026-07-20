/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface FirebaseListProjectsParams {
    "pageSize"?: number;
    "pageToken"?: string;
  }

export interface FirebaseGetProjectParams {
    "project_id": string;
  }

export interface FirebaseListWebAppsParams {
    "project_id": string;
  }

export interface FirebaseListAndroidAppsParams {
    "project_id": string;
  }

export interface FirebaseListIosAppsParams {
    "project_id": string;
  }

export interface FirebaseCreateWebAppParams {
    "project_id": string;
    "app_json": string;
  }


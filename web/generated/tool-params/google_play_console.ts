/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface GooglePlayConsoleInsertEditParams {
    "package_name": string;
    "edit_json": string;
  }

export interface GooglePlayConsoleGetEditParams {
    "package_name": string;
    "edit_id": string;
  }

export interface GooglePlayConsoleListTracksParams {
    "package_name": string;
    "edit_id": string;
  }

export interface GooglePlayConsoleUpdateTrackParams {
    "package_name": string;
    "edit_id": string;
    "track": string;
    "track_json": string;
  }

export interface GooglePlayConsoleCommitEditParams {
    "package_name": string;
    "edit_id": string;
    "commit_json": string;
  }

export interface GooglePlayConsoleListInAppProductsParams {
    "package_name": string;
  }


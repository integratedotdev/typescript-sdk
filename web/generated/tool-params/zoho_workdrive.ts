/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface ZohoWorkdriveListTeamFoldersParams {
    "page[limit]"?: number;
    "page[offset]"?: number;
  }

export interface ZohoWorkdriveGetTeamFolderParams {
    "folder_id": string;
  }

export interface ZohoWorkdriveListFilesParams {
    "parent_id"?: string;
    "page[limit]"?: number;
    "page[offset]"?: number;
  }

export interface ZohoWorkdriveGetFileParams {
    "file_id": string;
  }

export interface ZohoWorkdriveCreateFolderParams {
    "folder_json": string;
  }


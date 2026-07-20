/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface SonosListGroupsParams { household_id: string }

export interface SonosGetPlaybackStatusParams { group_id: string }

export interface SonosControlPlaybackParams { group_id: string; command: string; command_json: string }

export interface SonosGetGroupVolumeParams { group_id: string }

export interface SonosSetGroupVolumeParams { group_id: string; volume_json: string }


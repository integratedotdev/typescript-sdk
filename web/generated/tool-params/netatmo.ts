/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface NetatmoGetHomesdataParams { "home_id"?: string; "gateway_types"?: string }

export interface NetatmoGetStationsdataParams { "device_id"?: string; "get_favorites"?: boolean }

export interface NetatmoGetMeasureParams { "device_id"?: string; "module_id"?: string; "scale"?: string; "type"?: string; "date_begin"?: string; "date_end"?: string }

export interface NetatmoSetThermpointParams { setpoint_json: string }

export interface NetatmoGetEventsParams { "home_id"?: string; "person_id"?: string; "event_id"?: string; "size"?: string }


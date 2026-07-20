/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface SmartthingsGetLocationParams { location_id: string }

export interface SmartthingsListRoomsParams { location_id: string }

export interface SmartthingsGetRoomParams { location_id: string; room_id: string }

export interface SmartthingsListDevicesParams { locationId?: string; roomId?: string; capability?: string; deviceId?: string }

export interface SmartthingsGetDeviceParams { device_id: string }

export interface SmartthingsGetDeviceStatusParams { device_id: string }

export interface SmartthingsExecuteDeviceCommandParams { device_id: string; commands_json: string }

export interface SmartthingsListScenesParams { locationId?: string }

export interface SmartthingsExecuteSceneParams { scene_id: string }

export interface SmartthingsListRulesParams { locationId?: string }

export interface SmartthingsGetRuleParams { rule_id: string; locationId?: string }

export interface SmartthingsCreateRuleParams { locationId?: string; rule_json: string }

export interface SmartthingsUpdateRuleParams { rule_id: string; locationId?: string; rule_json: string }

export interface SmartthingsDeleteRuleParams { rule_id: string; locationId?: string }


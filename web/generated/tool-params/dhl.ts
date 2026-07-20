/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface DhlTrackShipmentParams { "trackingNumber"?: string; "service"?: string }

export interface DhlCreateShipmentParams { shipment_json: string }

export interface DhlGetLabelParams { shipment_number: string }

export interface DhlDeleteShipmentParams { shipment_number: string }

export interface DhlValidateAddressParams { address_json: string }


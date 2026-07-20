/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface MicrosoftBookingsListBusinessesParams {
    "$top"?: number;
    "$skip"?: number;
  }

export interface MicrosoftBookingsGetBusinessParams {
    "business_id": string;
  }

export interface MicrosoftBookingsListServicesParams {
    "business_id": string;
  }

export interface MicrosoftBookingsListStaffMembersParams {
    "business_id": string;
  }

export interface MicrosoftBookingsListAppointmentsParams {
    "business_id": string;
    "$top"?: number;
    "$skip"?: number;
  }

export interface MicrosoftBookingsCreateAppointmentParams {
    "business_id": string;
    "appointment_json": string;
  }


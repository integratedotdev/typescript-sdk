/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface WhatsappSendMessageParams {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number in E.164 format */
    to: string;
    /** Message body text */
    text: string;
  }

export interface WhatsappReplyMessageParams {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number */
    to: string;
    /** The wamid of the message to reply to */
    message_id: string;
    /** Reply text */
    text: string;
  }

export interface WhatsappSendTemplateParams {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number */
    to: string;
    /** Approved template name */
    template_name: string;
    /** Language code e.g. en_US, es, pt_BR */
    language_code: string;
    /** JSON array of component objects for variable substitution */
    components?: string;
  }

export interface WhatsappSendMediaParams {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number */
    to: string;
    /** image, video, document, or audio */
    media_type: "image" | "video" | "document" | "audio";
    /** Publicly accessible URL to the media file */
    media_url: string;
    /** Caption text (supported for image, video, document) */
    caption?: string;
  }

export interface WhatsappSendReactionParams {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number */
    to: string;
    /** The wamid of the message to react to */
    message_id: string;
    /** A single emoji character */
    emoji: string;
  }

export interface WhatsappSendLocationParams {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number */
    to: string;
    /** Decimal latitude */
    latitude: string;
    /** Decimal longitude */
    longitude: string;
    /** Location name */
    name?: string;
    /** Address string */
    address?: string;
  }

export interface WhatsappSendContactParams {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number */
    to: string;
    /** JSON array of contact objects */
    contacts: string;
  }

export interface WhatsappSendInteractiveButtonsParams {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number */
    to: string;
    /** Main message body */
    body_text: string;
    /** JSON array of 1–3 button objects [{"id":"btn1","title":"Yes"}] */
    buttons: string;
    /** Optional header above the body */
    header_text?: string;
    /** Optional footer below the buttons */
    footer_text?: string;
  }

export interface WhatsappSendInteractiveListParams {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number */
    to: string;
    /** Main message body */
    body_text: string;
    /** Label on the button that opens the list (max 20 chars) */
    button_text: string;
    /** JSON array of section objects */
    sections: string;
    /** Optional header */
    header_text?: string;
    /** Optional footer */
    footer_text?: string;
  }

export interface WhatsappMarkReadParams {
    /** Your phone number ID */
    phone_number_id: string;
    /** The wamid of the received message */
    message_id: string;
  }

export interface WhatsappGetMediaUrlParams {
    /** Media object ID (from webhook payload) */
    media_id: string;
    /** Your phone number ID */
    phone_number_id: string;
  }

export interface WhatsappDeleteMediaParams {
    /** Media object ID */
    media_id: string;
    /** Your phone number ID */
    phone_number_id: string;
  }

export interface WhatsappListTemplatesParams {
    /** WABA ID */
    business_account_id: string;
  }

export interface WhatsappGetTemplateParams {
    /** WABA ID */
    business_account_id: string;
    /** Template name */
    name: string;
  }

export interface WhatsappCreateTemplateParams {
    /** WABA ID */
    business_account_id: string;
    /** Template name — lowercase letters, numbers, underscores only */
    name: string;
    /** Language code e.g. en_US */
    language: string;
    /** MARKETING, UTILITY, or AUTHENTICATION */
    category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
    /** JSON array of component objects */
    components: string;
  }

export interface WhatsappDeleteTemplateParams {
    /** WABA ID */
    business_account_id: string;
    /** Template name to delete */
    name: string;
  }

export interface WhatsappGetPhoneNumbersParams {
    /** WABA ID */
    business_account_id: string;
  }

export interface WhatsappGetPhoneNumberParams {
    /** Phone number ID */
    phone_number_id: string;
  }

export interface WhatsappGetProfileParams {
    /** Phone number ID */
    phone_number_id: string;
  }

export interface WhatsappUpdateProfileParams {
    /** Phone number ID */
    phone_number_id: string;
    /** Short about text (max 139 chars) */
    about?: string;
    /** Business address */
    address?: string;
    /** Business description */
    description?: string;
    /** Business email */
    email?: string;
    /** Industry vertical */
    vertical?: string;
    /** JSON array of URLs (max 2) */
    websites?: string;
  }

export interface WhatsappGetMessageStatusParams {
    /** The wamid of the message */
    message_id: string;
  }

export interface WhatsappCreateQrCodeParams {
    /** Phone number ID */
    phone_number_id: string;
    /** Message text to prefill when QR is scanned */
    prefilled_message: string;
    /** Optional image generation format */
    generate_qr_image?: "PNG" | "SVG";
  }

export interface WhatsappUpdateQrCodeParams {
    phone_number_id: string;
    code: string;
    prefilled_message?: string;
    generate_qr_image?: "PNG" | "SVG";
  }

export interface WhatsappListQrCodesParams {
    /** Phone number ID */
    phone_number_id: string;
    fields?: string;
    code?: string;
    limit?: number;
    after?: string;
    before?: string;
  }

export interface WhatsappGetQrCodeParams {
    phone_number_id: string;
    code: string;
    fields?: string;
  }

export interface WhatsappDeleteQrCodeParams {
    phone_number_id: string;
    code: string;
  }


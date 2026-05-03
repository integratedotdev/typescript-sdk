/**
 * WhatsApp Business Integration Client Types
 * Fully typed interface for WhatsApp Business Cloud API methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface WhatsAppSendResult {
  messages: Array<{ id: string }>;
  contacts: Array<{ input: string; wa_id: string }>;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "PAUSED" | "DISABLED";
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language: string;
  components: Array<{
    type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
    format?: string;
    text?: string;
    buttons?: Array<{ type: string; text: string; url?: string }>;
  }>;
}

export interface WhatsAppPhoneNumber {
  id: string;
  display_phone_number: string;
  verified_name: string;
  code_verification_status: string;
  quality_rating: "GREEN" | "YELLOW" | "RED";
  platform_type: string;
  throughput: { level: string };
}

export interface WhatsAppBusinessProfile {
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  profile_picture_url?: string;
  websites?: string[];
  vertical?: string;
}

/**
 * WhatsApp Business Integration Client Interface
 */
export interface WhatsAppIntegrationClient {
  /**
   * Send a plain text message
   *
   * @example
   * ```typescript
   * await client.whatsapp.sendMessage({
   *   phone_number_id: "123456789",
   *   to: "+15551234567",
   *   text: "Hello!",
   * });
   * ```
   */
  sendMessage(params: {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number in E.164 format */
    to: string;
    /** Message body text */
    text: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Reply to a specific message (quoted reply)
   *
   * @example
   * ```typescript
   * await client.whatsapp.replyMessage({
   *   phone_number_id: "123456789",
   *   to: "+15551234567",
   *   message_id: "wamid.XXX",
   *   text: "Got it!",
   * });
   * ```
   */
  replyMessage(params: {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number */
    to: string;
    /** The wamid of the message to reply to */
    message_id: string;
    /** Reply text */
    text: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Send a pre-approved template message
   *
   * @example
   * ```typescript
   * await client.whatsapp.sendTemplate({
   *   phone_number_id: "123456789",
   *   to: "+15551234567",
   *   template_name: "order_confirmation",
   *   language_code: "en_US",
   *   components: JSON.stringify([{
   *     type: "body",
   *     parameters: [{ type: "text", text: "Alice" }, { type: "text", text: "ORDER-123" }],
   *   }]),
   * });
   * ```
   */
  sendTemplate(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Send an image, video, document, or audio file by URL
   *
   * @example
   * ```typescript
   * await client.whatsapp.sendMedia({
   *   phone_number_id: "123456789",
   *   to: "+15551234567",
   *   media_type: "image",
   *   media_url: "https://example.com/photo.jpg",
   *   caption: "Check this out",
   * });
   * ```
   */
  sendMedia(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * React to a message with an emoji
   *
   * @example
   * ```typescript
   * await client.whatsapp.sendReaction({
   *   phone_number_id: "123456789",
   *   to: "+15551234567",
   *   message_id: "wamid.XXX",
   *   emoji: "👍",
   * });
   * ```
   */
  sendReaction(params: {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number */
    to: string;
    /** The wamid of the message to react to */
    message_id: string;
    /** A single emoji character */
    emoji: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Send a location pin
   *
   * @example
   * ```typescript
   * await client.whatsapp.sendLocation({
   *   phone_number_id: "123456789",
   *   to: "+15551234567",
   *   latitude: "37.7749",
   *   longitude: "-122.4194",
   *   name: "Golden Gate Park",
   * });
   * ```
   */
  sendLocation(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Send one or more vCard-style contact cards
   *
   * @example
   * ```typescript
   * await client.whatsapp.sendContact({
   *   phone_number_id: "123456789",
   *   to: "+15551234567",
   *   contacts: JSON.stringify([{
   *     name: { formatted_name: "Alice Smith", first_name: "Alice", last_name: "Smith" },
   *     phones: [{ phone: "+15551234567", type: "CELL" }],
   *   }]),
   * });
   * ```
   */
  sendContact(params: {
    /** Sending phone number ID */
    phone_number_id: string;
    /** Recipient phone number */
    to: string;
    /** JSON array of contact objects */
    contacts: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Send a message with up to 3 quick-reply buttons
   *
   * @example
   * ```typescript
   * await client.whatsapp.sendInteractiveButtons({
   *   phone_number_id: "123456789",
   *   to: "+15551234567",
   *   body_text: "Do you confirm your order?",
   *   buttons: JSON.stringify([{ id: "yes", title: "Yes" }, { id: "no", title: "No" }]),
   * });
   * ```
   */
  sendInteractiveButtons(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Send a message with a scrollable list of options
   *
   * @example
   * ```typescript
   * await client.whatsapp.sendInteractiveList({
   *   phone_number_id: "123456789",
   *   to: "+15551234567",
   *   body_text: "Choose your shipping method",
   *   button_text: "See options",
   *   sections: JSON.stringify([{
   *     title: "Shipping",
   *     rows: [
   *       { id: "standard", title: "Standard (5-7 days)", description: "Free" },
   *       { id: "express", title: "Express (1-2 days)", description: "$9.99" },
   *     ],
   *   }]),
   * });
   * ```
   */
  sendInteractiveList(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Mark a received message as read (shows blue ticks to sender)
   *
   * @example
   * ```typescript
   * await client.whatsapp.markRead({
   *   phone_number_id: "123456789",
   *   message_id: "wamid.XXX",
   * });
   * ```
   */
  markRead(params: {
    /** Your phone number ID */
    phone_number_id: string;
    /** The wamid of the received message */
    message_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get the download URL and metadata for a received media object
   *
   * @example
   * ```typescript
   * const media = await client.whatsapp.getMediaUrl({
   *   media_id: "media123",
   *   phone_number_id: "123456789",
   * });
   * // media.url expires in ~5 minutes — download promptly
   * ```
   */
  getMediaUrl(params: {
    /** Media object ID (from webhook payload) */
    media_id: string;
    /** Your phone number ID */
    phone_number_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete an uploaded media object from Meta's servers
   *
   * @example
   * ```typescript
   * await client.whatsapp.deleteMedia({ media_id: "media123", phone_number_id: "123456789" });
   * ```
   */
  deleteMedia(params: {
    /** Media object ID */
    media_id: string;
    /** Your phone number ID */
    phone_number_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List all message templates for a WhatsApp Business Account
   *
   * @example
   * ```typescript
   * const templates = await client.whatsapp.listTemplates({ business_account_id: "WABA123" });
   * ```
   */
  listTemplates(params: {
    /** WABA ID */
    business_account_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get a specific template by name
   *
   * @example
   * ```typescript
   * const tpl = await client.whatsapp.getTemplate({ business_account_id: "WABA123", name: "order_confirmation" });
   * ```
   */
  getTemplate(params: {
    /** WABA ID */
    business_account_id: string;
    /** Template name */
    name: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a new message template (submitted for Meta review)
   *
   * @example
   * ```typescript
   * await client.whatsapp.createTemplate({
   *   business_account_id: "WABA123",
   *   name: "order_ready",
   *   language: "en_US",
   *   category: "UTILITY",
   *   components: JSON.stringify([
   *     { type: "BODY", text: "Hi {{1}}, your order {{2}} is ready for pickup." },
   *   ]),
   * });
   * ```
   */
  createTemplate(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete a template by name (all language variants)
   *
   * @example
   * ```typescript
   * await client.whatsapp.deleteTemplate({ business_account_id: "WABA123", name: "old_promo" });
   * ```
   */
  deleteTemplate(params: {
    /** WABA ID */
    business_account_id: string;
    /** Template name to delete */
    name: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List all phone numbers registered to a WABA
   *
   * @example
   * ```typescript
   * const numbers = await client.whatsapp.getPhoneNumbers({ business_account_id: "WABA123" });
   * ```
   */
  getPhoneNumbers(params: {
    /** WABA ID */
    business_account_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get full details for a specific phone number
   *
   * @example
   * ```typescript
   * const number = await client.whatsapp.getPhoneNumber({ phone_number_id: "123456789" });
   * ```
   */
  getPhoneNumber(params: {
    /** Phone number ID */
    phone_number_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get the public business profile for a phone number
   *
   * @example
   * ```typescript
   * const profile = await client.whatsapp.getProfile({ phone_number_id: "123456789" });
   * ```
   */
  getProfile(params: {
    /** Phone number ID */
    phone_number_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Update the business profile (pass only the fields you want to change)
   *
   * @example
   * ```typescript
   * await client.whatsapp.updateProfile({
   *   phone_number_id: "123456789",
   *   about: "Best prices guaranteed",
   *   email: "support@example.com",
   * });
   * ```
   */
  updateProfile(params: {
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
  }): Promise<MCPToolCallResponse>;

  /**
   * Get status of a sent message by message ID
   *
   * @example
   * ```typescript
   * const status = await client.whatsapp.getMessageStatus({ message_id: "wamid.XXX" });
   * ```
   */
  getMessageStatus(params: {
    /** The wamid of the message */
    message_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Create a QR code that opens a chat with a prefilled message
   *
   * @example
   * ```typescript
   * const qr = await client.whatsapp.createQrCode({
   *   phone_number_id: "123456789",
   *   prefilled_message: "Hi, I have a question",
   * });
   * console.log(qr.deep_link_url, qr.qr_image_url);
   * ```
   */
  createQrCode(params: {
    /** Phone number ID */
    phone_number_id: string;
    /** Message text to prefill when QR is scanned */
    prefilled_message: string;
    /** Optional image generation format */
    generate_qr_image?: "PNG" | "SVG";
  }): Promise<MCPToolCallResponse>;

  updateQrCode(params: {
    phone_number_id: string;
    code: string;
    prefilled_message?: string;
    generate_qr_image?: "PNG" | "SVG";
  }): Promise<MCPToolCallResponse>;

  /**
   * List all QR codes for a phone number
   *
   * @example
   * ```typescript
   * const codes = await client.whatsapp.listQrCodes({ phone_number_id: "123456789" });
   * ```
   */
  listQrCodes(params: {
    /** Phone number ID */
    phone_number_id: string;
    fields?: string;
    code?: string;
    limit?: number;
    after?: string;
    before?: string;
  }): Promise<MCPToolCallResponse>;

  getQrCode(params: {
    phone_number_id: string;
    code: string;
    fields?: string;
  }): Promise<MCPToolCallResponse>;

  deleteQrCode(params: {
    phone_number_id: string;
    code: string;
  }): Promise<MCPToolCallResponse>;
}

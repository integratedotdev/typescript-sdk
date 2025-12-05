/**
 * WhatsApp Business Integration Client Types
 * Fully typed interface for WhatsApp Business integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * WhatsApp Message
 */
export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  timestamp: string;
  type: "text" | "image" | "video" | "audio" | "document" | "template";
  text?: {
    body: string;
  };
  image?: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  video?: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  audio?: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  document?: {
    id: string;
    mime_type: string;
    sha256: string;
    filename: string;
  };
  status?: "sent" | "delivered" | "read" | "failed";
}

/**
 * WhatsApp Message Template
 */
export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  status: "approved" | "pending" | "rejected";
  category: "marketing" | "utility" | "authentication";
  components: Array<{
    type: "header" | "body" | "footer" | "button";
    text?: string;
    format?: string;
    example?: {
      header_text?: string[];
      body_text?: string[][];
    };
  }>;
}

/**
 * WhatsApp Phone Number
 */
export interface WhatsAppPhoneNumber {
  id: string;
  display_phone_number: string;
  verified_name: string;
  code_verification_status: string;
  quality_rating: "green" | "yellow" | "red";
  platform_type: string;
  throughput: {
    level: string;
  };
}

/**
 * WhatsApp Business Profile
 */
export interface WhatsAppBusinessProfile {
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  messaging_product: string;
  profile_picture_url?: string;
  websites?: string[];
  vertical?: string;
}

/**
 * WhatsApp Message Status
 */
export interface WhatsAppMessageStatus {
  id: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
  recipient_id: string;
  errors?: Array<{
    code: number;
    title: string;
    message: string;
    error_data?: {
      details: string;
    };
  }>;
}

/**
 * WhatsApp Integration Client Interface
 * Provides type-safe methods for all WhatsApp Business operations
 */
export interface WhatsAppIntegrationClient {
  /**
   * Send a text message
   * 
   * @example
   * ```typescript
   * const result = await client.whatsapp.sendMessage({
   *   to: "+1234567890",
   *   type: "text",
   *   text: { body: "Hello, World!" }
   * });
   * ```
   */
  sendMessage(params: {
    /** Recipient phone number (E.164 format) */
    to: string;
    /** Message type */
    type: "text";
    /** Text message content */
    text: {
      /** Message body text */
      body: string;
      /** Preview URL (optional) */
      preview_url?: boolean;
    };
  }): Promise<MCPToolCallResponse>;

  /**
   * Send a template message
   * 
   * @example
   * ```typescript
   * const result = await client.whatsapp.sendTemplate({
   *   to: "+1234567890",
   *   template: {
   *     name: "welcome_message",
   *     language: { code: "en_US" },
   *     components: [
   *       {
   *         type: "body",
   *         parameters: [{ type: "text", text: "John" }]
   *       }
   *     ]
   *   }
   * });
   * ```
   */
  sendTemplate(params: {
    /** Recipient phone number (E.164 format) */
    to: string;
    /** Template configuration */
    template: {
      /** Template name */
      name: string;
      /** Template language */
      language: {
        /** Language code */
        code: string;
      };
      /** Template components with parameters */
      components?: Array<{
        type: "header" | "body" | "button";
        parameters?: Array<{
          type: "text" | "currency" | "date_time" | "image" | "document" | "video";
          text?: string;
          currency?: { fallback_value: string; code: string; amount_1000: number };
          date_time?: { fallback_value: string };
          image?: { link: string };
          document?: { link: string; filename?: string };
          video?: { link: string };
        }>;
        sub_type?: string;
        index?: number;
      }>;
    };
  }): Promise<MCPToolCallResponse>;

  /**
   * Send media (image/video/document/audio)
   * 
   * @example
   * ```typescript
   * const result = await client.whatsapp.sendMedia({
   *   to: "+1234567890",
   *   type: "image",
   *   image: {
   *     link: "https://example.com/image.jpg",
   *     caption: "Check this out!"
   *   }
   * });
   * ```
   */
  sendMedia(params: {
    /** Recipient phone number (E.164 format) */
    to: string;
    /** Media type */
    type: "image" | "video" | "document" | "audio";
    /** Image media (when type is "image") */
    image?: {
      /** Media URL or ID */
      link?: string;
      id?: string;
      /** Image caption */
      caption?: string;
    };
    /** Video media (when type is "video") */
    video?: {
      /** Media URL or ID */
      link?: string;
      id?: string;
      /** Video caption */
      caption?: string;
    };
    /** Document media (when type is "document") */
    document?: {
      /** Media URL or ID */
      link?: string;
      id?: string;
      /** Document caption */
      caption?: string;
      /** Document filename */
      filename?: string;
    };
    /** Audio media (when type is "audio") */
    audio?: {
      /** Media URL or ID */
      link?: string;
      id?: string;
    };
  }): Promise<MCPToolCallResponse>;

  /**
   * List message templates
   * 
   * @example
   * ```typescript
   * const templates = await client.whatsapp.listTemplates({
   *   limit: 50
   * });
   * ```
   */
  listTemplates(params?: {
    /** Maximum number of templates to return */
    limit?: number;
    /** Pagination cursor */
    after?: string;
    /** Pagination cursor */
    before?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get registered phone numbers
   * 
   * @example
   * ```typescript
   * const phoneNumbers = await client.whatsapp.getPhoneNumbers();
   * ```
   */
  getPhoneNumbers(params?: {
    /** Maximum number of phone numbers to return */
    limit?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get message delivery status
   * 
   * @example
   * ```typescript
   * const status = await client.whatsapp.getMessageStatus({
   *   message_id: "wamid.xxxxx"
   * });
   * ```
   */
  getMessageStatus(params: {
    /** WhatsApp message ID */
    message_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Mark message as read
   * 
   * @example
   * ```typescript
   * await client.whatsapp.markRead({
   *   message_id: "wamid.xxxxx"
   * });
   * ```
   */
  markRead(params: {
    /** WhatsApp message ID to mark as read */
    message_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get business profile
   * 
   * @example
   * ```typescript
   * const profile = await client.whatsapp.getProfile();
   * ```
   */
  getProfile(params?: {
    /** Fields to retrieve */
    fields?: string[];
  }): Promise<MCPToolCallResponse>;
}

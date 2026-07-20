import { Resend } from "resend";
import * as React from "react";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender email (configure this in your environment)
const DEFAULT_FROM_EMAIL = "team@noreply.integrate.dev";
const DEFAULT_FROM_NAME = "Integrate Dev Team";

// Types for email options
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react?: React.ReactElement;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  tags?: { name: string; value: string }[];
  attachments?: {
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }[];
}

export interface BulkEmailOptions {
  emails: {
    to: string | string[];
    subject: string;
    react?: React.ReactElement;
    html?: string;
    text?: string;
    from?: string;
    replyTo?: string;
  }[];
}

export interface EmailResponse {
  success: boolean;
  id?: string;
  error?: string;
}

export interface BulkEmailResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Send a single email using Resend
 * @param options - Email options including recipient, subject, and content
 * @returns Promise with email response
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<EmailResponse> {
  try {
    // Validate API key
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Prepare from address
    const from = options.from || `${DEFAULT_FROM_NAME} <${DEFAULT_FROM_EMAIL}>`;

    // Validate that either react or html is provided
    if (!options.react && !options.html) {
      throw new Error("Either 'react' or 'html' must be provided");
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      react: options.react,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
      tags: options.tags,
      attachments: options.attachments,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending email:", message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Send multiple emails in bulk using Resend
 * @param options - Bulk email options with array of emails
 * @returns Promise with bulk email response
 */
export async function sendBulkEmails(
  options: BulkEmailOptions
): Promise<BulkEmailResponse> {
  try {
    // Validate API key
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Validate that all emails have either react or html
    options.emails.forEach((email, index) => {
      if (!email.react && !email.html) {
        throw new Error(`Email at index ${index} must have either 'react' or 'html' property`);
      }
    });

    // Prepare emails with default from address
    const emails = options.emails.map((email) => ({
      from: email.from || `${DEFAULT_FROM_NAME} <${DEFAULT_FROM_EMAIL}>`,
      to: email.to,
      subject: email.subject,
      react: email.react,
      html: email.html,
      text: email.text,
      replyTo: email.replyTo,
    }));

    // Send bulk emails
    const { data, error } = await resend.batch.send(emails);

    if (error) {
      console.error("Failed to send bulk emails:", error);
      return {
        success: false,
        error: error.message || "Failed to send bulk emails",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending bulk emails:", message);
    return {
      success: false,
      error: message,
    };
  }
}

// Export the resend instance for advanced usage
export { resend };


export interface EmailAttachmentOptions {
  filename: string;
  content: string; // Base64 encoded
  contentType: string;
}

/**
 * Template identifier. For the Resend provider we use a string alias that maps
 * to a server-side HTML template (see resend template registry).
 */
export type TemplateIdentifier = { type: 'alias'; value: string };

export interface SendTemplateEmailOptions {
  to: string[];
  template: TemplateIdentifier;
  templateVariables: Record<string, string>;
  subject?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: EmailAttachmentOptions[];
}

export interface TemplateMailerConfigOptions {
  fromEmail: string;
}

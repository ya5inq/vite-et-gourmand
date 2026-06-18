import { Resend } from 'resend';

import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';

import { RESEND_TEMPLATE_REGISTRY } from './templateRegistry';
import { TemplateMailerInterface } from '../../templateMailer.interface';
import { SendTemplateEmailOptions, TemplateMailerConfigOptions } from '../../templateMailer.types';

export interface ResendConfigOptions extends TemplateMailerConfigOptions {
  apiKey: string;
  /** When false (dev / no API key), emails are logged instead of sent over the network. */
  emailSend: boolean;
}

export class ResendTemplateMailer implements TemplateMailerInterface {
  private client: Resend | null = null;
  private config: ResendConfigOptions;

  constructor(
    config: ResendConfigOptions,
    private logger?: LoggerInterface,
  ) {
    this.config = config;

    // Only instantiate the network client when we are actually going to send.
    if (this.config.emailSend && this.config.apiKey) {
      this.client = new Resend(this.config.apiKey);
    }
  }

  async sendTemplateEmail(options: SendTemplateEmailOptions): Promise<void> {
    const renderer = RESEND_TEMPLATE_REGISTRY[options.template.value];
    if (!renderer) {
      throw new Error(`[ResendTemplateMailer] Unknown template alias: ${options.template.value}`);
    }

    const { subject, html } = renderer(options.templateVariables);
    const finalSubject = options.subject ?? subject;
    const toAddresses = options.to;

    // Dev / no-API-key mode: do not call the network, just log.
    if (!this.client) {
      this.logger?.info('[ResendTemplateMailer] (dev mode) Email not sent over network', {
        to: toAddresses,
        template: options.template.value,
        subject: finalSubject,
        variables: options.templateVariables,
      });
      return;
    }

    try {
      await this.client.emails.send({
        from: this.config.fromEmail,
        to: toAddresses,
        subject: finalSubject,
        html,
        ...(options.replyTo && { replyTo: options.replyTo }),
        ...(options.cc && { cc: options.cc }),
        ...(options.bcc && { bcc: options.bcc }),
      });

      this.logger?.debug(
        `[ResendTemplateMailer] Email sent to ${toAddresses.join(',')} using template ${options.template.value}`,
      );
    } catch (error) {
      this.logger?.error(`[ResendTemplateMailer] Failed to send email to ${toAddresses.join(',')}`, error);
      throw error;
    }
  }
}

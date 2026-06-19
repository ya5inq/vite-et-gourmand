import { inject, injectable } from 'inversify';

import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import {
  MailSenderInterface,
  SendEmployeeSetPasswordEmailOptions,
  SendOrderConfirmationEmailOptions,
  SendRegisterEmailOptions,
  SendResetPasswordEmailOptions,
} from '@/domain/interfaces/adapters/mailSender.interface';
import { TemplateMailerInterface } from '@/infrastructure/mailer/templateMailer.interface';

import { TYPES } from '@/configuration/di/types';

@injectable()
export class MailSender implements MailSenderInterface {
  constructor(
    @inject(TYPES.TemplateMailer) private templateMailer: TemplateMailerInterface,
    @inject(TYPES.EnvConfig) private envConfig: EnvConfigInterface,
  ) {}

  async sendRegisterEmail({ email, tokenValue }: SendRegisterEmailOptions): Promise<void> {
    await this.templateMailer.sendTemplateEmail({
      to: [email],
      template: { type: 'alias', value: 'activate-account' },
      templateVariables: {
        validateAccountUrl: `${this.envConfig.frontendUrl}/validate-account?token=${tokenValue}`,
      },
    });
  }

  async sendResetPasswordEmail({ email, tokenValue }: SendResetPasswordEmailOptions): Promise<void> {
    await this.templateMailer.sendTemplateEmail({
      to: [email],
      template: { type: 'alias', value: 'reset-password' },
      templateVariables: {
        resetPasswordUrl: `${this.envConfig.frontendUrl}/reset-password?token=${tokenValue}`,
      },
    });
  }

  async sendEmployeeSetPasswordEmail({ email, tokenValue }: SendEmployeeSetPasswordEmailOptions): Promise<void> {
    await this.templateMailer.sendTemplateEmail({
      to: [email],
      template: { type: 'alias', value: 'employee-set-password' },
      templateVariables: {
        setPasswordUrl: `${this.envConfig.backOfficeUrl}/set-password?token=${tokenValue}`,
      },
    });
  }

  async sendOrderConfirmationEmail({
    email,
    orderId,
    customerName,
    totalPrice,
    deliveryFee,
    deliveryDate,
  }: SendOrderConfirmationEmailOptions): Promise<void> {
    await this.templateMailer.sendTemplateEmail({
      to: [email],
      template: { type: 'alias', value: 'order-confirmation' },
      templateVariables: {
        customerName: customerName ?? '',
        orderId,
        totalPrice: totalPrice.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        deliveryDate: deliveryDate ? deliveryDate.toISOString().slice(0, 10) : '',
        ordersUrl: `${this.envConfig.frontendUrl}/orders`,
      },
    });
  }
}

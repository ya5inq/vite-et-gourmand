import { SendTemplateEmailOptions } from './templateMailer.types';

export interface TemplateMailerInterface {
  sendTemplateEmail(options: SendTemplateEmailOptions): Promise<void>;
}

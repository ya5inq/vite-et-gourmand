import { inject, injectable } from 'inversify';

import { ContactMessageInterface } from '@/domain/entities/contactMessage/contactMessage.entity.interface';
import { MailSenderInterface } from '@/domain/interfaces/adapters/mailSender.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { ContactMessageRepositoryInterface } from '@/domain/interfaces/repositories/contactMessage.repository.interface';

import { TYPES } from '@/configuration/di/types';
import { ContactMessage } from '@/domain/entities/contactMessage/contactMessage.entity';

import {
  SendContactMessageDataInterface,
  SendContactMessageUseCaseInterface,
} from './sendContactMessage.useCase.interface';

@injectable()
export class SendContactMessageUseCase implements SendContactMessageUseCaseInterface {
  constructor(
    @inject(TYPES.ContactMessageRepository) private contactMessageRepository: ContactMessageRepositoryInterface,
    @inject(TYPES.MailSender) private mailSender: MailSenderInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface,
  ) {}

  async executeSendContactMessage(data: SendContactMessageDataInterface): Promise<ContactMessageInterface> {
    const { name, email, phone, subject, message } = data;

    const contactMessage = new ContactMessage(
      '',
      name,
      email,
      phone ?? null,
      subject ?? null,
      message,
      false,
      new Date(),
    );

    const created = await this.contactMessageRepository.create(contactMessage);

    // Notify the company inbox. A mail failure must not break the persistence.
    try {
      await this.mailSender.sendContactEmail({
        fromName: name,
        fromEmail: email,
        message,
        phone: phone ?? undefined,
        subject: subject ?? undefined,
      });
    } catch (error) {
      this.logger.error('Error sending contact email', { error, contactMessageId: created.id });
    }

    return created;
  }
}

import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { ContactMessageInterface } from '@/domain/entities/contactMessage/contactMessage.entity.interface';
import { ContactMessageRepositoryInterface } from '@/domain/interfaces/repositories/contactMessage.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import {
  MarkContactMessageReadParamsInterface,
  MarkContactMessageReadUseCaseInterface,
} from './markContactMessageRead.useCase.interface';

@injectable()
export class MarkContactMessageReadUseCase implements MarkContactMessageReadUseCaseInterface {
  constructor(
    @inject(TYPES.ContactMessageRepository) private contactMessageRepository: ContactMessageRepositoryInterface,
  ) {}

  async executeMarkContactMessageRead({
    messageId,
  }: MarkContactMessageReadParamsInterface): Promise<ContactMessageInterface> {
    const message = await this.contactMessageRepository.findById(messageId);
    if (!message) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_CONTACT_MESSAGE,
        message: 'Contact message not found',
        privateContext: { messageId },
      });
    }

    await this.contactMessageRepository.updateOne(messageId, { isRead: true });

    return { ...message, isRead: true };
  }
}

import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { ContactMessageRepositoryInterface } from '@/domain/interfaces/repositories/contactMessage.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { DeleteContactMessageUseCaseInterface } from './deleteContactMessage.useCase.interface';

@injectable()
export class DeleteContactMessageUseCase implements DeleteContactMessageUseCaseInterface {
  constructor(
    @inject(TYPES.ContactMessageRepository) private contactMessageRepository: ContactMessageRepositoryInterface,
  ) {}

  async executeDeleteContactMessage(messageId: string): Promise<void> {
    const message = await this.contactMessageRepository.findById(messageId);
    if (!message) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_CONTACT_MESSAGE,
        message: 'Contact message not found',
        privateContext: { messageId },
      });
    }

    await this.contactMessageRepository.deleteOne(messageId);
  }
}

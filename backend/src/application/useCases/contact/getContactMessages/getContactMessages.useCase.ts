import { inject, injectable } from 'inversify';

import { ContactMessageRepositoryInterface } from '@/domain/interfaces/repositories/contactMessage.repository.interface';

import { TYPES } from '@/configuration/di/types';

import {
  GetContactMessagesParamsInterface,
  GetContactMessagesResultInterface,
  GetContactMessagesUseCaseInterface,
} from './getContactMessages.useCase.interface';

@injectable()
export class GetContactMessagesUseCase implements GetContactMessagesUseCaseInterface {
  constructor(
    @inject(TYPES.ContactMessageRepository) private contactMessageRepository: ContactMessageRepositoryInterface,
  ) {}

  async executeGetContactMessages(
    params: GetContactMessagesParamsInterface,
  ): Promise<GetContactMessagesResultInterface> {
    const [items, totalCount] = await Promise.all([
      this.contactMessageRepository.findAll(params),
      this.contactMessageRepository.countFindAll(params),
    ]);

    return { items, totalCount };
  }
}

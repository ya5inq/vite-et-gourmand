import { vi, Mocked } from 'vitest';

import { contactMessageFactory } from '@/domain/entities/contactMessage/contactMessage.factory';

import { SendContactMessageUseCaseInterface } from './sendContactMessage.useCase.interface';

export const getSendContactMessageUseCaseMock = (): Mocked<SendContactMessageUseCaseInterface> => ({
  executeSendContactMessage: vi.fn().mockResolvedValue(contactMessageFactory()),
});

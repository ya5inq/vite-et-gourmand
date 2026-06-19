import { vi, Mocked } from 'vitest';

import { contactMessageFactory } from '@/domain/entities/contactMessage/contactMessage.factory';

import { MarkContactMessageReadUseCaseInterface } from './markContactMessageRead.useCase.interface';

export const getMarkContactMessageReadUseCaseMock = (): Mocked<MarkContactMessageReadUseCaseInterface> => ({
  executeMarkContactMessageRead: vi.fn().mockResolvedValue(contactMessageFactory({ isRead: true })),
});

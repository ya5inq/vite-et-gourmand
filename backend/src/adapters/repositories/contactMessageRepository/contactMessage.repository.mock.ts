import { vi, Mocked } from 'vitest';

import { ContactMessageInterface } from '@/domain/entities/contactMessage/contactMessage.entity.interface';
import { ContactMessageRepositoryInterface } from '@/domain/interfaces/repositories/contactMessage.repository.interface';

import { contactMessageFactory } from '@/domain/entities/contactMessage/contactMessage.factory';

export const getContactMessageRepositoryMock = (options?: {
  findById?: ContactMessageInterface | null;
  findAll?: ContactMessageInterface[];
  countFindAll?: number;
}): Mocked<ContactMessageRepositoryInterface> => ({
  findById: vi.fn().mockResolvedValue(options?.findById ?? null),
  findAll: vi.fn().mockResolvedValue(options?.findAll ?? []),
  countFindAll: vi.fn().mockResolvedValue(options?.countFindAll ?? 0),
  create: vi
    .fn()
    .mockImplementation((message: ContactMessageInterface) => Promise.resolve(message ?? contactMessageFactory())),
  updateOne: vi.fn().mockResolvedValue(undefined),
  deleteOne: vi.fn().mockResolvedValue(undefined),
});

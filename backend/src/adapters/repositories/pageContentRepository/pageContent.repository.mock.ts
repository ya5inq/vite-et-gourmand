import { vi, Mocked } from 'vitest';

import { PageContentInterface } from '@/domain/entities/pageContent/pageContent.entity.interface';
import {
  PageContentRepositoryInterface,
  UpsertPageContentPayloadInterface,
} from '@/domain/interfaces/repositories/pageContent.repository.interface';

import { pageContentFactory } from '@/domain/entities/pageContent/pageContent.factory';

export const getPageContentRepositoryMock = (options?: {
  findByPageSection?: PageContentInterface | null;
  findByPage?: PageContentInterface[];
  findAll?: PageContentInterface[];
}): Mocked<PageContentRepositoryInterface> => ({
  findByPageSection: vi.fn().mockResolvedValue(options?.findByPageSection ?? null),
  findByPage: vi.fn().mockResolvedValue(options?.findByPage ?? []),
  findAll: vi.fn().mockResolvedValue(options?.findAll ?? []),
  upsert: vi
    .fn()
    .mockImplementation((payload: UpsertPageContentPayloadInterface) => Promise.resolve(pageContentFactory(payload))),
});

import { vi, Mocked } from 'vitest';

import { pageContentFactory } from '@/domain/entities/pageContent/pageContent.factory';

import { UpsertPageContentUseCaseInterface } from './upsertPageContent.useCase.interface';

export const getUpsertPageContentUseCaseMock = (): Mocked<UpsertPageContentUseCaseInterface> => ({
  executeUpsertPageContent: vi.fn().mockResolvedValue(pageContentFactory()),
});

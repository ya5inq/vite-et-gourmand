import { vi, Mocked } from 'vitest';

import { GetPageContentUseCaseInterface } from './getPageContent.useCase.interface';

export const getGetPageContentUseCaseMock = (): Mocked<GetPageContentUseCaseInterface> => ({
  executeGetPageContent: vi.fn().mockResolvedValue([]),
});

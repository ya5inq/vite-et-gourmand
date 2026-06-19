import { vi, Mocked } from 'vitest';

import { GetContactMessagesUseCaseInterface } from './getContactMessages.useCase.interface';

export const getGetContactMessagesUseCaseMock = (): Mocked<GetContactMessagesUseCaseInterface> => ({
  executeGetContactMessages: vi.fn().mockResolvedValue({ items: [], totalCount: 0 }),
});

import { vi, Mocked } from 'vitest';

import { DeleteContactMessageUseCaseInterface } from './deleteContactMessage.useCase.interface';

export const getDeleteContactMessageUseCaseMock = (): Mocked<DeleteContactMessageUseCaseInterface> => ({
  executeDeleteContactMessage: vi.fn().mockResolvedValue(undefined),
});

import { vi, Mocked } from 'vitest';

import { DeleteDishUseCaseInterface } from './deleteDish.useCase.interface';

export const getDeleteDishUseCaseMock = (): Mocked<DeleteDishUseCaseInterface> => ({
  executeDeleteDish: vi.fn().mockResolvedValue(undefined),
});

import { vi, Mocked } from 'vitest';

import { GetAllDishesUseCaseInterface } from './getAllDishes.useCase.interface';

export const getGetAllDishesUseCaseMock = (): Mocked<GetAllDishesUseCaseInterface> => ({
  executeGetAllDishes: vi.fn().mockResolvedValue({ items: [], totalCount: 0 }),
});

import { vi, Mocked } from 'vitest';

import { menuFactory } from '@/domain/entities/menu/menu.factory';

import { GetMenuUseCaseInterface } from './getMenu.useCase.interface';

export const getGetMenuUseCaseMock = (): Mocked<GetMenuUseCaseInterface> => ({
  executeGetMenu: vi.fn().mockResolvedValue(menuFactory()),
});

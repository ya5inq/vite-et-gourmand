import { vi, Mocked } from 'vitest';

import { menuFactory } from '@/domain/entities/menu/menu.factory';

import { UpdateMenuUseCaseInterface } from './updateMenu.useCase.interface';

export const getUpdateMenuUseCaseMock = (): Mocked<UpdateMenuUseCaseInterface> => ({
  executeUpdateMenu: vi.fn().mockResolvedValue(menuFactory()),
});

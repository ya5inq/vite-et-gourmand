import { vi, Mocked } from 'vitest';

import { menuFactory } from '@/domain/entities/menu/menu.factory';

import { CreateMenuUseCaseInterface } from './createMenu.useCase.interface';

export const getCreateMenuUseCaseMock = (): Mocked<CreateMenuUseCaseInterface> => ({
  executeCreateMenu: vi.fn().mockResolvedValue(menuFactory()),
});

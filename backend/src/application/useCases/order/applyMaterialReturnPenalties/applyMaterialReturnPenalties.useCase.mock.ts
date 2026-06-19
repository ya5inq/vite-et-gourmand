import { vi, Mocked } from 'vitest';

import { ApplyMaterialReturnPenaltiesUseCaseInterface } from './applyMaterialReturnPenalties.useCase.interface';

export const getApplyMaterialReturnPenaltiesUseCaseMock = (): Mocked<ApplyMaterialReturnPenaltiesUseCaseInterface> => ({
  executeApplyMaterialReturnPenalties: vi.fn().mockResolvedValue({ penalizedCount: 0 }),
});

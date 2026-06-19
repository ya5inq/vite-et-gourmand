import { ApplyMaterialReturnPenaltiesUseCaseInterface } from '@/application/useCases/order/applyMaterialReturnPenalties/applyMaterialReturnPenalties.useCase.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { QueueName } from '@/domain/enums/queues.enum';

import { WorkerInterface } from '..';

export const getMaterialReturnPenaltyWorker = (): WorkerInterface => {
  const logger = mainContainer.get<LoggerInterface>(TYPES.Logger);
  const applyMaterialReturnPenaltiesUseCase = mainContainer.get<ApplyMaterialReturnPenaltiesUseCaseInterface>(
    TYPES.ApplyMaterialReturnPenaltiesUseCase,
  );

  return {
    queue: QueueName.MATERIAL_RETURN_PENALTY,
    handler: async () => {
      logger.info('[Worker] Applying material-return penalties');
      return applyMaterialReturnPenaltiesUseCase.executeApplyMaterialReturnPenalties();
    },
  };
};

import { inject, injectable } from 'inversify';

import { OperatingHoursInterface } from '@/domain/entities/operatingHours/operatingHours.entity.interface';
import { OperatingHoursRepositoryInterface } from '@/domain/interfaces/repositories/operatingHours.repository.interface';

import { TYPES } from '@/configuration/di/types';

import { GetAllOperatingHoursUseCaseInterface } from './getAllOperatingHours.useCase.interface';

@injectable()
export class GetAllOperatingHoursUseCase implements GetAllOperatingHoursUseCaseInterface {
  constructor(
    @inject(TYPES.OperatingHoursRepository) private operatingHoursRepository: OperatingHoursRepositoryInterface,
  ) {}

  async executeGetAllOperatingHours(): Promise<OperatingHoursInterface[]> {
    return this.operatingHoursRepository.findAll();
  }
}

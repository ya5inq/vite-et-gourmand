import { inject, injectable } from 'inversify';

import { OrderRepositoryInterface } from '@/domain/interfaces/repositories/order.repository.interface';

import { TYPES } from '@/configuration/di/types';

import {
  GetAllOrdersParamsInterface,
  GetAllOrdersResultInterface,
  GetAllOrdersUseCaseInterface,
} from './getAllOrders.useCase.interface';

@injectable()
export class GetAllOrdersUseCase implements GetAllOrdersUseCaseInterface {
  constructor(@inject(TYPES.OrderRepository) private orderRepository: OrderRepositoryInterface) {}

  async executeGetAllOrders(params: GetAllOrdersParamsInterface): Promise<GetAllOrdersResultInterface> {
    const [items, totalCount] = await Promise.all([
      this.orderRepository.findAll(params),
      this.orderRepository.countFindAll(params),
    ]);

    return { items, totalCount };
  }
}

import { inject, injectable } from 'inversify';

import { OrderRepositoryInterface } from '@/domain/interfaces/repositories/order.repository.interface';

import { TYPES } from '@/configuration/di/types';

import {
  GetUserOrdersParamsInterface,
  GetUserOrdersResultInterface,
  GetUserOrdersUseCaseInterface,
} from './getUserOrders.useCase.interface';

@injectable()
export class GetUserOrdersUseCase implements GetUserOrdersUseCaseInterface {
  constructor(@inject(TYPES.OrderRepository) private orderRepository: OrderRepositoryInterface) {}

  async executeGetUserOrders(params: GetUserOrdersParamsInterface): Promise<GetUserOrdersResultInterface> {
    const { userId, ...rest } = params;
    const [items, totalCount] = await Promise.all([
      this.orderRepository.findAllByUser(userId, rest),
      this.orderRepository.countByUser(userId, rest),
    ]);

    return { items, totalCount };
  }
}

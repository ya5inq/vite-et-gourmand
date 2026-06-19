import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { OrderInterface } from '@/domain/entities/order/order.entity.interface';
import { OrderRepositoryInterface } from '@/domain/interfaces/repositories/order.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { GetOrderParamsInterface, GetOrderUseCaseInterface } from './getOrder.useCase.interface';

@injectable()
export class GetOrderUseCase implements GetOrderUseCaseInterface {
  constructor(@inject(TYPES.OrderRepository) private orderRepository: OrderRepositoryInterface) {}

  async executeGetOrder({ orderId, requesterId, isStaff = false }: GetOrderParamsInterface): Promise<OrderInterface> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_ORDER,
        message: 'Order not found',
        privateContext: { orderId },
      });
    }

    // Staff can read any order; a regular user may only read their own.
    if (!isStaff && order.userId !== requesterId) {
      throw new AppError({
        code: AppErrorCodes.FORBIDDEN_ORDER_NOT_OWNER,
        message: 'Order does not belong to the requester',
        privateContext: { orderId, requesterId, ownerId: order.userId },
      });
    }

    return order;
  }
}

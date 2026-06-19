import { OrderInterface } from '@/domain/entities/order/order.entity.interface';

export interface GetOrderParamsInterface {
  orderId: string;
  /** When provided (and `isStaff` is false), enforces ownership. */
  requesterId?: string | null;
  /** Staff bypass the ownership check. */
  isStaff?: boolean;
}

export interface GetOrderUseCaseInterface {
  executeGetOrder: (params: GetOrderParamsInterface) => Promise<OrderInterface>;
}

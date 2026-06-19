import { OrderInterface } from '@/domain/entities/order/order.entity.interface';
import { RoleType } from '@/domain/entities/user/user.entity.interface';

import { OrderContactModeEnum } from '@/domain/entities/order/orderContactMode';
import { OrderStatusEnum } from '@/domain/entities/order/orderStatus';

export interface UpdateOrderStatusParamsInterface {
  orderId: string;
  newStatus: OrderStatusEnum;
  /** Staff member performing the transition. */
  actorId: string;
  actorRole: RoleType;
  /** Required when cancelling or rejecting an order. */
  reason?: string | null;
  /** Required when cancelling or rejecting an order. */
  contactMode?: OrderContactModeEnum | null;
}

export interface UpdateOrderStatusUseCaseInterface {
  executeUpdateOrderStatus: (params: UpdateOrderStatusParamsInterface) => Promise<OrderInterface>;
}

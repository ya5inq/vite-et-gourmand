import { OrderInterface } from '../order/order.entity.interface';
import { OrderStatusEnum } from '../order/orderStatus';
import { UserInterface } from '../user/user.entity.interface';

export interface OrderHistoryInterface {
  id: string;
  orderId: string;
  oldStatus: OrderStatusEnum | null;
  newStatus: OrderStatusEnum;
  /** Staff member who performed the change (null for the initial creation). */
  changedBy: string | null;
  reason: string | null;
  /** Phase 6: how the customer was contacted about the change. */
  contactMode: string | null;
  createdAt: Date;
  order?: OrderInterface | null;
  changedByUser?: UserInterface | null;
}

import { OrderHistoryInterface } from './orderHistory.entity.interface';
import { OrderStatusEnum } from '../order/orderStatus';

export class OrderHistory implements OrderHistoryInterface {
  constructor(
    public id: string,
    public orderId: string,
    public oldStatus: OrderStatusEnum | null,
    public newStatus: OrderStatusEnum,
    public changedBy: string | null = null,
    public reason: string | null = null,
    public contactMode: string | null = null,
    public createdAt: Date,
  ) {}
}

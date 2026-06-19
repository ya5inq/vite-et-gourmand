import { OrderInterface } from './order.entity.interface';
import { OrderStatusEnum } from './orderStatus';
import { OrderHistoryInterface } from '../orderHistory/orderHistory.entity.interface';
import { OrderItemInterface } from '../orderItem/orderItem.entity.interface';
import { UserInterface } from '../user/user.entity.interface';

export class Order implements OrderInterface {
  constructor(
    public id: string,
    public userId: string | null,
    public status: OrderStatusEnum,
    public guestEmail: string | null,
    public guestName: string | null,
    public guestPhone: string | null,
    public deliveryAddress: string | null,
    public deliveryCity: string | null,
    public deliveryPostalCode: string | null,
    public deliveryZoneId: string | null,
    public deliveryDate: Date | null,
    public deliveryFee: number,
    public totalPrice: number,
    public notes: string | null,
    public rejectionReason: string | null,
    public rejectedBy: string | null,
    public rejectedAt: Date | null,
    public materialReturnDeadline: Date | null,
    public materialPenaltyApplied: boolean,
    public penaltyAmount: number | null,
    public createdAt: Date,
    public updatedAt: Date,
    public orderItems: OrderItemInterface[] = [],
    public user: UserInterface | null = null,
    public history: OrderHistoryInterface[] = [],
  ) {}
}

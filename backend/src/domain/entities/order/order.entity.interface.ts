import { OrderStatusEnum } from './orderStatus';
import { DeliveryZoneInterface } from '../deliveryZone/deliveryZone.entity.interface';
import { OrderHistoryInterface } from '../orderHistory/orderHistory.entity.interface';
import { OrderItemInterface } from '../orderItem/orderItem.entity.interface';
import { UserInterface } from '../user/user.entity.interface';

export interface OrderInterface {
  id: string;
  /** FK to the user. Null for a guest order. */
  userId: string | null;
  status: OrderStatusEnum;

  // Guest identity (used when userId is null).
  guestEmail: string | null;
  guestName: string | null;
  guestPhone: string | null;

  // Delivery details.
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryPostalCode: string | null;
  deliveryZoneId: string | null;
  deliveryDate: Date | null;
  deliveryFee: number;

  totalPrice: number;
  notes: string | null;

  // Phase 6 (rejection / material return) — nullable now.
  rejectionReason: string | null;
  rejectedBy: string | null;
  rejectedAt: Date | null;
  materialReturnDeadline: Date | null;

  createdAt: Date;
  updatedAt: Date;

  orderItems: OrderItemInterface[];
  user?: UserInterface | null;
  deliveryZone?: DeliveryZoneInterface | null;
  history?: OrderHistoryInterface[];
}

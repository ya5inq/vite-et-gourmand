import { OrderInterface } from '@/domain/entities/order/order.entity.interface';

export interface CreateOrderItemInputInterface {
  menuId: string;
  quantity: number;
}

export interface CreateOrderGuestInfoInterface {
  guestEmail: string;
  guestName: string;
  guestPhone?: string | null;
}

export interface CreateOrderDataInterface {
  items: CreateOrderItemInputInterface[];

  /** Authenticated customer id. Mutually exclusive with `guestInfo`. */
  userId?: string | null;
  /** Email used for the confirmation email when an authenticated user orders. */
  userEmail?: string | null;
  /** Guest identity. Mutually exclusive with `userId`. */
  guestInfo?: CreateOrderGuestInfoInterface | null;

  // Delivery.
  deliveryZoneId?: string | null;
  deliveryPostalCode?: string | null;
  deliveryAddress?: string | null;
  deliveryCity?: string | null;
  deliveryDate?: Date | null;
  notes?: string | null;
}

export interface CreateOrderUseCaseInterface {
  executeCreateOrder: (data: CreateOrderDataInterface) => Promise<OrderInterface>;
}

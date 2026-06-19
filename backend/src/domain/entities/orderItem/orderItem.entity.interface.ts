import { MenuInterface } from '../menu/menu.entity.interface';
import { OrderInterface } from '../order/order.entity.interface';

export interface OrderItemInterface {
  id: string;
  orderId: string;
  menuId: string;
  quantity: number;
  /** Unit price snapshot of the menu at order time. */
  unitPrice: number;
  /** Line total after the (optional) 10% discount. */
  lineTotal: number;
  /** Traces whether the 10% volume discount was applied to this line. */
  discountApplied: boolean;
  createdAt: Date;
  menu?: MenuInterface | null;
  order?: OrderInterface | null;
}

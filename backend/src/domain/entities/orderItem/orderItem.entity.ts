import { OrderItemInterface } from './orderItem.entity.interface';
import { MenuInterface } from '../menu/menu.entity.interface';

export class OrderItem implements OrderItemInterface {
  constructor(
    public id: string,
    public orderId: string,
    public menuId: string,
    public quantity: number,
    public unitPrice: number,
    public lineTotal: number,
    public discountApplied: boolean,
    public createdAt: Date,
    public menu: MenuInterface | null = null,
  ) {}
}

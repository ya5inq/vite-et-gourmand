import { ReviewInterface } from './review.entity.interface';
import { OrderInterface } from '../order/order.entity.interface';
import { UserInterface } from '../user/user.entity.interface';

export class Review implements ReviewInterface {
  constructor(
    public id: string,
    public userId: string,
    public orderId: string,
    public rating: number,
    public comment: string | null,
    public isApproved: boolean,
    public approvedBy: string | null,
    public createdAt: Date,
    public updatedAt: Date,
    public user: UserInterface | null = null,
    public order: OrderInterface | null = null,
  ) {}
}

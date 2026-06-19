import { OrderInterface } from '../order/order.entity.interface';
import { UserInterface } from '../user/user.entity.interface';

export interface ReviewInterface {
  id: string;
  /** FK to the user who wrote the review. */
  userId: string;
  /** FK to the reviewed order (unique: one review per order). */
  orderId: string;
  /** Rating from 1 to 5. */
  rating: number;
  comment: string | null;
  /** A review is only displayed publicly once a staff member approves it. */
  isApproved: boolean;
  /** Staff member who approved the review (null while pending). */
  approvedBy: string | null;
  createdAt: Date;
  updatedAt: Date;

  user?: UserInterface | null;
  order?: OrderInterface | null;
}

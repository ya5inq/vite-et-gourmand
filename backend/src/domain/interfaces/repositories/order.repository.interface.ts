import { OrderInterface } from '@/domain/entities/order/order.entity.interface';
import { OrderHistoryInterface } from '@/domain/entities/orderHistory/orderHistory.entity.interface';
import { OrderItemInterface } from '@/domain/entities/orderItem/orderItem.entity.interface';

import { OrderStatusEnum } from '@/domain/entities/order/orderStatus';

export type SortOrder = 'ASC' | 'DESC';
export type OrderSortBy = 'createdAt' | 'updatedAt' | 'totalPrice' | 'status' | 'deliveryDate';

export interface FindAllOrdersParamsInterface {
  status?: OrderStatusEnum;
  /** Free text search on guest name/email or delivery city. */
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: OrderSortBy;
  sortOrder?: SortOrder;
}

export interface FindOrdersByUserParamsInterface {
  status?: OrderStatusEnum;
  limit?: number;
  offset?: number;
  sortBy?: OrderSortBy;
  sortOrder?: SortOrder;
}

/** A stock decrement to apply atomically with the order creation. */
export interface StockUpdateInterface {
  menuId: string;
  /** New absolute stock value to persist. */
  newStock: number;
}

export interface CreateOrderPayloadInterface {
  order: OrderInterface;
  items: OrderItemInterface[];
  history: OrderHistoryInterface;
  stockUpdates: StockUpdateInterface[];
}

/**
 * Atomically updates an order's scalar columns and appends a history row.
 * Used by the order state machine (Phase 6).
 */
export interface UpdateStatusWithHistoryPayloadInterface {
  orderId: string;
  orderUpdate: Partial<OrderInterface>;
  history: OrderHistoryInterface;
}

export interface OrderRepositoryInterface {
  /**
   * Inserts the order, its items and the initial history row, and applies the
   * stock decrements — all inside a single database transaction.
   * Returns the created order with its items.
   */
  createWithItemsAndStock: (payload: CreateOrderPayloadInterface) => Promise<OrderInterface>;
  findById: (id: string) => Promise<OrderInterface | null>;
  findAllByUser: (userId: string, params?: FindOrdersByUserParamsInterface) => Promise<OrderInterface[]>;
  countByUser: (userId: string, params?: FindOrdersByUserParamsInterface) => Promise<number>;
  findAll: (params?: FindAllOrdersParamsInterface) => Promise<OrderInterface[]>;
  countFindAll: (params?: FindAllOrdersParamsInterface) => Promise<number>;
  updateOne: (id: string, data: Partial<OrderInterface>) => Promise<void>;
  /** Updates the order status (+ related columns) and appends a history row in one transaction. */
  updateStatusWithHistory: (payload: UpdateStatusWithHistoryPayloadInterface) => Promise<OrderInterface>;
  /**
   * Orders stuck in AWAITING_MATERIAL_RETURN whose deadline has passed and on
   * which the material penalty has not been applied yet.
   */
  findOverdueMaterialReturns: (now: Date) => Promise<OrderInterface[]>;
}

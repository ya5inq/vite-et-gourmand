/**
 * Analytics repository — backed by MongoDB (NoSQL).
 *
 * Stores one document per order line at the moment an order reaches a
 * billable state. Used by the admin dashboard to count orders per menu and
 * compute revenue per menu over a period (ECF requirement: stats from a
 * non-relational database).
 */

export interface OrderStatDocumentInterface {
  orderId: string;
  menuId: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
  lineRevenue: number;
  orderStatus: string;
  orderedAt: Date;
  completedAt: Date | null;
}

export interface RecordOrderStatsOptions {
  orderId: string;
  orderStatus: string;
  orderedAt: Date;
  completedAt?: Date | null;
  lines: {
    menuId: string;
    menuName: string;
    quantity: number;
    unitPrice: number;
    lineRevenue: number;
  }[];
}

export interface AnalyticsPeriodFilterOptions {
  menuId?: string;
  from?: Date;
  to?: Date;
}

export interface OrdersByMenuResultInterface {
  menuId: string;
  menuName: string;
  orderCount: number;
  totalQuantity: number;
}

export interface RevenueByMenuResultInterface {
  menuId: string;
  menuName: string;
  revenue: number;
}

export interface AnalyticsRepositoryInterface {
  /**
   * Write-through upsert of the stat lines for an order. Must never throw on
   * infrastructure failure (analytics is a derived view, Postgres is the
   * source of truth) — failures are logged by the implementation.
   */
  recordOrderStats(options: RecordOrderStatsOptions): Promise<void>;
  /**
   * Updates the denormalised status (and completedAt) of an order's stat
   * documents when its state changes.
   */
  updateOrderStatus(orderId: string, orderStatus: string, completedAt?: Date | null): Promise<void>;
  getOrdersByMenu(filter?: AnalyticsPeriodFilterOptions): Promise<OrdersByMenuResultInterface[]>;
  getRevenueByMenu(filter?: AnalyticsPeriodFilterOptions): Promise<RevenueByMenuResultInterface[]>;
}

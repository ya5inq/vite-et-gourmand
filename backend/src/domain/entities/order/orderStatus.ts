/**
 * Order status enum (aligned with the ECF specifications).
 *
 * The full state machine (transitions + the use cases that drive them) lands in
 * Phase 6. Phase 5 only needs the enum, the `PENDING` default, and the initial
 * history row. `ORDER_STATUS_TRANSITIONS` is exported here so Phase 6 can build
 * its guards on top of it without re-declaring the graph.
 */
export enum OrderStatusEnum {
  /** Order received, awaiting validation by the team. */
  PENDING = 'PENDING',
  /** Validated by the team. */
  ACCEPTED = 'ACCEPTED',
  /** Being prepared in the kitchen. */
  PREPARING = 'PREPARING',
  /** Out for delivery. */
  DELIVERING = 'DELIVERING',
  /** Delivered to the customer. */
  DELIVERED = 'DELIVERED',
  /** Waiting for the rented material to be returned. */
  AWAITING_MATERIAL_RETURN = 'AWAITING_MATERIAL_RETURN',
  /** Fully completed. */
  COMPLETED = 'COMPLETED',
  /** Rejected by the team. */
  REJECTED = 'REJECTED',
  /** Cancelled (by the customer or the team). */
  CANCELLED = 'CANCELLED',
}

export const ORDER_STATUS_VALUES = Object.values(OrderStatusEnum) as [OrderStatusEnum, ...OrderStatusEnum[]];

/**
 * Allowed status transitions (used by Phase 6's state machine). An empty array
 * means a terminal state.
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatusEnum, OrderStatusEnum[]> = {
  [OrderStatusEnum.PENDING]: [OrderStatusEnum.ACCEPTED, OrderStatusEnum.REJECTED, OrderStatusEnum.CANCELLED],
  [OrderStatusEnum.ACCEPTED]: [OrderStatusEnum.PREPARING, OrderStatusEnum.CANCELLED],
  [OrderStatusEnum.PREPARING]: [OrderStatusEnum.DELIVERING, OrderStatusEnum.CANCELLED],
  [OrderStatusEnum.DELIVERING]: [OrderStatusEnum.DELIVERED],
  [OrderStatusEnum.DELIVERED]: [OrderStatusEnum.AWAITING_MATERIAL_RETURN, OrderStatusEnum.COMPLETED],
  [OrderStatusEnum.AWAITING_MATERIAL_RETURN]: [OrderStatusEnum.COMPLETED],
  [OrderStatusEnum.COMPLETED]: [],
  [OrderStatusEnum.REJECTED]: [],
  [OrderStatusEnum.CANCELLED]: [],
};

/**
 * Order status enum + FR labels + badge colors, mirroring the backend
 * OrderStatus workflow (PENDING -> ACCEPTED -> PREPARING -> DELIVERING ->
 * DELIVERED -> AWAITING_MATERIAL_RETURN -> COMPLETED, plus REJECTED/CANCELLED).
 */

export const OrderStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  DELIVERING: 'DELIVERING',
  DELIVERED: 'DELIVERED',
  AWAITING_MATERIAL_RETURN: 'AWAITING_MATERIAL_RETURN',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'En attente',
  [OrderStatus.ACCEPTED]: 'Acceptee',
  [OrderStatus.PREPARING]: 'En preparation',
  [OrderStatus.DELIVERING]: 'En livraison',
  [OrderStatus.DELIVERED]: 'Livree',
  [OrderStatus.AWAITING_MATERIAL_RETURN]: 'Retour materiel',
  [OrderStatus.COMPLETED]: 'Terminee',
  [OrderStatus.REJECTED]: 'Refusee',
  [OrderStatus.CANCELLED]: 'Annulee',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.ACCEPTED]: 'bg-blue-100 text-blue-800',
  [OrderStatus.PREPARING]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.DELIVERING]: 'bg-orange-100 text-orange-800',
  [OrderStatus.DELIVERED]: 'bg-teal-100 text-teal-800',
  [OrderStatus.AWAITING_MATERIAL_RETURN]: 'bg-purple-100 text-purple-800',
  [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [OrderStatus.REJECTED]: 'bg-red-100 text-red-800',
  [OrderStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
};

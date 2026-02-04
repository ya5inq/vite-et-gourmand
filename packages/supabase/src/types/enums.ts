export enum UserRole {
  VISITOR = 'visitor',
  USER = 'user',
  EMPLOYEE = 'employee',
  ADMIN = 'admin',
}

export enum DishCategory {
  ENTREE = 'entree',
  PLAT = 'plat',
  DESSERT = 'dessert',
}

export enum OrderStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
  [OrderStatus.REJECTED]: [],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
  [OrderStatus.READY]: [OrderStatus.DELIVERING],
  [OrderStatus.DELIVERING]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'En attente',
  [OrderStatus.REJECTED]: 'Refusee',
  [OrderStatus.CONFIRMED]: 'Confirmee',
  [OrderStatus.PREPARING]: 'En preparation',
  [OrderStatus.READY]: 'Prete',
  [OrderStatus.DELIVERING]: 'En livraison',
  [OrderStatus.COMPLETED]: 'Terminee',
  [OrderStatus.CANCELLED]: 'Annulee',
};

export const DISH_CATEGORY_LABELS: Record<DishCategory, string> = {
  [DishCategory.ENTREE]: 'Entree',
  [DishCategory.PLAT]: 'Plat',
  [DishCategory.DESSERT]: 'Dessert',
};

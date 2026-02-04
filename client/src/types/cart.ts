export interface CartItem {
  menuId: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
  minPersons: number;
  maxPersons: number | null;
  theme: string | null;
}

export interface Cart {
  items: CartItem[];
  updatedAt: number;
}

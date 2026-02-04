'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/types/cart';
import { useCart } from '@/contexts/CartContext';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const subtotal = item.unitPrice * item.quantity;

  return (
    <div className="flex items-start gap-4 py-4 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{item.menuName}</h4>
        {item.theme && (
          <span className="text-xs text-muted-foreground">{item.theme}</span>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {item.unitPrice.toFixed(2)} &euro; / personne
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
          className="p-1 rounded-md border border-border hover:bg-accent transition-colors"
          aria-label="Diminuer la quantite"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
          disabled={item.maxPersons !== null && item.quantity >= item.maxPersons}
          className="p-1 rounded-md border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Augmenter la quantite"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="text-right">
        <p className="font-semibold text-foreground">{subtotal.toFixed(2)} &euro;</p>
        <button
          onClick={() => removeItem(item.menuId)}
          className="text-destructive hover:text-destructive/80 transition-colors mt-1"
          aria-label="Supprimer du panier"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

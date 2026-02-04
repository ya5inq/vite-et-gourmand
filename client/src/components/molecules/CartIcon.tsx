'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartIconProps {
  onClick?: () => void;
}

export function CartIcon({ onClick }: CartIconProps) {
  const { getItemCount } = useCart();
  const count = getItemCount();

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-foreground hover:text-primary transition-colors"
      aria-label={`Panier (${count} article${count !== 1 ? 's' : ''})`}
    >
      <ShoppingCart size={24} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

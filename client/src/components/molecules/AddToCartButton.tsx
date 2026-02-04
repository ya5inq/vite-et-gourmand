'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/types/cart';

interface AddToCartButtonProps {
  menu: {
    id: string;
    name: string;
    price: number;
    min_persons: number;
    max_persons: number | null;
    theme: string | null;
  };
}

export function AddToCartButton({ menu }: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(menu.min_persons);
  const [showSuccess, setShowSuccess] = useState(false);

  const existingItem = items.find((i) => i.menuId === menu.id);
  const subtotal = menu.price * quantity;

  function handleAddToCart() {
    const item: Omit<CartItem, 'quantity'> & { quantity: number } = {
      menuId: menu.id,
      menuName: menu.name,
      unitPrice: menu.price,
      minPersons: menu.min_persons,
      maxPersons: menu.max_persons,
      theme: menu.theme,
      quantity,
    };
    addItem(item);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  }

  function handleIncrement() {
    if (menu.max_persons === null || quantity < menu.max_persons) {
      setQuantity((q) => q + 1);
    }
  }

  function handleDecrement() {
    if (quantity > menu.min_persons) {
      setQuantity((q) => q - 1);
    }
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center justify-center gap-4">
        <span className="text-sm text-muted-foreground">Nombre de personnes :</span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecrement}
            disabled={quantity <= menu.min_persons}
            className="p-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Diminuer"
          >
            <Minus size={18} />
          </button>
          <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
          <button
            onClick={handleIncrement}
            disabled={menu.max_persons !== null && quantity >= menu.max_persons}
            className="p-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Augmenter"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Price preview */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {menu.price.toFixed(2)} &euro; x {quantity} personnes
        </p>
        <p className="text-xl font-bold text-primary mt-1">
          {subtotal.toFixed(2)} &euro;
        </p>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={showSuccess}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-lg font-semibold transition-all ${
          showSuccess
            ? 'bg-green-500 text-white'
            : 'bg-primary text-primary-foreground hover:opacity-90'
        }`}
      >
        {showSuccess ? (
          <>
            <Check size={20} />
            Ajoute au panier
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            Ajouter au panier
          </>
        )}
      </button>

      {existingItem && !showSuccess && (
        <p className="text-center text-sm text-muted-foreground">
          Deja {existingItem.quantity} personne{existingItem.quantity > 1 ? 's' : ''} dans le
          panier
        </p>
      )}
    </div>
  );
}

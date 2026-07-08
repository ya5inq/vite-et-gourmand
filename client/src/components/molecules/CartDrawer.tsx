'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartItemRow } from './CartItemRow';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, getTotal, clearCart } = useCart();
  const total = getTotal();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="cart-drawer-title" className="text-lg font-semibold text-foreground">
            Mon panier
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Fermer le panier"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-muted-foreground mb-4" aria-hidden="true" />
              <p className="text-muted-foreground mb-4">Votre panier est vide</p>
              <Link
                href="/menus"
                onClick={onClose}
                className="text-primary hover:underline font-medium"
              >
                Decouvrir nos menus
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItemRow key={item.menuId} item={item} />
              ))}

              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="mt-4 text-sm text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                  Vider le panier
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="text-xl font-bold text-foreground">
                {total.toFixed(2)} &euro;
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Frais de livraison calcules a l&apos;etape suivante
            </p>
            <div className="grid gap-2">
              <Link
                href="/panier"
                onClick={onClose}
                className="block w-full text-center py-2.5 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Voir le panier
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full text-center py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Commander
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

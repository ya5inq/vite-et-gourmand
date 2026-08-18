'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartItemRow } from '@/components/molecules/CartItemRow';

export default function PanierPage() {
  const { items, getTotal, clearCart } = useCart();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8">
            Découvrez nos menus et ajoutez-les à votre panier.
          </p>
          <Link
            href="/menus"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={20} />
            Voir les menus
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Mon panier</h1>
        <button
          onClick={clearCart}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 size={16} />
          Vider le panier
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6">
        <div className="divide-y divide-border">
          {items.map((item) => (
            <CartItemRow key={item.menuId} item={item} />
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span className="text-foreground font-medium">{total.toFixed(2)}&nbsp;€</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Frais de livraison</span>
            <span className="text-muted-foreground">Calculés à l’étape suivante</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold text-foreground">Total estimé</span>
            <span className="text-xl font-bold text-primary">{total.toFixed(2)}&nbsp;€</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Link
            href="/checkout"
            className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Continuer vers le checkout
          </Link>
          <Link
            href="/menus"
            className="block w-full text-center py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Continuer mes achats
          </Link>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Ceci est une demande de commande. Nous confirmerons la disponibilité par email.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Check, Users } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface MenuCardProps {
  id: string;
  name: string;
  description: string | null;
  theme: string | null;
  price: number;
  min_persons: number;
  max_persons: number | null;
  image_url: string | null;
  regimes: Array<{ id: string; name: string }>;
  showAddToCart?: boolean;
}

const DEFAULT_MENU_IMAGES = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80',
];

function getDefaultImage(id: string): string {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return DEFAULT_MENU_IMAGES[hash % DEFAULT_MENU_IMAGES.length];
}

function isValidImageUrl(url: string | null): boolean {
  if (!url) return false;
  return url.startsWith('https://');
}

export function MenuCard({
  id,
  name,
  description,
  theme,
  price,
  min_persons,
  max_persons,
  image_url,
  regimes,
  showAddToCart = true,
}: MenuCardProps) {
  const imageUrl = isValidImageUrl(image_url) ? image_url! : getDefaultImage(id);
  const { addItem } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      menuId: id,
      menuName: name,
      unitPrice: price,
      minPersons: min_persons,
      maxPersons: max_persons,
      theme: theme,
      quantity: min_persons,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  }

  return (
    <Link
      href={`/menus/${id}`}
      className="block bg-card rounded-xl sm:rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all overflow-hidden group"
    >
      <div className="relative h-32 sm:h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
        />
        {theme && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-accent text-accent-foreground text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full shadow">
            {theme}
          </span>
        )}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary text-primary-foreground text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow">
          {price.toFixed(0)}&nbsp;€
        </div>
      </div>
      <div className="p-3 sm:p-5">
        <h3 className="text-sm sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1 sm:mb-2 line-clamp-1">
          {name}
        </h3>

        <p className="hidden sm:block text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
          <Users size={14} className="sm:w-4 sm:h-4" />
          <span>
            {min_persons}{max_persons ? `-${max_persons}` : '+'} pers.
          </span>
        </div>

        {regimes.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-1.5 mb-4">
            {regimes.map((regime) => (
              <span
                key={regime.id}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded"
              >
                {regime.name}
              </span>
            ))}
          </div>
        )}

        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={showSuccess}
            className={`w-full flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              showSuccess
                ? 'bg-green-500 text-white'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            {showSuccess ? (
              <>
                <Check size={14} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Ajouté !</span>
                <span className="sm:hidden">OK</span>
              </>
            ) : (
              <>
                <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Ajouter au panier</span>
                <span className="sm:hidden">Ajouter</span>
              </>
            )}
          </button>
        )}
      </div>
    </Link>
  );
}

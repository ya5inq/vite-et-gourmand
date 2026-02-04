'use client';

import Link from 'next/link';
import { ArrowRight, Utensils } from 'lucide-react';
import { MenuCard } from './MenuCard';

interface Menu {
  id: string;
  name: string;
  description: string | null;
  theme: string | null;
  price: number;
  min_persons: number;
  max_persons: number | null;
  image_url: string | null;
  regimes: Array<{ id: string; name: string }>;
}

interface PopularMenusSectionProps {
  menus: Menu[];
  title?: string;
  subtitle?: string;
}

export function PopularMenusSection({
  menus,
  title = 'Composez votre evenement',
  subtitle = 'Mariage, seminaire, anniversaire... Choisissez le menu qui sublimera votre occasion',
}: PopularMenusSectionProps) {
  if (menus.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-primary mb-2 sm:mb-3">
              <Utensils size={18} />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide">Nos menus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3">{title}</h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl">{subtitle}</p>
          </div>
          <Link
            href="/menus"
            className="inline-flex items-center justify-center sm:justify-start gap-2 text-primary font-semibold hover:underline shrink-0 text-sm sm:text-base"
          >
            Voir tous les menus
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {menus.slice(0, 4).map((menu) => (
            <MenuCard key={menu.id} {...menu} />
          ))}
        </div>
      </div>
    </section>
  );
}

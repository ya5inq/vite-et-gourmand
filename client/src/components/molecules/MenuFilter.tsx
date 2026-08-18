'use client';

import { useMemo, useState } from 'react';
import { MenuCard } from '@/components/molecules/MenuCard';

interface Regime {
  id: string;
  name: string;
}

interface MenuWithRegimes {
  id: string;
  name: string;
  description: string | null;
  theme: string | null;
  price: number;
  min_persons: number;
  max_persons: number | null;
  image_url: string | null;
  regimes: Regime[];
}

interface MenuFilterProps {
  themes: string[];
  regimes: Regime[];
  menus: MenuWithRegimes[];
}

export function MenuFilter({ themes, regimes, menus }: MenuFilterProps) {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedRegime, setSelectedRegime] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPersons, setMinPersons] = useState('');

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      if (selectedTheme && menu.theme !== selectedTheme) return false;
      if (selectedRegime && !menu.regimes.some((r) => r.id === selectedRegime)) return false;
      if (maxPrice && menu.price > Number(maxPrice)) return false;
      if (minPersons && menu.min_persons > Number(minPersons)) return false;
      return true;
    });
  }, [menus, selectedTheme, selectedRegime, maxPrice, minPersons]);

  const hasFilters = selectedTheme || selectedRegime || maxPrice || minPersons;

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-card rounded-xl border border-border p-4 mb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="theme-filter" className="block text-sm font-medium text-foreground mb-1">
              Thème
            </label>
            <select
              id="theme-filter"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Tous les thèmes</option>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="regime-filter" className="block text-sm font-medium text-foreground mb-1">
              Régime alimentaire
            </label>
            <select
              id="regime-filter"
              value={selectedRegime}
              onChange={(e) => setSelectedRegime(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Tous les régimes</option>
              {regimes.map((regime) => (
                <option key={regime.id} value={regime.id}>
                  {regime.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price-filter" className="block text-sm font-medium text-foreground mb-1">
              Prix max. (&#8364;/pers.)
            </label>
            <input
              id="price-filter"
              type="number"
              min="0"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Ex: 50"
            />
          </div>

          <div>
            <label htmlFor="persons-filter" className="block text-sm font-medium text-foreground mb-1">
              Nb. personnes min.
            </label>
            <input
              id="persons-filter"
              type="number"
              min="1"
              value={minPersons}
              onChange={(e) => setMinPersons(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Ex: 10"
            />
          </div>
        </div>

        {hasFilters && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredMenus.length} menu{filteredMenus.length !== 1 ? 's' : ''} trouvé{filteredMenus.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={() => {
                setSelectedTheme('');
                setSelectedRegime('');
                setMaxPrice('');
                setMinPersons('');
              }}
              className="text-sm text-primary hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Menu grid */}
      {filteredMenus.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            Aucun menu ne correspond à vos critères.
          </p>
          <button
            onClick={() => {
              setSelectedTheme('');
              setSelectedRegime('');
              setMaxPrice('');
              setMinPersons('');
            }}
            className="mt-4 text-primary hover:underline font-medium"
          >
            Voir tous les menus
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.map((menu) => (
            <MenuCard key={menu.id} {...menu} />
          ))}
        </div>
      )}
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DISH_CATEGORY_LABELS, DishCategory } from '@vite-et-gourmand/supabase/enums';
import { AddToCartButton } from '@/components/molecules/AddToCartButton';

const DEFAULT_MENU_IMAGES = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
];

function getDefaultImage(id: string): string {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return DEFAULT_MENU_IMAGES[hash % DEFAULT_MENU_IMAGES.length];
}

function isValidImageUrl(url: string | null): boolean {
  if (!url) return false;
  return url.startsWith('https://');
}

const ALLERGEN_ICONS: Record<string, string> = {
  'gluten': '🌾',
  'crustaces': '🦐',
  'crustacés': '🦐',
  'oeufs': '🥚',
  'poisson': '🐟',
  'poissons': '🐟',
  'arachides': '🥜',
  'soja': '🫘',
  'lait': '🥛',
  'lactose': '🥛',
  'fruits a coque': '🌰',
  'fruits à coque': '🌰',
  'noix': '🌰',
  'celeri': '🥬',
  'céleri': '🥬',
  'moutarde': '🟡',
  'sesame': '🫘',
  'sésame': '🫘',
  'sulfites': '🍷',
  'lupin': '🌸',
  'mollusques': '🦪',
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('menus').select('name, description').eq('id', id).single();
  const menu = data as { name: string; description: string | null } | null;

  if (!menu) return { title: 'Menu introuvable' };

  return {
    title: `${menu.name} - Vite & Gourmand`,
    description: menu.description,
  };
}

export default async function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('menus')
    .select(`
      *,
      menu_dishes(
        dishes(
          *,
          dish_allergens(
            allergens(id, name, icon)
          )
        )
      ),
      menu_dietary_regimes(
        dietary_regimes(id, name, description)
      )
    `)
    .eq('id', id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const menu = data as any;

  if (!menu) notFound();

  const dishes = menu.menu_dishes
    ?.map((md: { dishes: Record<string, unknown> | null }) => md.dishes)
    .filter(Boolean) ?? [];

  const regimes = menu.menu_dietary_regimes
    ?.map((mdr: { dietary_regimes: Record<string, unknown> | null }) => mdr.dietary_regimes)
    .filter(Boolean) ?? [];

  const categories = Object.values(DishCategory);
  const dishesByCategory = categories.reduce<Record<string, typeof dishes>>((acc, cat) => {
    const filtered = dishes.filter((d: { category: string }) => d.category === cat);
    if (filtered.length > 0) acc[cat] = filtered;
    return acc;
  }, {});

  const imageUrl = isValidImageUrl(menu.image_url) ? menu.image_url! : getDefaultImage(menu.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/menus"
        className="text-primary hover:underline mb-6 inline-block"
      >
        &larr; Retour aux menus
      </Link>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="relative h-64 sm:h-80">
          <Image
            src={imageUrl}
            alt={menu.name}
            fill
            priority
            className="object-cover"
          />
          {menu.theme && (
            <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm px-3 py-1 rounded-full shadow">
              {menu.theme}
            </span>
          )}
        </div>
        <div className="p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{menu.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{menu.price.toFixed(2)} &euro;</p>
            <p className="text-sm text-muted-foreground">par personne</p>
          </div>
        </div>

        {menu.description && (
          <p className="text-muted-foreground mb-8 text-lg">{menu.description}</p>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Personnes</p>
            <p className="font-semibold text-foreground">
              Min. {menu.min_persons}
              {menu.max_persons && ` - Max. ${menu.max_persons}`}
            </p>
          </div>
          {menu.conditions && (
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Conditions</p>
              <p className="font-semibold text-foreground">{menu.conditions}</p>
            </div>
          )}
        </div>

        {regimes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">Regimes alimentaires</h2>
            <div className="flex flex-wrap gap-2">
              {regimes.map((regime: { id: string; name: string; description: string | null }) => (
                <span
                  key={regime.id}
                  className="bg-accent text-accent-foreground text-sm px-3 py-1 rounded-full"
                  title={regime.description ?? undefined}
                >
                  {regime.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Composition du menu</h2>
          <div className="space-y-6">
            {Object.entries(dishesByCategory).map(([category, categoryDishes]) => (
              <div key={category}>
                <h3 className="text-lg font-medium text-primary mb-3 border-b border-border pb-2">
                  {DISH_CATEGORY_LABELS[category as DishCategory] ?? category}
                </h3>
                <div className="space-y-3">
                  {(categoryDishes as Array<{
                    id: string;
                    name: string;
                    description: string | null;
                    dish_allergens?: Array<{ allergens: { id: string; name: string; icon: string | null } | null }>;
                  }>).map((dish) => {
                    const allergens = (dish.dish_allergens
                      ?.map((da) => da.allergens)
                      .filter((a): a is { id: string; name: string; icon: string | null } => a !== null)) ?? [];

                    return (
                      <div key={dish.id} className="pl-4">
                        <p className="font-medium text-foreground">{dish.name}</p>
                        {dish.description && (
                          <p className="text-sm text-muted-foreground">{dish.description}</p>
                        )}
                        {allergens.length > 0 && (
                          <div className="flex gap-1.5 mt-1">
                            {allergens.map((a) => {
                              const icon = a.icon || ALLERGEN_ICONS[a.name.toLowerCase()] || null;
                              return (
                                <span
                                  key={a.id}
                                  className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded"
                                  title={a.name}
                                >
                                  {icon && <span className="text-sm">{icon}</span>}
                                  {!icon && a.name}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <AddToCartButton
            menu={{
              id: menu.id,
              name: menu.name,
              price: menu.price,
              min_persons: menu.min_persons,
              max_persons: menu.max_persons,
              theme: menu.theme,
            }}
          />
        </div>
        </div>
      </div>

      <div className="mt-8 bg-card rounded-2xl shadow-sm border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Legende des allergenes</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.entries(ALLERGEN_ICONS).filter(([key]) =>
            !key.includes('é') && !key.includes('à')
          ).map(([name, icon]) => (
            <div key={name} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{icon}</span>
              <span className="text-muted-foreground capitalize">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

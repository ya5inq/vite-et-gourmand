import Image from 'next/image';
import { getServerPublicApi } from '@/lib/api/server';
import { MenuFilter } from '@/components/molecules/MenuFilter';

export const metadata = {
  title: 'Nos Menus - Vite & Gourmand',
  description: 'Decouvrez nos menus traiteur pour tous vos evenements a Bordeaux.',
};

export const dynamic = 'force-dynamic';

const HEADER_IMAGE = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80';

export default async function MenusPage() {
  const api = getServerPublicApi();

  const [menusRes, regimesRes] = await Promise.allSettled([
    // Public menu list is already filtered to available menus by the backend.
    api.publicMenuGetAll({ limit: 100, sortBy: 'price', sortOrder: 'ASC' }),
    api.publicDietaryRegimeGetAll(),
  ]);

  const menusWithRegimes =
    menusRes.status === 'fulfilled'
      ? menusRes.value.data.items.map((menu) => ({
          id: menu.id,
          name: menu.name,
          description: menu.description ?? null,
          theme: menu.theme ?? null,
          price: menu.price,
          min_persons: menu.minPersons,
          max_persons: menu.maxPersons ?? null,
          image_url: menu.imageUrl ?? null,
          regimes: (menu.dietaryRegimes ?? []).map((r) => ({ id: r.id, name: r.name })),
        }))
      : [];

  const regimes =
    regimesRes.status === 'fulfilled'
      ? regimesRes.value.data.items.map((r) => ({ id: r.id, name: r.name }))
      : [];

  const themes = [
    ...new Set(
      menusWithRegimes.map((m) => m.theme).filter((t): t is string => !!t),
    ),
  ];

  return (
    <div>
      <div className="relative h-64 sm:h-80">
        <Image
          src={HEADER_IMAGE}
          alt="Nos menus traiteur"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">Nos Menus</h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto drop-shadow">
              Decouvrez notre selection de menus traiteur, prepares avec soin par notre chef
              pour sublimer vos evenements.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MenuFilter themes={themes} regimes={regimes} menus={menusWithRegimes} />
      </div>
    </div>
  );
}

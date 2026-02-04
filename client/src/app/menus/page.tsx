import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { MenuFilter } from '@/components/molecules/MenuFilter';

export const metadata = {
  title: 'Nos Menus - Vite & Gourmand',
  description: 'Decouvrez nos menus traiteur pour tous vos evenements a Bordeaux.',
};

const HEADER_IMAGE = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80';

export default async function MenusPage() {
  const supabase = await createClient();

  const { data: menus } = await supabase
    .from('menus')
    .select(`
      *,
      menu_dietary_regimes(
        dietary_regimes(id, name)
      )
    `)
    .eq('is_available', true)
    .order('price', { ascending: true });

  const { data: regimes } = await supabase
    .from('dietary_regimes')
    .select('*')
    .order('name');

  const themes = [...new Set(menus?.map((m) => m.theme).filter(Boolean) ?? [])];

  const menusWithRegimes = menus?.map((menu) => ({
    ...menu,
    regimes: menu.menu_dietary_regimes
      ?.map((mdr: { dietary_regimes: { id: string; name: string } | null }) => mdr.dietary_regimes)
      .filter(Boolean) ?? [],
  })) ?? [];

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
        <MenuFilter
          themes={themes as string[]}
          regimes={regimes ?? []}
          menus={menusWithRegimes}
        />
      </div>
    </div>
  );
}

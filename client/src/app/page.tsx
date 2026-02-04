import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/molecules/HeroSection';
import { FeaturesSection } from '@/components/molecules/FeaturesSection';
import { PopularMenusSection } from '@/components/molecules/PopularMenusSection';
import { ValuesSection } from '@/components/molecules/ValuesSection';
import { CtaSection } from '@/components/molecules/CtaSection';
import { TestimonialsSection } from '@/components/molecules/TestimonialsSection';

interface CmsContent {
  title?: string;
  subtitle?: string;
  description?: string;
  cta_text?: string;
  cta_link?: string;
  items?: Array<{
    icon?: string;
    title?: string;
    description?: string;
  }>;
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data: pageContentsData } = await supabase
    .from('page_contents')
    .select('*')
    .eq('page', 'home');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageContents = pageContentsData as any[] | null;

  const sections: Record<string, CmsContent> = {};
  pageContents?.forEach((item) => {
    sections[item.section] = item.content as CmsContent;
  });

  const { data: menusData } = await supabase
    .from('menus')
    .select(`
      *,
      menu_dietary_regimes(
        dietary_regimes(id, name)
      )
    `)
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(4);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const menus = menusData as any[] | null;

  const menusWithRegimes = menus?.map((menu) => ({
    ...menu,
    regimes: menu.menu_dietary_regimes
      ?.map((mdr: { dietary_regimes: { id: string; name: string } | null }) => mdr.dietary_regimes)
      .filter(Boolean) ?? [],
  })) ?? [];

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles:user_id(first_name, last_name)')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(6);

  const heroContent = sections['hero'] ?? {
    title: 'Vite & Gourmand',
    subtitle: "Traiteur d'exception a Bordeaux",
    description:
      'Des menus raffines et savoureux pour tous vos evenements. Mariages, seminaires, anniversaires... nous sublimions chaque occasion.',
    cta_text: 'Decouvrir nos menus',
    cta_link: '/menus',
  };

  const featuresContent = sections['features'] ?? {
    title: 'Pourquoi nous choisir ?',
    items: [
      {
        icon: 'ChefHat',
        title: 'Chef experimente',
        description: 'Notre chef cree des menus uniques avec des produits frais et locaux.',
      },
      {
        icon: 'Truck',
        title: 'Livraison soignee',
        description: 'Livraison dans toute la region bordelaise, dans le respect de la chaine du froid.',
      },
      {
        icon: 'Users',
        title: 'Sur mesure',
        description: "Menus adaptes a vos besoins : vegetarien, sans gluten, halal...",
      },
      {
        icon: 'Star',
        title: 'Qualite garantie',
        description: 'Des ingredients premium et un savoir-faire artisanal pour chaque plat.',
      },
    ],
  };

  const valuesContent = sections['values'] ?? {
    title: 'Nos valeurs',
    items: [
      {
        icon: 'Leaf',
        title: 'Produits locaux',
        description: 'Nous privilegions les producteurs locaux et les circuits courts.',
      },
      {
        icon: 'Heart',
        title: 'Passion',
        description: 'La cuisine est notre passion, chaque plat est prepare avec amour.',
      },
      {
        icon: 'Recycle',
        title: 'Eco-responsable',
        description: 'Emballages recyclables et lutte contre le gaspillage alimentaire.',
      },
      {
        icon: 'Handshake',
        title: 'Confiance',
        description: 'Un service fiable et transparent, de la commande a la livraison.',
      },
    ],
  };

  return (
    <div>
      {/* 1. Accroche - Qui sommes-nous et que proposons-nous */}
      <HeroSection content={heroContent} />

      {/* 2. Produits - Montrer immediatement ce qu'on vend */}
      <PopularMenusSection menus={menusWithRegimes} />

      {/* 3. Reassurance - Pourquoi nous faire confiance */}
      <FeaturesSection content={featuresContent} />

      {/* 4. Preuve sociale - Les clients temoignent */}
      <TestimonialsSection reviews={reviews ?? []} />

      {/* 5. Valeurs - Creer un lien emotionnel */}
      <ValuesSection content={valuesContent} />

      {/* 6. Call to Action final - Pousser a l'action */}
      <CtaSection />
    </div>
  );
}

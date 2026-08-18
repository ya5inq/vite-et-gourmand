import { getServerPublicApi } from '@/lib/api/server';
import { HeroSection } from '@/components/molecules/HeroSection';
import { FeaturesSection } from '@/components/molecules/FeaturesSection';
import { PopularMenusSection } from '@/components/molecules/PopularMenusSection';
import { ValuesSection } from '@/components/molecules/ValuesSection';
import { CtaSection } from '@/components/molecules/CtaSection';
import { TestimonialsSection } from '@/components/molecules/TestimonialsSection';

export const dynamic = 'force-dynamic';

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
  const api = getServerPublicApi();

  // Run independent public fetches in parallel; tolerate individual failures so
  // the homepage always renders (with fallback content for missing sections).
  const [pageContentsRes, menusRes, reviewsRes] = await Promise.allSettled([
    api.publicPageContentGet({ page: 'home' }),
    api.publicMenuGetAll({ limit: 4, sortBy: 'createdAt', sortOrder: 'DESC' }),
    api.publicReviewGetApproved({ limit: 6 }),
  ]);

  const sections: Record<string, CmsContent> = {};
  if (pageContentsRes.status === 'fulfilled') {
    for (const item of pageContentsRes.value.data.items) {
      sections[item.section] = item.content as CmsContent;
    }
  }

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
          regimes: [] as Array<{ id: string; name: string }>,
        }))
      : [];

  const reviews =
    reviewsRes.status === 'fulfilled'
      ? reviewsRes.value.data.items.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment ?? null,
          created_at: r.createdAt,
          profiles: { first_name: r.firstName ?? null, last_name: null },
        }))
      : [];

  const heroContent = sections['hero'] ?? {
    title: 'Vite & Gourmand',
    subtitle: 'Traiteur d’exception à Bordeaux',
    description:
      'Des menus raffinés et savoureux pour tous vos évènements. Mariages, séminaires, anniversaires... nous sublimons chaque occasion.',
    cta_text: 'Découvrir nos menus',
    cta_link: '/menus',
  };

  const featuresContent: CmsContent = sections['features']
    ? { title: 'Pourquoi nous choisir ?', ...sections['features'] }
    : { title: 'Pourquoi nous choisir ?', items: [] };

  const valuesContent: CmsContent = sections['values']
    ? { title: 'Nos valeurs', ...sections['values'] }
    : { title: 'Nos valeurs', items: [] };

  return (
    <div>
      <HeroSection content={heroContent} />
      <PopularMenusSection menus={menusWithRegimes} />
      <FeaturesSection content={featuresContent} />
      <TestimonialsSection reviews={reviews} />
      <ValuesSection content={valuesContent} />
      <CtaSection />
    </div>
  );
}

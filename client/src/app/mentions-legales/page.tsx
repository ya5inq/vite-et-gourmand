import { LegalContent } from '@/components/molecules/LegalContent';

export const metadata = {
  title: 'Mentions légales - Vite & Gourmand',
};

export const dynamic = 'force-dynamic';

export default function MentionsLegalesPage() {
  return (
    <LegalContent
      section="mentions"
      title="Mentions légales"
      fallback="Vite & Gourmand - Bordeaux, France. Pour toute question relative aux mentions légales, veuillez nous contacter par email à contact@viteetgourmand.fr."
    />
  );
}

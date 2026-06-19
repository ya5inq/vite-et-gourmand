import { LegalContent } from '@/components/molecules/LegalContent';

export const metadata = {
  title: 'Mentions legales - Vite & Gourmand',
};

export const dynamic = 'force-dynamic';

export default function MentionsLegalesPage() {
  return (
    <LegalContent
      section="mentions"
      title="Mentions legales"
      fallback="Vite & Gourmand - Bordeaux, France. Pour toute question relative aux mentions legales, veuillez nous contacter par email a contact@viteetgourmand.fr."
    />
  );
}

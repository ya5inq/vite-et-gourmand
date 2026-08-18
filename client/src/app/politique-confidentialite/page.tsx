import { LegalContent } from '@/components/molecules/LegalContent';

export const metadata = {
  title: 'Politique de confidentialité - Vite & Gourmand',
};

export const dynamic = 'force-dynamic';

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalContent
      section="privacy"
      title="Politique de confidentialité"
      fallback="Vite & Gourmand s’engage à protéger la vie privée de ses utilisateurs. Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression de vos données. Contactez-nous à contact@viteetgourmand.fr."
    />
  );
}

import { LegalContent } from '@/components/molecules/LegalContent';

export const metadata = {
  title: 'Politique de confidentialite - Vite & Gourmand',
};

export const dynamic = 'force-dynamic';

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalContent
      section="privacy"
      title="Politique de confidentialite"
      fallback="Vite & Gourmand s'engage a proteger la vie privee de ses utilisateurs. Conformement au RGPD, vous disposez d'un droit d'acces, de rectification et de suppression de vos donnees. Contactez-nous a contact@viteetgourmand.fr."
    />
  );
}

import { LegalContent } from '@/components/molecules/LegalContent';

export const metadata = {
  title: 'Conditions générales de vente - Vite & Gourmand',
};

export const dynamic = 'force-dynamic';

export default function CgvPage() {
  return (
    <LegalContent
      section="cgv"
      title="Conditions générales de vente"
      fallback="Les présentes conditions générales de vente régissent les relations contractuelles entre la société Vite & Gourmand et ses clients dans le cadre de ses prestations de traiteur."
    />
  );
}

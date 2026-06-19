import { LegalContent } from '@/components/molecules/LegalContent';

export const metadata = {
  title: 'Conditions generales de vente - Vite & Gourmand',
};

export const dynamic = 'force-dynamic';

export default function CgvPage() {
  return (
    <LegalContent
      section="cgv"
      title="Conditions generales de vente"
      fallback="Les presentes conditions generales de vente regissent les relations contractuelles entre la societe Vite & Gourmand et ses clients dans le cadre de ses prestations de traiteur."
    />
  );
}

import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Politique de confidentialite - Vite & Gourmand',
};

export default async function PolitiqueConfidentialitePage() {
  const supabase = await createClient();

  const { data: content } = await supabase
    .from('page_contents')
    .select('content')
    .eq('page', 'politique-confidentialite')
    .eq('section', 'main')
    .single();

  const pageContent = content?.content as { title?: string; body?: string } | null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {pageContent?.title ?? 'Politique de confidentialite'}
      </h1>
      <div className="prose prose-stone max-w-none">
        {pageContent?.body ? (
          <div dangerouslySetInnerHTML={{ __html: pageContent.body }} />
        ) : (
          <div className="text-muted-foreground space-y-4">
            <p>
              Vite & Gourmand s&apos;engage a proteger la vie privee de ses utilisateurs. Cette
              politique de confidentialite explique comment nous collectons, utilisons et
              protegeons vos donnees personnelles.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-6">Donnees collectees</h2>
            <p>
              Nous collectons les donnees que vous nous fournissez directement : nom, email,
              telephone, adresse de livraison, ainsi que les donnees relatives a vos commandes.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-6">Utilisation des donnees</h2>
            <p>
              Vos donnees sont utilisees pour traiter vos commandes, vous contacter en cas de besoin,
              et ameliorer nos services. Nous ne vendons jamais vos donnees a des tiers.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-6">Vos droits</h2>
            <p>
              Conformement au RGPD, vous disposez d&apos;un droit d&apos;acces, de rectification
              et de suppression de vos donnees. Contactez-nous a contact@viteetgourmand.fr.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Conditions generales de vente - Vite & Gourmand',
};

export default async function CgvPage() {
  const supabase = await createClient();

  const { data: content } = await supabase
    .from('page_contents')
    .select('content')
    .eq('page', 'cgv')
    .eq('section', 'main')
    .single();

  const pageContent = (content as { content?: { title?: string; body?: string } } | null)?.content ?? null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {pageContent?.title ?? 'Conditions generales de vente'}
      </h1>
      <div className="prose prose-stone max-w-none">
        {pageContent?.body ? (
          <div dangerouslySetInnerHTML={{ __html: pageContent.body }} />
        ) : (
          <div className="text-muted-foreground space-y-4">
            <p>
              Les presentes conditions generales de vente regissent les relations contractuelles
              entre la societe Vite & Gourmand et ses clients dans le cadre de ses prestations
              de traiteur.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-6">Article 1 - Objet</h2>
            <p>
              Les presentes CGV ont pour objet de definir les droits et obligations des parties
              dans le cadre de la vente de prestations traiteur proposees par Vite & Gourmand.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-6">Article 2 - Commandes</h2>
            <p>
              Toute commande implique l&apos;acceptation entiere et sans reserve des presentes
              conditions generales de vente. Les commandes doivent etre passees au minimum 48h
              a l&apos;avance.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-6">Article 3 - Tarifs</h2>
            <p>
              Les prix sont indiques en euros TTC. Vite & Gourmand se reserve le droit de modifier
              ses tarifs a tout moment, les prestations etant facturees sur la base des tarifs
              en vigueur au moment de la commande.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

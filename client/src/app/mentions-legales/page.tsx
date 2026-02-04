import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Mentions legales - Vite & Gourmand',
};

export default async function MentionsLegalesPage() {
  const supabase = await createClient();

  const { data: content } = await supabase
    .from('page_contents')
    .select('content')
    .eq('page', 'mentions-legales')
    .eq('section', 'main')
    .single();

  const pageContent = (content as { content?: { title?: string; body?: string } } | null)?.content ?? null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {pageContent?.title ?? 'Mentions legales'}
      </h1>
      <div className="prose prose-stone max-w-none">
        {pageContent?.body ? (
          <div dangerouslySetInnerHTML={{ __html: pageContent.body }} />
        ) : (
          <div className="text-muted-foreground">
            <p>
              <strong>Raison sociale :</strong> Vite & Gourmand
            </p>
            <p>
              <strong>Siege social :</strong> Bordeaux, France
            </p>
            <p>
              <strong>Email :</strong> contact@viteetgourmand.fr
            </p>
            <p>
              <strong>Telephone :</strong> 05 56 00 00 00
            </p>
            <p className="mt-6">
              Ce site est edite par la societe Vite & Gourmand. Pour toute question relative aux
              mentions legales, veuillez nous contacter par email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

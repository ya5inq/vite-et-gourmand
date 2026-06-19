import { getServerPublicApi } from '@/lib/api/server';

/**
 * Server component that fetches a single CMS legal section (page `legal`,
 * section `mentions` | `cgv` | `privacy`) and renders its plain-text content.
 * The seed stores the body as a `{ content: string }` object with `\n` line
 * breaks, so we render it with `whitespace-pre-line`.
 */
export async function LegalContent({
  section,
  title,
  fallback,
}: {
  section: string;
  title: string;
  fallback: string;
}) {
  const api = getServerPublicApi();

  let body: string | null = null;
  try {
    const { data } = await api.publicPageContentGet({ page: 'legal', section });
    const content = data.items[0]?.content as { content?: string } | undefined;
    body = content?.content ?? null;
  } catch {
    body = null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">{title}</h1>
      <div className="prose prose-stone max-w-none">
        <p className="text-muted-foreground whitespace-pre-line">{body ?? fallback}</p>
      </div>
    </div>
  );
}

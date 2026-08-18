import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { usePageContents, useUpsertPageContent } from '@/api/hooks/usePageContents';

const TABS = [
  { key: 'mentions-legales', label: 'Mentions légales' },
  { key: 'cgv', label: 'CGV' },
  { key: 'confidentialite', label: 'Politique de confidentialité' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const FIELD_CONFIG: Record<TabKey, { name: string; label: string; type: 'text' | 'textarea' }[]> = {
  'mentions-legales': [
    { name: 'title', label: 'Titre', type: 'text' },
    { name: 'content', label: 'Contenu (HTML/Markdown)', type: 'textarea' },
    { name: 'last_updated', label: 'Dernière mise à jour', type: 'text' },
  ],
  cgv: [
    { name: 'title', label: 'Titre', type: 'text' },
    { name: 'content', label: 'Contenu (HTML/Markdown)', type: 'textarea' },
    { name: 'last_updated', label: 'Dernière mise à jour', type: 'text' },
  ],
  confidentialite: [
    { name: 'title', label: 'Titre', type: 'text' },
    { name: 'content', label: 'Contenu (HTML/Markdown)', type: 'textarea' },
    { name: 'last_updated', label: 'Dernière mise à jour', type: 'text' },
  ],
};

export const CmsLegalPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('mentions-legales');
  const { data: contents, isLoading } = usePageContents('legal');
  const upsert = useUpsertPageContent();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (contents) {
      const sectionData = contents.find((c) => c.section === activeTab);
      if (sectionData) {
        const formValues: Record<string, string> = {};
        for (const field of FIELD_CONFIG[activeTab]) {
          formValues[field.name] = String(sectionData.content[field.name] ?? '');
        }
        reset(formValues);
      } else {
        reset({});
      }
    }
  }, [contents, activeTab, reset]);

  const onSubmit = (data: Record<string, unknown>) => {
    const content: Record<string, unknown> = {};
    for (const field of FIELD_CONFIG[activeTab]) {
      content[field.name] = data[field.name] as string;
    }
    upsert.mutate({ page: 'legal', section: activeTab, content });
  };

  return (
    <DashboardPageLayout title="CMS - Pages légales" description="Gestion des pages légales">
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
          {FIELD_CONFIG[activeTab].map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-sm font-medium">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  {...register(field.name)}
                  rows={15}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2 font-mono"
                />
              ) : (
                <input
                  {...register(field.name)}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={upsert.isPending}
            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {upsert.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      )}
    </DashboardPageLayout>
  );
};

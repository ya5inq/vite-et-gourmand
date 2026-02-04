import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { usePageContents, useUpsertPageContent } from '@/api/hooks/usePageContents';

const TABS = [
  { key: 'hero', label: 'Hero' },
  { key: 'filtres', label: 'Filtres' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const FIELD_CONFIG: Record<TabKey, { name: string; label: string; type: 'text' | 'textarea' }[]> = {
  hero: [
    { name: 'title', label: 'Titre', type: 'text' },
    { name: 'subtitle', label: 'Sous-titre', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image_url', label: 'URL de l\'image', type: 'text' },
  ],
  filtres: [
    { name: 'title', label: 'Titre de la section filtres', type: 'text' },
    { name: 'categories', label: 'Categories (JSON)', type: 'textarea' },
    { name: 'dietary_labels', label: 'Labels regimes (JSON)', type: 'textarea' },
  ],
};

export const CmsMenuPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('hero');
  const { data: contents, isLoading } = usePageContents('menu');
  const upsert = useUpsertPageContent();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (contents) {
      const sectionData = contents.find((c) => c.section === activeTab);
      if (sectionData) {
        const formValues: Record<string, string> = {};
        for (const field of FIELD_CONFIG[activeTab]) {
          const value = sectionData.content[field.name];
          formValues[field.name] = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value ?? '');
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
      const val = data[field.name] as string;
      if (field.name === 'categories' || field.name === 'dietary_labels') {
        try {
          content[field.name] = JSON.parse(val || '[]');
        } catch {
          toast.error(`JSON invalide pour le champ "${field.label}"`);
          return;
        }
      } else {
        content[field.name] = val;
      }
    }
    upsert.mutate({ page: 'menu', section: activeTab, content });
  };

  return (
    <DashboardPageLayout title="CMS - Page Menus" description="Gestion du contenu de la page menus">
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
                  rows={8}
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

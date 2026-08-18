import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { usePageContents, useUpsertPageContent } from '@/api/hooks/usePageContents';

const TABS = [
  { key: 'contenu', label: 'Contenu' },
  { key: 'formulaire', label: 'Formulaire' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const FIELD_CONFIG: Record<TabKey, { name: string; label: string; type: 'text' | 'textarea' }[]> = {
  contenu: [
    { name: 'title', label: 'Titre', type: 'text' },
    { name: 'subtitle', label: 'Sous-titre', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'address', label: 'Adresse', type: 'text' },
    { name: 'phone', label: 'Téléphone', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'map_embed_url', label: 'URL embed carte', type: 'text' },
  ],
  formulaire: [
    { name: 'title', label: 'Titre du formulaire', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'success_message', label: 'Message de succès', type: 'text' },
    { name: 'subjects', label: 'Sujets disponibles (un par ligne)', type: 'textarea' },
  ],
};

export const CmsContactPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('contenu');
  const { data: contents, isLoading } = usePageContents('contact');
  const upsert = useUpsertPageContent();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (contents) {
      const sectionData = contents.find((c) => c.section === activeTab);
      if (sectionData) {
        const formValues: Record<string, string> = {};
        for (const field of FIELD_CONFIG[activeTab]) {
          const value = sectionData.content[field.name];
          if (field.name === 'subjects' && Array.isArray(value)) {
            formValues[field.name] = value.join('\n');
          } else {
            formValues[field.name] = String(value ?? '');
          }
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
      if (field.name === 'subjects') {
        content[field.name] = val.split('\n').map((s) => s.trim()).filter(Boolean);
      } else {
        content[field.name] = val;
      }
    }
    upsert.mutate({ page: 'contact', section: activeTab, content });
  };

  return (
    <DashboardPageLayout title="CMS - Contact" description="Gestion du contenu de la page contact">
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
                  rows={5}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
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

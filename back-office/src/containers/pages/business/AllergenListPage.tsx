import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { useAllergens, useCreateAllergen, useUpdateAllergen, useDeleteAllergen } from '@/api/hooks/useDishes';

const allergenSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
});

type AllergenForm = z.infer<typeof allergenSchema>;

type AllergenRow = { id: string; name: string; description: string | null };

export const AllergenListPage = () => {
  const { data: allergens, isLoading } = useAllergens();
  const createAllergen = useCreateAllergen();
  const updateAllergen = useUpdateAllergen();
  const deleteAllergen = useDeleteAllergen();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<AllergenRow | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AllergenForm>({
    resolver: zodResolver(allergenSchema),
  });

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEdit = (allergen: AllergenRow) => {
    setEditing(allergen);
    reset({ name: allergen.name, description: allergen.description ?? '' });
    setIsModalOpen(true);
  };

  const onSubmit = (data: AllergenForm) => {
    if (editing) {
      updateAllergen.mutate({ id: editing.id, ...data }, { onSuccess: () => setIsModalOpen(false) });
    } else {
      createAllergen.mutate(data, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cet allergene ?')) {
      deleteAllergen.mutate(id);
    }
  };

  return (
    <DashboardPageLayout
      title="Allergenes"
      description="Gestion des allergenes"
      actions={
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Nouvel allergene
        </button>
      }
    >
      {isLoading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nom</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {allergens?.map((allergen) => (
                <tr key={allergen.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{allergen.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{allergen.description ?? '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(allergen)}
                      className="mr-2 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(allergen.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {allergens?.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun allergene
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">{editing ? 'Modifier l\'allergene' : 'Nouvel allergene'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nom</label>
                <input
                  {...register('name')}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createAllergen.isPending || updateAllergen.isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
};

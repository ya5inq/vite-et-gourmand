import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { useDishes, useCreateDish, useUpdateDish, useDeleteDish, type DishRow } from '@/api/hooks/useDishes';

const dishSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  category: z.enum(['entree', 'plat', 'dessert']),
  price: z.coerce.number().min(0, 'Le prix doit être positif'),
  isAvailable: z.boolean(),
  imageUrl: z.string().optional(),
});

type DishForm = z.infer<typeof dishSchema>;

const CATEGORY_LABELS: Record<DishForm['category'], string> = {
  entree: 'Entrée',
  plat: 'Plat',
  dessert: 'Dessert',
};

export const DishListPage = () => {
  const { data: dishes, isLoading } = useDishes();
  const createDish = useCreateDish();
  const updateDish = useUpdateDish();
  const deleteDish = useDeleteDish();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<DishRow | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DishForm>({
    resolver: zodResolver(dishSchema),
    defaultValues: { isAvailable: true, price: 0, category: 'plat' },
  });

  const openCreate = () => {
    setEditingDish(null);
    reset({ name: '', description: '', category: 'plat', price: 0, isAvailable: true, imageUrl: '' });
    setIsModalOpen(true);
  };

  const openEdit = (dish: DishRow) => {
    setEditingDish(dish);
    reset({
      name: dish.name,
      description: dish.description ?? '',
      category: dish.category ?? 'plat',
      price: dish.price ?? 0,
      isAvailable: dish.isAvailable,
      imageUrl: dish.imageUrl ?? '',
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: DishForm) => {
    if (editingDish) {
      updateDish.mutate({ id: editingDish.id, ...data }, { onSuccess: () => setIsModalOpen(false) });
    } else {
      createDish.mutate(data, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer ce plat ?')) {
      deleteDish.mutate(id);
    }
  };

  return (
    <DashboardPageLayout
      title="Plats"
      description="Gestion des plats"
      actions={
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Nouveau plat
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
                <th className="px-4 py-3 text-left font-medium">Catégorie</th>
                <th className="px-4 py-3 text-left font-medium">Prix</th>
                <th className="px-4 py-3 text-left font-medium">Disponible</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {dishes?.map((dish) => (
                <tr key={dish.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{dish.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {dish.category ? CATEGORY_LABELS[dish.category] : '-'}
                  </td>
                  <td className="px-4 py-3">{dish.price != null ? `${dish.price.toFixed(2)} €` : '-'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        dish.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {dish.isAvailable ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(dish)}
                      className="mr-2 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(dish.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {dishes?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun plat
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
            <h2 className="mb-4 text-lg font-bold">{editingDish ? 'Modifier le plat' : 'Nouveau plat'}</h2>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Catégorie</label>
                  <select
                    {...register('category')}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                  >
                    <option value="entree">Entrée</option>
                    <option value="plat">Plat</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Prix (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price')}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                  />
                  {errors.price && <p className="mt-1 text-xs text-destructive">{errors.price.message}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">URL de l’image</label>
                <input
                  {...register('imageUrl')}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="dish_available" {...register('isAvailable')} className="h-4 w-4" />
                <label htmlFor="dish_available" className="text-sm font-medium">
                  Disponible
                </label>
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
                  disabled={createDish.isPending || updateDish.isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {createDish.isPending || updateDish.isPending ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
};

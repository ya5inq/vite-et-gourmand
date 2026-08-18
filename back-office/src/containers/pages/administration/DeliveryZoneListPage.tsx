import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import {
  useDeliveryZones,
  useCreateDeliveryZone,
  useUpdateDeliveryZone,
  useDeleteDeliveryZone,
  type DeliveryZoneRow,
} from '@/api/hooks/useDeliveryZones';

const zoneSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  distanceKm: z.coerce.number().min(0),
  isActive: z.boolean(),
});

type ZoneForm = z.infer<typeof zoneSchema>;

export const DeliveryZoneListPage = () => {
  const { data: zones, isLoading } = useDeliveryZones();
  const createZone = useCreateDeliveryZone();
  const updateZone = useUpdateDeliveryZone();
  const deleteZone = useDeleteDeliveryZone();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<DeliveryZoneRow | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ZoneForm>({
    resolver: zodResolver(zoneSchema),
    defaultValues: { isActive: true, distanceKm: 0 },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', postalCode: '', city: '', distanceKm: 0, isActive: true });
    setIsModalOpen(true);
  };

  const openEdit = (zone: DeliveryZoneRow) => {
    setEditing(zone);
    reset({
      name: zone.name,
      postalCode: zone.postalCode ?? '',
      city: zone.city ?? '',
      distanceKm: zone.distanceKm,
      isActive: zone.isActive,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: ZoneForm) => {
    const payload = {
      name: data.name,
      postalCode: data.postalCode || null,
      city: data.city || null,
      distanceKm: data.distanceKm,
      isActive: data.isActive,
    };

    if (editing) {
      updateZone.mutate({ id: editing.id, ...payload }, { onSuccess: () => setIsModalOpen(false) });
    } else {
      createZone.mutate(payload, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  return (
    <DashboardPageLayout
      title="Zones de livraison"
      description="Gestion des zones de livraison (le prix est calculé par le serveur à partir de la distance)"
      actions={
        <button onClick={openCreate} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Nouvelle zone
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
                <th className="px-4 py-3 text-left font-medium">Ville</th>
                <th className="px-4 py-3 text-left font-medium">Code postal</th>
                <th className="px-4 py-3 text-left font-medium">Distance (km)</th>
                <th className="px-4 py-3 text-left font-medium">Active</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {zones?.map((zone) => (
                <tr key={zone.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{zone.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{zone.city ?? '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{zone.postalCode ?? '-'}</td>
                  <td className="px-4 py-3">{zone.distanceKm} km</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${zone.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {zone.isActive ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(zone)} className="mr-2 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => { if (window.confirm('Supprimer cette zone ?')) deleteZone.mutate(zone.id); }} className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {zones?.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Aucune zone</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">{editing ? 'Modifier la zone' : 'Nouvelle zone'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nom</label>
                <input {...register('name')} className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Ville</label>
                  <input {...register('city')} className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2" placeholder="Bordeaux" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Code postal</label>
                  <input {...register('postalCode')} className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2" placeholder="33000" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Distance (km)</label>
                <input type="number" step="0.1" {...register('distanceKm')} className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
                {errors.distanceKm && <p className="mt-1 text-xs text-destructive">{errors.distanceKm.message}</p>}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="zone_active" {...register('isActive')} className="h-4 w-4" />
                <label htmlFor="zone_active" className="text-sm font-medium">Active</label>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Annuler</button>
                <button type="submit" disabled={createZone.isPending || updateZone.isPending} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
};

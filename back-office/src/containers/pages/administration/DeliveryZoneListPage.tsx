import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { supabase } from '@/configs/supabase';
import { CacheKeys } from '@/configs/cacheKeys';

type DeliveryZone = {
  id: string;
  name: string;
  postal_code: string | null;
  city: string | null;
  delivery_fee: number;
  is_active: boolean;
  created_at: string;
};

const useDeliveryZones = () => {
  return useQuery({
    queryKey: CacheKeys.DELIVERY_ZONES(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as DeliveryZone[];
    },
  });
};

const useCreateDeliveryZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<DeliveryZone, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('delivery_zones').insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.DELIVERY_ZONES() });
      toast.success('Zone creee');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

const useUpdateDeliveryZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<DeliveryZone> & { id: string }) => {
      const { data, error } = await supabase.from('delivery_zones').update(input).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.DELIVERY_ZONES() });
      toast.success('Zone mise a jour');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

const useDeleteDeliveryZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('delivery_zones').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.DELIVERY_ZONES() });
      toast.success('Zone supprimee');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

const zoneSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  delivery_fee: z.coerce.number().min(0),
  is_active: z.boolean(),
});

type ZoneForm = z.infer<typeof zoneSchema>;

export const DeliveryZoneListPage = () => {
  const { data: zones, isLoading } = useDeliveryZones();
  const createZone = useCreateDeliveryZone();
  const updateZone = useUpdateDeliveryZone();
  const deleteZone = useDeleteDeliveryZone();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<DeliveryZone | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ZoneForm>({
    resolver: zodResolver(zoneSchema),
    defaultValues: { is_active: true, delivery_fee: 0, min_order_amount: 0 },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', postal_code: '', city: '', delivery_fee: 0, is_active: true });
    setIsModalOpen(true);
  };

  const openEdit = (zone: DeliveryZone) => {
    setEditing(zone);
    reset({
      name: zone.name,
      postal_code: zone.postal_code ?? '',
      city: zone.city ?? '',
      delivery_fee: zone.delivery_fee,
      is_active: zone.is_active,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: ZoneForm) => {
    const payload = {
      name: data.name,
      postal_code: data.postal_code || null,
      city: data.city || null,
      delivery_fee: data.delivery_fee,
      is_active: data.is_active,
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
      description="Gestion des zones de livraison"
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
                <th className="px-4 py-3 text-left font-medium">Frais livraison</th>
                <th className="px-4 py-3 text-left font-medium">Active</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {zones?.map((zone) => (
                <tr key={zone.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{zone.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{zone.city ?? '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{zone.postal_code ?? '-'}</td>
                  <td className="px-4 py-3">{zone.delivery_fee.toFixed(2)} EUR</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${zone.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {zone.is_active ? 'Oui' : 'Non'}
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
                  <input {...register('postal_code')} className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2" placeholder="33000" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Frais livraison (EUR)</label>
                <input type="number" step="0.01" {...register('delivery_fee')} className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="zone_active" {...register('is_active')} className="h-4 w-4" />
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

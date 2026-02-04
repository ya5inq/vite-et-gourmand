import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { supabase } from '@/configs/supabase';
import { CacheKeys } from '@/configs/cacheKeys';

type OperatingHour = {
  id: string;
  day_of_week: number;
  day_name: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
};

const DAY_NAMES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const useOperatingHours = () => {
  return useQuery({
    queryKey: CacheKeys.OPERATING_HOURS(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operating_hours')
        .select('*')
        .order('day_of_week');

      if (error) throw error;
      return data as OperatingHour[];
    },
  });
};

const useSaveOperatingHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hours: { id?: string; day_of_week: number; day_name: string; open_time: string | null; close_time: string | null; is_closed: boolean }[]) => {
      for (const hour of hours) {
        if (hour.id) {
          const { error } = await supabase
            .from('operating_hours')
            .update({
              open_time: hour.is_closed ? null : hour.open_time,
              close_time: hour.is_closed ? null : hour.close_time,
              is_closed: hour.is_closed,
            })
            .eq('id', hour.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('operating_hours')
            .insert({
              day_of_week: hour.day_of_week,
              day_name: hour.day_name,
              open_time: hour.is_closed ? null : hour.open_time,
              close_time: hour.is_closed ? null : hour.close_time,
              is_closed: hour.is_closed,
            });

          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.OPERATING_HOURS() });
      toast.success('Horaires mis a jour');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

const hourSchema = z.object({
  hours: z.array(z.object({
    id: z.string().optional(),
    day_of_week: z.number(),
    day_name: z.string(),
    open_time: z.string().nullable(),
    close_time: z.string().nullable(),
    is_closed: z.boolean(),
  })),
});

type HoursForm = z.infer<typeof hourSchema>;

export const OperatingHoursPage = () => {
  const { data: operatingHours, isLoading } = useOperatingHours();
  const saveHours = useSaveOperatingHours();

  const { register, handleSubmit, control, reset, watch } = useForm<HoursForm>({
    resolver: zodResolver(hourSchema),
    defaultValues: {
      hours: DAY_NAMES.map((name, i) => ({
        day_of_week: i + 1,
        day_name: name,
        open_time: '11:00',
        close_time: '22:00',
        is_closed: false,
      })),
    },
  });

  const { fields } = useFieldArray({ control, name: 'hours' });

  useEffect(() => {
    if (operatingHours && operatingHours.length > 0) {
      const formData = DAY_NAMES.map((name, i) => {
        const existing = operatingHours.find((h) => h.day_of_week === i + 1);
        return {
          id: existing?.id,
          day_of_week: i + 1,
          day_name: name,
          open_time: existing?.open_time ?? '11:00',
          close_time: existing?.close_time ?? '22:00',
          is_closed: existing?.is_closed ?? false,
        };
      });
      reset({ hours: formData });
    }
  }, [operatingHours, reset]);

  const onSubmit = (data: HoursForm) => {
    saveHours.mutate(data.hours);
  };

  const watchedHours = watch('hours');

  return (
    <DashboardPageLayout title="Horaires d'ouverture" description="Configuration des horaires du restaurant">
      {isLoading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Jour</th>
                  <th className="px-4 py-3 text-left font-medium">Ouverture</th>
                  <th className="px-4 py-3 text-left font-medium">Fermeture</th>
                  <th className="px-4 py-3 text-center font-medium">Ferme</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {fields.map((field, index) => {
                  const isClosed = watchedHours[index]?.is_closed ?? false;
                  return (
                    <tr key={field.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{field.day_name}</td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          {...register(`hours.${index}.open_time`)}
                          disabled={isClosed}
                          className="rounded-md border border-input px-2 py-1 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          {...register(`hours.${index}.close_time`)}
                          disabled={isClosed}
                          className="rounded-md border border-input px-2 py-1 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          {...register(`hours.${index}.is_closed`)}
                          className="h-4 w-4"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            disabled={saveHours.isPending}
            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saveHours.isPending ? 'Enregistrement...' : 'Enregistrer les horaires'}
          </button>
        </form>
      )}
    </DashboardPageLayout>
  );
};

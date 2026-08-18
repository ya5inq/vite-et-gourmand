import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { useOperatingHours, useSaveOperatingHours } from '@/api/hooks/useOperatingHours';

// dayOfWeek follows the backend convention (0-6). We display Monday-first with
// dayOfWeek 0 == Lundi ... 6 == Dimanche.
const DAY_NAMES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const hourSchema = z.object({
  hours: z.array(z.object({
    dayOfWeek: z.number(),
    dayName: z.string(),
    openTime: z.string(),
    closeTime: z.string(),
    isClosed: z.boolean(),
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
        dayOfWeek: i,
        dayName: name,
        openTime: '11:00',
        closeTime: '22:00',
        isClosed: false,
      })),
    },
  });

  const { fields } = useFieldArray({ control, name: 'hours' });

  useEffect(() => {
    if (operatingHours && operatingHours.length > 0) {
      const formData = DAY_NAMES.map((name, i) => {
        const existing = operatingHours.find((h) => h.dayOfWeek === i);
        return {
          dayOfWeek: i,
          dayName: name,
          openTime: existing?.openTime ?? '11:00',
          closeTime: existing?.closeTime ?? '22:00',
          isClosed: existing?.isClosed ?? false,
        };
      });
      reset({ hours: formData });
    }
  }, [operatingHours, reset]);

  const onSubmit = (data: HoursForm) => {
    saveHours.mutate(
      data.hours.map((h) => ({
        dayOfWeek: h.dayOfWeek,
        openTime: h.isClosed ? null : h.openTime,
        closeTime: h.isClosed ? null : h.closeTime,
        isClosed: h.isClosed,
      })),
    );
  };

  const watchedHours = watch('hours');

  return (
    <DashboardPageLayout title="Horaires d’ouverture" description="Configuration des horaires du restaurant">
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
                  <th className="px-4 py-3 text-center font-medium">Fermé</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {fields.map((field, index) => {
                  const isClosed = watchedHours[index]?.isClosed ?? false;
                  return (
                    <tr key={field.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{field.dayName}</td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          {...register(`hours.${index}.openTime`)}
                          disabled={isClosed}
                          className="rounded-md border border-input px-2 py-1 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          {...register(`hours.${index}.closeTime`)}
                          disabled={isClosed}
                          className="rounded-md border border-input px-2 py-1 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          {...register(`hours.${index}.isClosed`)}
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

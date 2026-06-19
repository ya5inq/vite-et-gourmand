import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  AdminOperatingHoursGetAll200ItemsItem,
  AdminOperatingHoursUpsertBodyDaysItem,
} from '@vite-et-gourmand/sdk';
import { AdminApi } from '@/configs/api';
import { CacheKeys } from '@/configs/cacheKeys';

export type OperatingHourRow = AdminOperatingHoursGetAll200ItemsItem;

export const useOperatingHours = () => {
  return useQuery({
    queryKey: CacheKeys.OPERATING_HOURS(),
    queryFn: async () => {
      const { data } = await AdminApi.adminOperatingHoursGetAll();
      return data.items;
    },
  });
};

export const useSaveOperatingHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (days: AdminOperatingHoursUpsertBodyDaysItem[]) => {
      const { data } = await AdminApi.adminOperatingHoursUpsert({ days });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.OPERATING_HOURS() });
      toast.success('Horaires mis a jour');
    },
  });
};

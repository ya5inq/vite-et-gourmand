import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AdminContactMessageGetAll200ItemsItem } from '@vite-et-gourmand/sdk';
import { AdminApi } from '@/configs/api';
import { CacheKeys } from '@/configs/cacheKeys';

export type ContactMessageRow = AdminContactMessageGetAll200ItemsItem;

export const useContactMessages = () => {
  return useQuery({
    queryKey: CacheKeys.CONTACT_MESSAGES(),
    queryFn: async () => {
      const { data } = await AdminApi.adminContactMessageGetAll({ limit: 100 });
      return data.items;
    },
  });
};

export const useMarkContactMessageRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AdminApi.adminContactMessageMarkRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.CONTACT_MESSAGES() });
    },
  });
};

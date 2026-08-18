import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  AdminDeliveryZoneCreateBody,
  AdminDeliveryZoneGetAll200ItemsItem,
} from '@vite-et-gourmand/sdk';
import { AdminApi } from '@/configs/api';
import { CacheKeys } from '@/configs/cacheKeys';

export type DeliveryZoneRow = AdminDeliveryZoneGetAll200ItemsItem;

export type DeliveryZoneInput = {
  name: string;
  postalCode?: string | null;
  city?: string | null;
  distanceKm: number;
  isActive: boolean;
};

const toBody = (input: DeliveryZoneInput): AdminDeliveryZoneCreateBody => ({
  name: input.name,
  postalCode: input.postalCode?.trim() ? input.postalCode : null,
  city: input.city?.trim() ? input.city : null,
  distanceKm: input.distanceKm,
  isActive: input.isActive,
});

export const useDeliveryZones = () => {
  return useQuery({
    queryKey: CacheKeys.DELIVERY_ZONES(),
    queryFn: async () => {
      const { data } = await AdminApi.adminDeliveryZoneGetAll({ limit: 100 });
      return data.items;
    },
  });
};

export const useCreateDeliveryZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: DeliveryZoneInput) => {
      const { data } = await AdminApi.adminDeliveryZoneCreate(toBody(input));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.DELIVERY_ZONES() });
      toast.success('Zone créée');
    },
  });
};

export const useUpdateDeliveryZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: DeliveryZoneInput & { id: string }) => {
      const { data } = await AdminApi.adminDeliveryZoneUpdate(id, toBody(input));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.DELIVERY_ZONES() });
      toast.success('Zone mise à jour');
    },
  });
};

export const useDeleteDeliveryZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await AdminApi.adminDeliveryZoneDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.DELIVERY_ZONES() });
      toast.success('Zone supprimée');
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  AdminMenuCreateBody,
  AdminMenuGetAll200ItemsItem,
  AdminMenuGetOne200,
  AdminMenuUpdateBody,
} from '@vite-et-gourmand/sdk';
import { AdminApi } from '@/configs/api';
import { CacheKeys } from '@/configs/cacheKeys';

export type MenuRow = AdminMenuGetAll200ItemsItem;
export type MenuDetail = AdminMenuGetOne200;

export type MenuInput = {
  name: string;
  description?: string;
  theme?: string;
  price: number;
  stock: number;
  isAvailable: boolean;
};

const toBody = (input: MenuInput): AdminMenuCreateBody & AdminMenuUpdateBody => ({
  name: input.name,
  description: input.description?.trim() ? input.description : null,
  theme: input.theme?.trim() ? input.theme : null,
  price: input.price,
  stock: input.stock,
  isAvailable: input.isAvailable,
});

export const useMenus = () => {
  return useQuery({
    queryKey: CacheKeys.MENUS(),
    queryFn: async () => {
      const { data } = await AdminApi.adminMenuGetAll({ limit: 100 });
      return data.items;
    },
  });
};

export const useMenu = (id: string) => {
  return useQuery({
    queryKey: CacheKeys.MENU(id),
    queryFn: async () => {
      const { data } = await AdminApi.adminMenuGetOne(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: MenuInput) => {
      const { data } = await AdminApi.adminMenuCreate(toBody(input));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.MENUS() });
      toast.success('Menu créé avec succès');
    },
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: MenuInput & { id: string }) => {
      const { data } = await AdminApi.adminMenuUpdate(id, toBody(input));
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.MENUS() });
      queryClient.invalidateQueries({ queryKey: CacheKeys.MENU(data.id) });
      toast.success('Menu mis à jour');
    },
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AdminApi.adminMenuDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.MENUS() });
      toast.success('Menu supprimé');
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  AdminAllergenCreateBody,
  AdminAllergenGetAll200ItemsItem,
  AdminDishCreateBody,
  AdminDishGetAll200ItemsItem,
  AdminDishUpdateBody,
} from '@vite-et-gourmand/sdk';
import { AdminApi } from '@/configs/api';
import { CacheKeys } from '@/configs/cacheKeys';

export type DishRow = AdminDishGetAll200ItemsItem;
export type AllergenRow = AdminAllergenGetAll200ItemsItem;

export type DishInput = {
  name: string;
  description?: string;
  category: AdminDishCreateBody['category'];
  price: number;
  isAvailable: boolean;
  imageUrl?: string;
};

const toDishBody = (input: DishInput): AdminDishCreateBody & AdminDishUpdateBody => ({
  name: input.name,
  description: input.description?.trim() ? input.description : null,
  category: input.category,
  price: input.price,
  isAvailable: input.isAvailable,
  imageUrl: input.imageUrl?.trim() ? input.imageUrl : null,
});

export const useDishes = () => {
  return useQuery({
    queryKey: CacheKeys.DISHES(),
    queryFn: async () => {
      const { data } = await AdminApi.adminDishGetAll({ limit: 100 });
      return data.items;
    },
  });
};

export const useDish = (id: string) => {
  return useQuery({
    queryKey: CacheKeys.DISH(id),
    queryFn: async () => {
      const { data } = await AdminApi.adminDishGetOne(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateDish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DishInput) => {
      const { data } = await AdminApi.adminDishCreate(toDishBody(input));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.DISHES() });
      toast.success('Plat créé avec succès');
    },
  });
};

export const useUpdateDish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: DishInput & { id: string }) => {
      const { data } = await AdminApi.adminDishUpdate(id, toDishBody(input));
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.DISHES() });
      queryClient.invalidateQueries({ queryKey: CacheKeys.DISH(data.id) });
      toast.success('Plat mis à jour');
    },
  });
};

export const useDeleteDish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AdminApi.adminDishDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.DISHES() });
      toast.success('Plat supprimé');
    },
  });
};

export const useAllergens = () => {
  return useQuery({
    queryKey: CacheKeys.ALLERGENS(),
    queryFn: async () => {
      const { data } = await AdminApi.adminAllergenGetAll({ limit: 100 });
      return data.items;
    },
  });
};

export const useCreateAllergen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AdminAllergenCreateBody) => {
      const { data } = await AdminApi.adminAllergenCreate(input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.ALLERGENS() });
      toast.success('Allergène créé');
    },
  });
};

export const useUpdateAllergen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: AdminAllergenCreateBody & { id: string }) => {
      const { data } = await AdminApi.adminAllergenUpdate(id, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.ALLERGENS() });
      toast.success('Allergène mis à jour');
    },
  });
};

export const useDeleteAllergen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AdminApi.adminAllergenDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.ALLERGENS() });
      toast.success('Allergène supprimé');
    },
  });
};

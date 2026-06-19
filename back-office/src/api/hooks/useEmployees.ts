import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  AdminEmployeeCreateBody,
  AdminEmployeeGetAll200ItemsItem,
} from '@vite-et-gourmand/sdk';
import { AdminApi } from '@/configs/api';
import { CacheKeys } from '@/configs/cacheKeys';

export type EmployeeRow = AdminEmployeeGetAll200ItemsItem;

export const useEmployees = () => {
  return useQuery({
    queryKey: CacheKeys.USERS(),
    queryFn: async () => {
      const { data } = await AdminApi.adminEmployeeGetAll({ limit: 100 });
      return data.items;
    },
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AdminEmployeeCreateBody) => {
      const { data } = await AdminApi.adminEmployeeCreate(input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.USERS() });
      toast.success('Employe cree. Un email de configuration du mot de passe a ete envoye.');
    },
  });
};

export const useDeactivateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AdminApi.adminEmployeeDeactivate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.USERS() });
      toast.success('Employe desactive');
    },
  });
};

export const useReactivateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AdminApi.adminEmployeeReactivate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.USERS() });
      toast.success('Employe reactive');
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  AdminOrderGetAll200ItemsItem,
  AdminOrderGetOne200,
  AdminOrderUpdateStatusBodyContactMode,
} from '@vite-et-gourmand/sdk';
import { AdminApi } from '@/configs/api';
import { CacheKeys } from '@/configs/cacheKeys';

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'DELIVERING'
  | 'DELIVERED'
  | 'AWAITING_MATERIAL_RETURN'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export type ContactMode = AdminOrderUpdateStatusBodyContactMode;

export type OrderRow = AdminOrderGetAll200ItemsItem;
export type OrderDetail = AdminOrderGetOne200;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  ACCEPTED: 'Acceptée',
  PREPARING: 'En préparation',
  DELIVERING: 'En livraison',
  DELIVERED: 'Livrée',
  AWAITING_MATERIAL_RETURN: 'Retour matériel',
  COMPLETED: 'Terminée',
  REJECTED: 'Refusée',
  CANCELLED: 'Annulée',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-orange-100 text-orange-800',
  DELIVERING: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  AWAITING_MATERIAL_RETURN: 'bg-amber-100 text-amber-800',
  COMPLETED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

/**
 * Mirror of the backend state machine (ORDER_STATUS_TRANSITIONS).
 * Used to populate the "change status" UI with only reachable states.
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['DELIVERING', 'CANCELLED'],
  DELIVERING: ['DELIVERED'],
  DELIVERED: ['AWAITING_MATERIAL_RETURN', 'COMPLETED'],
  AWAITING_MATERIAL_RETURN: ['COMPLETED'],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: [],
};

export const useOrders = () => {
  return useQuery({
    queryKey: CacheKeys.ORDERS(),
    queryFn: async () => {
      const { data } = await AdminApi.adminOrderGetAll({ limit: 100 });
      return data.items;
    },
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: CacheKeys.ORDER(id),
    queryFn: async () => {
      const { data } = await AdminApi.adminOrderGetOne(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data } = await AdminApi.adminOrderUpdateStatus(id, { newStatus: status });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.ORDERS() });
      queryClient.invalidateQueries({ queryKey: CacheKeys.ORDER(data.id) });
      toast.success('Statut de la commande mis à jour');
    },
  });
};

export const useAcceptOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data } = await AdminApi.adminOrderUpdateStatus(id, { newStatus: 'ACCEPTED' });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.ORDERS() });
      queryClient.invalidateQueries({ queryKey: CacheKeys.ORDER(data.id) });
      toast.success('Commande acceptée');
    },
  });
};

export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      reason,
      contactMode,
    }: {
      id: string;
      reason: string;
      contactMode: ContactMode;
    }) => {
      const { data } = await AdminApi.adminOrderUpdateStatus(id, {
        newStatus: 'REJECTED',
        reason,
        contactMode,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.ORDERS() });
      queryClient.invalidateQueries({ queryKey: CacheKeys.ORDER(data.id) });
      toast.success('Commande refusée');
    },
  });
};

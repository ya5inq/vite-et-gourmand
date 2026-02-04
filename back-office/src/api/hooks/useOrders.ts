import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/configs/supabase';
import { CacheKeys } from '@/configs/cacheKeys';

export type OrderStatus = 'pending' | 'rejected' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';

export type OrderItemRow = {
  id: string;
  menu_id: string;
  quantity: number;
  unit_price: number;
  menus: { name: string } | null;
};

export type OrderRow = {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  total_price: number;
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_postal_code: string | null;
  delivery_date: string | null;
  delivery_fee: number;
  notes: string | null;
  created_at: string;
  rejection_reason: string | null;
  rejected_at: string | null;
  rejected_by: string | null;
  guest_email: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  profiles?: { first_name: string | null; last_name: string | null; email?: string } | null;
  order_items?: OrderItemRow[];
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  rejected: 'Refusee',
  confirmed: 'Confirmee',
  preparing: 'En preparation',
  ready: 'Prete',
  delivering: 'En livraison',
  completed: 'Terminee',
  cancelled: 'Annulee',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  delivering: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

export const useOrders = () => {
  return useQuery({
    queryKey: CacheKeys.ORDERS(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles!orders_user_id_fkey(first_name, last_name), order_items(id, quantity, unit_price, menu_id, menus(name))')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as OrderRow[];
    },
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: CacheKeys.ORDER(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles!orders_user_id_fkey(first_name, last_name), order_items(id, quantity, unit_price, menu_id, menus(name))')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as OrderRow;
    },
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.ORDERS() });
      queryClient.invalidateQueries({ queryKey: CacheKeys.ORDER(data.id) });
      toast.success('Statut de la commande mis a jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useAcceptOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.ORDERS() });
      queryClient.invalidateQueries({ queryKey: CacheKeys.ORDER(data.id) });
      toast.success('Commande acceptee');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason, rejectedBy }: { id: string; reason: string; rejectedBy: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          rejected_at: new Date().toISOString(),
          rejected_by: rejectedBy,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.ORDERS() });
      queryClient.invalidateQueries({ queryKey: CacheKeys.ORDER(data.id) });
      toast.success('Commande refusee');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

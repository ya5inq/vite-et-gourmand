import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/configs/supabase';
import { CacheKeys } from '@/configs/cacheKeys';

export type MenuRow = {
  id: string;
  name: string;
  description: string | null;
  theme: string | null;
  price: number;
  stock: number;
  is_available: boolean;
  created_at: string;
  menu_dishes?: { dish_id: string; dishes: { id: string; name: string } }[];
  menu_dietary_regimes?: { dietary_regime_id: string; dietary_regimes: { id: string; name: string } }[];
};

export type MenuInput = {
  name: string;
  description?: string;
  theme?: string;
  price: number;
  stock: number;
  is_available: boolean;
};

export const useMenus = () => {
  return useQuery({
    queryKey: CacheKeys.MENUS(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menus')
        .select('*, menu_dishes(dish_id, dishes(id, name)), menu_dietary_regimes(dietary_regime_id, dietary_regimes(id, name))')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MenuRow[];
    },
  });
};

export const useMenu = (id: string) => {
  return useQuery({
    queryKey: CacheKeys.MENU(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menus')
        .select('*, menu_dishes(dish_id, dishes(id, name)), menu_dietary_regimes(dietary_regime_id, dietary_regimes(id, name))')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as MenuRow;
    },
    enabled: !!id,
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: MenuInput) => {
      const { data, error } = await supabase
        .from('menus')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.MENUS() });
      toast.success('Menu cree avec succes');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: MenuInput & { id: string }) => {
      const { data, error } = await supabase
        .from('menus')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.MENUS() });
      queryClient.invalidateQueries({ queryKey: CacheKeys.MENU(data.id) });
      toast.success('Menu mis a jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.MENUS() });
      toast.success('Menu supprime');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

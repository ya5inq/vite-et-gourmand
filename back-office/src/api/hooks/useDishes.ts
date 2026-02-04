import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/configs/supabase';
import { CacheKeys } from '@/configs/cacheKeys';

export type DishRow = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  is_available: boolean;
  image_url: string | null;
  created_at: string;
  dish_allergens?: { allergen_id: string; allergens: { id: string; name: string } }[];
};

export type DishInput = {
  name: string;
  description?: string;
  category?: string;
  price: number;
  is_available: boolean;
  image_url?: string;
};

export const useDishes = () => {
  return useQuery({
    queryKey: CacheKeys.DISHES(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dishes')
        .select('*, dish_allergens(allergen_id, allergens(id, name))')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DishRow[];
    },
  });
};

export const useDish = (id: string) => {
  return useQuery({
    queryKey: CacheKeys.DISH(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dishes')
        .select('*, dish_allergens(allergen_id, allergens(id, name))')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as DishRow;
    },
    enabled: !!id,
  });
};

export const useCreateDish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DishInput) => {
      const { data, error } = await supabase
        .from('dishes')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.DISHES() });
      toast.success('Plat cree avec succes');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useUpdateDish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: DishInput & { id: string }) => {
      const { data, error } = await supabase
        .from('dishes')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.DISHES() });
      queryClient.invalidateQueries({ queryKey: CacheKeys.DISH(data.id) });
      toast.success('Plat mis a jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useDeleteDish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.DISHES() });
      toast.success('Plat supprime');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useAllergens = () => {
  return useQuery({
    queryKey: CacheKeys.ALLERGENS(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('allergens')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as { id: string; name: string; description: string | null }[];
    },
  });
};

export const useCreateAllergen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('allergens')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.ALLERGENS() });
      toast.success('Allergene cree');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useUpdateAllergen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string; name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('allergens')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.ALLERGENS() });
      toast.success('Allergene mis a jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useDeleteAllergen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('allergens')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.ALLERGENS() });
      toast.success('Allergene supprime');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

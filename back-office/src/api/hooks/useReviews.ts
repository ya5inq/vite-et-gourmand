import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/configs/supabase';
import { CacheKeys } from '@/configs/cacheKeys';

export type ReviewRow = {
  id: string;
  user_id: string;
  menu_id: string | null;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  profiles?: { first_name: string | null; last_name: string | null } | null;
  menus?: { name: string } | null;
};

export const useReviews = () => {
  return useQuery({
    queryKey: CacheKeys.REVIEWS(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(first_name, last_name), menus(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ReviewRow[];
    },
  });
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.REVIEWS() });
      toast.success('Avis approuve');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useRejectReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.REVIEWS() });
      toast.success('Avis supprime');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

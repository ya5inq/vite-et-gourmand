import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/configs/supabase';
import { CacheKeys } from '@/configs/cacheKeys';

export type PageContentRow = {
  id: string;
  page: string;
  section: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export const usePageContents = (page: string) => {
  return useQuery({
    queryKey: CacheKeys.PAGE_CONTENTS(page),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page', page)
        .order('section');

      if (error) throw error;
      return data as PageContentRow[];
    },
  });
};

export const usePageContent = (page: string, section: string) => {
  return useQuery({
    queryKey: CacheKeys.PAGE_CONTENT(page, section),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page', page)
        .eq('section', section)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as PageContentRow | null;
    },
  });
};

export const useUpsertPageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ page, section, content }: { page: string; section: string; content: Record<string, unknown> }) => {
      const { data: existing } = await supabase
        .from('page_contents')
        .select('id')
        .eq('page', page)
        .eq('section', section)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('page_contents')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('page_contents')
          .insert({ page, section, content })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.PAGE_CONTENTS(variables.page) });
      queryClient.invalidateQueries({ queryKey: CacheKeys.PAGE_CONTENT(variables.page, variables.section) });
      toast.success('Contenu mis a jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

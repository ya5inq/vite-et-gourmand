import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AdminPageContentGetAll200ItemsItem } from '@vite-et-gourmand/sdk';
import { AdminApi } from '@/configs/api';
import { CacheKeys } from '@/configs/cacheKeys';

export type PageContentRow = AdminPageContentGetAll200ItemsItem;

export const usePageContents = (page: string) => {
  return useQuery({
    queryKey: CacheKeys.PAGE_CONTENTS(page),
    queryFn: async () => {
      const { data } = await AdminApi.adminPageContentGetAll({ page });
      return data.items;
    },
  });
};

export const useUpsertPageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      page,
      section,
      content,
    }: {
      page: string;
      section: string;
      content: Record<string, unknown>;
    }) => {
      const { data } = await AdminApi.adminPageContentUpsert({ page, section, content });
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.PAGE_CONTENTS(variables.page) });
      toast.success('Contenu mis a jour');
    },
  });
};

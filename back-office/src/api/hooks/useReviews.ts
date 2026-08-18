import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AdminReviewGetAll200ItemsItem } from '@vite-et-gourmand/sdk';
import { AdminApi } from '@/configs/api';
import { CacheKeys } from '@/configs/cacheKeys';

export type ReviewRow = AdminReviewGetAll200ItemsItem;

export const useReviews = () => {
  return useQuery({
    queryKey: CacheKeys.REVIEWS(),
    queryFn: async () => {
      const { data } = await AdminApi.adminReviewGetAll({ limit: 100 });
      return data.items;
    },
  });
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await AdminApi.adminReviewApprove(id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.REVIEWS() });
      toast.success('Avis approuvé');
    },
  });
};

export const useRejectReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AdminApi.adminReviewDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.REVIEWS() });
      toast.success('Avis supprimé');
    },
  });
};

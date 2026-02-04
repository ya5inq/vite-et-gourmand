import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Euro, MessageSquare, Clock } from 'lucide-react';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { supabase } from '@/configs/supabase';
import { CacheKeys } from '@/configs/cacheKeys';

type DashboardStats = {
  totalOrders: number;
  monthlyRevenue: number;
  pendingReviews: number;
  activeOrders: number;
};

const useDashboardStats = () => {
  return useQuery({
    queryKey: CacheKeys.DASHBOARD_STATS(),
    queryFn: async (): Promise<DashboardStats> => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [ordersRes, revenueRes, reviewsRes, activeRes] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase
          .from('orders')
          .select('total_price')
          .gte('created_at', startOfMonth)
          .neq('status', 'cancelled'),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', false),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .in('status', ['pending', 'confirmed', 'preparing', 'ready', 'delivering']),
      ]);

      const monthlyRevenue = (revenueRes.data ?? []).reduce(
        (sum, order) => sum + (order.total_price ?? 0),
        0
      );

      return {
        totalOrders: ordersRes.count ?? 0,
        monthlyRevenue,
        pendingReviews: reviewsRes.count ?? 0,
        activeOrders: activeRes.count ?? 0,
      };
    },
  });
};

const statCards = [
  {
    key: 'totalOrders' as const,
    label: 'Total Commandes',
    icon: ShoppingCart,
    format: (v: number) => v.toString(),
    color: 'text-blue-600 bg-blue-50',
  },
  {
    key: 'monthlyRevenue' as const,
    label: 'CA du mois',
    icon: Euro,
    format: (v: number) => `${v.toFixed(2)} EUR`,
    color: 'text-green-600 bg-green-50',
  },
  {
    key: 'pendingReviews' as const,
    label: 'Avis en attente',
    icon: MessageSquare,
    format: (v: number) => v.toString(),
    color: 'text-orange-600 bg-orange-50',
  },
  {
    key: 'activeOrders' as const,
    label: 'Commandes en cours',
    icon: Clock,
    format: (v: number) => v.toString(),
    color: 'text-purple-600 bg-purple-50',
  },
];

export const DashboardPage = () => {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <DashboardPageLayout title="Dashboard" description="Vue d'ensemble de votre activite">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <div className={`rounded-md p-2 ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {isLoading ? '...' : stats ? card.format(stats[card.key]) : '-'}
            </p>
          </div>
        ))}
      </div>
    </DashboardPageLayout>
  );
};

import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Euro, MessageSquare, Clock } from 'lucide-react';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { AdminApi } from '@/configs/api';
import { CacheKeys } from '@/configs/cacheKeys';

type DashboardStats = {
  totalOrders: number;
  monthlyRevenue: number;
  pendingReviews: number;
  activeOrders: number;
};

const ACTIVE_STATUSES = new Set([
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'DELIVERING',
  'DELIVERED',
  'AWAITING_MATERIAL_RETURN',
]);

/**
 * There is no dedicated /admin/dashboard-stats endpoint, so the four KPIs are
 * computed in-memory from the admin order + review lists:
 *  - totalOrders: total count of orders.
 *  - monthlyRevenue: sum of totalPrice for non-cancelled/non-rejected orders
 *    created in the current month.
 *  - pendingReviews: reviews with isApproved === false.
 *  - activeOrders: orders in a non-terminal status.
 */
const useDashboardStats = () => {
  return useQuery({
    queryKey: CacheKeys.DASHBOARD_STATS(),
    queryFn: async (): Promise<DashboardStats> => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [ordersRes, reviewsRes] = await Promise.all([
        AdminApi.adminOrderGetAll({ limit: 100 }),
        AdminApi.adminReviewGetAll({ limit: 100, isApproved: 'false' }),
      ]);

      const orders = ordersRes.data.items;

      const monthlyRevenue = orders
        .filter(
          (o) =>
            o.status !== 'CANCELLED' &&
            o.status !== 'REJECTED' &&
            new Date(o.createdAt) >= startOfMonth,
        )
        .reduce((sum, o) => sum + (o.totalPrice ?? 0), 0);

      const activeOrders = orders.filter((o) => ACTIVE_STATUSES.has(o.status)).length;

      return {
        totalOrders: ordersRes.data.totalCount,
        monthlyRevenue,
        pendingReviews: reviewsRes.data.totalCount,
        activeOrders,
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

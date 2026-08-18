'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedApi } from '@/lib/api/axios';
import { useAuth } from '@/contexts/AuthContext';
import { OrderStatusBadge } from '@/components/molecules/OrderStatusBadge';
import { RejectionNotice } from '@/components/molecules/RejectionNotice';
import { OrderStatus } from '@/lib/orderStatus';
import type { ProtectedOrderGetAll200ItemsItem } from '@vite-et-gourmand/sdk';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<ProtectedOrderGetAll200ItemsItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated (once the auth bootstrap resolved).
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isMounted = true;

    async function fetchOrders() {
      try {
        setError(null);
        const { data } = await ProtectedApi.protectedOrderGetAll({
          sortBy: 'createdAt',
          sortOrder: 'DESC',
          limit: 100,
        });
        if (isMounted) setOrders(data.items);
      } catch {
        if (isMounted) setError('Erreur lors du chargement des commandes');
      } finally {
        if (isMounted) setOrdersLoading(false);
      }
    }

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mon tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Bienvenue, {user?.email}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/avis"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80 transition-opacity font-medium text-center"
          >
            Mes avis
          </Link>
          <Link
            href="/menus"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-center"
          >
            Nouvelle commande
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Historique des commandes</h2>
        </div>

        {ordersLoading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:underline"
            >
              Réessayer
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Vous n’avez pas encore de commande.</p>
            <Link
              href="/menus"
              className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Passer ma première commande
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-secondary/50 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      Commande #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.itemCount} menu{order.itemCount > 1 ? 's' : ''} &middot;{' '}
                      Commande du {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                    {order.deliveryDate && (
                      <p className="text-sm text-muted-foreground">
                        Livraison le {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                      </p>
                    )}

                    {order.status === OrderStatus.REJECTED && (
                      <RejectionNotice reason={null} />
                    )}
                  </div>
                  <div className="text-right">
                    <OrderStatusBadge status={order.status} />
                    <p className="font-bold text-foreground mt-2">
                      {order.totalPrice.toFixed(2)}&nbsp;€
                    </p>
                    {order.deliveryFee > 0 && (
                      <p className="text-xs text-muted-foreground">
                        dont {order.deliveryFee.toFixed(2)}&nbsp;€ de livraison
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

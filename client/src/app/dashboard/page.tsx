'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { OrderStatusBadge } from '@/components/molecules/OrderStatusBadge';
import { RejectionNotice } from '@/components/molecules/RejectionNotice';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  menus: { name: string } | null;
}

interface Order {
  id: string;
  quantity: number;
  total_price: number;
  status: string;
  delivery_date: string | null;
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_fee: number;
  created_at: string;
  rejection_reason: string | null;
  rejected_at: string | null;
  menus: {
    name: string;
    price: number;
  } | null;
  order_items: OrderItem[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch orders when user is available
  useEffect(() => {
    if (!user?.id) {
      setOrdersLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchOrders() {
      try {
        setError(null);
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*, menus(name, price), order_items(id, quantity, unit_price, menus(name))')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (!isMounted) return;

        if (fetchError) {
          console.error('Orders fetch error:', fetchError);
          setError('Erreur lors du chargement des commandes');
          return;
        }

        setOrders((data ?? []) as Order[]);
      } catch (err) {
        console.error('Dashboard error:', err);
        if (isMounted) {
          setError('Une erreur est survenue');
        }
      } finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [user?.id, supabase]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Don't render anything while redirecting
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
              Reessayer
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Vous n&apos;avez pas encore de commande.</p>
            <Link
              href="/menus"
              className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Passer ma premiere commande
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => {
              // Get menu names from order_items if available, otherwise fallback to legacy menus field
              const menuNames = order.order_items?.length > 0
                ? order.order_items.map(item => item.menus?.name ?? 'Menu').join(', ')
                : order.menus?.name ?? 'Menu';
              const totalQuantity = order.order_items?.length > 0
                ? order.order_items.reduce((sum, item) => sum + item.quantity, 0)
                : order.quantity;

              return (
                <div key={order.id} className="p-6 hover:bg-secondary/50 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {menuNames}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {totalQuantity} personne{totalQuantity > 1 ? 's' : ''} &middot;{' '}
                        Commande du {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      {order.delivery_date && (
                        <p className="text-sm text-muted-foreground">
                          Livraison le {new Date(order.delivery_date).toLocaleDateString('fr-FR')}
                          {order.delivery_city && ` a ${order.delivery_city}`}
                        </p>
                      )}

                      {/* Show rejection notice */}
                      {order.status === 'rejected' && (
                        <RejectionNotice
                          reason={order.rejection_reason}
                          rejectedAt={order.rejected_at}
                        />
                      )}
                    </div>
                    <div className="text-right">
                      <OrderStatusBadge status={order.status} />
                      <p className="font-bold text-foreground mt-2">{order.total_price.toFixed(2)} &euro;</p>
                      {order.delivery_fee > 0 && (
                        <p className="text-xs text-muted-foreground">
                          dont {order.delivery_fee.toFixed(2)} &euro; de livraison
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

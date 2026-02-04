'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { OrderStatusBadge } from '@/components/molecules/OrderStatusBadge';
import { RejectionNotice } from '@/components/molecules/RejectionNotice';
import type { User } from '@supabase/supabase-js';

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
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAuthenticated, setNotAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function fetchData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (authError || !user) {
          setNotAuthenticated(true);
          setLoading(false);
          return;
        }

        setUser(user);

        const { data, error } = await supabase
          .from('orders')
          .select('*, menus(name, price), order_items(id, quantity, unit_price, menus(name))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        console.log('Dashboard - User ID:', user.id);
        console.log('Dashboard - Orders data:', data);
        console.log('Dashboard - Orders error:', error);

        if (!isMounted) return;

        if (error) {
          console.error('Orders fetch error:', error);
        }

        setOrders((data ?? []) as Order[]);
      } catch (err) {
        console.error('Dashboard error:', err);
        if (isMounted) {
          setNotAuthenticated(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (notAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mon tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Bienvenue, {user.email}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/avis"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80 transition-opacity font-medium"
          >
            Mes avis
          </Link>
          <Link
            href="/menus"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Nouvelle commande
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Historique des commandes</h2>
        </div>

        {orders.length === 0 ? (
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

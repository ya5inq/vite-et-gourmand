'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  menus: { name: string } | null;
}

interface Order {
  id: string;
  total_price: number;
  delivery_date: string | null;
  delivery_address: string | null;
  delivery_city: string | null;
  guest_email: string | null;
  guest_name: string | null;
  created_at: string;
  order_items: OrderItem[];
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [user, setUser] = useState<User | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadData() {
      // Check auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (orderId) {
        if (authUser) {
          // Authenticated user: load order directly
          const { data } = await supabase
            .from('orders')
            .select('id, total_price, delivery_date, delivery_address, delivery_city, guest_email, guest_name, created_at, order_items(id, quantity, unit_price, menus(name))')
            .eq('id', orderId)
            .single();

          if (data) {
            setOrder(data as unknown as Order);
          }
        } else {
          // Guest user: use RPC functions to bypass RLS
          const { data: guestOrder } = await supabase.rpc('get_guest_order_by_id', {
            p_order_id: orderId,
          });

          if (guestOrder && guestOrder.length > 0) {
            const orderData = guestOrder[0];

            // Get order items separately
            const { data: items } = await supabase.rpc('get_guest_order_items', {
              p_order_id: orderId,
            });

            const orderItems: OrderItem[] = (items || []).map((item: { id: string; quantity: number; unit_price: number; menu_name: string }) => ({
              id: item.id,
              quantity: item.quantity,
              unit_price: item.unit_price,
              menus: { name: item.menu_name },
            }));

            setOrder({
              id: orderData.id,
              total_price: orderData.total_price,
              delivery_date: orderData.delivery_date,
              delivery_address: orderData.delivery_address,
              delivery_city: orderData.delivery_city,
              guest_email: orderData.guest_email,
              guest_name: orderData.guest_name,
              created_at: orderData.created_at,
              order_items: orderItems,
            });
          }
        }
      }

      setLoading(false);
    }

    loadData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const isGuest = !user;
  const customerName = order?.guest_name || 'Client';
  const customerEmail = order?.guest_email || user?.email;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="text-green-500" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Demande envoyee !</h1>
        <p className="text-muted-foreground">
          Merci{!isGuest ? '' : ` ${customerName}`} pour votre demande de commande.
        </p>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6">
        {order && (
          <>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground">Numero de commande</span>
              <span className="font-mono text-sm font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
            </div>

            <div className="space-y-3 mb-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-foreground">
                    {item.menus?.name ?? 'Menu'} x {item.quantity}
                  </span>
                  <span className="text-muted-foreground">
                    {(item.unit_price * item.quantity).toFixed(2)} &euro;
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">{order.total_price.toFixed(2)} &euro;</span>
            </div>

            {order.delivery_date && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Livraison prevue le{' '}
                  <span className="font-medium text-foreground">
                    {new Date(order.delivery_date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </p>
                {order.delivery_address && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.delivery_address}, {order.delivery_city}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Mail className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Et maintenant ?</p>
            <p className="mt-1">
              Nous allons examiner votre demande et vous contacter a{' '}
              <span className="font-medium">{customerEmail}</span> pour confirmer la disponibilite
              et finaliser votre commande.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {user ? (
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Voir mes commandes
            <ArrowRight size={18} />
          </Link>
        ) : (
          <Link
            href="/auth/register"
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Creer un compte
            <ArrowRight size={18} />
          </Link>
        )}
        <Link
          href="/menus"
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}

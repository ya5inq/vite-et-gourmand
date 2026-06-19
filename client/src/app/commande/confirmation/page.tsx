'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { ProtectedApi } from '@/lib/api/axios';
import { useAuth } from '@/contexts/AuthContext';
import {
  readConfirmationRecap,
  type ConfirmationRecap,
} from '@/lib/confirmationStore';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [order, setOrder] = useState<ConfirmationRecap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    let isMounted = true;

    async function load() {
      if (!orderId) {
        if (isMounted) setLoading(false);
        return;
      }

      // Primary source: the recap stored at checkout (works for guests too).
      const stored = readConfirmationRecap(orderId);
      if (stored) {
        if (isMounted) {
          setOrder(stored);
          setLoading(false);
        }
        return;
      }

      // Fallback for authenticated users (e.g. page refresh wiped sessionStorage):
      // re-fetch the order detail. Guests have no public endpoint, so they only
      // get the recap from sessionStorage.
      if (isAuthenticated) {
        try {
          const { data } = await ProtectedApi.protectedOrderGetOne(orderId);
          if (isMounted) {
            setOrder({
              id: data.id,
              totalPrice: data.totalPrice,
              deliveryFee: data.deliveryFee,
              deliveryDate: data.deliveryDate ?? null,
              deliveryAddress: data.deliveryAddress ?? null,
              deliveryCity: data.deliveryCity ?? null,
              guestName: data.guestName ?? null,
              guestEmail: data.guestEmail ?? null,
              items: data.items.map((i) => ({
                id: i.id,
                menuName: i.menuName ?? 'Menu',
                quantity: i.quantity,
                unitPrice: i.unitPrice,
              })),
            });
          }
        } catch {
          // interceptor surfaces errors
        }
      }

      if (isMounted) setLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [orderId, isAuthenticated, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const isGuest = !isAuthenticated;
  const customerName = order?.guestName || 'Client';
  const customerEmail = order?.guestEmail || user?.email;

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
              <span className="font-mono text-sm font-medium">
                {order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-foreground">
                    {item.menuName} x {item.quantity}
                  </span>
                  <span className="text-muted-foreground">
                    {(item.unitPrice * item.quantity).toFixed(2)} &euro;
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">{order.totalPrice.toFixed(2)} &euro;</span>
            </div>

            {order.deliveryDate && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Livraison prevue le{' '}
                  <span className="font-medium text-foreground">
                    {new Date(order.deliveryDate).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </p>
                {order.deliveryAddress && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.deliveryAddress}, {order.deliveryCity}
                  </p>
                )}
              </div>
            )}
          </>
        )}
        {!order && (
          <p className="text-sm text-muted-foreground text-center">
            Votre demande a bien ete enregistree. Vous recevrez un email de confirmation.
          </p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Mail className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Et maintenant ?</p>
            <p className="mt-1">
              Nous allons examiner votre demande et vous contacter
              {customerEmail ? (
                <>
                  {' '}a <span className="font-medium">{customerEmail}</span>
                </>
              ) : null}{' '}
              pour confirmer la disponibilite et finaliser votre commande.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {isAuthenticated ? (
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

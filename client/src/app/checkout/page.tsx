'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ShoppingBag, ArrowLeft, Info } from 'lucide-react';
import { PublicApi, ProtectedApi } from '@/lib/api/axios';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  saveConfirmationRecap,
  type ConfirmationRecap,
} from '@/lib/confirmationStore';
import type { PublicDeliveryZoneGetAll200ItemsItem } from '@vite-et-gourmand/sdk';

const checkoutSchema = z.object({
  guest_name: z.string().optional(),
  guest_email: z.string().optional(),
  guest_phone: z.string().optional(),
  delivery_address: z.string().min(5, "L'adresse est requise"),
  delivery_city: z.string().min(2, 'La ville est requise'),
  delivery_postal_code: z.string().min(5, 'Le code postal est requis'),
  delivery_zone_id: z.string().min(1, 'Selectionnez une zone de livraison'),
  delivery_date: z.string().min(1, 'Selectionnez une date de livraison'),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [zones, setZones] = useState<PublicDeliveryZoneGetAll200ItemsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const cartTotal = getTotal();
  const totalPrice = cartTotal + deliveryFee;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const watchZoneId = watch('delivery_zone_id');

  // Minimum delivery date: 2 days from now.
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const minDateStr = minDate.toISOString().split('T')[0];

  // Load active delivery zones (public) once.
  useEffect(() => {
    let isMounted = true;
    async function loadZones() {
      try {
        const { data } = await PublicApi.publicDeliveryZoneGetAll();
        if (isMounted) setZones(data.items);
      } catch {
        // interceptor surfaces errors
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadZones();
    return () => {
      isMounted = false;
    };
  }, []);

  // Prefill address fields for authenticated users from their profile.
  useEffect(() => {
    if (user) {
      if (user.address) setValue('delivery_address', user.address);
      if (user.city) setValue('delivery_city', user.city);
      if (user.postalCode) setValue('delivery_postal_code', user.postalCode);
    }
  }, [user, setValue]);

  // Recompute the delivery fee server-side whenever the selected zone changes.
  useEffect(() => {
    if (!watchZoneId) {
      setDeliveryFee(0);
      return;
    }
    let isMounted = true;
    PublicApi.publicDeliveryZoneCalculatePrice({ deliveryZoneId: watchZoneId })
      .then(({ data }) => {
        if (isMounted) setDeliveryFee(data.deliveryFee);
      })
      .catch(() => {
        if (isMounted) setDeliveryFee(0);
      });
    return () => {
      isMounted = false;
    };
  }, [watchZoneId]);

  async function onSubmit(data: CheckoutFormData) {
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    // Conditionally validate guest fields when not authenticated.
    if (!isAuthenticated) {
      let hasError = false;
      if (!data.guest_name || data.guest_name.length < 2) {
        setError('guest_name', { message: 'Le nom est requis' });
        hasError = true;
      }
      if (!data.guest_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.guest_email)) {
        setError('guest_email', { message: 'Email invalide' });
        hasError = true;
      }
      if (!data.guest_phone || data.guest_phone.length < 10) {
        setError('guest_phone', { message: 'Telephone invalide' });
        hasError = true;
      }
      if (hasError) return;
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        menuId: item.menuId,
        quantity: item.quantity,
      }));

      // The backend validates deliveryDate as a date-only string (YYYY-MM-DD),
      // which is exactly what the <input type="date"> already produces.
      const deliveryDate = data.delivery_date;

      let recap: ConfirmationRecap;

      if (isAuthenticated) {
        const { data: order } = await ProtectedApi.protectedOrderCreate({
          items: orderItems,
          deliveryZoneId: data.delivery_zone_id,
          deliveryAddress: data.delivery_address,
          deliveryCity: data.delivery_city,
          deliveryPostalCode: data.delivery_postal_code,
          deliveryDate,
          notes: data.notes || undefined,
        });
        recap = {
          id: order.id,
          totalPrice: order.totalPrice,
          deliveryFee: order.deliveryFee,
          deliveryDate: order.deliveryDate ?? null,
          deliveryAddress: order.deliveryAddress ?? null,
          deliveryCity: order.deliveryCity ?? null,
          guestName: null,
          guestEmail: user?.email ?? null,
          items: order.items.map((i) => ({
            id: i.id,
            menuName: i.menuName ?? 'Menu',
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        };
      } else {
        const { data: order } = await PublicApi.publicOrderCreateGuest({
          items: orderItems,
          guestName: data.guest_name!,
          guestEmail: data.guest_email!,
          guestPhone: data.guest_phone || undefined,
          deliveryZoneId: data.delivery_zone_id,
          deliveryAddress: data.delivery_address,
          deliveryCity: data.delivery_city,
          deliveryPostalCode: data.delivery_postal_code,
          deliveryDate,
          notes: data.notes || undefined,
        });
        recap = {
          id: order.id,
          totalPrice: order.totalPrice,
          deliveryFee: order.deliveryFee,
          deliveryDate: order.deliveryDate ?? null,
          deliveryAddress: order.deliveryAddress ?? null,
          deliveryCity: order.deliveryCity ?? null,
          guestName: order.guestName ?? data.guest_name ?? null,
          guestEmail: order.guestEmail ?? data.guest_email ?? null,
          items: order.items.map((i) => ({
            id: i.id,
            menuName: i.menuName ?? 'Menu',
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        };
      }

      // Persist the recap so the confirmation page can show it even for guests
      // (there is no public "get order by id" endpoint).
      saveConfirmationRecap(recap);
      clearCart();
      router.push(`/commande/confirmation?id=${recap.id}`);
    } catch {
      // The axios interceptor already surfaces the backend error message.
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8">
            Ajoutez des menus a votre panier pour passer commande.
          </p>
          <Link
            href="/menus"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={20} />
            Voir les menus
          </Link>
        </div>
      </div>
    );
  }

  const isGuest = !isAuthenticated;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/panier"
        className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
      >
        <ArrowLeft size={18} />
        Retour au panier
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-8">Finaliser votre commande</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isGuest && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Vos coordonnees</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Connectez-vous
                  </Link>{' '}
                  pour un paiement plus rapide.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="guest_name" className="block text-sm font-medium text-foreground mb-2">
                      Nom complet *
                    </label>
                    <input
                      id="guest_name"
                      type="text"
                      {...register('guest_name')}
                      className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      placeholder="Jean Dupont"
                    />
                    {errors.guest_name && (
                      <p className="text-destructive text-sm mt-1">{errors.guest_name.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="guest_email" className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      id="guest_email"
                      type="email"
                      {...register('guest_email')}
                      className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      placeholder="jean@exemple.fr"
                    />
                    {errors.guest_email && (
                      <p className="text-destructive text-sm mt-1">{errors.guest_email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="guest_phone" className="block text-sm font-medium text-foreground mb-2">
                      Telephone *
                    </label>
                    <input
                      id="guest_phone"
                      type="tel"
                      {...register('guest_phone')}
                      className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      placeholder="06 12 34 56 78"
                    />
                    {errors.guest_phone && (
                      <p className="text-destructive text-sm mt-1">{errors.guest_phone.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isAuthenticated && user && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Vos coordonnees</h2>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </span>
                  <br />
                  {user.email}
                  {user.phone && (
                    <>
                      <br />
                      {user.phone}
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Livraison</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="delivery_date" className="block text-sm font-medium text-foreground mb-2">
                    Date de livraison *
                  </label>
                  <input
                    id="delivery_date"
                    type="date"
                    min={minDateStr}
                    {...register('delivery_date')}
                    className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Commande minimum 48h a l&apos;avance
                  </p>
                  {errors.delivery_date && (
                    <p className="text-destructive text-sm mt-1">{errors.delivery_date.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="delivery_address" className="block text-sm font-medium text-foreground mb-2">
                    Adresse de livraison *
                  </label>
                  <input
                    id="delivery_address"
                    type="text"
                    {...register('delivery_address')}
                    className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    placeholder="12 rue de la Paix"
                  />
                  {errors.delivery_address && (
                    <p className="text-destructive text-sm mt-1">{errors.delivery_address.message}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="delivery_city" className="block text-sm font-medium text-foreground mb-2">
                      Ville *
                    </label>
                    <input
                      id="delivery_city"
                      type="text"
                      {...register('delivery_city')}
                      className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      placeholder="Bordeaux"
                    />
                    {errors.delivery_city && (
                      <p className="text-destructive text-sm mt-1">{errors.delivery_city.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="delivery_postal_code" className="block text-sm font-medium text-foreground mb-2">
                      Code postal *
                    </label>
                    <input
                      id="delivery_postal_code"
                      type="text"
                      {...register('delivery_postal_code')}
                      className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      placeholder="33000"
                    />
                    {errors.delivery_postal_code && (
                      <p className="text-destructive text-sm mt-1">{errors.delivery_postal_code.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="delivery_zone_id" className="block text-sm font-medium text-foreground mb-2">
                    Zone de livraison *
                  </label>
                  <select
                    id="delivery_zone_id"
                    {...register('delivery_zone_id')}
                    className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  >
                    <option value="">Selectionnez une zone</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                        {zone.city ? ` (${zone.city})` : ''}
                      </option>
                    ))}
                  </select>
                  {errors.delivery_zone_id && (
                    <p className="text-destructive text-sm mt-1">{errors.delivery_zone_id.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
                    Notes / Instructions speciales
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    {...register('notes')}
                    className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground resize-none"
                    placeholder="Allergies, acces, horaire souhaite..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Ceci est une demande de commande</p>
                <p className="mt-1">
                  Nous vous contacterons pour confirmer la disponibilite et finaliser votre commande.
                  Aucun paiement n&apos;est requis pour le moment.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recapitulatif</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.menuId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.menuName} x {item.quantity}
                  </span>
                  <span className="text-foreground font-medium">
                    {(item.unitPrice * item.quantity).toFixed(2)} &euro;
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="text-foreground">{cartTotal.toFixed(2)} &euro;</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frais de livraison</span>
                <span className="text-foreground">
                  {watchZoneId
                    ? deliveryFee === 0
                      ? 'Gratuit'
                      : `${deliveryFee.toFixed(2)} €`
                    : '-'}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary text-lg">{totalPrice.toFixed(2)} &euro;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

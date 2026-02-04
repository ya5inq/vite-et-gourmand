'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ShoppingBag, ArrowLeft, Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/contexts/CartContext';
import type { User } from '@supabase/supabase-js';

interface DeliveryZone {
  id: string;
  name: string;
  city: string | null;
  postal_code: string | null;
  delivery_fee: number;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
}

// Full schema - guest fields are validated conditionally in onSubmit
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const cartTotal = getTotal();

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

  const selectedZone = useMemo(
    () => zones.find((z) => z.id === watchZoneId),
    [zones, watchZoneId]
  );

  const deliveryFee = selectedZone?.delivery_fee ?? 0;
  const totalPrice = cartTotal + deliveryFee;

  // Minimum delivery date: 2 days from now
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const minDateStr = minDate.toISOString().split('T')[0];

  useEffect(() => {
    const supabase = createClient();

    async function loadData() {
      // Load zones
      const { data: zonesData } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('is_active', true)
        .order('name');
      setZones((zonesData as DeliveryZone[]) ?? []);

      // Check auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        // Load profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone, address, city, postal_code')
          .eq('id', authUser.id)
          .single();

        if (profileData) {
          const typedProfile = profileData as Profile;
          setProfile(typedProfile);
          // Pre-fill form
          if (typedProfile.address) setValue('delivery_address', typedProfile.address);
          if (typedProfile.city) setValue('delivery_city', typedProfile.city);
          if (typedProfile.postal_code) setValue('delivery_postal_code', typedProfile.postal_code);
        }
      }

      setLoading(false);
    }

    loadData();
  }, [setValue]);

  async function onSubmit(data: CheckoutFormData) {
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    // Validate guest fields if not logged in
    if (!user) {
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
      const supabase = createClient();

      // Re-fetch the current user to ensure we have the latest auth state
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      let orderId: string;

      if (currentUser) {
        // Authenticated user: use direct insert
        const orderData = {
          user_id: currentUser.id,
          total_price: totalPrice,
          delivery_address: data.delivery_address,
          delivery_city: data.delivery_city,
          delivery_postal_code: data.delivery_postal_code,
          delivery_zone_id: data.delivery_zone_id,
          delivery_date: data.delivery_date,
          delivery_fee: deliveryFee,
          notes: data.notes || null,
          status: 'pending' as const,
        };

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert(orderData as never)
          .select('id')
          .single();

        if (orderError) throw orderError;
        if (!order) throw new Error('No order returned');
        orderId = (order as { id: string }).id;

        // Create order items for authenticated user
        const orderItems = items.map((item) => ({
          order_id: orderId,
          menu_id: item.menuId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems as never);

        if (itemsError) throw itemsError;
      } else {
        // Guest user: use RPC functions to bypass RLS
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: guestOrderId, error: guestOrderError } = await (supabase.rpc as any)(
          'create_guest_order',
          {
            p_guest_name: data.guest_name!,
            p_guest_email: data.guest_email!,
            p_guest_phone: data.guest_phone!,
            p_total_price: totalPrice,
            p_delivery_address: data.delivery_address,
            p_delivery_city: data.delivery_city,
            p_delivery_postal_code: data.delivery_postal_code,
            p_delivery_zone_id: data.delivery_zone_id,
            p_delivery_date: data.delivery_date,
            p_delivery_fee: deliveryFee,
            p_notes: data.notes || null,
          }
        );

        if (guestOrderError) throw guestOrderError;
        if (!guestOrderId) throw new Error('No order ID returned');
        orderId = guestOrderId;

        // Add order items for guest order
        const orderItemsJson = items.map((item) => ({
          menu_id: item.menuId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: itemsError } = await (supabase.rpc as any)('add_guest_order_items', {
          p_order_id: orderId,
          p_items: orderItemsJson,
        });

        if (itemsError) throw itemsError;
      }

      // Clear cart and redirect
      clearCart();
      router.push(`/commande/confirmation?id=${orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Erreur lors de la commande. Veuillez reessayer.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
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

  const isGuest = !user;

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
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Guest info (if not logged in) */}
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

            {/* Logged in user info */}
            {user && profile && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Vos coordonnees</h2>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {profile.first_name} {profile.last_name}
                  </span>
                  <br />
                  {user.email}
                  {profile.phone && <><br />{profile.phone}</>}
                </p>
              </div>
            )}

            {/* Delivery info */}
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
                        {' - '}
                        {zone.delivery_fee === 0 ? 'Gratuit' : `${zone.delivery_fee.toFixed(2)} \u20ac`}
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

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
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

        {/* Order summary */}
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
                  {selectedZone
                    ? deliveryFee === 0
                      ? 'Gratuit'
                      : `${deliveryFee.toFixed(2)} \u20ac`
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

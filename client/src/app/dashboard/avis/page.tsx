'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ProtectedApi } from '@/lib/api/axios';
import { useAuth } from '@/contexts/AuthContext';
import { StarRating } from '@/components/molecules/StarRating';
import type {
  ProtectedReviewGetMine200ItemsItem,
  ProtectedOrderGetAll200ItemsItem,
} from '@vite-et-gourmand/sdk';

const reviewSchema = z.object({
  order_id: z.string().min(1, 'Selectionnez une commande'),
  rating: z.number().min(1, 'Selectionnez une note').max(5),
  comment: z.string().optional(),
});

type ReviewForm = z.infer<typeof reviewSchema>;

export default function AvisPage() {
  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<ProtectedReviewGetMine200ItemsItem[]>([]);
  const [completedOrders, setCompletedOrders] = useState<ProtectedOrderGetAll200ItemsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  });

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

    async function load() {
      try {
        const [reviewsRes, ordersRes] = await Promise.all([
          ProtectedApi.protectedReviewGetMine(),
          ProtectedApi.protectedOrderGetAll({
            status: 'COMPLETED',
            sortOrder: 'DESC',
            limit: 100,
          }),
        ]);

        if (!isMounted) return;

        const myReviews = reviewsRes.data.items;
        setReviews(myReviews);

        const reviewedOrderIds = new Set(myReviews.map((r) => r.orderId));
        setCompletedOrders(
          ordersRes.data.items.filter((o) => !reviewedOrderIds.has(o.id)),
        );
      } catch {
        // The axios interceptor surfaces backend errors.
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  async function onSubmit(data: ReviewForm) {
    setSubmitting(true);
    try {
      await ProtectedApi.protectedReviewCreate({
        orderId: data.order_id,
        rating: data.rating,
        comment: data.comment || undefined,
      });

      toast.success('Avis envoye ! Il sera visible apres moderation.');
      reset();
      setSelectedRating(0);

      const { data: updated } = await ProtectedApi.protectedReviewGetMine();
      setReviews(updated.items);
      setCompletedOrders((prev) => prev.filter((o) => o.id !== data.order_id));
    } catch {
      // The axios interceptor surfaces backend errors.
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">Mes avis</h1>

      {completedOrders.length > 0 && (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Laisser un avis</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="order_id" className="block text-sm font-medium text-foreground mb-2">
                Commande
              </label>
              <select
                id="order_id"
                {...register('order_id')}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              >
                <option value="">Selectionnez une commande</option>
                {completedOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    Commande #{order.id.slice(0, 8).toUpperCase()} -{' '}
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </option>
                ))}
              </select>
              {errors.order_id && (
                <p className="text-destructive text-sm mt-1">{errors.order_id.message}</p>
              )}
            </div>

            <div>
              <span id="rating-label" className="block text-sm font-medium text-foreground mb-2">
                Note
              </span>
              <div className="flex gap-1" role="radiogroup" aria-labelledby="rating-label">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={selectedRating === star}
                    aria-label={`${star} etoile${star > 1 ? 's' : ''} sur 5`}
                    onClick={() => {
                      setSelectedRating(star);
                      setValue('rating', star);
                    }}
                    className="text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    <span
                      aria-hidden="true"
                      className={star <= selectedRating ? 'text-yellow-500' : 'text-gray-300'}
                    >
                      &#9733;
                    </span>
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-destructive text-sm mt-1">{errors.rating.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
                Commentaire
              </label>
              <textarea
                id="comment"
                rows={4}
                {...register('comment')}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground resize-none"
                placeholder="Partagez votre experience..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-card rounded-2xl shadow-sm border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Mes avis precedents</h2>
        </div>

        {reviews.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">Vous n&apos;avez pas encore laisse d&apos;avis.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <StarRating rating={review.rating} />
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        review.isApproved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {review.isApproved ? 'Approuve' : 'En attente'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                {review.comment && <p className="text-foreground">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

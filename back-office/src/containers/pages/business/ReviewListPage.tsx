import { Star, Check, X } from 'lucide-react';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { useReviews, useApproveReview, useRejectReview } from '@/api/hooks/useReviews';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

export const ReviewListPage = () => {
  const { data: reviews, isLoading } = useReviews();
  const approveReview = useApproveReview();
  const rejectReview = useRejectReview();

  const handleApprove = (id: string) => {
    approveReview.mutate(id);
  };

  const handleReject = (id: string) => {
    if (window.confirm('Supprimer cet avis ?')) {
      rejectReview.mutate(id);
    }
  };

  return (
    <DashboardPageLayout title="Avis" description="Moderation des avis clients">
      {isLoading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Commande</th>
                <th className="px-4 py-3 text-left font-medium">Note</th>
                <th className="px-4 py-3 text-left font-medium">Commentaire</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reviews?.map((review) => (
                <tr key={review.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{review.orderId.slice(0, 8)}...</td>
                  <td className="px-4 py-3">
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                    {review.comment ?? '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        review.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {review.isApproved ? 'Approuve' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        disabled={approveReview.isPending}
                        className="mr-2 rounded p-1 text-green-600 hover:bg-green-50"
                        title="Approuver"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleReject(review.id)}
                      disabled={rejectReview.isPending}
                      className="rounded p-1 text-red-600 hover:bg-red-50"
                      title="Supprimer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {reviews?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun avis
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardPageLayout>
  );
};

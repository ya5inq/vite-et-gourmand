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
                <th className="px-4 py-3 text-left font-medium">Client</th>
                <th className="px-4 py-3 text-left font-medium">Menu</th>
                <th className="px-4 py-3 text-left font-medium">Note</th>
                <th className="px-4 py-3 text-left font-medium">Commentaire</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reviews?.map((review) => {
                const clientName = review.profiles
                  ? [review.profiles.first_name, review.profiles.last_name].filter(Boolean).join(' ') || 'Anonyme'
                  : 'Anonyme';

                return (
                  <tr key={review.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">{clientName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{review.menus?.name ?? '-'}</td>
                    <td className="px-4 py-3">
                      <StarRating rating={review.rating} />
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                      {review.comment ?? '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          review.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {review.is_approved ? 'Approuve' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!review.is_approved && (
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
                );
              })}
              {reviews?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
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

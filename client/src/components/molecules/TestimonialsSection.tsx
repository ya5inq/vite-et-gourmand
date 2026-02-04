import { Quote } from 'lucide-react';
import { StarRating } from './StarRating';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface TestimonialsSectionProps {
  reviews: Review[];
}

function getInitials(firstName: string | null, lastName: string | null): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || 'C';
}

const AVATAR_COLORS = [
  'bg-primary',
  'bg-blue-500',
  'bg-green-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-pink-500',
];

function getAvatarColor(id: string): string {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  if (reviews.length === 0) return null;

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <section className="py-12 sm:py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <span className="text-base sm:text-lg font-bold">{averageRating.toFixed(1)}</span>
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-xs sm:text-sm">({reviews.length} avis)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Ils nous ont fait confiance
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Decouvrez pourquoi nos clients nous recommandent
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((review) => {
            const firstName = review.profiles?.first_name;
            const lastName = review.profiles?.last_name;
            const name =
              firstName || lastName
                ? `${firstName ?? ''} ${lastName ?? ''}`.trim()
                : 'Client';
            const initials = getInitials(firstName ?? null, lastName ?? null);
            const avatarColor = getAvatarColor(review.id);

            return (
              <div
                key={review.id}
                className="bg-card rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 hover:shadow-lg transition-all relative"
              >
                <Quote className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 text-primary/10" />

                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base`}>
                    {initials}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm sm:text-base">{name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <StarRating rating={review.rating} />

                {review.comment && (
                  <p className="text-foreground text-xs sm:text-sm mt-3 sm:mt-4 line-clamp-3 sm:line-clamp-4">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

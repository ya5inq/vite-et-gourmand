interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

export function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} sur ${maxStars} etoiles`}>
      {Array.from({ length: maxStars }, (_, i) => (
        <span
          key={i}
          className={`text-lg ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}

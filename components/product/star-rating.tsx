import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: string;
  count: number;
}

export function StarRating({ rating, count }: StarRatingProps) {
  const value = parseFloat(rating);
  if (value === 0 && count === 0) return null;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={cn(
              "h-4 w-4",
              star <= Math.round(value) ? "text-[var(--gold)]" : "text-border"
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span
        className="text-sm text-muted-foreground"
        aria-label={`Rated ${value.toFixed(1)} out of 5, ${count} ${count === 1 ? "review" : "reviews"}`}
      >
        {value.toFixed(1)} ({count} {count === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}

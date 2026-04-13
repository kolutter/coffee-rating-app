interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export default function RatingStars({ rating, size = "md" }: RatingStarsProps) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercent = Math.min(
          100,
          Math.max(0, (rating - (star - 1)) * 100)
        );

        return (
          <div key={star} className={`relative ${sizeClasses[size]}`}>
            <svg
              className={`${sizeClasses[size]} text-coffee-200`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>

            {fillPercent > 0 && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{
                  width: `${fillPercent}%`,
                  height: "100%",
                }}
              >
                <svg
                  className={`${sizeClasses[size]} text-amber-400`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
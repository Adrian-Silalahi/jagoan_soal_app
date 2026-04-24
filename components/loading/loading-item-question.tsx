const LoadingItemQuestion = () => {
  return (
    <div className="glass-panel rounded-xl p-6 relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />

      <div className="flex items-start gap-4 opacity-50">
        {/* Number badge skeleton */}
        <div className="w-10 h-10 rounded-lg bg-surface-container flex-shrink-0" />

        <div className="flex-1 flex flex-col gap-4">
          {/* Question text skeleton */}
          <div className="h-4 bg-surface-container rounded w-full" />
          <div className="h-4 bg-surface-container rounded w-5/6" />
          <div className="h-4 bg-surface-container rounded w-3/4" />

          {/* Options skeleton */}
          <div className="flex flex-col gap-3 mt-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-surface-container-low rounded-lg w-full"
              />
            ))}
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
            <div className="h-4 bg-surface-container rounded w-32" />
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-surface-container rounded-lg" />
              <div className="h-8 w-20 bg-surface-container rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingItemQuestion

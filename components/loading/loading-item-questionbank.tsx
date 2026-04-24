const LoadingItemQuestionBank = () => {
  return (
    <tr className="border-b border-white/5">
      {/* Checkbox skeleton */}
      <td className="py-5 px-6">
        <div className="w-5 h-5 rounded bg-surface-container animate-pulse" />
      </td>

      {/* Number skeleton */}
      <td className="py-5 px-4">
        <div className="w-6 h-4 rounded bg-surface-container animate-pulse" />
      </td>

      {/* Question skeleton */}
      <td className="py-5 px-6">
        <div className="relative overflow-hidden">
          <div className="h-4 bg-surface-container rounded w-3/4 animate-pulse" />
          {/* Shimmer */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
      </td>

      {/* Badge skeleton */}
      <td className="py-5 px-6">
        <div className="w-28 h-6 rounded-full bg-surface-container animate-pulse" />
      </td>

      {/* Mapel skeleton */}
      <td className="py-5 px-6">
        <div className="w-20 h-4 rounded bg-surface-container animate-pulse" />
      </td>

      {/* Date skeleton */}
      <td className="py-5 px-6 text-right">
        <div className="w-16 h-4 rounded bg-surface-container animate-pulse ml-auto" />
      </td>
    </tr>
  )
}

export default LoadingItemQuestionBank

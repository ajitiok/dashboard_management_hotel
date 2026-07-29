import { cn } from '@/utils'

type LoadingDataProps = {
  label?: string
  className?: string
  /** Fill available content area (default) or a fixed min height */
  minHeightClassName?: string
}

/**
 * Centered three-dot loading indicator matching the product loading screen.
 */
export function LoadingData({
  label = 'Loading Data...',
  className,
  minHeightClassName = 'min-h-[50vh]',
}: LoadingDataProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4 rounded-[1.75rem] bg-backgroundLight-200',
        minHeightClassName,
        className,
      )}
    >
      <div className="flex items-center gap-2" aria-hidden>
        <span className="loading-dot h-2.5 w-2.5 rounded-full bg-primary-600" />
        <span className="loading-dot loading-dot-delay-1 h-2.5 w-2.5 rounded-full bg-primary-600" />
        <span className="loading-dot loading-dot-delay-2 h-2.5 w-2.5 rounded-full bg-primary-600" />
      </div>
      <p className="text-sub2 font-medium text-base-800">{label}</p>
      <span className="sr-only">{label}</span>
    </div>
  )
}

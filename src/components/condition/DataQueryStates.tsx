import type { ReactNode } from 'react'
import { EmptyState, ErrorState, RetryButton } from '@/components/condition'
import { LoadingData } from '@/components/common'
import { cn } from '@/utils'

type DataQueryStatesProps = {
  isLoading: boolean
  isError: boolean
  error?: unknown
  onRetry: () => void
  loadingFallback?: ReactNode
  errorTitle?: string
  errorMessage: string
  isEmpty?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  isFetching?: boolean
  children: ReactNode
  className?: string
}

/**
 * Shared loading / error / empty / success rendering for list pages.
 */
export function DataQueryStates({
  isLoading,
  isError,
  error,
  onRetry,
  loadingFallback,
  errorTitle,
  errorMessage,
  isEmpty = false,
  emptyTitle = 'No results found.',
  emptyDescription,
  emptyAction,
  isFetching = false,
  children,
  className,
}: DataQueryStatesProps) {
  if (isLoading) {
    return loadingFallback ?? <LoadingData />
  }

  if (isError) {
    return (
      <ErrorState
        title={errorTitle}
        message={
          error instanceof Error && error.message
            ? error.message
            : errorMessage
        }
        action={<RetryButton onRetry={onRetry} />}
      />
    )
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        isFetching && 'opacity-70 transition-opacity',
        className,
      )}
    >
      {children}
    </div>
  )
}

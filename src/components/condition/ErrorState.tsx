import type { ReactNode } from 'react'
import Button from '@/components/core/Button'
import { cn, setMockApiFailure } from '@/utils'

export interface ErrorStateProps {
  title?: string
  message: string
  action?: ReactNode
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-2xl border border-danger-500/20 bg-softColors-6/50 px-4 py-12 text-center',
        className,
      )}
    >
      <h2 className="text-h6 font-semibold text-danger-700">{title}</h2>
      <p className="max-w-md text-sub2 text-base-600">{message}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}

type RetryButtonProps = {
  onRetry: () => void
  label?: string
  className?: string
}

/** Clears demo failure flags, then retries the query. */
export function RetryButton({
  onRetry,
  label = 'Try again',
  className,
}: RetryButtonProps) {
  return (
    <Button
      type="button"
      variant="primary"
      size="s"
      className={cn('rounded-full!', className)}
      onClick={() => {
        setMockApiFailure(false)
        onRetry()
      }}
    >
      {label}
    </Button>
  )
}

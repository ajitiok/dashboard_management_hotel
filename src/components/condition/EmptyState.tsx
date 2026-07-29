import type { ReactNode } from 'react'
import { cn } from '@/utils'

export interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-base-100/60 px-4 py-12 text-center',
        className,
      )}
    >
      <h2 className="text-h6 font-semibold text-base-900">{title}</h2>
      {description ? (
        <p className="max-w-md text-sub2 text-base-500">{description}</p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}

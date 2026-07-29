import { cn } from '@/utils'

type ListPaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

export function ListPagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: ListPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const end = Math.min(safePage * pageSize, total)

  if (totalPages <= 1) {
    return (
      <p className={cn('text-sub3 text-base-500', className)}>
        Showing {total} result{total === 1 ? '' : 's'}
      </p>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3',
        className,
      )}
    >
      <p className="text-sub3 text-base-500">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className="rounded-full border border-border px-3 py-1.5 text-sub3 font-medium text-base-700 disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sub3 font-medium text-base-800">
          Page {safePage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="rounded-full border border-border px-3 py-1.5 text-sub3 font-medium text-base-700 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}

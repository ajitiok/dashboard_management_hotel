import { useQueryClient } from '@tanstack/react-query'
import { isMockApiFailureEnabled, setMockApiFailure, cn } from '@/utils'

type DemoApiErrorToggleProps = {
  className?: string
}

/** Demo control so reviewers can trigger/clear the error UI state. */
export function DemoApiErrorToggle({ className }: DemoApiErrorToggleProps) {
  const queryClient = useQueryClient()
  const enabled = isMockApiFailureEnabled()

  return (
    <button
      type="button"
      onClick={() => {
        setMockApiFailure(!enabled)
        void queryClient.invalidateQueries()
      }}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sub4 font-medium transition-colors',
        enabled
          ? 'border-danger-500/40 bg-softColors-6 text-danger-700'
          : 'border-border bg-base-100 text-base-500 hover:bg-base-200 hover:text-base-800',
        className,
      )}
      title="Simulate API failure for loading error state"
    >
      {enabled ? 'Error simulation on' : 'Simulate API error'}
    </button>
  )
}

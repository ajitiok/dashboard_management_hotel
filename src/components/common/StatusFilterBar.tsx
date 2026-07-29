import type { ReactNode } from 'react'
import { CalendarDays, ListFilter } from 'lucide-react'
import { cn } from '@/utils'

export type StatusFilterOption = {
  id: string
  label: string
  /** Tailwind color class for the status dot, e.g. bg-primary-500 */
  dotClassName?: string
}

type StatusFilterBarBaseProps = {
  options: readonly StatusFilterOption[]
  view?: 'list' | 'calendar'
  onViewChange?: (view: 'list' | 'calendar') => void
  className?: string
}

type StatusFilterBarSingleProps = StatusFilterBarBaseProps & {
  multiple?: false
  value: string
  onChange: (id: string) => void
}

type StatusFilterBarMultipleProps = StatusFilterBarBaseProps & {
  multiple: true
  value: string[]
  onChange: (ids: string[]) => void
}

export type StatusFilterBarProps =
  | StatusFilterBarSingleProps
  | StatusFilterBarMultipleProps

function toggleMultiFilter(current: string[], nextId: string): string[] {
  if (nextId === 'all') {
    return ['all']
  }

  const withoutAll = current.filter((id) => id !== 'all')
  const isSelected = withoutAll.includes(nextId)

  if (isSelected) {
    const next = withoutAll.filter((id) => id !== nextId)
    return next.length > 0 ? next : ['all']
  }

  // Selecting any specific filter always drops "All"
  return [...withoutAll, nextId]
}

export function StatusFilterBar(props: StatusFilterBarProps) {
  const { options, view = 'list', onViewChange, className } = props
  const isMultiple = props.multiple === true

  const isActive = (id: string) => {
    if (isMultiple) {
      const value = props.value.filter(Boolean)
      if (id === 'all') {
        // "All" is active only when nothing specific is selected
        return value.length === 0 || (value.length === 1 && value[0] === 'all')
      }
      return value.includes(id) && !value.includes('all')
    }

    return props.value === id
  }

  const handleClick = (id: string) => {
    if (isMultiple) {
      props.onChange(toggleMultiFilter(props.value, id))
      return
    }

    props.onChange(id)
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        {options.map((option) => {
          const active = isActive(option.id)

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleClick(option.id)}
              aria-pressed={active}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sub3 font-medium transition-colors sm:px-4',
                active
                  ? 'bg-base-100 text-base-900'
                  : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white',
              )}
            >
              {option.dotClassName ? (
                <span
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    option.dotClassName,
                  )}
                />
              ) : null}
              {option.label}
            </button>
          )
        })}
      </div>

      {onViewChange ? (
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <ViewToggleButton
            label="Calendar view"
            active={view === 'calendar'}
            onClick={() => onViewChange('calendar')}
          >
            <CalendarDays className="h-4 w-4" />
          </ViewToggleButton>
          <ViewToggleButton
            label="List view"
            active={view === 'list'}
            onClick={() => onViewChange('list')}
          >
            <ListFilter className="h-4 w-4" />
          </ViewToggleButton>
        </div>
      ) : null}
    </div>
  )
}

function ViewToggleButton({
  children,
  label,
  active,
  onClick,
}: {
  children: ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
        active
          ? 'bg-base-100 text-primary-600'
          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
      )}
    >
      {children}
    </button>
  )
}

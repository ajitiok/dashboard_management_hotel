import { useState, type ReactNode } from 'react'
import Button from '@/components/core/Button'
import { TopNav } from './TopNav'
import {
  StatusFilterBar,
  type StatusFilterOption,
} from './StatusFilterBar'

type DarkPageHeaderBaseProps = {
  title: string
  /** Omit to hide the primary action button */
  actionLabel?: string
  onActionClick?: () => void
  filters?: readonly StatusFilterOption[]
  view?: 'list' | 'calendar'
  /** Only pass this on Guests — calendar/list toggle is shown when provided */
  onViewChange?: (view: 'list' | 'calendar') => void
}

type DarkPageHeaderSingleFilterProps = DarkPageHeaderBaseProps & {
  filterMultiple?: false
  selectedFilters?: string
  onFiltersChange?: (id: string) => void
  defaultFilterId?: string
}

type DarkPageHeaderMultiFilterProps = DarkPageHeaderBaseProps & {
  filterMultiple: true
  selectedFilters: string[]
  onFiltersChange: (ids: string[]) => void
  defaultFilterId?: never
}

export type DarkPageHeaderProps =
  | DarkPageHeaderSingleFilterProps
  | DarkPageHeaderMultiFilterProps

/** Dark header card: nav + title/action + status filters. Page background stays light. */
export function DarkPageHeader(props: DarkPageHeaderProps) {
  const { title, actionLabel, onActionClick, filters, view, onViewChange } =
    props

  const [internalSingleFilter, setInternalSingleFilter] = useState(
    props.filterMultiple ? 'all' : (props.defaultFilterId ?? 'all'),
  )

  return (
    <TopNav variant="dark">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <h1 className="text-h4 font-bold tracking-tight text-white sm:text-h3 md:text-[2.25rem]">
          {title}
        </h1>

        {actionLabel ? (
          <Button
            variant="primary"
            size="m"
            className="w-full rounded-full! bg-primary-600! px-5! hover:bg-primary-700! sm:w-auto"
            onClick={onActionClick}
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>

      {filters && filters.length > 0 ? (
        props.filterMultiple ? (
          <StatusFilterBar
            multiple
            options={filters}
            value={props.selectedFilters}
            onChange={props.onFiltersChange}
            view={view}
            onViewChange={onViewChange}
          />
        ) : (
          <StatusFilterBar
            options={filters}
            value={props.selectedFilters ?? internalSingleFilter}
            onChange={props.onFiltersChange ?? setInternalSingleFilter}
            view={view}
            onViewChange={onViewChange}
          />
        )
      ) : null}
    </TopNav>
  )
}

export type DarkPageShellProps = DarkPageHeaderProps & {
  children?: ReactNode
}

/** Non-dashboard page layout: dark header component + light content below. */
export function DarkPageShell({
  children,
  ...headerProps
}: DarkPageShellProps) {
  return (
    <div className="flex flex-col gap-5">
      <DarkPageHeader {...headerProps} />
      {children}
    </div>
  )
}

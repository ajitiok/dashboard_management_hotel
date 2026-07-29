import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  DarkPageShell,
  DemoApiErrorToggle,
} from '@/components/common'
import { DataQueryStates } from '@/components/condition'
import { GuestsCalendarView } from '@/components/guests/GuestsCalendarView'
import { GuestsTable } from '@/components/guests/GuestsTable'
import { GUEST_STATUS_FILTERS, QUERY_KEYS } from '@/constants'
import type {
  GuestSortDirection,
  GuestSortKey,
  GuestStatus,
} from '@/features/guests/types/guest.types'
import { fetchGuests } from '@/services/guests/fetch-guests.service.ts'

function toGuestStatuses(filterIds: string[]): GuestStatus[] {
  if (filterIds.length === 0 || filterIds.includes('all')) {
    return []
  }

  return filterIds.filter((id): id is GuestStatus => id !== 'all')
}

export function GuestsPage() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all'])
  const [view, setView] = useState<'list' | 'calendar'>('calendar')
  const [sortBy, setSortBy] = useState<GuestSortKey>('createdAt')
  const [sortDirection, setSortDirection] = useState<GuestSortDirection>('desc')

  const statuses = useMemo(
    () => toGuestStatuses(selectedFilters),
    [selectedFilters],
  )

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [...QUERY_KEYS.guests, { statuses, sortBy, sortDirection }],
    queryFn: async () => {
      const response = await fetchGuests({
        statuses,
        sortBy,
        sortDirection,
      })

      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch guests')
      }

      return response.data
    },
  })

  const handleSortChange = (key: GuestSortKey) => {
    if (sortBy === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortBy(key)
    setSortDirection('asc')
  }

  return (
    <DarkPageShell
      title="Guests"
      actionLabel="+ New guest"
      filters={GUEST_STATUS_FILTERS}
      filterMultiple
      selectedFilters={selectedFilters}
      onFiltersChange={setSelectedFilters}
      view={view}
      onViewChange={setView}
    >
      <div className="mb-1 flex justify-end">
        <DemoApiErrorToggle />
      </div>

      <DataQueryStates
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => {
          void refetch()
        }}
        errorMessage="Unable to load guests. Please try again."
        isEmpty={Boolean(data && data.guests.length === 0)}
        emptyTitle="No guests found."
        emptyDescription="Try adjusting filters or add a new guest."
        isFetching={isFetching}
      >
        {data && view === 'list' ? (
          <GuestsTable
            guests={data.guests}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        ) : null}

        {data && view === 'calendar' ? (
          <GuestsCalendarView guests={data.guests} />
        ) : null}
      </DataQueryStates>
    </DarkPageShell>
  )
}

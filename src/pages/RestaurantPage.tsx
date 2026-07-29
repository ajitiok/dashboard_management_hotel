import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import {
  DarkPageShell,
  DemoApiErrorToggle,
} from '@/components/common'
import { DataQueryStates } from '@/components/condition'
import { RestaurantTable } from '@/components/restaurant/RestaurantTable'
import { QUERY_KEYS, RESTAURANT_STATUS_FILTERS } from '@/constants'
import type {
  RestaurantBookingStatus,
  RestaurantSortDirection,
  RestaurantSortKey,
} from '@/features/restaurant/types/restaurant.types'
import { fetchRestaurantBookings } from '@/services/restaurant/fetch-restaurant.service.ts'

function toStatuses(filterIds: string[]): RestaurantBookingStatus[] {
  if (filterIds.length === 0 || filterIds.includes('all')) return []
  return filterIds.filter((id): id is RestaurantBookingStatus => id !== 'all')
}

export function RestaurantPage() {
  const [statusFilters, setStatusFilters] = useState<string[]>(['all'])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<RestaurantSortKey>('reservationTime')
  const [sortDirection, setSortDirection] =
    useState<RestaurantSortDirection>('asc')

  const statuses = useMemo(() => toStatuses(statusFilters), [statusFilters])

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [
      ...QUERY_KEYS.restaurant,
      { search, statuses, sortBy, sortDirection },
    ],
    queryFn: async () => {
      const response = await fetchRestaurantBookings({
        search,
        statuses,
        sortBy,
        sortDirection,
      })

      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch restaurant bookings')
      }

      return response.data
    },
  })

  const handleSortChange = (key: RestaurantSortKey) => {
    if (sortBy === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortBy(key)
    setSortDirection('asc')
  }

  return (
    <DarkPageShell
      title="Restaurant"
      filters={RESTAURANT_STATUS_FILTERS}
      filterMultiple
      selectedFilters={statusFilters}
      onFiltersChange={setStatusFilters}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <label className="relative block w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-base-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search guest, booking ID, or table…"
            className="w-full rounded-full border border-border bg-base-100 py-2.5 pr-4 pl-10 text-sub2 text-base-900 outline-none placeholder:text-base-400 focus:border-primary-500"
          />
        </label>
        <DemoApiErrorToggle />
      </div>

      <DataQueryStates
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => {
          void refetch()
        }}
        errorMessage="Unable to load restaurant bookings. Please try again."
        isEmpty={Boolean(data && data.bookings.length === 0)}
        emptyTitle="No bookings found."
        emptyDescription="Try a different search or clear your filters."
        isFetching={isFetching}
      >
        {data ? (
          <RestaurantTable
            bookings={data.bookings}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        ) : null}
      </DataQueryStates>
    </DarkPageShell>
  )
}

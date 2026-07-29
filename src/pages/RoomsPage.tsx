import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import {
  DarkPageShell,
  DemoApiErrorToggle,
} from '@/components/common'
import { DataQueryStates } from '@/components/condition'
import { RoomsTable } from '@/components/rooms/RoomsTable'
import {
  ROOM_STATUS_FILTERS,
  ROOM_TYPE_FILTERS,
  QUERY_KEYS,
} from '@/constants'
import type {
  RoomSortDirection,
  RoomSortKey,
  RoomStatus,
  RoomType,
} from '@/features/rooms/types/room.types'
import { fetchRooms } from '@/services/rooms/fetch-rooms.service.ts'
import { cn } from '@/utils'

function toRoomStatuses(filterIds: string[]): RoomStatus[] {
  if (filterIds.length === 0 || filterIds.includes('all')) return []
  return filterIds.filter((id): id is RoomStatus => id !== 'all')
}

function toRoomTypes(filterIds: string[]): RoomType[] {
  if (filterIds.length === 0 || filterIds.includes('all')) return []
  return filterIds.filter((id): id is RoomType => id !== 'all')
}

function toggleFilter(current: string[], nextId: string): string[] {
  if (nextId === 'all') return ['all']

  const withoutAll = current.filter((id) => id !== 'all')
  const isSelected = withoutAll.includes(nextId)

  if (isSelected) {
    const next = withoutAll.filter((id) => id !== nextId)
    return next.length > 0 ? next : ['all']
  }

  return [...withoutAll, nextId]
}

export function RoomsPage() {
  const [statusFilters, setStatusFilters] = useState<string[]>(['all'])
  const [typeFilters, setTypeFilters] = useState<string[]>(['all'])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<RoomSortKey>('number')
  const [sortDirection, setSortDirection] = useState<RoomSortDirection>('asc')

  const statuses = useMemo(() => toRoomStatuses(statusFilters), [statusFilters])
  const types = useMemo(() => toRoomTypes(typeFilters), [typeFilters])

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [
      ...QUERY_KEYS.rooms,
      { search, statuses, types, sortBy, sortDirection },
    ],
    queryFn: async () => {
      const response = await fetchRooms({
        search,
        statuses,
        types,
        sortBy,
        sortDirection,
      })

      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch rooms')
      }

      return response.data
    },
  })

  const handleSortChange = (key: RoomSortKey) => {
    if (sortBy === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortBy(key)
    setSortDirection('asc')
  }

  return (
    <DarkPageShell
      title="Rooms"
      filters={ROOM_STATUS_FILTERS}
      filterMultiple
      selectedFilters={statusFilters}
      onFiltersChange={setStatusFilters}
    >
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="relative block w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-base-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search room number, type, or floor…"
              className="w-full rounded-full border border-border bg-base-100 py-2.5 pr-4 pl-10 text-sub2 text-base-900 outline-none placeholder:text-base-400 focus:border-primary-500"
            />
          </label>
          <DemoApiErrorToggle />
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <span className="shrink-0 self-center text-sub3 font-medium text-base-500">
            Type
          </span>
          {ROOM_TYPE_FILTERS.map((option) => {
            const isActive =
              option.id === 'all'
                ? typeFilters.length === 0 ||
                  (typeFilters.length === 1 && typeFilters[0] === 'all')
                : typeFilters.includes(option.id) &&
                  !typeFilters.includes('all')

            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  setTypeFilters((current) => toggleFilter(current, option.id))
                }
                className={cn(
                  'shrink-0 rounded-full px-3 py-1.5 text-sub3 font-medium transition-colors',
                  isActive
                    ? 'bg-backgroundDark-200 text-white'
                    : 'bg-base-200 text-base-600 hover:bg-base-300',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <DataQueryStates
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => {
          void refetch()
        }}
        errorMessage="Unable to load rooms. Please try again."
        isEmpty={Boolean(data && data.rooms.length === 0)}
        emptyTitle="No rooms found."
        emptyDescription="Try a different search or clear your filters."
        isFetching={isFetching}
      >
        {data ? (
          <RoomsTable
            rooms={data.rooms}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        ) : null}
      </DataQueryStates>
    </DarkPageShell>
  )
}

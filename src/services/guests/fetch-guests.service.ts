import type { ApiResponse } from '@/types/api'
import type {
  Guest,
  GuestSortKey,
  GuestsData,
  GuestsQueryParams,
} from '@/features/guests/types/guest.types'
import { getGuestsStore } from '@/mocks/guests.store'
import {
  assertMockApiOk,
} from '@/utils/mock-api'

const MOCK_DELAY_MS = 350

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function compareGuests(
  a: Guest,
  b: Guest,
  sortBy: GuestSortKey,
  direction: 'asc' | 'desc',
): number {
  const factor = direction === 'asc' ? 1 : -1

  switch (sortBy) {
    case 'totalStays':
      return (a.totalStays - b.totalStays) * factor
    case 'lastCheckIn':
    case 'createdAt':
    case 'checkIn':
    case 'checkOut':
      return (
        (new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime()) * factor
      )
    default: {
      const left = String(a[sortBy]).toLowerCase()
      const right = String(b[sortBy]).toLowerCase()
      return left.localeCompare(right) * factor
    }
  }
}

/**
 * Fetch guests with optional multi-status filter and sorting.
 * Currently served from mock data.
 */
export async function fetchGuests(
  params: GuestsQueryParams = {},
): Promise<ApiResponse<GuestsData>> {
  await delay(MOCK_DELAY_MS)
  assertMockApiOk('Unable to load guests. Please try again.')

  const {
    statuses = [],
    sortBy = 'createdAt',
    sortDirection = 'desc',
  } = params

  let guests = [...getGuestsStore()]

  if (statuses.length > 0) {
    const selected = new Set(statuses)
    guests = guests.filter((guest) => selected.has(guest.status))
  }

  guests.sort((a, b) => compareGuests(a, b, sortBy, sortDirection))

  return {
    success: true,
    data: { guests },
    message: 'Guests fetched successfully',
  }
}

export default fetchGuests

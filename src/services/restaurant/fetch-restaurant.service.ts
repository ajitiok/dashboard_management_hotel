import type { ApiResponse } from '@/types/api'
import type {
  RestaurantBooking,
  RestaurantData,
  RestaurantQueryParams,
  RestaurantSortKey,
} from '@/features/restaurant/types/restaurant.types'
import { restaurantMock } from '@/mocks/restaurant.mock'
import {
  assertMockApiOk,
} from '@/utils/mock-api'

const MOCK_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function matchesSearch(booking: RestaurantBooking, search: string): boolean {
  const q = search.trim().toLowerCase()
  if (!q) return true

  return (
    booking.id.toLowerCase().includes(q) ||
    booking.guestName.toLowerCase().includes(q) ||
    booking.tableNumber.toLowerCase().includes(q)
  )
}

function compareBookings(
  a: RestaurantBooking,
  b: RestaurantBooking,
  sortBy: RestaurantSortKey,
  direction: 'asc' | 'desc',
): number {
  const factor = direction === 'asc' ? 1 : -1

  switch (sortBy) {
    case 'partySize':
      return (a.partySize - b.partySize) * factor
    case 'reservationTime':
    case 'createdAt':
      return (
        (new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime()) * factor
      )
    default:
      return String(a[sortBy]).localeCompare(String(b[sortBy])) * factor
  }
}

export async function fetchRestaurantBookings(
  params: RestaurantQueryParams = {},
): Promise<ApiResponse<RestaurantData>> {
  await delay(MOCK_DELAY_MS)
  assertMockApiOk('Unable to load restaurant bookings. Please try again.')

  const {
    search = '',
    statuses = [],
    sortBy = 'reservationTime',
    sortDirection = 'asc',
  } = params

  let bookings = [...restaurantMock]

  if (search.trim()) {
    bookings = bookings.filter((booking) => matchesSearch(booking, search))
  }

  if (statuses.length > 0) {
    const selected = new Set(statuses)
    bookings = bookings.filter((booking) => selected.has(booking.status))
  }

  bookings.sort((a, b) => compareBookings(a, b, sortBy, sortDirection))

  return {
    success: true,
    data: { bookings },
    message: 'Restaurant bookings fetched successfully',
  }
}

export default fetchRestaurantBookings

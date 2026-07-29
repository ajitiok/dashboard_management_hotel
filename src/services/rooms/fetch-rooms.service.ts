import type { ApiResponse } from '@/types/api'
import type {
  Room,
  RoomSortKey,
  RoomsData,
  RoomsQueryParams,
} from '@/features/rooms/types/room.types'
import { roomsMock } from '@/mocks/rooms.mock'
import {
  assertMockApiOk,
} from '@/utils/mock-api'

const MOCK_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function matchesSearch(room: Room, search: string): boolean {
  const q = search.trim().toLowerCase()
  if (!q) return true

  return (
    room.number.toLowerCase().includes(q) ||
    room.name.toLowerCase().includes(q) ||
    room.type.toLowerCase().includes(q) ||
    room.id.toLowerCase().includes(q) ||
    String(room.floor).includes(q)
  )
}

function compareRooms(
  a: Room,
  b: Room,
  sortBy: RoomSortKey,
  direction: 'asc' | 'desc',
): number {
  const factor = direction === 'asc' ? 1 : -1

  switch (sortBy) {
    case 'floor':
    case 'capacity':
    case 'pricePerNight':
      return (a[sortBy] - b[sortBy]) * factor
    case 'lastCleanedAt':
      return (
        (new Date(a.lastCleanedAt).getTime() -
          new Date(b.lastCleanedAt).getTime()) *
        factor
      )
    default: {
      return String(a[sortBy]).localeCompare(String(b[sortBy])) * factor
    }
  }
}

export async function fetchRooms(
  params: RoomsQueryParams = {},
): Promise<ApiResponse<RoomsData>> {
  await delay(MOCK_DELAY_MS)
  assertMockApiOk('Unable to load rooms. Please try again.')

  const {
    search = '',
    statuses = [],
    types = [],
    sortBy = 'number',
    sortDirection = 'asc',
  } = params

  let rooms = [...roomsMock]

  if (search.trim()) {
    rooms = rooms.filter((room) => matchesSearch(room, search))
  }

  if (statuses.length > 0) {
    const selected = new Set(statuses)
    rooms = rooms.filter((room) => selected.has(room.status))
  }

  if (types.length > 0) {
    const selected = new Set(types)
    rooms = rooms.filter((room) => selected.has(room.type))
  }

  rooms.sort((a, b) => compareRooms(a, b, sortBy, sortDirection))

  return {
    success: true,
    data: { rooms },
    message: 'Rooms fetched successfully',
  }
}

export default fetchRooms

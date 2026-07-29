import type { ApiResponse } from '@/types/api'
import type { Room } from '@/features/rooms/types/room.types'
import { roomsMock } from '@/mocks/rooms.mock'
import {
  assertMockApiOk,
} from '@/utils/mock-api'

const MOCK_DELAY_MS = 250

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function fetchRoomById(
  roomId: string,
): Promise<ApiResponse<Room | null>> {
  await delay(MOCK_DELAY_MS)
  assertMockApiOk('Unable to load room details. Please try again.')

  const room = roomsMock.find((item) => item.id === roomId) ?? null

  return {
    success: true,
    data: room,
    message: room ? 'Room fetched successfully' : 'Room not found',
  }
}

export default fetchRoomById

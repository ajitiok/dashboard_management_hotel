import type { ApiResponse } from '@/types/api'
import type {
  CreateGuestInput,
  Guest,
} from '@/features/guests/types/guest.types'
import {
  nextGuestId,
  prependGuest,
} from '@/mocks/guests.store'

const MOCK_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function toIsoAtHour(dateValue: string, hour: number): string {
  const date = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

/**
 * Create a new guest reservation (mock-backed, session-persisted).
 */
export async function createGuest(
  input: CreateGuestInput,
): Promise<ApiResponse<Guest>> {
  await delay(MOCK_DELAY_MS)

  const name = input.name.trim()
  const email = input.email.trim()
  const phone = input.phone.trim()
  const roomNumber = input.roomNumber.trim()
  const roomType = input.roomType.trim()
  const nationality = input.nationality.trim()

  if (!name || !email || !phone || !roomNumber || !roomType || !nationality) {
    return {
      success: false,
      data: null as unknown as Guest,
      message: 'Please fill in all required fields.',
    }
  }

  if (!input.checkIn || !input.checkOut) {
    return {
      success: false,
      data: null as unknown as Guest,
      message: 'Check-in and check-out dates are required.',
    }
  }

  const checkIn = toIsoAtHour(input.checkIn, 14)
  const checkOut = toIsoAtHour(input.checkOut, 11)

  if (new Date(checkOut).getTime() <= new Date(checkIn).getTime()) {
    return {
      success: false,
      data: null as unknown as Guest,
      message: 'Check-out must be after check-in.',
    }
  }

  const avatarSeed = Math.floor(Math.random() * 70) + 1
  const guest: Guest = {
    id: nextGuestId(),
    name,
    avatar: `https://i.pravatar.cc/64?img=${avatarSeed}`,
    email,
    phone,
    roomNumber,
    roomType,
    nationality,
    status: 'New',
    totalStays: 1,
    checkIn,
    checkOut,
    lastCheckIn: checkIn,
    createdAt: new Date().toISOString(),
  }

  prependGuest(guest)

  return {
    success: true,
    data: guest,
    message: 'Guest created successfully',
  }
}

export default createGuest

import type { Guest } from '@/features/guests/types/guest.types'
import { guestsMock } from '@/mocks/guests.mock'

/** In-memory mock store so guest creates persist during the session. */
let guestsStore: Guest[] = structuredClone(guestsMock)
let guestSeq = 1010

export function getGuestsStore(): Guest[] {
  return guestsStore
}

export function resetGuestsStore(): void {
  guestsStore = structuredClone(guestsMock)
  guestSeq = 1010
}

export function prependGuest(guest: Guest): Guest {
  guestsStore = [guest, ...guestsStore]
  return guest
}

export function nextGuestId(): string {
  guestSeq += 1
  return `GST-${guestSeq}`
}

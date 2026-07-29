export type GuestStatus =
  | 'New'
  | 'Checked In'
  | 'Confirmed'
  | 'Checked Out'
  | 'Completed'
  | 'Cancelled'

export type Guest = {
  id: string
  name: string
  avatar: string
  email: string
  phone: string
  roomNumber: string
  roomType: string
  nationality: string
  status: GuestStatus
  totalStays: number
  /** ISO date — stay start */
  checkIn: string
  /** ISO date — stay end */
  checkOut: string
  lastCheckIn: string
  createdAt: string
}

export type GuestSortKey =
  | 'name'
  | 'email'
  | 'roomNumber'
  | 'status'
  | 'lastCheckIn'
  | 'totalStays'
  | 'createdAt'
  | 'checkIn'
  | 'checkOut'

export type GuestSortDirection = 'asc' | 'desc'

export type GuestsQueryParams = {
  statuses?: GuestStatus[]
  sortBy?: GuestSortKey
  sortDirection?: GuestSortDirection
}

export type GuestsData = {
  guests: Guest[]
}

export type CreateGuestInput = {
  name: string
  email: string
  phone: string
  roomNumber: string
  roomType: string
  nationality: string
  checkIn: string
  checkOut: string
}

export const GUEST_ROOM_TYPES = [
  'Single',
  'Double',
  'Deluxe',
  'Suite',
] as const

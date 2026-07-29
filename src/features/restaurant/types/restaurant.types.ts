export type RestaurantBookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Seated'
  | 'Completed'
  | 'Cancelled'

export type RestaurantBooking = {
  id: string
  guestName: string
  tableNumber: string
  partySize: number
  reservationTime: string
  status: RestaurantBookingStatus
  specialRequest: string
  createdAt: string
}

export type RestaurantSortKey =
  | 'guestName'
  | 'tableNumber'
  | 'partySize'
  | 'reservationTime'
  | 'status'
  | 'createdAt'

export type RestaurantSortDirection = 'asc' | 'desc'

export type RestaurantQueryParams = {
  search?: string
  statuses?: RestaurantBookingStatus[]
  sortBy?: RestaurantSortKey
  sortDirection?: RestaurantSortDirection
}

export type RestaurantData = {
  bookings: RestaurantBooking[]
}

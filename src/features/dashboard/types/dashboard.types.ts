export type BookingStatus =
  | 'New'
  | 'Checked In'
  | 'Confirmed'
  | 'Checked Out'
  | 'Cancelled'

export type BookingRow = {
  id: string
  guestName: string
  guestAvatar: string
  email: string
  roomNumber: string
  roomType: string
  checkedIn: string
  checkedOut: string
  status: BookingStatus
}

export type MetricCardData = {
  title: string
  subtitle: string
  value: string
  delta: string
  trend: 'up' | 'down'
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded'

export type PaymentStatusItem = {
  id: string
  guestName: string
  amount: number
  method: string
  status: PaymentStatus
  /** ISO date string — used to sort latest payments */
  createdAt: string
}

export type TopService = {
  label: string
  percent: number
  color: string
}

export type DashboardData = {
  metrics: MetricCardData[]
  bookings: BookingRow[]
  paymentStatuses: PaymentStatusItem[]
  topServices: TopService[]
}

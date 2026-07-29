export const RESERVATION_STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New', dotClassName: 'bg-primary-500' },
  { id: 'confirmed', label: 'Confirmed', dotClassName: 'bg-success-500' },
  { id: 'checked-in', label: 'Checked In', dotClassName: 'bg-warning-600' },
  { id: 'checked-out', label: 'Checked Out', dotClassName: 'bg-tertiary-500' },
  { id: 'completed', label: 'Completed', dotClassName: 'bg-base-400' },
  { id: 'cancelled', label: 'Cancelled', dotClassName: 'bg-danger-500' },
] as const

export const GUEST_STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'New', label: 'New', dotClassName: 'bg-primary-500' },
  { id: 'Confirmed', label: 'Confirmed', dotClassName: 'bg-success-500' },
  { id: 'Checked In', label: 'Checked In', dotClassName: 'bg-warning-600' },
  { id: 'Checked Out', label: 'Checked Out', dotClassName: 'bg-tertiary-500' },
  { id: 'Completed', label: 'Completed', dotClassName: 'bg-base-400' },
  { id: 'Cancelled', label: 'Cancelled', dotClassName: 'bg-danger-500' },
] as const

export const ORDER_STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'New', label: 'New', dotClassName: 'bg-primary-500' },
  {
    id: 'Pending Approval',
    label: 'Pending Approval',
    dotClassName: 'bg-warning-500',
  },
  { id: 'Acknowledged', label: 'Acknowledged', dotClassName: 'bg-tertiary-500' },
  { id: 'In Progress', label: 'In Progress', dotClassName: 'bg-warning-600' },
  { id: 'Completed', label: 'Completed', dotClassName: 'bg-success-500' },
  { id: 'Cancelled', label: 'Cancelled', dotClassName: 'bg-danger-500' },
] as const

export const ORDER_SERVICE_FILTERS = [
  { id: 'all', label: 'All services' },
  { id: 'Room Service', label: 'Room Service' },
  { id: 'Housekeeping', label: 'Housekeeping' },
  { id: 'Laundry', label: 'Laundry' },
  { id: 'Extra Bed', label: 'Extra Bed' },
  { id: 'Spa & Massage', label: 'Spa & Massage' },
] as const

export const ROOM_STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'Available', label: 'Available', dotClassName: 'bg-success-500' },
  { id: 'Occupied', label: 'Occupied', dotClassName: 'bg-tertiary-500' },
  { id: 'Cleaning', label: 'To clean', dotClassName: 'bg-tertiary-500' },
  { id: 'Maintenance', label: 'Maintenance', dotClassName: 'bg-warning-500' },
  { id: 'Out of Order', label: 'Out of Order', dotClassName: 'bg-danger-500' },
] as const

export const ROOM_TYPE_FILTERS = [
  { id: 'all', label: 'All types' },
  { id: 'Single', label: 'Single' },
  { id: 'Double', label: 'Double' },
  { id: 'Deluxe', label: 'Deluxe' },
  { id: 'Suite', label: 'Suite' },
] as const

export const RESTAURANT_STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'Pending', label: 'Pending', dotClassName: 'bg-warning-600' },
  { id: 'Confirmed', label: 'Confirmed', dotClassName: 'bg-tertiary-500' },
  { id: 'Seated', label: 'Seated', dotClassName: 'bg-primary-500' },
  { id: 'Completed', label: 'Completed', dotClassName: 'bg-success-500' },
  { id: 'Cancelled', label: 'Cancelled', dotClassName: 'bg-danger-500' },
] as const

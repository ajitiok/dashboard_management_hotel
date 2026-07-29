export type RoomStatus =
  | 'Available'
  | 'Occupied'
  | 'Cleaning'
  | 'Maintenance'
  | 'Out of Order'

export type RoomType = 'Single' | 'Double' | 'Deluxe' | 'Suite'

export type RoomSpaceFeature = {
  id: string
  label: string
  icon: 'bed' | 'bath' | 'area' | 'location' | 'view'
}

export type RoomHistoryItem = {
  id: string
  title: string
  description: string
  timestamp: string
  highlight?: boolean
}

export type RoomReview = {
  id: string
  author: string
  rating: number
  comment: string
  createdAt: string
}

export type RoomStatistic = {
  label: string
  value: string
}

export type Room = {
  id: string
  name: string
  number: string
  type: RoomType
  floor: number
  capacity: number
  pricePerNight: number
  status: RoomStatus
  amenities: string[]
  images: string[]
  description: string
  spaceFeatures: RoomSpaceFeature[]
  lastCleanedAt: string
  lastMaintenanceAt: string
  history: RoomHistoryItem[]
  reviews: RoomReview[]
  statistics: RoomStatistic[]
}

export type RoomSortKey =
  | 'number'
  | 'name'
  | 'type'
  | 'floor'
  | 'capacity'
  | 'pricePerNight'
  | 'status'
  | 'lastCleanedAt'

export type RoomSortDirection = 'asc' | 'desc'

export type RoomsQueryParams = {
  search?: string
  statuses?: RoomStatus[]
  types?: RoomType[]
  sortBy?: RoomSortKey
  sortDirection?: RoomSortDirection
}

export type RoomsData = {
  rooms: Room[]
}

export const ROOM_STATUS_LABEL: Record<RoomStatus, string> = {
  Available: 'Available',
  Occupied: 'Occupied',
  Cleaning: 'To clean',
  Maintenance: 'Maintenance',
  'Out of Order': 'Out of Order',
}

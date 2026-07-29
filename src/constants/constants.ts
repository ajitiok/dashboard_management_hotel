export const APP_NAME = 'Hotel Dashboard'

export const ROUTES = {
  root: '/',
  login: '/login',
  dashboard: '/dashboard',
  guests: '/guests',
  orders: '/orders',
  rooms: '/rooms',
  restaurant: '/restaurant',
} as const

export const NAV_ITEMS = [
  { label: 'Dashboard', to: ROUTES.dashboard },
  { label: 'Guests', to: ROUTES.guests },
  { label: 'Orders', to: ROUTES.orders },
  { label: 'Rooms', to: ROUTES.rooms },
  { label: 'Restaurant', to: ROUTES.restaurant },
] as const

export const QUERY_KEYS = {
  dashboard: ['dashboard'] as const,
  guests: ['guests'] as const,
  orders: ['orders'] as const,
  rooms: ['rooms'] as const,
  restaurant: ['restaurant'] as const,
} as const

export const DEFAULT_PAGE_SIZE = 10

import type { ApiResponse } from '@/types/api'
import type {
  OrdersData,
  OrdersQueryParams,
} from '@/features/orders/types/order.types'
import { getOrdersStore } from '@/mocks/orders.store'
import { DEFAULT_PAGE_SIZE } from '@/constants'
import { assertMockApiOk } from '@/utils/mock-api'

const MOCK_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function matchesSearch(
  order: { id: string; guestName: string; roomNumber: string },
  search: string,
): boolean {
  const q = search.trim().toLowerCase()
  if (!q) return true

  return (
    order.id.toLowerCase().includes(q) ||
    order.guestName.toLowerCase().includes(q) ||
    order.roomNumber.toLowerCase().includes(q)
  )
}

/**
 * Fetch guest service orders with search, filters, sorting, and pagination.
 */
export async function fetchOrders(
  params: OrdersQueryParams = {},
): Promise<ApiResponse<OrdersData>> {
  await delay(MOCK_DELAY_MS)
  assertMockApiOk('Unable to load orders. Please try again.')

  const {
    search = '',
    statuses = [],
    services = [],
    sort = 'newest',
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = params

  let orders = [...getOrdersStore()]

  if (search.trim()) {
    orders = orders.filter((order) => matchesSearch(order, search))
  }

  if (statuses.length > 0) {
    const selected = new Set(statuses)
    orders = orders.filter((order) => selected.has(order.status))
  }

  if (services.length > 0) {
    const selected = new Set(services)
    orders = orders.filter((order) => selected.has(order.service))
  }

  orders.sort((a, b) => {
    const diff =
      new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime()
    return sort === 'oldest' ? diff : -diff
  })

  const total = orders.length
  const safePageSize = Math.max(1, pageSize)
  const totalPages = Math.max(1, Math.ceil(total / safePageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * safePageSize
  const pageOrders = orders.slice(start, start + safePageSize)

  return {
    success: true,
    data: {
      orders: pageOrders,
      total,
      page: safePage,
      pageSize: safePageSize,
    },
    message: 'Orders fetched successfully',
  }
}

export default fetchOrders

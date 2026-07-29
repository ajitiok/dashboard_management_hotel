import type { Order } from '@/features/orders/types/order.types'
import { resolveInitialOrderStatus } from '@/features/orders/types/order.types'
import type { ServiceType } from '@/features/orders/types/order.types'
import { ordersMock } from '@/mocks/orders.mock'

/** In-memory mock store so status updates persist during the session. */
let ordersStore: Order[] = structuredClone(ordersMock)
let orderSeq = 2100

export function getOrdersStore(): Order[] {
  return ordersStore
}

export function resetOrdersStore(): void {
  ordersStore = structuredClone(ordersMock)
  orderSeq = 2100
}

export function findOrderById(id: string): Order | undefined {
  return ordersStore.find((order) => order.id === id)
}

export function replaceOrder(updated: Order): Order {
  ordersStore = ordersStore.map((order) =>
    order.id === updated.id ? updated : order,
  )
  return updated
}

export function prependOrder(order: Order): Order {
  ordersStore = [order, ...ordersStore]
  return order
}

const GUEST_POOL = [
  'Ava Morgan',
  'Ben Carter',
  'Chloe Nguyen',
  'Diego Alvarez',
  'Emma Brooks',
  'Felix Hart',
]

const SERVICE_POOL: ServiceType[] = [
  'Room Service',
  'Housekeeping',
  'Laundry',
  'Extra Bed',
  'Spa & Massage',
]

const ROOM_POOL = [
  { number: '101', capacity: 1 },
  { number: '204', capacity: 2 },
  { number: '312', capacity: 3 },
  { number: '418', capacity: 2 },
  { number: '508', capacity: 4 },
]

/** Simulate a newly arrived guest service request. */
export function createSimulatedIncomingOrder(): Order {
  orderSeq += 1
  const room = ROOM_POOL[orderSeq % ROOM_POOL.length] ?? {
    number: '101',
    capacity: 1,
  }
  const service: ServiceType =
    orderSeq % 3 === 0
      ? 'Extra Bed'
      : (SERVICE_POOL[orderSeq % SERVICE_POOL.length] ?? 'Room Service')
  const quantity = service === 'Extra Bed' ? (orderSeq % 2 === 0 ? 2 : 1) : 1
  const resolved = resolveInitialOrderStatus({
    service,
    quantity,
    roomCapacity: room.capacity,
  })

  const order: Order = {
    id: `ORD-${orderSeq}`,
    guestName: GUEST_POOL[orderSeq % GUEST_POOL.length] ?? 'Walk-in Guest',
    roomNumber: room.number,
    service,
    quantity,
    roomCapacity: room.capacity,
    specialRequest: resolved.requiresApproval
      ? 'Extra bed exceeds room capacity — manager approval required'
      : 'Guest request via in-room tablet',
    orderTime: new Date().toISOString(),
    status: resolved.status,
    paymentStatus: 'Pending',
    requiresApproval: resolved.requiresApproval,
  }

  return prependOrder(order)
}

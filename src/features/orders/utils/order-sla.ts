import type { Order } from '@/features/orders/types/order.types'

/** Orders in New status older than this threshold are SLA overdue. */
export const ORDER_SLA_MINUTES = 15

export function getOrderAgeMinutes(
  orderTime: string,
  now: Date = new Date(),
): number {
  const created = new Date(orderTime).getTime()
  return Math.floor((now.getTime() - created) / (60 * 1000))
}

/**
 * New orders waiting longer than 15 minutes should be highlighted.
 */
export function isOrderSlaOverdue(
  order: Pick<Order, 'status' | 'orderTime'>,
  now: Date = new Date(),
): boolean {
  if (order.status !== 'New') {
    return false
  }

  return getOrderAgeMinutes(order.orderTime, now) > ORDER_SLA_MINUTES
}

import type { ApiResponse } from '@/types/api'
import type {
  Order,
  OrderStatusAction,
} from '@/features/orders/types/order.types'
import { ORDER_STATUS_TRANSITIONS } from '@/features/orders/types/order.types'
import { findOrderById, replaceOrder } from '@/mocks/orders.store'
import { trackEvent } from '@/utils/analytics'

const MOCK_DELAY_MS = 250

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Advance / cancel / approve an order through the status lifecycle.
 */
export async function updateOrderStatus(
  orderId: string,
  action: OrderStatusAction,
): Promise<ApiResponse<Order>> {
  await delay(MOCK_DELAY_MS)

  const order = findOrderById(orderId)

  if (!order) {
    return {
      success: false,
      data: null as unknown as Order,
      message: 'Order not found',
    }
  }

  const rule = ORDER_STATUS_TRANSITIONS[action]

  if (!rule.from.includes(order.status)) {
    return {
      success: false,
      data: order,
      message: `Cannot ${rule.label.toLowerCase()} an order with status "${order.status}"`,
    }
  }

  const updated = replaceOrder({
    ...order,
    status: rule.to,
    requiresApproval:
      action === 'approve' || action === 'reject'
        ? false
        : order.requiresApproval,
  })

  trackEvent('order.status_updated', {
    orderId: updated.id,
    action,
    status: updated.status,
  })

  return {
    success: true,
    data: updated,
    message: `Order ${updated.id} is now ${updated.status}`,
  }
}

export default updateOrderStatus

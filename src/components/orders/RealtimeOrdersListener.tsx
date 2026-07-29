import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants'
import { createSimulatedIncomingOrder } from '@/mocks/orders.store'
import { useAuthStore } from '@/store/auth.store'
import { trackEvent } from '@/utils/analytics'

const INTERVAL_MS = 45_000
const FIRST_DELAY_MS = 18_000

/**
 * Simulates live incoming orders while the authenticated app is open.
 */
export function RealtimeOrdersListener() {
  const queryClient = useQueryClient()
  const isAuthenticated = useAuthStore((state) =>
    Boolean(state.token && state.user),
  )
  const started = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) return

    const pushOrder = () => {
      const order = createSimulatedIncomingOrder()

      trackEvent('order.realtime_received', {
        orderId: order.id,
        service: order.service,
        status: order.status,
      })

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders })

      toast.message(
        order.requiresApproval
          ? `Approval needed: ${order.service}`
          : `New order: ${order.service}`,
        {
          description: `${order.guestName} · Room ${order.roomNumber} · ${order.id}`,
          duration: 6000,
        },
      )
    }

    // Avoid double-start under React Strict Mode remounts within the same session tick
    if (started.current) return
    started.current = true

    const firstTimer = window.setTimeout(pushOrder, FIRST_DELAY_MS)
    const interval = window.setInterval(pushOrder, INTERVAL_MS)

    return () => {
      window.clearTimeout(firstTimer)
      window.clearInterval(interval)
      started.current = false
    }
  }, [isAuthenticated, queryClient])

  return null
}

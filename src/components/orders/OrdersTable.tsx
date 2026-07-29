import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Badge from '@/components/core/Badge'
import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from '@/features/orders/types/order.types'
import {
  getOrderAgeMinutes,
  isOrderSlaOverdue,
  ORDER_SLA_MINUTES,
} from '@/features/orders/utils/order-sla'
import { EmptyState } from '@/components/condition'
import { formatDate, cn } from '@/utils'

const ORDER_STATUS_STYLES: Record<
  OrderStatus,
  { bgColor: string; textColor: string }
> = {
  New: { bgColor: '#EDE9FE', textColor: '#6D28D9' },
  'Pending Approval': { bgColor: '#FEF3C7', textColor: '#B45309' },
  Acknowledged: { bgColor: '#DBEAFE', textColor: '#1D4ED8' },
  'In Progress': { bgColor: '#FFEDD5', textColor: '#C2410C' },
  Completed: { bgColor: '#DCFCE7', textColor: '#15803D' },
  Cancelled: { bgColor: '#FFE4E6', textColor: '#BE123C' },
}

const PAYMENT_STATUS_STYLES: Record<
  PaymentStatus,
  { bgColor: string; textColor: string }
> = {
  Paid: { bgColor: '#DCFCE7', textColor: '#15803D' },
  Pending: { bgColor: '#FFEDD5', textColor: '#C2410C' },
  Failed: { bgColor: '#FFE4E6', textColor: '#BE123C' },
}

type OrdersTableProps = {
  orders: Order[]
  onSelectOrder: (order: Order) => void
}

export function OrdersTable({ orders, onSelectOrder }: OrdersTableProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 30_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders found."
        description="Try a different search or clear your filters."
        className="border-0 bg-transparent py-10"
      />
    )
  }

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full min-w-180 border-collapse text-left">
        <thead>
          <tr className="text-sub4 font-medium uppercase tracking-wide text-base-500">
            <th className="pb-3 pr-3 font-medium">Order ID</th>
            <th className="pb-3 pr-3 font-medium">Guest</th>
            <th className="pb-3 pr-3 font-medium">Room</th>
            <th className="pb-3 pr-3 font-medium">Service</th>
            <th className="pb-3 pr-3 font-medium">Qty</th>
            <th className="pb-3 pr-3 font-medium">Order time</th>
            <th className="pb-3 pr-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Payment</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
              const statusStyle = ORDER_STATUS_STYLES[order.status]
              const paymentStyle = PAYMENT_STATUS_STYLES[order.paymentStatus]
              const slaOverdue = isOrderSlaOverdue(order, now)
              const ageMinutes = getOrderAgeMinutes(order.orderTime, now)

              return (
                <tr
                  key={order.id}
                  className={cn(
                    'cursor-pointer border-t text-sub3 transition-colors',
                    slaOverdue
                      ? 'border-l-4 border-l-danger-600 border-t-danger-500/20 bg-softColors-6/80 text-base-900 hover:bg-softColors-6'
                      : 'border-border text-base-800 hover:bg-base-100',
                  )}
                  onClick={() => onSelectOrder(order)}
                >
                  <td className="py-3.5 pr-3 font-medium text-base-900">
                    <div className="flex items-center gap-2">
                      {slaOverdue ? (
                        <AlertTriangle
                          className="h-4 w-4 shrink-0 text-danger-600"
                          aria-hidden
                        />
                      ) : null}
                      <span>{order.id}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 font-medium text-base-900">
                    {order.guestName}
                  </td>
                  <td className="py-3.5 pr-3">{order.roomNumber}</td>
                  <td className="py-3.5 pr-3">{order.service}</td>
                  <td className="py-3.5 pr-3">{order.quantity}</td>
                  <td className="py-3.5 pr-3 text-base-600">
                    <div className="flex flex-col gap-0.5">
                      <span>{formatDate(order.orderTime, 'MMM d, HH:mm')}</span>
                      {slaOverdue ? (
                        <span className="text-sub4 font-semibold text-danger-600">
                          Waiting {ageMinutes}m (SLA {ORDER_SLA_MINUTES}m)
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge
                        size="xs"
                        label={order.status}
                        bgColor={statusStyle.bgColor}
                        textColor={statusStyle.textColor}
                        className="inline-flex font-medium whitespace-nowrap"
                      />
                      {slaOverdue ? (
                        <Badge
                          size="xs"
                          label="SLA"
                          bgColor="#FFE4E6"
                          textColor="#BE123C"
                          className="inline-flex font-semibold whitespace-nowrap"
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3.5">
                    <Badge
                      size="xs"
                      label={order.paymentStatus}
                      bgColor={paymentStyle.bgColor}
                      textColor={paymentStyle.textColor}
                      className="inline-flex font-medium whitespace-nowrap"
                    />
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

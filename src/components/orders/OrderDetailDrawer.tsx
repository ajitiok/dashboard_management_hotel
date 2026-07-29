import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, X } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/core/Button'
import Badge from '@/components/core/Badge'
import { QUERY_KEYS } from '@/constants'
import type {
  Order,
  OrderStatus,
  OrderStatusAction,
  OrdersData,
  PaymentStatus,
} from '@/features/orders/types/order.types'
import {
  ORDER_STATUS_TRANSITIONS,
  getAvailableOrderActions,
} from '@/features/orders/types/order.types'
import {
  getOrderAgeMinutes,
  isOrderSlaOverdue,
  ORDER_SLA_MINUTES,
} from '@/features/orders/utils/order-sla'
import { updateOrderStatus } from '@/services/orders/update-order-status.service.ts'
import { formatDate, cn } from '@/utils'
import { trackEvent } from '@/utils/analytics'

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

type OrderDetailDrawerProps = {
  order: Order | null
  open: boolean
  onClose: () => void
  onOrderUpdated?: (order: Order) => void
}

export function OrderDetailDrawer({
  order,
  open,
  onClose,
  onOrderUpdated,
}: OrderDetailDrawerProps) {
  const queryClient = useQueryClient()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [confirmReject, setConfirmReject] = useState(false)

  const mutation = useMutation({
    mutationFn: async (action: OrderStatusAction) => {
      if (!order) {
        throw new Error('No order selected')
      }

      const response = await updateOrderStatus(order.id, action)

      if (!response.success) {
        throw new Error(response.message ?? 'Failed to update order')
      }

      return response
    },
    onMutate: async (action) => {
      if (!order) return

      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.orders })

      const previous = queryClient.getQueriesData<OrdersData>({
        queryKey: QUERY_KEYS.orders,
      })

      const rule = ORDER_STATUS_TRANSITIONS[action]
      const optimistic: Order = {
        ...order,
        status: rule.to,
        requiresApproval:
          action === 'approve' || action === 'reject'
            ? false
            : order.requiresApproval,
      }

      queryClient.setQueriesData<OrdersData>(
        { queryKey: QUERY_KEYS.orders },
        (current) => {
          if (!current) return current
          return {
            ...current,
            orders: current.orders.map((item) =>
              item.id === optimistic.id ? optimistic : item,
            ),
          }
        },
      )

      onOrderUpdated?.(optimistic)
      return { previous }
    },
    onError: (error, _action, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
      toast.error(error instanceof Error ? error.message : 'Update failed')
    },
    onSuccess: (response) => {
      toast.success(response.message ?? 'Order updated')
      if (response.data) {
        onOrderUpdated?.(response.data)
      }
      setConfirmCancel(false)
      setConfirmReject(false)
      onClose()
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders })
    },
  })

  if (!open || !order) {
    return null
  }

  const actions = getAvailableOrderActions(order.status)
  const statusStyle = ORDER_STATUS_STYLES[order.status]
  const paymentStyle = PAYMENT_STATUS_STYLES[order.paymentStatus]
  const slaOverdue = isOrderSlaOverdue(order)
  const ageMinutes = getOrderAgeMinutes(order.orderTime)

  const handleAction = (action: OrderStatusAction) => {
    trackEvent('order.action_clicked', {
      orderId: order.id,
      action,
    })

    if (action === 'cancel') {
      setConfirmCancel(true)
      return
    }

    if (action === 'reject') {
      setConfirmReject(true)
      return
    }

    mutation.mutate(action)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close order details"
        className="absolute inset-0 bg-backgroundDark-300/40"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-base-100 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <p className="text-sub3 font-medium text-base-500">Order details</p>
            <h2
              id="order-detail-title"
              className="text-h5 font-bold text-base-900"
            >
              {order.id}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-2 text-base-500 hover:bg-base-200 hover:text-base-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {order.status === 'Pending Approval' ? (
            <div className="flex items-start gap-3 rounded-2xl border border-warning-600/30 bg-softColors-5 px-4 py-3 text-warning-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-sub2 font-semibold">Pending approval</p>
                <p className="mt-0.5 text-sub3 text-warning-700/90">
                  Extra Bed quantity ({order.quantity}) exceeds room capacity (
                  {order.roomCapacity}). Approve or reject this request.
                </p>
              </div>
            </div>
          ) : null}

          {slaOverdue ? (
            <div className="flex items-start gap-3 rounded-2xl border border-danger-500/30 bg-softColors-6 px-4 py-3 text-danger-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-sub2 font-semibold">SLA breached</p>
                <p className="mt-0.5 text-sub3 text-danger-600/90">
                  This New order has been waiting {ageMinutes} minutes (limit{' '}
                  {ORDER_SLA_MINUTES}m). Acknowledge it soon.
                </p>
              </div>
            </div>
          ) : null}

          <DetailRow label="Guest name" value={order.guestName} />
          <DetailRow label="Room number" value={order.roomNumber} />
          <DetailRow label="Room capacity" value={String(order.roomCapacity)} />
          <DetailRow label="Service" value={order.service} />
          <DetailRow label="Quantity" value={String(order.quantity)} />
          <DetailRow
            label="Special request"
            value={order.specialRequest || '—'}
          />
          <DetailRow
            label="Order time"
            value={formatDate(order.orderTime, 'MMM d, yyyy HH:mm')}
          />

          <div>
            <p className="mb-1.5 text-sub3 text-base-500">Order status</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                size="s"
                label={order.status}
                bgColor={statusStyle.bgColor}
                textColor={statusStyle.textColor}
                className="inline-flex font-medium"
              />
              {slaOverdue ? (
                <Badge
                  size="s"
                  label="SLA overdue"
                  bgColor="#FFE4E6"
                  textColor="#BE123C"
                  className="inline-flex font-semibold"
                />
              ) : null}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sub3 text-base-500">Payment status</p>
            <Badge
              size="s"
              label={order.paymentStatus}
              bgColor={paymentStyle.bgColor}
              textColor={paymentStyle.textColor}
              className="inline-flex font-medium"
            />
          </div>

          {confirmCancel ? (
            <ConfirmBox
              title="Cancel this order?"
              description="This action cannot be undone. The order will move to Cancelled."
              confirmLabel="Confirm cancel"
              onKeep={() => setConfirmCancel(false)}
              onConfirm={() => mutation.mutate('cancel')}
              loading={mutation.isPending}
            />
          ) : null}

          {confirmReject ? (
            <ConfirmBox
              title="Reject Extra Bed request?"
              description="The guest request will be cancelled and no Extra Bed will be placed."
              confirmLabel="Confirm reject"
              onKeep={() => setConfirmReject(false)}
              onConfirm={() => mutation.mutate('reject')}
              loading={mutation.isPending}
            />
          ) : null}
        </div>

        {!confirmCancel && !confirmReject && actions.length > 0 ? (
          <div className="space-y-2 border-t border-border px-5 py-4">
            <p className="text-sub3 font-medium text-base-500">Actions</p>
            <div className="flex flex-wrap gap-2">
              {actions.map((action) => {
                const rule = ORDER_STATUS_TRANSITIONS[action]
                const isDanger = action === 'cancel' || action === 'reject'

                return (
                  <Button
                    key={action}
                    variant={isDanger ? 'secondary' : 'primary'}
                    size="s"
                    className={cn(
                      isDanger &&
                        'border-danger-600! text-danger-600! hover:bg-danger-500/10!',
                    )}
                    onClick={() => handleAction(action)}
                    disabled={mutation.isPending}
                    loading={mutation.isPending && !isDanger}
                  >
                    {rule.label}
                  </Button>
                )
              })}
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  )
}

function ConfirmBox({
  title,
  description,
  confirmLabel,
  onKeep,
  onConfirm,
  loading,
}: {
  title: string
  description: string
  confirmLabel: string
  onKeep: () => void
  onConfirm: () => void
  loading: boolean
}) {
  return (
    <div className="rounded-2xl border border-danger-500/30 bg-softColors-6 p-4">
      <p className="text-sub2 font-semibold text-base-900">{title}</p>
      <p className="mt-1 text-sub3 text-base-600">{description}</p>
      <div className="mt-4 flex gap-2">
        <Button
          variant="secondary"
          size="s"
          onClick={onKeep}
          disabled={loading}
        >
          Keep order
        </Button>
        <Button
          variant="primary"
          size="s"
          className="bg-danger-600! hover:bg-danger-700!"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-sub3 text-base-500">{label}</p>
      <p className="text-sub2 font-medium text-base-900">{value}</p>
    </div>
  )
}

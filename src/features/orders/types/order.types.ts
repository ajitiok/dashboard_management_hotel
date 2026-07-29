export type ServiceType =
  | 'Room Service'
  | 'Housekeeping'
  | 'Laundry'
  | 'Extra Bed'
  | 'Spa & Massage'

export type OrderStatus =
  | 'New'
  | 'Pending Approval'
  | 'Acknowledged'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed'

export type Order = {
  id: string
  guestName: string
  roomNumber: string
  service: ServiceType
  quantity: number
  /** Declared room capacity used for Extra Bed approval checks */
  roomCapacity: number
  specialRequest: string
  orderTime: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  /** True when Extra Bed quantity would exceed room capacity */
  requiresApproval: boolean
}

export type OrderSortDirection = 'newest' | 'oldest'

export type OrdersQueryParams = {
  search?: string
  statuses?: OrderStatus[]
  services?: ServiceType[]
  sort?: OrderSortDirection
  page?: number
  pageSize?: number
}

export type OrdersData = {
  orders: Order[]
  total: number
  page: number
  pageSize: number
}

export type OrderStatusAction =
  | 'acknowledge'
  | 'approve'
  | 'reject'
  | 'start'
  | 'complete'
  | 'cancel'

export const ORDER_STATUS_TRANSITIONS: Record<
  OrderStatusAction,
  { from: OrderStatus[]; to: OrderStatus; label: string }
> = {
  approve: {
    from: ['Pending Approval'],
    to: 'Acknowledged',
    label: 'Approve',
  },
  reject: {
    from: ['Pending Approval'],
    to: 'Cancelled',
    label: 'Reject',
  },
  acknowledge: {
    from: ['New'],
    to: 'Acknowledged',
    label: 'Acknowledge',
  },
  start: {
    from: ['Acknowledged'],
    to: 'In Progress',
    label: 'Start processing',
  },
  complete: {
    from: ['In Progress'],
    to: 'Completed',
    label: 'Mark completed',
  },
  cancel: {
    from: ['New', 'Pending Approval', 'Acknowledged', 'In Progress'],
    to: 'Cancelled',
    label: 'Cancel order',
  },
}

export function getAvailableOrderActions(
  status: OrderStatus,
): OrderStatusAction[] {
  return (
    Object.entries(ORDER_STATUS_TRANSITIONS) as Array<
      [OrderStatusAction, (typeof ORDER_STATUS_TRANSITIONS)[OrderStatusAction]]
    >
  )
    .filter(([, rule]) => rule.from.includes(status))
    .map(([action]) => action)
}

/** Extra Bed needs manager approval when quantity would exceed remaining capacity. */
export function doesExtraBedRequireApproval(
  service: ServiceType,
  quantity: number,
  roomCapacity: number,
): boolean {
  if (service !== 'Extra Bed') return false
  // Assume 1 bed already in room; extra beds beyond capacity need approval
  return quantity + 1 > roomCapacity
}

export function resolveInitialOrderStatus(input: {
  service: ServiceType
  quantity: number
  roomCapacity: number
}): { status: OrderStatus; requiresApproval: boolean } {
  const requiresApproval = doesExtraBedRequireApproval(
    input.service,
    input.quantity,
    input.roomCapacity,
  )

  return {
    requiresApproval,
    status: requiresApproval ? 'Pending Approval' : 'New',
  }
}

import { describe, expect, test } from 'bun:test'
import {
  doesExtraBedRequireApproval,
  getAvailableOrderActions,
  ORDER_STATUS_TRANSITIONS,
  resolveInitialOrderStatus,
} from './order.types'

describe('Extra Bed approval', () => {
  test('requires approval when quantity exceeds room capacity', () => {
    expect(doesExtraBedRequireApproval('Extra Bed', 1, 1)).toBe(true)
    expect(doesExtraBedRequireApproval('Extra Bed', 2, 1)).toBe(true)
    expect(doesExtraBedRequireApproval('Extra Bed', 1, 2)).toBe(false)
    expect(doesExtraBedRequireApproval('Room Service', 5, 1)).toBe(false)
  })

  test('initial status becomes Pending Approval when required', () => {
    expect(
      resolveInitialOrderStatus({
        service: 'Extra Bed',
        quantity: 2,
        roomCapacity: 1,
      }),
    ).toEqual({
      requiresApproval: true,
      status: 'Pending Approval',
    })

    expect(
      resolveInitialOrderStatus({
        service: 'Housekeeping',
        quantity: 1,
        roomCapacity: 2,
      }),
    ).toEqual({
      requiresApproval: false,
      status: 'New',
    })
  })
})

describe('order status transitions', () => {
  test('Pending Approval exposes approve and reject', () => {
    const actions = getAvailableOrderActions('Pending Approval')
    expect(actions).toContain('approve')
    expect(actions).toContain('reject')
    expect(actions).toContain('cancel')
    expect(actions).not.toContain('acknowledge')
  })

  test('approve moves to Acknowledged', () => {
    expect(ORDER_STATUS_TRANSITIONS.approve.to).toBe('Acknowledged')
    expect(ORDER_STATUS_TRANSITIONS.reject.to).toBe('Cancelled')
  })
})

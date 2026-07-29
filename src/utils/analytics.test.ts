import { beforeEach, describe, expect, test } from 'bun:test'
import {
  clearTrackedEvents,
  getTrackedEvents,
  trackEvent,
} from './analytics'

describe('trackEvent', () => {
  beforeEach(() => {
    clearTrackedEvents()
  })

  test('stores events newest first', () => {
    trackEvent('a')
    trackEvent('b', { ok: true })

    const events = getTrackedEvents()
    expect(events).toHaveLength(2)
    expect(events[0]?.name).toBe('b')
    expect(events[0]?.props?.ok).toBe(true)
    expect(events[1]?.name).toBe('a')
  })
})

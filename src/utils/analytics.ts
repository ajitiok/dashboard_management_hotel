type AnalyticsEvent = {
  name: string
  props?: Record<string, string | number | boolean | null | undefined>
  at: string
}

const MAX_EVENTS = 100
const events: AnalyticsEvent[] = []

/**
 * Lightweight frontend observability — stores events in-memory and logs in dev.
 */
export function trackEvent(
  name: string,
  props?: AnalyticsEvent['props'],
): void {
  const event: AnalyticsEvent = {
    name,
    props,
    at: new Date().toISOString(),
  }

  events.unshift(event)
  if (events.length > MAX_EVENTS) {
    events.length = MAX_EVENTS
  }

  if (import.meta.env.DEV) {
    console.info('[analytics]', event.name, event.props ?? {})
  }
}

export function getTrackedEvents(): readonly AnalyticsEvent[] {
  return events
}

export function clearTrackedEvents(): void {
  events.length = 0
}

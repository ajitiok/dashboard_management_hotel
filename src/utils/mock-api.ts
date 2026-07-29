const FAIL_STORAGE_KEY = 'hotel.simulateApiError'

/**
 * Demo helper: enable with `?fail=1` in the URL or sessionStorage.
 * Retry actions clear this so users can recover.
 */
export function isMockApiFailureEnabled(): boolean {
  if (typeof window === 'undefined') return false

  const params = new URLSearchParams(window.location.search)
  if (params.get('fail') === '1') return true

  return sessionStorage.getItem(FAIL_STORAGE_KEY) === '1'
}

export function setMockApiFailure(enabled: boolean): void {
  if (typeof window === 'undefined') return

  if (enabled) {
    sessionStorage.setItem(FAIL_STORAGE_KEY, '1')
    return
  }

  sessionStorage.removeItem(FAIL_STORAGE_KEY)

  const url = new URL(window.location.href)
  if (url.searchParams.has('fail')) {
    url.searchParams.delete('fail')
    window.history.replaceState({}, '', url.toString())
  }
}

/** Throw when demo failure mode is enabled (after mock delay). */
export function assertMockApiOk(errorMessage: string): void {
  if (isMockApiFailureEnabled()) {
    throw new Error(errorMessage)
  }
}

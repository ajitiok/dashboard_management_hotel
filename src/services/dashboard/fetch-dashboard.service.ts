import type { ApiResponse } from '@/types/api'
import type { DashboardData } from '@/features/dashboard/types/dashboard.types'
import { dashboardMock } from '@/mocks/dashboard.mock'
import { assertMockApiOk } from '@/utils/mock-api'

const MOCK_DELAY_MS = 1000

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Fetch dashboard payload.
 * Currently served from mock data; swap for a real HTTP client later.
 */
export async function fetchDashboard(): Promise<ApiResponse<DashboardData>> {
  await delay(MOCK_DELAY_MS)
  assertMockApiOk('Unable to load dashboard. Please try again.')

  return {
    success: true,
    data: dashboardMock,
    message: 'Dashboard fetched successfully',
  }
}

export default fetchDashboard

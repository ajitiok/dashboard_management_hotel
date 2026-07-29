import { useQuery } from '@tanstack/react-query'
import { TopNav, DemoApiErrorToggle } from '@/components/common'
import { DataQueryStates, EmptyState } from '@/components/condition'
import {
  PaymentStatusTable,
  TopServicesCard,
} from '@/components/dashboard/AnalyticsCards'
import { BookingTable } from '@/components/dashboard/BookingTable'
import { MetricCard } from '@/components/dashboard/MetricCards'
import { QUERY_KEYS } from '@/constants'
import { fetchDashboard } from '@/services/dashboard/fetch-dashboard.service.ts'
import { getGreeting } from '@/utils'

export function DashboardPage() {
  const greeting = getGreeting('Alex')
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: async () => {
      const response = await fetchDashboard()

      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch dashboard')
      }

      return response.data
    },
  })

  return (
    <div className="flex flex-col gap-5">
      <TopNav variant="light">
        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <h1 className="text-h4 font-bold tracking-tight text-base-900 sm:text-h3 md:text-[2.25rem]">
            {greeting}
          </h1>
          <DemoApiErrorToggle />
        </div>
      </TopNav>

      <DataQueryStates
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => {
          void refetch()
        }}
        errorMessage="Unable to load dashboard. Please try again."
        isEmpty={Boolean(data && data.metrics.length === 0)}
        emptyTitle="No dashboard data."
        emptyDescription="Metrics and bookings will appear here once available."
        isFetching={isFetching}
      >
        {data ? (
          <>
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {data.metrics.map((metric) => (
                <MetricCard key={metric.title} metric={metric} />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
              {data.bookings.length === 0 ? (
                <EmptyState
                  title="No bookings found."
                  description="New bookings will show up in this list."
                  className="rounded-3xl bg-base-100"
                />
              ) : (
                <BookingTable rows={data.bookings} />
              )}
              <div className="flex flex-col gap-5">
                <PaymentStatusTable payments={data.paymentStatuses} />
                <TopServicesCard services={data.topServices} />
              </div>
            </section>
          </>
        ) : null}
      </DataQueryStates>
    </div>
  )
}

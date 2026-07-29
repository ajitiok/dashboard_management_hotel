import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { AlertTriangle, Search } from 'lucide-react'
import {
  DarkPageShell,
  DemoApiErrorToggle,
  ListPagination,
} from '@/components/common'
import { DataQueryStates } from '@/components/condition'
import { OrderDetailDrawer } from '@/components/orders/OrderDetailDrawer'
import { OrdersTable } from '@/components/orders/OrdersTable'
import {
  DEFAULT_PAGE_SIZE,
  ORDER_SERVICE_FILTERS,
  ORDER_STATUS_FILTERS,
  QUERY_KEYS,
} from '@/constants'
import type {
  Order,
  OrderSortDirection,
  OrderStatus,
  ServiceType,
} from '@/features/orders/types/order.types'
import {
  isOrderSlaOverdue,
  ORDER_SLA_MINUTES,
} from '@/features/orders/utils/order-sla'
import { fetchOrders } from '@/services/orders/fetch-orders.service.ts'
import { cn } from '@/utils'
import { trackEvent } from '@/utils/analytics'

function parseListParam(value: string | null): string[] {
  if (!value || value === 'all') return ['all']
  return value.split(',').filter(Boolean)
}

function toCsv(values: string[]): string {
  if (values.length === 0 || values.includes('all')) return 'all'
  return values.join(',')
}

function toOrderStatuses(filterIds: string[]): OrderStatus[] {
  if (filterIds.length === 0 || filterIds.includes('all')) return []
  return filterIds.filter((id): id is OrderStatus => id !== 'all')
}

function toServiceTypes(filterIds: string[]): ServiceType[] {
  if (filterIds.length === 0 || filterIds.includes('all')) return []
  return filterIds.filter((id): id is ServiceType => id !== 'all')
}

function toggleFilter(current: string[], nextId: string): string[] {
  if (nextId === 'all') return ['all']

  const withoutAll = current.filter((id) => id !== 'all')
  const isSelected = withoutAll.includes(nextId)

  if (isSelected) {
    const next = withoutAll.filter((id) => id !== nextId)
    return next.length > 0 ? next : ['all']
  }

  return [...withoutAll, nextId]
}

export function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const search = searchParams.get('q') ?? ''
  const statusFilters = parseListParam(searchParams.get('status'))
  const serviceFilters = parseListParam(searchParams.get('service'))
  const sort = (searchParams.get('sort') as OrderSortDirection) || 'newest'
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)

  const statuses = useMemo(
    () => toOrderStatuses(statusFilters),
    [statusFilters],
  )
  const services = useMemo(
    () => toServiceTypes(serviceFilters),
    [serviceFilters],
  )

  const updateParams = (patch: Record<string, string>) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)

      Object.entries(patch).forEach(([key, value]) => {
        if (key === 'status' || key === 'service') {
          if (!value || value === 'all') next.delete(key)
          else next.set(key, value)
          return
        }

        if (key === 'page') {
          if (!value || value === '1') next.delete(key)
          else next.set(key, value)
          return
        }

        if (key === 'sort') {
          if (!value || value === 'newest') next.delete(key)
          else next.set(key, value)
          return
        }

        if (key === 'q') {
          if (!value) next.delete(key)
          else next.set(key, value)
          return
        }

        if (!value) next.delete(key)
        else next.set(key, value)
      })

      return next
    })
  }

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [
      ...QUERY_KEYS.orders,
      { search, statuses, services, sort, page, pageSize: DEFAULT_PAGE_SIZE },
    ],
    queryFn: async () => {
      const response = await fetchOrders({
        search,
        statuses,
        services,
        sort: sort === 'oldest' ? 'oldest' : 'newest',
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      })

      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch orders')
      }

      return response.data
    },
  })

  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 30_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const slaOverdueCount = useMemo(() => {
    if (!data) return 0
    return data.orders.filter((order) => isOrderSlaOverdue(order, now)).length
  }, [data, now])

  return (
    <>
      <DarkPageShell
        title="Orders"
        filters={ORDER_STATUS_FILTERS}
        filterMultiple
        selectedFilters={statusFilters}
        onFiltersChange={(ids) => {
          trackEvent('orders.filter_status', { value: toCsv(ids) })
          updateParams({ status: toCsv(ids), page: '1' })
        }}
      >
        <section className="rounded-[1.75rem] bg-base-100 p-4 shadow-sm sm:p-5 md:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-h5 font-bold text-base-900">Order list</h2>
              <p className="mt-1 text-sub2 text-base-500">
                View and manage guest service requests. Filters sync to the URL.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <DemoApiErrorToggle />
              <label className="text-sub3 font-medium text-base-500">
                Sort
              </label>
              <select
                value={sort === 'oldest' ? 'oldest' : 'newest'}
                onChange={(event) => {
                  const value = event.target.value as OrderSortDirection
                  trackEvent('orders.sort_changed', { value })
                  updateParams({ sort: value, page: '1' })
                }}
                className="rounded-full border border-border bg-base-100 px-3 py-2 text-sub3 font-medium text-base-800 outline-none focus:border-primary-500"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>

          {slaOverdueCount > 0 && !isLoading && !isError ? (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-danger-500/30 bg-softColors-6 px-4 py-3 text-danger-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-sub2 font-semibold">
                  {slaOverdueCount} New order
                  {slaOverdueCount > 1 ? 's' : ''} on this page exceeded the{' '}
                  {ORDER_SLA_MINUTES}-minute SLA
                </p>
                <p className="mt-0.5 text-sub3 text-danger-600/90">
                  Highlighted rows need acknowledgement as soon as possible.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mb-4">
            <label className="relative block w-full max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-base-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  updateParams({ q: event.target.value, page: '1' })
                }}
                placeholder="Search guest, order ID, or room…"
                className="w-full rounded-full border border-border bg-base-100 py-2.5 pr-4 pl-10 text-sub2 text-base-900 outline-none placeholder:text-base-400 focus:border-primary-500"
              />
            </label>
          </div>

          <div className="mb-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <span className="shrink-0 self-center text-sub3 font-medium text-base-500">
              Service
            </span>
            {ORDER_SERVICE_FILTERS.map((option) => {
              const isActive =
                option.id === 'all'
                  ? serviceFilters.length === 0 ||
                    (serviceFilters.length === 1 &&
                      serviceFilters[0] === 'all')
                  : serviceFilters.includes(option.id) &&
                    !serviceFilters.includes('all')

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    const next = toggleFilter(serviceFilters, option.id)
                    trackEvent('orders.filter_service', { value: toCsv(next) })
                    updateParams({ service: toCsv(next), page: '1' })
                  }}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1.5 text-sub3 font-medium transition-colors',
                    isActive
                      ? 'bg-backgroundDark-200 text-white'
                      : 'bg-base-200 text-base-600 hover:bg-base-300',
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>

          <DataQueryStates
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={() => {
              void refetch()
            }}
            errorMessage="Unable to load orders. Please try again."
            isEmpty={Boolean(data && data.orders.length === 0)}
            emptyTitle="No orders found."
            emptyDescription="Try a different search or clear your filters."
            isFetching={isFetching}
          >
            {data ? (
              <div className="space-y-4">
                <OrdersTable
                  orders={data.orders}
                  onSelectOrder={(order) => {
                    trackEvent('orders.open_detail', { orderId: order.id })
                    setSelectedOrder(order)
                  }}
                />
                <ListPagination
                  page={data.page}
                  pageSize={data.pageSize}
                  total={data.total}
                  onPageChange={(nextPage) =>
                    updateParams({ page: String(nextPage) })
                  }
                />
              </div>
            ) : null}
          </DataQueryStates>
        </section>
      </DarkPageShell>

      <OrderDetailDrawer
        open={Boolean(selectedOrder)}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onOrderUpdated={setSelectedOrder}
      />
    </>
  )
}

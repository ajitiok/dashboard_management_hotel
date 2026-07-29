import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import Badge from '@/components/core/Badge'
import type {
  RestaurantBooking,
  RestaurantBookingStatus,
  RestaurantSortDirection,
  RestaurantSortKey,
} from '@/features/restaurant/types/restaurant.types'
import { formatDate, cn } from '@/utils'
import { EmptyState } from '@/components/condition'

const BOOKING_STATUS_STYLES: Record<
  RestaurantBookingStatus,
  { bgColor: string; textColor: string }
> = {
  Pending: { bgColor: '#FFEDD5', textColor: '#C2410C' },
  Confirmed: { bgColor: '#DBEAFE', textColor: '#1D4ED8' },
  Seated: { bgColor: '#EDE9FE', textColor: '#6D28D9' },
  Completed: { bgColor: '#DCFCE7', textColor: '#15803D' },
  Cancelled: { bgColor: '#FFE4E6', textColor: '#BE123C' },
}

type RestaurantTableProps = {
  bookings: RestaurantBooking[]
  sortBy: RestaurantSortKey
  sortDirection: RestaurantSortDirection
  onSortChange: (key: RestaurantSortKey) => void
}

export function RestaurantTable({
  bookings,
  sortBy,
  sortDirection,
  onSortChange,
}: RestaurantTableProps) {
  return (
    <section className="rounded-[1.75rem] bg-base-100 p-4 shadow-sm sm:p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-h5 font-bold text-base-900">Restaurant bookings</h2>
        <p className="mt-1 text-sub2 text-base-500">
          Track dining reservations and table assignments.
        </p>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-180 border-collapse text-left">
          <thead>
            <tr className="text-sub4 font-medium uppercase tracking-wide text-base-500">
              <th className="pb-3 pr-3 font-medium">Booking ID</th>
              <SortableHeader
                label="Guest"
                column="guestName"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Table"
                column="tableNumber"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Party"
                column="partySize"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Reservation time"
                column="reservationTime"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Status"
                column="status"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <th className="pb-3 font-medium">Special request</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="border-t border-border p-0">
                  <EmptyState
                    title="No bookings found."
                    description="Try a different search or clear your filters."
                    className="border-0 bg-transparent"
                  />
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const style = BOOKING_STATUS_STYLES[booking.status]

                return (
                  <tr
                    key={booking.id}
                    className="border-t border-border text-sub3 text-base-800"
                  >
                    <td className="py-3.5 pr-3 font-medium text-base-900">
                      {booking.id}
                    </td>
                    <td className="py-3.5 pr-3 font-medium text-base-900">
                      {booking.guestName}
                    </td>
                    <td className="py-3.5 pr-3">{booking.tableNumber}</td>
                    <td className="py-3.5 pr-3">{booking.partySize}</td>
                    <td className="py-3.5 pr-3">
                      {formatDate(booking.reservationTime, 'MMM d, HH:mm')}
                    </td>
                    <td className="py-3.5 pr-3">
                      <Badge
                        size="xs"
                        label={booking.status}
                        bgColor={style.bgColor}
                        textColor={style.textColor}
                        className="inline-flex font-medium whitespace-nowrap"
                      />
                    </td>
                    <td className="max-w-56 truncate py-3.5 text-base-600">
                      {booking.specialRequest || '—'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function SortableHeader({
  label,
  column,
  sortBy,
  sortDirection,
  onSortChange,
}: {
  label: string
  column: RestaurantSortKey
  sortBy: RestaurantSortKey
  sortDirection: RestaurantSortDirection
  onSortChange: (key: RestaurantSortKey) => void
}) {
  const isActive = sortBy === column

  return (
    <th className="pb-3 pr-3 font-medium">
      <button
        type="button"
        onClick={() => onSortChange(column)}
        className={cn(
          'inline-flex items-center gap-1 transition-colors hover:text-base-800',
          isActive ? 'text-base-900' : 'text-base-500',
        )}
      >
        {label}
        {isActive ? (
          sortDirection === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
        )}
      </button>
    </th>
  )
}

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import Badge from '@/components/core/Badge'
import { EmptyState } from '@/components/condition'
import type {
  Guest,
  GuestSortDirection,
  GuestSortKey,
  GuestStatus,
} from '@/features/guests/types/guest.types'
import { formatDate, cn } from '@/utils'

const GUEST_STATUS_STYLES: Record<
  GuestStatus,
  { bgColor: string; textColor: string }
> = {
  New: { bgColor: '#EDE9FE', textColor: '#6D28D9' },
  Confirmed: { bgColor: '#DCFCE7', textColor: '#15803D' },
  'Checked In': { bgColor: '#FFEDD5', textColor: '#C2410C' },
  'Checked Out': { bgColor: '#DBEAFE', textColor: '#1D4ED8' },
  Completed: { bgColor: '#F3F4F6', textColor: '#4B5563' },
  Cancelled: { bgColor: '#FFE4E6', textColor: '#BE123C' },
}

type GuestsTableProps = {
  guests: Guest[]
  sortBy: GuestSortKey
  sortDirection: GuestSortDirection
  onSortChange: (key: GuestSortKey) => void
}

export function GuestsTable({
  guests,
  sortBy,
  sortDirection,
  onSortChange,
}: GuestsTableProps) {
  return (
    <section className="rounded-[1.75rem] bg-base-100 p-4 shadow-sm sm:p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-h5 font-bold text-base-900">Guest List</h2>
        <p className="mt-1 text-sub2 text-base-500">
          An overview of all guests. Use filters and column sorting to refine
          results.
        </p>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-180 border-collapse text-left">
          <thead>
            <tr className="text-sub4 font-medium uppercase tracking-wide text-base-500">
              <SortableHeader
                label="Guest"
                column="name"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Email"
                column="email"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Room"
                column="roomNumber"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <th className="pb-3 pr-3 font-medium">Type</th>
              <SortableHeader
                label="Status"
                column="status"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Stays"
                column="totalStays"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Last check-in"
                column="lastCheckIn"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr>
                <td colSpan={7} className="border-t border-border p-0">
                  <EmptyState
                    title="No guests found."
                    description="Try adjusting filters or add a new guest."
                    className="border-0 bg-transparent"
                  />
                </td>
              </tr>
            ) : (
              guests.map((guest) => {
                const style = GUEST_STATUS_STYLES[guest.status]

                return (
                  <tr
                    key={guest.id}
                    className="border-t border-border text-sub3 text-base-800"
                  >
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={guest.avatar}
                          alt={guest.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-base-900">
                            {guest.name}
                          </p>
                          <p className="text-sub4 text-base-500">{guest.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3 text-base-600">{guest.email}</td>
                    <td className="py-3.5 pr-3">{guest.roomNumber}</td>
                    <td className="py-3.5 pr-3">{guest.roomType}</td>
                    <td className="py-3.5 pr-3">
                      <Badge
                        size="xs"
                        label={guest.status}
                        bgColor={style.bgColor}
                        textColor={style.textColor}
                        className="inline-flex font-medium whitespace-nowrap"
                      />
                    </td>
                    <td className="py-3.5 pr-3">{guest.totalStays}</td>
                    <td className="py-3.5">
                      {formatDate(guest.lastCheckIn, 'MMM d, yyyy')}
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
  column: GuestSortKey
  sortBy: GuestSortKey
  sortDirection: GuestSortDirection
  onSortChange: (key: GuestSortKey) => void
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

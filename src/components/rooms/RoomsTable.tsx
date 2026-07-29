import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '@/components/core/Badge'
import { ROUTES } from '@/constants'
import type {
  Room,
  RoomSortDirection,
  RoomSortKey,
  RoomStatus,
} from '@/features/rooms/types/room.types'
import { ROOM_STATUS_LABEL } from '@/features/rooms/types/room.types'
import { EmptyState } from '@/components/condition'
import { formatCurrency, formatDate, cn } from '@/utils'

const ROOM_STATUS_STYLES: Record<
  RoomStatus,
  { bgColor: string; textColor: string }
> = {
  Available: { bgColor: '#DCFCE7', textColor: '#15803D' },
  Occupied: { bgColor: '#DBEAFE', textColor: '#1D4ED8' },
  Cleaning: { bgColor: '#DBEAFE', textColor: '#1D4ED8' },
  Maintenance: { bgColor: '#FEF3C7', textColor: '#B45309' },
  'Out of Order': { bgColor: '#FFE4E6', textColor: '#BE123C' },
}

type RoomsTableProps = {
  rooms: Room[]
  sortBy: RoomSortKey
  sortDirection: RoomSortDirection
  onSortChange: (key: RoomSortKey) => void
}

export function RoomsTable({
  rooms,
  sortBy,
  sortDirection,
  onSortChange,
}: RoomsTableProps) {
  const navigate = useNavigate()

  return (
    <section className="rounded-[1.75rem] bg-base-100 p-4 shadow-sm sm:p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-h5 font-bold text-base-900">Room inventory</h2>
        <p className="mt-1 text-sub2 text-base-500">
          Select a room to open its details page.
        </p>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-180 border-collapse text-left">
          <thead>
            <tr className="text-sub4 font-medium uppercase tracking-wide text-base-500">
              <SortableHeader
                label="Room"
                column="name"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Number"
                column="number"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Type"
                column="type"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Floor"
                column="floor"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Price / night"
                column="pricePerNight"
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
              <SortableHeader
                label="Last cleaned"
                column="lastCleanedAt"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
              />
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={7} className="border-t border-border p-0">
                  <EmptyState
                    title="No rooms found."
                    description="Try a different search or clear your filters."
                    className="border-0 bg-transparent"
                  />
                </td>
              </tr>
            ) : (
              rooms.map((room) => {
                const style = ROOM_STATUS_STYLES[room.status]

                return (
                  <tr
                    key={room.id}
                    className="cursor-pointer border-t border-border text-sub3 text-base-800 transition-colors hover:bg-base-100"
                    onClick={() => navigate(`${ROUTES.rooms}/${room.id}`)}
                  >
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={room.images[0]}
                          alt=""
                          className="h-10 w-14 rounded-lg object-cover"
                        />
                        <p className="font-medium text-base-900">{room.name}</p>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3 font-medium">{room.number}</td>
                    <td className="py-3.5 pr-3">{room.type}</td>
                    <td className="py-3.5 pr-3">{room.floor}</td>
                    <td className="py-3.5 pr-3 font-medium">
                      {formatCurrency(room.pricePerNight)}
                    </td>
                    <td className="py-3.5 pr-3">
                      <Badge
                        size="xs"
                        label={ROOM_STATUS_LABEL[room.status]}
                        bgColor={style.bgColor}
                        textColor={style.textColor}
                        className="inline-flex font-medium whitespace-nowrap"
                      />
                    </td>
                    <td className="py-3.5">
                      {formatDate(room.lastCleanedAt, 'MMM d, HH:mm')}
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
  column: RoomSortKey
  sortBy: RoomSortKey
  sortDirection: RoomSortDirection
  onSortChange: (key: RoomSortKey) => void
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

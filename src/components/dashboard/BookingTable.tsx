import type { BookingRow } from '@/features/dashboard/types/dashboard.types'
import { StatusBadge } from './StatusBadge'

type BookingTableProps = {
  rows: BookingRow[]
}

export function BookingTable({ rows }: BookingTableProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-h6 font-bold text-base-900">New booking</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-195 border-collapse text-left">
          <thead>
            <tr className="text-sub4 font-medium uppercase tracking-wide text-base-500">
              <th className="pb-3 pr-3 font-medium">Booking ID</th>
              <th className="pb-3 pr-3 font-medium">Guest name</th>
              <th className="pb-3 pr-3 font-medium">Email</th>
              <th className="pb-3 pr-3 font-medium">Room</th>
              <th className="pb-3 pr-3 font-medium">Type</th>
              <th className="pb-3 pr-3 font-medium">Checked In</th>
              <th className="pb-3 pr-3 font-medium">Checked Out</th>
              <th className="pb-3 pr-3 font-medium">Status</th>
              <th className="pb-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-border text-sub3 text-base-800"
              >
                <td className="py-3.5 pr-3 font-medium">{row.id}</td>
                <td className="py-3.5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={row.guestAvatar}
                      alt={row.guestName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-base-900">
                      {row.guestName}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 pr-3 text-base-600">{row.email}</td>
                <td className="py-3.5 pr-3">{row.roomNumber}</td>
                <td className="py-3.5 pr-3">{row.roomType}</td>
                <td className="py-3.5 pr-3">{row.checkedIn}</td>
                <td className="py-3.5 pr-3">{row.checkedOut}</td>
                <td className="py-3.5 pr-3">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

import { useMemo, useState } from 'react'
import {
  addDays,
  eachDayOfInterval,
  endOfDay,
  format,
  isBefore,
  isSameDay,
  isWithinInterval,
  max as maxDate,
  min as minDate,
  parseISO,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import { ChevronDown } from 'lucide-react'
import type { Guest, GuestStatus } from '@/features/guests/types/guest.types'
import { EmptyState } from '@/components/condition'
import { cn } from '@/utils'

const DAY_COUNT = 15

const STATUS_BAR_CLASS: Record<GuestStatus, string> = {
  New: 'bg-tertiary-600 text-white',
  Confirmed: 'bg-success-600 text-white',
  'Checked In': 'bg-warning-600 text-white',
  'Checked Out': 'bg-base-200 text-base-800',
  Completed: 'bg-base-200 text-base-800',
  Cancelled:
    'bg-[repeating-linear-gradient(135deg,#7c3aed_0_8px,#a78bfa_8px_16px)] text-white',
}

type GuestsCalendarViewProps = {
  guests: Guest[]
  /** Visible month anchor — defaults to January 2025 to match design data */
  initialMonth?: Date
  /** “Today” marker — defaults to Jan 9, 2025 */
  today?: Date
}

type CalendarLane = {
  id: string
  bars: Array<{
    guest: Guest
    startCol: number
    span: number
  }>
}

function toLocalDay(value: string | Date): Date {
  const date = typeof value === 'string' ? parseISO(value) : value
  return startOfDay(date)
}

function overlaps(
  aStart: number,
  aSpan: number,
  bStart: number,
  bSpan: number,
): boolean {
  const aEnd = aStart + aSpan
  const bEnd = bStart + bSpan
  return aStart < bEnd && bStart < aEnd
}

function buildLanes(
  guests: Guest[],
  rangeStart: Date,
  rangeEnd: Date,
): CalendarLane[] {
  const visible = guests
    .map((guest) => {
      const checkIn = toLocalDay(guest.checkIn)
      const checkOut = toLocalDay(guest.checkOut)

      if (checkOut < rangeStart || checkIn > rangeEnd) {
        return null
      }

      const clippedStart = maxDate([checkIn, rangeStart])
      const clippedEnd = minDate([checkOut, rangeEnd])
      const startCol =
        Math.round(
          (clippedStart.getTime() - rangeStart.getTime()) / (24 * 60 * 60 * 1000),
        ) + 1
      const span =
        Math.max(
          1,
          Math.round(
            (clippedEnd.getTime() - clippedStart.getTime()) /
              (24 * 60 * 60 * 1000),
          ) + 1,
        )

      return { guest, startCol, span }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => a.startCol - b.startCol || b.span - a.span)

  const lanes: CalendarLane[] = []

  for (const bar of visible) {
    let placed = false

    for (const lane of lanes) {
      const hasConflict = lane.bars.some((existing) =>
        overlaps(existing.startCol, existing.span, bar.startCol, bar.span),
      )

      if (!hasConflict) {
        lane.bars.push(bar)
        placed = true
        break
      }
    }

    if (!placed) {
      lanes.push({
        id: `lane-${lanes.length + 1}`,
        bars: [bar],
      })
    }
  }

  return lanes
}

export function GuestsCalendarView({
  guests,
  initialMonth = startOfMonth(new Date(2025, 0, 1)),
  today = new Date(2025, 0, 9),
}: GuestsCalendarViewProps) {
  const [month] = useState(initialMonth)

  const rangeStart = startOfDay(month)
  const rangeEnd = endOfDay(addDays(rangeStart, DAY_COUNT - 1))

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: rangeStart,
        end: startOfDay(rangeEnd),
      }),
    [rangeStart, rangeEnd],
  )

  const lanes = useMemo(
    () => buildLanes(guests, rangeStart, startOfDay(rangeEnd)),
    [guests, rangeStart, rangeEnd],
  )

  const todayIndex = days.findIndex((day) => isSameDay(day, today))

  return (
    <section className="rounded-[1.75rem] bg-base-100 p-4 shadow-sm sm:p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-h6 font-bold text-base-900"
        >
          {format(month, 'MMMM yyyy')}
          <ChevronDown className="h-4 w-4 text-base-500" />
        </button>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <div
          className="relative min-w-160 sm:min-w-230"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${DAY_COUNT}, minmax(0, 1fr))`,
          }}
        >
          {days.map((day) => {
            const isToday = isSameDay(day, today)
            const isPast = isBefore(day, startOfDay(today)) && !isToday

            return (
              <div
                key={day.toISOString()}
                className="flex flex-col items-center pb-3"
              >
                <span
                  className={cn(
                    'inline-flex min-w-12 flex-col items-center rounded-full px-2.5 py-1.5 text-center text-sub3 font-medium',
                    isToday && 'bg-primary-600 text-white',
                    !isToday && isPast && 'text-base-400',
                    !isToday && !isPast && 'text-base-800',
                  )}
                >
                  <span>{format(day, 'EEE')}</span>
                  <span className="text-sub2 font-semibold">
                    {format(day, 'd')}
                  </span>
                </span>
              </div>
            )
          })}

          {todayIndex >= 0 ? (
            <div
              aria-hidden
              className="pointer-events-none absolute top-14 bottom-0 w-px bg-primary-300/70"
              style={{
                left: `calc((100% / ${DAY_COUNT}) * ${todayIndex + 0.5})`,
              }}
            />
          ) : null}

          <div
            className="col-span-full mt-1 flex flex-col gap-3 border-t border-border pt-4"
            style={{ minHeight: `${Math.max(lanes.length, 4) * 56}px` }}
          >
            {lanes.length === 0 ? (
              <EmptyState
                title="No guests found."
                description="No guest stays in this date range."
                className="border-0 bg-transparent"
              />
            ) : (
              lanes.map((lane) => (
                <div
                  key={lane.id}
                  className="relative grid h-11 items-center border-b border-border/70"
                  style={{
                    gridTemplateColumns: `repeat(${DAY_COUNT}, minmax(0, 1fr))`,
                  }}
                >
                  {lane.bars.map(({ guest, startCol, span }) => {
                    const isActiveStay = isWithinInterval(today, {
                      start: toLocalDay(guest.checkIn),
                      end: toLocalDay(guest.checkOut),
                    })

                    return (
                      <div
                        key={guest.id}
                        className={cn(
                          'z-10 mx-0.5 flex h-9 items-center gap-2 overflow-hidden rounded-full px-2 shadow-sm',
                          STATUS_BAR_CLASS[guest.status],
                          !isActiveStay &&
                            guest.status !== 'Cancelled' &&
                            guest.status !== 'Checked In' &&
                            guest.status !== 'Confirmed' &&
                            guest.status !== 'New'
                            ? 'opacity-90'
                            : null,
                        )}
                        style={{
                          gridColumn: `${startCol} / span ${span}`,
                        }}
                        title={`${guest.name} · ${format(toLocalDay(guest.checkIn), 'MMM d')} – ${format(toLocalDay(guest.checkOut), 'MMM d')}`}
                      >
                        <img
                          src={guest.avatar}
                          alt=""
                          className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-white/40"
                        />
                        <span className="truncate text-sub3 font-semibold">
                          {guest.name}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

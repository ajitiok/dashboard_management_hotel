import { format as formatDateFns, parseISO } from 'date-fns'

export function formatDate(
  value: string | Date,
  pattern = 'MMM d, yyyy',
): string {
  const date = typeof value === 'string' ? parseISO(value) : value
  return formatDateFns(date, pattern)
}

type DayPeriod = 'morning' | 'afternoon' | 'evening'

function getDayPeriod(date: Date = new Date()): DayPeriod {
  const hour = date.getHours()

  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

export function getGreeting(name: string, date: Date = new Date()): string {
  const period = getDayPeriod(date)
  return `Good ${period}, ${name}!`
}

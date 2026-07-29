import Badge from '@/components/core/Badge'
import type { BookingStatus } from '@/features/dashboard/types/dashboard.types'

const STATUS_STYLES: Record<
  BookingStatus,
  { bgColor: string; textColor: string }
> = {
  New: { bgColor: '#EDE9FE', textColor: '#6D28D9' },
  'Checked In': { bgColor: '#FFEDD5', textColor: '#C2410C' },
  Confirmed: { bgColor: '#DCFCE7', textColor: '#15803D' },
  'Checked Out': { bgColor: '#DBEAFE', textColor: '#1D4ED8' },
  Cancelled: { bgColor: '#FFE4E6', textColor: '#BE123C' },
}

type StatusBadgeProps = {
  status: BookingStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? {
    bgColor: '#F3F4F6',
    textColor: '#4B5563',
  }

  return (
    <Badge
      size="xs"
      label={status}
      bgColor={style.bgColor}
      textColor={style.textColor}
      className="inline-flex font-medium whitespace-nowrap"
    />
  )
}

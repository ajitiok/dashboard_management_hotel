import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import Badge from '@/components/core/Badge'
import type { MetricCardData } from '@/features/dashboard/types/dashboard.types'

type MetricCardProps = {
  metric: MetricCardData
}

export function MetricCard({ metric }: MetricCardProps) {
  const isUp = metric.trend === 'up'

  return (
    <div className="flex min-h-28 flex-1 flex-col justify-between rounded-[1.25rem] border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sub3 font-medium text-base-600">{metric.title}</p>
          <p className="text-sub4 text-base-500">{metric.subtitle}</p>
        </div>
        <Badge
          size="xs"
          label={metric.delta}
          bgColor={isUp ? '#DCFCE7' : '#FFE4E6'}
          textColor={isUp ? '#15803D' : '#BE123C'}
          className="inline-flex items-center gap-0.5 font-semibold"
          leftIcon={
            isUp ? (
              <ArrowUpRight className="inline h-3 w-3" />
            ) : (
              <ArrowDownRight className="inline h-3 w-3" />
            )
          }
        />
      </div>
      <p className="text-h4 font-bold tracking-tight text-base-900">
        {metric.value}
      </p>
    </div>
  )
}

import { useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReactModule from 'highcharts-react-official'
import Badge from '@/components/core/Badge'
import type {
  PaymentStatus,
  PaymentStatusItem,
  TopService,
} from '@/features/dashboard/types/dashboard.types'
import { formatCurrency, formatDate } from '@/utils'

const HighchartsReact =
  (
    HighchartsReactModule as unknown as {
      default?: typeof HighchartsReactModule
    }
  ).default ?? HighchartsReactModule

const PAYMENT_STATUS_STYLES: Record<
  PaymentStatus,
  { bgColor: string; textColor: string }
> = {
  Paid: { bgColor: '#DCFCE7', textColor: '#15803D' },
  Pending: { bgColor: '#FFEDD5', textColor: '#C2410C' },
  Failed: { bgColor: '#FFE4E6', textColor: '#BE123C' },
  Refunded: { bgColor: '#E0E7FF', textColor: '#4338CA' },
}

const LATEST_PAYMENT_LIMIT = 5

type PaymentStatusTableProps = {
  payments: PaymentStatusItem[]
}

export function PaymentStatusTable({ payments }: PaymentStatusTableProps) {
  const latestPayments = useMemo(
    () =>
      [...payments]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, LATEST_PAYMENT_LIMIT),
    [payments],
  )

  return (
    <section className="rounded-3xl border border-border bg-surface p-5">
      <div className="mb-4">
        <h2 className="text-h6 font-bold text-base-900">Payment status</h2>
        <p className="mt-1 text-sub3 text-base-500">
          Top {LATEST_PAYMENT_LIMIT} latest payments
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-left">
          <thead>
            <tr className="text-sub4 font-medium uppercase tracking-wide text-base-500">
              <th className="pb-3 pr-3 font-medium">Guest</th>
              <th className="pb-3 pr-3 font-medium">Amount</th>
              <th className="pb-3 pr-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {latestPayments.map((payment) => {
              const style = PAYMENT_STATUS_STYLES[payment.status]

              return (
                <tr
                  key={payment.id}
                  className="border-t border-border text-sub3 text-base-800"
                >
                  <td className="py-3 pr-3">
                    <p className="font-medium text-base-900">
                      {payment.guestName}
                    </p>
                    <p className="text-sub4 text-base-500">{payment.method}</p>
                  </td>
                  <td className="py-3 pr-3 font-medium">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="py-3 pr-3">
                    <Badge
                      size="xs"
                      label={payment.status}
                      bgColor={style.bgColor}
                      textColor={style.textColor}
                      className="inline-flex font-medium whitespace-nowrap"
                    />
                  </td>
                  <td className="py-3 text-base-600">
                    {formatDate(payment.createdAt, 'MMM d, HH:mm')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

type TopServicesCardProps = {
  services: TopService[]
}

export function TopServicesCard({ services }: TopServicesCardProps) {
  const options = useMemo<Highcharts.Options>(
    () => ({
      chart: {
        type: 'bar',
        height: 208,
        backgroundColor: 'transparent',
        spacing: [4, 8, 8, 4],
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: services.map((service) => service.label),
        lineWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            color: '#4b5563',
            fontSize: '12px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          },
        },
      },
      yAxis: {
        min: 0,
        max: 100,
        title: { text: undefined },
        gridLineColor: '#f3f4f6',
        labels: {
          format: '{value}%',
          style: {
            color: '#9ca3af',
            fontSize: '11px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          },
        },
      },
      tooltip: {
        pointFormat: '<b>{point.y}%</b>',
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderRadius: 12,
        style: {
          fontSize: '12px',
        },
      },
      plotOptions: {
        bar: {
          borderWidth: 0,
          borderRadius: 10,
          pointPadding: 0.15,
          groupPadding: 0.1,
          colorByPoint: true,
        },
      },
      colors: services.map((service) => service.color),
      series: [
        {
          type: 'bar',
          name: 'Usage',
          data: services.map((service) => service.percent),
        },
      ],
    }),
    [services],
  )

  return (
    <section className="rounded-3xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-h6 font-bold text-base-900">Top services</h2>
      </div>

      <div className="w-full">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </section>
  )
}

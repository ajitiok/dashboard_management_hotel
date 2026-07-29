import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize,
  Trees,
} from 'lucide-react'
import { TopNav, LoadingData, DemoApiErrorToggle } from '@/components/common'
import { ErrorState, RetryButton } from '@/components/condition'
import Badge from '@/components/core/Badge'
import Button from '@/components/core/Button'
import { QUERY_KEYS, ROUTES } from '@/constants'
import type { Room, RoomSpaceFeature } from '@/features/rooms/types/room.types'
import { ROOM_STATUS_LABEL } from '@/features/rooms/types/room.types'
import { fetchRoomById } from '@/services/rooms/fetch-room-by-id.service.ts'
import { roomsMock } from '@/mocks/rooms.mock'
import { formatCurrency, formatDate, cn } from '@/utils'

type DetailTab = 'overview' | 'amenities' | 'reviews' | 'statistics'

const ROOM_STATUS_STYLES = {
  Available: { bgColor: '#DCFCE7', textColor: '#15803D' },
  Occupied: { bgColor: '#DBEAFE', textColor: '#1D4ED8' },
  Cleaning: { bgColor: '#DBEAFE', textColor: '#1D4ED8' },
  Maintenance: { bgColor: '#FEF3C7', textColor: '#B45309' },
  'Out of Order': { bgColor: '#FFE4E6', textColor: '#BE123C' },
} as const

function SpaceIcon({ icon }: { icon: RoomSpaceFeature['icon'] }) {
  const className = 'h-5 w-5 text-base-700'

  switch (icon) {
    case 'bed':
      return <BedDouble className={className} />
    case 'bath':
      return <Bath className={className} />
    case 'area':
      return <Maximize className={className} />
    case 'location':
      return <MapPin className={className} />
    case 'view':
      return <Trees className={className} />
    default:
      return null
  }
}

export function RoomDetailPage() {
  const { roomId = '' } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<DetailTab>('overview')
  const [showFullDescription, setShowFullDescription] = useState(false)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...QUERY_KEYS.rooms, 'detail', roomId],
    queryFn: async () => {
      const response = await fetchRoomById(roomId)

      if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to fetch room')
      }

      return response.data
    },
    enabled: Boolean(roomId),
  })

  const roomIds = useMemo(() => roomsMock.map((room) => room.id), [])
  const currentIndex = roomIds.indexOf(roomId)
  const prevId = currentIndex > 0 ? roomIds[currentIndex - 1] : null
  const nextId =
    currentIndex >= 0 && currentIndex < roomIds.length - 1
      ? roomIds[currentIndex + 1]
      : null

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <TopNav variant="dark" />
        <div className="flex justify-end">
          <DemoApiErrorToggle />
        </div>
        <LoadingData minHeightClassName="min-h-[50vh] sm:min-h-[70vh]" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-5">
        <TopNav variant="dark" />
        <div className="flex justify-end">
          <DemoApiErrorToggle />
        </div>
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : 'Unable to load room details. Please try again.'
          }
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="s"
                onClick={() => navigate(ROUTES.rooms)}
              >
                Back to rooms
              </Button>
              <RetryButton
                onRetry={() => {
                  void refetch()
                }}
              />
            </div>
          }
        />
      </div>
    )
  }

  return (
    <RoomDetailContent
      room={data}
      tab={tab}
      onTabChange={setTab}
      showFullDescription={showFullDescription}
      onToggleDescription={() => setShowFullDescription((v) => !v)}
      prevId={prevId ?? null}
      nextId={nextId ?? null}
    />
  )
}

function RoomDetailContent({
  room,
  tab,
  onTabChange,
  showFullDescription,
  onToggleDescription,
  prevId,
  nextId,
}: {
  room: Room
  tab: DetailTab
  onTabChange: (tab: DetailTab) => void
  showFullDescription: boolean
  onToggleDescription: () => void
  prevId: string | null
  nextId: string | null
}) {
  const navigate = useNavigate()
  const statusStyle = ROOM_STATUS_STYLES[room.status]
  const visibleImages = room.images.slice(0, 3)
  const extraImages = Math.max(room.images.length - 3, 0)
  const description = showFullDescription
    ? room.description
    : `${room.description.slice(0, 160)}${room.description.length > 160 ? '…' : ''}`

  const tabs: Array<{ id: DetailTab; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'statistics', label: 'Statistics' },
  ]

  return (
    <div className="flex flex-col gap-5">
      <TopNav variant="dark">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-h4 font-bold tracking-tight text-white sm:text-h3 md:text-[2.25rem]">
                {room.name}
              </h1>
              <Badge
                size="xs"
                label={ROOM_STATUS_LABEL[room.status]}
                bgColor={statusStyle.bgColor}
                textColor={statusStyle.textColor}
                className="inline-flex font-semibold"
              />
            </div>
            <p className="mt-2 text-sub3 text-white/60">
              <Link to={ROUTES.rooms} className="hover:text-white">
                Rooms
              </Link>
              <span className="mx-1.5">›</span>
              <span className="text-white/90">Room details</span>
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <DemoApiErrorToggle className="border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" />
            <button
              type="button"
              aria-label="Previous room"
              disabled={!prevId}
              onClick={() => prevId && navigate(`${ROUTES.rooms}/${prevId}`)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next room"
              disabled={!nextId}
              onClick={() => nextId && navigate(`${ROUTES.rooms}/${nextId}`)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </TopNav>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.85fr)]">
        <section className="rounded-[1.75rem] bg-base-100 p-4 shadow-sm sm:p-5 md:p-6">
          <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
            {visibleImages.map((image, index) => (
              <img
                key={`${room.id}-img-${index}`}
                src={image}
                alt={`${room.name} photo ${index + 1}`}
                className="h-24 w-full rounded-2xl object-cover sm:h-28 md:h-32"
              />
            ))}
            {extraImages > 0 ? (
              <div className="relative h-24 overflow-hidden rounded-2xl sm:h-28 md:h-32">
                <img
                  src={room.images[3] ?? room.images[0]}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-backgroundDark-200/55 text-sub1 font-semibold text-white">
                  +{extraImages} more
                </div>
              </div>
            ) : null}
          </div>

          <div className="mb-6 -mx-1 flex gap-1 overflow-x-auto border-b border-border px-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'shrink-0 border-b-2 px-3 py-2.5 text-sub2 font-medium transition-colors sm:px-4',
                  tab === item.id
                    ? 'border-primary-600 text-base-900'
                    : 'border-transparent text-base-500 hover:text-base-800',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === 'overview' ? (
            <div className="space-y-8">
              <div>
                <h2 className="mb-2 text-h6 font-bold text-base-900">
                  About this space
                </h2>
                <p className="text-sub2 leading-relaxed text-base-600">
                  {description}{' '}
                  {room.description.length > 160 ? (
                    <button
                      type="button"
                      onClick={onToggleDescription}
                      className="font-semibold text-primary-600 hover:text-primary-700"
                    >
                      {showFullDescription ? 'See less' : 'See more'}
                    </button>
                  ) : null}
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-h6 font-bold text-base-900">
                  The space
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {room.spaceFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center gap-3 rounded-2xl bg-base-100"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-base-200">
                        <SpaceIcon icon={feature.icon} />
                      </span>
                      <span className="text-sub2 font-medium text-base-800">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'amenities' ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {room.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-xl border border-border px-4 py-3 text-sub2 text-base-800"
                >
                  {amenity}
                </li>
              ))}
            </ul>
          ) : null}

          {tab === 'reviews' ? (
            room.reviews.length === 0 ? (
              <p className="text-sub2 text-base-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {room.reviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-2xl border border-border p-4"
                  >
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <h3 className="text-sub2 font-semibold text-base-900">
                        {review.author}
                      </h3>
                      <span className="text-sub3 text-base-500">
                        {review.rating}/5 ·{' '}
                        {formatDate(review.createdAt, 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-sub2 text-base-600">{review.comment}</p>
                  </article>
                ))}
              </div>
            )
          ) : null}

          {tab === 'statistics' ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {room.statistics.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border p-4"
                >
                  <p className="text-sub3 text-base-500">{stat.label}</p>
                  <p className="mt-1 text-h5 font-bold text-base-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <aside className="flex flex-col gap-5">
          <section className="rounded-[1.75rem] bg-base-100 p-5 shadow-sm">
            <h2 className="mb-4 text-h6 font-bold text-base-900">Room info</h2>
            <dl className="space-y-3 text-sub2">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-base-500">Room number</dt>
                <dd className="font-semibold text-base-900">{room.number}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-base-500">Room price</dt>
                <dd className="font-semibold text-primary-600">
                  {formatCurrency(room.pricePerNight)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-base-500">Last maintenance</dt>
                <dd className="font-semibold text-base-900">
                  {formatDate(room.lastMaintenanceAt, 'MMM d, yyyy')}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[1.75rem] bg-base-100 p-5 shadow-sm">
            <h2 className="mb-4 text-h6 font-bold text-base-900">
              Room history
            </h2>
            <ol className="space-y-4">
              {room.history.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={cn(
                        'text-sub2 font-semibold',
                        item.highlight ? 'text-tertiary-700' : 'text-base-900',
                      )}
                    >
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-sub3 text-base-500">
                      {item.description}
                    </p>
                  </div>
                  <time className="shrink-0 text-sub4 text-base-400">
                    {formatDate(item.timestamp, 'MMM d, HH:mm')}
                  </time>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  )
}

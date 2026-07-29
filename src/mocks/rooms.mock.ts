import type {
  Room,
  RoomStatus,
  RoomType,
} from '@/features/rooms/types/room.types'

const IMG = {
  living:
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  bedroom:
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
  bath: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  lounge:
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  suite:
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  deluxe:
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
}

const IMAGE_SETS = [
  [IMG.living, IMG.bedroom, IMG.bath, IMG.lounge],
  [IMG.deluxe, IMG.bedroom, IMG.bath, IMG.living],
  [IMG.suite, IMG.living, IMG.bedroom, IMG.bath, IMG.lounge],
  [IMG.bedroom, IMG.living, IMG.bath],
  [IMG.lounge, IMG.deluxe, IMG.bath, IMG.bedroom],
]

type RoomSeed = {
  id: string
  name: string
  number: string
  type: RoomType
  floor: number
  capacity: number
  pricePerNight: number
  status: RoomStatus
  guestName?: string
}

const ROOM_TYPE_META: Record<
  RoomType,
  { amenities: string[]; bed: string; baths: string; area: string }
> = {
  Single: {
    amenities: ['WiFi', 'TV', 'AC', 'Desk'],
    bed: 'Single bed',
    baths: '1 Bathroom',
    area: '280 sq. ft. room',
  },
  Double: {
    amenities: ['WiFi', 'TV', 'AC', 'Mini bar'],
    bed: 'Queen bed',
    baths: '1 Bathroom',
    area: '400 sq. ft. room',
  },
  Deluxe: {
    amenities: ['WiFi', 'Smart TV', 'AC', 'Mini bar', 'Coffee machine', 'Safe'],
    bed: 'King bed',
    baths: '1 Bathroom',
    area: '650 sq. ft. room',
  },
  Suite: {
    amenities: [
      'WiFi',
      'Smart TV',
      'AC',
      'Jacuzzi',
      'Living room',
      'Butler call',
      'Mini bar',
    ],
    bed: 'King bed + sofa bed',
    baths: '2 Bathrooms',
    area: '1,000 sq. ft. room',
  },
}

function buildRoom(seed: RoomSeed, index: number): Room {
  const meta = ROOM_TYPE_META[seed.type]
  const images =
    IMAGE_SETS[index % IMAGE_SETS.length] ??
    ([IMG.living, IMG.bedroom, IMG.bath] as string[])
  const isOccupied = seed.status === 'Occupied'
  const guest = seed.guestName ?? 'Guest'

  const history =
    seed.status === 'Available'
      ? [
          {
            id: `${seed.id}-h1`,
            title: 'Cleaning Status',
            description: 'Room cleaned and ready for check-in',
            timestamp: '2026-07-29T06:00:00.000Z',
            highlight: true,
          },
          {
            id: `${seed.id}-h2`,
            title: 'Inspection',
            description: 'Passed daily inspection',
            timestamp: '2026-07-29T05:40:00.000Z',
          },
        ]
      : seed.status === 'Occupied'
        ? [
            {
              id: `${seed.id}-h1`,
              title: 'Guest Check-in',
              description: `${guest} checked in`,
              timestamp: '2026-07-28T14:00:00.000Z',
              highlight: true,
            },
            {
              id: `${seed.id}-h2`,
              title: 'Cleaning Status',
              description: 'Pre-arrival clean completed',
              timestamp: '2026-07-28T12:00:00.000Z',
            },
          ]
        : seed.status === 'Cleaning'
          ? [
              {
                id: `${seed.id}-h1`,
                title: 'Cleaning Status',
                description: 'Room is awaiting cleaning',
                timestamp: '2026-07-29T08:00:00.000Z',
                highlight: true,
              },
              {
                id: `${seed.id}-h2`,
                title: 'Guest Check-out',
                description: `${guest} checked out`,
                timestamp: '2026-07-29T06:45:00.000Z',
              },
            ]
          : seed.status === 'Maintenance'
            ? [
                {
                  id: `${seed.id}-h1`,
                  title: 'Maintenance',
                  description: 'Scheduled maintenance in progress',
                  timestamp: '2026-07-28T09:00:00.000Z',
                  highlight: true,
                },
              ]
            : [
                {
                  id: `${seed.id}-h1`,
                  title: 'Out of Order',
                  description: 'Room temporarily unavailable',
                  timestamp: '2026-07-27T10:00:00.000Z',
                  highlight: true,
                },
              ]

  return {
    id: seed.id,
    name: seed.name,
    number: seed.number,
    type: seed.type,
    floor: seed.floor,
    capacity: seed.capacity,
    pricePerNight: seed.pricePerNight,
    status: seed.status,
    amenities: meta.amenities,
    images,
    description: `${seed.name} is a ${seed.type.toLowerCase()} room on floor ${seed.floor}, designed for comfort with curated amenities and a calm stay experience.`,
    spaceFeatures: [
      { id: 'bed', label: meta.bed, icon: 'bed' },
      { id: 'bath', label: meta.baths, icon: 'bath' },
      { id: 'area', label: meta.area, icon: 'area' },
      { id: 'location', label: `Floor ${seed.floor}`, icon: 'location' },
      {
        id: 'view',
        label: seed.floor >= 4 ? 'City skyline view' : 'Garden view',
        icon: 'view',
      },
    ],
    lastCleanedAt: isOccupied
      ? '2026-07-28T12:00:00.000Z'
      : '2026-07-29T06:15:00.000Z',
    lastMaintenanceAt: '2025-03-15T10:00:00.000Z',
    history,
    reviews: isOccupied
      ? [
          {
            id: `${seed.id}-r1`,
            author: guest,
            rating: 4 + (index % 2),
            comment: 'Comfortable stay and helpful staff.',
            createdAt: '2026-06-20T12:00:00.000Z',
          },
        ]
      : [],
    statistics: [
      {
        label: 'Occupancy (30d)',
        value: `${60 + ((index * 7) % 35)}%`,
      },
      {
        label: 'Avg. stay',
        value: `${(1.2 + (index % 4) * 0.4).toFixed(1)} nights`,
      },
      {
        label: 'Revenue (30d)',
        value: `$${(seed.pricePerNight * (8 + (index % 10))).toLocaleString('en-US')}`,
      },
      {
        label: 'Guest rating',
        value: `${(4.1 + (index % 8) * 0.1).toFixed(1)}/5`,
      },
    ],
  }
}

/** Showcase room matching the Room Details design (Velvet Sky). */
const velvetSky: Room = {
  id: 'RM-DE02',
  name: 'Velvet Sky',
  number: 'De-02',
  type: 'Deluxe',
  floor: 2,
  capacity: 3,
  pricePerNight: 250,
  status: 'Cleaning',
  amenities: [
    'High-speed WiFi',
    'Smart TV',
    'Mini bar',
    'Rain shower',
    'City view',
    'Workspace',
    'Coffee machine',
    'Safe box',
  ],
  images: [
    IMG.living,
    IMG.bedroom,
    IMG.bath,
    IMG.lounge,
    IMG.suite,
    IMG.deluxe,
  ],
  description:
    'Experience luxury in our Deluxe Suite, featuring a plush king-sized bed, spa-inspired bathroom, and panoramic city views. Designed for comfort and elegance with curated amenities.',
  spaceFeatures: [
    { id: 'bed', label: 'Plush king-sized bed', icon: 'bed' },
    { id: 'bath', label: '2 Bathrooms', icon: 'bath' },
    { id: 'area', label: '800 sq. ft. room', icon: 'area' },
    { id: 'location', label: 'Easy location', icon: 'location' },
    { id: 'view', label: 'Garden view', icon: 'view' },
  ],
  lastCleanedAt: '2026-07-28T15:00:00.000Z',
  lastMaintenanceAt: '2025-01-03T10:00:00.000Z',
  history: [
    {
      id: 'h1',
      title: 'Cleaning Status',
      description: 'Room is awaiting cleaning',
      timestamp: '2026-07-29T08:00:00.000Z',
      highlight: true,
    },
    {
      id: 'h2',
      title: 'Inspection',
      description: 'Room inspected, minor cleaning needed',
      timestamp: '2026-07-29T07:20:00.000Z',
    },
    {
      id: 'h3',
      title: 'Guest Check-out',
      description: 'Sarah Johnson checked out',
      timestamp: '2026-07-29T06:45:00.000Z',
    },
    {
      id: 'h4',
      title: 'Service Request',
      description: 'Extra towels and room service delivered',
      timestamp: '2026-07-28T21:10:00.000Z',
    },
    {
      id: 'h5',
      title: 'Maintenance Performed',
      description: 'Routine HVAC inspection completed',
      timestamp: '2025-01-03T10:00:00.000Z',
    },
    {
      id: 'h6',
      title: 'Guest Check-in',
      description: 'Guest Sarah Johnson checked in',
      timestamp: '2026-07-27T14:00:00.000Z',
    },
  ],
  reviews: [
    {
      id: 'r1',
      author: 'Sarah Johnson',
      rating: 5,
      comment: 'Beautiful suite with a calm atmosphere and excellent service.',
      createdAt: '2026-07-28T18:00:00.000Z',
    },
    {
      id: 'r2',
      author: 'Daniel Wu',
      rating: 4,
      comment: 'Spacious and clean. The garden view was a highlight.',
      createdAt: '2026-06-12T12:00:00.000Z',
    },
  ],
  statistics: [
    { label: 'Occupancy (30d)', value: '86%' },
    { label: 'Avg. stay', value: '2.4 nights' },
    { label: 'Revenue (30d)', value: '$6,250' },
    { label: 'Guest rating', value: '4.8/5' },
  ],
}

const roomSeeds: RoomSeed[] = [
  // Available (empty) — majority of vacant inventory
  {
    id: 'RM-D05',
    name: 'Lunar Bliss',
    number: 'D-05',
    type: 'Double',
    floor: 3,
    capacity: 2,
    pricePerNight: 180,
    status: 'Available',
  },
  {
    id: 'RM-101',
    name: 'Aurora Single',
    number: '101',
    type: 'Single',
    floor: 1,
    capacity: 1,
    pricePerNight: 95,
    status: 'Available',
  },
  {
    id: 'RM-102',
    name: 'Maple Single',
    number: '102',
    type: 'Single',
    floor: 1,
    capacity: 1,
    pricePerNight: 95,
    status: 'Available',
  },
  {
    id: 'RM-105',
    name: 'Cedar Nook',
    number: '105',
    type: 'Single',
    floor: 1,
    capacity: 1,
    pricePerNight: 105,
    status: 'Available',
  },
  {
    id: 'RM-110',
    name: 'Willow Cove',
    number: '110',
    type: 'Double',
    floor: 1,
    capacity: 2,
    pricePerNight: 145,
    status: 'Available',
  },
  {
    id: 'RM-201',
    name: 'Pearl Double',
    number: '201',
    type: 'Double',
    floor: 2,
    capacity: 2,
    pricePerNight: 155,
    status: 'Available',
  },
  {
    id: 'RM-210',
    name: 'Silver Breeze',
    number: '210',
    type: 'Double',
    floor: 2,
    capacity: 2,
    pricePerNight: 160,
    status: 'Available',
  },
  {
    id: 'RM-215',
    name: 'Ivory Lane',
    number: '215',
    type: 'Deluxe',
    floor: 2,
    capacity: 3,
    pricePerNight: 230,
    status: 'Available',
  },
  {
    id: 'RM-301',
    name: 'Amber Court',
    number: '301',
    type: 'Double',
    floor: 3,
    capacity: 2,
    pricePerNight: 170,
    status: 'Available',
  },
  {
    id: 'RM-318',
    name: 'Jade Terrace',
    number: '318',
    type: 'Deluxe',
    floor: 3,
    capacity: 3,
    pricePerNight: 240,
    status: 'Available',
  },
  {
    id: 'RM-402',
    name: 'Skyline Quiet',
    number: '402',
    type: 'Double',
    floor: 4,
    capacity: 2,
    pricePerNight: 190,
    status: 'Available',
  },
  {
    id: 'RM-410',
    name: 'Cloud Nest',
    number: '410',
    type: 'Single',
    floor: 4,
    capacity: 1,
    pricePerNight: 120,
    status: 'Available',
  },
  {
    id: 'RM-512',
    name: 'Horizon Rest',
    number: '512',
    type: 'Deluxe',
    floor: 5,
    capacity: 3,
    pricePerNight: 260,
    status: 'Available',
  },

  // Occupied (filled)
  {
    id: 'RM-508',
    name: 'Celestial Suite',
    number: '508',
    type: 'Suite',
    floor: 5,
    capacity: 4,
    pricePerNight: 380,
    status: 'Occupied',
    guestName: 'Chris Wong',
  },
  {
    id: 'RM-204',
    name: 'Nimbus Double',
    number: '204',
    type: 'Double',
    floor: 2,
    capacity: 2,
    pricePerNight: 145,
    status: 'Occupied',
    guestName: 'Alex Johnson',
  },
  {
    id: 'RM-103',
    name: 'Pine Single',
    number: '103',
    type: 'Single',
    floor: 1,
    capacity: 1,
    pricePerNight: 95,
    status: 'Occupied',
    guestName: 'Rita Patel',
  },
  {
    id: 'RM-118',
    name: 'Harbor Single',
    number: '118',
    type: 'Single',
    floor: 1,
    capacity: 1,
    pricePerNight: 110,
    status: 'Occupied',
    guestName: 'James Lee',
  },
  {
    id: 'RM-206',
    name: 'Coral Double',
    number: '206',
    type: 'Double',
    floor: 2,
    capacity: 2,
    pricePerNight: 150,
    status: 'Occupied',
    guestName: 'Emily Tran',
  },
  {
    id: 'RM-220',
    name: 'Orchid Suite',
    number: '220',
    type: 'Suite',
    floor: 2,
    capacity: 4,
    pricePerNight: 340,
    status: 'Occupied',
    guestName: 'Michael Brown',
  },
  {
    id: 'RM-312',
    name: 'Sapphire Deluxe',
    number: '312',
    type: 'Deluxe',
    floor: 3,
    capacity: 3,
    pricePerNight: 245,
    status: 'Occupied',
    guestName: 'Priya Sharma',
  },
  {
    id: 'RM-325',
    name: 'Meadow Double',
    number: '325',
    type: 'Double',
    floor: 3,
    capacity: 2,
    pricePerNight: 175,
    status: 'Occupied',
    guestName: 'Noah Kim',
  },
  {
    id: 'RM-405',
    name: 'Summit Double',
    number: '405',
    type: 'Double',
    floor: 4,
    capacity: 2,
    pricePerNight: 195,
    status: 'Occupied',
    guestName: 'Olivia Martins',
  },
  {
    id: 'RM-418',
    name: 'Vista Deluxe',
    number: '418',
    type: 'Deluxe',
    floor: 4,
    capacity: 3,
    pricePerNight: 255,
    status: 'Occupied',
    guestName: 'Ethan Brooks',
  },
  {
    id: 'RM-501',
    name: 'Crown Suite',
    number: '501',
    type: 'Suite',
    floor: 5,
    capacity: 4,
    pricePerNight: 400,
    status: 'Occupied',
    guestName: 'Sophia Nguyen',
  },
  {
    id: 'RM-520',
    name: 'Eclipse Deluxe',
    number: '520',
    type: 'Deluxe',
    floor: 5,
    capacity: 3,
    pricePerNight: 270,
    status: 'Occupied',
    guestName: 'Liam Garcia',
  },

  // Cleaning / Maintenance / Out of Order
  {
    id: 'RM-208',
    name: 'Misty Double',
    number: '208',
    type: 'Double',
    floor: 2,
    capacity: 2,
    pricePerNight: 150,
    status: 'Cleaning',
    guestName: 'Hannah Cole',
  },
  {
    id: 'RM-330',
    name: 'Riverbend Deluxe',
    number: '330',
    type: 'Deluxe',
    floor: 3,
    capacity: 3,
    pricePerNight: 235,
    status: 'Cleaning',
    guestName: 'Carlos Diaz',
  },
  {
    id: 'RM-333',
    name: 'Harbor Deluxe',
    number: '333',
    type: 'Deluxe',
    floor: 3,
    capacity: 3,
    pricePerNight: 220,
    status: 'Maintenance',
  },
  {
    id: 'RM-115',
    name: 'Stone Single',
    number: '115',
    type: 'Single',
    floor: 1,
    capacity: 1,
    pricePerNight: 90,
    status: 'Maintenance',
  },
  {
    id: 'RM-422',
    name: 'Ash Grove',
    number: '422',
    type: 'Double',
    floor: 4,
    capacity: 2,
    pricePerNight: 185,
    status: 'Out of Order',
  },
]

export const roomsMock: Room[] = [
  velvetSky,
  ...roomSeeds.map((seed, index) => buildRoom(seed, index)),
]

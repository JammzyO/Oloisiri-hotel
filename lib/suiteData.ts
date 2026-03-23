export type SuiteAmenity = {
  key: string
  label: string
}

export type Suite = {
  slug: string
  name: string
  category: string
  guests: number
  size: string
  bed: string
  connecting: boolean
  rate: number
  rateDisplay: string
  description: string
  amenities: SuiteAmenity[]
  features: { label: string; detail: string }[]
  checkin: string
  checkout: string
  images: { src: string; position: string }[]
}

export const allSuites: Suite[] = [
  {
    slug: 'luxury-room',
    name: 'Luxury Room',
    category: 'Top Floor',
    guests: 2,
    size: '45 m²',
    bed: '1 King Bed',
    connecting: false,
    rate: 38000,
    rateDisplay: 'KES 38,000',
    description:
      'The best room in the house. On clear mornings Kilimanjaro fills the window before you are fully awake. Elevated finishes, the quietest floor, and a balcony that earns its name.',
    amenities: [
      { key: 'wifi',      label: 'Free Wi-Fi' },
      { key: 'shower',    label: 'Walk-in Rain Shower' },
      { key: 'terrace',   label: 'Private Balcony' },
      { key: 'tv',        label: 'Smart TV with Netflix & Sports' },
      { key: 'fridge',    label: 'In-Room Bar Fridge' },
      { key: 'desk',      label: 'Dedicated Work Desk' },
      { key: 'safe',      label: 'In-Room Safe' },
      { key: 'ac',        label: 'Air Conditioning' },
      { key: 'housekeeping', label: 'Daily Housekeeping' },
      { key: 'nespresso', label: 'Kenyan Tea & Nespresso' },
      { key: 'curtains',  label: 'Blackout Curtains' },
    ],
    features: [
      { label: 'Wi-Fi',        detail: 'Complimentary high-speed Wi-Fi throughout' },
      { label: 'Housekeeping', detail: 'Daily housekeeping service' },
      { label: 'Linen',        detail: 'Premium cotton linen and bath towels' },
      { label: 'Balcony',      detail: 'Private balcony with views of Mt. Kilimanjaro, Namanga Hills, or Longido Hills' },
      { label: 'Shower',       detail: 'Walk-in rain shower' },
      { label: 'Nespresso',    detail: 'Kenyan Tea & Nespresso Selection' },
      { label: 'Climate',      detail: 'Individual climate control and blackout curtains' },
      { label: 'Safety',       detail: 'In-room electronic safe' },
    ],
    checkin: '2:00 PM',
    checkout: '10:00 AM',
    images: [
      { src: '/images/rooms/luxury-view-1.jpeg',     position: 'center' },
      { src: '/images/rooms/luxury-view-2.jpeg',     position: 'center' },
      { src: '/images/rooms/luxury-view-3.jpeg',     position: 'center' },
      { src: '/images/rooms/luxury-bathroom-1.jpeg', position: 'center' },
      { src: '/images/rooms/luxury-bathroom-2.jpeg', position: 'center' },
    ],
  },
  {
    slug: 'standard-king',
    name: 'Standard King',
    category: 'Garden Level',
    guests: 2,
    size: '32 m²',
    bed: '1 King Bed (convertible to twin on request)',
    connecting: false,
    rate: 18000,
    rateDisplay: 'From KES 7,500',
    description:
      'Clean, well-finished, and exactly what a good hotel room should be. A proper bed, a proper shower, a balcony with views of the Namanga Hills. Nothing missing.',
    amenities: [
      { key: 'wifi',      label: 'Free Wi-Fi' },
      { key: 'shower',    label: 'Walk-in Rain Shower' },
      { key: 'terrace',   label: 'Private Balcony' },
      { key: 'tv',        label: 'Smart TV with Netflix & Sports' },
      { key: 'fridge',    label: 'In-Room Bar Fridge' },
      { key: 'desk',      label: 'Dedicated Work Desk' },
      { key: 'safe',      label: 'In-Room Safe' },
      { key: 'ac',        label: 'Air Conditioning' },
      { key: 'housekeeping', label: 'Daily Housekeeping' },
      { key: 'nespresso', label: 'Kenyan Tea & Nespresso' },
      { key: 'curtains',  label: 'Blackout Curtains' },
    ],
    features: [
      { label: 'Wi-Fi',        detail: 'Complimentary high-speed Wi-Fi throughout' },
      { label: 'Housekeeping', detail: 'Daily housekeeping service' },
      { label: 'Linen',        detail: 'Premium cotton linen and bath towels' },
      { label: 'Balcony',      detail: 'Private balcony with views of Mt. Kilimanjaro, Namanga Hills, or Longido Hills' },
      { label: 'Shower',       detail: 'Walk-in rain shower' },
      { label: 'Nespresso',    detail: 'Kenyan Tea & Nespresso Selection' },
      { label: 'Climate',      detail: 'Individual climate control and blackout curtains' },
      { label: 'Safety',       detail: 'In-room electronic safe' },
    ],
    checkin: '2:00 PM',
    checkout: '10:00 AM',
    images: [
      { src: '/images/rooms/standard-king-view-1.jpeg',     position: 'center' },
      { src: '/images/rooms/standard-king-view-2.jpeg',     position: 'center' },
      { src: '/images/rooms/standard-king-view-3.jpeg',     position: 'center' },
      { src: '/images/rooms/standard-king-bathroom-1.jpeg', position: 'center' },
    ],
  },
  {
    slug: 'twin-room',
    name: 'Twin Room',
    category: 'Garden Level',
    guests: 2,
    size: '30 m²',
    bed: '2 Single Beds (King convertible on request)',
    connecting: false,
    rate: 16000,
    rateDisplay: 'From KES 7,500',
    description:
      'The same standard as our King — two beds instead of one. Ideal for colleagues travelling together or friends who value their own space.',
    amenities: [
      { key: 'wifi',      label: 'Free Wi-Fi' },
      { key: 'shower',    label: 'Walk-in Rain Shower' },
      { key: 'terrace',   label: 'Private Balcony' },
      { key: 'tv',        label: 'Smart TV with Netflix & Sports' },
      { key: 'fridge',    label: 'In-Room Bar Fridge' },
      { key: 'desk',      label: 'Dedicated Work Desk' },
      { key: 'safe',      label: 'In-Room Safe' },
      { key: 'ac',        label: 'Air Conditioning' },
      { key: 'housekeeping', label: 'Daily Housekeeping' },
      { key: 'nespresso', label: 'Kenyan Tea & Nespresso' },
      { key: 'curtains',  label: 'Blackout Curtains' },
    ],
    features: [
      { label: 'Wi-Fi',        detail: 'Complimentary high-speed Wi-Fi throughout' },
      { label: 'Housekeeping', detail: 'Daily housekeeping service' },
      { label: 'Linen',        detail: 'Premium cotton linen and bath towels' },
      { label: 'Balcony',      detail: 'Private balcony with views of Mt. Kilimanjaro, Namanga Hills, or Longido Hills' },
      { label: 'Shower',       detail: 'Walk-in rain shower' },
      { label: 'Nespresso',    detail: 'Kenyan Tea & Nespresso Selection' },
      { label: 'Climate',      detail: 'Individual climate control and blackout curtains' },
      { label: 'Safety',       detail: 'In-room electronic safe' },
    ],
    checkin: '2:00 PM',
    checkout: '10:00 AM',
    images: [
      { src: '/images/rooms/twin-room-view-1.jpeg',     position: 'center' },
      { src: '/images/rooms/twin-room-view-2.jpeg',     position: 'center' },
      { src: '/images/rooms/twin-room-bathroom-1.jpeg', position: 'center' },
    ],
  },
  {
    slug: 'family-room',
    name: 'Family Room',
    category: 'Garden Level',
    guests: 4,
    size: '55 m²',
    bed: '1 King + 2 Singles (King convertible on request)',
    connecting: false,
    rate: 28000,
    rateDisplay: 'From KES 7,500',
    description:
      'Generous space for families. A layout that keeps everyone together without crowding anyone. Balcony, garden views, and enough room to actually unpack.',
    amenities: [
      { key: 'wifi',      label: 'Free Wi-Fi' },
      { key: 'shower',    label: 'Walk-in Rain Shower' },
      { key: 'terrace',   label: 'Private Balcony' },
      { key: 'tv',        label: 'Smart TV with Netflix & Sports' },
      { key: 'fridge',    label: 'In-Room Bar Fridge' },
      { key: 'desk',      label: 'Dedicated Work Desk' },
      { key: 'safe',      label: 'In-Room Safe' },
      { key: 'ac',        label: 'Air Conditioning' },
      { key: 'housekeeping', label: 'Daily Housekeeping' },
      { key: 'nespresso', label: 'Kenyan Tea & Nespresso' },
      { key: 'curtains',  label: 'Blackout Curtains' },
    ],
    features: [
      { label: 'Wi-Fi',        detail: 'Complimentary high-speed Wi-Fi throughout' },
      { label: 'Housekeeping', detail: 'Daily housekeeping service' },
      { label: 'Linen',        detail: 'Premium cotton linen and bath towels' },
      { label: 'Balcony',      detail: 'Private balcony with views of Mt. Kilimanjaro, Namanga Hills, or Longido Hills' },
      { label: 'Shower',       detail: 'Walk-in rain shower' },
      { label: 'Nespresso',    detail: 'Kenyan Tea & Nespresso Selection' },
      { label: 'Climate',      detail: 'Individual climate control and blackout curtains' },
      { label: 'Safety',       detail: 'In-room electronic safe' },
    ],
    checkin: '2:00 PM',
    checkout: '10:00 AM',
    images: [
      { src: '/images/rooms/family-room-view-1.jpeg',     position: 'center 30%' },
      { src: '/images/rooms/family-room-view-2.jpeg',     position: 'center 35%' },
      { src: '/images/rooms/family-room-view-3.jpeg',     position: 'center' },
      { src: '/images/rooms/family-room-bathroom-1.jpeg', position: 'center 20%' },
    ],
  },
  {
    slug: 'interleading-suite',
    name: 'Interleading Suite',
    category: 'Garden Level',
    guests: 6,
    size: '72 m²',
    bed: '2 King Beds (each convertible to twin on request)',
    connecting: true,
    rate: 42000,
    rateDisplay: 'From KES 7,500',
    description:
      'Two rooms that connect. For families or groups who want space without separation — each room is fully self-contained, with a shared connecting door that can open or close as needed.',
    amenities: [
      { key: 'wifi',      label: 'Free Wi-Fi' },
      { key: 'shower',    label: 'Walk-in Rain Shower' },
      { key: 'terrace',   label: 'Private Balcony' },
      { key: 'tv',        label: 'Smart TV with Netflix & Sports' },
      { key: 'fridge',    label: 'In-Room Bar Fridge' },
      { key: 'desk',      label: 'Dedicated Work Desk' },
      { key: 'safe',      label: 'In-Room Safe' },
      { key: 'ac',        label: 'Air Conditioning' },
      { key: 'housekeeping', label: 'Daily Housekeeping' },
      { key: 'nespresso', label: 'Kenyan Tea & Nespresso' },
      { key: 'curtains',  label: 'Blackout Curtains' },
    ],
    features: [
      { label: 'Wi-Fi',        detail: 'Complimentary high-speed Wi-Fi throughout' },
      { label: 'Housekeeping', detail: 'Daily housekeeping service' },
      { label: 'Linen',        detail: 'Premium cotton linen and bath towels' },
      { label: 'Balcony',      detail: 'Private balcony per room, with views of Mt. Kilimanjaro, Namanga Hills, or Longido Hills' },
      { label: 'Shower',       detail: 'Walk-in rain shower in each room' },
      { label: 'Nespresso',    detail: 'Kenyan Tea & Nespresso Selection' },
      { label: 'Climate',      detail: 'Individual climate control and blackout curtains' },
      { label: 'Safety',       detail: 'In-room electronic safe in each room' },
    ],
    checkin: '2:00 PM',
    checkout: '10:00 AM',
    images: [
      { src: '/images/rooms/interleading-view-1.jpeg',      position: 'center' },
      { src: '/images/rooms/interleading-view-2.jpeg',      position: 'center' },
      { src: '/images/rooms/interleading-bathroom-1.jpeg',  position: 'center' },
      { src: '/images/rooms/interleading-bathroom-2.jpeg',  position: 'center' },
    ],
  },
]

export const suitesBySlug: Record<string, Suite> = Object.fromEntries(
  allSuites.map(s => [s.slug, s])
)

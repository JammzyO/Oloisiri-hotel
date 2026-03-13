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
    slug: 'savannah-suite',
    name: 'Savannah Suite',
    category: 'Garden Level',
    guests: 2,
    size: '68 m²',
    bed: '1 King Bed',
    connecting: false,
    rate: 42000,
    rateDisplay: 'KES 42,000',
    description:
      'Low to the land, the Savannah Suite opens onto a private terrace where the grass shifts with the morning wind. Woven textures, muted ochres, and the scent of cedar define a space that asks nothing of you but presence. The suite is the closest thing to sleeping in the savannah itself — grounded, unhurried, and alive with the sounds of the land.',
    amenities: [
      { key: 'wifi', label: 'Free Wi-Fi' },
      { key: 'shower', label: 'Rain Shower' },
      { key: 'safe', label: 'In-Room Safe' },
      { key: 'tv', label: 'Flat-Screen TV' },
      { key: 'minibar', label: 'Minibar' },
      { key: 'ac', label: 'Air Conditioning' },
      { key: 'terrace', label: 'Private Terrace' },
      { key: 'nespresso', label: 'Nespresso Machine' },
      { key: 'garden', label: 'Garden View' },
    ],
    features: [
      { label: 'Wi-Fi', detail: 'Complimentary high-speed Wi-Fi throughout' },
      { label: 'Housekeeping', detail: 'Daily housekeeping and evening turndown service' },
      { label: 'Linen', detail: 'Premium Egyptian cotton linen and bath towels' },
      { label: 'Terrace', detail: 'Private terrace with garden chairs and side table' },
      { label: 'Shower', detail: 'Outdoor cedar rain shower + indoor en-suite bathroom' },
      { label: 'Nespresso', detail: 'Nespresso machine and curated selection of Kenyan teas' },
      { label: 'Climate', detail: 'Individual climate control and blackout curtains' },
      { label: 'Safety', detail: 'In-room electronic safe' },
    ],
    checkin: '2:00 PM',
    checkout: '11:00 AM',
    images: [
      { src: '/suite-savannah-a.jpg', position: 'center' },
      { src: '/suite-savannah-b.jpg', position: 'center' },
      { src: '/suite-savannah-c.jpg', position: 'center' },
    ],
  },
  {
    slug: 'kilimanjaro-suite',
    name: 'Kilimanjaro Suite',
    category: 'View Suite',
    guests: 2,
    size: '84 m²',
    bed: '1 King Bed',
    connecting: false,
    rate: 54000,
    rateDisplay: 'KES 54,000',
    description:
      'Rise early and the summit will be yours — framed in the floor-to-ceiling glass of the Kilimanjaro Suite. The mountain does not guarantee its presence, but the suite rewards patience. Linen, stone, and still air. Nothing in the room competes with what lies beyond the glass.',
    amenities: [
      { key: 'wifi', label: 'Free Wi-Fi' },
      { key: 'shower', label: 'Rain Shower' },
      { key: 'safe', label: 'In-Room Safe' },
      { key: 'tv', label: 'Flat-Screen TV' },
      { key: 'minibar', label: 'Minibar' },
      { key: 'ac', label: 'Air Conditioning' },
      { key: 'window', label: 'Floor-to-Ceiling Glass' },
      { key: 'view', label: 'Kilimanjaro View' },
      { key: 'nespresso', label: 'Nespresso Machine' },
    ],
    features: [
      { label: 'Wi-Fi', detail: 'Complimentary high-speed Wi-Fi throughout' },
      { label: 'Housekeeping', detail: 'Daily housekeeping and evening turndown service' },
      { label: 'Linen', detail: 'Premium Egyptian cotton linen and bath towels' },
      { label: 'View', detail: 'Floor-to-ceiling Kilimanjaro-facing windows' },
      { label: 'Binoculars', detail: 'In-room binoculars for mountain and wildlife spotting' },
      { label: 'Nespresso', detail: 'Nespresso machine and curated selection of Kenyan teas' },
      { label: 'Climate', detail: 'Individual climate control and blackout curtains' },
      { label: 'Safety', detail: 'In-room electronic safe' },
    ],
    checkin: '2:00 PM',
    checkout: '11:00 AM',
    images: [
      { src: '/suite-kilimanjaro-a.jpg', position: 'center' },
      { src: '/suite-kilimanjaro-b.jpg', position: 'center' },
      { src: '/suite-kilimanjaro-c.jpg', position: 'center' },
      { src: '/suite-kilimanjaro-d.jpg', position: 'center' },
    ],
  },
  {
    slug: 'bush-villa',
    name: 'Bush Villa',
    category: 'Private Villa',
    guests: 4,
    size: '140 m²',
    bed: '2 King Beds',
    connecting: true,
    rate: 85000,
    rateDisplay: 'KES 85,000',
    description:
      'The most secluded dwelling at Oloisiri. A private plunge pool, a dedicated butler, and a silence so complete it becomes its own presence. The Bush Villa is designed for those who seek not luxury as spectacle, but depth — a full surrender to the land, the light, and unhurried time.',
    amenities: [
      { key: 'wifi', label: 'Free Wi-Fi' },
      { key: 'shower', label: 'Rain Shower' },
      { key: 'safe', label: 'In-Room Safe' },
      { key: 'tv', label: 'Flat-Screen TV' },
      { key: 'minibar', label: 'Minibar' },
      { key: 'ac', label: 'Air Conditioning' },
      { key: 'pool', label: 'Private Plunge Pool' },
      { key: 'butler', label: 'Dedicated Butler' },
      { key: 'kitchen', label: 'Kitchenette' },
    ],
    features: [
      { label: 'Butler', detail: 'Dedicated butler available from 6:00 AM to midnight' },
      { label: 'Plunge Pool', detail: 'Private plunge pool, serviced and refreshed twice daily' },
      { label: 'Wi-Fi', detail: 'Complimentary high-speed Wi-Fi throughout' },
      { label: 'Kitchenette', detail: 'Kitchenette with stocked refrigerator and Nespresso' },
      { label: 'Linen', detail: 'Premium Egyptian cotton linen and bath towels' },
      { label: 'Housekeeping', detail: 'Daily housekeeping and evening turndown service' },
      { label: 'Climate', detail: 'Individual climate control and blackout curtains' },
      { label: 'Safety', detail: 'In-room electronic safe' },
    ],
    checkin: '2:00 PM',
    checkout: '11:00 AM',
    images: [
      { src: '/suite-bushvilla-a.jpg', position: 'center' },
      { src: '/suite-bushvilla-b.jpg', position: 'center' },
      { src: '/suite-bushvilla-c.jpg', position: 'center' },
      { src: '/suite-bushvilla-d.jpg', position: 'center' },
    ],
  },
]

export const suitesBySlug: Record<string, Suite> = Object.fromEntries(
  allSuites.map(s => [s.slug, s])
)

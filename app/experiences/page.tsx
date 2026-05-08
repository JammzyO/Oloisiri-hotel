import type { Metadata } from 'next'
import DiscoverClient from './DiscoverClient'

export const metadata: Metadata = {
  title: 'Discover — Oloisiri Namanga Hotel',
  description:
    'Two dining outlets, two event spaces, and a borderland location 163 km from Nairobi, 50 km from Amboseli, and 110 km from Arusha. Everything that makes Oloisiri more than a place to sleep.',
}

export default function DiscoverPage() {
  return <DiscoverClient />
}

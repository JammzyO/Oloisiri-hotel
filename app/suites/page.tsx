import type { Metadata } from 'next'
import SuitesHero from '@/components/suites/SuitesHero'
import SuiteListings from '@/components/suites/SuiteListings'
import BookingPrompt from '@/components/suites/BookingPrompt'

export const metadata: Metadata = {
  title: 'Accommodation — Oloisiri Namanga Hotel',
  description:
    'Accommodation at Oloisiri Namanga Hotel — from garden-level standard rooms to the top-floor Luxury Room, each with a private balcony and views of Kilimanjaro or the surrounding hills.',
}

export default function SuitesPage() {
  return (
    <>
      <SuitesHero />
      <SuiteListings />
      <BookingPrompt />
    </>
  )
}

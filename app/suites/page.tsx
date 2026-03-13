import type { Metadata } from 'next'
import SuitesHero from '@/components/suites/SuitesHero'
import SuiteListings from '@/components/suites/SuiteListings'
import BookingPrompt from '@/components/suites/BookingPrompt'

export const metadata: Metadata = {
  title: 'Suites',
  description:
    'Twenty-four handcrafted suites at Oloisiri Namanga Hotel — from garden-level Savannah Suites to the private Bush Villa, each designed for the discerning guest.',
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

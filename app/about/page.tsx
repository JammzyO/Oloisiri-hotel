import type { Metadata } from 'next'
import AboutPageComponent from '@/components/about/AboutPage'

export const metadata: Metadata = { title: 'About — Oloisiri Namanga Hotel' }

export default function AboutPage() {
  return <AboutPageComponent />
}

import type { Metadata } from 'next'
import ContactPageComponent from '@/components/contact/ContactPage'

export const metadata: Metadata = { title: 'Contact & Reservations' }

export default function ContactPage() {
  return <ContactPageComponent />
}

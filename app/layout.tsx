import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import WhatsAppButton from '@/components/WhatsAppButton'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.oloisirihotel.com'),
  title: {
    default: 'Oloisiri Namanga Hotel',
    template: '%s — Oloisiri Namanga Hotel',
  },
  description:
    'A sanctuary at the edge of two nations. Luxury safari hotel on the Kenya–Tanzania border, overlooking Mount Kilimanjaro.',
  openGraph: {
    siteName: 'Oloisiri Namanga Hotel',
    locale: 'en_KE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body>
        <Sidebar />
        <WhatsAppButton />
        <main className="main-content">{children}</main>
      </body>
    </html>
  )
}

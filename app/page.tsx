import Hero from '@/components/home/Hero'
import ReservationBar from '@/components/home/ReservationBar'
import Welcome from '@/components/home/Welcome'
import Amenities from '@/components/home/Amenities'
import Suites from '@/components/home/Suites'
import Facilities from '@/components/home/Facilities'
import InstagramFeed from '@/components/home/InstagramFeed'
import Footer from '@/components/home/Footer'

export const metadata = {
  title: 'Oloisiri Namanga Hotel — A Sanctuary at the Edge of Two Nations',
  description:
    'Where the wild meets the refined. A luxury safari hotel on the Kenya–Tanzania border, overlooking Mount Kilimanjaro.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <ReservationBar />
      <Welcome />
      <Amenities />
      <Suites />
      <Facilities />
      <InstagramFeed />
      <Footer />
    </>
  )
}

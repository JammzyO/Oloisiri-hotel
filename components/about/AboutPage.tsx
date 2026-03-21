'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './AboutPage.module.css'
import BeamsCanvas from './BeamsCanvas'

/* ─── useInView ──────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ─── Animated stat counter ─────────────────────────────── */
function AnimatedStat({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      const duration = 1800
      const start = Date.now()
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setCount(Math.round(eased * value))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])
  return (
    <div ref={ref} className={styles.stat}>
      <div className={styles.statNum}>{count}{suffix}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}

const WHY_ITEMS = [
  'A perfect weekend getaway',
  'A base for business travel',
  'The best conference facilities',
  'A cozy stopover on your journey',
  'Safari adventures in Amboseli',
  'A cultural cross-border trip to Tanzania',
  'Or simply a quiet escape into nature',
]

/* ─── Page ───────────────────────────────────────────────── */
export default function AboutPage() {
  const [loaded, setLoaded] = useState(false)

  const intro        = useInView(0.1)
  const location     = useInView(0.1)
  const rooms        = useInView(0.1)
  const rooftop      = useInView(0.1)
  const fb           = useInView(0.1)
  const meetings     = useInView(0.08)
  const gardens      = useInView(0.1)
  const lookingAhead = useInView(0.1)
  const why          = useInView(0.08)
  const cta          = useInView(0.15)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={styles.page}>

      {/* ── S1: Hero ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <BeamsCanvas />
        <div className={`${styles.heroTopBar} ${loaded ? styles.barIn : ''}`}>
          <span className={styles.heroEyebrow}>Namanga, Kenya — Est. 2024</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
            <span className={styles.heroCoords}>1°34′S · 36°47′E</span>
            <span className={styles.heroCoords}>Oloisiri &mdash; &ldquo;Blessings&rdquo; in the Maa language</span>
          </div>
        </div>
        <div className={`${styles.heroSweep} ${loaded ? styles.sweepIn : ''}`} aria-hidden="true" />
        <div className={styles.heroBottom}>
          <h1 className={`${styles.heroHeading} ${loaded ? styles.headingIn : ''}`}>
            <span className={styles.heroL1}>We built a hotel</span>
            <span className={styles.heroL2}>at a border crossing.</span>
          </h1>
        </div>
      </section>

      {/* ── S2: Intro ────────────────────────────────────────── */}
      <section
        ref={intro.ref}
        className={`${styles.introSection} ${intro.inView ? styles.inView : ''}`}
      >
        <div className={styles.introInner}>
          <p className={styles.introText}>
            The name Oloisiri comes from the Maa language, meaning &lsquo;Blessings.&rsquo; True to its name,
            Oloisiri Hotel Namanga is where comfort, elegance, and warm African hospitality come
            together to create unforgettable experiences.
          </p>
        </div>
      </section>

      {/* ── S3: Stats strip ──────────────────────────────────── */}
      <section className={styles.statsSection}>
        <div className={styles.statsInner}>
          <AnimatedStat value={40}  label="Rooms & suites" />
          <div className={styles.statDivider} aria-hidden="true" />
          <AnimatedStat value={3}  suffix="+" label="Dining experiences" />
          <div className={styles.statDivider} aria-hidden="true" />
          <AnimatedStat value={50}  suffix="km" label="From Amboseli National Park" />
          <div className={styles.statDivider} aria-hidden="true" />
          <AnimatedStat value={5}  suffix="★" label="Guest rating" />
        </div>
      </section>

      {/* ── S4: Location ─────────────────────────────────────── */}
      <section
        ref={location.ref}
        className={`${styles.locationSection} ${location.inView ? styles.inView : ''}`}
      >
        <div className={styles.locationInner}>
          <span className={styles.eyebrowLight}>Location</span>
          <h2 className={styles.locationHeading}>A Gateway to Amboseli &amp; Beyond</h2>
          <p className={styles.locationBody}>
            Nestled at the foot of the Namanga Hills, and just off the Nairobi–Namanga Highway, our
            hotel offers a perfect gateway to Amboseli National Park, Arusha in Tanzania, and
            sweeping views of Mount Kilimanjaro and Longido Hills.
          </p>
        </div>
      </section>

      {/* ── S5: Rooms ────────────────────────────────────────── */}
      <section
        ref={rooms.ref}
        className={`${styles.roomsSection} ${rooms.inView ? styles.inView : ''}`}
      >
        <div className={styles.roomsInner}>
          <div className={styles.roomsLeft}>
            <span className={styles.eyebrow}>Accommodation</span>
            <h2 className={styles.sectionHeading}>Rooms Made to Tempt You</h2>
            <p className={styles.sectionBody}>
              Our rooms blend cozy charm with modern luxury. Each space is designed to invite
              relaxation — with elegant interiors, private balconies, and panoramic views that
              tempt you to stay one more night. At Oloisiri, it&rsquo;s never easy to leave.
            </p>
            <Link href="/suites" className={styles.sectionLink}>Explore the Rooms</Link>
          </div>
          <div className={styles.roomsRight}>
            <div className={styles.roomsImageWrap}>
              <Image
                src="/about-room-1.jpg"
                alt="Oloisiri — room interior"
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── S6: Rooftop ──────────────────────────────────────── */}
      <section
        ref={rooftop.ref}
        className={`${styles.rooftopSection} ${rooftop.inView ? styles.inView : ''}`}
      >
        <div className={styles.rooftopInner}>
          <span className={styles.eyebrowLight}>The Rooftop</span>
          <h2 className={styles.rooftopHeading}>Rooftop Views You&rsquo;ll Never Forget</h2>
          <p className={styles.rooftopBody}>
            From our rooftop lounges, soak in panoramic views of Kilimanjaro, the Namanga Hills,
            and the Longido Hills. Whether at sunrise, sunset, or under the stars, these moments
            create memories you truly won&rsquo;t want to leave behind.
          </p>
        </div>
      </section>

      {/* ── S7: Food & Beverage ──────────────────────────────── */}
      <section
        ref={fb.ref}
        className={`${styles.fbSection} ${fb.inView ? styles.inView : ''}`}
      >
        <div className={styles.fbInner}>
          <div className={styles.fbLeft}>
            <div className={styles.fbImageWrap}>
              <Image
                src="/images/restaurant-4.jpeg"
                alt="Oloisiri dining"
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </div>
          <div className={styles.fbRight}>
            <span className={styles.eyebrow}>Dining</span>
            <h2 className={styles.sectionHeading}>Food &amp; Beverage &ndash; A Taste of Namanga</h2>
            <p className={styles.sectionBody}>
              Our Food &amp; Beverage offerings bring you the true taste of Namanga delicacies. With bars
              that boast majestic views, an elegant restaurant, outdoor deck, and tranquil gardens,
              every meal is crafted to be an experience in itself — casual, celebratory, or simply indulgent.
            </p>
            <Link href="/experiences" className={styles.sectionLink}>Discover Dining</Link>
          </div>
        </div>
      </section>

      {/* ── S8: Meetings & Conferences ───────────────────────── */}
      <section
        ref={meetings.ref}
        className={`${styles.meetingsSection} ${meetings.inView ? styles.inView : ''}`}
      >
        <div className={styles.meetingsInner}>
          <span className={styles.eyebrowLight}>Business</span>
          <h2 className={styles.meetingsHeading}>Meetings &amp; Conferences</h2>
          <p className={styles.meetingsBody}>
            At Oloisiri Hotel, our meeting and conference facilities offer nothing but the best.
            Each venue is carefully designed to combine functionality with comfort, making them ideal
            for everything from intimate boardroom sessions to large gatherings. Business and leisure
            meet seamlessly here.
          </p>
        </div>
      </section>

      {/* ── S9: Gardens ──────────────────────────────────────── */}
      <section
        ref={gardens.ref}
        className={`${styles.gardensSection} ${gardens.inView ? styles.inView : ''}`}
      >
        <div className={styles.gardensInner}>
          <div className={styles.gardensLeft}>
            <div className={styles.gardensImageWrap}>
              <Image
                src="/images/hero-garden.jpeg"
                alt="Oloisiri gardens"
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </div>
          <div className={styles.gardensRight}>
            <span className={styles.eyebrow}>Events</span>
            <h2 className={styles.sectionHeading}>Our Gardens &ndash; For Life&rsquo;s Special Moments</h2>
            <p className={styles.sectionBody}>
              Our beautiful gardens are the heart of Oloisiri. Perfect for weddings, outdoor parties,
              and private celebrations, they offer a serene, enchanting backdrop that turns every
              occasion into a cherished memory.
            </p>
          </div>
        </div>
      </section>

      {/* ── S10: Looking Ahead ───────────────────────────────── */}
      <section
        ref={lookingAhead.ref}
        className={`${styles.lookingAheadSection} ${lookingAhead.inView ? styles.inView : ''}`}
      >
        <div className={styles.lookingAheadInner}>
          <div className={styles.lookingAheadLeft}>
            <span className={styles.eyebrow}>Looking Ahead</span>
            <h2 className={styles.sectionHeading}>Always Evolving</h2>
          </div>
          <div className={styles.lookingAheadRight}>
            <p className={styles.lookingAheadItem}>
              We&rsquo;re always evolving to give you more. Our swimming pool is coming soon, offering
              future moments of relaxation and refreshment for all our guests.
            </p>
            <p className={styles.lookingAheadItem}>
              Our lift will also be coming up soon — but until then, a little exercise goes a long way.
              And don&rsquo;t worry, our friendly porters are always ready to assist with your bags.
            </p>
            <p className={styles.lookingAheadItem}>
              We are proud to be a wheelchair and pram-friendly establishment, ensuring that every
              guest enjoys smooth access and a comfortable stay.
            </p>
          </div>
        </div>
      </section>

      {/* ── S11: Why Oloisiri ────────────────────────────────── */}
      <section
        ref={why.ref}
        className={`${styles.whySection} ${why.inView ? styles.inView : ''}`}
      >
        <div className={styles.whyInner}>
          <div className={styles.whyLeft}>
            <span className={styles.eyebrowLight}>The case for Oloisiri</span>
            <h2 className={styles.whyHeading}>Why Oloisiri?</h2>
            <p className={styles.whyIntro}>Because here, everyone is well catered for. We offer:</p>
          </div>
          <ul className={styles.whyList}>
            {WHY_ITEMS.map((item, i) => (
              <li
                key={i}
                className={styles.whyItem}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── S12: CTA / Tagline ───────────────────────────────── */}
      <section
        ref={cta.ref}
        className={`${styles.ctaSection} ${cta.inView ? styles.inView : ''}`}
      >
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaHeading}>Come and see it for yourself.</h2>
          <p className={styles.ctaSubtext}>
            Oloisiri Hotel Namanga &mdash; Where Serenity Meets Hospitality.
          </p>
          <Link href="/reserve" className={styles.ctaBtn}>
            Begin Planning Your Visit
          </Link>
        </div>
      </section>

    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './experiences.module.css'

// ── Data ──────────────────────────────────────────────────────────────────────

const VENUES = [
  {
    name: 'Ormarrei Family Restaurant',
    desc: 'Warm and unhurried. East African produce, cooked well, served without fuss. Open all day.',
    label: 'Ormarrei Restaurant',
  },
  {
    name: 'Olakira Sky Bar',
    desc: 'The border stretches south, the sky does the rest. Come for sundowners. Stay longer than you planned.',
    label: 'Olakira Sky Bar',
  },
  {
    name: 'Madiba Sky Lounge',
    desc: 'The highest seat in the house. A rooftop built for the kind of evening you will describe to people for years.',
    label: 'Madiba Sky Lounge',
  },
  {
    name: 'Ormarrei Lounge',
    desc: 'Casual drinks. Good company. No dress code. No agenda.',
    label: 'Ormarrei Lounge',
  },
]

const NUMBERS = [
  { target: 163, delay: 0,   suffix: 'from Nairobi'  },
  { target: 50,  delay: 200, suffix: 'from Amboseli' },
  { target: 110, delay: 400, suffix: 'from Arusha'   },
]

const STRIPS = [
  {
    name: 'Nairobi',
    desc: 'The A104 runs direct — no diversions. Under two hours on a clear morning.',
    stat: '163 km',
  },
  {
    name: 'Amboseli',
    desc: "Africa's most iconic elephant country, an hour north. We arrange transport and guide connections.",
    stat: '50 km',
  },
  {
    name: 'Arusha',
    desc: 'Cross into Tanzania at the border below. Gateway to Serengeti, Ngorongoro, and Kilimanjaro.',
    stat: '110 km',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

function useInView(rootMargin = '-10% 0px -10% 0px') {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect() } },
      { rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return { ref, inView }
}

// ── Section 1: Dine ───────────────────────────────────────────────────────────

function DineSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [activeSlot, setActiveSlot] = useState<number | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect() } },
      { rootMargin: '-10% 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={sectionRef}
      className={`${styles.dineSection}${inView ? ` ${styles.sectionInView}` : ''}`}
      aria-label="Dine"
    >
      {/* Left: crossfade bg column */}
      <div className={styles.dineLeft}>
        <div className={styles.dineLeftBg} aria-hidden="true">
          {VENUES.map((_, i) => (
            <div
              key={i}
              className={styles.dineLeftBgSlot}
              style={{ opacity: activeSlot === i ? 1 : 0 }}
            >
              {i === 0 && (
                <Image
                  src="/images/restaurant-4.jpeg"
                  alt=""
                  fill
                  sizes="45vw"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>
          ))}
        </div>
        <div
          className={styles.dineLeftOverlay}
          style={{ opacity: activeSlot !== null ? 0.5 : 0.7 }}
        />
        <div className={styles.dineLeftContent}>
          <span className={styles.dineEyebrow}>Food &amp; Drink</span>
          <h2 className={styles.dineHeading}>
            <span className={styles.headLineLeft}>Four Reasons</span>
            <span className={styles.headLineRight}>to Linger.</span>
          </h2>
          <p className={`${styles.dineBody} ${styles.bodyReveal}`}>
            From an all-day family restaurant to a rooftop bar where the border stretches to the
            horizon — every outlet at Oloisiri is built around the same idea: good food, unhurried
            service, and the right view.
          </p>
          <p className={`${styles.dineBody} ${styles.bodyReveal}`}>
            Our Food &amp; Beverage offerings bring you the true taste of Namanga delicacies. With bars
            that boast majestic views, an elegant restaurant, outdoor deck, and tranquil gardens,
            every meal is crafted to be an experience in itself — casual, celebratory, or simply indulgent.
          </p>
        </div>
      </div>

      {/* Right: 2×2 venue grid */}
      <div className={styles.dineRight}>
        <div className={styles.dineGrid}>
          {VENUES.map((venue, i) => (
            <div
              key={venue.name}
              className={styles.venueCard}
              onMouseEnter={() => setActiveSlot(i)}
              onMouseLeave={() => setActiveSlot(null)}
            >
              <div className={styles.venueImgSlot}>
                {i === 0 && (
                  <Image
                    src="/images/restaurant-2.jpeg"
                    alt={venue.name}
                    fill
                    sizes="(max-width:900px) 100vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                )}
                <span className={styles.venueImgLabel}>{venue.label}</span>
              </div>
              <div className={styles.venueText}>
                <h3 className={styles.venueName}>{venue.name}</h3>
                <p className={styles.venueDesc}>{venue.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Section 2: Location ───────────────────────────────────────────────────────

function LocationSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const rafRefs = useRef<number[]>([])
  const [counts, setCounts] = useState([0, 0, 0])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        io.disconnect()

        NUMBERS.forEach(({ target, delay }, i) => {
          const timeout = setTimeout(() => {
            const start = performance.now()
            const tick = (now: number) => {
              const t = Math.min((now - start) / 1500, 1)
              setCounts(prev => {
                const next = [...prev]
                next[i] = Math.round(easeOutQuart(t) * target)
                return next
              })
              if (t < 1) {
                rafRefs.current[i] = requestAnimationFrame(tick)
              }
            }
            rafRefs.current[i] = requestAnimationFrame(tick)
          }, delay)
          rafRefs.current.push(timeout as unknown as number)
        })
      },
      { rootMargin: '-10% 0px -10% 0px' }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      rafRefs.current.forEach(id => {
        cancelAnimationFrame(id)
        clearTimeout(id)
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`${styles.locationSection}${inView ? ` ${styles.sectionInView}` : ''}`}
      aria-label="Location"
    >
      <span className={styles.locationEyebrow}>Where We Are</span>

      <div className={styles.locationHeadline} aria-hidden="true">
        {NUMBERS.map(({ suffix }, i) => (
          <div key={i} className={styles.numLine}>
            <span className={styles.numBig}>{counts[i]}</span>
            <span className={styles.numUnit}>km</span>
            <span className={styles.numSuffix}>{suffix}</span>
          </div>
        ))}
      </div>

      <div className={styles.locationStrips}>
        {STRIPS.map(strip => (
          <div key={strip.name} className={styles.locationStrip}>
            <div className={styles.stripLeft}>
              <span className={styles.stripName}>{strip.name}</span>
            </div>
            <div className={styles.stripMiddle}>
              <p className={styles.stripDesc}>{strip.desc}</p>
            </div>
            <div className={styles.stripRight}>
              <span className={styles.stripArrow}>→</span>
              <span className={styles.stripStat}>{strip.stat}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Section 3: Gather ─────────────────────────────────────────────────────────

function GatherSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)
  const topRef     = useRef<HTMLDivElement>(null)
  const botRef     = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect() } },
      { rootMargin: '-10% 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Parallax — top image moves at 0.15× offset, bottom at 0.05×
  useEffect(() => {
    const onScroll = () => {
      const container = rightRef.current
      const top = topRef.current
      const bot = botRef.current
      if (!container || !top || !bot) return
      const rect = container.getBoundingClientRect()
      const offset = window.innerHeight / 2 - rect.top - rect.height / 2
      top.style.transform = `translateY(${offset * 0.15}px)`
      bot.style.transform = `translateY(${offset * 0.05}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`${styles.gatherSection}${inView ? ` ${styles.sectionInView}` : ''}`}
      aria-label="Meetings and Events"
    >
      <div className={styles.gatherLeft}>
        <span className={styles.gatherEyebrow}>Meetings &amp; Events</span>
        <h2 className={styles.gatherHeading}>
          <span className={styles.headLineLeft}>A Rooftop</span>
          <span className={styles.headLineRight}>for Any Occasion.</span>
        </h2>
        <p className={`${styles.gatherBody} ${styles.bodyReveal}`}>
          Oloisiri has two dedicated event spaces — the intimate Emanyatta Conference Room for focused
          groups, and the Emaa Rooftop Conference Hall for up to 250 guests.
        </p>
        <p
          className={`${styles.gatherBody} ${styles.gatherBodyLast} ${styles.bodyReveal}`}
          style={{ transitionDelay: '310ms' }}
        >
          Both include full AV, catering, and the kind of horizon that makes every presentation
          look better than it deserves.
        </p>
        <Link href="/contact" className={styles.gatherBtn}>
          Enquire About Events
        </Link>
      </div>

      <div className={styles.gatherRight} ref={rightRef}>
        <div className={styles.gatherImgWrap}>
          <div
            ref={topRef}
            className={`${styles.gatherImgPlaceholder} ${styles.gatherImgTop}`}
          >
            <span className={styles.gatherImgLabel}>Emaa Rooftop Hall</span>
          </div>
          <div
            ref={botRef}
            className={`${styles.gatherImgPlaceholder} ${styles.gatherImgBottom}`}
          >
            <span className={styles.gatherImgLabel}>Emanyatta Conference Room</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DiscoverClient() {
  return (
    <div className={styles.page}>

      {/* Teaser */}
      <div className={styles.teaser}>
        <span className={styles.teaserEyebrow}>Discover Oloisiri</span>
        <p className={styles.teaserText}>
          Four dining outlets. Two event spaces. A location three countries cannot ignore.
        </p>
        <Link href="/suites" className={styles.teaserLink}>
          View Accommodation →
        </Link>
      </div>

      {/* Section 1: Dine */}
      <DineSection />

      {/* Section 2: Location */}
      <LocationSection />

      {/* Section 3: Gather */}
      <GatherSection />

      {/* Section 4: CTA split */}
      <div className={styles.ctaSection} aria-label="Reserve">
        <div className={styles.ctaLeft}>
          <span className={styles.ctaTextLeft}>Begin Your</span>
        </div>
        <div className={styles.ctaRight}>
          <span className={styles.ctaTextRight}>Story Here.</span>
        </div>
        <div className={styles.ctaBtnWrap}>
          <Link href="/contact" className={styles.ctaBtn}>
            Begin Planning Your Visit
          </Link>
        </div>
      </div>

    </div>
  )
}

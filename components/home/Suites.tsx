'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Suites.module.css'

const SUITES = [
  {
    name: 'Luxury Room',
    category: 'Top Floor',
    guests: '2 Guests',
    size: '45 m²',
    rate: 'From KES 38,000',
    src: '/images/rooms/luxury-view-1.jpeg',
    alt: 'Luxury Room — bedroom view',
    slug: 'luxury-room',
  },
  {
    name: 'Standard King',
    category: 'Garden Level',
    guests: '2 Guests',
    size: '32 m²',
    rate: 'From KES 18,000',
    src: '/images/rooms/standard-king-view-1.jpeg',
    alt: 'Standard King — bedroom view',
    slug: 'standard-king',
  },
  {
    name: 'Twin Room',
    category: 'Garden Level',
    guests: '2 Guests',
    size: '30 m²',
    rate: 'From KES 16,000',
    src: '/images/rooms/twin-room-view-1.jpeg',
    alt: 'Twin Room — bedroom view',
    slug: 'twin-room',
  },
  {
    name: 'Family Room',
    category: 'Garden Level',
    guests: '4 Guests',
    size: '55 m²',
    rate: 'From KES 28,000',
    src: '/images/rooms/family-room-view-1.jpeg',
    alt: 'Family Room — bedroom view',
    slug: 'family-room',
  },
  {
    name: 'Interleading Suite',
    category: 'Garden Level',
    guests: '4–6 Guests',
    size: '72 m²',
    rate: 'From KES 42,000',
    src: '/images/rooms/interleading-view-1.jpeg',
    alt: 'Interleading Suite — bedroom view',
    slug: 'interleading-suite',
  },
]

const N = SUITES.length

// Returns slot position relative to active: -2, -1, 0, 1, 2
function getSlot(idx: number, active: number): number {
  let slot = ((idx - active) % N + N) % N
  if (slot > Math.floor(N / 2)) slot -= N
  return slot
}

export default function Suites() {
  const [active, setActive] = useState(0)
  const [spacing, setSpacing] = useState(395) // center-to-center distance, px
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  // Scroll reveal
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Responsive spacing
  useEffect(() => {
    function update() {
      const w = window.innerWidth
      if (w <= 600) setSpacing(245)
      else if (w <= 900) setSpacing(310)
      else setSpacing(395)
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  const prev = useCallback(() => setActive(a => (a - 1 + N) % N), [])
  const next = useCallback(() => setActive(a => (a + 1) % N), [])

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${inView ? styles.inView : ''}`}
      aria-label="Our Suites"
    >
      <div className={styles.inner}>

        <div className={styles.header}>
          <span className={styles.eyebrow}>Our Suites</span>
          <h2 className={styles.heading}>
            Handcrafted for the{' '}
            <em className={styles.headingItalic}>Discerning Guest</em>
          </h2>
        </div>

        <div className={styles.carouselWrap}>

          {/* ── Left arrow ──────────────────────────────── */}
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={prev}
            aria-label="Previous suite"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* ── Viewport ─────────────────────────────────── */}
          <div className={styles.carousel} aria-live="polite">
            {SUITES.map((suite, i) => {
              const slot = getSlot(i, active)
              const isCenter = slot === 0
              const abslot = Math.abs(slot)

              return (
                <div
                  key={suite.slug}
                  className={styles.cardWrap}
                  style={{
                    transform: `translateX(calc(-50% + ${slot * spacing}px)) scale(${isCenter ? 1.02 : 1})`,
                    opacity: isCenter ? 1 : abslot === 1 ? 0.5 : 0,
                    pointerEvents: abslot <= 1 ? 'auto' : 'none',
                    zIndex: isCenter ? 2 : 1,
                  }}
                >
                  <Link
                    href={`/suites/${suite.slug}`}
                    className={`${styles.card} ${isCenter ? styles.cardCenter : ''}`}
                    aria-label={`${suite.name} — view details`}
                    onClick={e => {
                      if (!isCenter) {
                        e.preventDefault()
                        slot < 0 ? prev() : next()
                      }
                    }}
                    tabIndex={isCenter ? 0 : -1}
                  >
                    <div className={styles.cardImage}>
                      <Image
                        src={suite.src}
                        alt={suite.alt}
                        fill
                        sizes="(max-width: 600px) 220px, (max-width: 900px) 280px, 360px"
                        style={{ objectFit: 'cover' }}
                        priority={i === 0}
                      />
                    </div>

                    <div className={styles.cardOverlay}>
                      <span className={styles.suiteCategory}>{suite.category}</span>
                      <h3 className={styles.suiteName}>{suite.name}</h3>
                      <div className={styles.suiteMeta}>
                        <span className={styles.suiteMetaItem}>{suite.guests}</span>
                        <span className={styles.suiteMetaDot}>·</span>
                        <span className={styles.suiteMetaItem}>{suite.size}</span>
                      </div>
                      <span className={styles.suiteRate}>{suite.rate}</span>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>

          {/* ── Right arrow ─────────────────────────────── */}
          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={next}
            aria-label="Next suite"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>

        <div className={styles.cta}>
          <a href="/suites" className={styles.ctaBtn}>View All Suites</a>
        </div>

      </div>
    </section>
  )
}

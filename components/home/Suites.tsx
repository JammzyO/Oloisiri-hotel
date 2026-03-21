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

// Track: [room4_clone, room0, room1, room2, room3, room4, room0_clone]
// Real cards at indices 1..N, clones at 0 and N+1 for seamless looping
const TRACK = [SUITES[N - 1], ...SUITES, SUITES[0]]

// Pixel configs per breakpoint — must match CSS values exactly
type Cfg = { step: number; offset: number }
const CFG_DESKTOP: Cfg = { step: 340, offset: 130 } // card=320, gap=20, vpW=580
const CFG_TABLET:  Cfg = { step: 256, offset: 96  } // card=240, gap=16, vpW=432
const CFG_MOBILE:  Cfg = { step: 172, offset: 64  } // card=160, gap=12, vpW=288

export default function Suites() {
  // trackIdx=1 → room0 centered at start
  const [trackIdx, setTrackIdx] = useState(1)
  const [jumping, setJumping] = useState(false)
  const [cfg, setCfg] = useState<Cfg>(CFG_DESKTOP)
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

  // Responsive config — must stay in sync with CSS breakpoints
  useEffect(() => {
    function update() {
      const w = window.innerWidth
      if (w <= 600) setCfg(CFG_MOBILE)
      else if (w <= 900) setCfg(CFG_TABLET)
      else setCfg(CFG_DESKTOP)
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  // Infinite loop: after animation ends, silently jump from clone to real card
  useEffect(() => {
    if (trackIdx !== 0 && trackIdx !== N + 1) return
    const timer = setTimeout(() => {
      const jumpTo = trackIdx === 0 ? N : 1
      setJumping(true)
      setTrackIdx(jumpTo)
      // Re-enable transition after DOM has updated with new position
      requestAnimationFrame(() => requestAnimationFrame(() => setJumping(false)))
    }, 460) // just after 450ms transition
    return () => clearTimeout(timer)
  }, [trackIdx])

  const prev = useCallback(() => {
    if (!jumping) setTrackIdx(i => i - 1)
  }, [jumping])

  const next = useCallback(() => {
    if (!jumping) setTrackIdx(i => i + 1)
  }, [jumping])

  // Track translateX: centers the active card in the viewport
  const trackX = cfg.offset - trackIdx * cfg.step

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
          <button className={styles.arrow} onClick={prev} aria-label="Previous suite">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* ── Viewport — clips the sliding track ──────── */}
          <div className={styles.viewport}>
            <div
              className={styles.track}
              style={{
                transform: `translateX(${trackX}px)`,
                transition: jumping ? 'none' : 'transform 450ms cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}
            >
              {TRACK.map((suite, i) => {
                const isCenter = i === trackIdx
                const isLeft   = i === trackIdx - 1
                const isRight  = i === trackIdx + 1

                return (
                  <div
                    key={i}
                    className={`${styles.cardWrap} ${isCenter ? styles.cardCenter : styles.cardSide}`}
                  >
                    {isCenter ? (
                      /* Center: navigate to suite page on click */
                      <Link
                        href={`/suites/${suite.slug}`}
                        className={styles.card}
                        aria-label={`${suite.name} — view details`}
                      >
                        <div className={styles.cardImage}>
                          <Image
                            src={suite.src}
                            alt={suite.alt}
                            fill
                            sizes="(max-width:600px) 160px, (max-width:900px) 240px, 320px"
                            style={{ objectFit: 'cover' }}
                            priority={i === 1}
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
                    ) : (
                      /* Side: click advances carousel in that direction */
                      <div
                        className={styles.card}
                        onClick={isLeft ? prev : isRight ? next : undefined}
                        style={{ cursor: isLeft || isRight ? 'pointer' : 'default' }}
                        aria-hidden="true"
                      >
                        <div className={styles.cardImage}>
                          <Image
                            src={suite.src}
                            alt=""
                            fill
                            sizes="(max-width:600px) 160px, (max-width:900px) 240px, 320px"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Right arrow ─────────────────────────────── */}
          <button className={styles.arrow} onClick={next} aria-label="Next suite">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
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

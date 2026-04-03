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
    rate: 'Coming Soon',
    src: '/images/rooms/luxury-view-1.jpeg',
    alt: 'Luxury Room — bedroom view',
    slug: 'luxury-room',
    available: false,
  },
  {
    name: 'Standard Queen',
    category: 'Garden Level',
    guests: '2 Guests',
    size: '32 m²',
    rate: 'From KES 6,500',
    src: '/images/rooms/standard-king-view-1.jpeg',
    alt: 'Standard Queen — bedroom view',
    slug: 'standard-king',
  },
  {
    name: 'Twin Room',
    category: 'Garden Level',
    guests: '2 Guests',
    size: '30 m²',
    rate: 'KES 8,000',
    src: '/images/rooms/twin-room-view-1.jpeg',
    alt: 'Twin Room — bedroom view',
    slug: 'twin-room',
  },
  {
    name: 'Family Room',
    category: 'Garden Level',
    guests: '4 Guests',
    size: '55 m²',
    rate: 'Coming Soon',
    src: '/images/rooms/family-room-view-1.jpeg',
    alt: 'Family Room — bedroom view',
    slug: 'family-room',
    available: false,
  },
  {
    name: 'Deluxe King',
    category: 'Garden Level',
    guests: '2 Guests',
    size: '72 m²',
    rate: 'KES 8,500',
    src: '/images/rooms/interleading-view-1.jpeg',
    alt: 'Deluxe King — bedroom view',
    slug: 'interleading-suite',
  },
]

const N = SUITES.length

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

// Each breakpoint: card width, gap — must match CSS exactly
type Cfg = { cardW: number; gap: number }
const CFG_DESKTOP: Cfg = { cardW: 300, gap: 20 }
const CFG_TABLET:  Cfg = { cardW: 180, gap: 14 }
const CFG_MOBILE:  Cfg = { cardW: 140, gap: 12 }

// Five slots rendered at all times: hidden-left, left, center, right, hidden-right
const OFFSETS = [-2, -1, 0, 1, 2] as const

export default function Suites() {
  const [center, setCenter] = useState(0)
  const [busy,   setBusy]   = useState(false)
  const [cfg,    setCfg]    = useState<Cfg>(CFG_DESKTOP)
  const sectionRef           = useRef<HTMLElement>(null)
  const [inView, setInView]  = useState(false)

  // Scroll reveal
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Responsive config — stays in sync with CSS breakpoints
  useEffect(() => {
    function update() {
      const w = window.innerWidth
      setCfg(w <= 600 ? CFG_MOBILE : w <= 900 ? CFG_TABLET : CFG_DESKTOP)
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  const go = useCallback((dir: 1 | -1) => {
    if (busy) return
    setBusy(true)
    setCenter(c => mod(c + dir, N))
    setTimeout(() => setBusy(false), 460)
  }, [busy])

  const prev = useCallback(() => go(-1), [go])
  const next = useCallback(() => go(1),  [go])

  // step  = distance between adjacent slot centres (= cardW + gap)
  // Using key={suiteIdx}: React reuses the same DOM node as a suite moves between
  // slots → the browser sees the transform change and fires the CSS transition.
  // The one suite that wraps (e.g. slot -2 → +2) is always opacity:0, so the
  // instantaneous jump is invisible.
  const step     = cfg.cardW + cfg.gap
  const halfCard = cfg.cardW / 2

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

          <button className={styles.arrow} onClick={prev} aria-label="Previous suite">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/*
            Viewport is exactly 3 cards wide (3×cardW + 2×gap).
            overflow:hidden hides only the ±2 slots entering/exiting.
            The 3 visible cards (slots -1, 0, +1) are never clipped.
          */}
          <div className={styles.viewport}>
            {OFFSETS.map(offset => {
              const suiteIdx = mod(center + offset, N)
              const suite    = SUITES[suiteIdx]
              const isCenter = offset === 0
              const isHidden = Math.abs(offset) === 2
              const isLeft   = offset === -1
              const isRight  = offset === 1

              // translateX centres the card at its slot (left:50% in CSS)
              const tx = offset * step - halfCard

              return (
                <div
                  key={suiteIdx}
                  className={`${styles.cardWrap} ${isCenter ? styles.cardCenter : ''}`}
                  style={{
                    transform: `translateX(${tx}px)`,
                    opacity:   isCenter ? 1 : isHidden ? 0 : 0.5,
                    pointerEvents: isHidden ? 'none' : 'auto',
                    cursor: isLeft || isRight ? 'pointer' : 'default',
                  }}
                  onClick={isLeft ? prev : isRight ? next : undefined}
                  aria-hidden={isCenter ? undefined : true}
                >
                  {isCenter ? (
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
                          sizes="(max-width:600px) 140px, (max-width:900px) 180px, 300px"
                          style={{ objectFit: 'cover' }}
                          priority
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
                        <span className={`${styles.suiteRate} ${suite.available === false ? styles.suiteRateSoon : ''}`}>{suite.rate}</span>
                      </div>
                    </Link>
                  ) : (
                    <div className={styles.card}>
                      <div className={styles.cardImage}>
                        <Image
                          src={suite.src}
                          alt=""
                          fill
                          sizes="(max-width:600px) 140px, (max-width:900px) 180px, 300px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <button className={styles.arrow} onClick={next} aria-label="Next suite">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>

        {/* Mobile-only swipe carousel — hidden on desktop/tablet via CSS */}
        <div className={styles.mobileStrip}>
          {SUITES.map(suite => (
            <Link
              key={suite.slug}
              href={`/suites/${suite.slug}`}
              className={styles.mobileCard}
              aria-label={`${suite.name} — view details`}
            >
              <div className={styles.mobileCardImage}>
                <Image
                  src={suite.src}
                  alt={suite.alt}
                  fill
                  sizes="80vw"
                  style={{ objectFit: 'cover' }}
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
                <span className={styles.suiteRateVisible}>{suite.rate}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.cta}>
          <a href="/suites" className={styles.ctaBtn}>View All Suites</a>
        </div>

      </div>
    </section>
  )
}

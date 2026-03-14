'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './SuiteListings.module.css'

const suites = [
  {
    id: 0,
    name: 'Luxury Room',
    category: 'Top Floor',
    description:
      'The best room in the house. On clear mornings Kilimanjaro fills the window before you are fully awake. Elevated finishes, the quietest floor, and a balcony that earns its name.',
    guests: '2 Guests',
    size: '45 m²',
    rate: 'From KES 38,000',
    images: [
      { src: '/suite-kilimanjaro-a.jpg', position: 'center' },
      { src: '/suite-kilimanjaro-b.jpg', position: 'center' },
      { src: '/suite-kilimanjaro-c.jpg', position: 'center' },
    ],
    gradient: null,
  },
  {
    id: 1,
    name: 'Standard King',
    category: 'Garden Level',
    description:
      'Clean, well-finished, and exactly what a good hotel room should be. A proper bed, a proper shower, a balcony with views of the Namanga Hills. Nothing missing.',
    guests: '2 Guests',
    size: '32 m²',
    rate: 'From KES 18,000',
    images: [
      { src: '/suite-savannah-a.jpg', position: 'center' },
      { src: '/suite-savannah-b.jpg', position: 'center' },
      { src: '/suite-savannah-c.jpg', position: 'center' },
    ],
    gradient: null,
  },
  {
    id: 2,
    name: 'Twin Room',
    category: 'Garden Level',
    description:
      'The same standard as our King — two beds instead of one. Ideal for colleagues travelling together or friends who value their own space.',
    guests: '2 Guests',
    size: '30 m²',
    rate: 'From KES 16,000',
    images: [
      { src: '/suite-savannah-b.jpg', position: 'center' },
      { src: '/suite-savannah-c.jpg', position: 'center' },
    ],
    gradient: null,
  },
  {
    id: 3,
    name: 'Family Room',
    category: 'Garden Level',
    description:
      'Generous space for families. A layout that keeps everyone together without crowding anyone. Balcony, garden views, and enough room to actually unpack.',
    guests: '4 Guests',
    size: '55 m²',
    rate: 'From KES 28,000',
    images: [
      { src: '/suite-bushvilla-a.jpg', position: 'center' },
      { src: '/suite-bushvilla-b.jpg', position: 'center' },
      { src: '/suite-bushvilla-c.jpg', position: 'center' },
    ],
    gradient: null,
  },
  {
    id: 4,
    name: 'Interleading Suite',
    category: 'Garden Level',
    description:
      'Two rooms that connect. For families or groups who want space without separation — each room is fully self-contained, with a shared connecting door that can open or close as needed.',
    guests: '4–6 Guests',
    size: '72 m²',
    rate: 'From KES 42,000',
    images: [
      { src: '/suite-bushvilla-b.jpg', position: 'center' },
      { src: '/suite-bushvilla-c.jpg', position: 'center' },
      { src: '/suite-bushvilla-d.jpg', position: 'center' },
    ],
    gradient: null,
  },
]

function SuiteRow({ suite, index }: { suite: typeof suites[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const isReversed = index % 2 !== 0
  const hasImages = suite.images.length > 0
  const hasMultiple = suite.images.length > 1

  const prev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setImgIndex(i => (i - 1 + suite.images.length) % suite.images.length)
  }, [suite.images.length])

  const next = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setImgIndex(i => (i + 1) % suite.images.length)
  }, [suite.images.length])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id={suite.name.toLowerCase().replace(/\s+/g, '-')}
      className={`${styles.row} ${isReversed ? styles.rowReversed : ''} ${inView ? styles.inView : ''}`}
    >
      {/* Arch image */}
      <div className={styles.archWrap}>
        <div
          className={styles.archImage}
          style={!hasImages && suite.gradient ? { background: suite.gradient } : undefined}
          aria-label={suite.name}
        >
          {/* Crossfade slides */}
          {hasImages && suite.images.map((img, i) => (
            <div
              key={img.src}
              className={`${styles.slide} ${i === imgIndex ? styles.slideActive : ''}`}
            >
              <Image
                src={img.src}
                alt={`${suite.name} — view ${i + 1}`}
                fill
                sizes="(max-width: 960px) 280px, 320px"
                style={{ objectFit: 'cover', objectPosition: img.position }}
                priority={i === 0}
              />
            </div>
          ))}

          {/* Shimmer for gradient placeholders */}
          {!hasImages && <div className={styles.archShimmer} />}

          {/* Slideshow arrows — only when multiple images */}
          {hasMultiple && (
            <div className={styles.slideControls}>
              <button
                className={styles.slideArrow}
                onClick={prev}
                aria-label="Previous image"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className={styles.slideDots} aria-hidden="true">
                {suite.images.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.slideDot} ${i === imgIndex ? styles.slideDotActive : ''}`}
                    onClick={(e) => { e.stopPropagation(); setImgIndex(i) }}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>

              <button
                className={styles.slideArrow}
                onClick={next}
                aria-label="Next image"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
        <span className={styles.suiteNumber}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Text content */}
      <div className={styles.text}>
        <span className={styles.category}>{suite.category}</span>
        <h2 className={styles.suiteName}>{suite.name}</h2>
        <div className={styles.divider} aria-hidden="true" />
        <p className={styles.description}>{suite.description}</p>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {suite.guests}
          </span>
          <span className={styles.metaDot} aria-hidden="true">·</span>
          <span className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
            {suite.size}
          </span>
        </div>

        <div className={styles.footer}>
          <span className={styles.rate}>
            {suite.rate} <em className={styles.rateNight}>/ night</em>
          </span>
          <Link href={`/suites/${suite.name.toLowerCase().replace(/\s+/g, '-')}`} className={styles.cta}>
            View Suite
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuiteListings() {
  return (
    <section className={styles.section} aria-label="Suite listings">
      <div className={styles.inner}>
        {suites.map((suite, i) => (
          <SuiteRow key={suite.id} suite={suite} index={i} />
        ))}
      </div>
    </section>
  )
}

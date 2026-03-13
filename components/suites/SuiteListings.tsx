'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './SuiteListings.module.css'

const suites = [
  {
    id: 0,
    name: 'Savannah Suite',
    category: 'Garden Level',
    description:
      'Low to the land, the Savannah Suite opens onto a private terrace where the grass shifts with the morning wind. Woven textures, muted ochres, and the scent of cedar define a space that asks nothing of you but presence.',
    guests: '2 Guests',
    size: '68 m²',
    rate: 'From KES 42,000',
    images: [
      { src: '/suite-savannah-a.jpg', position: 'center' },
      { src: '/suite-savannah-b.jpg', position: 'center' },
      { src: '/suite-savannah-c.jpg', position: 'center' },
    ],
    gradient: null,
  },
  {
    id: 1,
    name: 'Kilimanjaro Suite',
    category: 'View Suite',
    description:
      'Rise early and the summit will be yours — framed in the floor-to-ceiling glass of the Kilimanjaro Suite. The mountain does not guarantee its presence, but the suite rewards patience. Linen, stone, and still air.',
    guests: '2 Guests',
    size: '84 m²',
    rate: 'From KES 54,000',
    images: [
      { src: '/suite-kilimanjaro-a.jpg', position: 'center' },
      { src: '/suite-kilimanjaro-b.jpg', position: 'center' },
      { src: '/suite-kilimanjaro-c.jpg', position: 'center' },
      { src: '/suite-kilimanjaro-d.jpg', position: 'center' },
    ],
    gradient: null,
  },
  {
    id: 2,
    name: 'Bush Villa',
    category: 'Private Villa',
    description:
      'The most secluded dwelling at Oloisiri. A private plunge pool, a dedicated butler, and a silence so complete it becomes its own presence. For those who seek not luxury, but depth.',
    guests: '4 Guests',
    size: '140 m²',
    rate: 'From KES 85,000',
    images: [
      { src: '/suite-bushvilla-a.jpg', position: 'center' },
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

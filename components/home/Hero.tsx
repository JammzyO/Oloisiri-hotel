'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Hero.module.css'

const slides = [
  {
    id: 0,
    src: '/hero-1.jpg',
    alt: 'Oloisiri infinity pool overlooking the savannah at dusk',
    objectPosition: 'center',
    headline1: 'Where the Wild',
    headline2: 'Meets the Refined.',
    sub: 'A sanctuary at the edge of two nations — Kenya and Tanzania.',
  },
  {
    id: 1,
    src: '/hero-2.jpg',
    alt: 'Oloisiri suite with warm natural light and yellow linen',
    objectPosition: 'center',
    headline1: 'A Sanctuary',
    headline2: 'Above the Plains.',
    sub: 'Twenty-four suites where stillness is the greatest indulgence.',
  },
  {
    id: 2,
    src: '/hero-3.jpg',
    alt: 'Breakfast at Oloisiri with views across the borderland plains',
    objectPosition: 'center 40%',
    headline1: 'Evenings Among',
    headline2: 'Ancient Embers.',
    sub: 'Dine beneath open skies as the borderland breathes around you.',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const goTo = useCallback((index: number) => {
    setCurrent(index)
    setAnimKey(k => k + 1)
  }, [])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, goTo])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo])

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 5500)
    return () => clearInterval(timer)
  }, [next])

  // Keyboard navigation
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [prev, next])

  const slide = slides[current]

  return (
    <section className={styles.hero} aria-label="Hero">

      {/* ── Slide backgrounds — real photos, crossfade ── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`${styles.slideBg} ${i === current ? styles.slideBgActive : ''}`}
          aria-hidden="true"
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: s.objectPosition }}
          />
          {/* Dark teal overlay for text legibility */}
          <div className={styles.slideOverlay} />
        </div>
      ))}

      {/* ── Frosted glass arch card — centred ── */}
      <div className={styles.cardWrap}>
        <div className={styles.archCard}>

          {/* Stars */}
          <div className={styles.stars} aria-label="Five stars">
            {'★★★★★'.split('').map((star, i) => (
              <span key={i} className={styles.star}>{star}</span>
            ))}
          </div>

          {/* Headline — key forces CSS animation re-run on slide change */}
          <h1 className={styles.headline} key={`h-${animKey}`}>
            <span className={styles.line1}>{slide.headline1}</span>
            <span className={styles.line2}>{slide.headline2}</span>
          </h1>

          <p className={styles.sub} key={`s-${animKey}`}>{slide.sub}</p>

          <Link href="/suites" className={styles.cta} key={`c-${animKey}`}>
            Discover Suites
          </Link>
        </div>
      </div>

      {/* ── Arrows ── */}
      <button className={`${styles.arrow} ${styles.arrowPrev}`} onClick={prev} aria-label="Previous slide">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button className={`${styles.arrow} ${styles.arrowNext}`} onClick={next} aria-label="Next slide">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Slide counter ── */}
      <div className={styles.counter} aria-live="polite" aria-atomic="true">
        <span className={styles.counterCurrent}>{String(current + 1).padStart(2, '0')}</span>
        <span className={styles.counterSep}> / </span>
        <span className={styles.counterTotal}>{String(slides.length).padStart(2, '0')}</span>
      </div>

    </section>
  )
}

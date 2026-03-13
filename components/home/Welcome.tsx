'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './Welcome.module.css'

export default function Welcome() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.inView)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Welcome">
      <div className={styles.inner}>

        {/* Left arch — suite with African portrait art */}
        <div className={styles.archLeft} aria-hidden="true">
          <Image
            src="/ig-1.jpg"
            alt="Oloisiri suite interior with African portrait art"
            fill
            sizes="420px"
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
          />
        </div>

        {/* Center text */}
        <div className={styles.textBlock}>
          <span className={styles.eyebrow}>Welcome to Oloisiri</span>

          <h2 className={styles.heading}>
            Exceptional Hospitality and
            <br />
            Unmatched{' '}
            <em className={styles.headingItalic}>Relaxation.</em>
          </h2>

          <div className={styles.rating}>
            <span className={styles.stars} aria-label="Five gold stars">★★★★★</span>
            <span className={styles.ratingText}>
              4.9 out of 5 &middot; Based on 1,200+ reviews
            </span>
          </div>

          <p className={styles.body}>
            Perched at the meeting point of Kenya and Tanzania, Oloisiri Namanga
            Hotel is not merely a place to rest. It is a place to feel the land
            beneath you, to watch Kilimanjaro emerge from the morning mist, and
            to rediscover the pleasure of unhurried time. Each of our twenty-four
            suites has been handcrafted with materials drawn from the earth —
            stone, timber, linen — and furnished with the restraint that true
            luxury demands.
          </p>
        </div>

        {/* Right arch — bedroom */}
        <div className={styles.archRight} aria-hidden="true">
          <Image
            src="/welcome-right.jpg"
            alt="Oloisiri suite with floral artwork and white linen"
            fill
            sizes="420px"
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
          />
        </div>

      </div>
    </section>
  )
}

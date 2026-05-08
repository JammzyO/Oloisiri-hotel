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
            Perched at the meeting point of two{' '}
            <em className={styles.headingGold}>nations.</em>
          </h2>

          <div className={styles.rating}>
            <span className={styles.stars} aria-label="Four point eight gold stars">★★★★★</span>
            <span className={styles.ratingText}>
              4.8 out of 5 &middot; Based on 340+ Google Reviews
            </span>
          </div>

          <p className={styles.body}>
            Oloisiri sits 2km from the Kenya–Tanzania border, 50km from Amboseli National
            Park, and 163km from Nairobi on the traffic-free A104. The name comes from the
            Maa language — it means Blessings. A curated collection of accommodation, each with a private balcony,
            views of Kilimanjaro or the surrounding hills, and linen we spent too long choosing.
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

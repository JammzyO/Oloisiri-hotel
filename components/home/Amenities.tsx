'use client'

import { useEffect, useRef } from 'react'
import styles from './Amenities.module.css'

const amenities = [
  {
    title: 'Ormarrei Restaurant',
    description: 'All-day dining rooted in East African produce, open to residents and visitors.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M7 4v6a5 5 0 0 0 10 0V4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 10v14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19 4v20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Olakira Sky Bar',
    description: 'Sundowners above the plains. Cold drinks, warm light, Kilimanjaro on the horizon.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M8 6l2 8h8l2-8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 14v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18 14v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 22h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 6h16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Madiba Sky Lounge',
    description: 'Our rooftop centrepiece. The highest point at Oloisiri and worth every step.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 22h20M5 22V12l9-8 9 8v10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 22v-6h6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Safari Drives',
    description: 'Guided game drives at first light, into the borderland\'s quiet wonders.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="9" stroke="white" strokeWidth="1.5"/>
        <circle cx="14" cy="14" r="3" stroke="white" strokeWidth="1.5"/>
        <path d="M14 5v3M14 20v3M5 14h3M20 14h3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Emanyatta Conference Room',
    description: 'Intimate meetings in a setting that inspires clarity.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="8" width="20" height="14" rx="2" stroke="white" strokeWidth="1.5"/>
        <path d="M9 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 15h10M9 19h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Serenity Gardens',
    description: 'Outdoor spaces designed for nothing in particular.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 22v-9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 13a5 5 0 0 0-5-5 5 5 0 0 0 5 5z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 13a5 5 0 0 1 5-5 5 5 0 0 1-5 5z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 22h16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function Amenities() {
  const sectionRef = useRef<HTMLElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!tiles.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.inView)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    tiles.forEach(tile => observer.observe(tile))
    return () => observer.disconnect()
  }, [])

  const headerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = headerRef.current
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
    <section ref={sectionRef} className={styles.section} aria-label="Amenities">
      <div className={styles.inner}>
        <div ref={headerRef} className={`${styles.header} ${styles.headerReveal}`}>
          <span className={styles.eyebrow}>Our Amenities</span>
          <h2 className={styles.heading}>
            Thoughtfully Crafted{' '}
            <br />
            for Your Comfort
          </h2>
        </div>

        <div className={styles.grid}>
          {amenities.map((item, i) => (
            <div
              key={item.title}
              ref={el => { tileRefs.current[i] = el }}
              className={styles.tile}
              style={{ '--delay': `${i * 80}ms` } as React.CSSProperties}
            >
              <div className={styles.iconArch}>
                {item.icon}
              </div>
              <h3 className={styles.tileTitle}>{item.title}</h3>
              <p className={styles.tileDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

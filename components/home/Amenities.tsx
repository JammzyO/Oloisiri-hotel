'use client'

import { useEffect, useRef } from 'react'
import styles from './Amenities.module.css'

const amenities = [
  {
    title: 'Bush Restaurant',
    description: 'Open-air dining overlooking the savannah — seasonal menus rooted in East African produce.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M7 4v6a5 5 0 0 0 10 0V4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 10v14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19 4v20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Swimming Pool',
    description: 'An infinity pool stretching toward the horizon — a still mirror in the afternoon heat.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 22c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="9" r="3" stroke="white" strokeWidth="1.5"/>
        <path d="M14 15V9l3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Spa & Wellness',
    description: 'Ancient rituals and botanical therapies, thoughtfully composed for the wandering soul.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 22c0 0-9-5-9-11a9 9 0 0 1 9-5 9 9 0 0 1 9 5c0 6-9 11-9 11z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 6v16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 11c2 1 3 2 5 2s3-1 5-2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Safari Drives',
    description: 'Guided game drives at first light — where the borderland reveals its quiet wonders.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="9" stroke="white" strokeWidth="1.5"/>
        <circle cx="14" cy="14" r="3" stroke="white" strokeWidth="1.5"/>
        <path d="M14 5v3M14 20v3M5 14h3M20 14h3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Cultural Tours',
    description: 'Step into the living heritage of the Maasai — ceremonial, honest, and deeply human.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 20l5-8 3 5 3-3 5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="8" r="2.5" stroke="white" strokeWidth="1.5"/>
        <path d="M6 22h16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Laundry Service',
    description: 'Discreet and meticulous — your clothing returned pressed, folded, and perfectly tended.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M8 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="white" strokeWidth="1.5"/>
        <path d="M10 10c1.5-2 6.5-2 8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 14h8M10 18h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
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

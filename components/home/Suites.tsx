'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Suites.module.css'

const suites = [
  {
    id: 0,
    name: 'Savannah Suite',
    category: 'Garden Level',
    guests: '2 Guests',
    size: '68 m²',
    rate: 'From KES 42,000',
    src: '/suite-1.jpg',
    objectPosition: 'center',
    slug: 'savannah-suite',
  },
  {
    id: 1,
    name: 'Kilimanjaro Suite',
    category: 'View Suite',
    guests: '2 Guests',
    size: '84 m²',
    rate: 'From KES 54,000',
    src: '/suite-2.jpg',
    objectPosition: 'center',
    slug: 'kilimanjaro-suite',
  },
  {
    id: 2,
    name: 'Bush Villa',
    category: 'Private Villa',
    guests: '4 Guests',
    size: '140 m²',
    rate: 'From KES 85,000',
    src: '/suite-3.jpg',
    objectPosition: 'center',
    slug: 'bush-villa',
  },
]

export default function Suites() {
  const [hovered, setHovered] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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

        <div className={styles.carousel}>
          {suites.map((suite, i) => {
            const isActive = hovered === i

            return (
              <Link
                key={suite.id}
                href={`/suites/${suite.slug}`}
                className={`${styles.card} ${isActive ? styles.cardActive : styles.cardDim}`}
                onMouseEnter={() => setHovered(i)}
                aria-label={suite.name}
              >
                <div className={styles.cardImage}>
                  <Image
                    src={suite.src}
                    alt={suite.name}
                    fill
                    sizes="(max-width: 900px) 260px, 340px"
                    style={{ objectFit: 'cover', objectPosition: suite.objectPosition }}
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
            )
          })}
        </div>

        <div className={styles.cta}>
          <a href="/suites" className={styles.ctaBtn}>View All Suites</a>
        </div>
      </div>
    </section>
  )
}

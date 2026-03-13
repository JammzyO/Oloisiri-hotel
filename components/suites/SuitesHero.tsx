'use client'

import { useEffect, useRef } from 'react'
import styles from './SuitesHero.module.css'

export default function SuitesHero() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const t = setTimeout(() => el.classList.add(styles.loaded), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <section ref={ref} className={styles.hero} aria-label="Suites hero">

      {/* Background */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgGrain} />
        <div className={styles.bgOverlay} />
      </div>

      {/* Decorative arch — right side */}
      <div className={styles.archDeco} aria-hidden="true">
        <div className={styles.archDecoInner} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <span className={styles.eyebrow}>Our Suites</span>
        <h1 className={styles.heading}>
          Twenty-Four Sanctuaries,
          <br />
          <em className={styles.headingItalic}>Each One a World.</em>
        </h1>
        <p className={styles.sub}>
          Every suite at Oloisiri is handcrafted — shaped by the land,
          finished in stone and timber, designed for those who understand
          the difference between comfort and genuine luxury.
        </p>
        <div className={styles.rule} aria-hidden="true" />
      </div>

    </section>
  )
}

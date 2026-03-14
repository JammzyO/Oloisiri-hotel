'use client'

import styles from './SuitesHero.module.css'

export default function SuitesHero() {
  return (
    <section className={styles.hero} aria-label="Suites hero">

      {/* Faint decorative numeral — right side, decorative only */}
      <div className={styles.decorNum} aria-hidden="true">5</div>

      {/* Gold sweep line — animates left to right, 1.2s */}
      <div className={styles.goldLine} aria-hidden="true" />

      {/* Content — bottom left */}
      <div className={styles.content}>
        <span className={styles.eyebrow}>Our Suites</span>
        <h1 className={styles.heading}>
          <span className={styles.hLine1}>Twenty-Four Sanctuaries,</span>
          <em className={styles.hLine2}>Each One a World.</em>
        </h1>
      </div>

    </section>
  )
}

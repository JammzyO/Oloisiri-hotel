'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './SuiteListings.module.css'
import { allSuites } from '@/lib/suiteData'
import type { Suite } from '@/lib/suiteData'

/* ── Individual room detail panel (below the sticky selector) ── */
function DetailPanel({ suite, index }: { suite: Suite; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const isReversed = index % 2 !== 0

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${styles.detailPanel} ${isReversed ? styles.detailPanelReversed : ''}`}
    >
      {/* Image — left on even, right on odd */}
      <div className={`${styles.detailImageWrap} ${revealed ? styles.imgVisible : ''}`}>
        <Link href={`/suites/${suite.slug}`} className={styles.detailImageLink}>
          <Image
            src={suite.images[0].src}
            alt={suite.name}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            style={{ objectFit: 'cover', objectPosition: suite.images[0].position }}
          />
        </Link>
      </div>

      {/* Text */}
      <div className={`${styles.detailTextWrap} ${revealed ? styles.textVisible : ''}`}>
        <span className={styles.detailCategory}>{suite.category}</span>
        <h3 className={styles.detailName}>{suite.name}</h3>
        <div className={styles.detailRule} aria-hidden="true" />
        <p className={styles.detailDesc}>{suite.description}</p>
        <div className={styles.detailMeta}>
          <span>{suite.guests} Guests</span>
          <span className={styles.detailDot}>·</span>
          <span>{suite.size}</span>
          <span className={styles.detailDot}>·</span>
          <span>{suite.bed}</span>
        </div>
        <div className={styles.detailFooter}>
          {suite.available === false ? (
            <span className={styles.comingSoonBadge}>Coming Soon</span>
          ) : (
            <>
              <span className={styles.detailRate}>
                {suite.rateDisplay}
                <span className={styles.rateNight}> / night</span>
              </span>
              <Link href={`/suites/${suite.slug}`} className={styles.detailCta}>
                Reserve Suite
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────────── */
export default function SuiteListings() {
  return (
    <>
      <div className={styles.roomsIntro}>
        <p className={styles.roomsIntroText}>
          Our rooms blend cozy charm with modern luxury. Each space is designed to invite
          relaxation — with elegant interiors, private balconies, and panoramic views that
          tempt you to stay one more night. At Oloisiri, it&rsquo;s never easy to leave.
        </p>
      </div>
      <section className={styles.detailsSection} aria-label="Room details">
        {[...allSuites]
          .sort((a, b) => (a.available === false ? 1 : 0) - (b.available === false ? 1 : 0))
          .map((suite, i) => (
            <DetailPanel key={suite.slug} suite={suite} index={i} />
          ))}
      </section>
    </>
  )
}

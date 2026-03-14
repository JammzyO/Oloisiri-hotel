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
        </div>
      </div>
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────────── */
export default function SuiteListings() {
  const [activeRoom, setActiveRoom] = useState(0)
  const [sectionVisible, setSectionVisible] = useState(false)
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  /* Track active room via IntersectionObserver on each slot */
  useEffect(() => {
    const observers = allSuites.map((_, i) => {
      const el = slotRefs.current[i]
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveRoom(i)
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  /* Show counter while selector section is in view */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { threshold: 0.01 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* ── Fixed room counter — far right, rotated ── */}
      <div
        className={`${styles.counter} ${sectionVisible ? styles.counterVisible : ''}`}
        aria-hidden="true"
      >
        {String(activeRoom + 1).padStart(2, '0')} / {String(allSuites.length).padStart(2, '0')}
      </div>

      {/* ── Split-screen sticky selector ── */}
      <section ref={sectionRef} className={styles.selectorSection} aria-label="Suite selector">

        {/* Left: scrollable room list */}
        <div className={styles.leftPanel}>
          {allSuites.map((suite, i) => {
            const isActive = activeRoom === i
            return (
              <div
                key={suite.slug}
                ref={el => { slotRefs.current[i] = el }}
                className={`${styles.roomSlot} ${isActive ? styles.roomSlotActive : ''}`}
              >
                <div className={styles.roomInner}>
                  <span className={styles.roomNum}>0{i + 1}</span>
                  <h2 className={styles.roomName}>{suite.name}</h2>

                  {/* Details — always rendered, opacity controlled */}
                  <div className={`${styles.roomDetails} ${isActive ? styles.roomDetailsActive : ''}`}>
                    <p className={styles.roomDesc}>{suite.description}</p>
                    <div className={styles.roomMeta}>
                      <span>{suite.guests} Guests</span>
                      <span className={styles.metaDot}>·</span>
                      <span>{suite.size}</span>
                    </div>
                    <div className={styles.roomFooter}>
                      <span className={styles.roomRate}>
                        {suite.rateDisplay}
                        <span className={styles.rateNight}> / night</span>
                      </span>
                      <Link
                        href={`/suites/${suite.slug}`}
                        className={`${styles.roomLink} ${isActive ? styles.roomLinkActive : ''}`}
                        tabIndex={isActive ? 0 : -1}
                      >
                        View Suite →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: sticky image panel */}
        <div className={styles.rightPanel}>
          {allSuites.map((suite, i) => (
            <div
              key={suite.slug}
              className={`${styles.roomImage} ${activeRoom === i ? styles.imageActive : ''}`}
            >
              <Image
                src={suite.images[0].src}
                alt={suite.name}
                fill
                sizes="60vw"
                style={{ objectFit: 'cover', objectPosition: suite.images[0].position }}
                priority={i === 0}
              />
            </div>
          ))}
          {/* Subtle bottom gradient — no text on image */}
          <div className={styles.imageGradient} aria-hidden="true" />
        </div>

      </section>

      {/* ── Individual room detail panels ── */}
      <section className={styles.detailsSection} aria-label="Room details">
        {allSuites.map((suite, i) => (
          <DetailPanel key={suite.slug} suite={suite} index={i} />
        ))}
      </section>
    </>
  )
}

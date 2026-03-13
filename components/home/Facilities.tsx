'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './Facilities.module.css'

function useCounter(target: number, inView: boolean, duration = 1800) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start: number | null = null
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setValue(target)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration])

  return value
}

function StatCard({
  imageSrc,
  imageAlt,
  objectPosition = 'center',
  targetNumber,
  suffix,
  label,
  inView,
}: {
  imageSrc: string
  imageAlt: string
  objectPosition?: string
  targetNumber: number
  suffix: string
  label: string
  inView: boolean
}) {
  const count = useCounter(targetNumber, inView)

  return (
    <div className={styles.card}>
      <div className={styles.cardBg}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover', objectPosition }}
        />
        <div className={styles.cardOverlay} />
      </div>
      <div className={styles.statBanner}>
        <span className={styles.statNumber}>
          {count}{suffix}
        </span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </div>
  )
}

export default function Facilities() {
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
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${inView ? styles.inView : ''}`}
      aria-label="Facilities"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Rooms &amp; Suites</span>
          <h2 className={styles.heading}>Our Facilities</h2>
        </div>

        <div className={styles.cards}>
          <StatCard
            imageSrc="/facilities-1.jpg"
            imageAlt="Oloisiri luxury suite with yellow pillows and warm natural light"
            objectPosition="center"
            targetNumber={24}
            suffix="+"
            label="Luxury Suites Available"
            inView={inView}
          />
          <StatCard
            imageSrc="/facilities-2.jpg"
            imageAlt="Oloisiri suite with sheer curtains and natural light"
            objectPosition="center"
            targetNumber={3}
            suffix=""
            label="Dining Experiences"
            inView={inView}
          />
        </div>
      </div>
    </section>
  )
}

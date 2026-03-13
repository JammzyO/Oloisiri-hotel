'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './BookingPrompt.module.css'

export default function BookingPrompt() {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
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
      ref={ref}
      className={`${styles.section} ${inView ? styles.inView : ''}`}
      aria-label="Begin planning your visit"
    >
      <div className={styles.inner}>

        {/* Decorative arch frame */}
        <div className={styles.archLeft} aria-hidden="true" />
        <div className={styles.archRight} aria-hidden="true" />

        <div className={styles.content}>
          <span className={styles.eyebrow}>Plan Your Visit</span>
          <h2 className={styles.heading}>
            Begin Planning
            <br />
            <em className={styles.headingItalic}>Your Stay.</em>
          </h2>
          <p className={styles.body}>
            Each visit to Oloisiri is shaped around the guest. Our team will work
            with you to select the right suite, arrange experiences at the pace
            you prefer, and ensure every detail is in place before you arrive.
          </p>
          <Link href="/contact" className={styles.cta}>
            Begin Planning Your Visit
          </Link>
        </div>

      </div>
    </section>
  )
}

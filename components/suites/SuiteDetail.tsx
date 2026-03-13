'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './SuiteDetail.module.css'
import type { Suite } from '@/lib/suiteData'
import { allSuites } from '@/lib/suiteData'

/* ─── Date helpers ───────────────────────────────────────── */
function toInputValue(d: Date | null): string {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fromInputValue(s: string): Date | null {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setHours(0, 0, 0, 0)
  return date
}

/* ─── Amenity icon paths ─────────────────────────────────── */
const ICONS: Record<string, string> = {
  wifi:      'M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01',
  shower:    'M12 2a5 5 0 0 0-5 5v4h10V7a5 5 0 0 0-5-5zm-1 9v9m2-9v9M8 20h8',
  safe:      'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7 11V7a5 5 0 0 1 10 0v4',
  tv:        'M2 7h20v13H2zM7 3l5 4 5-4',
  minibar:   'M8 2h8v3H8zm-2 3h12l1 14H5zm5 5v6m4-6v6',
  ac:        'M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10.4 10.4 1.4 1.4M5.6 18.4l1.4-1.4m10.4-10.4 1.4-1.4M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0',
  terrace:   'M3 18h18M5 18V9l7-6 7 6v9',
  nespresso: 'M9 2h6v4H9zm-2 4h10v14H7zm3 4v6m4-6v6',
  garden:    'M12 22v-9m0-3a4 4 0 0 0-4-4 4 4 0 0 0 4 4zm0 0a4 4 0 0 1 4-4 4 4 0 0 1-4 4z',
  window:    'M3 3h18v18H3zM3 12h18M12 3v18',
  view:      'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  pool:      'M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0M7 7V2M12 7V2M17 7V2',
  butler:    'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  kitchen:   'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zM6 1v3M10 1v3M14 1v3',
}

/* ─── Availability calendar ──────────────────────────────── */
interface CalendarProps {
  checkin: Date | null
  checkout: Date | null
  onChange: (checkin: Date | null, checkout: Date | null) => void
}

function Calendar({ checkin, checkout, onChange }: CalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const anchor = checkin ?? today
  const [base, setBase] = useState({ year: anchor.getFullYear(), month: anchor.getMonth() })

  // When checkin changes from the reserve box, navigate calendar to show that month
  useEffect(() => {
    if (checkin) {
      setBase({ year: checkin.getFullYear(), month: checkin.getMonth() })
    }
  }, [checkin])

  const prevMonth = () => setBase(b => {
    if (b.month === 0) return { year: b.year - 1, month: 11 }
    return { year: b.year, month: b.month - 1 }
  })
  const nextMonth = () => setBase(b => {
    if (b.month === 11) return { year: b.year + 1, month: 0 }
    return { year: b.year, month: b.month + 1 }
  })

  const month2 = base.month === 11
    ? { year: base.year + 1, month: 0 }
    : { year: base.year, month: base.month + 1 }

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const DAYS = ['Mo','Tu','We','Th','Fr','Sa','Su']

  function getDays(year: number, month: number) {
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    let startDow = first.getDay()
    startDow = startDow === 0 ? 6 : startDow - 1
    const days: (Date | null)[] = []
    for (let i = 0; i < startDow; i++) days.push(null)
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d))
    return days
  }

  function handleDay(day: Date) {
    if (day < today) return
    // If no start, or both are set → start fresh
    if (!checkin || (checkin && checkout)) {
      onChange(day, null)
    } else {
      if (day <= checkin) {
        onChange(day, null)
      } else {
        onChange(checkin, day)
      }
    }
  }

  function dayClass(day: Date | null) {
    if (!day) return styles.calEmpty
    const isPast = day < today
    const isStart = checkin && day.getTime() === checkin.getTime()
    const isEnd = checkout && day.getTime() === checkout.getTime()
    const isInRange = checkin && checkout && day > checkin && day < checkout
    if (isPast) return styles.calDayPast
    if (isStart || isEnd) return styles.calDaySelected
    if (isInRange) return styles.calDayRange
    return styles.calDay
  }

  function renderMonth(year: number, month: number) {
    return (
      <div className={styles.calMonth}>
        <div className={styles.calMonthName}>{MONTHS[month]} {year}</div>
        <div className={styles.calGrid}>
          {DAYS.map(d => <div key={d} className={styles.calDow}>{d}</div>)}
          {getDays(year, month).map((day, i) => (
            <button
              key={i}
              className={dayClass(day)}
              onClick={() => day && handleDay(day)}
              disabled={!day || day < today}
              aria-label={day ? day.toDateString() : undefined}
            >
              {day ? day.getDate() : ''}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.calNav}>
        <button className={styles.calArrow} onClick={prevMonth} aria-label="Previous month">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles.calMonths}>
          {renderMonth(base.year, base.month)}
          {renderMonth(month2.year, month2.month)}
        </div>
        <button className={styles.calArrow} onClick={nextMonth} aria-label="Next month">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ─── Reserve box ────────────────────────────────────────── */
interface ReserveBoxProps {
  suite: Suite
  checkin: Date | null
  checkout: Date | null
  onCheckinChange: (d: Date | null) => void
  onCheckoutChange: (d: Date | null) => void
}

function ReserveBox({ suite, checkin, checkout, onCheckinChange, onCheckoutChange }: ReserveBoxProps) {
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  function handleCheckinInput(val: string) {
    const d = fromInputValue(val)
    onCheckinChange(d)
    // If new checkin is after current checkout, clear checkout
    if (d && checkout && d >= checkout) onCheckoutChange(null)
  }

  function handleCheckoutInput(val: string) {
    const d = fromInputValue(val)
    // Only allow checkout after checkin
    if (d && checkin && d <= checkin) return
    onCheckoutChange(d)
  }

  const checkinVal = toInputValue(checkin)
  const checkoutVal = toInputValue(checkout)

  return (
    <div className={styles.reserveBox}>
      <div className={styles.reserveHeader}>
        <span className={styles.reserveCategory}>{suite.category}</span>
        <div className={styles.reservePrice}>
          <span className={styles.reservePriceNum}>{suite.rateDisplay}</span>
          <span className={styles.reservePriceNight}> / night</span>
        </div>
      </div>

      <div className={styles.reserveFields}>
        <div className={styles.reserveRow}>
          <div className={styles.reserveField}>
            <label className={styles.reserveLabel}>Check In</label>
            <input
              type="date"
              className={styles.reserveInput}
              value={checkinVal}
              onChange={e => handleCheckinInput(e.target.value)}
            />
          </div>
          <div className={styles.reserveField}>
            <label className={styles.reserveLabel}>Check Out</label>
            <input
              type="date"
              className={styles.reserveInput}
              value={checkoutVal}
              min={checkinVal || undefined}
              onChange={e => handleCheckoutInput(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.reserveRow}>
          <div className={styles.reserveField}>
            <label className={styles.reserveLabel}>Adults</label>
            <div className={styles.counter}>
              <button className={styles.counterBtn} onClick={() => setAdults(a => Math.max(1, a - 1))} aria-label="Fewer adults">−</button>
              <span className={styles.counterVal}>{adults}</span>
              <button className={styles.counterBtn} onClick={() => setAdults(a => Math.min(suite.guests, a + 1))} aria-label="More adults">+</button>
            </div>
          </div>
          <div className={styles.reserveField}>
            <label className={styles.reserveLabel}>Children</label>
            <div className={styles.counter}>
              <button className={styles.counterBtn} onClick={() => setChildren(c => Math.max(0, c - 1))} aria-label="Fewer children">−</button>
              <span className={styles.counterVal}>{children}</span>
              <button className={styles.counterBtn} onClick={() => setChildren(c => c + 1)} aria-label="More children">+</button>
            </div>
          </div>
        </div>
      </div>

      <Link
        href={`/contact?suite=${suite.slug}&adults=${adults}&children=${children}&checkin=${checkinVal}&checkout=${checkoutVal}`}
        className={styles.reserveBtn}
      >
        Reserve This Suite
      </Link>

      <p className={styles.reserveNote}>No payment required. Our team will confirm within 24 hours.</p>
    </div>
  )
}

/* ─── More Rooms ─────────────────────────────────────────── */
function MoreRooms({ current }: { current: string }) {
  const others = allSuites.filter(s => s.slug !== current)
  return (
    <section className={styles.moreSection}>
      <div className={styles.moreInner}>
        <div className={styles.moreHeader}>
          <span className={styles.moreEyebrow}>Discover</span>
          <h2 className={styles.moreHeading}>More Suites</h2>
        </div>
        <div className={styles.moreCards}>
          {others.map(suite => (
            <Link key={suite.slug} href={`/suites/${suite.slug}`} className={styles.moreCard}>
              <div className={styles.moreArch}>
                <Image
                  src={suite.images[0].src}
                  alt={suite.name}
                  fill
                  sizes="(max-width: 768px) 280px, 360px"
                  style={{ objectFit: 'cover', objectPosition: suite.images[0].position }}
                />
                <div className={styles.moreCardOverlay}>
                  <span className={styles.moreCardCategory}>{suite.category}</span>
                  <h3 className={styles.moreCardName}>{suite.name}</h3>
                  <span className={styles.moreCardMeta}>{suite.guests} Guests · {suite.size}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Main component ─────────────────────────────────────── */
export default function SuiteDetail({ suite }: { suite: Suite }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [checkin, setCheckin] = useState<Date | null>(null)
  const [checkout, setCheckout] = useState<Date | null>(null)

  function handleCalendarChange(newCheckin: Date | null, newCheckout: Date | null) {
    setCheckin(newCheckin)
    setCheckout(newCheckout)
  }

  const prev = useCallback(() =>
    setImgIndex(i => (i - 1 + suite.images.length) % suite.images.length),
    [suite.images.length]
  )
  const next = useCallback(() =>
    setImgIndex(i => (i + 1) % suite.images.length),
    [suite.images.length]
  )

  return (
    <div className={styles.page}>

      {/* ── Gallery ──────────────────────────────────────── */}
      <div className={styles.gallery}>
        {suite.images.map((img, i) => (
          <div
            key={img.src}
            className={`${styles.gallerySlide} ${i === imgIndex ? styles.gallerySlideActive : ''}`}
          >
            <Image
              src={img.src}
              alt={`${suite.name} — image ${i + 1}`}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: img.position }}
              priority={i === 0}
            />
          </div>
        ))}

        <div className={styles.galleryOverlay} />

        {suite.images.length > 1 && (
          <>
            <button className={`${styles.galleryArrow} ${styles.galleryArrowPrev}`} onClick={prev} aria-label="Previous image">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={`${styles.galleryArrow} ${styles.galleryArrowNext}`} onClick={next} aria-label="Next image">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className={styles.galleryCounter}>
              {suite.images.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.galleryDot} ${i === imgIndex ? styles.galleryDotActive : ''}`}
                  onClick={() => setImgIndex(i)}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className={styles.galleryTitle}>
          <span className={styles.galleryCat}>{suite.category}</span>
          <h1 className={styles.galleryName}>{suite.name}</h1>
        </div>
      </div>

      {/* ── Content + Reserve ────────────────────────────── */}
      <div className={styles.body}>
        <div className={styles.bodyInner}>

          {/* Content column */}
          <div className={styles.content}>

            {/* Meta */}
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {suite.guests} Guests
              </span>
              <span className={styles.metaDot}>·</span>
              <span className={styles.metaItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                </svg>
                {suite.size}
              </span>
              <span className={styles.metaDot}>·</span>
              <span className={styles.metaItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 9h20M2 9v10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9M2 9l2-6h16l2 6"/>
                </svg>
                {suite.bed}
              </span>
              {suite.connecting && (
                <>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.metaItem}>Connecting Rooms</span>
                </>
              )}
            </div>

            <div className={styles.divider} />

            {/* Description */}
            <p className={styles.description}>{suite.description}</p>

            {/* Amenities */}
            <div className={styles.amenitiesBlock}>
              <h3 className={styles.blockTitle}>Room Amenities</h3>
              <div className={styles.amenitiesGrid}>
                {suite.amenities.map(a => (
                  <div key={a.key} className={styles.amenityItem}>
                    <div className={styles.amenityIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={ICONS[a.key] ?? 'M12 12h.01'} />
                      </svg>
                    </div>
                    <span className={styles.amenityLabel}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className={styles.featuresBlock}>
              <h3 className={styles.blockTitle}>Room Features</h3>
              <ul className={styles.featuresList}>
                {suite.features.map(f => (
                  <li key={f.label} className={styles.featureItem}>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M4 10l5 5 7-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span><strong>{f.label}:</strong> {f.detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Check-in / out times */}
            <div className={styles.timesBlock}>
              <h3 className={styles.blockTitle}>Check In &amp; Check Out</h3>
              <div className={styles.timesRow}>
                <div className={styles.timeItem}>
                  <span className={styles.timeLabel}>Check In</span>
                  <span className={styles.timeValue}>{suite.checkin}</span>
                </div>
                <div className={styles.timeDivider} />
                <div className={styles.timeItem}>
                  <span className={styles.timeLabel}>Check Out</span>
                  <span className={styles.timeValue}>{suite.checkout}</span>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className={styles.calBlock}>
              <h3 className={styles.blockTitle}>Availability Calendar</h3>
              <Calendar
                checkin={checkin}
                checkout={checkout}
                onChange={handleCalendarChange}
              />
            </div>

          </div>

          {/* Reserve column */}
          <div className={styles.reserveCol}>
            <ReserveBox
              suite={suite}
              checkin={checkin}
              checkout={checkout}
              onCheckinChange={d => {
                setCheckin(d)
                if (d && checkout && d >= checkout) setCheckout(null)
              }}
              onCheckoutChange={setCheckout}
            />
          </div>

        </div>
      </div>

      {/* ── More Rooms ───────────────────────────────────── */}
      <MoreRooms current={suite.slug} />

    </div>
  )
}

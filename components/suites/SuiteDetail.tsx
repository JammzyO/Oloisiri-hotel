'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
  butler:       'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  kitchen:      'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zM6 1v3M10 1v3M14 1v3',
  fridge:       'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 9h10M10 6v4',
  desk:         'M2 15h20v2H2zM6 6h12a1 1 0 0 1 1 1v8H5V7a1 1 0 0 1 1-1zm4 11v3m4-3v3M9 21h6',
  housekeeping: 'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83',
  curtains:     'M3 3h18v18H3zM9 3v18M15 3v18',
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

function MfPhoneField({ onChange, onValidityChange, error, wrapRef }: {
  onChange: (fullNumber: string) => void
  onValidityChange: (valid: boolean) => void
  error?: string
  wrapRef?: React.RefObject<HTMLDivElement | null>
}) {
  const [rawDigits, setRawDigits] = useState('')

  function formatKe(digits: string): string {
    const d = digits.slice(0, 9)
    if (d.length <= 3) return d
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`
    return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End']
    if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return
    if (!/^\d$/.test(e.key)) e.preventDefault()
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9)
    setRawDigits(digits)
    onChange('+254' + digits)
    onValidityChange(digits.length === 9)
  }

  return (
    <div ref={wrapRef} className={styles.mfPhoneField}>
      <span className={styles.mfPhoneLabel}>Phone</span>
      <div className={`${styles.mfPhoneRow} ${error ? styles.mfPhoneRowErr : ''}`}>
        <span className={styles.mfPhonePrefix}>🇰🇪 +254</span>
        <input
          id="mf-phone"
          type="tel"
          inputMode="numeric"
          className={styles.mfPhoneInput}
          value={formatKe(rawDigits)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="7XX XXX XXX"
          aria-label="Phone number"
          aria-invalid={!!error}
        />
      </div>
      {error && <span className={styles.mfPhoneErrMsg}>{error}</span>}
    </div>
  )
}

function MfField({ id, label, type = 'text', value, onChange, error, wrapRef }: {
  id: string; label: string; type?: string
  value: string; onChange: (v: string) => void; error?: string
  wrapRef?: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div ref={wrapRef} className={`${styles.mfField} ${error ? styles.mfFieldErr : ''}`}>
      <div className={styles.mfFieldInner}>
        <input
          id={id}
          className={styles.mfInput}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder=" "
          autoComplete="off"
        />
        <label htmlFor={id} className={styles.mfLabel}>{label}</label>
      </div>
      {error && <span className={styles.mfErrMsg}>{error}</span>}
    </div>
  )
}

interface ReserveBoxProps {
  suite: Suite
  checkin: Date | null
  checkout: Date | null
  onCheckinChange: (d: Date | null) => void
  onCheckoutChange: (d: Date | null) => void
}

function ReserveBox({ suite, checkin, checkout, onCheckinChange, onCheckoutChange }: ReserveBoxProps) {
  const [adults,    setAdults]    = useState(2)
  const [children,  setChildren]  = useState(0)
  const [occupancy, setOccupancy] = useState<'single' | 'double' | ''>('')
  const [errs,      setErrs]      = useState<Record<string, string>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const checkinRef   = useRef<HTMLDivElement>(null)
  const checkoutRef  = useRef<HTMLDivElement>(null)
  const occupancyRef = useRef<HTMLDivElement>(null)

  function shake(ref: React.RefObject<HTMLDivElement | null>) {
    if (!ref.current) return
    ref.current.classList.remove(styles.fieldShake)
    void ref.current.offsetWidth
    ref.current.classList.add(styles.fieldShake)
  }

  function handleCheckinInput(val: string) {
    const d = fromInputValue(val)
    onCheckinChange(d)
    if (d && checkout && d >= checkout) onCheckoutChange(null)
    setErrs(e => ({ ...e, checkin: '' }))
  }

  function handleCheckoutInput(val: string) {
    const d = fromInputValue(val)
    if (d && checkin && d <= checkin) return
    onCheckoutChange(d)
    setErrs(e => ({ ...e, checkout: '' }))
  }

  function handleReserve() {
    const e: Record<string, string> = {}
    if (!checkin)  e.checkin  = 'Select a check-in date'
    if (!checkout) e.checkout = 'Select a check-out date'
    if (checkin && checkout && checkout <= checkin) e.checkout = 'Must be after check-in'
    if (!occupancy) e.occupancy = 'Select an occupancy type'
    if (Object.keys(e).length) {
      setErrs(e)
      if (e.checkin)   shake(checkinRef)
      if (e.checkout)  shake(checkoutRef)
      if (e.occupancy) shake(occupancyRef)
      return
    }
    setModalOpen(true)
  }

  const checkinVal  = toInputValue(checkin)
  const checkoutVal = toInputValue(checkout)

  return (
    <div className={styles.reserveBox}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Rates */}
        <div className={styles.reserveHeader}>

          <div style={{ borderBottom: '1px solid rgba(201,162,77,0.2)', paddingBottom: '16px', marginBottom: '2px' }}>
            <span className={styles.reserveCategory} style={{ display: 'block', marginBottom: '10px' }}>Resident Rates</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className={styles.reservePriceNight}>Standard Queen — Single</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 300, color: 'var(--color-white)', letterSpacing: '-0.2px' }}>
                  KES 6,500 <span className={styles.reservePriceNight}>B&amp;B</span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className={styles.reservePriceNight}>Standard Queen — Double</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 300, color: 'var(--color-white)', letterSpacing: '-0.2px' }}>
                  KES 7,500 <span className={styles.reservePriceNight}>B&amp;B</span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className={styles.reservePriceNight}>Twin Room</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 300, color: 'var(--color-white)', letterSpacing: '-0.2px' }}>
                  KES 8,000 <span className={styles.reservePriceNight}>B&amp;B</span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className={styles.reservePriceNight}>Deluxe King</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 300, color: 'var(--color-white)', letterSpacing: '-0.2px' }}>
                  KES 8,500 <span className={styles.reservePriceNight}>B&amp;B</span>
                </span>
              </div>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid rgba(201,162,77,0.2)', paddingTop: '14px', paddingBottom: '16px' }}>
            <span className={styles.reserveCategory} style={{ display: 'block', marginBottom: '10px' }}>Non-Resident Rates</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className={styles.reservePriceNight}>Single occupancy</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 300, color: 'var(--color-white)', letterSpacing: '-0.2px' }}>
                  KES 9,500 <span className={styles.reservePriceNight}>B&amp;B</span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className={styles.reservePriceNight}>Double occupancy</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 300, color: 'var(--color-white)', letterSpacing: '-0.2px' }}>
                  KES 11,000 <span className={styles.reservePriceNight}>B&amp;B</span>
                </span>
              </div>
            </div>
          </div>

          <div style={{ background: '#e8ddc7', borderLeft: '3px solid #c9a24d', padding: '10px 14px', marginTop: '4px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '11px', color: '#082f2c', display: 'block', letterSpacing: '0.02em', lineHeight: 1.6 }}>
              Special opening rate — available for a limited time.
            </span>
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '10px', color: '#857f77', margin: '0', lineHeight: 1.7, letterSpacing: '0.01em' }}>
            Buffet meals available on arrangement — KES 2,500 per head, includes one soft drink.
          </p>
        </div>

        {/* Date + guest fields */}
        <div className={styles.reserveFields}>
          <div className={styles.reserveRow}>
            <div ref={checkinRef} className={styles.reserveField}>
              <label className={styles.reserveLabel}>Check In</label>
              <input type="date"
                className={`${styles.reserveInput} ${errs.checkin ? styles.reserveInputErr : ''}`}
                value={checkinVal}
                onChange={e => handleCheckinInput(e.target.value)} />
              {errs.checkin && <span className={styles.reserveErrMsg}>{errs.checkin}</span>}
            </div>
            <div ref={checkoutRef} className={styles.reserveField}>
              <label className={styles.reserveLabel}>Check Out</label>
              <input type="date"
                className={`${styles.reserveInput} ${errs.checkout ? styles.reserveInputErr : ''}`}
                value={checkoutVal}
                min={checkinVal || undefined}
                onChange={e => handleCheckoutInput(e.target.value)} />
              {errs.checkout && <span className={styles.reserveErrMsg}>{errs.checkout}</span>}
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

        {/* Occupancy toggle */}
        <div ref={occupancyRef} className={styles.occupancySection}>
          <span className={styles.reserveLabel}>Occupancy</span>
          <div className={`${styles.occupancyGroup} ${errs.occupancy ? styles.occupancyGroupErr : ''}`}
            role="group" aria-label="Occupancy type">
            {(['single', 'double'] as const).map(opt => (
              <button key={opt} type="button"
                className={`${styles.occupancyPill} ${occupancy === opt ? styles.occupancyPillActive : ''}`}
                onClick={() => { setOccupancy(opt); setErrs(e => ({ ...e, occupancy: '' })) }}
                aria-pressed={occupancy === opt}>
                <span>{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
              </button>
            ))}
          </div>
          {errs.occupancy && <span className={styles.reserveErrMsg}>{errs.occupancy}</span>}
        </div>

        <button
          className={styles.reserveBtn}
          onClick={handleReserve}
          disabled={submitted}
          style={submitted ? { pointerEvents: 'none' } : undefined}
        >
          {submitted ? 'Request Submitted' : 'Reserve This Suite'}
        </button>
        <p className={styles.reserveNote}>No payment required. Our team will confirm within 24 hours.</p>
      </div>

      {modalOpen && (
        <ReservationModal
          onClose={() => setModalOpen(false)}
          onDone={() => { setModalOpen(false); setSubmitted(true) }}
          suite={suite}
          checkin={checkin}
          checkout={checkout}
          adults={adults}
          children={children}
          occupancy={occupancy}
        />
      )}
    </div>
  )
}

/* ─── Reservation Modal ──────────────────────────────────── */
function ReservationModal({
  onClose, onDone, suite, checkin, checkout, adults, children, occupancy,
}: {
  onClose: () => void
  onDone: () => void
  suite: Suite
  checkin: Date | null
  checkout: Date | null
  adults: number
  children: number
  occupancy: string
}) {
  const [phase,     setPhase]     = useState<'form' | 'confirm'>('form')
  const [leaving,   setLeaving]   = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [form,        setForm]        = useState({ firstName: '', lastName: '', email: '', phone: '', requests: '' })
  const [errs,        setErrs]        = useState<Record<string, string>>({})
  const [loading,     setLoading]     = useState(false)
  const [phoneValid,  setPhoneValid]  = useState(false)
  const [submitStage, setSubmitStage] = useState<'idle' | 'choose'>('idle')

  const firstRef = useRef<HTMLDivElement>(null)
  const lastRef  = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    let handled = false
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !handled) { handled = true; doClose() }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function doClose() {
    setIsClosing(true)
    setTimeout(onClose, 300)
  }

  function doDone() {
    setIsClosing(true)
    setTimeout(onDone, 300)
  }

  function shake(ref: React.RefObject<HTMLDivElement | null>) {
    if (!ref.current) return
    ref.current.classList.remove(styles.fieldShake)
    void ref.current.offsetWidth
    ref.current.classList.add(styles.fieldShake)
  }

  function setF(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrs(e => ({ ...e, [key]: '' }))
  }

  function transitionToConfirm() {
    setLeaving(true)
    setTimeout(() => { setPhase('confirm'); setLeaving(false) }, 300)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fieldErrs: Record<string, string> = {}
    if (!form.firstName.trim()) fieldErrs.firstName = 'Required'
    if (!form.lastName.trim())  fieldErrs.lastName  = 'Required'
    if (!form.email.trim() || !form.email.includes('@')) fieldErrs.email = 'Valid email required'
    if (!form.phone || !phoneValid) fieldErrs.phone = 'Required'
    if (Object.keys(fieldErrs).length) {
      setErrs(fieldErrs)
      if (fieldErrs.firstName) shake(firstRef)
      if (fieldErrs.lastName)  shake(lastRef)
      if (fieldErrs.email)     shake(emailRef)
      if (fieldErrs.phone)     shake(phoneRef)
      return
    }
    setSubmitStage('choose')
  }

  async function sendByEmail() {
    setLoading(true)
    try {
      await fetch('https://hook.eu2.make.com/63n5mfv4mnxthadep8a46ie2wi1und3u', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:             'Reservation Inquiry',
          firstname:        form.firstName,
          lastname:         form.lastName,
          email:            form.email,
          phone:            form.phone,
          checkin:          checkin ? checkin.toISOString().slice(0, 10) : '',
          checkout:         checkout ? checkout.toISOString().slice(0, 10) : '',
          adults:           String(adults),
          children:         String(children),
          room:             suite.slug,
          occupancy,
          special_requests: form.requests,
        }),
      })
    } catch (err) {
      console.error('Reservation webhook error:', err)
    }
    setLoading(false)
    transitionToConfirm()
  }

  function sendByWhatsApp() {
    const message = [
      `Hello Oloisiri,`,
      ``,
      `I would like to make a reservation inquiry.`,
      ``,
      `Name: ${form.firstName} ${form.lastName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Suite: ${suite.name}`,
      `Arrival: ${fmtDate(checkin)}`,
      `Departure: ${fmtDate(checkout)}`,
      `Adults: ${adults} | Children: ${children}`,
      `Occupancy: ${occupancy}`,
      `Special Requests: ${form.requests.trim() || 'None'}`,
      ``,
      `Please confirm availability.`,
    ].join('\n')
    window.open(`https://wa.me/254740659172?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    transitionToConfirm()
  }

  function fmtDate(d: Date | null) {
    if (!d) return '—'
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const eyebrow = `${suite.name} · ${fmtDate(checkin)} → ${fmtDate(checkout)} · ${adults} adult${adults !== 1 ? 's' : ''}${children > 0 ? ` · ${children} child${children !== 1 ? 'ren' : ''}` : ''} · ${occupancy}`

  const content = (
    <>
      <div
        className={`${styles.modalOverlay} ${isClosing ? styles.modalOverlayOut : ''}`}
        onClick={doClose}
        aria-hidden="true"
      />
      <div
        className={`${styles.modalCard} ${isClosing ? styles.modalCardOut : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Reservation request"
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.modalClose} onClick={doClose} aria-label="Close modal">✕</button>

        <div key={phase} className={leaving ? styles.modalContentExit : styles.modalContentEnter}>

          {phase === 'form' && (
            <form onSubmit={handleSubmit} noValidate>
              <p className={styles.modalEyebrow}>{eyebrow}</p>
              <div className={styles.modalDivider} />
              <h2 className={styles.modalHeading}>Complete Your Request</h2>

              <div className={styles.mfRow2}>
                <MfField id="mf-first" label="First Name" value={form.firstName}
                  onChange={v => setF('firstName', v)} error={errs.firstName} wrapRef={firstRef} />
                <MfField id="mf-last" label="Last Name" value={form.lastName}
                  onChange={v => setF('lastName', v)} error={errs.lastName} wrapRef={lastRef} />
              </div>

              <MfField id="mf-email" label="Email" type="email" value={form.email}
                onChange={v => setF('email', v)} error={errs.email} wrapRef={emailRef} />

              <MfPhoneField
                onChange={v => setF('phone', v)}
                onValidityChange={setPhoneValid}
                error={errs.phone}
                wrapRef={phoneRef} />

              <div className={styles.mfTextareaWrap}>
                <span className={styles.mfTextareaLabel}>Special Requests</span>
                <textarea
                  className={styles.mfTextarea}
                  rows={3}
                  placeholder="Dietary requirements, celebrations, accessibility needs."
                  value={form.requests}
                  onChange={e => setF('requests', e.target.value)}
                />
              </div>

              <div className={styles.modalSubmitArea}>

                {/* State A: single submit button */}
                <div className={submitStage === 'choose' ? styles.modalSubmitSingleExit : styles.modalSubmitSingleIdle}>
                  <button type="submit" className={styles.modalSubmitBtn} disabled={loading}>
                    {loading
                      ? <span className={styles.dots}><span /><span /><span /></span>
                      : 'Confirm Reservation Request'
                    }
                  </button>
                  <p className={styles.modalNote}>No payment required. We will confirm availability within 24 hours.</p>
                </div>

                {/* State B: choose channel */}
                <div className={submitStage === 'choose' ? styles.modalSubmitChooseVisible : styles.modalSubmitChooseIdle}>
                  <p className={styles.modalSubmitPrompt}>How would you like to send your inquiry?</p>
                  <div className={styles.modalSendBtnRow}>
                    <button type="button" className={styles.modalSubmitBtn} onClick={sendByEmail} disabled={loading}>
                      {loading
                        ? <span className={styles.dots}><span /><span /><span /></span>
                        : 'Send by Email'
                      }
                    </button>
                    <button type="button" className={styles.modalWaBtn} onClick={sendByWhatsApp}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="white" aria-hidden="true" style={{ flexShrink: 0 }}>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Send via WhatsApp
                    </button>
                  </div>
                  <button type="button" className={styles.modalBackLink} onClick={() => setSubmitStage('idle')}>
                    ← Back
                  </button>
                </div>

              </div>
            </form>
          )}

          {phase === 'confirm' && (
            <div className={styles.modalConfirm}>
              <div className={styles.modalCheckCircle} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path className={styles.modalCheckPath} d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className={styles.modalConfirmHeading}>Request Received</h2>
              <p className={styles.modalConfirmBody}>
                Thank you {form.firstName}. We'll confirm availability for {suite.name},{' '}
                {fmtDate(checkin)} to {fmtDate(checkout)} and be in touch within 24 hours.
              </p>
              <p className={styles.modalConfirmCall}>
                Questions? Call us:{' '}
                <a href="tel:+254740659172">+254 740 659 172</a>
              </p>
              <button className={styles.modalCloseBtn} onClick={doDone}>Close</button>
            </div>
          )}

        </div>
      </div>
    </>
  )

  return createPortal(content, document.body)
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
  const [activeImgIdx,  setActiveImgIdx]  = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [checkin,  setCheckin]  = useState<Date | null>(null)
  const [checkout, setCheckout] = useState<Date | null>(null)

  function handleCalendarChange(newCheckin: Date | null, newCheckout: Date | null) {
    setCheckin(newCheckin)
    setCheckout(newCheckout)
  }

  function handleThumbClick(i: number) {
    if (i === activeImgIdx || transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setActiveImgIdx(i)
      setTransitioning(false)
    }, 150)
  }

  function handlePrev() {
    handleThumbClick((activeImgIdx - 1 + suite.images.length) % suite.images.length)
  }

  function handleNext() {
    handleThumbClick((activeImgIdx + 1) % suite.images.length)
  }

  const activeImg = suite.images[activeImgIdx]

  return (
    <div className={styles.page}>

      {/* ── Two-column top section ───────────────────────── */}
      <div className={styles.topSection}>

        {/* Left: image gallery */}
        <div className={styles.galleryCol}>

          {/* Main image */}
          <div className={styles.mainImageWrap}>
            {/* Blurred background — fills letterbox bars naturally */}
            <Image
              src={activeImg.src}
              alt=""
              fill
              sizes="(max-width:768px) 100vw, 55vw"
              aria-hidden="true"
              style={{
                objectFit: 'cover',
                objectPosition: activeImg.position,
                filter: 'blur(18px)',
                transform: 'scale(1.12)',
                opacity: transitioning ? 0 : 0.45,
                transition: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}
            />
            {/* Foreground — sharp, full uncropped image */}
            <Image
              src={activeImg.src}
              alt={suite.name}
              fill
              sizes="(max-width:768px) 100vw, 55vw"
              priority
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
                opacity: transitioning ? 0 : 1,
                transition: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}
            />
            {suite.images.length > 1 && (
              <>
                <button className={`${styles.imgArrow} ${styles.imgArrowPrev}`} onClick={handlePrev} aria-label="Previous image">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className={`${styles.imgArrow} ${styles.imgArrowNext}`} onClick={handleNext} aria-label="Next image">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {suite.images.length > 1 && (
            <div className={styles.thumbRow}>
              {suite.images.map((img, i) => (
                <button
                  key={img.src}
                  className={`${styles.thumb} ${i === activeImgIdx ? styles.thumbActive : ''}`}
                  onClick={() => handleThumbClick(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={i === activeImgIdx}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="88px"
                    style={{ objectFit: 'cover', objectPosition: img.position }}
                  />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right: sticky info + reserve */}
        <div className={styles.infoCol}>

          {/* Suite info header */}
          <div className={styles.infoHeader}>
            <span className={styles.infoCategory}>{suite.category}</span>
            <h1 className={styles.infoName}>{suite.name}</h1>
            <div className={styles.infoLine} />
            <p className={styles.infoDesc}>{suite.description}</p>

            <div className={styles.infoMeta}>
              <span className={styles.infoMetaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {suite.guests} Guests
              </span>
              <span className={styles.infoMetaDot}>·</span>
              <span className={styles.infoMetaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                </svg>
                {suite.size}
              </span>
              <span className={styles.infoMetaDot}>·</span>
              <span className={styles.infoMetaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 9h20M2 9v10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9M2 9l2-6h16l2 6"/>
                </svg>
                {suite.bed}
              </span>
              {suite.connecting && (
                <>
                  <span className={styles.infoMetaDot}>·</span>
                  <span className={styles.infoMetaItem}>Connecting Rooms</span>
                </>
              )}
            </div>
          </div>

          {/* Booking box */}
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

      {/* ── Content below ────────────────────────────────── */}
      <div className={styles.body}>
        <div className={styles.bodyContent}>

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
      </div>

      {/* ── More Rooms ───────────────────────────────────── */}
      <MoreRooms current={suite.slug} />

    </div>
  )
}

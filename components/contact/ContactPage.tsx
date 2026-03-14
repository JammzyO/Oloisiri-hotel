'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import styles from './ContactPage.module.css'

const SUITES = [
  { value: '',                   label: 'Not Yet Decided' },
  { value: 'luxury-room',        label: 'Luxury Room — Top Floor' },
  { value: 'standard-king',      label: 'Standard King — Garden Level' },
  { value: 'twin-room',          label: 'Twin Room — Garden Level' },
  { value: 'family-room',        label: 'Family Room — Garden Level' },
  { value: 'interleading-suite', label: 'Interleading Suite — Garden Level' },
]

/* ─── Form (uses useSearchParams — needs Suspense wrapper) ── */
function ContactForm() {
  const params = useSearchParams()

  const [form, setForm] = useState({
    firstName:  '',
    lastName:   '',
    email:      '',
    phone:      '',
    arrival:    params.get('checkin')  ?? '',
    departure:  params.get('checkout') ?? '',
    adults:     params.get('adults')   ?? '2',
    children:   params.get('children') ?? '0',
    suite:      params.get('suite')    ?? '',
    requests:   '',
  })
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function incr(key: 'adults' | 'children', min = 0) {
    setForm(f => ({ ...f, [key]: String(Number(f[key]) + 1) }))
  }
  function decr(key: 'adults' | 'children', min = 0) {
    setForm(f => ({ ...f, [key]: String(Math.max(min, Number(f[key]) - 1)) }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim())  e.lastName  = 'Required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'A valid email is required'
    if (!form.arrival)   e.arrival   = 'Required'
    if (!form.departure) e.departure = 'Required'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setDone(true)
  }

  /* ── Thank-you state ── */
  if (done) {
    return (
      <div className={styles.thankyou}>
        <div className={styles.thankyouInner}>
          <div className={styles.thankyouMark}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className={styles.thankyouHeading}>Your inquiry has been received.</h2>
          <p className={styles.thankyouBody}>
            A member of our team will be in touch within 24 hours to begin crafting your stay at Oloisiri.
          </p>
          <p className={styles.thankyouSign}>Until then, {form.firstName}.</p>
        </div>
      </div>
    )
  }

  /* ── Form ── */
  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHead}>
        <span className={styles.formEyebrow}>Reservation Inquiry</span>
        <h2 className={styles.formTitle}>Begin Planning<br />Your Visit</h2>
      </div>

      {/* Name row */}
      <div className={styles.row2}>
        <div className={`${styles.field} ${errors.firstName ? styles.fieldErr : ''}`}>
          <label className={styles.label}>First Name</label>
          <input className={styles.input} type="text" value={form.firstName}
            onChange={e => set('firstName', e.target.value)} />
          {errors.firstName && <span className={styles.errMsg}>{errors.firstName}</span>}
        </div>
        <div className={`${styles.field} ${errors.lastName ? styles.fieldErr : ''}`}>
          <label className={styles.label}>Last Name</label>
          <input className={styles.input} type="text" value={form.lastName}
            onChange={e => set('lastName', e.target.value)} />
          {errors.lastName && <span className={styles.errMsg}>{errors.lastName}</span>}
        </div>
      </div>

      {/* Contact row */}
      <div className={styles.row2}>
        <div className={`${styles.field} ${errors.email ? styles.fieldErr : ''}`}>
          <label className={styles.label}>Email Address</label>
          <input className={styles.input} type="email" value={form.email}
            onChange={e => set('email', e.target.value)} />
          {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Phone (optional)</label>
          <input className={styles.input} type="tel" value={form.phone}
            onChange={e => set('phone', e.target.value)} />
        </div>
      </div>

      {/* Dates row */}
      <div className={styles.row2}>
        <div className={`${styles.field} ${errors.arrival ? styles.fieldErr : ''}`}>
          <label className={styles.label}>Arrival</label>
          <input className={styles.input} type="date" value={form.arrival}
            onChange={e => set('arrival', e.target.value)} />
          {errors.arrival && <span className={styles.errMsg}>{errors.arrival}</span>}
        </div>
        <div className={`${styles.field} ${errors.departure ? styles.fieldErr : ''}`}>
          <label className={styles.label}>Departure</label>
          <input className={styles.input} type="date" value={form.departure}
            min={form.arrival || undefined}
            onChange={e => set('departure', e.target.value)} />
          {errors.departure && <span className={styles.errMsg}>{errors.departure}</span>}
        </div>
      </div>

      {/* Guests + suite row */}
      <div className={styles.row3}>
        <div className={styles.field}>
          <label className={styles.label}>Adults</label>
          <div className={styles.counter}>
            <button type="button" className={styles.counterBtn}
              onClick={() => decr('adults', 1)} aria-label="Fewer adults">−</button>
            <span className={styles.counterVal}>{form.adults}</span>
            <button type="button" className={styles.counterBtn}
              onClick={() => incr('adults')} aria-label="More adults">+</button>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Children</label>
          <div className={styles.counter}>
            <button type="button" className={styles.counterBtn}
              onClick={() => decr('children', 0)} aria-label="Fewer children">−</button>
            <span className={styles.counterVal}>{form.children}</span>
            <button type="button" className={styles.counterBtn}
              onClick={() => incr('children')} aria-label="More children">+</button>
          </div>
        </div>
        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label className={styles.label}>Suite Preference</label>
          <select className={styles.select} value={form.suite}
            onChange={e => set('suite', e.target.value)}>
            {SUITES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Special requests */}
      <div className={styles.field}>
        <label className={styles.label}>Special Requests</label>
        <textarea
          className={styles.textarea}
          rows={5}
          placeholder="Dietary requirements, celebrations, accessibility needs, airport transfers…"
          value={form.requests}
          onChange={e => set('requests', e.target.value)}
        />
      </div>

      {/* Submit */}
      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading
          ? <span className={styles.dots}><span /><span /><span /></span>
          : 'Send Inquiry'
        }
      </button>
      <p className={styles.submitNote}>No payment required. We will confirm your dates within 24 hours.</p>
    </form>
  )
}

/* ─── Rate row helper ────────────────────────────────────── */
function RateRow({ label, rate }: { label: string; rate: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid rgba(201,162,77,0.15)' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '13px', color: '#5a5a52', letterSpacing: '0.02em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '18px', color: '#082f2c', letterSpacing: '-0.2px' }}>{rate}</span>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <><div className={styles.page}>

      {/* Left info panel */}
      <div className={styles.panel}>
        <div className={styles.panelBg}>
          <Image
            src="/hero-3.jpg"
            alt="Oloisiri Namanga Hotel"
            fill
            sizes="420px"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <div className={styles.panelGradient} />
        </div>

        <div className={styles.panelContent}>
          <div className={styles.panelTop}>
            <span className={styles.panelEyebrow}>Contact &amp; Reservations</span>
            <h1 className={styles.panelHeading}>
              Plan<br />Your <em>Stay</em>
            </h1>
            <p className={styles.panelIntro}>
              Our team is ready to craft your experience at the edge of two nations. Write to us — we respond within 24 hours.
            </p>
          </div>

          <div className={styles.panelInfo}>
            <div className={styles.infoItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Namanga, Kajiado County<br />Kenya — Tanzania Border</span>
            </div>
            <div className={styles.infoItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.96a16 16 0 0 0 6.02 6.02l1.32-1.26a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.92z"/>
              </svg>
              <span>+254 718 068 417</span>
            </div>
            <div className={styles.infoItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>reservations@oloisiri.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form side */}
      <div className={styles.formSide}>
        <Suspense fallback={<div className={styles.formPlaceholder} />}>
          <ContactForm />
        </Suspense>
      </div>

    </div>

    {/* ── Rates reference section ───────────────────────── */}
    <section style={{ background: '#e8ddc7', padding: '80px 72px' }}>
      <div style={{ maxWidth: '640px' }}>

        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '18px' }}>
          Current Rates
        </span>

        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#082f2c', lineHeight: 1.05, letterSpacing: '-0.01em', margin: '0 0 40px' }}>
          Simple, transparent pricing.
        </h2>

        {/* Resident rates */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '4px' }}>
            Resident Rates
          </span>
          <RateRow label="Single occupancy" rate="KES 7,500  —  B&B" />
          <RateRow label="Double occupancy" rate="KES 9,500  —  B&B" />
        </div>

        {/* Non-resident rates */}
        <div style={{ marginBottom: '36px' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '4px' }}>
            Non-Resident Rates
          </span>
          <RateRow label="Single occupancy" rate="KES 9,500  —  B&B" />
          <RateRow label="Double occupancy" rate="KES 11,000  —  B&B" />
        </div>

        {/* Opening notice */}
        <div style={{ borderLeft: '3px solid #c9a24d', paddingLeft: '16px', marginBottom: '24px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '12px', color: '#082f2c', margin: '0', lineHeight: 1.75, letterSpacing: '0.01em' }}>
            These are special opening rates, available for a limited period. All rates are per room per night, bed and breakfast basis. Buffet meals available on arrangement at KES 2,500 per head.
          </p>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '12px', color: '#857f77', margin: '0', lineHeight: 1.75, letterSpacing: '0.01em' }}>
          For group bookings or extended stays, contact us directly.
        </p>

      </div>
    </section>
    </>
  )
}

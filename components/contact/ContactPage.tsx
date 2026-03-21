'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Image from 'next/image'
import styles from './ContactPage.module.css'

// ── Constants ─────────────────────────────────────────────────────────────────

const SUBJECTS = [
  { value: '',              label: 'Select a subject'    },
  { value: 'events',        label: 'Events & Weddings'   },
  { value: 'conference',    label: 'Conference Booking'  },
  { value: 'group',         label: 'Group Rates'         },
  { value: 'accessibility', label: 'Accessibility'       },
  { value: 'other',         label: 'Other'               },
]

// ── Email validator ───────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

// ── Floating-label field ──────────────────────────────────────────────────────

interface FieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  error?: string
  errorClassName?: string
  required?: boolean
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  onPaste?: React.ClipboardEventHandler<HTMLInputElement>
  onBlur?: () => void
}

function Field({ id, label, type = 'text', value, onChange, error, errorClassName, required, onKeyDown, onPaste, onBlur }: FieldProps) {
  const shakeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (error && shakeRef.current) {
      shakeRef.current.classList.remove(styles.fieldShake)
      void shakeRef.current.offsetWidth
      shakeRef.current.classList.add(styles.fieldShake)
    }
  }, [error])

  return (
    <div
      ref={shakeRef}
      className={`${styles.field} ${error ? styles.fieldErr : ''}`}
    >
      <div className={styles.fieldInner}>
        <input
          id={id}
          className={styles.input}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onBlur={onBlur}
          placeholder=" "
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
        />
        <label htmlFor={id} className={styles.floatLabel}>{label}</label>
      </div>
      {error && <span id={`${id}-err`} className={errorClassName ?? styles.errMsg}>{error}</span>}
    </div>
  )
}

// ── Phone field (Kenya fixed prefix) ─────────────────────────────────────────

function PhoneField({ onChange, onValidityChange, error, onErrorClear }: {
  onChange: (fullNumber: string) => void
  onValidityChange: (valid: boolean) => void
  error?: string
  onErrorClear: () => void
}) {
  const [rawDigits, setRawDigits] = useState('')
  const shakeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (error && shakeRef.current) {
      shakeRef.current.classList.remove(styles.fieldShake)
      void shakeRef.current.offsetWidth
      shakeRef.current.classList.add(styles.fieldShake)
    }
  }, [error])

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
    if (digits.length > 0) onErrorClear()
  }

  return (
    <div ref={shakeRef} className={styles.phoneField}>
      <span className={styles.phoneLabel}>Phone</span>
      <div className={`${styles.phoneRow} ${error ? styles.phoneRowErr : ''}`}>
        <span className={styles.phonePrefix}>🇰🇪 +254</span>
        <input
          id="gen-phone"
          type="tel"
          inputMode="numeric"
          className={styles.phoneInput}
          value={formatKe(rawDigits)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="7XX XXX XXX"
          aria-label="Phone number"
          aria-invalid={!!error}
        />
      </div>
      {error && <span className={styles.errMsgGold}>{error}</span>}
    </div>
  )
}

// ── Thank-you panel ───────────────────────────────────────────────────────────

function ThankYou({ firstName }: { firstName: string }) {
  return (
    <div className={styles.thankWrap}>
      <div className={styles.thankInner}>
        <div className={styles.checkCircle} aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.3"
            strokeLinecap="round" strokeLinejoin="round">
            <path className={styles.checkPath} d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className={styles.thankHeading}>Thank You{firstName ? `, ${firstName}` : ''}.</h2>
        <p className={styles.thankBody}>
          Your inquiry has been received. We will be in touch within 24 hours.
        </p>
        <p className={styles.thankCall}>
          Questions in the meantime?{' '}
          Call us: <a href="tel:+254718068417">+254 718 068 417</a>
        </p>
      </div>
    </div>
  )
}

// ── General inquiry form ──────────────────────────────────────────────────────

function GeneralForm({ onDone }: { onDone: (name: string) => void }) {
  const [form, setForm]           = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors]       = useState<Record<string, string>>({})
  const [loading, setLoading]     = useState(false)
  const [phoneValid, setPhoneValid] = useState(false)

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function handleNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    if (e.key.length > 1) return
    if (!/[a-zA-ZÀ-ÿ\s'\-]/.test(e.key)) e.preventDefault()
  }

  function handleFirstNamePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const cleaned = e.clipboardData.getData('text').replace(/[^a-zA-ZÀ-ÿ\s'\-]/g, '')
    set('firstName', cleaned)
  }

  function handleLastNamePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const cleaned = e.clipboardData.getData('text').replace(/[^a-zA-ZÀ-ÿ\s'\-]/g, '')
    set('lastName', cleaned)
  }

  function handleEmailBlur() {
    if (form.email && !isValidEmail(form.email)) {
      setErrors(e => ({ ...e, email: 'Please enter a valid email address' }))
    }
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.firstName.trim())                          e.firstName = 'Please enter a valid name'
    if (!form.lastName.trim())                           e.lastName  = 'Please enter a valid name'
    if (!form.email.trim() || !isValidEmail(form.email)) e.email     = 'Please enter a valid email address'
    if (!form.phone || !phoneValid)                      e.phone     = 'Please enter a complete phone number'
    if (!form.subject)                                   e.subject   = 'Please select a subject'
    if (!form.message.trim())                            e.message   = 'This field is required'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await fetch('https://hook.eu2.make.com/63n5mfv4mnxthadep8a46ie2wi1und3u', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:      'General Inquiry',
          firstname: form.firstName,
          lastname:  form.lastName,
          email:     form.email,
          phone:     form.phone,
          subject:   form.subject,
          message:   form.message,
        }),
      })
    } catch (err) {
      console.error('General inquiry webhook error:', err)
    }
    setLoading(false)
    onDone(form.firstName)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.formHead}>
        <span className={styles.formEyebrow}>General Inquiry</span>
        <h2 className={styles.formTitle}>How Can We<br />Help You?</h2>
      </div>

      {/* Row 1: Name */}
      <div className={styles.row2}>
        <Field id="gen-first" label="First Name" value={form.firstName}
          onChange={v => set('firstName', v)}
          onKeyDown={handleNameKeyDown}
          onPaste={handleFirstNamePaste}
          error={errors.firstName} required />
        <Field id="gen-last" label="Last Name" value={form.lastName}
          onChange={v => set('lastName', v)}
          onKeyDown={handleNameKeyDown}
          onPaste={handleLastNamePaste}
          error={errors.lastName} required />
      </div>

      {/* Row 2: Contact */}
      <div className={styles.row2}>
        <Field id="gen-email" label="Email Address" type="email" value={form.email}
          onChange={v => set('email', v)}
          onBlur={handleEmailBlur}
          error={errors.email} required />
        <PhoneField
          onChange={v => set('phone', v)}
          onValidityChange={setPhoneValid}
          error={errors.phone}
          onErrorClear={() => setErrors(e => ({ ...e, phone: '' }))}
        />
      </div>

      {/* Row 3: Subject */}
      <div className={`${styles.field} ${errors.subject ? styles.fieldErr : ''}`}>
        <div className={styles.fieldInner}>
          <select
            id="gen-subject"
            className={`${styles.select} ${form.subject ? styles.selectFilled : ''}`}
            value={form.subject}
            onChange={e => set('subject', e.target.value)}
          >
            {SUBJECTS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <label htmlFor="gen-subject" className={styles.floatLabel}>Subject</label>
        </div>
        {errors.subject && <span className={styles.errMsg}>{errors.subject}</span>}
      </div>

      {/* Row 4: Message */}
      <div className={`${styles.textareaWrap} ${errors.message ? styles.fieldErr : ''}`}>
        <span className={styles.textareaLabel}>Message</span>
        <textarea
          className={styles.textarea}
          rows={5}
          placeholder="Tell us how we can help."
          value={form.message}
          onChange={e => set('message', e.target.value)}
          aria-invalid={!!errors.message}
        />
        {errors.message && <span className={styles.errMsg}>{errors.message}</span>}
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading
          ? <span className={styles.dots}><span /><span /><span /></span>
          : 'Send Message'
        }
      </button>
      <p className={styles.submitNote}>We respond to all enquiries within 24 hours.</p>
    </form>
  )
}

// ── Rate row ──────────────────────────────────────────────────────────────────

function RateRow({ label, rate }: { label: string; rate: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '10px 0', borderBottom: '1px solid rgba(201,162,77,0.15)',
    }}>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '13px', color: '#5a5a52', letterSpacing: '0.02em' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '18px', color: '#082f2c', letterSpacing: '-0.2px' }}>
        {rate}
      </span>
    </div>
  )
}

// ── Contact client ────────────────────────────────────────────────────────────

function ContactClient() {
  const [mounted, setMounted]   = useState(false)
  const [done, setDone]         = useState(false)
  const [doneName, setDoneName] = useState('')
  const panelBgRef              = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (panelBgRef.current) {
        panelBgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleDone(name: string) {
    setDoneName(name)
    setDone(true)
  }

  return (
    <>
      <div className={`${styles.page} ${mounted ? styles.mounted : ''}`}>

        {/* ── Left panel ── */}
        <div className={styles.panel}>
          <div className={styles.panelBg} ref={panelBgRef}>
            <Image
              src="/images/restaurant-5.jpeg"
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
              <span className={styles.panelEyebrow}>Get In Touch</span>
              <h1 className={styles.panelHeading}>
                How Can<br />We <em>Help?</em>
              </h1>
              <p className={styles.panelIntro}>
                For general enquiries — our team responds within 24 hours. To make a reservation, use the Reserve Your Stay button in the navigation.
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

        {/* ── Right: form ── */}
        <div className={styles.formSide}>
          {done ? (
            <ThankYou firstName={doneName} />
          ) : (
            <div className={`${styles.formWrap} ${styles.formInitialEnter}`}>
              <GeneralForm onDone={handleDone} />
            </div>
          )}
        </div>
      </div>

      {/* ── Rates section ── */}
      <section className={styles.ratesSection}>
        <div style={{ maxWidth: '640px' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '18px' }}>
            Current Rates
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#082f2c', lineHeight: 1.05, letterSpacing: '-0.01em', margin: '0 0 40px' }}>
            Simple, transparent pricing.
          </h2>

          <div style={{ marginBottom: '32px' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '4px' }}>
              Resident Rates
            </span>
            <RateRow label="Single occupancy" rate="KES 7,500 — B&B" />
            <RateRow label="Double occupancy" rate="KES 9,500 — B&B" />
          </div>

          <div style={{ marginBottom: '36px' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '4px' }}>
              Non-Resident Rates
            </span>
            <RateRow label="Single occupancy" rate="KES 9,500 — B&B" />
            <RateRow label="Double occupancy" rate="KES 11,000 — B&B" />
          </div>

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

// ── Page export ───────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#e8ddc7' }} />}>
      <ContactClient />
    </Suspense>
  )
}

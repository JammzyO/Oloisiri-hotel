'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../contact/ContactPage.module.css'

// ── Constants ─────────────────────────────────────────────────────────────────

const SUITES = [
  { value: '',                   label: 'Not Yet Decided'      },
  { value: 'luxury-room',        label: 'Luxury Room'          },
  { value: 'standard-king',      label: 'Standard King'        },
  { value: 'twin-room',          label: 'Twin Room'            },
  { value: 'family-room',        label: 'Family Room'          },
  { value: 'interleading-suite', label: 'Interleading Suite'   },
]

const WEBHOOK = 'https://hook.eu2.make.com/63n5mfv4mnxthadep8a46ie2wi1und3u'

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
  required?: boolean
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  onPaste?: React.ClipboardEventHandler<HTMLInputElement>
  onBlur?: () => void
}

function Field({ id, label, type = 'text', value, onChange, error, required, onKeyDown, onPaste, onBlur }: FieldProps) {
  const shakeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (error && shakeRef.current) {
      shakeRef.current.classList.remove(styles.fieldShake)
      void shakeRef.current.offsetWidth
      shakeRef.current.classList.add(styles.fieldShake)
    }
  }, [error])

  return (
    <div ref={shakeRef} className={`${styles.field} ${error ? styles.fieldErr : ''}`}>
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
      {error && <span id={`${id}-err`} className={styles.errMsgGold}>{error}</span>}
    </div>
  )
}

// ── Counter field ─────────────────────────────────────────────────────────────

function Counter({ label, value, min = 0, onChange }: {
  label: string
  value: number
  min?: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <span className={styles.counterLabel}>{label}</span>
      <div className={styles.counter}>
        <button
          type="button"
          className={styles.counterBtn}
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Fewer ${label.toLowerCase()}`}
        >−</button>
        <span className={styles.counterVal}>{value}</span>
        <button
          type="button"
          className={styles.counterBtn}
          onClick={() => onChange(value + 1)}
          aria-label={`More ${label.toLowerCase()}`}
        >+</button>
      </div>
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
          id="rv-phone"
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
          Your reservation inquiry has been received. We will confirm availability within 24 hours.
        </p>
        <p className={styles.thankCall}>
          Questions in the meantime?{' '}
          Call us: <a href="tel:+254718068417">+254 718 068 417</a>
        </p>
      </div>
    </div>
  )
}

// ── Reservation form ──────────────────────────────────────────────────────────

function ReservationForm({ onDone }: { onDone: (name: string) => void }) {
  const params = useSearchParams()

  const [form, setForm] = useState({
    firstName:  '',
    lastName:   '',
    email:      '',
    phone:      '',
    arrival:    params.get('checkin')  ?? '',
    departure:  params.get('checkout') ?? '',
    adults:     Number(params.get('adults')   ?? 2),
    children:   Number(params.get('children') ?? 0),
    suite:      params.get('suite')    ?? '',
    occupancy:  '',
    requests:   '',
  })
  const [errors, setErrors]         = useState<Record<string, string>>({})
  const [loading, setLoading]       = useState(false)
  const [phoneValid, setPhoneValid] = useState(false)

  function set(key: string, value: string | number) {
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
    if (!form.arrival)                                   e.arrival   = 'This field is required'
    if (!form.departure)                                 e.departure = 'This field is required'
    if (form.arrival && form.departure && form.departure <= form.arrival)
      e.departure = 'Check-out must be after check-in'
    if (!form.occupancy)                                 e.occupancy = 'Please select an occupancy type'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:             'Reservation Inquiry',
          firstname:        form.firstName,
          lastname:         form.lastName,
          email:            form.email,
          phone:            form.phone,
          checkin:          form.arrival,
          checkout:         form.departure,
          adults:           String(form.adults),
          children:         String(form.children),
          room:             form.suite,
          occupancy:        form.occupancy,
          special_requests: form.requests,
        }),
      })
    } catch (err) {
      console.error('Reservation webhook error:', err)
    }
    setLoading(false)
    onDone(form.firstName)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.formHead}>
        <span className={styles.formEyebrow}>Reservation Inquiry</span>
        <h2 className={styles.formTitle}>Begin Planning<br />Your Visit</h2>
      </div>

      {/* Row 1: Name */}
      <div className={styles.row2}>
        <Field id="rv-first" label="First Name" value={form.firstName}
          onChange={v => set('firstName', v)}
          onKeyDown={handleNameKeyDown}
          onPaste={handleFirstNamePaste}
          error={errors.firstName}
          required />
        <Field id="rv-last" label="Last Name" value={form.lastName}
          onChange={v => set('lastName', v)}
          onKeyDown={handleNameKeyDown}
          onPaste={handleLastNamePaste}
          error={errors.lastName}
          required />
      </div>

      {/* Row 2: Email + Phone */}
      <div className={styles.row2}>
        <Field id="rv-email" label="Email Address" type="email" value={form.email}
          onChange={v => set('email', v)}
          onBlur={handleEmailBlur}
          error={errors.email}
          required />
        <PhoneField
          onChange={v => set('phone', v)}
          onValidityChange={setPhoneValid}
          error={errors.phone}
          onErrorClear={() => setErrors(e => ({ ...e, phone: '' }))}
        />
      </div>

      {/* Row 3: Dates */}
      <div className={styles.row2}>
        <Field id="rv-arrival" label="Arrival" type="date" value={form.arrival}
          onChange={v => set('arrival', v)} error={errors.arrival} required />
        <Field id="rv-departure" label="Departure" type="date" value={form.departure}
          onChange={v => set('departure', v)} error={errors.departure} required />
      </div>

      {/* Row 4: Guests */}
      <div className={styles.row2half}>
        <Counter label="Adults" value={form.adults} min={1}
          onChange={v => set('adults', v)} />
        <Counter label="Children" value={form.children} min={0}
          onChange={v => set('children', v)} />
      </div>

      {/* Row 5: Suite preference */}
      <div className={`${styles.field} ${errors.suite ? styles.fieldErr : ''}`}>
        <div className={styles.fieldInner}>
          <select
            id="rv-suite"
            className={`${styles.select} ${form.suite ? styles.selectFilled : ''}`}
            value={form.suite}
            onChange={e => set('suite', e.target.value)}
          >
            {SUITES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <label htmlFor="rv-suite" className={styles.floatLabel}>Suite Preference</label>
        </div>
        <Link href="/suites" className={styles.suiteLink}>
          Not sure? View all rooms →
        </Link>
      </div>

      {/* Row 6: Occupancy */}
      <div style={{ marginBottom: 36 }}>
        <span className={styles.pillLabel}>Occupancy Type</span>
        <div
          className={`${styles.pillGroup} ${errors.occupancy ? styles.pillGroupErr : ''}`}
          role="group"
          aria-label="Occupancy type"
        >
          {['Single', 'Double'].map(opt => (
            <button
              key={opt}
              type="button"
              className={`${styles.pill} ${form.occupancy === opt.toLowerCase() ? styles.pillActive : ''}`}
              onClick={() => set('occupancy', opt.toLowerCase())}
              aria-pressed={form.occupancy === opt.toLowerCase()}
            >
              <span>{opt}</span>
            </button>
          ))}
        </div>
        {errors.occupancy && (
          <span className={styles.errMsg}>{errors.occupancy}</span>
        )}
      </div>

      {/* Row 7: Special requests */}
      <div className={styles.textareaWrap}>
        <span className={styles.textareaLabel}>Special Requests</span>
        <textarea
          className={styles.textarea}
          rows={4}
          placeholder="Dietary requirements, celebrations, accessibility needs, airport transfers…"
          value={form.requests}
          onChange={e => set('requests', e.target.value)}
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading
          ? <span className={styles.dots}><span /><span /><span /></span>
          : 'Send Reservation Inquiry'
        }
      </button>
      <p className={styles.submitNote}>No payment required. We will confirm availability within 24 hours.</p>
    </form>
  )
}

// ── Page client ───────────────────────────────────────────────────────────────

function ReserveClient() {
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
            <span className={styles.panelEyebrow}>Reserve Your Stay</span>
            <h1 className={styles.panelHeading}>
              Where the Wild<br />Meets <em>the Refined</em>
            </h1>
            <p className={styles.panelIntro}>
              Tell us when you are coming and we will take care of the rest. Our team responds within 24 hours.
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

      {/* ── Right: form (no tabs) ── */}
      <div className={styles.formSide}>
        {done ? (
          <ThankYou firstName={doneName} />
        ) : (
          <div className={`${styles.formWrap} ${styles.formInitialEnter}`}>
            <ReservationForm onDone={handleDone} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function ReservePage() {
  return (
    <Suspense>
      <ReserveClient />
    </Suspense>
  )
}

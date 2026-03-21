'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import styles from './ContactPage.module.css'

// ── Constants ─────────────────────────────────────────────────────────────────

const SUITES = [
  { value: '',                   label: 'Not Yet Decided'      },
  { value: 'luxury-room',        label: 'Luxury Room'          },
  { value: 'standard-king',      label: 'Standard King'        },
  { value: 'twin-room',          label: 'Twin Room'            },
  { value: 'family-room',        label: 'Family Room'          },
  { value: 'interleading-suite', label: 'Interleading Suite'   },
]

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
    const valid = digits.length === 9
    onValidityChange(valid)
    if (digits.length > 0) onErrorClear()
  }

  return (
    <div ref={shakeRef} className={styles.phoneField}>
      <span className={styles.phoneLabel}>Phone</span>
      <div className={`${styles.phoneRow} ${error ? styles.phoneRowErr : ''}`}>
        <span className={styles.phonePrefix}>🇰🇪 +254</span>
        <input
          id="res-phone"
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
  const [errors, setErrors]           = useState<Record<string, string>>({})
  const [loading, setLoading]         = useState(false)
  const [phoneValid, setPhoneValid]   = useState(false)
  const [submitStage, setSubmitStage] = useState<'idle' | 'choose'>('idle')

  function set(key: string, value: string | number) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  // ── Name field handlers ──

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

  // ── Email blur handler ──

  function handleEmailBlur() {
    if (form.email && !isValidEmail(form.email)) {
      setErrors(e => ({ ...e, email: 'Please enter a valid email address' }))
    }
  }

  // ── Validation ──

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

  function sendByWhatsApp() {
    const suiteName = SUITES.find(s => s.value === form.suite)?.label ?? 'Not Yet Decided'
    const requests = form.requests.trim() || 'None'
    const message =
      `Hello Oloisiri,\n\nI would like to make a reservation inquiry.\n\nName: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\nPhone: ${form.phone}\nArrival: ${form.arrival}\nDeparture: ${form.departure}\nAdults: ${form.adults} | Children: ${form.children}\nRoom: ${suiteName}\nOccupancy: ${form.occupancy}\nSpecial Requests: ${requests}\n\nPlease confirm availability.`
    window.open(`https://wa.me/254718068417?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
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
        <Field id="res-first" label="First Name" value={form.firstName}
          onChange={v => set('firstName', v)}
          onKeyDown={handleNameKeyDown}
          onPaste={handleFirstNamePaste}
          error={errors.firstName}
          errorClassName={styles.errMsgGold}
          required />
        <Field id="res-last" label="Last Name" value={form.lastName}
          onChange={v => set('lastName', v)}
          onKeyDown={handleNameKeyDown}
          onPaste={handleLastNamePaste}
          error={errors.lastName}
          errorClassName={styles.errMsgGold}
          required />
      </div>

      {/* Row 2: Email + Phone */}
      <div className={styles.row2}>
        <Field id="res-email" label="Email Address" type="email" value={form.email}
          onChange={v => set('email', v)}
          onBlur={handleEmailBlur}
          error={errors.email}
          errorClassName={styles.errMsgGold}
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
        <Field id="res-arrival" label="Arrival" type="date" value={form.arrival}
          onChange={v => set('arrival', v)} error={errors.arrival} required />
        <Field id="res-departure" label="Departure" type="date" value={form.departure}
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
            id="res-suite"
            className={`${styles.select} ${form.suite ? styles.selectFilled : ''}`}
            value={form.suite}
            onChange={e => set('suite', e.target.value)}
          >
            {SUITES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <label htmlFor="res-suite" className={styles.floatLabel}>Suite Preference</label>
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

      {/* ── Submit area — two-state ── */}
      <div className={styles.submitArea}>

        {/* State A: single submit button */}
        <div className={submitStage === 'choose' ? styles.submitSingleExit : styles.submitSingleIdle}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading
              ? <span className={styles.dots}><span /><span /><span /></span>
              : 'Send Reservation Inquiry'
            }
          </button>
          <p className={styles.submitNote}>No payment required. We will confirm availability within 24 hours.</p>
        </div>

        {/* State B: choose channel */}
        <div className={submitStage === 'choose' ? styles.submitChooseVisible : styles.submitChooseIdle}>
          <p className={styles.submitPrompt}>How would you like to send your inquiry?</p>
          <div className={styles.sendBtnRow}>
            <button type="button" className={styles.submitBtn} onClick={sendByEmail} disabled={loading}>
              {loading
                ? <span className={styles.dots}><span /><span /><span /></span>
                : 'Send by Email'
              }
            </button>
            <button type="button" className={styles.sendWaBtn} onClick={sendByWhatsApp}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="white" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send via WhatsApp
            </button>
          </div>
          <button type="button" className={styles.backLink} onClick={() => setSubmitStage('idle')}>
            ← Back
          </button>
        </div>

      </div>
    </form>
  )
}

// ── General inquiry form ──────────────────────────────────────────────────────

function GeneralForm({ onDone }: { onDone: (name: string) => void }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
    subject:   '',
    message:   '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'This field is required'
    if (!form.lastName.trim())  e.lastName  = 'This field is required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'A valid email is required'
    if (!form.phone.trim())     e.phone     = 'This field is required'
    if (!form.subject)          e.subject   = 'Please select a subject'
    if (!form.message.trim())   e.message   = 'This field is required'
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
          onChange={v => set('firstName', v)} error={errors.firstName} required />
        <Field id="gen-last" label="Last Name" value={form.lastName}
          onChange={v => set('lastName', v)} error={errors.lastName} required />
      </div>

      {/* Row 2: Contact */}
      <div className={styles.row2}>
        <Field id="gen-email" label="Email Address" type="email" value={form.email}
          onChange={v => set('email', v)} error={errors.email} required />
        <Field id="gen-phone" label="Phone — +254 7XX XXX XXX" type="tel" value={form.phone}
          onChange={v => set('phone', v)} error={errors.phone} required />
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

// ── Contact client (tab system + entrance) ────────────────────────────────────

function ContactClient() {
  const [mounted, setMounted]         = useState(false)
  const [activeTab, setActiveTab]     = useState(0)
  const [exiting, setExiting]         = useState(false)
  const [initialDone, setInitialDone] = useState(false)
  const [done, setDone]               = useState(false)
  const [doneName, setDoneName]       = useState('')
  const panelBgRef                    = useRef<HTMLDivElement>(null)
  const nextTabRef                    = useRef(0)

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

  function switchTab(i: number) {
    if (i === activeTab || exiting) return
    nextTabRef.current = i
    setExiting(true)
    setInitialDone(true)
    setTimeout(() => {
      setActiveTab(nextTabRef.current)
      setExiting(false)
      setDone(false)
    }, 250)
  }

  function handleDone(name: string) {
    setDoneName(name)
    setDone(true)
  }

  function formClass() {
    if (exiting) return styles.formExit
    if (!initialDone) return styles.formInitialEnter
    return styles.formEnter
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
              <span className={styles.panelEyebrow}>Contact &amp; Reservations</span>
              <h1 className={styles.panelHeading}>
                Plan<br />Your <em>Stay</em>
              </h1>
              <p className={styles.panelIntro}>
                For reservations and general enquiries — our team responds within 24 hours.
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

        {/* ── Right: tabs + form ── */}
        <div className={styles.formSide}>

          {/* Tab bar */}
          <div className={styles.tabBar} role="tablist">
            {['Reservation Inquiry', 'General Inquiry'].map((label, i) => (
              <button
                key={i}
                role="tab"
                className={`${styles.tabBtn} ${activeTab === i && !exiting ? styles.tabBtnActive : ''}`}
                aria-selected={activeTab === i && !exiting}
                onClick={() => switchTab(i)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form area */}
          {done ? (
            <ThankYou firstName={doneName} />
          ) : (
            <div
              key={`${activeTab}-${exiting}`}
              className={`${styles.formWrap} ${formClass()}`}
            >
              {activeTab === 0
                ? <ReservationForm onDone={handleDone} />
                : <GeneralForm onDone={handleDone} />
              }
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

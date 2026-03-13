'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './AboutPage.module.css'

/* ─── useInView ──────────────────────────────────────────── */
function useInView<T extends HTMLElement = HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ─── Animated stat counter ─────────────────────────────── */
function AnimatedStat({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      const dur = 2000
      const start = Date.now()
      const tick = () => {
        const p = Math.min((Date.now() - start) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setCount(Math.round(eased * value))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])
  return (
    <div ref={ref} className={styles.stat}>
      <div className={styles.statNum}>{count}{suffix}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}

/* ─── Data ───────────────────────────────────────────────── */
const MARQUEE = [
  'A Sanctuary at the Edge of Two Nations',
  'Namanga',
  'Kenya · Tanzania',
  'Where Kilimanjaro Watches',
  'Safari Luxury',
  '24 Suites',
  'The Land Was Here First',
  'Est. 2024',
]

const pillars = [
  {
    num: '01',
    title: 'Safari Luxury',
    body: 'Every detail at Oloisiri is drawn from the land — stone floors, linen drapes, the scent of cedar on morning air. Luxury here is not a distance from nature. It is a deeper entry into it.',
  },
  {
    num: '02',
    title: 'Cultural Reverence',
    body: 'We sit at the threshold of Kenya and Tanzania, on land that has been walked by the Maasai for generations. Their craft, their colour, and their philosophy of stewardship run through every room.',
  },
  {
    num: '03',
    title: 'Land Stewardship',
    body: 'Oloisiri was built with the conviction that beauty must be earned. Solar energy, locally sourced materials, and active partnerships with neighbouring communities are not afterthoughts — they are the foundation.',
  },
]

const gallery = [
  { src: '/about-room-1.jpg', label: 'Savannah Suite' },
  { src: '/about-story.jpg',  label: 'Heritage Room' },
  { src: '/about-room-2.jpg', label: 'Garden Terrace' },
  { src: '/about-room-3.jpg', label: 'Kilimanjaro View' },
  { src: '/about-room-4.jpg', label: 'Private Pool' },
  { src: '/about-room-5.jpg', label: 'Bush Villa' },
]

/* ─── Page ───────────────────────────────────────────────── */
export default function AboutPage() {
  const heroImgRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })

  const story      = useInView<HTMLElement>(0.1)
  const statement  = useInView<HTMLElement>(0.15)
  const numbers    = useInView<HTMLElement>(0.08)
  const commitment = useInView<HTMLElement>(0.06)
  const detail     = useInView<HTMLElement>(0.1)
  const cta        = useInView<HTMLElement>(0.18)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Parallax — translateY only, container already oversized
  useEffect(() => {
    const img = heroImgRef.current
    if (!img) return
    const onScroll = () => {
      img.style.transform = `translateY(${window.scrollY * 0.22}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    const el = galleryRef.current
    if (!el) return
    setDragging(true)
    dragStart.current = { x: e.pageX, scrollLeft: el.scrollLeft }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !galleryRef.current) return
    e.preventDefault()
    galleryRef.current.scrollLeft = dragStart.current.scrollLeft - (e.pageX - dragStart.current.x) * 1.5
  }
  const onMouseUp = () => setDragging(false)

  const heroWords = ['A', 'sanctuary', 'at', 'the', 'edge', 'of', 'two', 'nations.']

  return (
    <div className={styles.page}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroImageWrap}>
          <div ref={heroImgRef} className={styles.heroParallax}>
            <Image
              src="/suite-kilimanjaro-a.jpg"
              alt="Doorway framing Kilimanjaro at Oloisiri"
              fill priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            />
          </div>
        </div>

        {/* Film grain overlay */}
        <div className={styles.heroGrain} aria-hidden="true" />
        <div className={styles.heroOverlay} />

        {/* Top label strip */}
        <div className={`${styles.heroTopBar} ${loaded ? styles.loaded : ''}`}>
          <span className={styles.heroCoords}>1°34′S · 36°47′E</span>
          <span className={styles.heroTag}>Kenya — Tanzania Border</span>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroHeading}>
            {heroWords.map((word, i) => (
              <span
                key={i}
                className={`${styles.heroWord} ${loaded ? styles.heroWordIn : ''}`}
                style={{ animationDelay: `${0.2 + i * 0.08}s` }}
              >
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className={`${styles.heroSub} ${loaded ? styles.heroSubIn : ''}`}>
            Where Kilimanjaro watches over every dawn, and the land asks only that you slow down.
          </p>
        </div>

        <div className={styles.scrollCue} aria-hidden="true">
          <span className={styles.scrollLine} />
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────── */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              {item}
              <span className={styles.marqueeDot}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Story ────────────────────────────────────────── */}
      <section
        ref={story.ref}
        className={`${styles.story} ${story.inView ? styles.inView : ''}`}
      >
        <div className={styles.storyInner}>
          <div className={styles.storyLeft}>
            <span className={styles.eyebrow}>Our Story</span>
            <h2 className={styles.storyHeading}>
              Built for those who travel to <em>feel</em>,<br/>not merely to stay.
            </h2>
            <div className={styles.storyRule} />
            <p className={styles.storyBody}>
              Oloisiri Namanga Hotel stands at a singular address — a point where Kenya meets Tanzania,
              where the plains open to a sky too vast to photograph, and where Kilimanjaro rises above
              the morning mist without announcement or apology.
            </p>
            <p className={styles.storyBody}>
              Twenty-four suites, each handcrafted from materials drawn from the earth: stone, timber,
              linen. Each room a quiet argument that true luxury is not distance from the world, but a
              deeper, more attentive relationship with it.
            </p>
          </div>

          <div className={styles.storyRight}>
            <div className={styles.storyGhost} aria-hidden="true">Place</div>
            <div className={styles.storyArch}>
              <Image
                src="/about-story.jpg"
                alt="Oloisiri suite interior"
                fill sizes="(max-width: 1000px) 90vw, 460px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <p className={styles.storyCaption}>
              — Vibrant African portraiture adorns every suite
            </p>
          </div>
        </div>

        <div className={styles.pullQuote}>
          <div className={styles.pullLine} />
          <blockquote className={styles.pullText}>
            "The finest luxury is the one that leaves no trace — except in memory."
          </blockquote>
          <div className={styles.pullLine} />
        </div>
      </section>

      {/* ── Statement (typographic bomb) ─────────────────── */}
      <section
        ref={statement.ref}
        className={`${styles.statement} ${statement.inView ? styles.statementIn : ''}`}
      >
        <div className={styles.statementInner}>
          <div className={styles.statementLeft}>
            <span className={styles.statementEyebrow}>Oloisiri · Namanga</span>
          </div>
          <p className={styles.statementText}>
            The land<br />was here<br /><em>first.</em>
          </p>
        </div>
        <div className={styles.statementGhost} aria-hidden="true">Land</div>
      </section>

      {/* ── Numbers ──────────────────────────────────────── */}
      <section
        ref={numbers.ref}
        className={`${styles.numbers} ${numbers.inView ? styles.inView : ''}`}
      >
        <div className={styles.numbersInner}>
          <div className={styles.numbersHeader}>
            <span className={styles.eyebrowLight}>By the Numbers</span>
            <div className={styles.numbersRule} />
          </div>
          <div className={styles.statsGrid}>
            <AnimatedStat value={24}  label="Handcrafted suites" />
            <AnimatedStat value={3}   suffix="+" label="Dining experiences" />
            <AnimatedStat value={2}   label="Nations at your doorstep" />
            <AnimatedStat value={5}   suffix="★" label="Guest rating" />
          </div>
        </div>
        <div className={styles.numbersGrain} aria-hidden="true" />
      </section>

      {/* ── Gallery strip ────────────────────────────────── */}
      <section className={styles.gallerySection}>
        <div className={styles.galleryHeader}>
          <span className={styles.eyebrow}>The Rooms</span>
          <span className={styles.galleryHint}>drag to explore →</span>
        </div>
        <div
          ref={galleryRef}
          className={`${styles.galleryStrip} ${dragging ? styles.grabbing : ''}`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {gallery.map((item, i) => (
            <div
              key={i}
              className={styles.galleryItem}
              style={{
                height: [480, 380, 440, 500, 420, 460][i],
                minWidth: Math.round([480, 380, 440, 500, 420, 460][i] * 0.72),
              }}
            >
              <Image
                src={item.src} alt={item.label} fill
                sizes="500px" draggable={false}
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.galleryItemOverlay}>
                <span className={styles.galleryItemLabel}>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Commitment ───────────────────────────────────── */}
      <section
        ref={commitment.ref}
        className={`${styles.commitment} ${commitment.inView ? styles.inView : ''}`}
      >
        <div className={styles.commitmentInner}>
          <div className={styles.commitmentHeader}>
            <span className={styles.eyebrowLight}>What We Stand For</span>
            <h2 className={styles.commitmentHeading}>
              Three commitments.<br />One unwavering <em>address.</em>
            </h2>
          </div>

          <div className={styles.pillars}>
            {pillars.map((p, i) => (
              <div
                key={p.num}
                className={styles.pillar}
                style={{ transitionDelay: `${i * 0.16}s` }}
              >
                <div className={styles.pillarGhost} aria-hidden="true">{p.num}</div>
                <div className={styles.pillarNum}>{p.num}</div>
                <div className={styles.pillarLine} />
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarBody}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Detail split ─────────────────────────────────── */}
      <section
        ref={detail.ref}
        className={`${styles.detailSection} ${detail.inView ? styles.inView : ''}`}
      >
        <div className={styles.detailLeft}>
          <div className={styles.detailImgWrap}>
            <Image
              src="/about-detail.jpg"
              alt="Oloisiri branded bathroom amenities"
              fill sizes="(max-width: 900px) 100vw, 55vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
          <div className={styles.detailVertLabel} aria-hidden="true">
            The Detail Lies in Everything
          </div>
        </div>
        <div className={styles.detailRight}>
          <span className={styles.eyebrow}>The Details</span>
          <h2 className={styles.detailHeading}>
            Nothing here<br />is accidental.
          </h2>
          <div className={styles.detailRule} />
          <p className={styles.detailBody}>
            From the branded soap cradled in a hand-woven basket to the thread count of the linen
            — every object in an Oloisiri room has been considered. Because attention to detail
            is not about perfection. It is about care.
          </p>
          <p className={styles.detailBody}>
            Our in-house toiletries carry the Oloisiri mark. Our towels are folded with intention.
            The light through sheer curtains at 7am is, we believe, a designed experience.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section
        ref={cta.ref}
        className={`${styles.cta} ${cta.inView ? styles.inView : ''}`}
      >
        <div className={styles.ctaBg}>
          <Image
            src="/about-room-3.jpg"
            alt=""
            fill sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className={styles.ctaOverlay} />
        </div>
        <div className={styles.ctaInner}>
          <span className={styles.eyebrowLight}>We Are Ready For You</span>
          <h2 className={styles.ctaHeading}>
            Your journey begins<br />with a <em>conversation.</em>
          </h2>
          <Link href="/contact" className={styles.ctaBtn}>
            Begin Planning Your Visit
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

    </div>
  )
}

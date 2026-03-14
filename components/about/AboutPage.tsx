'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './AboutPage.module.css'
import BeamsCanvas from './BeamsCanvas'

/* ─── useInView ──────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null)
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
      const duration = 1800
      const start = Date.now()
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1)
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

const PILLARS = [
  {
    num: '01',
    title: 'The craft is in the room',
    body: 'Stone floors. Proper mattresses. Curtains that block the morning light when you want them to. Linen sourced from Kenya. A bathroom with space to breathe. We spent a long time on the rooms because that is where you will spend most of your time — and it shows.',
  },
  {
    num: '02',
    title: 'The people here know this land',
    body: 'Oloisiri is run by a small team from Namanga and the surrounding communities. We do not have an org chart to share. We have people who know this land and take care of it.',
  },
  {
    num: '03',
    title: 'We are careful about how we build',
    body: 'Solar power. Locally sourced materials where possible. Active relationships with Maasai landowners and community groups in the area. Not because it makes good marketing. Because we are going to be here a long time and the land matters more than the hotel.',
  },
]

/* ─── Page ───────────────────────────────────────────────── */
export default function AboutPage() {
  const [loaded, setLoaded] = useState(false)

  const story   = useInView(0.1)
  const stats   = useInView(0.12)
  const pillars = useInView(0.08)
  const detail  = useInView(0.1)
  const cta     = useInView(0.15)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={styles.page}>

      {/* ── S1: Cinematic opener ─────────────────────────── */}
      <section className={styles.hero}>

        {/* Animated beams background */}
        <BeamsCanvas />

        {/* Top bar — eyebrow left, coords right */}
        <div className={`${styles.heroTopBar} ${loaded ? styles.barIn : ''}`}>
          <span className={styles.heroEyebrow}>Namanga, Kenya — Est. 2024</span>
          <span className={styles.heroCoords}>1°34′S · 36°47′E</span>
        </div>

        {/* Gold sweep line */}
        <div
          className={`${styles.heroSweep} ${loaded ? styles.sweepIn : ''}`}
          aria-hidden="true"
        />

        {/* Headline — bottom left */}
        <div className={styles.heroBottom}>
          <h1 className={`${styles.heroHeading} ${loaded ? styles.headingIn : ''}`}>
            <span className={styles.heroL1}>We built a hotel</span>
            <span className={styles.heroL2}>at a border crossing.</span>
          </h1>
        </div>

      </section>

      {/* ── S2: Story ────────────────────────────────────── */}
      <section
        ref={story.ref}
        className={`${styles.story} ${story.inView ? styles.inView : ''}`}
      >
        <div className={styles.storyInner}>

          <div className={styles.storyLeft}>
            <span className={styles.eyebrow}>Our Story</span>
            <h2 className={styles.storyHeading}>
              Built at a crossing. Designed to make you stop.
            </h2>
            <p className={styles.storyBody}>
              Oloisiri sits in Namanga — a town that literally straddles the Kenya–Tanzania border,
              positioned between Kajiado County and Longido District. We are 163km from Nairobi on
              the A104, 110km from Arusha, and on one of the few stretches of highway in East Africa
              where the drive is actually smooth.
            </p>
            <p className={styles.storyBody}>
              Twenty-four suites, each finished by hand — stone underfoot, timber overhead, linen
              that moves with the breeze off the plains. We are not a lodge in the bush. We are not
              a business hotel on a highway. We are something in between — a proper place to stay
              that happens to sit at one of East Africa's most quietly extraordinary addresses, with
              Kilimanjaro on the southern horizon and Amboseli an hour to the north. We opened because
              there was nowhere good to stay here. That is the whole story.
            </p>
          </div>

          <div className={styles.storyRight}>
            <div className={styles.storyImageWrap}>
              <Image
                src="/about-story.jpg"
                alt="Oloisiri — suite interior"
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── S3: Stats strip ──────────────────────────────── */}
      <section ref={stats.ref} className={styles.statsSection}>
        <div className={styles.statsInner}>
          <AnimatedStat value={24}  label="Handcrafted suites" />
          <div className={styles.statDivider} aria-hidden="true" />
          <AnimatedStat value={3}  suffix="+" label="Dining experiences" />
          <div className={styles.statDivider} aria-hidden="true" />
          <AnimatedStat value={2}   label="Nations at your doorstep" />
          <div className={styles.statDivider} aria-hidden="true" />
          <AnimatedStat value={5}  suffix="★" label="Guest rating" />
        </div>
      </section>

      {/* ── S4: Three pillars ────────────────────────────── */}
      <section
        ref={pillars.ref}
        className={`${styles.pillarsSection} ${pillars.inView ? styles.inView : ''}`}
      >
        <div className={styles.pillarsInner}>
          <div className={styles.pillarsHeader}>
            <span className={styles.eyebrowLight}>What We Believe</span>
            <h2 className={styles.pillarsHeading}>
              Three things we will not compromise on.
            </h2>
          </div>

          <div className={styles.pillarsGrid}>
            {PILLARS.map((p, i) => (
              <div
                key={p.num}
                className={styles.pillar}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className={styles.pillarGhost} aria-hidden="true">{p.num}</div>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarBody}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S5: The Detail ───────────────────────────────── */}
      <section
        ref={detail.ref}
        className={`${styles.detailSection} ${detail.inView ? styles.inView : ''}`}
      >
        <div className={styles.detailInner}>

          <div className={styles.detailLeft}>
            <span className={styles.eyebrow}>The Detail</span>
            <h2 className={styles.detailHeading}>Nothing here is an accident.</h2>
            <p className={styles.detailBody}>
              The soap in your room carries the Oloisiri mark. The art on the wall was made by
              someone whose name we know. The coffee at breakfast is Kenyan — single origin, from
              the highlands. The thread count of the linen is not a number we advertise, but it
              is a number we argued about.
            </p>
          </div>

          <div className={styles.detailRight}>
            <p className={styles.detailQuote}>
              The light through the curtains at seven in the morning is, we believe, a designed experience.
            </p>
          </div>

        </div>
      </section>

      {/* ── S6: CTA ──────────────────────────────────────── */}
      <section
        ref={cta.ref}
        className={`${styles.ctaSection} ${cta.inView ? styles.inView : ''}`}
      >
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaHeading}>Come and see it for yourself.</h2>
          <p className={styles.ctaSubtext}>Reservations open. No minimum stay.</p>
          <Link href="/contact" className={styles.ctaBtn}>
            Begin Planning Your Visit
          </Link>
        </div>
      </section>

    </div>
  )
}

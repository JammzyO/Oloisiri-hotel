import type { Metadata } from 'next'
import styles from './experiences.module.css'

export const metadata: Metadata = { title: 'Experiences — Oloisiri Namanga Hotel' }

const rooms = [
  { name: 'Luxury Room',       detail: 'Top floor, Kilimanjaro views, elevated finishes.' },
  { name: 'Standard King',     detail: 'Clean, well-finished, balcony with Namanga Hills views.' },
  { name: 'Twin Room',         detail: 'Two beds, same standard — ideal for two.' },
  { name: 'Family Room',       detail: 'Generous layout, balcony, garden views.' },
  { name: 'Interleading Suite',detail: 'Two connecting rooms for groups who want space.' },
]

const dining = [
  {
    name: 'Ormarrei Family Restaurant',
    body: 'Warm and unhurried. East African produce, cooked well, served without fuss. Open all day.',
  },
  {
    name: 'Olakira Sky Bar',
    body: 'The border stretches south, the sky does the rest. Come for sundowners. Stay longer than you planned.',
  },
  {
    name: 'Madiba Sky Lounge',
    body: 'The highest seat in the house. A rooftop built for the kind of evening you will describe to people for years.',
  },
  {
    name: 'Ormarrei Lounge',
    body: 'Casual drinks. Good company. No dress code. No agenda.',
  },
]

const explore = [
  {
    name: 'Amboseli Day Trips',
    body: 'Africa\'s most iconic elephant country, an hour north. We arrange transport and guide connections.',
  },
  {
    name: 'Kilimanjaro Views',
    body: 'On clear mornings the summit appears above the plains without announcement. Set your alarm.',
  },
  {
    name: 'Border Country Walks',
    body: 'The Namanga crossing is one of East Africa\'s most active land borders. Walking it at dawn is unlike anything else.',
  },
]

const events = [
  {
    name: 'Emanyatta Conference Room',
    body: 'Intimate groups. Focused setting. No distractions.',
  },
  {
    name: 'Emaa Rooftop Conference Hall',
    body: 'Up to 250 guests. Full catering available. The best views of any meeting room in Kajiado County.',
  },
]

export default function ExperiencesPage() {
  return (
    <div className={styles.page}>

      {/* ── Section 1: Stay ─────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.eyebrow}>Accommodation</span>
          <h2 className={styles.heading}>Five ways to sleep at Oloisiri.</h2>
          <p className={styles.intro}>
            From a clean, well-finished standard room to our top-floor luxury suite — every room
            has a balcony, a view, and linen we argued about.
          </p>
          <ul className={styles.roomList}>
            {rooms.map(r => (
              <li key={r.name} className={styles.roomItem}>
                <span className={styles.roomName}>{r.name}</span>
                <span className={styles.roomDetail}>{r.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className={styles.divider} aria-hidden="true" />

      {/* ── Section 2: Dine ─────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.eyebrow}>Food &amp; Drink</span>
          <h2 className={styles.heading}>Four places to eat and drink. All of them good.</h2>
          <div className={styles.cards}>
            {dining.map(d => (
              <div key={d.name} className={styles.card}>
                <h3 className={styles.cardName}>{d.name}</h3>
                <p className={styles.cardBody}>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.divider} aria-hidden="true" />

      {/* ── Section 3: Explore ──────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.eyebrow}>Beyond the Hotel</span>
          <h2 className={styles.heading}>The location is half the experience.</h2>
          <div className={styles.cards}>
            {explore.map(e => (
              <div key={e.name} className={styles.card}>
                <h3 className={styles.cardName}>{e.name}</h3>
                <p className={styles.cardBody}>{e.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.divider} aria-hidden="true" />

      {/* ── Section 4: Gather ───────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.eyebrow}>Meetings &amp; Events</span>
          <h2 className={styles.heading}>A rooftop for 250. A boardroom for twelve.</h2>
          <p className={styles.intro}>
            Oloisiri has two dedicated event spaces. The Emanyatta Conference Room seats intimate
            groups in a quiet, focused setting. The Emaa Rooftop Conference Hall accommodates up
            to 250 guests — with Kilimanjaro on the horizon and the kind of light that makes every
            presentation look better than it deserves.
          </p>
          <div className={styles.cards}>
            {events.map(ev => (
              <div key={ev.name} className={styles.card}>
                <h3 className={styles.cardName}>{ev.name}</h3>
                <p className={styles.cardBody}>{ev.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

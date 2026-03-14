import Link from 'next/link'
import styles from './BookingPrompt.module.css'

export default function BookingPrompt() {
  return (
    <section className={styles.section} aria-label="Reserve your stay">
      {/* Left half — cream */}
      <div className={styles.left}>
        <span className={styles.textLeft}>Five rooms.</span>
      </div>

      {/* Right half — dark teal */}
      <div className={styles.right}>
        <em className={styles.textRight}>One address.</em>
      </div>

      {/* CTA — centered on the dividing line */}
      <div className={styles.ctaWrap}>
        <Link href="/contact" className={styles.ctaBtn}>
          Reserve Your Stay
        </Link>
      </div>
    </section>
  )
}

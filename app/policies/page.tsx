import type { Metadata } from 'next'
import styles from './policies.module.css'

export const metadata: Metadata = { title: 'Policies — Oloisiri Namanga Hotel' }

const sections = [
  {
    title: 'Check-In & Check-Out',
    body: 'Check-in is at 2:00 PM. Check-out is at 10:00 AM. Early check-in and late check-out are available on request and subject to availability.',
  },
  {
    title: 'Payment',
    body: 'Oloisiri is a cashless establishment. We accept Visa, Mastercard, and M-Pesa. In exceptional circumstances, cash payments may be approved by a senior manager.',
  },
  {
    title: 'Reservations & Cancellations',
    body: 'A deposit or full payment is required to confirm your reservation. Cancellations made more than 48 hours before arrival are free of charge. Cancellations within 48 hours of arrival, or no-shows, will be charged the equivalent of one night\'s stay.',
  },
  {
    title: 'Smoking & Alcohol',
    body: 'Smoking is not permitted in any indoor area of the hotel. Designated outdoor smoking areas are available. Outside alcohol may not be brought onto the premises without prior approval from management.',
  },
  {
    title: 'Children',
    body: 'Children are welcome at Oloisiri and must remain under adult supervision at all times. Cribs and extra beds are available on request at an additional charge.',
  },
  {
    title: 'Valuables',
    body: 'Guests are responsible for their personal valuables. Please use the in-room safe or the reception safety box. The hotel accepts no liability for loss or theft of unsecured items.',
  },
  {
    title: 'Guest Conduct',
    body: 'Oloisiri reserves the right to refuse service or ask a guest to vacate the premises if their conduct is disruptive or harmful to other guests or staff.',
  },
]

export default function PoliciesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <div className={styles.header}>
          <span className={styles.eyebrow}>Oloisiri Namanga Hotel</span>
          <h1 className={styles.title}>Hotel Policies</h1>
        </div>

        <div className={styles.sections}>
          {sections.map((s, i) => (
            <div key={s.title} className={styles.section}>
              {i > 0 && <div className={styles.divider} aria-hidden="true" />}
              <h3 className={styles.sectionTitle}>{s.title}</h3>
              <p className={styles.sectionBody}>{s.body}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

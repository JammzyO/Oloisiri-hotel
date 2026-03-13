'use client'

import { useState } from 'react'
import styles from './ReservationBar.module.css'

export default function ReservationBar() {
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  const changeAdults = (delta: number) => {
    setAdults(v => Math.max(1, Math.min(10, v + delta)))
  }

  const changeChildren = (delta: number) => {
    setChildren(v => Math.max(0, Math.min(8, v + delta)))
  }

  return (
    <div className={styles.bar} role="search" aria-label="Reservation search">
      <span className={styles.barLabel}>Reservation</span>

      <div className={styles.separator} aria-hidden="true" />

      <div className={styles.field}>
        <label htmlFor="check-in" className={styles.fieldLabel}>Check In</label>
        <input
          id="check-in"
          type="date"
          className={styles.dateInput}
          aria-label="Check in date"
        />
      </div>

      <div className={styles.separator} aria-hidden="true" />

      <div className={styles.field}>
        <label htmlFor="check-out" className={styles.fieldLabel}>Check Out</label>
        <input
          id="check-out"
          type="date"
          className={styles.dateInput}
          aria-label="Check out date"
        />
      </div>

      <div className={styles.separator} aria-hidden="true" />

      <div className={styles.counter}>
        <span className={styles.fieldLabel}>Adults</span>
        <div className={styles.counterControls}>
          <button
            className={styles.counterBtn}
            onClick={() => changeAdults(-1)}
            aria-label="Remove adult"
            disabled={adults <= 1}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <span className={styles.counterVal} aria-live="polite">{adults}</span>
          <button
            className={styles.counterBtn}
            onClick={() => changeAdults(1)}
            aria-label="Add adult"
            disabled={adults >= 10}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M5 2V8M2 5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.separator} aria-hidden="true" />

      <div className={styles.counter}>
        <span className={styles.fieldLabel}>Children</span>
        <div className={styles.counterControls}>
          <button
            className={styles.counterBtn}
            onClick={() => changeChildren(-1)}
            aria-label="Remove child"
            disabled={children <= 0}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <span className={styles.counterVal} aria-live="polite">{children}</span>
          <button
            className={styles.counterBtn}
            onClick={() => changeChildren(1)}
            aria-label="Add child"
            disabled={children >= 8}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M5 2V8M2 5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <button className={styles.checkBtn} type="button">
        Check Availability
      </button>
    </div>
  )
}

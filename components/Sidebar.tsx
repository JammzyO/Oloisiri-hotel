'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import styles from './Sidebar.module.css'

const NAV_LINKS = [
  { label: 'Home',         href: '/'            },
  { label: 'Suites',       href: '/suites'      },
  { label: 'Experiences',  href: '/experiences' },
  { label: 'About',        href: '/about'       },
  { label: 'Contact',      href: '/contact'     },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Close sidebar on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* ── Mobile hamburger ─────────────────────────────── */}
      <button
        className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
        onClick={() => setMobileOpen(prev => !prev)}
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={mobileOpen}
        aria-controls="sidebar"
      >
        <span className={styles.hamburgerBar} />
        <span className={styles.hamburgerBar} />
        <span className={styles.hamburgerBar} />
      </button>

      {/* ── Dark overlay (mobile) ─────────────────────── */}
      <div
        className={`${styles.overlay} ${mobileOpen ? styles.overlayVisible : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar ───────────────────────────────────── */}
      <aside
        id="sidebar"
        className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''} ${mounted ? styles.sidebarMounted : ''}`}
        aria-label="Site navigation"
      >
        {/* Logo */}
        <div className={styles.logoArea}>
          <Link href="/" className={styles.logoLink} aria-label="Oloisiri Namanga Hotel — Home">
            <Image
              src="/logo.jpeg"
              alt="Oloisiri Namanga Hotel"
              width={1270}
              height={630}
              className={styles.logo}
              priority
              style={{ width: '100%', height: 'auto' }}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList} role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive =
                href === '/' ? pathname === '/' : pathname.startsWith(href)

              return (
                <li key={href} className={styles.navItem}>
                  <Link
                    href={href}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Reserve CTA */}
          <div className={styles.reserveWrapper}>
            <Link href="/contact" className={styles.reserveLink}>
              Reserve Your Stay
            </Link>
          </div>
        </nav>

        {/* Bottom — phone */}
        <div className={styles.bottom}>
          <div className={styles.divider} />
          <a
            href="tel:+254700000000"
            className={styles.phone}
            aria-label="Call Oloisiri"
          >
            {/* Phone icon — inline SVG, no library */}
            <svg
              className={styles.phoneIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 10.81 19.79 19.79 0 0 1 .93 2.18C.93 1.04 1.89 0 3.09 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92v2z" />
            </svg>
            <span>+254 700 000 000</span>
          </a>
        </div>
      </aside>
    </>
  )
}

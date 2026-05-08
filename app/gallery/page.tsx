import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Gallery — Oloisiri Namanga Hotel' }

export default function GalleryPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 40px',
    }}>
      <div style={{ maxWidth: '560px', textAlign: 'center' }}>
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          fontSize: '0.62rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
          marginBottom: '24px',
        }}>
          Oloisiri Namanga Hotel
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 300,
          fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
          color: 'var(--color-teal-dark)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: '0 0 32px',
        }}>
          Gallery
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          fontSize: '1rem',
          color: '#5a5a52',
          lineHeight: 1.8,
          margin: '0 0 40px',
        }}>
          Our gallery is being curated. A collection of images from across Oloisiri — the rooms,
          the grounds, the borderland views — will be available here shortly.
        </p>
        <a href="/contact" style={{
          display: 'inline-block',
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          fontSize: '0.78rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--color-teal-dark)',
          borderBottom: '1px solid var(--color-gold)',
          paddingBottom: '3px',
          textDecoration: 'none',
        }}>
          Get In Touch
        </a>
      </div>
    </div>
  )
}

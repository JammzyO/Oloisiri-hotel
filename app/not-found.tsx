import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#082f2c',
      color: '#e8ddc7',
      fontFamily: 'Georgia, serif',
      gap: '24px',
      textAlign: 'center',
      padding: '40px',
    }}>
      <p style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: '#c9a24d' }}>
        Oloisiri Namanga
      </p>
      <h1 style={{ fontSize: '96px', fontWeight: 300, lineHeight: 1, letterSpacing: '-2px', color: '#e8ddc7' }}>
        404
      </h1>
      <p style={{ fontSize: '18px', fontWeight: 300, fontStyle: 'italic', color: 'rgba(232,221,199,0.55)' }}>
        This page does not exist.
      </p>
      <Link href="/" style={{
        display: 'inline-block',
        marginTop: '16px',
        padding: '14px 40px',
        border: '1px solid #c9a24d',
        color: '#c9a24d',
        fontSize: '9px',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        textDecoration: 'none',
      }}>
        Return Home
      </Link>
    </div>
  )
}

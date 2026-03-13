import Image from 'next/image'
import styles from './InstagramFeed.module.css'

const posts = [
  { id: 0, src: '/ig-1.jpg', alt: 'Oloisiri suite with African portrait art', objectPosition: 'center top' },
  { id: 1, src: '/ig-2.jpg', alt: 'Oloisiri suite with sheer curtains and natural light', objectPosition: 'center' },
  { id: 2, src: '/ig-3.jpg', alt: 'Oloisiri Namanga Hotel exterior and gardens', objectPosition: 'center 30%' },
  { id: 3, src: '/ig-4.jpg', alt: 'Oloisiri suite balcony', objectPosition: 'center' },
  { id: 4, src: '/ig-5.jpg', alt: 'Oloisiri suite bedroom detail', objectPosition: 'center top' },
  { id: 5, src: '/ig-6.jpg', alt: 'Oloisiri suite walk-in shower with brass fittings', objectPosition: 'center' },
  { id: 6, src: '/ig-7.jpg', alt: 'Oloisiri suite with yellow pillows', objectPosition: 'center' },
]

export default function InstagramFeed() {
  return (
    <section className={styles.section} aria-label="Instagram Feed">
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Our Instagram</span>
        <h2 className={styles.heading}>@oloisirihotelnamanga</h2>

        <div className={styles.strip} role="list">
          {posts.map(post => (
            <a
              key={post.id}
              href="https://www.instagram.com/oloisirihotelnamanga"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.post}
              role="listitem"
              aria-label="View on Instagram"
            >
              <div className={styles.postBg}>
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  sizes="160px"
                  style={{ objectFit: 'cover', objectPosition: post.objectPosition }}
                />
              </div>
              <div className={styles.postOverlay} aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

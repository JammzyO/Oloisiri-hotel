import type { MetadataRoute } from 'next'
import { allSuites } from '@/lib/suiteData'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.oloisirihotel.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,            priority: 1.0, changeFrequency: 'monthly' },
    { url: `${BASE}/suites`,      priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE}/reserve`,     priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE}/experiences`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/contact`,     priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/about`,       priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/gallery`,     priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE}/updates`,     priority: 0.5, changeFrequency: 'weekly'  },
    { url: `${BASE}/policies`,    priority: 0.4, changeFrequency: 'yearly'  },
  ]

  const suitePages: MetadataRoute.Sitemap = allSuites.map(suite => ({
    url: `${BASE}/suites/${suite.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly',
  }))

  const lastModified = new Date()
  return [...staticPages, ...suitePages].map(entry => ({ lastModified, ...entry }))
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { suitesBySlug, allSuites } from '@/lib/suiteData'
import SuiteDetail from '@/components/suites/SuiteDetail'

export function generateStaticParams() {
  return allSuites.map(s => ({ slug: s.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const suite = suitesBySlug[slug]
  if (!suite) return {}
  return {
    title: suite.name,
    description: suite.description,
  }
}

export default async function SuitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const suite = suitesBySlug[slug]
  if (!suite) notFound()
  return <SuiteDetail suite={suite} />
}

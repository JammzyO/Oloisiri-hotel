import { notFound } from 'next/navigation'
import { suitesBySlug, allSuites } from '@/lib/suiteData'
import SuiteDetail from '@/components/suites/SuiteDetail'

export function generateStaticParams() {
  return allSuites.map(s => ({ slug: s.slug }))
}

export default async function SuitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const suite = suitesBySlug[slug]
  if (!suite) notFound()
  return <SuiteDetail suite={suite} />
}

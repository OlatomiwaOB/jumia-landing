import { Suspense, lazy } from 'react'
import { Metadata } from 'next'
import Loader from '@/components/ui/loader'

const entityObject = {
  'depot': {
    name: 'DEPOT | About'
  },
  'fortitude': {
    name: 'FORTITUDE | About'
  },
  'vogue': {
    name: 'VOGUE | About'
  },
  'traditional-taste-v2': {
    name: 'Traditional Taste | About Us'
  },
  'varisa': {
    name: 'VARISA | About'
  }
}

export const metadata: Metadata = {
  title: entityObject[process?.env?.NEXT_PUBLIC_STORE_FRONT as keyof typeof entityObject]?.name || 'Shop | About',
}

// Lazy loading components
const AboutPageVarisa = lazy(() => import('../../../../themes/varisa/about'))
const AboutPageTraditionalTaste = lazy(() => import('../../../../themes/traditional-taste-v2/about'))

const AboutPage = () => {
  const storefront = process?.env?.NEXT_PUBLIC_STORE_FRONT;

  if (storefront === 'varisa') {
    return <Suspense fallback={<Loader text='Loading...' />}><AboutPageVarisa /></Suspense>
  }

  if (storefront === 'traditional-taste-v2') {
    return <Suspense fallback={<Loader text='Loading...' />}><AboutPageTraditionalTaste /></Suspense>
  }

  // Fallback for other themes until their about pages are built
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <h1 className="text-3xl font-bold">About Us coming soon...</h1>
    </div>
  )
}

export default AboutPage

import { Suspense, lazy } from 'react'
import { Metadata } from 'next'
import Loader from '@/components/ui/loader'

const entityObject = {
  'depot': {
    name: 'DEPOT | home'
  },
  'fortitude': {
    name: 'FORTITUDE | home'
  },
  'vogue': {
    name: 'VOGUE | home'
  }
}

export const metadata: Metadata = {
  title: entityObject[process?.env?.NEXT_PUBLIC_STORE_FRONT as keyof typeof entityObject]?.name || 'Shop | home',
}

// Lazy loading components
const HomePageDepot = lazy(() => import('../../../themes/depot/homepage'))
const HomePageFortitude = lazy(() => import('../../../themes/fortitude/homepage'))
const HomePageVogue = lazy(() => import('../../../themes/vogue/homepage'))
const HomePageTraditionalTaste = lazy(() => import('../../../themes/traditional-taste/homepage'))

const HomePage = () => {
  const storefront = process?.env?.NEXT_PUBLIC_STORE_FRONT;

  if (storefront === 'depot') {
    return <Suspense fallback={<Loader text='Loading...' />}><HomePageDepot /></Suspense>
  }

  if (storefront === 'vogue') {
    return <Suspense fallback={<Loader text='Loading...' />}><HomePageVogue /></Suspense>
  }

  if (storefront === 'traditional-taste') {
    return <Suspense fallback={<Loader text='Loading...' />}><HomePageTraditionalTaste /></Suspense>
  }

  return <Suspense fallback={<Loader text='Loading...' />}><HomePageFortitude /></Suspense>
}

export default HomePage
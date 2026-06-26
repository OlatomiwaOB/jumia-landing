import { Suspense, lazy } from 'react'
import { Metadata } from 'next'
import Loader from '@/components/ui/loader'
import { clientConfig } from '@/config/client-config'

const config = clientConfig()

export const metadata: Metadata = {
  title: config.branding.metadata.title || 'Shop | home',
}

// Lazy loading components
const HomePageDepot = lazy(() => import('../../../themes/depot/homepage'))
const HomePageFortitude = lazy(() => import('../../../themes/fortitude/homepage'))
const HomePageVogue = lazy(() => import('../../../themes/vogue/homepage'))
const HomePageTraditionalTaste = lazy(() => import('../../../themes/traditional-taste-v2/homepage'))
const HomePageVarisa = lazy(() => import('../../../themes/varisa/homepage'))

const HomePage = () => {
  const storefront = config.branding.storefront;

  if (storefront === 'depot') {
    return <Suspense fallback={<Loader text='Loading...' />}><HomePageDepot /></Suspense>
  }

  if (storefront === 'vogue') {
    return <Suspense fallback={<Loader text='Loading...' />}><HomePageVogue /></Suspense>
  }

  if (storefront === 'traditional-taste-v2') {
    return <Suspense fallback={<Loader text='Loading...' />}><HomePageTraditionalTaste /></Suspense>
  }

  if (storefront === 'varisa') {
    return <Suspense fallback={<Loader text='Loading...' />}><HomePageVarisa /></Suspense>
  }

  return <Suspense fallback={<Loader text='Loading...' />}><HomePageFortitude /></Suspense>
}

export default HomePage

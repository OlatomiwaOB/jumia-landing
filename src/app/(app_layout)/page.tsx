import { Suspense, lazy } from 'react'
import { Metadata } from 'next'
import Loader from '@/components/ui/loader'


const entityObject = {
  'depot': {
    name: 'DEPOT | home'
  },
  'fortitude': {
    name: 'Fortitude | home'
  }
}

export const metadata: Metadata = {
  title: entityObject[process?.env?.NEXT_PUBLIC_STORE_FRONT as keyof typeof entityObject]?.name || 'Shop | home',
}

// Lazy loading components
const HomePageDepot = lazy(() => import('../../../themes/depot/homepage'))
const HomePageFortitude = lazy(() => import('../../../themes/fortitude/homepage'))

const HomePage = () => {
  const storefront = process?.env?.NEXT_PUBLIC_STORE_FRONT;

  if (storefront === 'depot') {
    return <Suspense fallback={<Loader text='Loading...' />}><HomePageDepot /></Suspense>
  }

  if (storefront === 'fortitude') {
    return <Suspense fallback={<Loader text='Loading...' />}><HomePageFortitude /></Suspense>
  }
}

export default HomePage
import { Suspense, lazy } from 'react'
import { Metadata } from 'next'
import Loader from '@/components/ui/loader'


const entityObject = {
  h2p: {
    name: 'Help2Pay | home'
  },
  fortitude: {
    name: 'Fortitude | home'
  },
  theme1: {
    name: 'Help2Pay | home'
  },
  'test-app': {
    name: 'Depot | home'
  }
}

export const metadata: Metadata = {
  title: entityObject[process?.env?.NEXT_PUBLIC_STORE_FRONT as keyof typeof entityObject]?.name || 'Shop | home',
}

// Lazy loading components
const ThemeOneLandingPage = lazy(() => import('@/themes/theme1/landing-page'))
const HomePageH2P = lazy(() => import('../../../h2p-app/page'))
const HomePageFortitiude = lazy(() => import('../../../fortitude-app/homepage'))
const HomePageTestApp = lazy(() => import('../../../test-app/homepage'))

const HomePage = () => {
  
  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'h2p') {
    return <Suspense fallback={<Loader text='Loading...'/>}><HomePageH2P /></Suspense>
  }

  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'fortitude') {
    return <Suspense fallback={<Loader text='Loading...'/>}><HomePageFortitiude /></Suspense>
  }

  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'theme1') {
    return <Suspense fallback={<Loader text='Loading...'/>}><ThemeOneLandingPage /></Suspense>
  }

  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'test-app') {
    return <Suspense fallback={<Loader text='Loading...'/>}><HomePageTestApp /></Suspense>
  }
}

export default HomePage
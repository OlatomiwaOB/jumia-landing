import { Suspense, lazy } from 'react'
import { Metadata } from 'next'
import Loader from '@/components/ui/loader'


const entityObject = {
  'test-app': {
    name: 'Depot | home'
  }
}

export const metadata: Metadata = {
  title: entityObject[process?.env?.NEXT_PUBLIC_STORE_FRONT as keyof typeof entityObject]?.name || 'Shop | home',
}

// Lazy loading components
const HomePageTestApp = lazy(() => import('../../../test-app/homepage'))

const HomePage = () => {
  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'test-app') {
    return <Suspense fallback={<Loader text='Loading...'/>}><HomePageTestApp /></Suspense>
  }
}

export default HomePage
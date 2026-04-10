'use client'
import Loader from '@/components/ui/loader'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Home = dynamic(() => import('./page-content'), {
  ssr: false,
  loading: () => <Loader text='Loading home page...' />
})

const HomePageH2P = () => {
  return <Suspense >
    <Home />
  </Suspense>
}

export default HomePageH2P
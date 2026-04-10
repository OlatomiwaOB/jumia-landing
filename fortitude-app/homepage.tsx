'use client'
import Loader from '@/components/ui/loader'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Home = dynamic(() => import('./page'), {
  ssr: false,
  loading: () => <Loader text='Loading home page...' />
})

const HomePageFortitude = () => {
  return <Suspense >
    <Home />
  </Suspense>
}

export default HomePageFortitude
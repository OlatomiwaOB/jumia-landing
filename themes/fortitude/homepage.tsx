'use client'
import Loader from '@/components/ui/loader'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Home = dynamic(() => import('./page'), {
  ssr: false,
  loading: () => <Loader text='Loading Fortitude page...' />
})

const FortitudeHomePage = () => {
  return (
    <Suspense>
      <Home />
    </Suspense>
  )
}

export default FortitudeHomePage

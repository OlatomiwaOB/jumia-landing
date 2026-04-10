'use client'
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/ui/loader/loader'


const LivenessCheckPage = dynamic(
  ()=>import('./liveness-content'),
  {
    ssr:false,
    loading: ()=><Loader/>
  }
)
const Liveness = () => {
  return (
    <>
      <LivenessCheckPage/>
    </>
  )
}

export default Liveness
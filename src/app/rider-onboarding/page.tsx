import React from 'react'

import { Metadata } from 'next'
import SignUp from './pageContent'

export const metadata:Metadata = {
    title: 'Rider onboarding'
} 
const RiderOnboardingPage = () => {
  return (
    <>
        <SignUp/>
    </>
  )
}

export default RiderOnboardingPage
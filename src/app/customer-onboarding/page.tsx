import React from 'react'

import { Metadata } from 'next'
import SignUp from './pageContent'

export const metadata:Metadata = {
    title: 'Customer onboarding'
} 
const CustomerOnboardingPage = () => {
  return (
    <>
        <SignUp/>
    </>
  )
}

export default CustomerOnboardingPage
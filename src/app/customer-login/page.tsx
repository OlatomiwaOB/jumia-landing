import React from 'react'
import CustomerLogin from './pageContent'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Customer Login'
}
const CustomerLoginPage = () => {
  return (
    <>
        <CustomerLogin/>
    </>
  )
}

export default CustomerLoginPage
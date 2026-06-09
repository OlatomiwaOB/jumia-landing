import React from 'react'
import ForgotPasswordContent from './pageContent'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Forgot Password'
}

const ForgotPasswordPage = () => {
    return <ForgotPasswordContent />
}

export default ForgotPasswordPage

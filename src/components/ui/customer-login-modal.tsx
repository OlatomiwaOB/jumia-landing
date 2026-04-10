'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent } from './dialog'
import RegisterForm from './register-form'
import { LoginForm } from './login-form'
import ForgotPasswordModal from '@/components/forgot-pasword'

const CustomerLoginModal = ({ isOpen, setIsOpen }: {isOpen:boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [showForgotPassword, setShowForgotPassword] = useState(false)

    const handleForgotPasswordClick = () => {
        setIsOpen(false)
        setShowForgotPassword(true)
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className='max-h-screen overflow-y-auto'>
                    <LoginForm 
                        onForgotPassword={handleForgotPasswordClick} 
                        setIsOpen={setIsOpen} 
                    />
                </DialogContent>
            </Dialog>

            <ForgotPasswordModal 
                isOpen={showForgotPassword}
                setIsOpen={setShowForgotPassword}
            />
        </>
    )
}

export default CustomerLoginModal
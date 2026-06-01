'use client'
import React from 'react'
import { Dialog, DialogContent } from './dialog'
import { LoginForm } from './login-form'

const CustomerLoginModal = ({ isOpen, setIsOpen }: {isOpen:boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='max-h-screen overflow-y-auto sm:rounded-[24px] rounded-[24px]'>
                <LoginForm 
                    onForgotPassword={() => {}} // Not used anymore as Link handles it directly
                    setIsOpen={setIsOpen} 
                />
            </DialogContent>
        </Dialog>
    )
}

export default CustomerLoginModal
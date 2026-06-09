'use client'
import React from 'react'
import { Dialog, DialogContent } from './dialog'
import { LoginForm } from './login-form'

interface CustomerLoginModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onLoginSuccess?: () => void;
}

const CustomerLoginModal = ({ isOpen, setIsOpen, onLoginSuccess }: CustomerLoginModalProps) => {
    // Wrap setIsOpen so that when the form closes the modal after a successful
    // login, we also fire the onLoginSuccess callback.
    const handleSetIsOpen: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
        const next = typeof value === 'function' ? value(isOpen) : value;
        setIsOpen(next);
        if (!next && onLoginSuccess) {
            onLoginSuccess();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='max-h-screen overflow-y-auto sm:rounded-[24px] rounded-[24px]'>
                <LoginForm
                    onForgotPassword={() => {}} // Not used anymore as Link handles it directly
                    setIsOpen={handleSetIsOpen}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CustomerLoginModal
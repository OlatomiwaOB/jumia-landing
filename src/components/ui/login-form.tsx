'use client'
import React, { useState } from 'react'
import { DialogDescription, DialogHeader, DialogTitle } from './dialog'
import { Input } from './input'
import Link from 'next/link'
import { Button } from './button'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import axiosCustomer from '@/utils/fetch-function'
import { toast } from 'sonner'
import * as z from 'zod'
import useCustomer from '@/store/customerStore'
import { hasAccess, setAuthCredentials } from '@/utils/auth-utils-customer'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Eye, EyeOff } from "lucide-react"

export type LoginProps = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    onForgotPassword: () => void
}
type FormData = {
    username: string,
    password: string
}

const otpSchema = z.object({
    otp: z.string()
        .min(1, 'OTP is required')
        .regex(/^\d{6}$/, 'OTP must be exactly 6 digits')
});

type OTPForm = z.infer<typeof otpSchema>;
export const LoginForm = ({ setIsOpen, onForgotPassword }: LoginProps) => {
    const { register, handleSubmit } = useForm<FormData>()
    const { setCustomer } = useCustomer()
    const {
        register: registerOTP,
        handleSubmit: handleSubmitOTP,
        formState: { errors: otpErrors },
        reset: resetOTP
    } = useForm<OTPForm>();
    const searchParams = useSearchParams()
    const { refresh, push } = useRouter()
    const [loginStep, setLoginStep] = useState<'credentials' | 'otp'>('credentials')
    const [loginData, setLoginData] = useState<FormData | null>(null);
    const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';
    const storeCode = searchParams.get('storeCode') || ''
    const [showPassword, setShowPassword] = useState(false)

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => axiosCustomer.request({
            url: '/ecommerce/login',
            method: 'POST',
            data,
        }),
        onSuccess: (data) => {
            localStorage.setItem("token_customer", data.data.ticketID)
            localStorage.setItem("customer_store", JSON.stringify(data.data))
            setCustomer(data?.data)

            if (data?.data?.ticketID) {
                if (hasAccess([data?.data.userRole], ["CUSTOMER"])) {
                    setAuthCredentials(data?.data.ticketID, ['CUSTOMER'])
                    setIsOpen(false)
                    if (data?.data?.twoFaSetupRequired === 'Y') {
                        push(`/twofa_setup/customer`)
                        return
                    }
                    toast.success('Login successful!')
                    return
                }
            }
            else {
                toast.error(data?.data?.responseMessage)
            }
        },
        onError: (error) => {
            // console.log(error);
            toast.error("Login failed. Please try again.")
        }
    })

    const onSubmit = (value: FormData) => {
        const payload = {
            username: value?.username,
            password: value?.password,
            entityCode: entityCode,
            language: 'en',
            channelType: 'WEB',
            deviceId: ''
        }

        mutate(payload)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleForgotPasswordClick = (e: React.MouseEvent) => {
        e.preventDefault()
        onForgotPassword()
    }

    return (
        <div className='space-y-3'>
            <DialogHeader className='flex flex-col'>
                <DialogTitle className="text-2xl text-center font-medium">Login</DialogTitle>
                <DialogDescription className="text-sm text-center">Please enter your credentials to continue</DialogDescription>
            </DialogHeader>

            <form className='' onSubmit={handleSubmit(onSubmit)}>
                {
                    loginStep === 'credentials' ? (
                        <div className='flex flex-col gap-4'>
                            <div>
                                <Label>Username/Email</Label>
                                <Input
                                    {...register('username')}
                                    type="text"
                                    placeholder="Enter your username or email"
                                    className="mt-2"
                                />
                            </div>
                            <div className='w-full'>
                                <Label>Password</Label>
                                <div className="relative">
                                    <Input
                                        {...register('password')}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className='mt-2'
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleForgotPasswordClick}
                                    className="text-sm relative right-0 text-accent underline cursor-pointer"
                                >
                                    Forgot your password?
                                </button>
                            </div>

                            <Button type='submit' className='bg-accent text-white'>{isPending ? 'Logging in...' : 'Login'}</Button>
                        </div>
                    )
                        :
                        <div>
                            <Input
                                {...registerOTP('otp')}
                                type="text"
                                placeholder="Enter OTP"
                                className="mb-4"
                                maxLength={6}
                            />
                            <Button className='bg-accent text-white w-full' disabled={isPending}>{isPending ? 'Verifying...' : 'Verify OTP'}</Button>
                        </div>
                }
            </form>

            <p className='text-sm text-center'>
                Don't have an account?{' '}
                <Link href={`/customer-onboarding`} className="text-accent underline" target='_blank'>
                    Register
                </Link >
            </p>
        </div>
    )
}
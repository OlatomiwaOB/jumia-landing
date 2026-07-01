'use client'
import React, { useState } from 'react'
import { DialogDescription, DialogHeader, DialogTitle } from './dialog'
import { Input } from './input'
import Link from 'next/link'
import { Button } from './button'
import { Checkbox } from './checkbox'
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
import { getClientIdentifiers } from '@/config/client-config';

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
    const entityCode = getClientIdentifiers().entityCode;
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
                if (data?.data?.responseCode === 'E70') {
                    push(`/customer-login`);
                    return
                }
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
        <div className='space-y-6 px-4 py-2 pb-6'>
            <DialogHeader className='flex flex-col gap-2 pt-2'>
                <DialogTitle className="text-2xl text-center font-bold">Sign in</DialogTitle>
                <DialogDescription className="text-[15px] text-center text-gray-500">Please enter your details below to sign in.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                {
                    loginStep === 'credentials' ? (
                        <div className='flex flex-col gap-5'>
                            <div>
                                <Input
                                    {...register('username')}
                                    type="text"
                                    placeholder="Email address *"
                                    className="rounded-full px-6 py-6 text-[15px] border-gray-200 focus-visible:ring-[#111]"
                                />
                            </div>
                            <div className='w-full'>
                                <div className="relative">
                                    <Input
                                        {...register('password')}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password *"
                                        className='rounded-full px-6 py-6 text-[15px] pr-12 border-gray-200 focus-visible:ring-[#111]'
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#111] focus:outline-none transition-colors"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-1 px-1">
                                <div className="flex items-center gap-3">
                                    <Checkbox id="remember-me" className="border-gray-200 rounded-[4px] w-5 h-5 data-[state=checked]:bg-[#111] data-[state=checked]:border-[#111]" />
                                    <label htmlFor="remember-me" className="text-sm text-gray-500 cursor-pointer">Remember me</label>
                                </div>
                                <Link
                                    href={'/forgot-password'}
                                    target='_blank'
                                    className="text-sm text-gray-500 hover:text-[#111] transition-colors cursor-pointer"
                                >
                                    Lost your password?
                                </Link>
                            </div>

                            <div className="flex flex-col gap-3 mt-4">
                                <Button type='submit' className='bg-[#111] text-white hover:bg-black rounded-full py-7 font-bold text-[15px] w-full shadow-md transition-all'>
                                    {isPending ? 'Signing in...' : 'Login'}
                                </Button>
                                <Link href="/customer-onboarding" target="_blank" className="w-full">
                                    <Button type='button' variant="outline" className='bg-white text-[#111] border-2 border-[#111] hover:bg-gray-50 rounded-full py-7 font-bold text-[15px] w-full transition-all'>
                                        Create Account
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )
                        :
                        <div>
                            <Input
                                {...registerOTP('otp')}
                                type="text"
                                placeholder="Enter OTP"
                                className="mb-4 rounded-full px-6 py-6"
                                maxLength={6}
                            />
                            <Button className='bg-[#111] text-white hover:bg-black rounded-full py-6 font-bold w-full' disabled={isPending}>{isPending ? 'Verifying...' : 'Verify OTP'}</Button>
                        </div>
                }
            </form>
        </div>
    )
}
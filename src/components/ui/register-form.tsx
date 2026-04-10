import React, { useState } from 'react'
import { DialogDescription, DialogHeader, DialogTitle } from './dialog'
import { Input } from './input'
import Link from 'next/link'
import { Button } from './button'
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from './label'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import * as z from 'zod'
import { get } from 'http'
import axiosCustomer from '@/utils/fetch-function-no-auth'


export type RegisterProps = {
    setState: React.Dispatch<React.SetStateAction<'login' | 'register'>>
}

type FormData = {
    firstName: string
    lastName: string
    email: string
    mobile: string
    password: string
    address: string
}

const otpSchema = z.object({
    otp: z.string()
        .min(1, 'OTP is required')
        .regex(/^\d{4}$/, 'OTP must be exactly 6 digits')
});

type OTPForm = z.infer<typeof otpSchema>;

const RegisterForm = ({ setState }: RegisterProps) => {

    const { register, handleSubmit, getValues } = useForm<FormData>()
    const {
        register: registerOTP,
        handleSubmit: handleSubmitOTP,
        formState: { errors: otpErrors },
        getValues: getValuesOTP,
        reset: resetOTP
    } = useForm<OTPForm>({
        resolver: zodResolver(otpSchema)
    });
    const searchParams = useSearchParams()
    const storeCode = searchParams.get('storeCode') || ''
    const [registerStep, setRegisterStep] = useState<'credentials' | 'otp'>('credentials')
    const [registerData, setRegisterData] = useState('');
    const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';
    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => axiosCustomer.request({
            url: '/ecommerce/customer/simple-onboard',
            method: 'POST',
            data,
            headers: {
                'x-source-code': process.env.NEXT_PUBLIC_SOURCE_CODE || 'FORTITUDE',
                'x-client-id': process.env.NEXT_PUBLIC_CLIENT_ID || 'TST03054745785188010772',
                'x-client-secret': process.env.NEXT_PUBLIC_CLIENT_SECRET || 'TST03722175625334233555707073458615741827171811840881'
            }
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') {
                toast.error(data?.data?.desc || "An error occurred");
                return;
            }
            toast.success("Registration successful! Please login.");
            setRegisterData(getValues('email'))
            setRegisterStep('otp');
        },
        onError: (error) => {
            console.log(error);
        }
    })

    const { mutate: verifyOtp, isPending: isVerifying } = useMutation({
        mutationFn: (data: any) => axiosCustomer.request({
            url: '/ecommerce/customer/verify-otp',
            method: 'POST',
            data
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') {
                toast.error(data?.data?.desc || "An error occurred");
                return;
            }
            toast.success("Verification successful! Please login.");
            setState('login');
        },
        onError: (error) => {
            console.log(error);
        }
    })

    const onSubmit = (value: FormData) => {
        const payload = {
            firstname: value?.firstName,
            customerType: "",
            deviceId: "",
            geolocation: "",
            lastname: value?.lastName,
            name: value?.firstName,
            channel: "WEB",
            middlename: "",
            mobileNo: value?.mobile,
            email: value?.email,
            entityCode: entityCode,
            city: value?.address,
            countryCode: "NG",
            gender: "MALE",
            onboardingId: "",
            dateOfBirth: "01-01-2000",
            password: value?.password,
            nationality: "Nigerian",
            phoneCode: "+234",
            referralCode: "",
            bvn: "12345678901"
        }

        mutate(payload)
    }

    const submitOtp = () => {
        const payload = {
            otp: getValuesOTP('otp'),
            email: registerData
        }

        verifyOtp(payload)
    }

    return (
        <div className='space-y-3'>
            {
                registerStep === 'credentials' ? (
                    <>
                        <DialogHeader className='flex flex-col'>
                            <DialogTitle className="text-2xl text-center font-medium">Join Us Today!</DialogTitle>
                            <DialogDescription className="text-sm text-center">Please enter your credentials to continue</DialogDescription>
                        </DialogHeader>

                        <form className='grid md:grid-cols-2 gap-4' onSubmit={handleSubmit(onSubmit)}>
                            <div className='space-y-3'>
                                <Label>First Name</Label>

                                <Input
                                    type="text"
                                    {...register('firstName')}
                                    placeholder="First Name"
                                    className="mb-4 mt-2"
                                />
                            </div>
                            <div className='space-y-3'>
                                <Label>Last Name</Label>

                                <Input
                                    type="text"
                                    {...register('lastName')}
                                    placeholder="Last Name"
                                    className="mb-4 mt-2"
                                />
                            </div>

                            <div className='space-y-3'>
                                <Label>Email Address</Label>

                                <Input
                                    type="email"
                                    {...register('email')}
                                    placeholder="Email"
                                    className="mb-4 mt-2"
                                />
                            </div>

                            <div className='space-y-3'>
                                <Label>Mobile Number</Label>

                                <Input
                                    type="text"
                                    {...register('mobile')}
                                    placeholder="Mobile Number"
                                    className="mb-4 mt-2"
                                />
                            </div>

                            <div className='space-y-3'>
                                <Label>Password</Label>

                                <Input
                                    type="password"
                                    {...register('password')}
                                    placeholder="Password"
                                    className="mb-4 mt-2"
                                />
                            </div>

                            <div className='space-y-3'>
                                <Label>Delivery Address</Label>

                                <Input
                                    type="text"
                                    {...register('address')}
                                    placeholder="Delivery Address"
                                    className="mb-4 mt-2"
                                />
                            </div>

                            <Button type='submit' className='bg-accent md:col-span-2 text-white' disabled={isPending}>{isPending ? 'Registering...' : 'Register'}</Button>
                        </form>

                        <p className='text-sm text-center'>
                            Already registered?{' '}
                            <button className="text-accent underline" onClick={() => setState('login')}>
                                Login
                            </button>
                        </p>
                    </>
                )
                    :
                    <div>
                        <DialogHeader className='flex flex-col'>
                            <DialogTitle className="text-2xl text-center font-medium">Verify OTP</DialogTitle>
                            <DialogDescription className="text-sm text-center">Please enter the OTP sent to your email</DialogDescription>
                        </DialogHeader>

                        <form className='flex flex-col gap-4' onSubmit={handleSubmitOTP(submitOtp)}>
                            <div className='space-y-1'>
                                <Label>OTP</Label>

                                <Input
                                    type="text"
                                    {...registerOTP('otp')}
                                    placeholder="Enter OTP"
                                    className="mb-4"
                                    maxLength={4}
                                />
                            </div>

                            <Button type='submit' className='bg-accent text-white' disabled={isVerifying}>{isVerifying ? 'Verifying...' : 'Verify OTP'}</Button>
                        </form>
                    </div>
            }
        </div>
    )
}

export default RegisterForm
import axiosCustomer from '@/utils/fetch-function-customer'
import { useMutation } from '@tanstack/react-query'
import React, { useState, useRef } from 'react'
import { toast } from 'sonner'

type ValidationProps = {
    email: string,
    setWorkEmailConfirmed: (workEmailConfirmed:boolean) => void,
    setIsOpen: (isOpen:boolean) => void
}

const WorkEmailOtpValidation = ({email, setWorkEmailConfirmed, setIsOpen}: ValidationProps) => {
  const [otp, setOtp] = useState(['', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }
    
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 4).split('')
    const newOtp = [...otp]
    
    pastedData.forEach((char, index) => {
      if (/^\d$/.test(char) && index < 4) {
        newOtp[index] = char
      }
    })
    
    setOtp(newOtp)
    const nextEmptyIndex = newOtp.findIndex(val => val === '')
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[3]?.focus()
    }
  }


  const {mutate,isPending} = useMutation({
    mutationFn: (data)=>axiosCustomer.request({
        url: '/customer-kyc/work-email/validate-otp',
        method: 'POST',
        data,
        params: {
            otp: otp?.join(''),
            email
        }
    }),
    onSuccess: (data)=>{
        if (data?.data?.code!=='000') {
            toast.error(data?.data?.desc)
            return
        }
        toast.success(data?.data?.desc)
        setWorkEmailConfirmed(true)
        setIsOpen(false)
    },
    onError: (error)=>{
        toast?.error('Something went wrong!')
    }
  })

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Verify Your Email</h2>
      <p className="text-gray-600 text-center mb-6">
        We&apos;ve sent a verification code to <span className="font-medium">{email}</span>
      </p>
      
      <div className="flex gap-2 mb-6" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el) as any}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-accent focus:outline-none transition-colors"
          />
        ))}
      </div>

      <button
        onClick={()=>mutate()}
        type='button'
        disabled={otp.join('').length !== 4 || isPending}
        className="w-full bg-accent text-white py-2 px-4 rounded-lg font-medium hover:bg-accent-foreground disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Verifying...' : 'Verify'}
      </button>

      <button
        onClick={() => setIsOpen(false)}
        className="mt-3 text-gray-600 text-sm hover:text-gray-800"
      >
        Cancel
      </button>
    </div>
  )
}

export default WorkEmailOtpValidation
import { Input } from '@/components/ui/input'
import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { FormData } from '../SignUpForm'
import { Label } from '@/components/ui/label'


type Props = {
    register: UseFormRegister<FormData>,
    errors: FieldErrors<FormData>,
    // watchedValues: FormData,
    // setValue: UseFormSetValue<FormData>
}
const ContactDetails = ({errors,register}:Props) => {
   return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNo">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobileNo"
                type="tel"
                maxLength={11}
                {...register("mobileNo", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{11}$/,
                    message: "Mobile number must be 11 digits",
                  },
                })}
                placeholder="Enter mobile number"
              />
              {errors.mobileNo && <p className="text-red-500 text-xs">{errors.mobileNo.message}</p>}
            </div>
          </div>
        )
}

export default ContactDetails
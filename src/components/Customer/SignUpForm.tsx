"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Personal from "./onboarding/Personal"
import ContactDetails from "./onboarding/Contact"
import PasswordDetails from "./onboarding/PasswordDetails"
import LocationDetails from "./onboarding/LocationDetails"
import { formatDateToDDMMYYYY } from "@/utils/helperfns"
import axiosCustomer from "@/utils/fetch-function-no-auth"
import Link from "next/link"
import { OtpVerification } from "./otp-verification"
import SignUpBanner from "@/components/images/auth-banner.png"
import logo from "@/components/images/direct-logo.png"
import { SuccessTag, CheckIcon } from "../icons/icons"
import { Loader2 } from "lucide-react"
import { useLocationStore } from "@/store/locationStore"

export interface FormData {
  firstname: string
  lastname: string
  email: string
  mobileNo: string
  nationality: string
  state?: string
  city: string
  address: string
  password: string
  cPassword: string
  gender: string
  dateOfBirth?: string
  agreeToTerms: boolean
  bvn?: string
  nin?: string
  identificationType?: 'bvn' | 'nin' | ''
  // customerPic: string | File
}

export function SignUpForm() {
  const currentYear = new Date().getFullYear()
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardStep, setOnBoardStep] = useState<'register' | 'otp' | 'success'>('register')
  const totalSteps = 4
  const router = useRouter()
  const { location } = useLocationStore()
  const bannerUrl = process.env.NEXT_PUBLIC_BANNER_URL || "https://mmcpdocs.s3.eu-west-2.amazonaws.com/16574_ecommerce-svg.jpg";
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    setError,
    clearErrors,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {

      firstname: "",
      lastname: "",
      email: "",
      mobileNo: "",
      nationality: "",
      state: "",
      city: "",
      address: "",
      password: "",
      cPassword: "",
      dateOfBirth: '',
      bvn: "",
      nin: "",
      agreeToTerms: false,
      // customerPic: ""
    },
  })

  const watchedValues = watch()
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
      // router.push(`/customer-login`)
      setTimeout(() => { setOnBoardStep('otp') }, 3000)
      toast.success("Registration successful! Please verify OTP.");


    },
    onError: (error) => {
      // console.log(error);
    }
  })
  const onSubmit = (value: FormData) => {
    const nationalityData = JSON?.parse(value?.nationality)
    const payload = {
      firstname: value?.firstname,
      channel: 'WEB',
      customerType: "",
      deviceId: "",
      geolocation: location ? `${location?.latitude}, ${location?.longitude}` : '',
      lastname: value?.lastname,
      name: value?.firstname,
      middlename: "",
      mobileNo: value?.mobileNo,
      email: value?.email,
      entityCode: entityCode,
      city: value?.city,
      address: value?.address,
      countryCode: nationalityData?.code,
      gender: value?.gender,
      onboardingId: "",
      dateOfBirth: formatDateToDDMMYYYY(value?.dateOfBirth),
      password: value?.password,
      nationality: nationalityData?.nationality,
      phoneCode: nationalityData?.phoneCode,
      referralCode: "",
      ...(value.identificationType === 'bvn' && { bvn: value.bvn }),
      ...(value.identificationType === 'nin' && { nin: value.nin }),
      // photoLink: value?.customerPic || ""
    }

    mutate(payload)
  }

  const validateStrongPassword = (password: string): { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; message: string } => {
    if (password.length < 8) {
      return { isValid: false, strength: 'weak', message: 'Password must be at least 8 characters long' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const requirementsMet = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (requirementsMet === 4) {
      return { isValid: true, strength: 'strong', message: 'Strong password' };
    } else if (requirementsMet >= 3) {
      return { isValid: true, strength: 'medium', message: 'Medium strength password' };
    } else {
      return {
        isValid: false,
        strength: 'weak',
        message: 'Include uppercase, lowercase, numbers, and special characters'
      };
    }
  }

  const isPasswordStrongEnough = (password: string) => {
    if (!password) return false
    const validation = validateStrongPassword(password)
    return validation.strength !== 'weak'
  }

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        const isIdentificationValid = watchedValues.identificationType
          ? (watchedValues.identificationType === 'bvn'
            ? watchedValues.bvn && /^[0-9]{4,11}$/.test(watchedValues.bvn)
            : watchedValues.nin && /^[0-9]{4,11}$/.test(watchedValues.nin))
          : false;

        return watchedValues?.gender &&
          watchedValues.firstname &&
          watchedValues.lastname &&
          watchedValues?.dateOfBirth &&
          isIdentificationValid;
      // && watchedValues?.customerPic
      case 2:
        return watchedValues.email && watchedValues.mobileNo.length === 11
      case 3:
        return watchedValues.password && watchedValues.cPassword &&
          watchedValues.password === watchedValues.cPassword &&
          isPasswordStrongEnough(watchedValues.password)
      case 4:
        return watchedValues.city && watchedValues.address && watchedValues?.nationality && watchedValues.agreeToTerms
      default:
        return false
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isStepValid = await trigger(fieldsToValidate)

    if (isStepValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        const fields: (keyof FormData)[] = ["firstname", "lastname", "gender", "dateOfBirth"];

        if (watchedValues.identificationType === 'bvn') {
          fields.push("bvn");
        } else if (watchedValues.identificationType === 'nin') {
          fields.push("nin");
        }

        return fields;
      case 2:
        return ["email", "mobileNo"]
      case 3:
        return ["password", "cPassword"]
      case 4:
        return ["nationality", "city", 'address', "agreeToTerms"]
      default:
        return []
    }
  }


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Personal
          errors={errors}
          register={register}
          setValue={setValue}
          watchedValues={watchedValues}
          watch={watch}
          setError={setError}
          clearErrors={clearErrors}
        />


      case 2:
        return <ContactDetails
          errors={errors}
          register={register}
        />

      case 3:
        return <PasswordDetails
          errors={errors}
          register={register}
          watch={watch}
        />
      case 4:
        return <LocationDetails
          errors={errors}
          register={register}
          setValue={setValue}
          watchedValues={watchedValues}
          control={control}
        />

      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Personal Details"
      case 2:
        return "Contact Details"
      case 3:
        return "Password Details"
      case 4:
        return "Location Details"
      default:
        return ""
    }
  }

  const handleBackToRegistration = () => {
    setOnBoardStep('register')
  }

  const handleLogin = () => {
    router.push("/customer-login")
  }

  return (
    <div className="flex flex-col lg:flex-row bg-[#F9FAFB]">
      <div className='hidden lg:block lg:w-1/2 h-screen sticky top-0 p-4'>
        <div className="bg-gradient-to-b from-[#F9FAFB] to-[#FE7211] shadow-0 rounded-2xl w-full h-full flex items-center justify-center relative">
          <Image
            src={logo}
            alt="Logo"
            width={600}
            height={600}
            className="absolute top-0 left-0 p-5 max-w-[250px] h-auto object-contain"
          />
          <Image
            src={SignUpBanner}
            alt="POS System Illustration"
            width={600}
            height={600}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-8">
          {
            onboardStep === 'otp'
              ?
              <OtpVerification
                onBack={handleBackToRegistration}
                email={getValues('email')}
                onSuccess={() => setTimeout(() => { setOnBoardStep('success') }, 3000)}
              />
              :
              onboardStep === 'success'
                ?
                <>
                  <div className="flex flex-col w-full max-w-md space-y-4 p-5 bg-white rounded-lg justify-self-center mt-20">
                    <div className="flex items-center justify-center">
                      <SuccessTag />
                    </div>
                    <div className="text-lg text-center sm:text-xl font-medium text-dark-gray">Success!</div>
                    <div className="text-center text-medium-gray text-center text-xs leading-relaxed">
                      Welcome aboard, {getValues('firstname')}! You have created an account successfully.
                      Please login to view dashboard.
                    </div>

                    <Button
                      size='lg'
                      onClick={handleLogin}
                    >
                      Back to Login
                    </Button>
                  </div>
                </>
                :
                <div className="w-full max-w-md space-y-6 w-full  mx-auto ">
                  <div className="space-y-1 text-center">
                    <h1 className="text-lg sm:text-xl font-medium text-dark-gray">Customer Onboarding</h1>
                    <p className="text-medium-gray text-xs leading-relaxed">
                      Welcome, complete your user registration to get started.
                    </p>
                  </div>

                  <div className="flex items-center justify-center mb-3 relative">
                    <div className="flex items-center">
                      {[1, 2, 3, 4].map((step, index) => (
                        <div key={step} className="flex items-center">
                          <div
                            className={`relative z-10 transition-all duration-200 ${step < currentStep
                              ? "text-white"
                              : step === currentStep
                                ? "text-faded-accent"
                                : "text-gray-300"
                              }`}
                          >
                            {step < currentStep ? (
                              <div className="w-4.5 h-4.5 rounded-full bg-faded-accent flex items-center justify-center">
                                <CheckIcon className="w-3 h-3 text-white" strokeWidth={3} />
                              </div>
                            ) : (
                              <>
                                <div className={`w-4.5 h-4.5 rounded-full border-2 ${step === currentStep ? "border-faded-accent" : "border-gray-300"
                                  }`} />
                                <div className={`absolute inset-0 m-auto w-2 h-2 rounded-full ${step === currentStep ? "bg-faded-accent" : "bg-gray-300"
                                  }`} />
                              </>
                            )}
                          </div>
                          {index < 3 && (
                            <div
                              className={`w-24 h-0.5 transition-colors duration-200 ${step < currentStep ? "bg-faded-accent" : "bg-gray-200"
                                }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-center text-md font-normal text-dark-gray">{getStepTitle()}</h2>

                    <div className="bg-white p-5 rounded-lg">
                      {renderStep()}

                      <div className="flex justify-between mt-10">
                        <Button
                          type="button"
                          onClick={prevStep}
                          disabled={currentStep === 1}
                          variant="ghost"
                          className="border-2 border-input"
                        >
                          <span>Previous</span>
                        </Button>

                        {currentStep < totalSteps ? (
                          <Button
                            type="button"
                            onClick={nextStep}
                            disabled={!isStepComplete()}
                          >
                            <span>Next</span>
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                            disabled={!isStepComplete() || isPending || !watchedValues.agreeToTerms}
                          >
                            {isPending ? (
                              <>
                                Submitting...
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              </>
                            ) : (
                              "Complete Registration"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-sm font-normal text-medium-gray">Already have an account? {''}</span>
                    <Link
                      href="/customer-login"
                      className="text-sm text-faded-accent hover:text-accent/70"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
          }
        </div>
        <div className="text-center w-full text-xs text-[#9E9E9E] py-4 mt-auto">
          © {currentYear} Fortitude. All Right Reserved
        </div>
      </div>
    </div>
  )
}
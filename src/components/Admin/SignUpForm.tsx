"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import BusinessInformation from "./onboarding/business-information"
import ContactDetails from "./onboarding/contact-details"
import PasswordDetails from "./onboarding/password-details"
import LocationDetails from "./onboarding/location-details"
import BusinessDocuments from "./onboarding/business-documents"
import axiosInstanceNoAuth from "@/utils/fetch-function-auth"
import Link from "next/link"
import { useLocationStore } from "@/store/locationStore"

export interface FormData {
  businessName: string
  firstname: string
  lastname: string
  email: string
  mobileNo: string
  address: string
  country: string
  state?: string
  city: string
  password: string
  cPassword: string
  agreeToTerms: boolean
  bvn: string
  bvnPhoto: string | File
  gender: string
  dateOfBirth: string
  businessType: string
  businessRegNo: string
  businessLogo: string | File
  userPhoto: string | File
  docType: string
  docNo: string
  issueDate: string
  expiryDate: string
  utilityBill: string | File
  cacDocument: string | File
  identificationType: string
  idFile: string | File
  merchantLogo: string | File
  tierCode: string
  subscriptionType: string
}

export function SignUpForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5
  const router = useRouter()
  const bannerUrl = process.env.NEXT_PUBLIC_BANNER_URL || "https://mmcpdocs.s3.eu-west-2.amazonaws.com/16574_ecommerce-svg.jpg";
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';

  const { location } = useLocationStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      businessName: "",
      businessType: "",
      firstname: "",
      lastname: "",
      email: "",
      mobileNo: "",
      address: "",
      country: "",
      state: "",
      city: "",
      password: "",
      cPassword: "",
      agreeToTerms: false
    },
  })

  const watchedValues = watch()

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
        return watchedValues.businessName &&
          watchedValues.bvn &&
          // watchedValues.businessType &&
          watchedValues.firstname &&
          watchedValues.lastname &&
          watchedValues.gender &&
          watchedValues.dateOfBirth &&
          watchedValues.bvnPhoto
      case 2:
        return watchedValues.email && watchedValues.mobileNo.length === 11
        // watchedValues.subscriptionType && 
        // watchedValues.tierCode && 
        
      case 3:
        return watchedValues.identificationType &&
          watchedValues.merchantLogo &&
          watchedValues.idFile
      case 4:
        return watchedValues.password && watchedValues.cPassword &&
          watchedValues.password === watchedValues.cPassword &&
          isPasswordStrongEnough(watchedValues.password)
      case 5:
        return watchedValues.address && watchedValues.state && watchedValues.city && watchedValues?.country && watchedValues.agreeToTerms
      default:
        return false
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isStepValid = await trigger(fieldsToValidate)

    if (isStepValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return ["businessName", "bvn", "businessType", "firstname", "lastname", "gender", "dateOfBirth"]
      case 2:
        return ["subscriptionType", "tierCode", "email", "mobileNo"]
      case 3:
        return ["identificationType", "merchantLogo"]
      case 4:
        return ["password", "cPassword"]
      case 5:
        return ["address", "country", "city", "state", "agreeToTerms"]
      default:
        return []
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => axiosInstanceNoAuth.request({
      url: 'business/onboard',
      method: 'POST',
      data: {
        email: getValues().email,
        firstname: getValues().firstname,
        lastname: getValues().lastname,
        bvn: getValues().bvn,
        businessName: getValues().businessName,
        businessType: getValues().businessType,
        isStore: 'Y',
        subscriptionType: getValues().subscriptionType,
        subscriptionTierCode: getValues().tierCode,
        mobileNo: getValues().mobileNo,
        password: getValues().password,
        address: getValues().address,
        state: getValues().state,
        city: getValues().city,
        deviceId: 'string',
        dob: getValues().dateOfBirth,
        gender: getValues().gender,
        photoLink: `/${getValues().merchantLogo}`,
        bvnPhotoLink: getValues().bvnPhoto,
        accountType: 'MERCHWAL',
        businessLogo: `/${getValues().merchantLogo}`,
        businessRegNo: getValues().businessRegNo,
        currencyCode: 'NGN',
        referralCode: '000000',
        countryCode: 'NG',
        onboardDocs: [
          {
            type: 'CAC Document',
            link: getValues().cacDocument || null,
          },
          {
            type: getValues().identificationType || 'ID Document',
            link: getValues().idFile || null,
          },
        ],
        entityCode: entityCode,
        storeCode: '',
        merchantGroupCode: 'M0001',
        branchCode: 'HO',
        id: 0,
        latitude: location?.latitude,
        longitude: location?.longitude,
      }
    }),
    onSuccess: (response) => {
      if (response?.data?.code === '000') {
        toast.success(response?.data?.desc ?? 'Registration successful');
        // Open liveness page in new tab
        // window.open(`/liveness?id=${response?.data?.id}`, '_blank');
        setTimeout(() => { window.open('/admin-login', '_self'); }, 5000)
        return
      } else {
        toast.error(response.data?.desc);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'An error occurred');
    },
  })

  const onSubmit = (data: FormData) => {
    // console.log("Form submitted:", data)
    mutate()
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInformation
          errors={errors}
          register={register}
          setValue={setValue}
          watchedValues={watchedValues}
        />


      case 2:
        return <ContactDetails
          errors={errors}
          register={register}
          setValue={setValue}
          watchedValues={watchedValues}
        />

      case 3:
        return <BusinessDocuments
          errors={errors}
          register={register}
          setValue={setValue}
          watchedValues={watchedValues}
          watch={watch}
        />

      case 4:
        return <PasswordDetails
          errors={errors}
          register={register}
          watch={watch}
        />
      case 5:
        return <LocationDetails
          errors={errors}
          register={register}
          setValue={setValue}
          watchedValues={watchedValues}
        />

      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Business Information"
      case 2:
        return "Subscription Plan"
      case 3:
        return "Business Documents"
      case 4:
        return "Password Details"
      case 5:
        return "Location Details"
      default:
        return ""
    }
  }



  return (
    <div className="max-h-screen flex flex-col lg:flex-row overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-accent z-10"></div>

      <div className="hidden lg:flex lg:w-1/3 bg-gray-100 justify-center p-8 h-screen overflow-hidden">
        <div className="space-y-6">
          <div className="items-start flex text-3xl font-bold text-accent flex-col">
            Become a seller today and unlock endless possibilities for your business with our all-in-one eCommerce platform.
          </div>
          <Image
            src={bannerUrl}
            alt="POS System Illustration"
            width={600}
            height={600}
            className="max-w-full max-h-full object-contain"
            priority
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="py-12 px-4 sm:px-6 lg:px-12">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl space-y-8">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Business Onboarding</h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Welcome, complete your business registration to get started.
                </p>
              </div>

              <div className="flex items-center justify-center mb-6 relative">
                <div className="flex items-center w-full max-w-2xl">
                  {[1, 2, 3, 4, 5].map((step, index) => (
                    <div key={step} className="flex flex-col items-center flex-1 relative">
                      <div className="flex items-center w-full">
                        {index > 0 && (
                          <div
                            className={`h-0.5 flex-1 ${step <= currentStep ? "bg-accent" : "bg-gray-200"}`}
                          />
                        )}
                        <div className="relative">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium relative z-10 ${step <= currentStep ? "bg-accent text-white" : "bg-gray-200 text-gray-600"
                              }`}
                          >
                            {step}
                          </div>
                          {step === currentStep && (
                            <div className="absolute -inset-2 border-2 border-accent/30 rounded-full animate-pulse" />
                          )}
                        </div>

                        {index < 4 && (
                          <div
                            className={`h-0.5 flex-1 ${step < currentStep ? "bg-accent" : "bg-gray-200"}`}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">{getStepTitle()}</h2>
                {renderStep()}

                <div className="flex justify-between space-x-4 sticky bottom-0 bg-white py-4 -mb-8 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    variant="outline"
                    className="flex items-center space-x-2 px-6 py-3 disabled:opacity-50 bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepComplete()}
                      className="flex items-center space-x-2 bg-accent hover:bg-accent/70 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      disabled={!isStepComplete() || isPending || !watchedValues.agreeToTerms}
                      className="bg-accent hover:bg-accent/70 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Submitting..." : "Complete Registration"}
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <p className="text-gray-600 font-bold text-sm leading-relaxed mb-4">
                  NB: To ensure security and compliance, new business accounts undergo a verification process. Account access will be granted promptly upon approval.
                </p>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>

              <div className="text-center pb-4">
                <span className="text-sm text-gray-600">Already registered? </span>
                <Link
                  href="/admin-login"
                  className="text-sm text-accent hover:text-accent/70 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
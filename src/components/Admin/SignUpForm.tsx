"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
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
import SignUpBanner from "@/components/images/auth-banner.png"
// import logo from "@/components/images/direct-logo.png"
import { SuccessTag, CheckIcon } from "../icons/icons"
import { Loader2 } from "lucide-react"
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
  bvn?: string
  nin?: string
  bvnPhoto?: string | File
  gender?: string
  dateOfBirth?: string
  businessType: string
  businessRegNo: string
  businessLogo: string | File
  userPhoto: string | File
  docType: string
  docNo: string
  issueDate?: string
  expiryDate?: string
  utilityBill?: string | File
  cacDocument?: string | File
  identificationType?: 'bvn' | 'nin' | ''
  docIdentificationType?: string
  idFile?: string | File
  merchantLogo?: string | File
  tierCode?: string
  subscriptionType?: string
}

const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME!
const logo = process.env.NEXT_PUBLIC_LOGO_URL || 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/80254_varisa.jpeg';
export function SignUpForm() {
  const currentYear = new Date().getFullYear()
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardStep, setOnBoardStep] = useState<'register' | 'success'>('register')
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
    control,
    setError,
    clearErrors,
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
      agreeToTerms: false,
      bvn: "",
      nin: "",
      identificationType: "",
      docIdentificationType: "",
      dateOfBirth: "",
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
        const isIdentificationValid = watchedValues.identificationType
          ? (watchedValues.identificationType === 'bvn'
            ? !!watchedValues.bvn && /^[0-9]{4,11}$/.test(watchedValues.bvn)
            : !!watchedValues.nin && /^[0-9]{4,11}$/.test(watchedValues.nin))
          : false;

        return !!watchedValues.businessName &&
          !!watchedValues.businessType &&
          !!watchedValues.firstname &&
          !!watchedValues.lastname
      // !!watchedValues.gender &&
      // !!watchedValues.dateOfBirth &&
      // isIdentificationValid
      case 2:
        return !!watchedValues.email && watchedValues.mobileNo?.length === 11
      case 3:
        return !!watchedValues.merchantLogo
      // !!watchedValues.idFile
      case 4:
        return !!watchedValues.password && !!watchedValues.cPassword &&
          watchedValues.password === watchedValues.cPassword &&
          isPasswordStrongEnough(watchedValues.password)
      case 5:
        return !!watchedValues.address && !!watchedValues.state && !!watchedValues.city && !!watchedValues?.country && !!watchedValues.agreeToTerms
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
        const fields: (keyof FormData)[] = ["businessName", "businessType", "firstname", "lastname", "gender", "dateOfBirth"];

        if (watchedValues.identificationType === 'bvn') {
          fields.push("bvn");
        } else if (watchedValues.identificationType === 'nin') {
          fields.push("nin");
        }

        return fields;
      case 2:
        return ["subscriptionType", "tierCode", "email", "mobileNo"]
      case 3:
        return ["docIdentificationType", "merchantLogo"]
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
        nin: getValues().nin,
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
        dob: getValues().dateOfBirth || '2000-01-01',
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
            type: getValues().docIdentificationType || 'ID Document',
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
        setOnBoardStep('success')
      } else {
        toast.error(response.data?.desc);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'An error occurred');
    },
  })

  const onSubmit = (data: FormData) => {
    mutate()
  }

  const handleLogin = () => {
    router.push("/admin-login")
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInformation
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
          control={control}
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
    <div className="flex flex-col lg:flex-row bg-[#F9FAFB]">
      <div className='hidden lg:block lg:w-1/2 h-screen sticky top-0 p-4'>
        <div className="bg-gradient-to-b from-[#F9FAFB] to-[var(--accent)] shadow-0 rounded-2xl w-full h-full flex items-center justify-center relative">
          <Image
            src={logo}
            alt="Logo"
            width={100}
            height={100}
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
            onboardStep === 'success'
              ?
              <div className="flex flex-col w-full max-w-md space-y-4 p-5 bg-white rounded-lg justify-self-center mt-20">
                <div className="flex items-center justify-center">
                  <SuccessTag />
                </div>
                <div className="text-lg text-center sm:text-xl font-medium text-dark-gray">Success!</div>
                <div className="text-center text-medium-gray text-center text-xs leading-relaxed">
                  Welcome aboard, {getValues('firstname')}! You have created your business account successfully.
                  Please login to view dashboard.
                </div>

                <Button
                  size='lg'
                  onClick={handleLogin}
                >
                  Back to Login
                </Button>
              </div>
              :
              <div className="w-full max-w-md space-y-6 mx-auto">
                <div className="space-y-1 text-center">
                  <h1 className="text-lg sm:text-xl font-medium text-dark-gray">Business Onboarding</h1>
                  <p className="text-medium-gray text-xs leading-relaxed">
                    Welcome, complete your business registration to get started.
                  </p>
                </div>

                <div className="flex items-center justify-center mb-3 relative">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((step, index) => (
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
                        {index < 4 && (
                          <div
                            className={`w-16 h-0.5 transition-colors duration-200 ${step < currentStep ? "bg-faded-accent" : "bg-gray-200"
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

                <div>
                  <p className="text-medium-gray font-medium text-xs leading-relaxed p-3 bg-faded-accent/5 rounded-lg">
                    <span className="font-semibold">NB:</span> To ensure security and compliance, new business accounts undergo a verification process. Account access will be granted promptly upon approval.
                  </p>
                </div>

                <div className="text-center">
                  <span className="text-sm font-normal text-medium-gray">Already registered? </span>
                  <Link
                    href="/admin-login"
                    className="text-sm text-faded-accent hover:text-accent/70"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
          }
        </div>
        <div className="text-center w-full text-xs text-[#9E9E9E] py-4 mt-auto">
          © {currentYear} {clientName}. All Right Reserved
        </div>
      </div>
    </div>
  )
}
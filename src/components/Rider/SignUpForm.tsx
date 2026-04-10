"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Check, Truck, Bike, Footprints, Loader2, X } from "lucide-react"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "@/utils/fetch-function-no-auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatDateToDDMMYYYY } from "@/utils/helperfns"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface RiderFormData {
  driverCategory: string

  firstname: string
  lastname: string
  middlename: string
  email: string
  mobileNo: string
  gender: string
  dateOfBirth: string
  nationality: string
  phoneCode: string
  countryCode: string
  city: string
  password: string
  cPassword: string

  nationalId: string
  homeAddress: string

  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string

  driverLicenseNumber: string
  vehiclePlateNumber: string
  vehicleCapacity: string

  guarantorName: string
  guarantorPhone: string
  guarantorAddress: string
  refereeName: string
  refereePhone: string
  refereeRelationship: string

  agreeToTerms: boolean
}

const driverCategories = [
  {
    id: "VEHICLE",
    title: "Vehicle Driver",
    icon: Truck,
    description: "Cars, vans, and trucks for deliveries",
    features: ["Higher earning potential", "Larger package deliveries", "Fuel reimbursement"]
  },
  {
    id: "MOTORCYCLE",
    title: "Motorcycle Rider",
    icon: Bike,
    description: "Quick and efficient delivery on two wheels",
    features: ["Fast deliveries", "Navigate traffic easily", "Lower fuel costs"]
  },
  {
    id: "FOOT",
    title: "Foot Delivery",
    icon: Footprints,
    description: "Local deliveries on foot for nearby locations",
    features: ["No vehicle required", "Perfect for local deliveries", "Flexible hours"]
  }
]

const nationalities = [
  { nationality: "Nigerian", code: "NG", phoneCode: "+234" }
]

const SuccessModal = ({ isOpen, onClose, riderName }: { isOpen: boolean; onClose: () => void; riderName: string }) => {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/rider-login")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col">
          <div className="flex items-center justify-center">
            <svg width="67" height="64" viewBox="0 0 67 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_i_3505_39866)">
                <path d="M67 31.9989C67 35.4025 62.7353 38.0881 61.7368 41.1538C60.7045 44.3378 62.5322 49.0082 60.6029 51.6516C58.6567 54.3288 53.622 54.0163 50.9481 55.9672C48.2996 57.8928 47.0472 62.7743 43.8572 63.8047C40.7856 64.8012 36.9101 61.6173 33.5 61.6173C30.0899 61.6173 26.2229 64.8012 23.1428 63.8047C19.9528 62.7743 18.7089 57.8928 16.0519 55.9672C13.3695 54.0248 8.34327 54.3288 6.39707 51.6516C4.46779 49.0082 6.30399 44.3378 5.2632 41.1538C4.26471 38.0881 0 35.4025 0 31.9989C0 28.5954 4.26471 25.9097 5.2632 22.844C6.29553 19.66 4.46779 14.9897 6.39707 12.3462C8.34327 9.66901 13.378 9.9815 16.0519 8.03059C18.7004 6.10501 19.9528 1.22351 23.1428 0.193161C26.2144 -0.803408 30.0899 2.38055 33.5 2.38055C36.9101 2.38055 40.7771 -0.803408 43.8572 0.193161C47.0472 1.22351 48.2911 6.10501 50.9481 8.03059C53.6305 9.97305 58.6567 9.66901 60.6029 12.3462C62.5322 14.9897 60.696 19.66 61.7368 22.844C62.7353 25.9097 67 28.5954 67 31.9989Z" fill="#33B132" />
              </g>
              <path d="M30.4898 45.2857C29.4027 46.6161 27.4225 46.7635 26.1504 45.6088L18.7513 38.8923C17.5227 37.7771 17.4327 35.8764 18.5505 34.6501L18.8592 34.3114C19.9732 33.0892 21.8662 32.999 23.0914 34.1097L25.457 36.2543C26.7292 37.4076 28.708 37.2598 29.7948 35.9303L42.1667 20.7938C43.2131 19.5135 45.0982 19.3213 46.3815 20.3641L46.7347 20.6512C48.023 21.6981 48.2162 23.5922 47.1658 24.8776L30.4898 45.2857Z" fill="#F9FAFB" />
              <defs>
                {/* <filter id="filter0_i_3505_39866" x="0" y="-8" width="67" height="71.998" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="-8" />
                  <feGaussianBlur stdDeviation="18" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3505_39866" />
                </filter> */}
              </defs>
            </svg>
          </div>
          <DialogTitle className="text-center text-xl mt-4">Registration Successful!</DialogTitle>
          <DialogDescription className="text-center">
            Welcome aboard, {riderName}! Your rider account has been created successfully.
            Please login to start accepting deliveries.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleLogin}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            Login to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-accent/20 hover:bg-accent/10"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function RiderSignUpForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const totalSteps = 3
  const router = useRouter()
  const bannerUrl = process.env.NEXT_PUBLIC_BANNER_URL || "https://mmcpdocs.s3.eu-west-2.amazonaws.com/16574_ecommerce-svg.jpg"
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || ''

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
    trigger,
  } = useForm<RiderFormData>({
    mode: "onChange",
    defaultValues: {
      driverCategory: "",
      firstname: "",
      lastname: "",
      middlename: "",
      email: "",
      mobileNo: "",
      gender: "",
      dateOfBirth: "",
      nationality: "",
      phoneCode: "+234",
      countryCode: "NG",
      city: "",
      password: "",
      cPassword: "",
      nationalId: "",
      homeAddress: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      driverLicenseNumber: "",
      vehiclePlateNumber: "",
      vehicleCapacity: "",
      guarantorName: "",
      guarantorPhone: "",
      guarantorAddress: "",
      refereeName: "",
      refereePhone: "",
      refereeRelationship: "",
      agreeToTerms: false,
    },
  })

  const watchedValues = watch()
  const selectedCategory = watchedValues.driverCategory

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axiosInstance.request({
      url: '/delivery-rider/rider/simple-onboard',
      method: 'POST',
      data
    }),
    onSuccess: (data) => {
      if (data?.data?.code !== '000') {
        toast.error(data?.data?.desc || "Registration failed")
        return
      }
      setShowSuccessModal(true)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.desc || "Registration failed. Please try again.")
    }
  })

  const validateStrongPassword = (password: string): { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; message: string } => {
    if (password.length < 8) {
      return { isValid: false, strength: 'weak', message: 'Password must be at least 8 characters long' }
    }
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    const requirementsMet = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length

    if (requirementsMet === 4) {
      return { isValid: true, strength: 'strong', message: 'Strong password' }
    } else if (requirementsMet >= 3) {
      return { isValid: true, strength: 'medium', message: 'Medium strength password' }
    } else {
      return {
        isValid: false,
        strength: 'weak',
        message: 'Include uppercase, lowercase, numbers, and special characters'
      }
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
        return !!watchedValues.driverCategory
      case 2:
        const isValid = !!watchedValues.firstname &&
          !!watchedValues.lastname &&
          !!watchedValues.email &&
          watchedValues.mobileNo?.length === 11 &&
          !!watchedValues.gender &&
          !!watchedValues.dateOfBirth &&
          !!watchedValues.city &&
          !!watchedValues.nationality &&
          !!watchedValues.nationalId &&
          !!watchedValues.homeAddress &&
          !!watchedValues.emergencyContactName &&
          !!watchedValues.emergencyContactPhone &&
          !!watchedValues.emergencyContactRelationship &&
          !!watchedValues.password &&
          watchedValues.password === watchedValues.cPassword &&
          isPasswordStrongEnough(watchedValues.password) &&
          (selectedCategory !== 'VEHICLE' || (watchedValues.driverLicenseNumber && watchedValues.vehiclePlateNumber))

        // if (!isValid) {
        //   console.log("Step 2 validation failed:", {
        //     firstname: !!watchedValues.firstname,
        //     lastname: !!watchedValues.lastname,
        //     email: !!watchedValues.email,
        //     mobileNo: watchedValues.mobileNo?.length === 11,
        //     gender: !!watchedValues.gender,
        //     dateOfBirth: !!watchedValues.dateOfBirth,
        //     city: !!watchedValues.city,
        //     nationality: !!watchedValues.nationality,
        //     nationalId: !!watchedValues.nationalId,
        //     homeAddress: !!watchedValues.homeAddress,
        //     emergencyContactName: !!watchedValues.emergencyContactName,
        //     emergencyContactPhone: !!watchedValues.emergencyContactPhone,
        //     emergencyContactRelationship: !!watchedValues.emergencyContactRelationship,
        //     password: !!watchedValues.password,
        //     passwordsMatch: watchedValues.password === watchedValues.cPassword,
        //     passwordStrength: isPasswordStrongEnough(watchedValues.password),
        //     vehicleDetails: selectedCategory !== 'VEHICLE' || (watchedValues.driverLicenseNumber && watchedValues.vehiclePlateNumber)
        //   })
        // }
        return isValid
      case 3:
        return !!watchedValues.guarantorName &&
          !!watchedValues.guarantorPhone &&
          !!watchedValues.refereeName &&
          !!watchedValues.refereePhone &&
          !!watchedValues.refereeRelationship &&
          watchedValues.agreeToTerms
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

  const getFieldsForStep = (step: number): (keyof RiderFormData)[] => {
    switch (step) {
      case 1:
        return ["driverCategory"]
      case 2:
        const baseFields: (keyof RiderFormData)[] = [
          "firstname", "lastname", "email", "mobileNo", "gender",
          "dateOfBirth", "city", "nationality", "nationalId", "homeAddress",
          "emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship",
          "password", "cPassword"
        ]
        if (selectedCategory === 'VEHICLE') {
          baseFields.push("driverLicenseNumber", "vehiclePlateNumber")
        }
        return baseFields
      case 3:
        return ["guarantorName", "guarantorPhone", "refereeName", "refereePhone", "refereeRelationship", "agreeToTerms"]
      default:
        return []
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const onSubmit = (values: RiderFormData) => {
    const nationalityData = JSON.parse(values.nationality)
    const payload = {
      driverCategory: values.driverCategory,
      userInfo: {
        firstname: values.firstname,
        customerType: "RIDER",
        deviceId: "",
        geolocation: "",
        lastname: values.lastname,
        name: values.firstname,
        middlename: values.middlename,
        mobileNo: values.mobileNo,
        email: values.email,
        city: values.city,
        countryCode: nationalityData?.code || "NG",
        gender: values.gender,
        onboardingId: "",
        dateOfBirth: formatDateToDDMMYYYY(values.dateOfBirth),
        password: values.password,
        nationality: nationalityData?.nationality || "Nigerian",
        phoneCode: nationalityData?.phoneCode || "+234",
        referralCode: "",
        bvn: "",
        channel: "WEB",
        photoLink: ""
      },
      nationalId: values.nationalId,
      homeAddress: values.homeAddress,
      emergencyContactName: values.emergencyContactName,
      emergencyContactPhone: values.emergencyContactPhone,
      emergencyContactRelationship: values.emergencyContactRelationship,
      driverLicenseNumber: values.driverLicenseNumber || "",
      vehiclePlateNumber: values.vehiclePlateNumber || "",
      vehicleCapacity: values.vehicleCapacity || "",
      guarantorName: values.guarantorName,
      guarantorPhone: values.guarantorPhone,
      guarantorAddress: values.guarantorAddress,
      refereeName: values.refereeName,
      refereePhone: values.refereePhone,
      refereeRelationship: values.refereeRelationship
    }

    mutate(payload)
  }

  const getMaxDate = () => {
    const today = new Date()
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    return maxDate.toISOString().split('T')[0]
  }

  const StepIndicator = () => {
    const steps = [
      { number: 1, title: "Select Category", completed: currentStep > 1 },
      { number: 2, title: "Personal Details", completed: currentStep > 2 },
      { number: 3, title: "Guarantor & Referrer", completed: currentStep > 3 }
    ]

    return (
      <div className="relative mb-8">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${step.number <= currentStep
                  ? "bg-accent text-white"
                  : "bg-gray-200 text-gray-500"
                  }`}
              >
                {step.completed ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span className={`text-xs mt-2 ${step.number <= currentStep ? "text-accent font-medium" : "text-gray-500"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {driverCategories.map((category) => {
                const Icon = category.icon
                const isSelected = selectedCategory === category.id
                return (
                  <div
                    key={category.id}
                    onClick={() => setValue("driverCategory", category.id, { shouldValidate: true })}
                    className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${isSelected
                      ? "border-accent bg-accent/5 shadow-md"
                      : "border-gray-200 hover:border-accent/50"
                      }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-3 rounded-full ${isSelected ? "bg-accent/10" : "bg-gray-100"}`}>
                        <Icon className={`w-8 h-8 ${isSelected ? "text-accent" : "text-gray-600"}`} />
                      </div>
                      <h3 className={`font-semibold ${isSelected ? "text-accent" : "text-gray-900"}`}>
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                      {/* <ul className="text-xs text-gray-500 space-y-1 mt-2">
                        {category.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul> */}
                    </div>
                  </div>
                )
              })}
            </div>
            {errors.driverCategory && (
              <p className="text-red-500 text-xs text-center">{errors.driverCategory.message}</p>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-accent-foreground mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-400">*</span></label>
                  <Input
                    {...register("firstname", { required: "First name is required" })}
                    placeholder="Enter first name"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.firstname && <p className="text-red-500 text-xs">{errors.firstname.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-400">*</span></label>
                  <Input
                    {...register("lastname", { required: "Last name is required" })}
                    placeholder="Enter last name"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Middle Name</label>
                  <Input
                    {...register("middlename")}
                    placeholder="Enter middle name"
                    className="border-gray-300 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email <span className="text-red-400">*</span></label>
                  <Input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    placeholder="Enter email address"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mobile Number <span className="text-red-400">*</span></label>
                  <Input
                    type="tel"
                    maxLength={11}
                    {...register("mobileNo", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Mobile number must be 11 digits"
                      }
                    })}
                    placeholder="08012345678"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.mobileNo && <p className="text-red-500 text-xs">{errors.mobileNo.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Gender <span className="text-red-400">*</span></label>
                  <Select
                    value={watchedValues.gender}
                    onValueChange={(value) => setValue("gender", value, { shouldValidate: true })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date of Birth <span className="text-red-400">*</span></label>
                  <Input
                    type="date"
                    max={getMaxDate()}
                    {...register("dateOfBirth", { required: "Date of birth is required" })}
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City <span className="text-red-400">*</span></label>
                  <Input
                    {...register("city", { required: "City is required" })}
                    placeholder="Enter city"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nationality <span className="text-red-400">*</span></label>
                  <Select
                    value={watchedValues.nationality}
                    onValueChange={(value) => setValue("nationality", value, { shouldValidate: true })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {nationalities.map((item) => (
                        <SelectItem key={item.code} value={JSON.stringify(item)}>
                          {item.nationality} ({item.phoneCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.nationality && <p className="text-red-500 text-xs">{errors.nationality.message}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-accent-foreground mb-4">Identification & Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">National ID Number <span className="text-red-400">*</span></label>
                  <Input
                    {...register("nationalId", { required: "National ID is required" })}
                    placeholder="Enter national ID number"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.nationalId && <p className="text-red-500 text-xs">{errors.nationalId.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Home Address <span className="text-red-400">*</span></label>
                  <Input
                    {...register("homeAddress", { required: "Home address is required" })}
                    placeholder="Enter home address"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.homeAddress && <p className="text-red-500 text-xs">{errors.homeAddress.message}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-accent-foreground mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Contact Name <span className="text-red-400">*</span></label>
                  <Input
                    {...register("emergencyContactName", { required: "Emergency contact name is required" })}
                    placeholder="Enter emergency contact name"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.emergencyContactName && <p className="text-red-500 text-xs">{errors.emergencyContactName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Contact Phone <span className="text-red-400">*</span></label>
                  <Input
                    type="tel"
                    maxLength={11}
                    {...register("emergencyContactPhone", {
                      required: "Emergency contact phone is required",
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Phone number must be 11 digits"
                      }
                    })}
                    placeholder="08012345678"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.emergencyContactPhone && <p className="text-red-500 text-xs">{errors.emergencyContactPhone.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Relationship <span className="text-red-400">*</span></label>
                  <Input
                    {...register("emergencyContactRelationship", { required: "Relationship is required" })}
                    placeholder="e.g., Spouse, Parent, Sibling"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.emergencyContactRelationship && <p className="text-red-500 text-xs">{errors.emergencyContactRelationship.message}</p>}
                </div>
              </div>
            </div>

            {selectedCategory === 'VEHICLE' && (
              <div>
                <h3 className="text-lg font-semibold text-accent-foreground mb-4">Vehicle Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Driver License Number <span className="text-red-400">*</span></label>
                    <Input
                      {...register("driverLicenseNumber", { required: selectedCategory === 'VEHICLE' ? "Driver license is required" : false })}
                      placeholder="Enter driver license number"
                      className="border-gray-300 focus:border-accent"
                    />
                    {errors.driverLicenseNumber && <p className="text-red-500 text-xs">{errors.driverLicenseNumber.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Vehicle Plate Number <span className="text-red-400">*</span></label>
                    <Input
                      {...register("vehiclePlateNumber", { required: selectedCategory === 'VEHICLE' ? "Vehicle plate number is required" : false })}
                      placeholder="Enter vehicle plate number"
                      className="border-gray-300 focus:border-accent"
                    />
                    {errors.vehiclePlateNumber && <p className="text-red-500 text-xs">{errors.vehiclePlateNumber.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Vehicle Capacity</label>
                    <Input
                      {...register("vehicleCapacity")}
                      placeholder="e.g., 4 seats, 500kg"
                      className="border-gray-300 focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-accent-foreground mb-4">Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password <span className="text-red-400">*</span></label>
                  <Input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" },
                      validate: {
                        strongPassword: (value) => {
                          if (!value) return true
                          const validation = validateStrongPassword(value)
                          return validation.isValid || validation.message
                        }
                      }
                    })}
                    placeholder="Create a strong password"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password <span className="text-red-400">*</span></label>
                  <Input
                    type="password"
                    {...register("cPassword", {
                      required: "Confirm password is required",
                      validate: (value) => value === watch("password") || "Passwords do not match"
                    })}
                    placeholder="Confirm your password"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.cPassword && <p className="text-red-500 text-xs">{errors.cPassword.message}</p>}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-accent-foreground mb-4">Guarantor Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Guarantor Name <span className="text-red-400">*</span></label>
                  <Input
                    {...register("guarantorName", { required: "Guarantor name is required" })}
                    placeholder="Enter guarantor's full name"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.guarantorName && <p className="text-red-500 text-xs">{errors.guarantorName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Guarantor Phone <span className="text-red-400">*</span></label>
                  <Input
                    type="tel"
                    maxLength={11}
                    {...register("guarantorPhone", {
                      required: "Guarantor phone is required",
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Phone number must be 11 digits"
                      }
                    })}
                    placeholder="08012345678"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.guarantorPhone && <p className="text-red-500 text-xs">{errors.guarantorPhone.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Guarantor Address</label>
                  <Input
                    {...register("guarantorAddress")}
                    placeholder="Enter guarantor's address"
                    className="border-gray-300 focus:border-accent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-accent-foreground mb-4">Referrer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Referrer Name <span className="text-red-400">*</span></label>
                  <Input
                    {...register("refereeName", { required: "Referrer name is required" })}
                    placeholder="Enter referrer's full name"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.refereeName && <p className="text-red-500 text-xs">{errors.refereeName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Referrer Phone <span className="text-red-400">*</span></label>
                  <Input
                    type="tel"
                    maxLength={11}
                    {...register("refereePhone", {
                      required: "Referrer phone is required",
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Phone number must be 11 digits"
                      }
                    })}
                    placeholder="08012345678"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.refereePhone && <p className="text-red-500 text-xs">{errors.refereePhone.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Relationship <span className="text-red-400">*</span></label>
                  <Input
                    {...register("refereeRelationship", { required: "Relationship is required" })}
                    placeholder="e.g., Friend, Colleague, Family"
                    className="border-gray-300 focus:border-accent"
                  />
                  {errors.refereeRelationship && <p className="text-red-500 text-xs">{errors.refereeRelationship.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("agreeToTerms", { required: "You must agree to the terms and conditions" })}
                  className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <span className="text-sm text-gray-700">
                  I agree to the <span className="text-accent">Terms and Conditions</span> and{" "}
                  <span className="text-accent">Privacy Policy</span>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-accent z-10" />

        <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center p-8 h-screen overflow-hidden">
          <Image
            src={bannerUrl}
            alt="Rider Registration"
            width={600}
            height={600}
            className="max-w-full max-h-full object-contain"
            priority
          />
        </div>

        <div className="w-full lg:w-1/2 overflow-y-auto mt-28">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Rider Registration</h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Join our delivery network and start earning today
                </p>
              </div>

              <StepIndicator />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {renderStep()}

                <div className="flex justify-between space-x-4 pt-4 sticky bottom-0 bg-white py-4 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    variant="outline"
                    className="flex items-center space-x-2 px-6 py-3 disabled:opacity-50 bg-transparent border-gray-300"
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
                      disabled={!isStepComplete() || isPending}
                      className="bg-accent hover:bg-accent/70 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>
                  )}
                </div>
              </form>

              <div className="text-center pb-4">
                <span className="text-sm text-gray-600">Already have an account? </span>
                <Link
                  href="/rider-login"
                  className="text-sm text-accent hover:text-accent/70 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        riderName={`${getValues("firstname")} ${getValues("lastname")}`}
      />
    </>
  )
}

// import { Button } from "@/components/ui/button"
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { useGetBvnInfo } from "@/hooks/useGetBvnInfo"
// import axiosInstance from "@/utils/fetch-function"
// import { useMutation } from "@tanstack/react-query"
// import { Loader2, Plus } from "lucide-react"
// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { toast } from "sonner"

// interface DirectorInfoFormData {
//     title: string
//     firstName: string
//     lastName: string
//     email: string
//     mobileNo: string
//     bvn: string
//     nin: string
//     dateOfBirth: string
//     holdingShare: number
//     countryOfResidence: string
//     nationality: string
//     address: string
// }

// export function DirectorInfoModal() {
//     const [open, setOpen] = useState(false)
//     const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DirectorInfoFormData>()
//     const getBvnInfo = useGetBvnInfo()
//     const bvn = watch('bvn')

//     const saveDirectorMutation = useMutation({
//         mutationFn: async (data: DirectorInfoFormData) => {
//             return axiosInstance?.request({
//                 url: '/company-director/save',
//                 method: 'POST',
//                 data: {
//                     ...data,
//                     id: 0,
//                     // merchantCode: "", // Placeholder if required
//                 }
//             });
//         },
//         onSuccess: (response) => {
//             if (response?.data?.desc?.includes('SUCCESS')) {
//                 toast.success(response?.data?.desc || "Director info saved successfully")
//                 setOpen(false)
//             } else {
//                 toast.error(response?.data?.desc || "Failed to save director info")
//             }
//         },
//         onError: () => {
//             toast.error("An error occurred while saving information")
//         }
//     })

//     const validateBvn = (currentBvn: string) => {
//         if (!currentBvn || currentBvn.length !== 11) return

//         getBvnInfo.mutate(currentBvn, {
//             onSuccess: (data) => {
//                 if (data?.data?.responseCode === '000') {
//                     setValue('firstName', data?.data?.firstname)
//                     setValue('lastName', data?.data?.lastname)
//                     setValue('dateOfBirth', data?.data?.birthdate) // Ensure format matches input type="date" if possible. API usually returns formatted.
//                     setValue('mobileNo', data?.data?.phone)
//                     toast.success(data?.data?.message || 'BVN Validated')
//                 } else {
//                     toast.error(data?.data?.message || 'Invalid BVN')
//                 }
//             },
//             onError: () => {
//                 toast.error('An error occurred while validating BVN')
//             }
//         })
//     }

//     const onSubmit = (data: DirectorInfoFormData) => {
//         saveDirectorMutation.mutate(data)
//     }

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <Button className="w-full bg-accent hover:bg-accent/50 text-white flex items-center gap-2">
//                     <Plus className="h-4 w-4" />
//                     Add Director Info
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95%]">
//                 <DialogHeader>
//                     <DialogTitle>Director Information</DialogTitle>
//                     <DialogDescription>
//                         Add details for a company director.
//                     </DialogDescription>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
//                     {/* BVN - First for validation flow */}
//                     <div className="space-y-2">
//                         <Label htmlFor="bvn">BVN (Bank Verification Number)</Label>
//                         <div className="flex gap-2">
//                             <Input
//                                 id="bvn"
//                                 {...register("bvn", {
//                                     required: "BVN is required",
//                                     minLength: { value: 11, message: "BVN must be 11 digits" },
//                                     maxLength: { value: 11, message: "BVN must be 11 digits" }
//                                 })}
//                                 placeholder="Enter 11-digit BVN"
//                                 onBlur={(e) => validateBvn(e.target.value)}
//                             />
//                             {getBvnInfo.isPending && <Loader2 className="h-10 w-10 animate-spin text-teal-600 p-2" />}
//                         </div>
//                         {errors.bvn && <p className="text-red-500 text-xs">{errors.bvn.message}</p>}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="title">Title</Label>
//                             <Input id="title" {...register("title", { required: "Title is required" })} placeholder="Mr/Mrs/Ms" />
//                             {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="firstName">First Name</Label>
//                             <Input id="firstName" {...register("firstName", { required: "First Name is required" })} placeholder="First Name" />
//                             {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="lastName">Last Name</Label>
//                             <Input id="lastName" {...register("lastName", { required: "Last Name is required" })} placeholder="Last Name" />
//                             {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="email">Email</Label>
//                             <Input id="email" type="email" {...register("email", { required: "Email is required" })} placeholder="director@company.com" />
//                             {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="mobileNo">Mobile Number</Label>
//                             <Input id="mobileNo" {...register("mobileNo", { required: "Mobile Number is required" })} placeholder="080..." />
//                             {errors.mobileNo && <p className="text-red-500 text-xs">{errors.mobileNo.message}</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="nin">NIN</Label>
//                             <Input id="nin" {...register("nin", { required: "NIN is required" })} placeholder="National Identity Number" />
//                             {errors.nin && <p className="text-red-500 text-xs">{errors.nin.message}</p>}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="dateOfBirth">Date of Birth</Label>
//                             <Input id="dateOfBirth" type="date" {...register("dateOfBirth", { required: "DOB is required" })} />
//                             {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth.message}</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="holdingShare">Holding Share (%)</Label>
//                             <Input
//                                 id="holdingShare"
//                                 type="number"
//                                 {...register("holdingShare", {
//                                     required: "Required",
//                                     valueAsNumber: true,
//                                     min: 0,
//                                     max: 100
//                                 })}
//                                 placeholder="50"
//                             />
//                             {errors.holdingShare && <p className="text-red-500 text-xs">{errors.holdingShare.message}</p>}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="countryOfResidence">Country of Residence</Label>
//                             <Input id="countryOfResidence" {...register("countryOfResidence", { required: "Required" })} placeholder="Nigeria" />
//                             {errors.countryOfResidence && <p className="text-red-500 text-xs">{errors.countryOfResidence.message}</p>}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="nationality">Nationality</Label>
//                             <Input id="nationality" {...register("nationality", { required: "Required" })} placeholder="Nigerian" />
//                             {errors.nationality && <p className="text-red-500 text-xs">{errors.nationality.message}</p>}
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="address">Address</Label>
//                         <Textarea id="address" {...register("address", { required: "Address is required" })} placeholder="Full residential address" />
//                         {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
//                     </div>

//                     <div className="pt-4 flex justify-end gap-3">
//                         <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
//                         <Button type="submit" className="bg-accent hover:bg-accent/50" disabled={saveDirectorMutation.isPending}>
//                             {saveDirectorMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                             Save Director
//                         </Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useGetBvnInfo } from "@/hooks/useGetBvnInfo"
import axiosInstance from "@/utils/fetch-function"
import { useMutation } from "@tanstack/react-query"
import { Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface DirectorInfoFormData {
    title: string
    firstName: string
    lastName: string
    email: string
    mobileNo: string
    bvn: string
    nin: string
    dateOfBirth: string
    holdingShare: number
    countryOfResidence: string
    nationality: string
    address: string
}

export function DirectorInfoModal() {
    const [open, setOpen] = useState(false)
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DirectorInfoFormData>()
    const getBvnInfo = useGetBvnInfo()
    const bvn = watch('bvn')

    const saveDirectorMutation = useMutation({
        mutationFn: async (data: DirectorInfoFormData) => {
            return axiosInstance?.request({
                url: '/company-director/save',
                method: 'POST',
                data: {
                    ...data,
                    id: 0,
                }
            });
        },
        onSuccess: (response) => {
            if (response?.data?.desc?.includes('SUCCESS')) {
                toast.success(response?.data?.desc || "Director info saved successfully")
                setOpen(false)
            } else {
                toast.error(response?.data?.desc || "Failed to save director info")
            }
        },
        onError: () => {
            toast.error("An error occurred while saving information")
        }
    })

    const validateBvn = (currentBvn: string) => {
        if (!currentBvn || currentBvn.length !== 11) return

        getBvnInfo.mutate(currentBvn, {
            onSuccess: (data) => {
                if (data?.data?.responseCode === '000') {
                    setValue('firstName', data?.data?.firstname)
                    setValue('lastName', data?.data?.lastname)
                    setValue('dateOfBirth', data?.data?.birthdate)
                    setValue('mobileNo', data?.data?.phone)
                    toast.success(data?.data?.message || 'BVN Validated')
                } else {
                    toast.error(data?.data?.message || 'Invalid BVN')
                }
            },
            onError: () => {
                toast.error('An error occurred while validating BVN')
            }
        })
    }

    const onSubmit = (data: DirectorInfoFormData) => {
        saveDirectorMutation.mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Director Info
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0 w-[95%]">
                <DialogTitle className="sr-only">Director Information</DialogTitle>
                <div className="px-6 pt-5 pb-2">
                    <h2 className="text-base font-bold text-dark-gray">Director Information</h2>
                    <p className="text-xs text-medium-gray mt-0.5">Add details for a company director.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="bg-white rounded-2xl p-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="bvn" className="text-xs font-medium text-dark-gray">BVN (Bank Verification Number)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="bvn"
                                    {...register("bvn", {
                                        required: "BVN is required",
                                        minLength: { value: 11, message: "BVN must be 11 digits" },
                                        maxLength: { value: 11, message: "BVN must be 11 digits" }
                                    })}
                                    placeholder="Enter 11-digit BVN"
                                    onBlur={(e) => validateBvn(e.target.value)}
                                />
                                {getBvnInfo.isPending && <Loader2 className="h-10 w-10 animate-spin text-faded-accent p-2" />}
                            </div>
                            {errors.bvn && <p className="text-red-500 text-xs">{errors.bvn.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-medium text-dark-gray">Title</Label>
                                <Input id="title" {...register("title", { required: "Title is required" })} placeholder="Mr/Mrs/Ms" />
                                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-xs font-medium text-dark-gray">First Name</Label>
                                <Input id="firstName" {...register("firstName", { required: "First Name is required" })} placeholder="First Name" />
                                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-xs font-medium text-dark-gray">Last Name</Label>
                                <Input id="lastName" {...register("lastName", { required: "Last Name is required" })} placeholder="Last Name" />
                                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-medium text-dark-gray">Email</Label>
                                <Input id="email" type="email" {...register("email", { required: "Email is required" })} placeholder="director@company.com" />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobileNo" className="text-xs font-medium text-dark-gray">Mobile Number</Label>
                                <Input id="mobileNo" {...register("mobileNo", { required: "Mobile Number is required" })} placeholder="080..." />
                                {errors.mobileNo && <p className="text-red-500 text-xs">{errors.mobileNo.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nin" className="text-xs font-medium text-dark-gray">NIN</Label>
                                <Input id="nin" {...register("nin", { required: "NIN is required" })} placeholder="National Identity Number" />
                                {errors.nin && <p className="text-red-500 text-xs">{errors.nin.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth" className="text-xs font-medium text-dark-gray">Date of Birth</Label>
                                <Input id="dateOfBirth" type="date" {...register("dateOfBirth", { required: "DOB is required" })} />
                                {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="holdingShare" className="text-xs font-medium text-dark-gray">Holding Share (%)</Label>
                                <Input id="holdingShare" type="number" {...register("holdingShare", { required: "Required", valueAsNumber: true, min: 0, max: 100 })} placeholder="50" />
                                {errors.holdingShare && <p className="text-red-500 text-xs">{errors.holdingShare.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="countryOfResidence" className="text-xs font-medium text-dark-gray">Country of Residence</Label>
                                <Input id="countryOfResidence" {...register("countryOfResidence", { required: "Required" })} placeholder="Nigeria" />
                                {errors.countryOfResidence && <p className="text-red-500 text-xs">{errors.countryOfResidence.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nationality" className="text-xs font-medium text-dark-gray">Nationality</Label>
                                <Input id="nationality" {...register("nationality", { required: "Required" })} placeholder="Nigerian" />
                                {errors.nationality && <p className="text-red-500 text-xs">{errors.nationality.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-xs font-medium text-dark-gray">Address</Label>
                            <Textarea id="address" {...register("address", { required: "Address is required" })} placeholder="Full residential address" />
                            {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-1">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button type="submit" className="rounded-xl" disabled={saveDirectorMutation.isPending}>
                            {saveDirectorMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Director
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
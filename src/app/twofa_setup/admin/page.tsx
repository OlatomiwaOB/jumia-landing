// 'use client'


// import { OtpVerification } from '@/components/twofa_setup/admin/otp-verification'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import useUser from '@/store/userStore'
// import { logout } from '@/utils/auth-utils'

// import { BUSINESS_MANAGER } from '@/utils/constants'
// import PrivateRoute from '@/utils/private-route'


// import { ArrowLeft } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import React, { useEffect } from 'react'
// import QRCode from 'react-qr-code'

// const TwoFaSetupPage = () => {
//     const {user} = useUser()
//     const {replace} = useRouter()
//     // console.log(user);
    
//     useEffect(()=>{
//         document.title = 'Two Factor Authentication Setup'
//     },[])

//     useEffect(()=>{
//         if (user?.twoFaSetupRequired === 'N') {
//         replace(`/admin`)
//         return
//     }
//     },[])
//   return (
//     <PrivateRoute requiredPermissions={[BUSINESS_MANAGER]}>
//         <div className='min-h-screen flex items-center justify-center'>
//             <Card className='w-[min(100%,500px)]'>
//                 <CardHeader>
//                     <div className='flex items-center gap-1'>
//                         <button onClick={logout}>
//                         <ArrowLeft/>
//                     </button>
//                     <CardTitle className=''>Two-Factor Authentication</CardTitle>
//                     </div>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                     <div className='space-y-2'>
//                         <h3 className='font-semibold'>Setup two-factor authentication</h3>
//                         <p className='text-[14px]'>To be able to authorize transactions and perform some secured operations you need to scan this QR Code with your Google Authentication App and enter the verification code below.</p>
//                         <p className='font-bold text-[14px]'>NB: This session expires in 15 minutes.</p>
//                     </div>


//                     <div className='space-y-2'>
//                         <OtpVerification/>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     </PrivateRoute>
//   )
// }

// export default TwoFaSetupPage
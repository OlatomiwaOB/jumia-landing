'use client'
import { SignInForm } from '@/components/Rider/SignInForm'
import Loader from '@/components/ui/loader';
import { getAuthCredentials } from '@/utils/auth-utils-riders';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useRider from '@/store/ridersStore';

const RiderLogin = () => {
  const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    const {rider} = useRider()

    // console.log(rider);

    useEffect(()=>{
      document.title = 'Rider login'
    },[])
    
    useEffect(() => {
        const { token, permissions } = getAuthCredentials();
        const isUserAuthenticated = !!token && Array.isArray(permissions) && permissions.length > 0;
        
        // console.log('Auth check:', { token, permissions, isUserAuthenticated });
        
        if (isUserAuthenticated) {
            router.replace('/rider/dashboard');
        } else {
            setIsChecking(false);
        }
    }, [router]);

    if (isChecking) {
        return (
            <Loader text='loading'/>
        );
    }

  return (
    <SignInForm/>
  )
}

export default RiderLogin
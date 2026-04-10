'use client'
import { SignInForm } from '@/components/Operations/SignInForm'
import Loader from '@/components/ui/loader';
import { getAuthCredentials } from '@/utils/auth-utils-operations';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useOperations from '@/store/operationsStore';

const AdminLogin = () => {
  const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    const {operations} = useOperations()

    // console.log(operations);

    useEffect(()=>{
      document.title = 'Operations login'
    },[])
    
    useEffect(() => {
        const { token, permissions } = getAuthCredentials();
        const isUserAuthenticated = !!token && Array.isArray(permissions) && permissions.length > 0;
        
        // console.log('Auth check:', { token, permissions, isUserAuthenticated });
        
        if (isUserAuthenticated) {
            router.replace('/operations/dashboard');
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

export default AdminLogin
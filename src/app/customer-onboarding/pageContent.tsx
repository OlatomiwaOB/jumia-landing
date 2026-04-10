'use client'

import { SignUpForm } from "@/components/Customer/SignUpForm";
import Loader from "@/components/ui/loader";
import { getAuthCredentials } from "@/utils/auth-utils-customer";

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function SignUp() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Check authentication status after component mounts
        const { token, permissions } = getAuthCredentials();
        const isUserAuthenticated = !!token && Array.isArray(permissions) && permissions.length > 0;
        
        // console.log('Auth check:', { token, permissions, isUserAuthenticated });
        
        if (isUserAuthenticated) {
            router.replace('/dashboard');
        } else {
            // User is not authenticated, show login form
            setIsChecking(false);
        }
    }, [router]);

    // Show loading state while checking authentication
    if (isChecking) {
        return (
            <Loader text="loading"/>
        );
    }

    // User is not authenticated, show login form
    return (
        <div className="min-h-screen bg-white">
            <SignUpForm />
        </div>
    );
}
'use client'
import React, { useEffect, useState } from 'react';
import { getAuthCredentials, hasAccess } from './auth-utils';
import Loader from '@/components/ui/loader';
import AccessDeniedPage from '@/components/common/access-denied';
import { usePathname, useRouter } from 'next/navigation';

// Define proper TypeScript interfaces
interface PrivateRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  fallbackPath?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredPermissions = [],
  fallbackPath = '/admin-login',
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { token, permissions } = getAuthCredentials();
  const pathname = usePathname();
  // console.log(permissions);

  // console.log(token);
  
  
  
  const isAuthenticated = !!token;
  const hasRequiredPermission = requiredPermissions.length === 0 || 
    (Array.isArray(permissions) && 
     permissions.length > 0 && 
     hasAccess(requiredPermissions, permissions));

  useEffect(() => {
    if (!isAuthenticated) {
      // Include current path as returnUrl parameter
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`${fallbackPath}?returnUrl=${returnUrl}`);
      return;
    }
    
    // Add a small delay to prevent flash of loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router, fallbackPath]);

  // Show loader while checking authentication or during redirect
  if (!isAuthenticated || isLoading) {
    return <Loader text='Loading...' />;
  }

  // User is authenticated but doesn't have required permissions
  if (!hasRequiredPermission) {
    return <AccessDeniedPage />;
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default PrivateRoute;
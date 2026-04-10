'use client'
import React, { useEffect, useState } from 'react';
import Loader from '@/components/ui/loader';
import AccessDeniedPage from '@/components/common/access-denied';
import { useRouter, usePathname } from 'next/navigation';
import { 
  getAuthCredentials, 
  hasAccess 
} from './auth-utils-operations';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  fallbackPath?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredPermissions = [],
  fallbackPath = '/operations-login',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const { token, permissions } = getAuthCredentials();
  
  const isAuthenticated = !!token;
  const hasRequiredPermission = requiredPermissions.length === 0 || 
    (Array.isArray(permissions) && 
     permissions.length > 0 && 
     hasAccess(requiredPermissions, permissions));

  useEffect(() => {
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`${fallbackPath}?returnUrl=${returnUrl}`);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router, fallbackPath, pathname]);

  if (!isAuthenticated || isLoading) {
    return <Loader text='Verifying Operations Access...' />;
  }

  if (!hasRequiredPermission) {
    return (
      <AccessDeniedPage />
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/ui/loader';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions: string | string[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
  redirectTo?: string;
  showToast?: boolean;
  toastMessage?: string;
  redirectToNotPermitted?: boolean;
}

export const PermissionGuard = ({
  children,
  permissions,
  fallback = null,
  requireAll = false,
  redirectTo = '/operations/dashboard',
  showToast = true,
  toastMessage = "You don't have permission to access this page",
  redirectToNotPermitted = false
}: PermissionGuardProps) => {
  const { hasAnyPermission, hasAllPermissions, userPermissions } = usePermission();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const hasShownToast = useRef(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    const permissionList = Array.isArray(permissions) ? permissions : [permissions];
    
    let access = false;
    if (requireAll) {
      access = hasAllPermissions(permissionList);
    } else {
      access = hasAnyPermission(permissionList);
    }
    
    setHasAccess(access);
    setIsChecking(false);
    
    if (!access) {
      if (showToast && !hasShownToast.current) {
        hasShownToast.current = true;
        toast.error(toastMessage);
      }

      if (!hasRedirected.current) {
        hasRedirected.current = true;
        
        if (redirectToNotPermitted) {
          const pathname = window.location.pathname;
          const pageName = pathname.split('/').pop() || 'this';
          router.push(`/operations/not-permitted?page=${encodeURIComponent(pageName)}`);
        } else {
          router.push(redirectTo);
        }
      }
    }
  }, [permissions, requireAll, redirectTo, showToast, toastMessage, redirectToNotPermitted]);

  if (isChecking) {
    return <LoadingSpinner text='Checking permission'/>;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
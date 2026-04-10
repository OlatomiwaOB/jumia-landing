'use client';

import useOperations from '@/store/operationsStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface PermissionCheckOptions {
  redirectTo?: string;
  showToast?: boolean;
  toastMessage?: string;
  redirectToNotPermitted?: boolean;
}

export const usePermission = () => {
  const { operations } = useOperations();
  const router = useRouter();
  const pathname = usePathname();
  
  const userPermissions = operations?.userPermissions || [];

  const hasPermission = (permissionCode: string): boolean => {
    return userPermissions.includes(permissionCode);
  };

  const hasAnyPermission = (permissionCodes: string[]): boolean => {
    return permissionCodes.some(code => userPermissions.includes(code));
  };

  const hasAllPermissions = (permissionCodes: string[]): boolean => {
    return permissionCodes.every(code => userPermissions.includes(code));
  };

  const usePermissionGuard = (
    requiredPermissions: string | string[],
    options: PermissionCheckOptions = {}
  ) => {
    const {
      redirectTo = '/operations/not-permitted',
      showToast = true,
      toastMessage = "You don't have permission to access this page",
      redirectToNotPermitted = true
    } = options;

    const hasShownToast = useRef(false);
    const hasRedirected = useRef(false);

    useEffect(() => {
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];
      
      const hasAccess = hasAnyPermission(permissions);
      
      if (!hasAccess) {
        if (showToast && !hasShownToast.current) {
          hasShownToast.current = true;
          toast.error(toastMessage);
        }

        if (!hasRedirected.current) {
          hasRedirected.current = true;
          
          if (redirectToNotPermitted) {
            const pageName = pathname.split('/').pop() || 'this';
            router.push(`/operations/not-permitted?page=${encodeURIComponent(pageName)}`);
          } else {
            router.push(redirectTo);
          }
        }
      }
    }, [requiredPermissions, redirectTo, showToast, toastMessage, redirectToNotPermitted, pathname, router]);
  };

  const PermissionGuard = ({
    children,
    permissions,
    fallback = null,
    requireAll = false
  }: {
    children: React.ReactNode;
    permissions: string | string[];
    fallback?: React.ReactNode;
    requireAll?: boolean;
  }) => {
    const permissionList = Array.isArray(permissions) ? permissions : [permissions];
    
    let hasAccess = false;
    if (requireAll) {
      hasAccess = hasAllPermissions(permissionList);
    } else {
      hasAccess = hasAnyPermission(permissionList);
    }
    
    return hasAccess ? <>{children}</> : <>{fallback}</>;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    usePermissionGuard,
    PermissionGuard,
    userPermissions
  };
};
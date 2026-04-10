'use client';

import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { usePermission } from '@/hooks/usePermission';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type ButtonProps = React.ComponentProps<typeof Button>;

interface PermissionButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  variant?: React.ComponentProps<typeof Button>['variant'];
  size?: React.ComponentProps<typeof Button>['size'];
  asChild?: boolean;
  type?: 'button' | 'submit' | 'reset';

  requiredPermissions: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  tooltipMessage?: string;
  showTooltip?: boolean;
  children: React.ReactNode;
  hideIfNoPermission?: boolean;

  [key: string]: any;
}

export const PermissionButton = ({
  requiredPermissions,
  requireAll = false,
  fallback = null,
  tooltipMessage = "You don't have permission to perform this action",
  showTooltip = true,
  hideIfNoPermission = true,
  children,
  onClick,
  disabled,
  className,
  variant,
  size,
  asChild,
  ...buttonProps
}: PermissionButtonProps) => {
  const { hasAnyPermission, hasAllPermissions } = usePermission();
  
  const permissionList = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];
  
  let hasPermission = false;
  if (requireAll) {
    hasPermission = hasAllPermissions(permissionList);
  } else {
    hasPermission = hasAnyPermission(permissionList);
  }

  if (!hasPermission) {
    if (hideIfNoPermission) {
      return fallback ? <>{fallback}</> : null;
    } else {

      const disabledButton = (
        <Button
          disabled={true}
          variant={variant}
          size={size}
          asChild={asChild}
          className={cn(className, 'cursor-not-allowed opacity-50')}
          {...buttonProps}
        >
          {children}
        </Button>
      );
      
      if (showTooltip) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  {disabledButton}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      
      return disabledButton;
    }
  }
  
  const enabledButton = (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      size={size}
      asChild={asChild}
      className={className}
      {...buttonProps}
    >
      {children}
    </Button>
  );

  if (disabled && showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">
              {enabledButton}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return enabledButton;
};
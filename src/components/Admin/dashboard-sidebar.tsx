'use client'

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { clientConfig } from '@/config/client-config';
import { ClientFeatureFlags } from '@/config/client-config.types';
import { usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarBase } from '@/components/common/sidebar-base';
import { useSidebar } from '@/components/common/sidebar-context';
import { usePermission } from '@/hooks/usePermissionBusiness';
import {
  HomeIcon,
  HomeIconFilled2,
  OrderIcon,
  OrderIconFilled2,
  ArrowIcon,
  ProfileIcon,
  ProfileIconFilled,
  CubeIcon,
  CubeIconFilled,
  CreditIcon,
  CreditIconFilled,
  ReportIcon,
  ReportIconFilled,
  ComplianceIcon,
  ComplianceIconFilled,
  SettingIcon,
  SettingIconFilled,
} from '@/components/icons/icons';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { logout } from '@/utils/auth-utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  href: string;
  requiredPermissions?: string[];
  requiredFeatures?: (keyof ClientFeatureFlags)[];
}

interface NavGroup {
  name: string;
  icon: any;
  activeIcon?: any;
  href?: string;
  items: NavItem[];
  requiredPermissions?: string[];
  requiredFeatures?: (keyof ClientFeatureFlags)[];
}

const navigationGroups: NavGroup[] = [
  {
    name: 'Dashboard',
    icon: HomeIcon,
    activeIcon: HomeIconFilled2,
    requiredPermissions: ['VIEW_DASHBOARD'],
    items: []
  },
  {
    name: 'Order & Transaction Mgt.',
    icon: CubeIcon,
    activeIcon: CubeIconFilled,
    requiredPermissions: ['VIEW_ORDERS', 'CAN_VIEW_TRANS'],
    items: [
      { name: 'Orders', href: '/admin/orders', requiredPermissions: ['VIEW_ORDERS'] },
      { name: 'Transactions', href: '/admin/transactions', requiredPermissions: ['CAN_VIEW_TRANS'] },
    ]
  },
  {
    name: 'Store & Inventory Mgt.',
    icon: OrderIcon,
    activeIcon: OrderIconFilled2,
    requiredPermissions: ['VIEW_INVENTORY', 'MANAGE_STORES', 'MANAGE_STORE_SETTINGS'],
    items: [
      { name: 'Inventories', href: '/admin/inventories', requiredPermissions: ['VIEW_INVENTORY'] },
      { name: 'Stores', href: '/admin/stores', requiredPermissions: ['MANAGE_STORES'] },
    ]
  },
  {
    name: 'Delivery Mgt.',
    icon: CubeIcon,
    activeIcon: CubeIconFilled,
    requiredPermissions: ['MANAGE_DELIVERY_OPTIONS', 'MANAGE_PICKUP_LOCATIONS'],
    items: [
      { name: 'Delivery Options', href: '/admin/delivery-options', requiredPermissions: ['MANAGE_DELIVERY_OPTIONS'] },
      { name: 'Pickup Locations', href: '/admin/pickup-locations', requiredPermissions: ['MANAGE_PICKUP_LOCATIONS'], requiredFeatures: ['enablePickupLocation'] },
    ]
  },
  {
    name: 'User & Customer Mgt.',
    icon: ProfileIcon,
    activeIcon: ProfileIconFilled,
    requiredPermissions: ['MANAGE_USERS', 'MANAGE_BNPL'],
    items: [
      { name: 'Users', href: '/admin/users', requiredPermissions: ['MANAGE_USERS'] },
      { name: 'BNPL Customers', href: '/admin/bnpl-customers', requiredPermissions: ['MANAGE_BNPL'] },
    ]
  },
  {
    name: 'Compliance',
    icon: ComplianceIcon,
    activeIcon: ComplianceIconFilled,
    requiredPermissions: ['VIEW_KYC'],
    items: [
      { name: 'KYC Documents', href: '/admin/kyc-documents', requiredPermissions: ['VIEW_KYC'] },
    ]
  },
  {
    name: 'Payment Mgt.',
    icon: CreditIcon,
    activeIcon: CreditIconFilled,
    requiredPermissions: ['MANAGE_PAYMENT_METHODS'],
    items: [
      { name: 'Bank Accounts', href: '/admin/bank-accounts', requiredPermissions: ['MANAGE_PAYMENT_METHODS'] },
      { name: 'Send Money', href: '/admin/send-money', requiredPermissions: ['MANAGE_PAYMENT_METHODS'] },
      { name: 'Payment Methods', href: '/admin/payment-methods', requiredPermissions: ['MANAGE_PAYMENT_METHODS'] },
    ]
  },
  {
    name: 'Reports & Analytics',
    icon: ReportIcon,
    activeIcon: ReportIconFilled,
    requiredPermissions: ['CAN_VIEW_REPORTS'],
    items: [
      { name: 'Reports', href: '/admin/reports', requiredPermissions: ['CAN_VIEW_REPORTS'] },
    ]
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: SettingIcon,
    requiredPermissions: ['MANAGE_STORE_SETTINGS'],
    activeIcon: SettingIconFilled,
    items: []
  },
];

const isPathMatchingItem = (pathname: string, itemHref: string): boolean => {
  if (pathname === itemHref) return true;
  if (pathname.startsWith(itemHref + '/')) return true;
  return false;
};

const isGroupActive = (group: NavGroup, pathname: string, accessibleItems: NavItem[]): boolean => {
  if (group.items.length === 0 && isPathMatchingItem(pathname, '/admin/dashboard')) return pathname === '/admin/dashboard';
  if (group.href && isPathMatchingItem(pathname, group.href)) return true;
  return accessibleItems.some(item => isPathMatchingItem(pathname, item.href));
};

interface SidebarGroupProps {
  group: NavGroup;
  pathname: string;
  hasGroupAccess: boolean;
  userPermissions: string[];
}

const SidebarGroup = ({ group, pathname, hasGroupAccess, userPermissions }: SidebarGroupProps) => {
  const { collapsed } = useSidebar();
  const accessibleItems = useMemo(() => {
    return group.items.filter(item => {
      if (item.requiredFeatures) {
        const hasFeatures = item.requiredFeatures.every(feat => clientConfig().features[feat]);
        if (!hasFeatures) return false;
      }
      if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
        return true;
      }
      return item.requiredPermissions.some(permission => userPermissions.includes(permission));
    });
  }, [group.items, userPermissions]);

  const hasActiveChild = isGroupActive(group, pathname, accessibleItems);
  const [isOpen, setIsOpen] = useState(hasActiveChild);
  const hasItems = accessibleItems.length > 0;

  if (!hasItems && group.items.length > 0) {
    return null;
  }

  if (group.requiredPermissions && group.requiredPermissions.length > 0 && !hasGroupAccess) {
    return null;
  }

  if (!hasItems && (group.href || group.items.length === 0)) {
    const isActive = group.href ? isPathMatchingItem(pathname, group.href) : isPathMatchingItem(pathname, '/admin/dashboard');
    const href = group.href || '/admin/dashboard';
    const IconComponent = isActive && group.activeIcon ? group.activeIcon : group.icon;

    return (
      <div className="relative mb-1">
        {isActive && (
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--sidebar-text)] rounded-r-full" />
        )}
        <Link
          href={href}
          title={collapsed ? group.name : undefined}
          className={cn(
            'flex items-center px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group',
            isActive
              ? 'bg-[var(--sidebar-text)]/10 text-[var(--sidebar-text)] font-medium'
              : 'text-[var(--sidebar-text)]/70 hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-text)]/5',
            collapsed && 'justify-center px-0'
          )}
        >
          <IconComponent
            className="w-5 h-5 flex-shrink-0 text-[var(--sidebar-text)]"
            fill="var(--sidebar-text)"
          />
          {!collapsed && <span className="ml-3 truncate">{group.name}</span>}
        </Link>
      </div>
    );
  }

  const IconComponent = hasActiveChild && group.activeIcon ? group.activeIcon : group.icon;

  if (collapsed) {
    return (
      <div className="relative mb-1">
        {hasActiveChild && (
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--sidebar-text)] rounded-r-full" />
        )}
        <div
          title={group.name}
          className={cn(
            'flex items-center justify-center py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer',
            hasActiveChild
              ? 'bg-[var(--sidebar-text)]/10 text-[var(--sidebar-text)]'
              : 'text-[var(--sidebar-text)]/70 hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-text)]/5'
          )}
        >
          <IconComponent className="w-5 h-5 flex-shrink-0 text-[var(--sidebar-text)]" />
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-1">
      <CollapsibleTrigger className="w-full">
        <div className={cn(
          'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group',
          hasActiveChild
            ? 'text-[var(--sidebar-text)] font-medium'
            : 'text-[var(--sidebar-text)]/70 hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-text)]/5'
        )}>
          <div className="flex items-center min-w-0 flex-1">
            <IconComponent className="w-5 h-5 flex-shrink-0 text-[var(--sidebar-text)]" />
            <span className={cn("ml-3 truncate", hasActiveChild && "text-[var(--sidebar-text)] font-medium")}>{group.name}</span>
          </div>
          <ArrowIcon
            className={cn(
              "w-3 h-3 rotate-270 flex-shrink-0 text-[var(--sidebar-text)]/50 transition-transform duration-200",
              isOpen && "rotate-360 text-[var(--sidebar-text)]"
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="relative mt-1">
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-[var(--sidebar-text)]/20" />
          <ul className="py-1 pr-3 space-y-1">
            {accessibleItems.map((item) => {
              const isActive = isPathMatchingItem(pathname, item.href);

              return (
                <li key={item.name} className="relative">
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ml-[34px]',
                      isActive
                        ? 'bg-[var(--sidebar-text)] text-[var(--dashboard-sidebar-color)] font-medium shadow-sm'
                        : 'text-[var(--sidebar-text)]/70 hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-text)]/5'
                    )}
                  >
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const logoUrl = clientConfig().branding.logos.whiteFull;

  const { hasAnyPermission, userPermissions } = usePermission();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const accessibleGroups = useMemo(() => {
    return navigationGroups.filter(group => {
      if (group.requiredFeatures) {
        const hasFeatures = group.requiredFeatures.every(feat => clientConfig().features[feat]);
        if (!hasFeatures) return false;
      }

      if (group.requiredPermissions && group.requiredPermissions.length > 0) {
        const hasGroupAccess = hasAnyPermission(group.requiredPermissions);
        if (!hasGroupAccess) return false;
      }

      if (group.items.length === 0) return true;

      const hasAccessibleItems = group.items.some(item => {
        if (item.requiredFeatures) {
          const hasFeatures = item.requiredFeatures.every(feat => clientConfig().features[feat]);
          if (!hasFeatures) return false;
        }

        if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
          return true;
        }
        return hasAnyPermission(item.requiredPermissions);
      });

      return hasAccessibleItems;
    });
  }, [userPermissions, hasAnyPermission]);

  return (
    <>
      <SidebarBase
        logoUrl={logoUrl || 'logo.png'}
        logoHref="/admin/dashboard"
        onLogoutClick={() => setIsLogoutModalOpen(true)}
      >
        <ul className="space-y-0.5">
          {accessibleGroups.map((group) => (
            <li key={group.name}>
              <SidebarGroup
                group={group}
                pathname={pathname}
                hasGroupAccess={true}
                userPermissions={userPermissions}
              />
            </li>
          ))}
        </ul>
      </SidebarBase>

      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className='flex flex-col gap-2 items-center text-center'>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => { setIsLogoutModalOpen(false); logout(); }}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardSidebar;
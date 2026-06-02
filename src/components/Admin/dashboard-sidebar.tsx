'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePermission } from '@/hooks/usePermissionBusiness';
import useUser from '@/store/userStore';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { logout } from '@/utils/auth-utils';
import { Button } from '@/components/ui/button';
import {
  HomeIcon,
  HomeIconFilled2,
  OrderIcon,
  OrderIconFilled2,
  Logout2Icon,
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

interface NavItem {
  name: string;
  href: string;
  requiredPermissions?: string[];
}

interface NavGroup {
  name: string;
  icon: any;
  activeIcon?: any;
  href?: string;
  items: NavItem[];
  requiredPermissions?: string[];
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
      { name: 'Component Mgt.', href: '/admin/component-management', requiredPermissions: ['VIEW_INVENTORY'] },
      { name: 'Stores', href: '/admin/stores', requiredPermissions: ['MANAGE_STORES'] },
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
    requiredPermissions: ['MANAGE_STORE_SETTINGS', 'VIEW_PROFILE'],
    activeIcon: SettingIconFilled,
    items: []
  },
];

interface SidebarGroupProps {
  group: NavGroup;
  pathname: string;
  hasGroupAccess: boolean;
  userPermissions: string[];
}

const isPathMatchingItem = (pathname: string, itemHref: string): boolean => {
  if (pathname === itemHref) return true;
  if (pathname.startsWith(itemHref + '/')) return true;
  return false;
};

const isGroupActive = (group: NavGroup, pathname: string, accessibleItems: NavItem[]): boolean => {
  if (group.items.length === 0 && isPathMatchingItem(pathname, '/admin/dashboard')) return pathname === '/admin/dashboard';
  return accessibleItems.some(item => isPathMatchingItem(pathname, item.href));
};

const SidebarGroup = ({ group, pathname, hasGroupAccess, userPermissions }: SidebarGroupProps) => {
  const accessibleItems = useMemo(() => {
    return group.items.filter(item => {
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

  if (!hasItems && group.href) {
    const isActive = isPathMatchingItem(pathname, group.href);
    const IconComponent = isActive && group.activeIcon ? group.activeIcon : group.icon;

    return (
      <div className="relative">
        <Link
          href={group.href}
          className={cn(
            'flex items-center gap-2.5 px-4 py-3 rounded-lg text-sidebar-text hover:text-white hover:bg-white/10 transition-all duration-200 text-[12px]',
            isActive && 'bg-white text-faded-accent font-medium'
          )}
        >
          <IconComponent className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium truncate">{group.name}</span>
        </Link>
      </div>
    );
  }

  if (!hasItems && group.items.length === 0) {
    const isActive = isPathMatchingItem(pathname, '/admin/dashboard');
    const IconComponent = isActive && group.activeIcon ? group.activeIcon : group.icon;

    return (
      <div className="relative">
        <Link
          href="/admin/dashboard"
          className={cn(
            'flex items-center gap-2.5 px-4 py-3 rounded-lg text-sidebar-text hover:text-white hover:bg-white/10 transition-all duration-200 text-[12px]',
            isActive && 'bg-white text-faded-accent font-medium'
          )}
        >
          <IconComponent className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium truncate">{group.name}</span>
        </Link>
      </div>
    );
  }

  const IconComponent = hasActiveChild && group.activeIcon ? group.activeIcon : group.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className={cn(
          'flex items-center justify-between gap-2 px-4 py-3 rounded-lg text-sidebar-text hover:text-white hover:bg-white/10 transition-all duration-200 text-xs w-full',
          hasActiveChild && 'bg-white text-faded-accent'
        )}>
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <IconComponent className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium truncate">{group.name}</span>
          </div>
          <ArrowIcon
            className={cn(
              "w-3 h-3 rotate-270 flex-shrink-0 text-sidebar-text transition-transform duration-200",
              isOpen && "rotate-360 text-faded-accent"
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="relative">
          <div className="absolute left-[20px] top-2 bottom-2 w-0.5 bg-[#EA813C]" />
          <ul className="py-2 pr-6 space-y-1">
            {accessibleItems.map((item) => {
              const isActive = isPathMatchingItem(pathname, item.href);

              return (
                <li key={item.name} className="relative">
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 px-4 py-3 rounded-lg text-sidebar-text hover:text-white hover:bg-white/10 transition-all duration-200 text-xs ml-7',
                      isActive && 'bg-[#EA813C] text-white font-medium'
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
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL_WHITE_FULL;
  const { user } = useUser();
  const { hasAnyPermission, userPermissions } = usePermission();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const accessibleGroups = useMemo(() => {
    return navigationGroups.filter(group => {
      if (group.requiredPermissions && group.requiredPermissions.length > 0) {
        const hasGroupAccess = hasAnyPermission(group.requiredPermissions);
        if (!hasGroupAccess) return false;
      }

      if (group.items.length === 0) return true;

      const hasAccessibleItems = group.items.some(item => {
        if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
          return true;
        }
        return hasAnyPermission(item.requiredPermissions);
      });

      return hasAccessibleItems;
    });
  }, [userPermissions, hasAnyPermission]);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <div
        className="w-full h-full flex flex-col bg-accent"
      // style={{
      //   background: `
      //     radial-gradient(ellipse at 75% 70%, rgba(255,160,60,0.45) 0%, transparent 55%),
      //     linear-gradient(180deg, #F56B08 0%, #D4580A 40%, #AE4F12 70%, #A83E00 100%)
      //   `,
      // }}
      >
        <div className="py-6 px-3 border-b-2 border-[#EA813C]">
          <div className="flex items-center justify-start">
            <Link href="/admin/dashboard" className="relative w-[120px] h-[70px] rounded-sm">
              <Image
                src={logoUrl || 'logo.png'}
                alt='logo'
                fill
                className='object-fill rounded-sm'
                priority
              />
            </Link>
          </div>
        </div>

        <nav
          className="flex-1 py-4 px-2 overflow-y-auto w-full"
          style={{
            scrollbarWidth: 'none',
            scrollbarColor: 'transparent',
          }}
        >
          <ul className="space-y-0.5 px-1">
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
        </nav>

        <div
          onClick={handleLogoutClick}
          className="flex items-center gap-2.5 text-white px-4 py-3 rounded-lg border border-[#BA6D3F] mx-4 mb-4 cursor-pointer hover:bg-white/10 transition-colors"
        >
          <Logout2Icon className="text-white/70 w-4 h-4" />
          <span className="text-xs font-bold">Logout</span>
        </div>
      </div>

      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className='flex flex-col gap-2 items-center text-center'>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={handleCancelLogout}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmLogout}
            >
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
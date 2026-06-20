'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarBase } from '@/components/common/sidebar-base';
import { useSidebar } from '@/components/common/sidebar-context';
import { usePermission } from '@/hooks/usePermission';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { logout } from '@/utils/auth-utils-operations';
import { Button } from '@/components/ui/button';
import {
  HomeIcon,
  HomeIconFilled2,
  OrderIcon,
  OrderIconFilled2,
  ArrowIcon,
  TransactionIcon,
  TransactionIconFilled,
  CreditIcon,
  CreditIconFilled,
  ReportIcon,
  ReportIconFilled,
  SettingIcon,
  SettingIconFilled,
  ProfileIcon,
  ProfileIconFilled,
  CubeIcon,
  CubeIconFilled,
} from '@/components/icons/icons';

interface NavItem {
  name: string;
  href: string;
  matchExact?: boolean;
  requiredPermissions?: string[];
}

interface NavGroup {
  name: string;
  icon: any;
  activeIcon?: any;
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
    name: 'User & Access Mgt.',
    icon: ProfileIcon,
    activeIcon: ProfileIconFilled,
    requiredPermissions: ['VIEW_MERCHANTS', 'VIEW_USERS', 'VIEW_RIDERS', 'CAN_APPROVE', 'MANAGE_ROLES'],
    items: [
      { name: 'Users', href: '/operations/users', requiredPermissions: ['VIEW_USERS'] },
      { name: 'Business', href: '/operations/business', requiredPermissions: ['VIEW_MERCHANTS'] },
      { name: 'Riders', href: '/operations/riders', requiredPermissions: ['VIEW_RIDERS'] },
      { name: 'Approvals', href: '/operations/approvals', requiredPermissions: ['CAN_APPROVE'] },
      { name: 'Role and Permissions', href: '/operations/roles', requiredPermissions: ['MANAGE_ROLES'] }
    ]
  },
  {
    name: 'Transaction & Payment Mgt.',
    icon: TransactionIcon,
    activeIcon: TransactionIconFilled,
    requiredPermissions: ['CAN_VIEW_TRANS', 'MANAGE_TRANS_TYPE', 'MANAGE_PAYMENT_METHODS'],
    items: [
      { name: 'Transactions', href: '/operations/transactions', requiredPermissions: ['CAN_VIEW_TRANS'] },
      { name: 'Transaction Type', href: '/operations/transaction-type', requiredPermissions: ['MANAGE_TRANS_TYPE'] },
      { name: 'Payment Methods', href: '/operations/payment-methods', requiredPermissions: ['MANAGE_PAYMENT_METHODS'] },
    ]
  },
  {
    name: 'Product & Inventory Mgt.',
    icon: OrderIcon,
    activeIcon: OrderIconFilled2,
    requiredPermissions: ['VIEW_INVENTORY', 'VIEW_BILLERS'],
    items: [
      { name: 'Inventories', href: '/operations/inventories', requiredPermissions: ['VIEW_INVENTORY'] },
      { name: 'Billers', href: '/operations/billers', requiredPermissions: ['VIEW_BILLERS'] },
    ]
  },
  {
    name: 'Order, Delivery & Logistics',
    icon: CubeIcon,
    activeIcon: CubeIconFilled,
    requiredPermissions: ['VIEW_ORDERS', 'MANAGE_DELIVERY_OPTIONS', 'MANAGE_DELIVERY_REQUESTS', 'MANAGE_PICKUP_LOCATIONS'],
    items: [
      { name: 'Orders', href: '/operations/orders', requiredPermissions: ['VIEW_ORDERS'] },
      { name: 'Delivery Options', href: '/operations/delivery-options', requiredPermissions: ['MANAGE_DELIVERY_OPTIONS'] },
      { name: 'Delivery Option Types', href: '/operations/delivery-option-types', requiredPermissions: ['MANAGE_DELIVERY_OPTIONS'] },
      { name: 'Delivery Requests', href: '/operations/delivery-requests', requiredPermissions: ['MANAGE_DELIVERY_REQUESTS'] },
      { name: 'Pickup Locations', href: '/operations/pickup-locations', requiredPermissions: ['MANAGE_PICKUP_LOCATIONS'] },
    ]
  },
  {
    name: 'Financial Mgt.',
    icon: CreditIcon,
    activeIcon: CreditIconFilled,
    requiredPermissions: ['VIEW_SETTLEMENTS', 'MANAGE_SUBS'],
    items: [
      { name: 'Settlements', href: '/operations/settlements', requiredPermissions: ['VIEW_SETTLEMENTS'] },
      { name: 'Subscriptions', href: '/operations/subscriptions', requiredPermissions: ['MANAGE_SUBS'] },
    ]
  },
  {
    name: 'System Configuration',
    icon: SettingIcon,
    activeIcon: SettingIconFilled,
    requiredPermissions: ['MANAGE_LOOKUP', 'MANAGE_MESSAGE_TEMPLATES'],
    items: [
      { name: 'Maker Checker', href: '/operations/maker-checker', requiredPermissions: ['CAN_APPROVE'] },
      { name: 'Lookup Data', href: '/operations/lookup-data', requiredPermissions: ['MANAGE_LOOKUP'] },
      { name: 'Message Templates', href: '/operations/message-templates', requiredPermissions: ['MANAGE_MESSAGE_TEMPLATES'] },
    ]
  },
  {
    name: 'Reporting & Analytics',
    icon: ReportIcon,
    activeIcon: ReportIconFilled,
    requiredPermissions: ['CAN_VIEW_REPORTS'],
    items: [
      { name: 'Reports', href: '/operations/reports', requiredPermissions: ['CAN_VIEW_REPORTS'] },
    ]
  },
];

const isPathMatchingItem = (pathname: string, itemHref: string): boolean => {
  if (pathname === itemHref) return true;
  if (pathname.startsWith(itemHref + '/')) return true;
  return false;
};

const isGroupActive = (group: NavGroup, pathname: string, accessibleItems: NavItem[]): boolean => {
  if (group.items.length === 0 && isPathMatchingItem(pathname, '/operations/dashboard')) return pathname === '/operations/dashboard';
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

  if (!hasItems && group.items.length === 0) {
    const isActive = isPathMatchingItem(pathname, '/operations/dashboard');
    const IconComponent = isActive && group.activeIcon ? group.activeIcon : group.icon;

    return (
      <div className="relative mb-1">
        {isActive && (
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[#EA813C] rounded-r-full" />
        )}
        <Link
          href="/operations/dashboard"
          title={collapsed ? group.name : undefined}
          className={cn(
            'flex items-center px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group',
            isActive
              ? 'bg-[--accent]/10 text-[--accent] font-medium'
              : 'text-white/70 hover:text-white hover:bg-white/10',
            collapsed && 'justify-center px-0'
          )}
        >
          <IconComponent className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-[--accent]" : "text-white/70 group-hover:text-white")} />
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
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[--accent] rounded-r-full" />
        )}
        <div
          title={group.name}
          className={cn(
            'flex items-center justify-center py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer',
            hasActiveChild
              ? 'bg-[--accent]/10 text-[--accent]'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          )}
        >
          <IconComponent className={cn("w-5 h-5 flex-shrink-0", hasActiveChild ? "text-[--accent]" : "")} />
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
            ? 'text-white'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        )}>
          <div className="flex items-center min-w-0 flex-1">
            <IconComponent className={cn("w-5 h-5 flex-shrink-0", hasActiveChild ? "text-[--accent]" : "text-white/70 group-hover:text-white")} />
            <span className={cn("ml-3 font-medium truncate", hasActiveChild && "text-white")}>{group.name}</span>
          </div>
          <ArrowIcon
            className={cn(
              "w-3 h-3 rotate-270 flex-shrink-0 text-white/50 transition-transform duration-200",
              isOpen && "rotate-360 text-white"
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="relative mt-1">
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gray-800" />
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
                        ? 'bg-[#EA813C] text-white font-medium shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
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

  return (
    <>
      <SidebarBase
        logoUrl={logoUrl || 'logo.png'}
        logoHref="/operations/dashboard"
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
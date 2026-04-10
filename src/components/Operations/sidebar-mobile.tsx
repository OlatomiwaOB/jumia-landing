'use client';

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Store,
  ClipboardList,
  PiggyBank,
  User,
  Box,
  Truck,
  Banknote,
  ArrowLeftRight,
  Settings2,
  Users,
  CreditCard,
  Package,
  MapPin,
  BarChart3,
  FileText,
  ChevronDown,
  LucideIcon,
  BadgeCheck,
  ShoppingBasket,
  UserCog2,
  Bike,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePermission } from '@/hooks/usePermission';
import useOperations from '@/store/operationsStore';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  requiredPermissions?: string[];
}

interface NavGroup {
  name: string;
  icon: LucideIcon;
  items: NavItem[];
  requiredPermissions?: string[];
}

const navigationGroups: NavGroup[] = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    requiredPermissions: ['VIEW_DASHBOARD'],
    items: [
      { name: 'Dashboard', href: '/operations/dashboard', icon: LayoutDashboard, requiredPermissions: ['VIEW_DASHBOARD'] },
    ]
  },
  {
    name: 'User & Access Mgt.',
    icon: Users,
    requiredPermissions: ['VIEW_MERCHANTS', 'VIEW_USERS', 'VIEW_RIDERS', 'CAN_APPROVE', 'MANAGE_ROLES'],
    items: [
      { name: 'Users', href: '/operations/users', icon: User, requiredPermissions: ['VIEW_USERS'] },
      { name: 'Business', href: '/operations/business', icon: Store, requiredPermissions: ['VIEW_MERCHANTS'] },
      { name: 'Riders', href: '/operations/riders', icon: Bike, requiredPermissions: ['VIEW_RIDERS'] },
      { name: 'Approvals', href: '/operations/approvals', icon: BadgeCheck, requiredPermissions: ['CAN_APPROVE'] },
      { name: 'Role and Permissions', href: '/operations/roles', icon: UserCog2, requiredPermissions: ['MANAGE_ROLES'] }
    ]
  },
  {
    name: 'Transaction & Payment Mgt.',
    icon: CreditCard,
    requiredPermissions: ['CAN_VIEW_TRANS', 'MANAGE_TRANS_TYPE', 'MANAGE_PAYMENT_METHODS'],
    items: [
      { name: 'Transactions', href: '/operations/transactions', icon: Banknote, requiredPermissions: ['CAN_VIEW_TRANS'] },
      { name: 'Transaction Type', href: '/operations/transaction-type', icon: Settings2, requiredPermissions: ['MANAGE_TRANS_TYPE'] },
      { name: 'Payment Methods', href: '/operations/payment-methods', icon: CreditCard, requiredPermissions: ['MANAGE_PAYMENT_METHODS'] },
    ]
  },
  {
    name: 'Product & Inventory Mgt.',
    icon: Package,
    requiredPermissions: ['VIEW_INVENTORY', 'VIEW_BILLERS'],
    items: [
      { name: 'Inventories', href: '/operations/inventories', icon: ShoppingBasket, requiredPermissions: ['VIEW_INVENTORY'] },
      { name: 'Billers', href: '/operations/billers', icon: Banknote, requiredPermissions: ['VIEW_BILLERS'] },
    ]
  },
  {
    name: 'Order, Delivery & Logistics',
    icon: Truck,
    requiredPermissions: ['VIEW_ORDERS', 'MANAGE_DELIVERY_OPTIONS', 'MANAGE_DELIVERY_REQUESTS', 'MANAGE_PICKUP_LOCATIONS'],
    items: [
      { name: 'Orders', href: '/operations/orders', icon: Clock, requiredPermissions: ['VIEW_ORDERS'] },
      { name: 'Delivery Options', href: '/operations/delivery-options', icon: Box, requiredPermissions: ['MANAGE_DELIVERY_OPTIONS'] },
      { name: 'Delivery Requests', href: '/operations/delivery-requests', icon: Truck, requiredPermissions: ['MANAGE_DELIVERY_REQUESTS'] },
      { name: 'Pickup Locations', href: '/operations/pickup-locations', icon: MapPin, requiredPermissions: ['MANAGE_PICKUP_LOCATIONS'] },
    ]
  },
  {
    name: 'Financial Mgt.',
    icon: PiggyBank,
    requiredPermissions: ['VIEW_SETTLEMENTS', 'MANAGE_SUBS'],
    items: [
      { name: 'Settlements', href: '/operations/settlements', icon: ArrowLeftRight, requiredPermissions: ['VIEW_SETTLEMENTS'] },
      { name: 'Subscriptions', href: '/operations/subscriptions', icon: PiggyBank, requiredPermissions: ['MANAGE_SUBS'] },
    ]
  },
  {
    name: 'System Configuration',
    icon: Settings2,
    requiredPermissions: ['MANAGE_LOOKUP', 'MANAGE_MESSAGE_TEMPLATES'],
    items: [
      { name: 'Lookup Data', href: '/operations/lookup-data', icon: FileText, requiredPermissions: ['MANAGE_LOOKUP'] },
      { name: 'Message Templates', href: '/operations/message-templates', icon: ClipboardList, requiredPermissions: ['MANAGE_MESSAGE_TEMPLATES'] },
    ]
  },
  {
    name: 'Reporting & Analytics',
    icon: LayoutDashboard,
    requiredPermissions: ['CAN_VIEW_REPORTS'],
    items: [
      { name: 'Reports', href: '/operations/reports', icon: LayoutDashboard, requiredPermissions: ['CAN_VIEW_REPORTS'] },
    ]
  },
];

const isPathMatchingItem = (pathname: string, itemHref: string): boolean => {
  if (pathname === itemHref) return true;
  if (pathname.startsWith(itemHref + '/')) return true;
  return false;
};

interface SidebarGroupProps {
  group: NavGroup;
  pathname: string;
  isMobile?: boolean;
  userPermissions: string[];
}

const SidebarGroup = ({ group, pathname, isMobile = false, userPermissions }: SidebarGroupProps) => {
  const [isOpen, setIsOpen] = useState(true);

  // Filter items based on user permissions
  const accessibleItems = useMemo(() => {
    return group.items.filter(item => {
      if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
        return true;
      }
      return item.requiredPermissions.some(permission => userPermissions.includes(permission));
    });
  }, [group.items, userPermissions]);

  const hasActiveChild = accessibleItems.some(item => isPathMatchingItem(pathname, item.href));

  // If group has no accessible items, don't render it
  if (accessibleItems.length === 0) {
    return null;
  }

  // Check group-level permissions
  const hasGroupAccess = useMemo(() => {
    if (!group.requiredPermissions || group.requiredPermissions.length === 0) {
      return true;
    }
    return group.requiredPermissions.some(permission => userPermissions.includes(permission));
  }, [group.requiredPermissions, userPermissions]);

  // If group requires permissions and user doesn't have access, don't render
  if (!hasGroupAccess) {
    return null;
  }

  const groupClasses = isMobile
    ? 'px-2 py-2 text-xs'
    : 'px-3 py-2.5 text-sm';

  const itemClasses = isMobile
    ? 'px-2 py-1.5 text-xs ml-6'
    : 'px-3 py-2 text-sm ml-7';

  const iconSize = isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const chevronSize = isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className={cn(
          'flex items-center justify-between gap-2 rounded-lg text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200',
          groupClasses,
          hasActiveChild && 'text-white bg-white/15'
        )}>
          <div className="flex items-center gap-2 min-w-0">
            <group.icon className={cn(iconSize, 'flex-shrink-0')} />
            <span className="font-medium truncate">{group.name}</span>
          </div>
          <ChevronDown className={cn(
            chevronSize,
            'flex-shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <ul className="mt-1 space-y-0.5">
          {accessibleItems.map((item) => {
            const isActive = isPathMatchingItem(pathname, item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-lg text-white hover:text-white/80 hover:bg-white/30 transition-all duration-200',
                    itemClasses,
                    isActive && 'bg-white text-accent font-medium shadow-sm'
                  )}
                >
                  <item.icon className={cn(iconSize, 'flex-shrink-0')} />
                  <span className="truncate">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

const SidebarMobile = () => {
  const pathname = usePathname();
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL_WHITE_FULL;
  const { operations } = useOperations();
  const { hasAnyPermission, userPermissions } = usePermission();

  // Filter navigation groups based on user permissions
  const accessibleGroups = useMemo(() => {
    return navigationGroups.filter(group => {
      // Check group-level permissions
      if (group.requiredPermissions && group.requiredPermissions.length > 0) {
        const hasGroupAccess = hasAnyPermission(group.requiredPermissions);
        if (!hasGroupAccess) return false;
      }

      // Check if group has any accessible items
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
    <div className="w-full bg-accent h-full flex flex-col">
      <div className="p-3">
        <div className="">
          <Link href="/operations/dashboard" className="block">
            <Image
              src={logoUrl || 'logo.png'}
              alt='logo'
              width={140}
              height={32}
              className='w-full max-w-[140px] h-auto object-contain'
              priority
            />
          </Link>
        </div>
      </div>

      <nav
        className="flex-1 py-3 px-2 overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          nav::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <ul className="space-y-1">
          {accessibleGroups.map((group) => (
            <li key={group.name}>
              <SidebarGroup
                group={group}
                pathname={pathname}
                isMobile={true}
                userPermissions={userPermissions}
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarMobile;
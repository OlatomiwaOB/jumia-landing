'use client'
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  HomeIcon,
  HomeIconFilled2,
  OrderIcon,
  OrderIconFilled2,
  Logout2Icon,
  ArrowIcon,
  TransactionIcon,
  TransactionIconFilled,
  CreditIcon,
  CreditIconFilled,
  ReportIcon,
  ReportIconFilled,
  FolderIcon,
  FolderIconFilled,
  ApikeyIcon,
  ApikeyIconFilled,
  SettingIcon,
  SettingIconFilled,
} from '@/components/icons/icons';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { logout } from '@/utils/auth-utils-customer';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  href: string;
  matchExact?: boolean;
}

interface NavGroup {
  name: string;
  href?: string;
  icon: any;
  activeIcon?: any;
  items: NavItem[];
  isSectionTitle?: boolean;
}

const navigationGroups: NavGroup[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    activeIcon: HomeIconFilled2,
    items: []
  },
  {
    name: 'Transactions & Payments',
    icon: TransactionIcon,
    activeIcon: TransactionIconFilled,
    items: [
      { name: 'Transactions', href: '/transactions' },
      { name: 'Send Money', href: '/send-money' },
      { name: 'Manage Accounts', href: '/add-bank-account' },
    ]
  },
  {
    name: 'Orders & Shopping',
    icon: OrderIcon,
    activeIcon: OrderIconFilled2,
    items: [
      { name: 'Find Stores', href: '/find-stores' },
      { name: 'Store Front', href: '/' },
      { name: 'Orders', href: '/orders' },
    ]
  },
  {
    name: 'Financial & Credit',
    icon: CreditIcon,
    activeIcon: CreditIconFilled,
    items: [
      { name: 'My Credit Score', href: '/credit-score' },
    ]
  },
  {
    name: 'Reports & Analytics',
    icon: ReportIcon,
    activeIcon: ReportIconFilled,
    items: [
      { name: 'Reports', href: '/reports' },
    ]
  },
  {
    name: 'Account & Profile',
    icon: '',
    isSectionTitle: true,
    items: []
  },
  {
    name: 'My Documents',
    href: '/documents',
    icon: FolderIcon,
    activeIcon: FolderIconFilled,
    items: []
  },
  {
    name: 'API Key',
    href: '/api-key',
    icon: ApikeyIcon,
    activeIcon: ApikeyIconFilled,
    items: []
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: SettingIcon,
    activeIcon: SettingIconFilled,
    items: []
  },
];

interface SidebarGroupProps {
  group: NavGroup;
  pathname: string;
}

const isPathMatchingItem = (pathname: string, itemHref: string): boolean => {
  if (pathname === itemHref) return true;
  if (pathname.startsWith(itemHref + '/')) return true;
  return false;
};

const isGroupActive = (group: NavGroup, pathname: string): boolean => {
  if (group.href && isPathMatchingItem(pathname, group.href)) return true;
  return group.items.some(item => isPathMatchingItem(pathname, item.href));
};

const SidebarGroup = ({ group, pathname }: SidebarGroupProps) => {
  const hasActiveChild = isGroupActive(group, pathname);
  const [isOpen, setIsOpen] = useState(hasActiveChild);
  const hasItems = group.items.length > 0;

  if (group.isSectionTitle) {
    return (
      <div className="px-4 pt-4 pb-2">
        <span className="text-xs text-sidebar-text uppercase">
          {group.name}
        </span>
      </div>
    );
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
          <span className={cn('font-medium truncate text-white', isActive && 'text-accent')}>{group.name}</span>
        </Link>
      </div>
    );
  }

  const IconComponent = hasActiveChild && group.activeIcon ? group.activeIcon : group.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className={cn(
          'flex items-center  justify-between gap-2 px-4 py-3 rounded-lg text-sidebar-text hover:text-white hover:bg-white/10 transition-all duration-200 text-xs w-full',
          hasActiveChild && 'bg-white text-accent'
        )}>
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <IconComponent className="w-5 h-5 flex-shrink-0" />
            <span className={cn('font-medium truncate text-white', hasActiveChild && 'text-accent')}>{group.name}</span>
          </div>
          <ArrowIcon
            className={cn(
              "w-3 h-3 rotate-270 flex-shrink-0 text-white text-sidebar-text transition-transform duration-200",
              isOpen && "rotate-360 text-faded-accent"
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="relative">
          <div className="absolute left-[20px] top-2 bottom-2 w-0.5 bg-[#EA813C]" />
          <ul className="py-2 pr-6 space-y-1">
            {group.items.map((item) => {
              const isActive = isPathMatchingItem(pathname, item.href);

              return (
                <li key={item.name} className="relative">
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center px-4 py-3  rounded-lg text-sidebar-text hover:text-white hover:bg-white/10 transition-all duration-200 text-xs ml-7',
                      isActive && 'bg-[#EA813C] text-accent font-medium'
                    )}
                  >
                    <span className="truncate text-white">{item.name}</span>
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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
            <Link href="/dashboard" className="block relative w-[120px] h-[80px]">
              <Image
                src={logoUrl || 'logo.png'}
                alt='logo'
                fill
                className='object-fill'
                priority />
            </Link>
          </div>
        </div>

        <nav
          className="flex-1 py-4 px-2 overflow-y-auto w-full"
          style={{
            scrollbarWidth: 'none',
            scrollbarColor: 'transparent',
          }}>
          <ul className="space-y-0.5 px-1">
            {navigationGroups.map((group) => (
              <li key={group.name}>
                <SidebarGroup group={group} pathname={pathname} />
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
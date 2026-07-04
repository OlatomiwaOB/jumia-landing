'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { clientConfig } from '@/config/client-config';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { logout } from '@/utils/auth-utils-customer';
import { Button } from '@/components/ui/button';
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
    name: 'Transactions',
    href: '/transactions',
    icon: TransactionIcon,
    activeIcon: TransactionIconFilled,
    items: []
  },
  // {
  //   name: 'Transactions & Payments',
  //   icon: TransactionIcon,
  //   activeIcon: TransactionIconFilled,
  //   items: [
  //     { name: 'Transactions', href: '/transactions' },
  //     { name: 'Send Money', href: '/send-money' },
  //     { name: 'Manage Accounts', href: '/add-bank-account' },
  //   ]
  // },
  {
    name: 'Orders & Shopping',
    icon: OrderIcon,
    activeIcon: OrderIconFilled2,
    items: [
      // { name: 'Find Stores', href: '/find-stores' },
      // { name: 'Store Front', href: '/' },
      { name: 'Orders', href: '/orders' },
    ]
  },
  // {
  //   name: 'Financial & Credit',
  //   icon: CreditIcon,
  //   activeIcon: CreditIconFilled,
  //   items: [
  //     { name: 'My Credit Score', href: '/credit-score' },
  //   ]
  // },
  // {
  //   name: 'Reports & Analytics',
  //   icon: ReportIcon,
  //   activeIcon: ReportIconFilled,
  //   items: [
  //     { name: 'Reports', href: '/reports' },
  //   ]
  // },
  // {
  //   name: 'Account & Profile',
  //   icon: '',
  //   isSectionTitle: true,
  //   items: []
  // },
  // {
  //   name: 'My Documents',
  //   href: '/documents',
  //   icon: FolderIcon,
  //   activeIcon: FolderIconFilled,
  //   items: []
  // },
  // {
  //   name: 'API Key',
  //   href: '/api-key',
  //   icon: ApikeyIcon,
  //   activeIcon: ApikeyIconFilled,
  //   items: []
  // },
  // {
  //   name: 'Settings',
  //   href: '/settings',
  //   icon: SettingIcon,
  //   activeIcon: SettingIconFilled,
  //   items: []
  // },
];

const isPathMatchingItem = (pathname: string, itemHref: string): boolean => {
  if (pathname === itemHref) return true;
  if (pathname.startsWith(itemHref + '/')) return true;
  return false;
};

const isGroupActive = (group: NavGroup, pathname: string): boolean => {
  if (group.href && isPathMatchingItem(pathname, group.href)) return true;
  return group.items.some(item => isPathMatchingItem(pathname, item.href));
};

interface SidebarGroupProps {
  group: NavGroup;
  pathname: string;
  onNavItemClick?: () => void;
}

const SidebarGroup = ({ group, pathname, onNavItemClick }: SidebarGroupProps) => {
  const hasActiveChild = isGroupActive(group, pathname);
  const [isOpen, setIsOpen] = useState(hasActiveChild);
  const hasItems = group.items.length > 0;

  if (group.isSectionTitle) {
    return (
      <div className="px-3 pt-5 pb-2">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
          {group.name}
        </span>
      </div>
    );
  }

  if (!hasItems && group.href) {
    const isActive = isPathMatchingItem(pathname, group.href);
    const IconComponent = isActive && group.activeIcon ? group.activeIcon : group.icon;

    return (
      <div className="relative mb-1">
        {isActive && (
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[--accent] rounded-r-full" />
        )}
        <Link
          href={group.href}
          onClick={onNavItemClick}
          className={cn(
            'flex items-center px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group',
            isActive
              ? 'bg-[--accent]/10 text-[--accent] font-medium'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          )}
        >
          <IconComponent className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-[--accent]" : "text-white/70 group-hover:text-white")} />
          <span className="ml-3 truncate">{group.name}</span>
        </Link>
      </div>
    );
  }

  const IconComponent = hasActiveChild && group.activeIcon ? group.activeIcon : group.icon;

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
            {group.items.map((item) => {
              const isActive = isPathMatchingItem(pathname, item.href);

              return (
                <li key={item.name} className="relative">
                  <Link
                    href={item.href}
                    onClick={onNavItemClick}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ml-[34px]',
                      isActive
                        ? 'bg-[--accent] text-white font-medium shadow-sm'
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

interface SidebarMobileProps {
  onNavItemClick?: () => void;
}

const SidebarMobile = ({ onNavItemClick }: SidebarMobileProps) => {
  const pathname = usePathname();
  const logoUrl = clientConfig().branding.logos.whiteFull;
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

  const handleNavItemClick = () => {
    onNavItemClick?.();
  };

  return (
    <>
      <div className="w-full h-full flex flex-col bg-[var(--sidebar-accent)] text-white relative">
        <div className="py-5 px-4 h-[72px] flex items-center shrink-0 border-b border-gray-800">
          <Link href="/dashboard" className="block relative w-[110px] h-[30px]" onClick={handleNavItemClick}>
            <Image
              src={logoUrl || 'logo.png'}
              alt='logo'
              fill
              className='object-contain object-left'
              priority
            />
          </Link>
        </div>

        <nav
          className="flex-1 py-4 px-3 overflow-y-auto w-full"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#4B5563 transparent',
          }}
        >
          <ul className="space-y-0.5 px-0.5">
            {navigationGroups.map((group) => (
              <li key={group.name}>
                <SidebarGroup
                  group={group}
                  pathname={pathname}
                  onNavItemClick={handleNavItemClick}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800 shrink-0">
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-gray-700/50 hover:bg-gray-800 hover:text-white hover:border-gray-600 transition-colors"
          >
            <Logout2Icon className="text-gray-400 w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
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

export default SidebarMobile;
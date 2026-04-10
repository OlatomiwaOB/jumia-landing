'use client'
import React, { useState } from 'react';
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
  Bike
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

interface NavGroup {
  name: string;
  icon: LucideIcon;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    items: [
      { name: 'Dashboard', href: '/rider/dashboard', icon: LayoutDashboard },
    ]
  }
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
  return group.items.some(item => isPathMatchingItem(pathname, item.href));
};

const SidebarGroup = ({ group, pathname }: SidebarGroupProps) => {

  const [isOpen, setIsOpen] = useState(true);

  const hasActiveChild = isGroupActive(group, pathname);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className={cn(
          'flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 text-sm',
          hasActiveChild && 'text-white bg-white/15'
        )}>
          <div className="flex items-center gap-3 min-w-0">
            <group.icon className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium truncate">{group.name}</span>
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 flex-shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <ul className="mt-1 space-y-0.5">
          {group.items.map((item) => {
            const isActive = isPathMatchingItem(pathname, item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:text-white/80 hover:bg-white/30 transition-all duration-200 text-sm ml-7',
                    isActive && 'bg-white text-accent font-medium shadow-sm'
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
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

export const DashboardSidebar = () => {
  const pathname = usePathname()
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL_WHITE_FULL;

  return (
    <div className="w-full bg-accent h-full flex flex-col">
      <div className="p-4">
        <div className="flex items-center justify-center p-2">
          <Link href="/rider/dashboard" className="block">
            <Image
              src={logoUrl || 'logo.png'}
              alt='logo'
              width={180}
              height={40}
              className='w-full max-w-[180px] h-auto object-contain'
              priority
            />
          </Link>
        </div>
      </div>

      <nav
        className="flex-1 py-4 px-3 overflow-y-auto w-full"
        style={{
          scrollbarWidth: 'none',
          scrollbarColor: 'transparent',
        }}>
        <ul className="space-y-1">
          {navigationGroups.map((group) => (
            <li key={group.name}>
              <SidebarGroup group={group} pathname={pathname} />
            </li>
          ))}
        </ul>
      </nav>

      {/* <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 text-white/70">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Operations User</p>
            <p className="text-xs text-white/50 truncate">Admin</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

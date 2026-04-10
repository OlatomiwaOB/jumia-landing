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

const isPathMatchingItem = (pathname: string, itemHref: string): boolean => {
  if (pathname === itemHref) return true;
  if (pathname.startsWith(itemHref + '/')) return true;
  return false;
};

const isGroupActive = (group: NavGroup, pathname: string): boolean => {
  return group.items.some(item => isPathMatchingItem(pathname, item.href));
};

interface SidebarGroupProps {
  group: NavGroup;
  pathname: string;
  isMobile?: boolean;
}

const SidebarGroup = ({ group, pathname, isMobile = false }: SidebarGroupProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasActiveChild = isGroupActive(group, pathname);

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
          {group.items.map((item) => {
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

  return (
    <div className="w-full bg-accent h-full flex flex-col">
      <div className="p-3">
        <div className="">
          <Link href="/rider/dashboard" className="block">
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
          {navigationGroups.map((group) => (
            <li key={group.name}>
              <SidebarGroup
                group={group}
                pathname={pathname}
                isMobile={true}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 text-white/70">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">Operations User</p>
            <p className="text-[10px] text-white/50 truncate">Admin</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SidebarMobile;
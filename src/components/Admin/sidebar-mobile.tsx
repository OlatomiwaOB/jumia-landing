// 'use client'
// import { cn } from '@/lib/utils';
// import {
//   LayoutDashboard,
//   Box,
//   StoreIcon,
//   UsersRoundIcon,
//   Clock,
//   Settings,
//   CreditCard,
//   PiggyBank,
//   Folder,
//   ShoppingCart,
//   Package,
//   UserCog,
//   Shield,
//   BarChart3,
//   Home,
//   ChevronDown,
//   Menu,
//   X
// } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import React, { useState, useEffect } from 'react';
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// interface NavItem {
//   name: string;
//   href: string;
//   icon: any;
// }

// interface NavGroup {
//   name: string;
//   icon: any;
//   items: NavItem[];
// }

// const navigationGroups: NavGroup[] = [
//   {
//     name: 'Dashboard',
//     icon: Home,
//     items: [
//       { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
//     ]
//   },
//   {
//     name: 'Order & Transaction',
//     icon: ShoppingCart,
//     items: [
//       { name: 'Orders', href: '/admin/orders', icon: Clock },
//       { name: 'Transactions', href: '/admin/transactions', icon: PiggyBank },
//     ]
//   },
//   {
//     name: 'Store & Inventory',
//     icon: StoreIcon,
//     items: [
//       { name: 'Stores', href: '/admin/stores', icon: StoreIcon },
//       { name: 'Inventories', href: '/admin/inventories', icon: Package },
//       { name: 'Store Settings', href: '/admin/settings', icon: Settings },
//     ]
//   },
//   {
//     name: 'User & Customer',
//     icon: UsersRoundIcon,
//     items: [
//       { name: 'Users', href: '/admin/users', icon: UsersRoundIcon },
//       { name: 'BNPL Customers', href: '/admin/bnpl-customers', icon: UserCog },
//     ]
//   },
//   {
//     name: 'Compliance',
//     icon: Shield,
//     items: [
//       { name: 'KYC Documents', href: '/admin/kyc-documents', icon: Folder },
//     ]
//   },
//   {
//     name: 'Payment',
//     icon: CreditCard,
//     items: [
//       { name: 'Payment Methods', href: '/admin/payment-methods', icon: CreditCard },
//     ]
//   },
//   {
//     name: 'Reports',
//     icon: BarChart3,
//     items: [
//       { name: 'Reports', href: '/admin/reports', icon: LayoutDashboard },
//     ]
//   },
// ];

// interface SidebarGroupProps {
//   group: NavGroup;
//   pathname: string;
//   isMobile?: boolean;
// }

// const isPathMatchingItem = (pathname: string, itemHref: string): boolean => {
//   if (pathname === itemHref) return true;
//   if (pathname.startsWith(itemHref + '/')) return true;
//   return false;
// };

// const isGroupActive = (group: NavGroup, pathname: string): boolean => {
//   return group.items.some(item => isPathMatchingItem(pathname, item.href));
// };

// const SidebarGroup = ({ group, pathname, isMobile }: SidebarGroupProps) => {
//   const [isOpen, setIsOpen] = useState(true);
//   const hasActiveChild = isGroupActive(group, pathname);

//   return (
//     <Collapsible open={isOpen} onOpenChange={setIsOpen}>
//       <CollapsibleTrigger className="w-full">
//         <div className={cn(
//           'flex items-center justify-between gap-2 px-3 py-3 rounded-lg text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200',
//           isMobile ? 'text-base' : 'text-sm',
//           hasActiveChild && 'text-white bg-white/15'
//         )}>
//           <div className="flex items-center gap-3 min-w-0">
//             <group.icon className={cn(
//               "flex-shrink-0",
//               isMobile ? "w-5 h-5" : "w-4 h-4"
//             )} />
//             <span className="font-medium truncate">{group.name}</span>
//           </div>
//           <ChevronDown className={cn(
//             "flex-shrink-0 transition-transform duration-200",
//             isMobile ? "w-5 h-5" : "w-4 h-4",
//             isOpen && "rotate-180"
//           )} />
//         </div>
//       </CollapsibleTrigger>
//       <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
//         <ul className="mt-1 space-y-1">
//           {group.items.map((item) => {
//             const isActive = isPathMatchingItem(pathname, item.href);

//             return (
//               <li key={item.name}>
//                 <Link
//                   href={item.href}
//                   className={cn(
//                     'flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:text-white/80 hover:bg-white/30 transition-all duration-200 ml-7',
//                     isMobile ? 'text-base' : 'text-sm',
//                     isActive && 'bg-white text-accent font-medium shadow-sm'
//                   )}
//                 >
//                   <item.icon className={cn(
//                     "flex-shrink-0",
//                     isMobile ? "w-5 h-5" : "w-4 h-4"
//                   )} />
//                   <span className="truncate">{item.name}</span>
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </CollapsibleContent>
//     </Collapsible>
//   );
// };

// const SidebarMobile = () => {
//   const pathname = usePathname();
//   const [isOpen, setIsOpen] = useState(false);
//   const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL_WHITE;

//   useEffect(() => {
//     setIsOpen(false);
//   }, [pathname]);

//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-accent-foreground text-white shadow-lg"
//         aria-label="Toggle menu"
//       >
//         {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//       </button>

//       {isOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-40"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       <div
//         className={cn(
//           'fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-accent-foreground h-full flex flex-col transform transition-transform duration-300 ease-in-out',
//           isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//         )}
//       >
//         <div className="p-4">
//           <div className="">
//             <Link href="/admin/dashboard" className="block" onClick={() => setIsOpen(false)}>
//               <Image
//                 src={logoUrl || 'logo.png'}
//                 alt='logo'
//                 width={140}
//                 height={32}
//                 className='w-full max-w-[140px] h-auto object-contain'
//                 priority
//               />
//             </Link>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="lg:hidden p-1 rounded-lg hover:bg-white/10"
//             >
//               <X className="w-5 h-5 text-white" />
//             </button>
//           </div>
//         </div>

//         <nav 
//           className="flex-1 py-4 px-3 overflow-y-auto"
//           style={{
//             scrollbarWidth: 'none',
//             scrollbarColor: 'transparent',
//           }}
//         >
//           <ul className="space-y-2">
//             {navigationGroups.map((group) => (
//               <li key={group.name}>
//                 <SidebarGroup 
//                   group={group} 
//                   pathname={pathname} 
//                   isMobile={true}
//                 />
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* <div className="p-4 border-t border-white/10">
//           <div className="flex items-center gap-3 px-2 py-2">
//             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
//               <UsersRoundIcon className="w-5 h-5 text-white" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-white truncate">Admin User</p>
//               <p className="text-xs text-white/50 truncate">Administrator</p>
//             </div>
//           </div>
//         </div> */}
//       </div>
//     </>
//   );
// };

// export default SidebarMobile;

// src/app/components/admin/SidebarMobile.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Box,
  StoreIcon,
  UsersRoundIcon,
  Clock,
  Settings,
  CreditCard,
  PiggyBank,
  Folder,
  ShoppingCart,
  Package,
  UserCog,
  Shield,
  BarChart3,
  ChevronDown,
  LucideIcon,
  Home,
  ShoppingBasket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import useUser from '@/store/userStore';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePermission } from '@/hooks/usePermission';

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
    icon: Home,
    requiredPermissions: ['VIEW_DASHBOARD'],
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, requiredPermissions: ['VIEW_DASHBOARD'] },
    ]
  },
  {
    name: 'Order & Transaction Mgt.',
    icon: ShoppingCart,
    requiredPermissions: ['VIEW_ORDERS', 'CAN_VIEW_TRANS'],
    items: [
      { name: 'Orders', href: '/admin/orders', icon: Clock, requiredPermissions: ['VIEW_ORDERS'] },
      { name: 'Transactions', href: '/admin/transactions', icon: PiggyBank, requiredPermissions: ['CAN_VIEW_TRANS'] },
    ]
  },
  {
    name: 'Store & Inventory Mgt.',
    icon: StoreIcon,
    requiredPermissions: ['VIEW_INVENTORY', 'MANAGE_STORES', 'MANAGE_STORE_SETTINGS'],
    items: [
      { name: 'Inventories', href: '/admin/inventories', icon: ShoppingBasket, requiredPermissions: ['VIEW_INVENTORY'] },
      { name: 'Stores', href: '/admin/stores', icon: StoreIcon, requiredPermissions: ['MANAGE_STORES'] },
      { name: 'Store Settings', href: '/admin/settings', icon: Settings, requiredPermissions: ['MANAGE_STORE_SETTINGS'] },
    ]
  },
  {
    name: 'User & Customer Mgt.',
    icon: UsersRoundIcon,
    requiredPermissions: ['MANAGE_USERS', 'MANAGE_BNPL'],
    items: [
      { name: 'Users', href: '/admin/users', icon: UsersRoundIcon, requiredPermissions: ['MANAGE_USERS'] },
      { name: 'BNPL Customers', href: '/admin/bnpl-customers', icon: UserCog, requiredPermissions: ['MANAGE_BNPL'] },
    ]
  },
  {
    name: 'Compliance',
    icon: Shield,
    requiredPermissions: ['VIEW_KYC'],
    items: [
      { name: 'KYC Documents', href: '/admin/kyc-documents', icon: Folder, requiredPermissions: ['VIEW_KYC'] },
    ]
  },
  {
    name: 'Payment Mgt.',
    icon: CreditCard,
    requiredPermissions: ['MANAGE_PAYMENT_METHODS'],
    items: [
      { name: 'Payment Methods', href: '/admin/payment-methods', icon: CreditCard, requiredPermissions: ['MANAGE_PAYMENT_METHODS'] },
    ]
  },
  {
    name: 'Reports & Analytics',
    icon: LayoutDashboard,
    requiredPermissions: ['CAN_VIEW_REPORTS'],
    items: [
      { name: 'Reports', href: '/admin/reports', icon: LayoutDashboard, requiredPermissions: ['CAN_VIEW_REPORTS'] },
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
  const { user } = useUser();
  const { hasAnyPermission, userPermissions } = usePermission();
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL_WHITE;

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
    <div className="w-full bg-accent-foreground h-full flex flex-col">
      <div className="p-3">
        <div className="">
          <Link href="/admin/dashboard" className="block">
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
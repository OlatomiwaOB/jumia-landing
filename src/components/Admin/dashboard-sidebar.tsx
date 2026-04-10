// 'use client'
// import React, { useState } from 'react';
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
//   ChevronDown,
//   LucideIcon,
//   Home,
//   ShoppingBasket
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import Image from 'next/image';
// import useUser from '@/store/userStore';
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

// interface NavItem {
//   name: string;
//   href: string;
//   icon: LucideIcon;
// }

// interface NavGroup {
//   name: string;
//   icon: LucideIcon;
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
//     name: 'Order & Transaction Mgt.',
//     icon: ShoppingCart,
//     items: [
//       { name: 'Orders', href: '/admin/orders', icon: Clock },
//       { name: 'Transactions', href: '/admin/transactions', icon: PiggyBank },
//     ]
//   },
//   {
//     name: 'Store & Inventory Mgt.',
//     icon: StoreIcon,
//     items: [
//       { name: 'Inventories', href: '/admin/inventories', icon: ShoppingBasket },
//       { name: 'Stores', href: '/admin/stores', icon: StoreIcon },
//       { name: 'Store Settings', href: '/admin/settings', icon: Settings },
//     ]
//   },
//   {
//     name: 'User & Customer Mgt.',
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
//     name: 'Payment Mgt.',
//     icon: CreditCard,
//     items: [
//       { name: 'Payment Methods', href: '/admin/payment-methods', icon: CreditCard },
//     ]
//   },
//   {
//     name: 'Reports & Analytics',
//     icon: BarChart3,
//     items: [
//       { name: 'Reports', href: '/admin/reports', icon: LayoutDashboard },
//     ]
//   },
// ];

// interface SidebarGroupProps {
//   group: NavGroup;
//   pathname: string;
// }

// const isPathMatchingItem = (pathname: string, itemHref: string): boolean => {
//   if (pathname === itemHref) return true;
  
//   if (pathname.startsWith(itemHref + '/')) return true;
  
//   return false;
// };

// const isGroupActive = (group: NavGroup, pathname: string): boolean => {
//   return group.items.some(item => isPathMatchingItem(pathname, item.href));
// };

// const SidebarGroup = ({ group, pathname }: SidebarGroupProps) => {
//   const [isOpen, setIsOpen] = useState(true);

//   const hasActiveChild = isGroupActive(group, pathname);

//   return (
//     <Collapsible open={isOpen} onOpenChange={setIsOpen}>
//       <CollapsibleTrigger className="w-full">
//         <div className={cn(
//           'flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 text-sm',
//           hasActiveChild && 'text-white bg-white/15'
//         )}>
//           <div className="flex items-center gap-3 min-w-0">
//             <group.icon className="w-4 h-4 flex-shrink-0" />
//             <span className="font-medium truncate">{group.name}</span>
//           </div>
//           <ChevronDown className={cn(
//             "w-4 h-4 flex-shrink-0 transition-transform duration-200",
//             isOpen && "rotate-180"
//           )} />
//         </div>
//       </CollapsibleTrigger>
//       <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
//         <ul className="mt-1 space-y-0.5">
//           {group.items.map((item) => {
//             const isActive = isPathMatchingItem(pathname, item.href);
            
//             return (
//               <li key={item.name}>
//                 <Link
//                   href={item.href}
//                   className={cn(
//                     'flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:text-white/80 hover:bg-white/30 transition-all duration-200 text-sm ml-7',
//                     isActive && 'bg-white text-accent font-medium shadow-sm'
//                   )}
//                 >
//                   <item.icon className="w-4 h-4 flex-shrink-0" />
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

// export const DashboardSidebar = () => {
//   const pathname = usePathname()
//   const { user } = useUser()
//   const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL_WHITE;

//   return (
//     <div className="w-full bg-accent-foreground h-full flex flex-col">
//       <div className="p-4">
//         <div className="flex items-center justify-center">
//           <Link href="/admin/dashboard" className="block">
//             <Image
//               src={logoUrl || 'logo.png'}
//               alt='logo'
//               width={180}
//               height={40}
//               className='w-full max-w-[180px] h-auto object-contain'
//               priority
//             />
//           </Link>
//         </div>
//       </div>

//       <nav 
//         className="flex-1 py-4 px-3 overflow-y-auto w-full"
//         style={{
//           scrollbarWidth: 'none',
//           scrollbarColor: 'transparent',
//         }}
//       >
//         <ul className="space-y-1">
//           {navigationGroups.map((group) => (
//             <li key={group.name}>
//               <SidebarGroup group={group} pathname={pathname} />
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* <div className="p-4 border-t border-white/10">
//         <Link
//           href={`/?storeCode=${user?.storeCode}`}
//           className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 text-sm"
//           target='_blank'
//         >
//           <StoreIcon className="w-4 h-4 flex-shrink-0" />
//           <span className="font-medium truncate">My store</span>
//         </Link>
//       </div> */}
//     </div>
//   );
// };

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { usePermission } from '@/hooks/usePermissionBusiness';

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

interface SidebarGroupProps {
  group: NavGroup;
  pathname: string;
  userPermissions: string[];
}

const isPathMatchingItem = (pathname: string, itemHref: string): boolean => {
  if (pathname === itemHref) return true;
  if (pathname.startsWith(itemHref + '/')) return true;
  return false;
};

const SidebarGroup = ({ group, pathname, userPermissions }: SidebarGroupProps) => {
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
          {accessibleItems.map((item) => {
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
      <div className="p-4">
        <div className="flex items-center justify-center">
          <Link href="/admin/dashboard" className="block">
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
        }}
      >
        <ul className="space-y-1">
          {accessibleGroups.map((group) => (
            <li key={group.name}>
              <SidebarGroup 
                group={group} 
                pathname={pathname} 
                userPermissions={userPermissions}
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
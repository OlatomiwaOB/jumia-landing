'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import useCustomer from '@/store/customerStore';
import { Button } from '../ui/button';
import SidebarMobile from './sidebar-mobile';
import Image from 'next/image';
import NotificationsModal from './notification-modal';
import { MessageIcon, NotificationIcon } from '@/components/icons/icons';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import { useRouter } from 'next/navigation';
import { HeaderBase } from '@/components/common/header-base';

interface Notification {
  id: number;
  entityCode: string;
  notificationType: string;
  title: string;
  message: string;
  logo: string;
  username: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  audience: string;
  createdDate: string;
}

export const DashboardHeader = () => {
  const { customer } = useCustomer();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { data: notificationsData, refetch } = useQuery({
    queryKey: ['notifications-header'],
    queryFn: async () => {
      const response = await axiosCustomer.get('/notification/fetch', {
        params: { status: '' }
      });
      return response.data.notificationInfo as Notification[];
    },
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (notificationsData) {
      const unreadNotifications = notificationsData.filter(
        notification => notification.status === 'UNREAD'
      );
      setUnreadCount(unreadNotifications.length);
    }
  }, [notificationsData]);

  const handleNotificationsOpen = () => {
    setIsNotificationsOpen(true);
    refetch();
  };

  const handleGoToSettings = () => {
    router.push('/settings')
  }

  const headerActions = (
    <>
      {/* <div className="hidden md:flex items-center gap-2">
        <button className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
          <MessageIcon className="w-5 h-5" />
        </button>

        <button 
          ref={notifBtnRef}
          onClick={handleNotificationsOpen}
          className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
        >
          <NotificationIcon className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 bg-[#EA813C] rounded-full w-2 h-2"></span>
          )}
        </button>
      </div> */}

      <div className="flex items-center pl-2 md:pl-4 border-l border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger onClick={handleGoToSettings} asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5 h-auto rounded-full hover:bg-gray-100">
              <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm">
                <AvatarImage src={`${customer?.photoLink}`} />
                <AvatarFallback>
                  <Image
                    src={'/images/no-profile-img.jpg'}
                    alt={''}
                    fill className="object-cover" sizes="32px"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-profile-img.jpg'; }}
                  />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start pr-2">
                <span className="text-sm font-medium text-gray-900 leading-none">
                  {customer?.firstname || 'User'}
                </span>
                <span className="text-xs text-gray-500 mt-1 leading-none">
                  Customer
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>

      <NotificationsModal
        isOpen={isNotificationsOpen}
        anchorRef={notifBtnRef as React.RefObject<HTMLElement>}
        onClose={() => setIsNotificationsOpen(false)}
        onNotificationRead={refetch}
      />
    </>
  );

  return (
    <HeaderBase
      actions={headerActions}
      mobileSidebarOpen={isMobileSidebarOpen}
      setMobileSidebarOpen={setIsMobileSidebarOpen}
      mobileSidebar={<SidebarMobile onNavItemClick={() => setIsMobileSidebarOpen(false)} />}
    />
  );
};
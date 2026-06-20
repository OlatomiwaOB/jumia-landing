'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import useUser from '@/store/userStore';
import { Button } from '@/components/ui/button';
import SidebarMobile from './sidebar-mobile';
import Image from 'next/image';
import NotificationsModal from './notification-modal';
import { MessageIcon, NotificationIcon, TransactionIconFilled } from '@/components/icons/icons';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { useRouter } from 'next/navigation';
import UpdateSubscriptionModal from './dashboard/update-subscription-plan';
import { logout } from '@/utils/auth-utils';
import { toast } from 'sonner';
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

const getTierColor = (tierCode: string): string => {
  switch (tierCode?.toUpperCase()) {
    case 'BASIC':
      return 'text-blue-800';
    case 'STANDARD':
      return 'text-green-800';
    case 'PREMIUM':
      return 'text-purple-800';
    default:
      return 'text-gray-800';
  }
};

export const DashboardHeader = () => {
  const { user } = useUser();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const router = useRouter();
  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { data: notificationsData, refetch } = useQuery({
    queryKey: ['notifications-header'],
    queryFn: async () => {
      const response = await axiosInstance.get('/notification/fetch', {
        params: { status: '' }
      });
      return response.data;
    },
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });

  const handleNotificationsOpen = () => {
    setIsNotificationsOpen(true);
    refetch();
  };

  const handleUpdateSubscription = () => {
    setIsSubscriptionModalOpen(true);
  };

  const handleSubscriptionUpdateSuccess = () => {
    setTimeout(() => {
      toast.message('You will be logged out shortly')
    }, 5000);
    setTimeout(() => {
      logout();
    }, 7000);
  };

  const handleGoToProfile = () => {
    router.push('/admin-profile')
  };

  const headerActions = (
    <>
      <div className="hidden md:flex items-center gap-2">
        {user?.userRole === 'BUSINESS_MANAGER' && (
          <div
            className="cursor-pointer relative px-3 py-1.5 rounded-full hover:bg-gray-100 flex items-center gap-2 transition-colors mr-2"
            onClick={handleUpdateSubscription}
          >
            <TransactionIconFilled className="text-gray-500 w-5 h-5" />
            <div className="hidden lg:flex items-center gap-1.5 pr-1">
              <span className={`text-xs font-semibold capitalize ${getTierColor(user?.subscriptionTierCode || '')}`}>
                {user?.subscriptionTierCode?.toLowerCase() || 'N/A'}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              <span className="text-xs font-medium text-gray-500 capitalize">
                {user?.subscriptionType?.toLowerCase() || 'N/A'}
              </span>
            </div>
          </div>
        )}

        <button className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
          <MessageIcon className="w-5 h-5" />
        </button>

        <button
          ref={notifBtnRef}
          className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          onClick={handleNotificationsOpen}
        >
          <NotificationIcon className="w-5 h-5" />
          {(notificationsData?.unreadMessages === '99+' || Number(notificationsData?.unreadMessages) > 0) && (
            <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full min-w-[18px] h-[18px] text-[10px] font-semibold flex items-center justify-center px-1">
              {notificationsData?.unreadMessages}
            </span>
          )}
        </button>
      </div>

      <div className="hidden md:flex items-center pl-4 border-l border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger onClick={handleGoToProfile} asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5 h-auto rounded-full hover:bg-gray-100">
              <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm">
                <AvatarImage src={`https://fortitude-anl.s3.eu-west-1.amazonaws.com${user?.photoLinks}`} />
                <AvatarFallback>
                  <Image
                    src={'/images/no-profile-img.jpg'}
                    alt={''}
                    fill
                    className="object-cover"
                    sizes="32px"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-profile-img.jpg'; }}
                  />
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-start pr-2">
                <span className="text-sm font-medium text-gray-900 leading-none">
                  {user?.businessName || user?.fullname || 'Admin'}
                </span>
                <span className="text-xs text-gray-500 mt-1 leading-none">
                  {user?.userRole?.replace('_', ' ')?.toLowerCase() || 'Administrator'}
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

      <UpdateSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onUpdateSuccess={handleSubscriptionUpdateSuccess}
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
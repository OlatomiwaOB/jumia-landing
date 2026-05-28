'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import useUser from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import SidebarMobile from './sidebar-mobile';
import Image from 'next/image';
import NotificationsModal from './notification-modal';
import { usePage } from '@/hooks/metadata-context';
import { MessageIcon, NotificationIcon, TransactionIconFilled } from '@/components/icons/icons';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { useRouter } from 'next/navigation';
import UpdateSubscriptionModal from './dashboard/update-subscription-plan';
import { logout } from '@/utils/auth-utils';
import { toast } from 'sonner';

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
  const { title, description } = usePage();
  const { user } = useUser();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { data: notificationsData, refetch } = useQuery({
    queryKey: ['notifications-header'],
    queryFn: async () => {
      const response = await axiosInstance.get('/notification/fetch', {
        params: {
          status: ''
        }
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

  return (
    <>
      <header className="bg-white px-2 lg:px-4 py-3 w-full min-h-20">
        <div className="flex items-center justify-between px-2">
          <div className='flex gap-3 items-center'>
            <div>
              <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                {title}
              </h1>
              {description && (
                <p className='text-xs lg:text-sm font-normal text-medium-gray'>{description}</p>
              )}
            </div>
          </div>

          <div className='flex items-center gap-4 lg:gap-6'>
            <div className="hidden md:flex items-center gap-4">
              {user?.userRole === 'BUSINESS_MANAGER' && (
                <div
                  className="cursor-pointer relative bg-[#F5F5F5] p-3 rounded-full flex items-center gap-2"
                  onClick={handleUpdateSubscription}
                >
                  <TransactionIconFilled className="text-muted-foreground w-6 h-6" />
                  <div className="hidden lg:flex items-center gap-1.5 pr-1">
                    <span className={`text-xs font-semibold capitalize ${getTierColor(user?.subscriptionTierCode || '')}`}>
                      {user?.subscriptionTierCode?.toLowerCase() || 'N/A'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-medium-gray"></span>
                    <span className="text-xs font-medium text-medium-gray capitalize">
                      {user?.subscriptionType?.toLowerCase() || 'N/A'}
                    </span>
                  </div>
                </div>
              )}

              <div className="cursor-pointer relative bg-[#F5F5F5] p-3 rounded-full">
                <MessageIcon className="text-muted-foreground w-6 h-6" />
              </div>

              <button
                ref={notifBtnRef}
                className="cursor-pointer relative bg-[#F5F5F5] p-3 rounded-full border-none outline-none"
                onClick={handleNotificationsOpen}
              >
                <NotificationIcon className="text-muted-foreground w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-3.5 bg-faded-accent rounded-full w-2 h-2 flex items-center justify-center"></span>
                )}
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 lg:gap-6">
              <div className="flex items-center gap-4 bg-black rounded-3xl">
                <DropdownMenu>
                  <DropdownMenuTrigger onClick={handleGoToProfile} asChild className="py-6 pl-1 pr-10">
                    <Button variant="ghost" className="flex items-center relative w-auto h-6 lg:h-9 rounded-full">
                      <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                        <AvatarImage src={`https://fortitude-anl.s3.eu-west-1.amazonaws.com${user?.photoLinks}`} />
                        <AvatarFallback>
                          <Image
                            src={'/images/no-profile-img.jpg'}
                            alt={''}
                            fill
                            className="object-cover"
                            sizes="64px"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-profile-img.jpg'; }}
                          />
                        </AvatarFallback>
                      </Avatar>

                      <div className="text-white">
                        <span className="text-sm font-medium">
                          {user?.businessName || user?.fullname}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                </DropdownMenu>
              </div>
            </div>

            <div className='flex lg:hidden gap-3 items-center'>
              <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className='text-gray-500 hover:bg-gray-100'>
                    <Menu className='w-6 h-6' />
                  </Button>
                </SheetTrigger>
                <SheetContent side='left'>
                  <SidebarMobile onNavItemClick={() => setIsMobileSidebarOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

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
};
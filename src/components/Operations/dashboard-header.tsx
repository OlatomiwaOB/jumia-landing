'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import useOperations from '@/store/operationsStore';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import SidebarMobile from './sidebar-mobile';
import Image from 'next/image';
import NotificationsModal from './notification-modal';
import { usePage } from '@/hooks/metadata-context';
import { MessageIcon, NotificationIcon } from '@/components/icons/icons';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { UserProfile } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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

export const DashboardHeader = () => {
  const { title, description } = usePage();
  const { operations, setOperations } = useOperations();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const hasValidProfileImage = () => {
    const photoLink = operations?.photoLink;
    if (!photoLink) return false;
    if (photoLink.endsWith('/null') || photoLink.includes('/null')) return false;
    return true;
  };

  const uploadProfileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('FILEUPLOADTYPE ', 'PROFILE_PICTURE')

      const response = await axiosOperations.request({
        url: '/fileuploadservice/uploadprofile',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'FILEUPLOADTYPE': 'PROFILE_PICTURE',
          'x-source-code': 'WEB',
        },
      });
      return response;
    },
    onSuccess: (data) => {
      if (data?.data?.code !== '000') {
        toast.error(data?.data?.desc || 'Failed to upload profile image');
        return;
      }
      const newPhotoLink = data?.data?.refNo;
      if (newPhotoLink && setOperations && operations) {
        const updatedRider: UserProfile = {
          ...operations,
          photoLink: newPhotoLink,
        };
        setOperations(updatedRider);
        toast.success('Profile image updated successfully');
      }
    },
    onError: () => toast.error('Something went wrong while uploading!'),
  });

  const { data: notificationsData, refetch } = useQuery({
    queryKey: ['notifications-header'],
    queryFn: async () => {
      const response = await axiosOperations.get('/notification/fetch', {
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

  const handleProfileClick = () => {
    setShowAlertDialog(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadProfileMutation.mutate(file);
    }
    setShowAlertDialog(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
              <div className="cursor-pointer relative bg-[#F5F5F5] p-3 rounded-full " >
                <MessageIcon className="text-muted-foreground w-6 h-6" />
                {/* <span className="absolute top-2.5 right-2.5 bg-faded-accent rounded-full w-2 h-2 flex items-center justify-center"></span> */}
              </div>

              <div className="cursor-pointer relative bg-[#F5F5F5] p-3 rounded-full" onClick={handleNotificationsOpen}>
                <NotificationIcon className="text-muted-foreground w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-3.5 bg-faded-accent rounded-full w-2 h-2 flex items-center justify-center"></span>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 lg:gap-6">
              <div className="flex items-center gap-4 bg-black rounded-3xl">
                <DropdownMenu>
                  <DropdownMenuTrigger onClick={handleProfileClick} asChild className="py-6 pl-1 pr-10">
                    <Button variant="ghost" className="flex items-centerrelative w-auto h-6 lg:h-9 rounded-full">
                      <Avatar className="w-8 h-8 lg:w-10 lg:h-10 ">
                        <AvatarImage src={`${operations?.photoLink}`} />
                        <AvatarFallback>
                          <Image
                            src={'/images/no-profile-img.jpg'}
                            alt={''}
                            fill className="object-cover" sizes="64px"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-profile-img.jpg'; }}
                          />
                        </AvatarFallback>
                      </Avatar>

                      <div className="text-white">
                        <span className="text-sm font-medium">
                          {operations?.firstname}
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

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
      />

      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {hasValidProfileImage() ? 'Change Profile Picture' : 'Upload Profile Picture'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {hasValidProfileImage()
                ? 'Do you wish to change your profile picture?'
                : 'Do you wish to upload a profile picture?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlertDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={triggerFileInput}>
              {hasValidProfileImage() ? 'Change' : 'Upload'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
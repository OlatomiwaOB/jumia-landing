'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import useOperations from '@/store/operationsStore';
import { Button } from '../ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import SidebarMobile from './sidebar-mobile';
import Image from 'next/image';
import NotificationsModal from './notification-modal';
import { MessageIcon, NotificationIcon } from '@/components/icons/icons';
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

  const headerActions = (
    <>
      <div className="hidden md:flex items-center gap-2">
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
            <span className="absolute top-2.5 right-2.5 bg-[--accent] rounded-full w-2 h-2"></span>
          )}
        </button>
      </div>

      <div className="hidden md:flex items-center pl-4 border-l border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger onClick={handleProfileClick} asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5 h-auto rounded-full hover:bg-gray-100">
              <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm">
                <AvatarImage src={`${operations?.photoLink}`} />
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
                  {operations?.firstname || 'Operations'}
                </span>
                <span className="text-xs text-gray-500 mt-1 leading-none">
                  Staff
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
            <AlertDialogCancel onClick={() => setShowAlertDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={triggerFileInput}>
              {hasValidProfileImage() ? 'Change' : 'Upload'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
'use client'
import React, { useState } from 'react';
import { User, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { logout } from '@/utils/auth-utils-riders';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import SidebarMobile from './sidebar-mobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useRider from '@/store/ridersStore';

const formatCurrentDate = () => {
  const date = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[date.getDay()];
  const day = date.getDate();
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  else if (day === 2 || day === 22) suffix = 'nd';
  else if (day === 3 || day === 23) suffix = 'rd';
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek}, ${day}${suffix} ${month} ${year}`;
};

export const DashboardHeader = () => {
  const currentDate = formatCurrentDate();
  const { rider } = useRider();
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

  return (
    <>
      <header className="bg-white border-b border-border px-4 lg:px-6 py-3 lg:py-4 w-full">
        <div className="flex items-center justify-between">
          <div className='flex gap-3 items-center'>
            <Sheet>
              <SheetTrigger asChild className='lg:hidden'>
                <Button variant="ghost" className='text-gray-500 hover:bg-gray-100'>
                  <Menu className='w-6 h-6' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left'>
                <SidebarMobile />
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-lg lg:text-xl font-semibold text-accent">
                {rider?.firstname} | Rider
              </h1>
              <p className='text-xs text-muted-foreground'>{currentDate}</p>
            </div>
          </div>

          <div className='flex items-center gap-4 lg:gap-6'>
            <div className="relative">
              <svg width="21" height="27" viewBox="0 0 21 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21.6H0L2.625 18.9V10.8C2.62688 8.88722 3.28682 7.03683 4.48794 5.57655C5.68906 4.11626 7.35386 3.1403 9.1875 2.8215V1.35C9.1875 0.991958 9.32578 0.64858 9.57192 0.395406C9.81806 0.142232 10.1519 0 10.5 0C10.8481 0 11.1819 0.142232 11.4281 0.395406C11.6742 0.64858 11.8125 0.991958 11.8125 1.35V2.8215C12.3996 2.93324 12.9721 3.11445 13.5187 3.3615C13.1912 4.18091 13.0651 5.07074 13.1517 5.95223C13.2382 6.83371 13.5347 7.67965 14.0149 8.41517C14.4951 9.1507 15.1441 9.75311 15.9046 10.1691C16.6652 10.585 17.5136 10.8018 18.375 10.8V18.9L21 21.6ZM10.5 27C11.1962 27 11.8639 26.7155 12.3562 26.2092C12.8484 25.7028 13.125 25.0161 13.125 24.3H7.875C7.875 25.0161 8.15156 25.7028 8.64384 26.2092C9.13613 26.7155 9.80381 27 10.5 27ZM18.375 2.7C17.8558 2.7 17.3483 2.85835 16.9166 3.15503C16.4849 3.45171 16.1485 3.87339 15.9498 4.36675C15.7511 4.86012 15.6992 5.403 15.8004 5.92674C15.9017 6.45049 16.1517 6.93159 16.5188 7.30919C16.886 7.68679 17.3537 7.94394 17.8629 8.04812C18.3721 8.1523 18.8999 8.09883 19.3795 7.89448C19.8592 7.69012 20.2692 7.34405 20.5576 6.90004C20.846 6.45603 21 5.93401 21 5.4C21 4.68392 20.7234 3.99716 20.2312 3.49081C19.7389 2.98446 19.0712 2.7 18.375 2.7Z" fill="black" />
              </svg>
            </div>

            <div className="relative">
              <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.545 12.3672H25.6317C26.0281 12.8764 26.2666 13.5145 26.2666 14.2073V20.4593C26.2666 22.1125 24.9131 23.4628 23.2631 23.4628H15.9219C16.3118 24.4618 17.2818 25.174 18.4162 25.174H28.545C30.0146 25.174 31.2198 23.972 31.2198 22.4992V15.042C31.2166 13.5692 30.0146 12.3672 28.545 12.3672Z" fill="#264653" />
                <path d="M25.1584 18.7725V9.23018C25.1584 6.83896 23.2022 4.88281 20.811 4.88281H6.38643C3.99521 4.88281 2.03906 6.83896 2.03906 9.23018V18.7725C2.03906 21.0444 3.80508 22.92 6.02871 23.1037C6.02871 23.1037 5.38418 28.1117 6.18662 28.1117C6.98906 28.1117 12.2581 23.1198 12.2581 23.1198H20.8078C23.2022 23.1198 25.1584 21.1637 25.1584 18.7725ZM11.4911 21.1862L10.9304 21.7147C10.9207 21.7244 9.81855 22.7686 8.57139 23.8771C8.29746 24.1188 8.04932 24.338 7.82051 24.5378C7.88174 23.8643 7.94619 23.3583 7.94619 23.3519L8.204 21.3441L6.18662 21.1766C4.9459 21.0734 3.97266 20.0164 3.97266 18.7725V9.23018C3.97266 8.58887 4.22402 7.98623 4.68486 7.52861C5.14248 7.071 5.74834 6.81641 6.38643 6.81641H20.811C21.4523 6.81641 22.055 7.06777 22.5126 7.52861C22.9702 7.98623 23.2248 8.59209 23.2248 9.23018V18.7725C23.2248 19.4138 22.9734 20.0164 22.5126 20.474C22.055 20.9316 21.4491 21.1862 20.811 21.1862H11.4911Z" fill="#45484C" />
                <path d="M26.7565 10.8869C26.2345 10.7805 25.7221 11.1157 25.6157 11.6377C25.5094 12.1598 25.8445 12.6722 26.3666 12.7786C27.6234 13.0364 28.5354 14.1546 28.5354 15.4373V21.1414C28.5354 22.482 27.5332 23.6389 26.2055 23.8291L25.1517 23.9805L25.403 25.015C25.4675 25.276 25.5287 25.5564 25.5899 25.8303C25.0227 25.3018 24.3879 24.696 23.811 24.132L23.5307 23.8548H18.1263C17.4205 23.8548 16.9468 23.8097 16.6052 23.5777C16.1637 23.278 15.561 23.3908 15.2613 23.8323C14.9616 24.2738 15.0744 24.8764 15.5159 25.1761C16.3441 25.7401 17.298 25.7884 18.1263 25.7884H22.7411C23.0634 26.101 23.6209 26.636 24.1913 27.1677C24.7134 27.6544 25.1452 28.0411 25.4739 28.3247C26.1185 28.8725 26.4182 29.0691 26.8145 29.0691C27.1271 29.0691 27.4172 28.9273 27.6138 28.6792C27.9393 28.2634 27.9425 27.7414 27.6299 26.1429C27.5848 25.9109 27.5364 25.6853 27.4913 25.4791C29.2444 24.7991 30.469 23.0846 30.469 21.1414V15.4373C30.4723 13.2459 28.9093 11.3316 26.7565 10.8869Z" fill="#264653" />
                <path d="M14.0052 19.4284C12.8482 19.4284 11.7171 18.8773 10.8212 17.8783C10.0284 16.9921 9.55469 15.8932 9.55469 14.9328V13.9757L10.5118 13.966C10.5247 13.966 11.6784 13.9531 13.5862 13.9531C14.1212 13.9531 14.553 14.385 14.553 14.9199C14.553 15.4549 14.1212 15.8867 13.5862 15.8867C12.8676 15.8867 12.2585 15.8899 11.7751 15.8899C11.8976 16.1188 12.0587 16.3572 12.2617 16.586C12.7773 17.1629 13.4122 17.4916 14.0052 17.4916C14.5981 17.4916 15.233 17.1597 15.7486 16.586C15.9581 16.3508 16.1225 16.1059 16.2449 15.8706C15.8034 15.7804 15.4683 15.3872 15.4715 14.9199C15.4747 14.3882 15.9065 13.9563 16.4383 13.9563H16.4415C17.3148 13.9596 17.4889 13.9628 17.5243 13.966L18.4557 14.0015V14.9328C18.4557 15.8932 17.9819 16.9921 17.1892 17.8783C16.29 18.8773 15.1621 19.4284 14.0052 19.4284Z" fill="#E9C36B" />
              </svg>
            </div>

            {/* <div className="hidden md:block relative w-60 lg:w-80">
              <Input
                placeholder="Search here..."
                className="pl-10 bg-muted/50 border-border"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div> */}

            <div className="flex items-center gap-2 lg:gap-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 lg:h-10 lg:w-10 rounded-full">
                    <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                      <AvatarImage src="/lovable-uploads/02ad6048-41c8-4298-9103-f9760c690183.png" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <User className="w-4 h-4 lg:w-5 lg:h-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* <DropdownMenuItem>
                    <Link href="/customer-profile" className="w-full">
                      My profile
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onClick={handleLogoutClick}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

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
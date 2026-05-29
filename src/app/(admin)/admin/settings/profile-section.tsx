'use client'
import React, { useEffect, useState, useRef } from 'react';
import useUser from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { toast } from 'sonner';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoggedInUser, UserProfile } from '@/types';
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

export default function ProfileSection() {
    const { user, setUser } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showAlertDialog, setShowAlertDialog] = useState(false);

    const hasValidProfileImage = () => {
        const photoLink = user?.photoLinks;
        if (!photoLink) return false;
        if (photoLink.endsWith('/null') || photoLink.includes('/null')) return false;
        return true;
    };

    const ninOrBvn = user?.bvn || user?.nin || '';
    const ninOrBvnLabel = user?.bvn ? 'BVN' : 'NIN';
    const isNinBvnLocked = ninOrBvn.length > 1;

    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        mobileNo: '',
        nin: '',
        bvn: '',
        address: '',
    });

    useEffect(() => {
        if (user) {
            setForm({
                name: user.fullname || '',
                username: user.username || '',
                email: user.email || '',
                mobileNo: user.mobileNo || '',
                nin: user.nin || '',
                bvn: user.bvn || '',
                address: user.address || '',
            });
        }
    }, [user]);

    const uploadProfileMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('FILEUPLOADTYPE ', 'PROFILE_PICTURE')

            const response = await axiosInstance.request({
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
            if (newPhotoLink && setUser && user) {
                const updatedUser: LoggedInUser = {
                    ...user,
                    photoLinks: [newPhotoLink],
                };
                setUser(updatedUser);
                toast.success('Profile image updated successfully');
            }
        },
        onError: () => toast.error('Something went wrong while uploading!'),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => axiosInstance.request({
            url: '/ecommerce/user/simple-onboardhju',
            method: 'POST',
            data,
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') {
                toast.error(data?.data?.desc || 'Failed to update profile');
                return;
            }
            toast.success('Profile updated successfully');
            if (setUser && user) {
                const updatedUser: LoggedInUser = {
                    ...user,
                    fullname: form.name,
                    username: form.username,
                    email: form.email,
                    mobileNo: form.mobileNo,
                    userPermissions: user.userPermissions || [],
                    bvn: form.bvn || user.bvn || '',
                    nin: form.nin || user.nin || '',
                    address: form.address || user.address || '',
                    customerType: user.customerType || '',
                    deviceId: user.deviceId || '',
                    geolocation: user.geolocation || '',
                    city: user.city || '',
                    countryCode: user.countryCode || '',
                    gender: user.gender || '',
                    onboardingId: user.onboardingId || '',
                    dateOfBirth: user.dateOfBirth || '',
                    nationality: user.nationality || '',
                    phoneCode: user.phoneCode || '',
                    referralCode: user.referralCode || '',
                    socialId: user.socialId || '',
                    id: user.id || '',
                };
                setUser(updatedUser);
            }
        },
        onError: () => toast.error('Something went wrong!'),
    });

    const handleSave = () => {
        const payload = {
            firstname: user?.firstname || '',
            name: form.name,
            customerType: user?.customerType || '',
            deviceId: user?.deviceId || '',
            geolocation: user?.geolocation || '',
            username: user?.username || '',
            mobileNo: form.mobileNo,
            email: form.email,
            city: user?.city || '',
            countryCode: user?.countryCode || user?.country || '',
            gender: user?.gender || '',
            dateOfBirth: user?.dateOfBirth || '',
            password: '',
            nationality: user?.nationality || '',
            phoneCode: user?.phoneCode || '',
            referralCode: user?.referralCode || '',
            bvn: form.bvn,
            nin: form.nin,
            channel: 'WEB',
            photoLink: user?.photoLinks || '',
            socialId: user?.socialId || '',
        };
        mutate(payload);
    };

    const update = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

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
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-dark-gray">Profile</h2>
                </div>

                <div className="px-6 py-5 flex items-center gap-4">
                    <div
                        className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shrink-0 relative cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleProfileClick}
                    >
                        <Image
                            src={hasValidProfileImage() ? user?.photoLinks || '' : '/images/no-profile-img.jpg'}
                            alt={user?.fullname || 'Profile'}
                            fill className="object-cover" sizes="64px"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-profile-img.jpg'; }}
                        />
                    </div>
                    <div>
                        <p className="text-md font-semibold text-dark-gray">{user?.fullname || '—'}</p>
                        <p className="text-sm text-medium-gray mt-0.5">
                            {user?.mobileNo || '—'}
                        </p>
                        {/* <p className="text-xs text-text mt-1 cursor-pointer hover:underline" onClick={handleProfileClick}>
                            {hasValidProfileImage() ? 'Change profile picture' : 'Upload profile picture'}
                        </p> */}
                    </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Full name</Label>
                            <Input
                                value={form.name}
                                onChange={(e) => update('name', e.target.value)}
                                placeholder="Enter full name"
                            />
                        </div>
                        <div>
                            <Label>Email address</Label>
                            <Input
                                value={form.email}
                                onChange={(e) => update('email', e.target.value)}
                                placeholder="Enter email address"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Mobile number</Label>
                            <Input
                                value={form.mobileNo}
                                onChange={(e) => update('mobileNo', e.target.value)}
                                placeholder="Enter mobile number"
                            />
                        </div>
                        <div>
                            <Label>{ninOrBvnLabel} Number</Label>
                            <Input
                                value={form.bvn || form.nin}
                                onChange={(e) => {
                                    if (isNinBvnLocked) return;
                                    if (user?.bvn !== undefined) update('bvn', e.target.value);
                                    else update('nin', e.target.value);
                                }}
                                placeholder={`Enter ${ninOrBvnLabel} number`}
                                disabled={isNinBvnLocked}
                                title={isNinBvnLocked ? 'This field cannot be edited' : undefined}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Home address</Label>
                        <Input
                            value={form.address}
                            onChange={(e) => update('address', e.target.value)}
                            placeholder="Enter home address"
                        />
                    </div>

                    <Button
                        onClick={handleSave}
                        // disabled={isPending}
                        disabled
                        className='w-full max-w-[50%] h-12'
                    >
                        {isPending ? 'Saving…' : 'Save Changes'}
                    </Button>
                </div>
            </div>

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
}
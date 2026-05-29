'use client'
import React, { useEffect, useState, useRef } from 'react';
import useCustomer from '@/store/customerStore';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import { toast } from 'sonner';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

export default function ProfileSection() {
    const { customer, setCustomer } = useCustomer();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showAlertDialog, setShowAlertDialog] = useState(false);

    const hasValidProfileImage = () => {
        const photoLink = customer?.photoLink;
        if (!photoLink) return false;
        if (photoLink.endsWith('/null') || photoLink.includes('/null')) return false;
        return true;
    };

    const ninOrBvn = customer?.bvn || customer?.nin || '';
    const ninOrBvnLabel = customer?.bvn ? 'BVN' : 'NIN';
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
        if (customer) {
            setForm({
                name: customer.fullname || '',
                username: customer.username || '',
                email: customer.email || '',
                mobileNo: customer.mobileNo || '',
                nin: customer.nin || '',
                bvn: customer.bvn || '',
                address: customer.address || '',
            });
        }
    }, [customer]);

    const uploadProfileMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('FILEUPLOADTYPE ', 'PROFILE_PICTURE')

            const response = await axiosCustomer.request({
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
            if (newPhotoLink && setCustomer && customer) {
                const updatedCustomer: UserProfile = {
                    ...customer,
                    photoLink: newPhotoLink,
                };
                setCustomer(updatedCustomer);
                toast.success('Profile image updated successfully');
            }
        },
        onError: () => toast.error('Something went wrong while uploading!'),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => axiosCustomer.request({
            url: '/ecommerce/customer/simple-onboardhju',
            method: 'POST',
            data,
        }),
        onSuccess: (data) => {
            if (data?.data?.code !== '000') {
                toast.error(data?.data?.desc || 'Failed to update profile');
                return;
            }
            toast.success('Profile updated successfully');
            if (setCustomer && customer) {
                const updatedCustomer: UserProfile = {
                    ...customer,
                    fullname: form.name,
                    username: form.username,
                    email: form.email,
                    mobileNo: form.mobileNo,
                    userPermissions: customer.userPermissions || [],
                    bvn: form.bvn || customer.bvn || '',
                    nin: form.nin || customer.nin || '',
                    address: form.address || customer.address || '',
                    customerType: customer.customerType || '',
                    deviceId: customer.deviceId || '',
                    geolocation: customer.geolocation || '',
                    city: customer.city || '',
                    countryCode: customer.countryCode || '',
                    gender: customer.gender || '',
                    onboardingId: customer.onboardingId || '',
                    dateOfBirth: customer.dateOfBirth || '',
                    nationality: customer.nationality || '',
                    phoneCode: customer.phoneCode || '',
                    referralCode: customer.referralCode || '',
                    socialId: customer.socialId || '',
                    id: customer.id || '',
                };
                setCustomer(updatedCustomer);
            }
        },
        onError: () => toast.error('Something went wrong!'),
    });

    const handleSave = () => {
        const payload = {
            firstname: customer?.firstname || '',
            lastname: customer?.lastname || '',
            name: form.name,
            customerType: customer?.customerType || '',
            deviceId: customer?.deviceId || '',
            geolocation: customer?.geolocation || '',
            username: customer?.username || '',
            mobileNo: form.mobileNo,
            email: form.email,
            city: customer?.city || '',
            countryCode: customer?.countryCode || customer?.country || '',
            gender: customer?.gender || '',
            onboardingId: customer?.onboardingId || customer?.customerId || '',
            dateOfBirth: customer?.dateOfBirth || '',
            password: '',
            nationality: customer?.nationality || '',
            phoneCode: customer?.phoneCode || '',
            referralCode: customer?.referralCode || '',
            bvn: form.bvn,
            nin: form.nin,
            channel: 'WEB',
            photoLink: customer?.photoLink || '',
            socialId: customer?.socialId || '',
            customerId: customer?.customerId || customer?.id || '',
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
                            src={hasValidProfileImage() ? customer?.photoLink || '' : '/images/no-profile-img.jpg'}
                            alt={customer?.fullname || 'Profile'}
                            fill className="object-cover" sizes="64px"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-profile-img.jpg'; }}
                        />
                    </div>
                    <div>
                        <p className="text-md font-semibold text-dark-gray">{customer?.fullname || '—'}</p>
                        <p className="text-sm text-medium-gray mt-0.5">
                            {customer?.mobileNo || '—'}
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
                                    if (customer?.bvn !== undefined) update('bvn', e.target.value);
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
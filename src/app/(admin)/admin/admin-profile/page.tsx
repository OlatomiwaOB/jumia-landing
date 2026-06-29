'use client'
import React from 'react';
import { Store, MapPin, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import useUser from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();

  const { data: storeData, isLoading: isLoadingStore } = useQuery({
    queryKey: ['store-detail', user?.storeCode],
    queryFn: () => axiosInstance.request({
      url: '/store/fetch-store-detail',
      method: 'GET',
      params: {
        storeCode: user?.storeCode
      }
    }),
    enabled: !!user?.storeCode,
  });

  const store = storeData?.data;
  const documents = store?.documents || [];

  if (!user || isLoadingStore) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-sidebar-accent mx-auto" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Fallbacks based on JSON mapping
  const storeName = store?.storeName;
  const city = store?.city;
  const state = store?.state;
  const address = store?.address;
  const email = store?.email;
  const latitude = store?.latitude;
  const longitude = store?.longitude;
  const logoUrl = store?.logo;

  const navigateToEdit = () => {
    if (user?.storeCode) {
      router.push(`/admin/admin-profile/edit/${user.storeCode}?id=${user.storeCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-sidebar-accent flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                {logoUrl ? (
                  <Image src={logoUrl} alt="Store Logo" width={96} height={96} className="object-cover w-full h-full" />
                ) : (
                  <Store className="w-12 h-12 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{storeName || 'Unknown Store'}</h1>
                {city && <p className="text-gray-500 mt-1">{city}</p>}
              </div>
            </div>
            {/* <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6">
              View Store
            </Button> */}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Settings Account</h2>
          <Button
            onClick={navigateToEdit}
            className="bg-sidebar-accent hover:bg-sidebar-accent/90 text-white px-6 font-medium"
          >
            Edit Profile
          </Button>
        </div>

        {/* <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Account
            </button>
            <button className="whitespace-nowrap pb-4 px-1 border-b-2 border-sidebar-accent font-medium text-sm text-sidebar-accent">
              Profile Store
            </button>
            <button className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Delivery
            </button>
          </nav>
        </div> */}

        <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-8 space-y-12 mb-20">

          {/* Store Photo Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-base font-bold text-gray-900 mb-2">Store Photo</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Image format .jpg .jpeg .png and minimum size 300 x 300px (For optimal images use minimum size 700 x 700 px).
              </p>
            </div>
            <div className="md:col-span-3 flex items-center gap-4">
              {logoUrl && (
                <div className="relative w-24 h-24 rounded-lg border border-gray-200 overflow-hidden bg-white">
                  <Image src={logoUrl} alt="Thumbnail" fill className="object-cover" />
                </div>
              )}
              {/* <button 
                onClick={navigateToEdit}
                className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors bg-white"
              >
                <span className="text-xl text-red-500 mb-1">+</span>
                <span className="text-xs font-medium">Upload</span>
              </button> */}
            </div>
          </div>

          {/* Store Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-gray-100 pt-10">
            <div className="md:col-span-1">
              <h3 className="text-base font-bold text-gray-900">Store Information</h3>
            </div>
            <div className="md:col-span-3 space-y-6">

              {storeName && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <label className="text-sm font-bold text-gray-800 flex items-center gap-1">Store Name <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-400 mt-1">Will appear on receipts, invoices, and other communications</p>
                  </div>
                  <div className="md:col-span-2">
                    <input readOnly value={storeName} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none" />
                  </div>
                </div>
              )}

              {city && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <label className="text-sm font-bold text-gray-800 flex items-center gap-1">Store Description <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-400 mt-1">Will appear on Profile</p>
                  </div>
                  <div className="md:col-span-2">
                    <input readOnly value={city} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none" />
                  </div>
                </div>
              )}

              {email && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <label className="text-sm font-bold text-gray-800 flex items-center gap-1">Email <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-400 mt-1">Used for email receipt</p>
                  </div>
                  <div className="md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-4 w-4 text-gray-400" />
                    </div>
                    <input readOnly value={email} className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none" />
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-gray-100 pt-10">
            <div className="md:col-span-1">
              <h3 className="text-base font-bold text-gray-900">Address Information</h3>
            </div>
            <div className="md:col-span-3 space-y-6">

              {address && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <label className="text-sm font-bold text-gray-800 flex items-center gap-1">Address <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-400 mt-1">Will appear on email receipt, store profile, delivery</p>
                  </div>
                  <div className="md:col-span-2">
                    <input readOnly value={address} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none" />
                  </div>
                </div>
              )}

              {city && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-bold text-gray-800 flex items-center gap-1">City <span className="text-red-500">*</span></label>
                  <div className="md:col-span-2">
                    <input readOnly value={city} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none" />
                  </div>
                </div>
              )}

              {state && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-bold text-gray-800 flex items-center gap-1">Province <span className="text-red-500">*</span></label>
                  <div className="md:col-span-2">
                    <input readOnly value={state} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none" />
                  </div>
                </div>
              )}

              {/* {(latitude !== undefined && longitude !== undefined) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-bold text-gray-800 flex items-center gap-1 mt-2">Location Code <span className="text-red-500">*</span></label>
                  <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <input readOnly value={`Lat: ${latitude}, Long: ${longitude}`} className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none" />
                    </div>
                  </div>
                </div>
              )} */}

            </div>
          </div>

          {/* Document Store */}
          {documents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-gray-100 pt-10">
              <div className="md:col-span-1">
                <h3 className="text-base font-bold text-gray-900">Document Store</h3>
              </div>
              <div className="md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {documents.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-bold text-gray-800 truncate">{doc.type || 'Document'}</p>
                          <p className="text-xs text-gray-500">{doc.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
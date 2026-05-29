// 'use client'
// import React, { useState } from 'react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Download, Plus, Search, Eye, Edit, Trash2, Settings } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosInstance from '@/utils/fetch-function';
// import useUser from '@/store/userStore';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { usePermission } from '@/hooks/usePermissionBusiness';

// interface StoreSetting {
//     id?: number;
//     originalId?: number;
//     originalSettingType?: string;
//     settingType: string;
//     description: string;
//     settingValues: string[];
//     status: string;
//     merchantCode?: string;
//     storeCode: string;
//     createdAt?: string;
//     updatedAt?: string;
// }

// interface ApiResponse {
//     responseCode: string;
//     responseMessage: string;
//     settings: StoreSetting[];
// }

// interface Column {
//     title: string;
//     dataIndex: string;
//     key: string;
//     width?: number;
//     render?: (value: any, record: StoreSetting, index: number) => React.ReactNode;
// }

// const getStatusColor = (status: string): string => {
//     if (!status) return 'bg-gray-500 text-white';

//     switch (status.toUpperCase()) {
//         case 'ACTIVE':
//             return 'bg-green-500 text-white';
//         case 'INACTIVE':
//             return 'bg-red-500 text-white';
//         default:
//             return 'bg-gray-500 text-white';
//     }
// };

// const getDisplayValue = (value: any): string => {
//     if (Array.isArray(value)) {
//         return value.join(', ') || 'N/A';
//     }
//     return value?.toString() || 'N/A';
// };

// const getSettingTypeColor = (type: string): string => {
//     switch (type?.toLowerCase()) {
//         case 'business_hours':
//             return 'bg-blue-100 text-blue-800';
//         case 'payment_methods':
//             return 'bg-green-100 text-green-800';
//         case 'shipping_options':
//             return 'bg-purple-100 text-purple-800';
//         case 'general':
//             return 'bg-gray-100 text-gray-800';
//         default:
//             return 'bg-orange-100 text-orange-800';
//     }
// };

// const DynamicTable = ({
//     columns,
//     data,
//     itemsPerPage = 5,
//     onViewDetails,
//     onEditDetails
// }: {
//     columns: Column[];
//     data: StoreSetting[];
//     itemsPerPage?: number;
//     onViewDetails: (setting: StoreSetting) => void;
//     onEditDetails: (setting: StoreSetting) => void;
// }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedSetting, setSelectedSetting] = useState<StoreSetting | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const totalPages = Math.ceil(data.length / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const currentData = data.slice(startIndex, endIndex);

//     const handleViewDetails = (setting: StoreSetting) => {
//         setSelectedSetting(setting);
//         setIsModalOpen(true);
//         onViewDetails(setting);
//     };

//     const handlePageChange = (page: number) => {
//         if (page >= 1 && page <= totalPages) {
//             setCurrentPage(page);
//         }
//     };

//     const columnsWithHandler = columns.map(col => {
//         if (col.key === 'actions') {
//             return {
//                 ...col,
//                 render: (text: string, record: StoreSetting) => (
//                     <div className="flex gap-1">
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="p-1"
//                             onClick={() => handleViewDetails(record)}
//                         >
//                             <Eye className="w-5 h-5" />
//                         </Button>
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="p-1"
//                             onClick={() => onEditDetails(record)}
//                         >
//                             <Edit className="w-4 h-4" />
//                         </Button>
//                     </div>
//                 )
//             };
//         }
//         return col;
//     });

//     return (
//         <>
//             <div className="w-full overflow-x-auto">
//                 <table className="w-full border-collapse">
//                     <thead>
//                         <tr className="border-b-2 border-gray-200">
//                             {columnsWithHandler.map((column) => (
//                                 <th
//                                     key={column.key}
//                                     className="text-left p-3 font-bold text-sm text-gray-700"
//                                     style={{ width: column.width ? `${column.width}px` : 'auto' }}
//                                 >
//                                     {column.title}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentData.map((item, index) => (
//                             <tr
//                                 key={item.settingType + index}
//                                 className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
//                             >
//                                 {columnsWithHandler.map((column) => (
//                                     <td key={column.key} className="p-3 text-sm">
//                                         {column.render
//                                             ? column.render(item[column.dataIndex as keyof StoreSetting], item, index)
//                                             : getDisplayValue(item[column.dataIndex as keyof StoreSetting])
//                                         }
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
//                 <p className="text-sm text-gray-500">
//                     Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Settings
//                 </p>
//                 <div className="flex items-center gap-2">
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="text-xs"
//                     >
//                         Previous
//                     </Button>

//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                         <Button
//                             key={page}
//                             variant={currentPage === page ? "default" : "outline"}
//                             size="sm"
//                             onClick={() => handlePageChange(page)}
//                             className="w-8 h-8 p-0 text-xs"
//                         >
//                             {page}
//                         </Button>
//                     ))}

//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className="text-xs"
//                     >
//                         Next
//                     </Button>
//                 </div>
//             </div>

//             <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//                 <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
//                     <DialogHeader className='flex flex-col'>
//                         <DialogTitle>Setting Details - {selectedSetting?.settingType || 'N/A'}</DialogTitle>
//                         <DialogDescription>
//                             Detailed information about the store setting
//                         </DialogDescription>
//                     </DialogHeader>

//                     {selectedSetting && (
//                         <div className="py-4">
//                             <div className="flex items-center justify-between mb-6">
//                                 <div>
//                                     <h3 className="text-lg font-semibold">{getDisplayValue(selectedSetting.settingType)}</h3>
//                                     <div className="flex items-center gap-2 mt-2">
//                                         <Badge className={`${getSettingTypeColor(selectedSetting.settingType)} text-xs px-2 py-1`}>
//                                             {getDisplayValue(selectedSetting.settingType)}
//                                         </Badge>
//                                         <Badge className={`${getStatusColor(selectedSetting.status)} text-xs px-2 py-1`}>
//                                             {getDisplayValue(selectedSetting.status)}
//                                         </Badge>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                                 <div className="space-y-2">
//                                     <p className="text-sm font-medium">Setting Type:</p>
//                                     <p className="text-sm font-mono bg-gray-50 p-2 rounded">{getDisplayValue(selectedSetting.settingType)}</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm font-medium">Store Code:</p>
//                                     <p className="text-sm">{getDisplayValue(selectedSetting.storeCode)}</p>
//                                 </div>
//                                 {selectedSetting.merchantCode && (
//                                     <div className="space-y-2">
//                                         <p className="text-sm font-medium">Merchant Code:</p>
//                                         <p className="text-sm">{getDisplayValue(selectedSetting.merchantCode)}</p>
//                                     </div>
//                                 )}
//                                 <div className="space-y-2">
//                                     <p className="text-sm font-medium">Status:</p>
//                                     <Badge className={`${getStatusColor(selectedSetting.status)} text-xs px-2 py-1 w-fit`}>
//                                         {getDisplayValue(selectedSetting.status)}
//                                     </Badge>
//                                 </div>
//                             </div>

//                             <div className="border-t pt-4">
//                                 <h4 className="font-medium mb-3">Description</h4>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
//                                     {getDisplayValue(selectedSetting.description)}
//                                 </p>
//                             </div>

//                             <div className="border-t pt-4 mt-4">
//                                 <h4 className="font-medium mb-3">Setting Values</h4>
//                                 <div className="bg-gray-50 p-3 rounded">
//                                     {selectedSetting.settingValues && selectedSetting.settingValues.length > 0 ? (
//                                         <ul className="text-sm space-y-1">
//                                             {selectedSetting.settingValues.map((value, index) => (
//                                                 <li key={index} className="py-1 border-b border-gray-200 last:border-b-0">
//                                                     <span className="font-mono">{value}</span>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     ) : (
//                                         <p className="text-sm text-gray-500">No values set</p>
//                                     )}
//                                 </div>
//                             </div>

//                             {selectedSetting.createdAt && selectedSetting.updatedAt && (
//                                 <div className="border-t pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="space-y-2">
//                                         <p className="text-sm font-medium">Created At:</p>
//                                         <p className="text-sm">{new Date(selectedSetting.createdAt).toLocaleString()}</p>
//                                     </div>
//                                     <div className="space-y-2">
//                                         <p className="text-sm font-medium">Updated At:</p>
//                                         <p className="text-sm">{new Date(selectedSetting.updatedAt).toLocaleString()}</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// const MobileSettingCard = ({ setting, onViewDetails }: { setting: StoreSetting; onViewDetails: (setting: StoreSetting) => void }) => {
//     return (
//         <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                         <Settings className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div>
//                         <p className="text-sm font-semibold text-gray-900">{getDisplayValue(setting.settingType)}</p>
//                         <p className="text-xs text-gray-500">{getDisplayValue(setting.description)}</p>
//                     </div>
//                 </div>
//                 <Badge className={`${getStatusColor(setting.status)} text-xs px-2 py-1`}>
//                     {getDisplayValue(setting.status)}
//                 </Badge>
//             </div>

//             <div className="text-sm text-gray-600">
//                 <p className="line-clamp-2">{getDisplayValue(setting.description)}</p>
//             </div>

//             <div className="text-sm text-gray-600">
//                 <p className="font-medium">Values:</p>
//                 <div className="text-xs bg-white p-2 rounded mt-1">
//                     {setting.settingValues && setting.settingValues.length > 0 ? (
//                         <p className="line-clamp-2">{getDisplayValue(setting.settingValues)}</p>
//                     ) : (
//                         <p className="text-gray-500">No values</p>
//                     )}
//                 </div>
//             </div>

//             <div className="flex items-center justify-between pt-2 border-t border-gray-200">
//                 <div>
//                     <p className="text-xs text-gray-500">Store Code</p>
//                     <p className="text-sm font-medium">{getDisplayValue(setting.storeCode)}</p>
//                 </div>
//                 <Button
//                     variant="ghost"
//                     size="sm"
//                     className="p-1"
//                     onClick={() => onViewDetails(setting)}
//                 >
//                     <Eye className="w-5 h-5" />
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default function StoreSettingsPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_STORE_SETTINGS', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage store settings"
//     });
//     const { user } = useUser();
//     const router = useRouter();
//     const { data, isLoading, error, refetch } = useQuery({
//         queryKey: ['store-settings-list', user?.storeCode],
//         queryFn: () => axiosInstance.request({
//             url: '/store-settings/fetch-all',
//             method: 'GET',
//             params: {
//                 storeCode: user?.storeCode
//             }
//         })
//     });

//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedSetting, setSelectedSetting] = useState<StoreSetting | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // Extract settings from the API response
//     const apiResponse: ApiResponse = data?.data || {};
//     const settings: StoreSetting[] = apiResponse.settings || [];

//     // Add storeCode to each setting if not present
//     const settingsWithStoreCode = settings.map(setting => ({
//         ...setting,
//         storeCode: setting.storeCode || user?.storeCode || ''
//     }));

//     const filteredSettings = settingsWithStoreCode.filter(setting =>
//         setting.settingType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         setting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (setting.settingValues && setting.settingValues.some(value =>
//             value.toLowerCase().includes(searchTerm.toLowerCase())
//         ))
//     );

//     const handleViewDetails = (setting: StoreSetting) => {
//         setSelectedSetting(setting);
//         setIsModalOpen(true);
//     };

//     const handleEditDetails = (setting: StoreSetting) => {
//         // For edit, we need to pass the setting data including originalId and originalSettingType
//         const params = new URLSearchParams({
//             edit: 'true',
//             settingType: setting.settingType,
//             description: setting.description,
//             status: setting.status,
//             settingValues: JSON.stringify(setting.settingValues || [])
//         });

//         if (setting.originalId) {
//             params.append('originalId', setting.originalId.toString());
//         }
//         if (setting.originalSettingType) {
//             params.append('originalSettingType', setting.originalSettingType);
//         }

//         router.push(`/admin/settings/add-settings?${params.toString()}`);
//     };

//     const columns: Column[] = [
//         {
//             title: 'Setting Type',
//             dataIndex: 'settingType',
//             key: 'settingType',
//             width: 200,
//             render: (text: string, record: StoreSetting) => (
//                 <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                         <Settings className="w-4 h-4 text-blue-600" />
//                     </div>
//                     <div>
//                         <p className="text-sm font-medium text-gray-900">{getDisplayValue(text)}</p>
//                         <Badge className={`${getSettingTypeColor(record.settingType)} text-xs px-2 py-0 mt-1`}>
//                             {getDisplayValue(record.settingType)}
//                         </Badge>
//                     </div>
//                 </div>
//             ),
//         },
//         {
//             title: 'Description',
//             dataIndex: 'description',
//             key: 'description',
//             width: 250,
//             render: (text: string) => (
//                 <p className="text-sm line-clamp-2">{getDisplayValue(text)}</p>
//             ),
//         },
//         {
//             title: 'Values',
//             dataIndex: 'settingValues',
//             key: 'settingValues',
//             width: 200,
//             render: (values: string[]) => (
//                 <p className="text-sm line-clamp-2 font-mono">{getDisplayValue(values)}</p>
//             ),
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             width: 100,
//             render: (text: string) => (
//                 <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 w-fit`}>
//                     {getDisplayValue(text)}
//                 </Badge>
//             ),
//         },
//         {
//             title: 'Actions',
//             dataIndex: 'actions',
//             key: 'actions',
//             width: 100,
//             render: (text: string, record: StoreSetting) => (
//                 <div className="flex gap-1">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1"
//                         onClick={() => handleViewDetails(record)}
//                     >
//                         <Eye className="w-5 h-5" />
//                     </Button>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1"
//                         onClick={() => handleEditDetails(record)}
//                     >
//                         <Edit className="w-4 h-4" />
//                     </Button>
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div className="min-h-screen bg-gradient-subtle">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center justify-between mb-8">
//                     <div className="flex items-center gap-4">
//                         <div>
//                             <h1 className="text-3xl font-bold text-foreground mb-2">
//                                 Store Settings
//                             </h1>
//                             <p className="text-muted-foreground">
//                                 Manage your store configuration and preferences
//                             </p>
//                         </div>
//                     </div>
//                     <div className="text-right">
//                         <p className="text-2xl font-bold text-foreground">{settings.length}</p>
//                         <p className="text-sm text-muted-foreground">Total Settings</p>
//                     </div>
//                 </div>

//                 <div className="space-y-6">
//                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                         <div className="relative flex-1 max-w-sm w-full">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                             <Input
//                                 placeholder="Search settings..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10"
//                             />
//                         </div>

//                         <div className="flex items-center gap-2 w-full sm:w-auto">
//                             <Link href="/admin/settings/add-settings" className="w-full sm:w-auto">
//                                 <Button className="w-full sm:w-auto gap-2">
//                                     <Plus className="w-4 h-4" />
//                                     Add Setting
//                                 </Button>
//                             </Link>
//                         </div>
//                     </div>

//                     <Card className="border-gray-200 shadow-sm">
//                         <CardHeader>
//                             <div className="flex items-center justify-between">
//                                 <CardTitle className="text-lg font-semibold text-gray-900">
//                                     Store Settings List
//                                 </CardTitle>
//                                 <Button variant="outline" size="sm" onClick={() => refetch()}>
//                                     Refresh
//                                 </Button>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             {isLoading ? (
//                                 <div className="flex justify-center items-center h-40">
//                                     <p className="text-gray-500">Loading settings...</p>
//                                 </div>
//                             ) : error ? (
//                                 <div className="flex justify-center items-center h-40">
//                                     <p className="text-red-500">Error loading settings</p>
//                                 </div>
//                             ) : settings.length === 0 ? (
//                                 <div className="flex justify-center items-center h-40 flex-col gap-4">
//                                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
//                                         <Settings className="w-8 h-8 text-gray-400" />
//                                     </div>
//                                     <p className="text-gray-500">No store settings found</p>
//                                     <p className="text-sm text-gray-400 text-center max-w-md">
//                                         Configure your store by adding settings for business hours, payment methods, shipping options, and more.
//                                     </p>
//                                     <Link href="/admin/settings/add-settings">
//                                         <Button className="gap-2">
//                                             <Plus className="w-4 h-4" />
//                                             Add Your First Setting
//                                         </Button>
//                                     </Link>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="block lg:hidden space-y-4">
//                                         {filteredSettings.map((setting, index) => (
//                                             <MobileSettingCard
//                                                 key={setting.settingType + index}
//                                                 setting={setting}
//                                                 onViewDetails={handleViewDetails}
//                                             />
//                                         ))}
//                                     </div>

//                                     <div className="hidden lg:block">
//                                         <DynamicTable
//                                             columns={columns}
//                                             data={filteredSettings}
//                                             onViewDetails={handleViewDetails}
//                                             onEditDetails={handleEditDetails}
//                                         />
//                                     </div>
//                                 </>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// }


// 'use client';
// import { usePageMetadata } from "@/hooks/usePageMetadata";

// export default function StoreSettingsPage() {
//     usePageMetadata('Store Settings', 'Manage your store settings');

//     return (
//         <div className="flex flex-col items-center justify-center py-16 mt-20 gap-3">
//             <p className="text-2xl font-medium text-dark-gray">Coming Soon</p>
//             <p className="text-sm text-medium-gray text-center max-w-[300px]">
//                 We're working hard to bring you a seamless way to access and manage store settings.
//             </p>
//         </div>
//     );
// }

'use client'
import React, { useState } from 'react';
import ResetPasswordModal from './change-password';
import TransactionPinModal from './pin/transaction-pin-modal';
import ResetPinModal from './pin/forgot-transaction-pin';
import ChangePinModal from './pin/change-transaction-pin';
import useUser from '@/store/userStore';
import ProfileSection from './profile-section';
import KycSection from './kyc-section';
import SecuritySection from './security-section';
import {
  UserFilledIcon, UserIcon,
  KycFilledIcon, KycIcon,
  LockFilledIcon, LockIcon,
} from '@/components/icons/icons';
import { ChevronRight } from 'lucide-react';
import { usePageMetadata } from '@/hooks/usePageMetadata';

type NavKey = 'profile' | 'kyc' | 'security';

interface NavItem {
  key: NavKey;
  label: string;
  IconActive: React.FC<{ className?: string }>;
  IconInactive: React.FC<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'profile', label: 'Profile', IconActive: UserIcon, IconInactive: UserFilledIcon },
  { key: 'kyc', label: 'KYC Verification', IconActive: KycIcon, IconInactive: KycFilledIcon },
  { key: 'security', label: 'Security', IconActive: LockIcon, IconInactive: LockFilledIcon },
];

export default function Settings(): React.ReactElement {
  usePageMetadata('Settings', 'Manage you account settings');
  const { user } = useUser();
  const [activeNav, setActiveNav] = useState<NavKey>('profile');

  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isTransactionPinOpen, setIsTransactionPinOpen] = useState(false);
  const [isResetPinOpen, setIsResetPinOpen] = useState(false);
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F5] px-2">
      <div className="max-w-5xl flex flex-col lg:flex-row gap-4">

        <nav className="w-full lg:w-[300px] shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden h-fit">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = activeNav === item.key;
            const Icon = isActive ? item.IconActive : item.IconInactive;
            return (
              <button
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                className={`w-full flex items-center justify-between px-4 py-4 transition-colors ${idx !== NAV_ITEMS.length - 1 ? 'border-b border-gray-100' : ''
                  } ${isActive ? 'bg-white' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isActive ? 'bg-faded-accent' : 'bg-faded-accent/10'
                    }`}>
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-medium-gray'}`} />
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-faded-accent' : 'text-dark-gray'}`}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-faded-accent' : 'text-medium-gray'}`} />
              </button>
            );
          })}
        </nav>

        <div className="flex-1 min-w-0">
          {activeNav === 'profile' && <ProfileSection />}

          {activeNav === 'kyc' && <KycSection />}

          {activeNav === 'security' && (
            <SecuritySection
              user={user}
              onChangePassword={() => setIsResetPasswordOpen(true)}
              onChangePin={() => setIsChangePinOpen(true)}
              onForgotPin={() => setIsResetPinOpen(true)}
              onSetPin={() => setIsTransactionPinOpen(true)}
            />
          )}
        </div>
      </div>

      <TransactionPinModal
        isOpen={isTransactionPinOpen}
        onClose={() => setIsTransactionPinOpen(false)}
      />
      <ChangePinModal
        isOpen={isChangePinOpen}
        setIsOpen={setIsChangePinOpen}
      />
      <ResetPinModal
        isOpen={isResetPinOpen}
        setIsOpen={setIsResetPinOpen}
      />
      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        setIsOpen={setIsResetPasswordOpen}
      />
    </div>
  );
}
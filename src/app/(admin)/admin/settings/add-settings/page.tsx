// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ArrowLeft, Save, Settings, Code, Type, FileText } from 'lucide-react';
// import useUser from '@/store/userStore';
// import axiosInstance from '@/utils/fetch-function';
// import { useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { usePermission } from '@/hooks/usePermissionBusiness';

// interface StoreSettingFormData {
//     id?: number;
//     originalId?: number;
//     originalSettingType?: string;
//     settingType: string;
//     description: string;
//     settingValues: string[];
//     status: string;
//     merchantCode: string;
//     storeCode: string;
// }

// const commonSettingTypes = [
//     'BUSINESS_HOURS',
//     'PAYMENT_METHODS',
//     'SHIPPING_OPTIONS',
//     'TAX_SETTINGS',
//     'CURRENCY',
//     'NOTIFICATIONS',
//     'SECURITY',
//     'INTEGRATIONS',
//     'GENERAL'
// ];

// const settingTypeExamples = {
//     BUSINESS_HOURS: '["09:00", "18:00", "monday", "tuesday", "wednesday", "thursday", "friday"]',
//     PAYMENT_METHODS: '["credit_card", "debit_card", "cash", "bank_transfer", "digital_wallet"]',
//     SHIPPING_OPTIONS: '["standard", "5.99", "3", "express", "12.99", "1"]',
//     TAX_SETTINGS: '["0.08", "true", "12345"]',
//     CURRENCY: '["NGN", "₦", "2"]',
//     NOTIFICATIONS: '["true", "false", "true", "true"]',
//     SECURITY: '["30", "90", "false"]',
//     INTEGRATIONS: '["stripe", "true", "false", "mailchimp", "false"]',
//     GENERAL: '["My Store", "contact@store.com", "+1234567890"]'
// };

// const settingTypeDescriptions = {
//     BUSINESS_HOURS: 'Store operating hours and days',
//     PAYMENT_METHODS: 'Accepted payment methods',
//     SHIPPING_OPTIONS: 'Shipping methods and pricing',
//     TAX_SETTINGS: 'Tax configuration and rates',
//     CURRENCY: 'Currency and formatting settings',
//     NOTIFICATIONS: 'Notification preferences',
//     SECURITY: 'Security and access controls',
//     INTEGRATIONS: 'Third-party integrations',
//     GENERAL: 'General store configuration'
// };

// export default function CreateStoreSettingPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_STORE_SETTINGS', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage store settings"
//     });
//     const searchParams = useSearchParams();
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
//     const { user } = useUser();
//     const router = useRouter();

//     const [formData, setFormData] = useState<StoreSettingFormData>({
//         settingType: '',
//         description: '',
//         settingValues: [],
//         status: 'ACTIVE',
//         merchantCode: user?.merchantCode || '',
//         storeCode: user?.storeCode || '',
//     });

//     const [valueInput, setValueInput] = useState<string>('');

//     // Fetch setting details for editing
//     const { data: settingData, isLoading: isLoadingSetting } = useQuery({
//         queryKey: ['setting-detail', editingSettingId],
//         queryFn: () => axiosInstance.request({
//             url: '/store-settings/detail',
//             method: 'GET',
//             params: {
//                 id: editingSettingId
//             }
//         }),
//         enabled: !!editingSettingId && isEditMode,
//     });

//     useEffect(() => {
//         const editParam = searchParams.get('edit');
//         const idParam = searchParams.get('id');

//         if (editParam === 'true' && idParam) {
//             setIsEditMode(true);
//             setEditingSettingId(idParam);
//         }
//     }, [searchParams]);

//     // Populate form when setting data is fetched
//     useEffect(() => {
//         if (settingData?.data && isEditMode) {
//             const setting = settingData.data;

//             // Convert settingValues array to string for textarea
//             const valuesString = Array.isArray(setting.settingValues)
//                 ? setting.settingValues.join('\n')
//                 : '';

//             setFormData({
//                 id: setting.id,
//                 originalId: setting.id,
//                 originalSettingType: setting.settingType,
//                 settingType: setting.settingType || '',
//                 description: setting.description || '',
//                 settingValues: Array.isArray(setting.settingValues) ? setting.settingValues : [],
//                 status: setting.status || 'ACTIVE',
//                 merchantCode: setting.merchantCode || user?.merchantCode || '',
//                 storeCode: setting.storeCode || user?.storeCode || '',
//             });

//             setValueInput(valuesString);
//         }
//     }, [settingData, isEditMode, user]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSelectChange = (name: string, value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));

//         // Auto-populate description and example values when setting type changes
//         if (name === 'settingType' && value && settingTypeDescriptions[value as keyof typeof settingTypeDescriptions]) {
//             setFormData(prev => ({
//                 ...prev,
//                 description: settingTypeDescriptions[value as keyof typeof settingTypeDescriptions] || ''
//             }));

//             // Set example values based on type
//             if (settingTypeExamples[value as keyof typeof settingTypeExamples]) {
//                 const exampleValues = settingTypeExamples[value as keyof typeof settingTypeExamples];
//                 setValueInput(JSON.parse(exampleValues).join('\n'));
//             }
//         }
//     };

//     const handleValueInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         const value = e.target.value;
//         setValueInput(value);

//         // Convert textarea input to array for settingValues
//         const valuesArray = value
//             .split('\n')
//             .map(item => item.trim())
//             .filter(item => item.length > 0);

//         setFormData(prev => ({
//             ...prev,
//             settingValues: valuesArray
//         }));
//     };

//     const validateValues = (values: string[]): boolean => {
//         if (values.length === 0) {
//             toast.error('At least one value is required');
//             return false;
//         }
//         return true;
//     };

//     const createSettingMutation = useMutation({
//         mutationFn: (settingData: StoreSettingFormData) => {
//             const payload = {
//                 settingType: settingData.settingType,
//                 description: settingData.description,
//                 settingValues: settingData.settingValues,
//                 status: settingData.status,
//                 ...(isEditMode && {
//                     originalId: settingData.originalId,
//                     originalSettingType: settingData.originalSettingType
//                 })
//             };

//             const params = {
//                 storeCode: settingData.storeCode,
//                 ownerType: 'STORE'
//             };

//             return axiosInstance.post('/store-settings/save', payload, { params });
//         },
//         onSuccess: (data) => {
//             toast.success(isEditMode ? 'Setting updated successfully' : 'Setting created successfully');
//             router.push('/admin/settings');
//         },
//         onError: (error: any) => {
//             toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} setting`);
//         }
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!validateValues(formData.settingValues)) {
//             return;
//         }

//         const payload = {
//             ...formData,
//             merchantCode: user?.merchantCode || '',
//             storeCode: user?.storeCode || '',
//         };

//         createSettingMutation.mutate(payload);
//     };

//     const formatValues = () => {
//         if (!valueInput) return;

//         const valuesArray = valueInput
//             .split('\n')
//             .map(item => item.trim())
//             .filter(item => item.length > 0);

//         setValueInput(valuesArray.join('\n'));
//         toast.success('Values formatted successfully');
//     };

//     if (isLoadingSetting) {
//         return (
//             <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-500">Loading setting data...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-subtle">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center mb-6">
//                     <Button
//                         variant="ghost"
//                         onClick={() => router.back()}
//                         className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground"
//                     >
//                         <ArrowLeft className="w-4 h-4" />
//                         Back to Settings
//                     </Button>
//                 </div>

//                 <div className="flex items-center justify-center mb-8">
//                     <div className="text-center">
//                         <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
//                             <Settings className="w-8 h-8 text-accent-foreground" />
//                         </div>
//                         <h1 className="text-3xl font-bold text-accent-foreground">
//                             {isEditMode ? 'Edit Store Setting' : 'Create Store Setting'}
//                         </h1>
//                         <p className="text-muted-foreground mt-2">
//                             {isEditMode ? 'Update store configuration' : 'Add a new store configuration setting'}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="max-w-4xl mx-auto">
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-md">
//                             <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                                 <Code className="h-5 w-5" />
//                                 Setting Information
//                             </h2>
//                             <p className="text-muted-foreground mb-6">Basic setting identification and classification</p>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="settingType" className="flex items-center gap-1 text-sm font-medium">
//                                         <span>Setting Type</span>
//                                         <span className="text-destructive">*</span>
//                                     </Label>
//                                     <Select
//                                         value={formData.settingType}
//                                         onValueChange={(value) => handleSelectChange('settingType', value)}
//                                     >
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select setting type" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {commonSettingTypes.map((type) => (
//                                                 <SelectItem key={type} value={type}>
//                                                     {type.replace(/_/g, ' ').toLowerCase()}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                     <p className="text-xs text-muted-foreground">
//                                         Category for organizing related settings
//                                     </p>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="status" className="text-sm font-medium">Status</Label>
//                                     <Select
//                                         value={formData.status}
//                                         onValueChange={(value) => handleSelectChange('status', value)}
//                                     >
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select status" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="ACTIVE">Active</SelectItem>
//                                             <SelectItem value="INACTIVE">Inactive</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>

//                                 <div className="space-y-2 md:col-span-2">
//                                     <Label htmlFor="description" className="flex items-center gap-1 text-sm font-medium">
//                                         <span>Description</span>
//                                         <span className="text-destructive">*</span>
//                                     </Label>
//                                     <div className="relative">
//                                         <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                                         <Textarea
//                                             id="description"
//                                             name="description"
//                                             value={formData.description}
//                                             onChange={handleInputChange}
//                                             className="pl-10 min-h-[80px]"
//                                             placeholder="Describe what this setting controls..."
//                                             required
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-md">
//                             <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                                 <Type className="h-5 w-5" />
//                                 Setting Values
//                             </h2>
//                             <p className="text-muted-foreground mb-6">Enter values for this setting (one per line)</p>

//                             <div className="space-y-4">
//                                 <div className="flex items-center gap-4">
//                                     <Label className="text-sm font-medium">Values Format:</Label>
//                                     <div className="flex gap-2">
//                                         <Button
//                                             type="button"
//                                             variant="outline"
//                                             size="sm"
//                                             onClick={formatValues}
//                                         >
//                                             Format Values
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="settingValues" className="flex items-center gap-1 text-sm font-medium">
//                                         <span>Setting Values</span>
//                                         <span className="text-destructive">*</span>
//                                     </Label>
//                                     <Textarea
//                                         id="settingValues"
//                                         name="settingValues"
//                                         value={valueInput}
//                                         onChange={handleValueInputChange}
//                                         className="min-h-[120px] font-mono text-sm"
//                                         placeholder="Enter setting values, one per line...
// Example:
// value1
// value2
// value3"
//                                         required
//                                     />
//                                     <p className="text-xs text-muted-foreground">
//                                         Enter one value per line. These will be stored as an array.
//                                     </p>
//                                 </div>

//                                 {formData.settingType && settingTypeExamples[formData.settingType as keyof typeof settingTypeExamples] && (
//                                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                                         <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
//                                             <Settings className="w-4 h-4" />
//                                             Example for {formData.settingType.replace(/_/g, ' ').toLowerCase()}:
//                                         </h4>
//                                         <pre className="text-xs text-blue-800 bg-blue-100 p-2 rounded overflow-x-auto">
//                                             {JSON.parse(settingTypeExamples[formData.settingType as keyof typeof settingTypeExamples]).join('\n')}
//                                         </pre>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="flex justify-end gap-4 pt-4">
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={() => router.back()}
//                                 className="flex items-center gap-2"
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 type="submit"
//                                 disabled={createSettingMutation.isPending}
//                                 className="gap-2 bg-accent hover:bg-accent/90 text-white"
//                             >
//                                 <Save className="w-4 h-4" />
//                                 {createSettingMutation.isPending ? 'Processing...' : (isEditMode ? 'Submit' : 'Submit')}
//                             </Button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }
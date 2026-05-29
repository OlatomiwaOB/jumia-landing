// 'use client'
// import React, { useState, useEffect, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import { ArrowLeft, Save, Loader2, Info } from 'lucide-react';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import useGetLookup from "@/app/hooks/useGetLookup";
// import { SelectOption } from '@/types';
// import { usePermission } from '@/hooks/usePermission';

// interface SubscriptionFeature {
//     featureCode: string;
//     name: string;
//     value: string;
// }

// interface SubscriptionFormData {
//     id: number;
//     tierCode: string;
//     name: string;
//     description: string;
//     subscriptionType: string;
//     amount: number;
//     currencyCode: string;
//     status: string;
//     features: SubscriptionFeature[];
// }

// const FEATURES_CONFIG = [
//     {
//         featureCode: 'DIGITAL_STOREFRONT',
//         name: 'Access to Digital Storefront',
//         type: 'checkbox',
//         defaultValue: 'YES'
//     },
//     {
//         featureCode: 'PRODUCT_LIMIT',
//         name: 'Product Listing Limit',
//         type: 'limit',
//         defaultValue: '30'
//     },
//     {
//         featureCode: 'PRODUCT_MANAGEMENT',
//         name: 'Product Management (Create/Edit/Delete)',
//         type: 'radio',
//         options: ['BASIC', 'ADVANCED'],
//         defaultValue: 'BASIC'
//     },
//     {
//         featureCode: 'MARKET_ANALYSIS',
//         name: 'Market Analysis & Insights',
//         type: 'radio',
//         options: ['BASIC', 'ENHANCED', 'ADVANCED'],
//         defaultValue: 'BASIC'
//     },
//     {
//         featureCode: 'STORE_VISIBILITY',
//         name: 'Store Visibility on Find Stores (Web & Mobile)',
//         type: 'radio',
//         options: ['NO', 'YES', 'PRIORITY'],
//         defaultValue: 'NO'
//     },
//     {
//         featureCode: 'BANNER_PUBLICITY',
//         name: 'Banner Publicity',
//         type: 'radio',
//         options: ['NO', 'STANDARD', 'PRIORITY'],
//         defaultValue: 'NO'
//     },
//     {
//         featureCode: 'PICKUP_SERVICE',
//         name: 'Pickup as a Service (Fortitude Logistics)',
//         type: 'checkbox',
//         defaultValue: 'NO'
//     },
//     {
//         featureCode: 'CUSTOMER_SUPPORT',
//         name: 'Customer & Merchant Support',
//         type: 'radio',
//         options: ['STANDARD', 'PRIORITY'],
//         defaultValue: 'STANDARD'
//     },
//     {
//         featureCode: 'FEATURE_PRODUCT',
//         name: 'Feature Product',
//         type: 'checkbox',
//         defaultValue: 'NO'
//     },
//     {
//         featureCode: 'ON_SALE',
//         name: 'On Sale',
//         type: 'checkbox',
//         defaultValue: 'NO'
//     }
// ] as const;

// export default function CreateEditSubscriptionPlanPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_SUBS', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage subscriptions"
//     });
//     const searchParams = useSearchParams();
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [editingId, setEditingId] = useState<number | null>(null);
//     const router = useRouter();

//     const tierCodeOptions: SelectOption[] = useGetLookup('TIER_CODE');
//     const subscriptionTypeOptions: SelectOption[] = useGetLookup('SUBSCRIPTION_TYPE');
//     const currencyOptions: SelectOption[] = [
//         { id: 'NGN', name: 'Nigerian Naira (NGN)', description: 'Nigerian Naira' },
//     ];
//     const statusOptions: SelectOption[] = useGetLookup('STATUS');

//     const isInitializedRef = useRef(false);
//     const formDataRef = useRef({
//         id: 0,
//         tierCode: '',
//         name: '',
//         description: '',
//         subscriptionType: '',
//         amount: 0,
//         currencyCode: 'NGN',
//         status: 'ACTIVE',
//         features: [] as SubscriptionFeature[]
//     });

//     const [formData, setFormData] = useState<SubscriptionFormData>({
//         id: 0,
//         tierCode: '',
//         name: '',
//         description: '',
//         subscriptionType: '',
//         amount: 0,
//         currencyCode: 'NGN',
//         status: 'ACTIVE',
//         features: []
//     });

//     const [productLimitUnlimited, setProductLimitUnlimited] = useState(false);
//     const [productLimitValue, setProductLimitValue] = useState('30');
//     const [selectedTierInfo, setSelectedTierInfo] = useState<SelectOption | null>(null);
//     const [isLoadingData, setIsLoadingData] = useState(false);

//     const { data: planData, isLoading: isLoadingPlan } = useQuery({
//         queryKey: ['subscription-plan-detail', editingId],
//         queryFn: () => axiosOperations.request({
//             url: `/subscription-plan/fetch/${editingId}`,
//             method: 'GET'
//         }),
//         enabled: !!editingId && isEditMode,
//     });

//     useEffect(() => {
//         const idParam = searchParams.get('id');

//         if (idParam) {
//             const id = parseInt(idParam);
//             if (!isNaN(id)) {
//                 setIsEditMode(true);
//                 setEditingId(id);
//             }
//         }
//     }, [searchParams]);

//     useEffect(() => {
//         if (isEditMode && planData?.data?.subscriptionList?.[0] && !isInitializedRef.current) {
//             const plan = planData.data.subscriptionList[0];

//             if (tierCodeOptions.length === 0 || subscriptionTypeOptions.length === 0 || statusOptions.length === 0) {
//                 // console.log('Waiting for lookups to load...');
//                 return;
//             }

//             setIsLoadingData(true);
//             const features = plan.features || [];

//             const productLimitFeature = features.find((f: any) => f.featureCode === 'PRODUCT_LIMIT');
//             if (productLimitFeature) {
//                 const isUnlimited = productLimitFeature.value === 'UNLIMITED';
//                 setProductLimitUnlimited(isUnlimited);
//                 if (!isUnlimited) {
//                     setProductLimitValue(productLimitFeature.value);
//                 }
//             }

//             const planTierCode = (plan.tierCode || '').toLowerCase();
//             const planSubscriptionType = (plan.subscriptionType || '').toLowerCase();
//             const planStatus = (plan.status || '').toLowerCase();

//             const tierInfo = tierCodeOptions.find(option => option.id.toLowerCase() === planTierCode);
//             const subscriptionType = subscriptionTypeOptions.find(option => option.id.toLowerCase() === planSubscriptionType);
//             const status = statusOptions.find(option => option.id.toLowerCase() === planStatus);

//             const newFormData = {
//                 id: plan.id || 0,
//                 tierCode: tierInfo?.id || plan.tierCode || '',
//                 name: plan.name || '',
//                 description: plan.description || '',
//                 subscriptionType: subscriptionType?.id || plan.subscriptionType || '',
//                 amount: plan.amount || 0,
//                 currencyCode: plan.currencyCode || 'NGN',
//                 status: status?.id || plan.status || 'Active',
//                 features: features
//             };

//             formDataRef.current = newFormData;

//             setFormData(newFormData);
//             setSelectedTierInfo(tierInfo || null);
//             isInitializedRef.current = true;
//             setIsLoadingData(false);
//         }
//     }, [planData, isEditMode, tierCodeOptions, subscriptionTypeOptions, statusOptions]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;

//         if (name === 'amount') {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: parseFloat(value) || 0
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//     };

//     const handleSelectChange = (name: string, value: string) => {

//         if (!value && formDataRef.current[name as keyof SubscriptionFormData]) {
//             // console.log(`Preventing empty value for ${name}, current value is:`, formDataRef.current[name as keyof SubscriptionFormData]);
//             return;
//         }

//         if (name === 'tierCode' && value) {
//             const tierInfo = tierCodeOptions.find(option => option.id === value);
//             setSelectedTierInfo(tierInfo || null);

//             if (tierInfo && !isEditMode) {
//                 setFormData(prev => ({
//                     ...prev,
//                     tierCode: value,
//                     name: tierInfo.name,
//                     description: tierInfo.description || ''
//                 }));

//                 const defaultFeatures = getDefaultFeaturesForTier(value);
//                 setFormData(prev => ({
//                     ...prev,
//                     features: defaultFeatures
//                 }));

//                 const productLimitFeature = defaultFeatures.find(f => f.featureCode === 'PRODUCT_LIMIT');
//                 if (productLimitFeature) {
//                     setProductLimitUnlimited(productLimitFeature.value === 'UNLIMITED');
//                     if (productLimitFeature.value !== 'UNLIMITED') {
//                         setProductLimitValue(productLimitFeature.value);
//                     }
//                 }
//                 return;
//             }
//         }

//         const newFormData = {
//             ...formData,
//             [name]: value
//         };

//         formDataRef.current = newFormData;

//         setFormData(newFormData);
//     };

//     const getDefaultFeaturesForTier = (tierCode: string): SubscriptionFeature[] => {
//         const defaults: Record<string, Record<string, string>> = {
//             BASIC: {
//                 DIGITAL_STOREFRONT: 'YES',
//                 PRODUCT_LIMIT: '30',
//                 PRODUCT_MANAGEMENT: 'BASIC',
//                 MARKET_ANALYSIS: 'BASIC',
//                 STORE_VISIBILITY: 'NO',
//                 BANNER_PUBLICITY: 'NO',
//                 PICKUP_SERVICE: 'NO',
//                 CUSTOMER_SUPPORT: 'STANDARD',
//                 FEATURE_PRODUCT: 'NO',
//                 ON_SALE: 'YES'
//             },
//             STANDARD: {
//                 DIGITAL_STOREFRONT: 'YES',
//                 PRODUCT_LIMIT: '50',
//                 PRODUCT_MANAGEMENT: 'BASIC',
//                 MARKET_ANALYSIS: 'ENHANCED',
//                 STORE_VISIBILITY: 'YES',
//                 BANNER_PUBLICITY: 'STANDARD',
//                 PICKUP_SERVICE: 'NO',
//                 CUSTOMER_SUPPORT: 'STANDARD',
//                 FEATURE_PRODUCT: 'YES',
//                 ON_SALE: 'YES'
//             },
//             PREMIUM: {
//                 DIGITAL_STOREFRONT: 'YES',
//                 PRODUCT_LIMIT: 'UNLIMITED',
//                 PRODUCT_MANAGEMENT: 'ADVANCED',
//                 MARKET_ANALYSIS: 'ADVANCED',
//                 STORE_VISIBILITY: 'PRIORITY',
//                 BANNER_PUBLICITY: 'PRIORITY',
//                 PICKUP_SERVICE: 'YES',
//                 CUSTOMER_SUPPORT: 'PRIORITY',
//                 FEATURE_PRODUCT: 'YES',
//                 ON_SALE: 'YES'
//             }
//         };

//         const tierDefaults = defaults[tierCode.toUpperCase()] || {};

//         return FEATURES_CONFIG.map(feature => ({
//             featureCode: feature.featureCode,
//             name: feature.name,
//             value: tierDefaults[feature.featureCode] || feature.defaultValue
//         }));
//     };

//     const handleFeatureChange = (featureCode: string, value: string) => {
//         setFormData(prev => {
//             const existingIndex = prev.features.findIndex(f => f.featureCode === featureCode);
//             const featureConfig = FEATURES_CONFIG.find(f => f.featureCode === featureCode);

//             if (existingIndex >= 0) {
//                 const newFeatures = [...prev.features];
//                 newFeatures[existingIndex] = {
//                     ...newFeatures[existingIndex],
//                     value
//                 };
//                 return { ...prev, features: newFeatures };
//             } else {
//                 return {
//                     ...prev,
//                     features: [
//                         ...prev.features,
//                         {
//                             featureCode,
//                             name: featureConfig?.name || featureCode,
//                             value
//                         }
//                     ]
//                 };
//             }
//         });

//         if (featureCode === 'PRODUCT_LIMIT') {
//             if (value === 'UNLIMITED') {
//                 setProductLimitUnlimited(true);
//             } else {
//                 setProductLimitUnlimited(false);
//                 setProductLimitValue(value);
//             }
//         }
//     };

//     const getFeatureValue = (featureCode: string): string => {
//         const feature = formData.features.find(f => f.featureCode === featureCode);
//         if (featureCode === 'PRODUCT_LIMIT') {
//             if (productLimitUnlimited) return 'UNLIMITED';
//             return productLimitValue;
//         }
//         return feature?.value || FEATURES_CONFIG.find(f => f.featureCode === featureCode)?.defaultValue || '';
//     };

//     const handleProductLimitToggle = (checked: boolean) => {
//         setProductLimitUnlimited(checked);
//         handleFeatureChange('PRODUCT_LIMIT', checked ? 'UNLIMITED' : productLimitValue);
//     };

//     const handleProductLimitInputChange = (value: string) => {
//         setProductLimitValue(value);
//         handleFeatureChange('PRODUCT_LIMIT', value);
//     };

//     const findLookupOption = (options: SelectOption[], value: string | null): SelectOption | null => {
//         if (!value || !options.length) return null;

//         return options.find(option =>
//             option.id.toLowerCase() === value.toLowerCase()
//         ) || null;
//     };

//     const getSelectDisplayValue = (options: SelectOption[], value: string | null): string => {
//         if (!value) return '';

//         const option = findLookupOption(options, value);
//         return option ? option.name : value;
//     };

//     const createPlanMutation = useMutation({
//         mutationFn: (planData: SubscriptionFormData) =>
//             axiosOperations.post('/subscription-plan/save', {
//                 ...planData,
//                 amount: planData.amount,
//                 features: planData.features.map(f => ({
//                     featureCode: f.featureCode,
//                     name: f.name,
//                     value: f.value
//                 }))
//             }),
//         onSuccess: (data) => {
//             if (data?.data?.code === '000') {
//                 toast.success('Subscription plan created successfully');
//                 router.push('/operations/subscriptions');
//             } else {
//                 toast.error(data?.data?.desc || 'Failed to create subscription plan');
//             }
//         },
//         onError: (error: any) => {
//             toast.error(error.response?.data?.message || 'Failed to create subscription plan');
//         }
//     });

//     const updatePlanMutation = useMutation({
//         mutationFn: (planData: SubscriptionFormData) =>
//             axiosOperations.post('/subscription-plan/save', {
//                 ...planData,
//                 id: planData.id,
//                 amount: planData.amount,
//                 features: planData.features.map(f => ({
//                     featureCode: f.featureCode,
//                     name: f.name,
//                     value: f.value
//                 }))
//             }),
//         onSuccess: (data) => {
//             if (data?.data?.code === '000') {
//                 toast.success('Subscription plan updated successfully');
//                 router.push('/operations/subscriptions');
//             } else {
//                 toast.error(data?.data?.desc || 'Failed to update subscription plan');
//             }
//         },
//         onError: (error: any) => {
//             toast.error(error.response?.data?.message || 'Failed to update subscription plan');
//         }
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!formData.tierCode) {
//             toast.error('Tier code is required');
//             return;
//         }

//         if (!formData.name.trim()) {
//             toast.error('Name is required');
//             return;
//         }

//         if (!formData.description.trim()) {
//             toast.error('Description is required');
//             return;
//         }

//         if (!formData.subscriptionType) {
//             toast.error('Subscription type is required');
//             return;
//         }

//         if (formData.amount <= 0) {
//             toast.error('Amount must be greater than 0');
//             return;
//         }

//         if (!formData.currencyCode) {
//             toast.error('Currency code is required');
//             return;
//         }

//         const allFeatures = FEATURES_CONFIG.map(config => {
//             const existingFeature = formData.features.find(f => f.featureCode === config.featureCode);
//             if (existingFeature) {
//                 return existingFeature;
//             }
//             return {
//                 featureCode: config.featureCode,
//                 name: config.name,
//                 value: config.defaultValue
//             };
//         });

//         const submitData = {
//             ...formData,
//             features: allFeatures
//         };

//         if (isEditMode) {
//             updatePlanMutation.mutate(submitData);
//         } else {
//             createPlanMutation.mutate(submitData);
//         }
//     };

//     const isLoading = isLoadingPlan || createPlanMutation.isPending || updatePlanMutation.isPending || isLoadingData;
//     const isLookupsLoading = isEditMode && (tierCodeOptions.length === 0 || subscriptionTypeOptions.length === 0 || statusOptions.length === 0);

//     const renderFeatureInput = (feature: typeof FEATURES_CONFIG[number]) => {
//         const value = getFeatureValue(feature.featureCode);
//         // console.log(`Rendering ${feature.featureCode} with value: ${value}`);

//         switch (feature.type) {
//             case 'checkbox':
//                 return (
//                     <div className="flex items-center space-x-2">
//                         <Checkbox
//                             id={feature.featureCode}
//                             checked={value === 'YES'}
//                             onCheckedChange={(checked) =>
//                                 handleFeatureChange(feature.featureCode, checked ? 'YES' : 'NO')
//                             }
//                         />
//                         <Label htmlFor={feature.featureCode} className="text-sm">
//                             Enabled
//                         </Label>
//                     </div>
//                 );

//             case 'limit':
//                 return (
//                     <div className="space-y-2">
//                         <div className="flex items-center space-x-2">
//                             <Checkbox
//                                 id={`${feature.featureCode}_unlimited`}
//                                 checked={productLimitUnlimited}
//                                 onCheckedChange={handleProductLimitToggle}
//                             />
//                             <Label htmlFor={`${feature.featureCode}_unlimited`} className="text-sm">
//                                 Unlimited
//                             </Label>
//                         </div>
//                         {!productLimitUnlimited && (
//                             <div className="relative">
//                                 <Input
//                                     type="number"
//                                     min="1"
//                                     value={productLimitValue}
//                                     onChange={(e) => handleProductLimitInputChange(e.target.value)}
//                                     className="border-accent/20"
//                                     placeholder="Enter product limit"
//                                 />
//                                 <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-accent-foreground/70">
//                                     products
//                                 </span>
//                             </div>
//                         )}
//                     </div>
//                 );

//             case 'radio':
//                 return (
//                     <div className="flex flex-col gap-2">
//                         {feature.options?.map(option => (
//                             <div key={option} className="flex items-center space-x-2">
//                                 <input
//                                     type="radio"
//                                     id={`${feature.featureCode}_${option}`}
//                                     name={feature.featureCode}
//                                     value={option}
//                                     checked={value === option}
//                                     onChange={(e) => handleFeatureChange(feature.featureCode, e.target.value)}
//                                     className="h-4 w-4 border-accent/20 text-accent"
//                                 />
//                                 <Label htmlFor={`${feature.featureCode}_${option}`} className="text-sm">
//                                     {option === 'BASIC' ? 'Basic' :
//                                         option === 'ADVANCED' ? 'Advanced' :
//                                             option === 'ENHANCED' ? 'Enhanced' :
//                                                 option === 'NO' ? 'No' :
//                                                     option === 'YES' ? 'Yes' :
//                                                         option === 'STANDARD' ? 'Standard' :
//                                                             option === 'PRIORITY' ? 'Priority' :
//                                                                 option}
//                                 </Label>
//                             </div>
//                         ))}
//                     </div>
//                 );

//             default:
//                 return null;
//         }
//     };

//     if (isLoadingPlan || isLoadingData) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
//                         <Loader2 className="w-8 h-8 text-accent-foreground animate-spin" />
//                     </div>
//                     <p className="text-accent-foreground/70">
//                         Loading subscription plan data...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center mb-6">
//                     <Button
//                         variant="ghost"
//                         onClick={() => router.back()}
//                         className="flex items-center gap-2 text-accent-foreground/70 hover:text-accent-foreground hover:bg-accent/10"
//                     >
//                         <ArrowLeft className="w-4 h-4" />
//                         Back to Plans
//                     </Button>
//                 </div>

//                 <div className="flex items-center justify-center mb-8">
//                     <div className="text-center">
//                         <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
//                             <div className="text-accent-foreground text-3xl">₦</div>
//                         </div>
//                         <h1 className="text-3xl font-bold text-accent-foreground">
//                             {isEditMode ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
//                         </h1>
//                         <p className="text-accent-foreground/70 mt-2">
//                             {isEditMode ? 'Update subscription plan details' : 'Create a new subscription plan for merchants'}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="max-w-6xl mx-auto">
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-sm">
//                             <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                                 <span className="">₦</span>
//                                 <span>Plan Information</span>
//                             </h2>
//                             <p className="text-accent-foreground/70 mb-6">Basic plan details and pricing</p>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="tierCode" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                         <span>Tier Code</span>
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     {isLookupsLoading ? (
//                                         <div className="flex items-center gap-2 p-3 border border-accent/20 rounded-md bg-accent/5">
//                                             <Loader2 className="h-4 w-4 animate-spin text-accent-foreground/70" />
//                                             <span className="text-sm text-accent-foreground/70">Loading tier codes...</span>
//                                         </div>
//                                     ) : (
//                                         <Select
//                                             value={formData.tierCode}
//                                             onValueChange={(value) => handleSelectChange('tierCode', value)}
//                                             disabled={isLoading}
//                                         >
//                                             <SelectTrigger className="border-accent/20">
//                                                 <SelectValue placeholder="Select tier">
//                                                     {formData.tierCode ? getSelectDisplayValue(tierCodeOptions, formData.tierCode) : "Select tier"}
//                                                 </SelectValue>
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {tierCodeOptions.map((option) => (
//                                                     <SelectItem key={option.id} value={option.id}>
//                                                         {option.name}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     )}
//                                     <p className="text-xs text-accent-foreground/70">
//                                         Selecting a tier will auto-fill name and description
//                                     </p>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="subscriptionType" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                         <span>Subscription Type</span>
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     {isLookupsLoading ? (
//                                         <div className="flex items-center gap-2 p-3 border border-accent/20 rounded-md bg-accent/5">
//                                             <Loader2 className="h-4 w-4 animate-spin text-accent-foreground/70" />
//                                             <span className="text-sm text-accent-foreground/70">Loading subscription types...</span>
//                                         </div>
//                                     ) : (
//                                         <Select
//                                             value={formData.subscriptionType}
//                                             onValueChange={(value) => handleSelectChange('subscriptionType', value)}
//                                             disabled={isLoading}
//                                         >
//                                             <SelectTrigger className="border-accent/20">
//                                                 <SelectValue placeholder="Select type">
//                                                     {formData.subscriptionType ? getSelectDisplayValue(subscriptionTypeOptions, formData.subscriptionType) : "Select type"}
//                                                 </SelectValue>
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {subscriptionTypeOptions.map((option) => (
//                                                     <SelectItem key={option.id} value={option.id}>
//                                                         {option.name}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     )}
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="name" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                         <span>Plan Name</span>
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     <Input
//                                         id="name"
//                                         name="name"
//                                         value={formData.name}
//                                         onChange={handleInputChange}
//                                         className="border-accent/20 text-accent-foreground"
//                                         placeholder="Enter plan name"
//                                         required
//                                         disabled={isLoading}
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="description" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                         <span>Description</span>
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     <Textarea
//                                         id="description"
//                                         name="description"
//                                         value={formData.description}
//                                         onChange={handleInputChange}
//                                         className="border-accent/20 text-accent-foreground min-h-[80px]"
//                                         placeholder="Enter plan description"
//                                         required
//                                         disabled={isLoading}
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="amount" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                         <span>Amount (₦)</span>
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     <div className="relative">
//                                         <Input
//                                             id="amount"
//                                             name="amount"
//                                             type="number"
//                                             step="0.01"
//                                             value={formData.amount}
//                                             onChange={handleInputChange}
//                                             className="border-accent/20 text-accent-foreground"
//                                             placeholder="Enter amount in Naira"
//                                             required
//                                             disabled={isLoading}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="currencyCode" className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
//                                         <span>Currency</span>
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     <Select
//                                         value={formData.currencyCode}
//                                         onValueChange={(value) => handleSelectChange('currencyCode', value)}
//                                         disabled={isLoading}
//                                     >
//                                         <SelectTrigger className="border-accent/20">
//                                             <SelectValue placeholder="Select currency">
//                                                 {getSelectDisplayValue(currencyOptions, formData.currencyCode)}
//                                             </SelectValue>
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {currencyOptions.map((option) => (
//                                                 <SelectItem key={option.id} value={option.id}>
//                                                     {option.name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="status" className="text-sm font-medium text-accent-foreground">
//                                         Status
//                                     </Label>
//                                     {isLookupsLoading ? (
//                                         <div className="flex items-center gap-2 p-3 border border-accent/20 rounded-md bg-accent/5">
//                                             <Loader2 className="h-4 w-4 animate-spin text-accent-foreground/70" />
//                                             <span className="text-sm text-accent-foreground/70">Loading status options...</span>
//                                         </div>
//                                     ) : (
//                                         <Select
//                                             value={formData.status}
//                                             onValueChange={(value) => handleSelectChange('status', value)}
//                                             disabled={isLoading}
//                                         >
//                                             <SelectTrigger className="border-accent/20">
//                                                 <SelectValue placeholder="Select status">
//                                                     {getSelectDisplayValue(statusOptions, formData.status)}
//                                                 </SelectValue>
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {statusOptions.map((option) => (
//                                                     <SelectItem key={option.id} value={option.id}>
//                                                         {option.name}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-sm">
//                             <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
//                                 <Info className="h-5 w-5" />
//                                 Features Configuration
//                             </h2>
//                             <p className="text-accent-foreground/70 mb-6">
//                                 Configure the features included in this subscription plan. Features are auto-filled based on selected tier.
//                             </p>

//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {FEATURES_CONFIG.map((feature) => (
//                                     <div key={feature.featureCode} className="space-y-3 p-4 border border-accent/10 rounded-lg">
//                                         <div>
//                                             <Label className="text-sm font-medium text-accent-foreground">
//                                                 {feature.name}
//                                             </Label>
//                                             <div className="text-xs text-accent-foreground/70">
//                                                 Code: {feature.featureCode}
//                                             </div>
//                                         </div>
//                                         {renderFeatureInput(feature)}
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="mt-6 p-4 bg-accent/5 border border-accent/10 rounded-lg">
//                                 <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground mb-2">
//                                     <Info className="h-4 w-4" />
//                                     Feature Summary
//                                 </div>
//                                 <div className="text-sm text-accent-foreground/70">
//                                     <p>All configured features will be saved with the plan. Changes here affect what merchants get when they subscribe.</p>
//                                     <div className="mt-2 grid grid-cols-2 gap-2">
//                                         <div>
//                                             <span className="font-medium">Configured Features:</span>
//                                             <span className="ml-2">{formData.features.length} / {FEATURES_CONFIG.length}</span>
//                                         </div>
//                                         {/* <div>
//                                             <span className="font-medium">Selected Tier:</span>
//                                             <span className="ml-2">{selectedTierInfo?.name || 'None selected'}</span>
//                                         </div> */}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex justify-end gap-4 pt-4">
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={() => router.back()}
//                                 className="flex items-center gap-2 border-accent/20 hover:bg-accent/10"
//                                 disabled={isLoading}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 className="gap-2 bg-accent hover:bg-accent/90 text-white"
//                             >
//                                 {isLoading ? (
//                                     <>
//                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                         Processing...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Save className="w-4 h-4" />
//                                         {isEditMode ? 'Update Plan' : 'Create Plan'}
//                                     </>
//                                 )}
//                             </Button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import useGetLookup from "@/app/hooks/useGetLookup";
import { SelectOption } from '@/types';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface SubscriptionFeature {
    featureCode: string;
    name: string;
    value: string;
}

interface SubscriptionFormData {
    id: number;
    tierCode: string;
    name: string;
    description: string;
    subscriptionType: string;
    amount: number;
    currencyCode: string;
    status: string;
    features: SubscriptionFeature[];
}

const FEATURES_CONFIG = [
    {
        featureCode: 'DIGITAL_STOREFRONT',
        name: 'Access to Digital Storefront',
        type: 'checkbox',
        defaultValue: 'YES'
    },
    {
        featureCode: 'PRODUCT_LIMIT',
        name: 'Product Listing Limit',
        type: 'limit',
        defaultValue: '30'
    },
    {
        featureCode: 'PRODUCT_MANAGEMENT',
        name: 'Product Management (Create/Edit/Delete)',
        type: 'radio',
        options: ['BASIC', 'ADVANCED'],
        defaultValue: 'BASIC'
    },
    {
        featureCode: 'MARKET_ANALYSIS',
        name: 'Market Analysis & Insights',
        type: 'radio',
        options: ['BASIC', 'ENHANCED', 'ADVANCED'],
        defaultValue: 'BASIC'
    },
    {
        featureCode: 'STORE_VISIBILITY',
        name: 'Store Visibility on Find Stores (Web & Mobile)',
        type: 'radio',
        options: ['NO', 'YES', 'PRIORITY'],
        defaultValue: 'NO'
    },
    {
        featureCode: 'BANNER_PUBLICITY',
        name: 'Banner Publicity',
        type: 'radio',
        options: ['NO', 'STANDARD', 'PRIORITY'],
        defaultValue: 'NO'
    },
    {
        featureCode: 'PICKUP_SERVICE',
        name: 'Pickup as a Service (Fortitude Logistics)',
        type: 'checkbox',
        defaultValue: 'NO'
    },
    {
        featureCode: 'CUSTOMER_SUPPORT',
        name: 'Customer & Merchant Support',
        type: 'radio',
        options: ['STANDARD', 'PRIORITY'],
        defaultValue: 'STANDARD'
    },
    {
        featureCode: 'FEATURE_PRODUCT',
        name: 'Feature Product',
        type: 'checkbox',
        defaultValue: 'NO'
    },
    {
        featureCode: 'ON_SALE',
        name: 'On Sale',
        type: 'checkbox',
        defaultValue: 'NO'
    }
] as const;

const FormSection = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-100 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1 mt-1">
                <h2 className="text-sm font-semibold text-dark-gray">{title}</h2>
                <p className="text-xs text-medium-gray mt-1">{subtitle}</p>
            </div>
            <div className="md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
            </div>
        </div>
    </div>
);

const FormField = ({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) => (
    <div className={`space-y-1.5 ${className || ''}`}>
        <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
        {children}
    </div>
);

export default function CreateEditSubscriptionPlanPage() {
    usePageMetadata('Subscription Plans', 'Create or edit subscription plans.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_SUBS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage subscriptions"
    });
    const searchParams = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const router = useRouter();

    const tierCodeOptions: SelectOption[] = useGetLookup('TIER_CODE');
    const subscriptionTypeOptions: SelectOption[] = useGetLookup('SUBSCRIPTION_TYPE');
    const currencyOptions: SelectOption[] = [
        { id: 'NGN', name: 'Nigerian Naira (NGN)', description: 'Nigerian Naira' },
    ];
    const statusOptions: SelectOption[] = useGetLookup('STATUS');

    const isInitializedRef = useRef(false);
    const formDataRef = useRef({
        id: 0,
        tierCode: '',
        name: '',
        description: '',
        subscriptionType: '',
        amount: 0,
        currencyCode: 'NGN',
        status: 'ACTIVE',
        features: [] as SubscriptionFeature[]
    });

    const [formData, setFormData] = useState<SubscriptionFormData>({
        id: 0,
        tierCode: '',
        name: '',
        description: '',
        subscriptionType: '',
        amount: 0,
        currencyCode: 'NGN',
        status: 'ACTIVE',
        features: []
    });

    const [productLimitUnlimited, setProductLimitUnlimited] = useState(false);
    const [productLimitValue, setProductLimitValue] = useState('30');
    const [selectedTierInfo, setSelectedTierInfo] = useState<SelectOption | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const { data: planData, isLoading: isLoadingPlan } = useQuery({
        queryKey: ['subscription-plan-detail', editingId],
        queryFn: () => axiosOperations.request({
            url: `/subscription-plan/fetch/${editingId}`,
            method: 'GET'
        }),
        enabled: !!editingId && isEditMode,
    });

    useEffect(() => {
        const idParam = searchParams.get('id');
        if (idParam) {
            const id = parseInt(idParam);
            if (!isNaN(id)) {
                setIsEditMode(true);
                setEditingId(id);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (isEditMode && planData?.data?.subscriptionList?.[0] && !isInitializedRef.current) {
            const plan = planData.data.subscriptionList[0];

            if (tierCodeOptions.length === 0 || subscriptionTypeOptions.length === 0 || statusOptions.length === 0) {
                return;
            }

            setIsLoadingData(true);
            const features = plan.features || [];

            const productLimitFeature = features.find((f: any) => f.featureCode === 'PRODUCT_LIMIT');
            if (productLimitFeature) {
                const isUnlimited = productLimitFeature.value === 'UNLIMITED';
                setProductLimitUnlimited(isUnlimited);
                if (!isUnlimited) {
                    setProductLimitValue(productLimitFeature.value);
                }
            }

            const planTierCode = (plan.tierCode || '').toLowerCase();
            const planSubscriptionType = (plan.subscriptionType || '').toLowerCase();
            const planStatus = (plan.status || '').toLowerCase();

            const tierInfo = tierCodeOptions.find(option => option.id.toLowerCase() === planTierCode);
            const subscriptionType = subscriptionTypeOptions.find(option => option.id.toLowerCase() === planSubscriptionType);
            const status = statusOptions.find(option => option.id.toLowerCase() === planStatus);

            const newFormData = {
                id: plan.id || 0,
                tierCode: tierInfo?.id || plan.tierCode || '',
                name: plan.name || '',
                description: plan.description || '',
                subscriptionType: subscriptionType?.id || plan.subscriptionType || '',
                amount: plan.amount || 0,
                currencyCode: plan.currencyCode || 'NGN',
                status: status?.id || plan.status || 'Active',
                features: features
            };

            formDataRef.current = newFormData;
            setFormData(newFormData);
            setSelectedTierInfo(tierInfo || null);
            isInitializedRef.current = true;
            setIsLoadingData(false);
        }
    }, [planData, isEditMode, tierCodeOptions, subscriptionTypeOptions, statusOptions]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'amount') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        if (!value && formDataRef.current[name as keyof SubscriptionFormData]) {
            return;
        }

        if (name === 'tierCode' && value) {
            const tierInfo = tierCodeOptions.find(option => option.id === value);
            setSelectedTierInfo(tierInfo || null);

            if (tierInfo && !isEditMode) {
                setFormData(prev => ({
                    ...prev,
                    tierCode: value,
                    name: tierInfo.name,
                    description: tierInfo.description || ''
                }));

                const defaultFeatures = getDefaultFeaturesForTier(value);
                setFormData(prev => ({ ...prev, features: defaultFeatures }));

                const productLimitFeature = defaultFeatures.find(f => f.featureCode === 'PRODUCT_LIMIT');
                if (productLimitFeature) {
                    setProductLimitUnlimited(productLimitFeature.value === 'UNLIMITED');
                    if (productLimitFeature.value !== 'UNLIMITED') {
                        setProductLimitValue(productLimitFeature.value);
                    }
                }
                return;
            }
        }

        const newFormData = { ...formData, [name]: value };
        formDataRef.current = newFormData;
        setFormData(newFormData);
    };

    const getDefaultFeaturesForTier = (tierCode: string): SubscriptionFeature[] => {
        const defaults: Record<string, Record<string, string>> = {
            BASIC: {
                DIGITAL_STOREFRONT: 'YES', PRODUCT_LIMIT: '30', PRODUCT_MANAGEMENT: 'BASIC',
                MARKET_ANALYSIS: 'BASIC', STORE_VISIBILITY: 'NO', BANNER_PUBLICITY: 'NO',
                PICKUP_SERVICE: 'NO', CUSTOMER_SUPPORT: 'STANDARD', FEATURE_PRODUCT: 'NO', ON_SALE: 'YES'
            },
            STANDARD: {
                DIGITAL_STOREFRONT: 'YES', PRODUCT_LIMIT: '50', PRODUCT_MANAGEMENT: 'BASIC',
                MARKET_ANALYSIS: 'ENHANCED', STORE_VISIBILITY: 'YES', BANNER_PUBLICITY: 'STANDARD',
                PICKUP_SERVICE: 'NO', CUSTOMER_SUPPORT: 'STANDARD', FEATURE_PRODUCT: 'YES', ON_SALE: 'YES'
            },
            PREMIUM: {
                DIGITAL_STOREFRONT: 'YES', PRODUCT_LIMIT: 'UNLIMITED', PRODUCT_MANAGEMENT: 'ADVANCED',
                MARKET_ANALYSIS: 'ADVANCED', STORE_VISIBILITY: 'PRIORITY', BANNER_PUBLICITY: 'PRIORITY',
                PICKUP_SERVICE: 'YES', CUSTOMER_SUPPORT: 'PRIORITY', FEATURE_PRODUCT: 'YES', ON_SALE: 'YES'
            }
        };
        const tierDefaults = defaults[tierCode.toUpperCase()] || {};
        return FEATURES_CONFIG.map(feature => ({
            featureCode: feature.featureCode,
            name: feature.name,
            value: tierDefaults[feature.featureCode] || feature.defaultValue
        }));
    };

    const handleFeatureChange = (featureCode: string, value: string) => {
        setFormData(prev => {
            const existingIndex = prev.features.findIndex(f => f.featureCode === featureCode);
            const featureConfig = FEATURES_CONFIG.find(f => f.featureCode === featureCode);
            if (existingIndex >= 0) {
                const newFeatures = [...prev.features];
                newFeatures[existingIndex] = { ...newFeatures[existingIndex], value };
                return { ...prev, features: newFeatures };
            } else {
                return { ...prev, features: [...prev.features, { featureCode, name: featureConfig?.name || featureCode, value }] };
            }
        });
        if (featureCode === 'PRODUCT_LIMIT') {
            if (value === 'UNLIMITED') { setProductLimitUnlimited(true); }
            else { setProductLimitUnlimited(false); setProductLimitValue(value); }
        }
    };

    const getFeatureValue = (featureCode: string): string => {
        const feature = formData.features.find(f => f.featureCode === featureCode);
        if (featureCode === 'PRODUCT_LIMIT') {
            if (productLimitUnlimited) return 'UNLIMITED';
            return productLimitValue;
        }
        return feature?.value || FEATURES_CONFIG.find(f => f.featureCode === featureCode)?.defaultValue || '';
    };

    const handleProductLimitToggle = (checked: boolean) => {
        setProductLimitUnlimited(checked);
        handleFeatureChange('PRODUCT_LIMIT', checked ? 'UNLIMITED' : productLimitValue);
    };

    const handleProductLimitInputChange = (value: string) => {
        setProductLimitValue(value);
        handleFeatureChange('PRODUCT_LIMIT', value);
    };

    const findLookupOption = (options: SelectOption[], value: string | null): SelectOption | null => {
        if (!value || !options.length) return null;
        return options.find(option => option.id.toLowerCase() === value.toLowerCase()) || null;
    };

    const getSelectDisplayValue = (options: SelectOption[], value: string | null): string => {
        if (!value) return '';
        const option = findLookupOption(options, value);
        return option ? option.name : value;
    };

    const createPlanMutation = useMutation({
        mutationFn: (planData: SubscriptionFormData) =>
            axiosOperations.post('/subscription-plan/save', {
                ...planData,
                amount: planData.amount,
                features: planData.features.map(f => ({ featureCode: f.featureCode, name: f.name, value: f.value }))
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Subscription plan created successfully');
                router.push('/operations/subscriptions');
            } else {
                toast.error(data?.data?.desc || 'Failed to create subscription plan');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create subscription plan');
        }
    });

    const updatePlanMutation = useMutation({
        mutationFn: (planData: SubscriptionFormData) =>
            axiosOperations.post('/subscription-plan/save', {
                ...planData,
                id: planData.id,
                amount: planData.amount,
                features: planData.features.map(f => ({ featureCode: f.featureCode, name: f.name, value: f.value }))
            }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Subscription plan updated successfully');
                router.push('/operations/subscriptions');
            } else {
                toast.error(data?.data?.desc || 'Failed to update subscription plan');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update subscription plan');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.tierCode) { toast.error('Tier code is required'); return; }
        if (!formData.name.trim()) { toast.error('Name is required'); return; }
        if (!formData.description.trim()) { toast.error('Description is required'); return; }
        if (!formData.subscriptionType) { toast.error('Subscription type is required'); return; }
        if (formData.amount <= 0) { toast.error('Amount must be greater than 0'); return; }
        if (!formData.currencyCode) { toast.error('Currency code is required'); return; }

        const allFeatures = FEATURES_CONFIG.map(config => {
            const existingFeature = formData.features.find(f => f.featureCode === config.featureCode);
            if (existingFeature) return existingFeature;
            return { featureCode: config.featureCode, name: config.name, value: config.defaultValue };
        });

        const submitData = { ...formData, features: allFeatures };
        if (isEditMode) { updatePlanMutation.mutate(submitData); }
        else { createPlanMutation.mutate(submitData); }
    };

    const isLoading = isLoadingPlan || createPlanMutation.isPending || updatePlanMutation.isPending || isLoadingData;
    const isLookupsLoading = isEditMode && (tierCodeOptions.length === 0 || subscriptionTypeOptions.length === 0 || statusOptions.length === 0);

    const renderFeatureInput = (feature: typeof FEATURES_CONFIG[number]) => {
        const value = getFeatureValue(feature.featureCode);
        switch (feature.type) {
            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={feature.featureCode}
                            checked={value === 'YES'}
                            onCheckedChange={(checked) => handleFeatureChange(feature.featureCode, checked ? 'YES' : 'NO')}
                        />
                        <Label htmlFor={feature.featureCode} className="text-sm cursor-pointer">Enabled</Label>
                    </div>
                );
            case 'limit':
                return (
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`${feature.featureCode}_unlimited`}
                                checked={productLimitUnlimited}
                                onCheckedChange={handleProductLimitToggle}
                            />
                            <Label htmlFor={`${feature.featureCode}_unlimited`} className="text-sm cursor-pointer">Unlimited</Label>
                        </div>
                        {!productLimitUnlimited && (
                            <Input
                                type="number"
                                min="1"
                                value={productLimitValue}
                                onChange={(e) => handleProductLimitInputChange(e.target.value)}
                                placeholder="Enter product limit"
                            />
                        )}
                    </div>
                );
            case 'radio':
                return (
                    <div className="flex flex-col gap-2">
                        {feature.options?.map(option => (
                            <div key={option} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id={`${feature.featureCode}_${option}`}
                                    name={feature.featureCode}
                                    value={option}
                                    checked={value === option}
                                    onChange={(e) => handleFeatureChange(feature.featureCode, e.target.value)}
                                    className="h-4 w-4 border-gray-300 text-orange-500 focus:ring-orange-500"
                                />
                                <Label htmlFor={`${feature.featureCode}_${option}`} className="text-sm cursor-pointer">
                                    {option === 'BASIC' ? 'Basic' : option === 'ADVANCED' ? 'Advanced' : option === 'ENHANCED' ? 'Enhanced' : option === 'NO' ? 'No' : option === 'YES' ? 'Yes' : option === 'STANDARD' ? 'Standard' : option === 'PRIORITY' ? 'Priority' : option}
                                </Label>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    if (isLoadingPlan || isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-medium-gray">Loading subscription plan data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <div className="max-w-6xl mx-auto">
                <div className="mb-4 px-2 pt-4">
                    <Button variant="link" onClick={() => router.push('/operations/subscriptions')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='px-2 pb-6'>
                    <div className="mb-6">
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                            {isEditMode ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
                        </h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">
                            {isEditMode ? 'Update subscription plan details' : 'Create a new subscription plan for merchants'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Plan Information Section */}
                        <div className='bg-white rounded-2xl p-4'>
                            <FormSection title="Plan Information" subtitle="Basic plan details and pricing.">
                                <FormField label="Tier Code" required>
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                                            <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                            <span className="text-sm text-medium-gray">Loading tier codes...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.tierCode}
                                            onValueChange={(value) => handleSelectChange('tierCode', value)}
                                            disabled={isLoading || isEditMode}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select tier">
                                                    {formData.tierCode ? getSelectDisplayValue(tierCodeOptions, formData.tierCode) : "Select tier"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {tierCodeOptions.map((option) => (
                                                    <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    {isEditMode && <p className="text-xs text-medium-gray mt-1">Tier cannot be changed</p>}
                                    {!isEditMode && <p className="text-xs text-medium-gray mt-1">Selecting a tier will auto-fill name and description</p>}
                                </FormField>

                                <FormField label="Subscription Type" required>
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                                            <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                            <span className="text-sm text-medium-gray">Loading subscription types...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.subscriptionType}
                                            onValueChange={(value) => handleSelectChange('subscriptionType', value)}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type">
                                                    {formData.subscriptionType ? getSelectDisplayValue(subscriptionTypeOptions, formData.subscriptionType) : "Select type"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subscriptionTypeOptions.map((option) => (
                                                    <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormField>

                                <FormField label="Plan Name" required>
                                    <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter plan name" required disabled={isLoading} />
                                </FormField>

                                <div className="col-span-2">
                                    <FormField label="Description" required>
                                        <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter plan description" rows={3} required disabled={isLoading} />
                                    </FormField>
                                </div>

                                <FormField label="Amount (₦)" required>
                                    <Input name="amount" type="number" step="0.01" value={formData.amount} onChange={handleInputChange} placeholder="Enter amount in Naira" required disabled={isLoading} />
                                </FormField>

                                <FormField label="Currency">
                                    <Select value={formData.currencyCode} onValueChange={(value) => handleSelectChange('currencyCode', value)} disabled={isLoading}>
                                        <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
                                        <SelectContent>
                                            {currencyOptions.map((option) => (
                                                <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField label="Status">
                                    {isLookupsLoading ? (
                                        <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                                            <Loader2 className="h-4 w-4 animate-spin text-medium-gray" />
                                            <span className="text-sm text-medium-gray">Loading status options...</span>
                                        </div>
                                    ) : (
                                        <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)} disabled={isLoading}>
                                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormField>
                            </FormSection>
                        </div>

                        {/* Features Section */}
                        <div className='bg-white rounded-2xl p-4'>
                            <div className="border-b border-gray-100 pb-6 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                    <div className="md:col-span-1 mt-1">
                                        <h2 className="text-sm font-semibold text-dark-gray">Features Configuration</h2>
                                        <p className="text-xs text-medium-gray mt-1">Configure the features included in this plan.</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {FEATURES_CONFIG.map((feature) => (
                                                <div key={feature.featureCode} className="p-4 border border-gray-200 rounded-xl space-y-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-dark-gray">{feature.name}</p>
                                                        <p className="text-[10px] text-medium-gray">{feature.featureCode}</p>
                                                    </div>
                                                    {renderFeatureInput(feature)}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-2 text-sm font-medium text-dark-gray mb-1">
                                                <span>Configured Features: {formData.features.length} / {FEATURES_CONFIG.length}</span>
                                            </div>
                                            <p className="text-xs text-medium-gray">All configured features will be saved with the plan.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : (isEditMode ? 'Update Plan' : 'Create Plan')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
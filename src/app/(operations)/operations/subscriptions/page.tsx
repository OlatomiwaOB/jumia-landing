// 'use client'
// import React, { useState, useMemo, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Download, Plus, Search, Eye, Edit, DollarSign, Calendar, CheckCircle, XCircle, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
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
// import { usePermission } from '@/hooks/usePermission';

// interface SubscriptionFeature {
//     featureCode: string;
//     name: string;
//     value: string;
// }

// interface SubscriptionPlan {
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

// interface Column {
//     title: string;
//     dataIndex: string;
//     key: string;
//     width?: number;
//     render?: (value: any, record: SubscriptionPlan, index: number) => React.ReactNode;
// }

// const getDisplayValue = (value: any): string => {
//     return value?.toString() || 'N/A';
// };

// const formatCurrency = (amount: number, currencyCode: string = 'NGN'): string => {
//     return new Intl.NumberFormat('en-NG', {
//         style: 'currency',
//         currency: currencyCode,
//         minimumFractionDigits: 2
//     }).format(amount);
// };

// const getTierColor = (tierCode: string): string => {
//     switch (tierCode?.toUpperCase()) {
//         case 'BASIC':
//             return 'bg-blue-100 text-blue-800 border-blue-200';
//         case 'STANDARD':
//             return 'bg-green-100 text-green-800 border-green-200';
//         case 'PREMIUM':
//             return 'bg-purple-100 text-purple-800 border-purple-200';
//         default:
//             return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
// };

// const getTypeColor = (type: string): string => {
//     switch (type?.toUpperCase()) {
//         case 'YEARLY':
//             return 'bg-yellow-100 text-yellow-800';
//         case 'WEEKLY':
//             return 'bg-orange-100 text-orange-800';
//         case 'MONTHLY':
//             return 'bg-blue-100 text-blue-800';
//         default:
//             return 'bg-gray-100 text-gray-800';
//     }
// };

// const getStatusColor = (status: string): string => {
//     switch (status?.toUpperCase()) {
//         case 'ACTIVE':
//             return 'bg-green-100 text-green-800';
//         case 'INACTIVE':
//             return 'bg-red-100 text-red-800';
//         default:
//             return 'bg-gray-100 text-gray-800';
//     }
// };

// const TIER_ORDER = ['BASIC', 'STANDARD', 'PREMIUM'];

// const GroupedTable = ({
//     columns,
//     data,
//     itemsPerPage = 10,
//     onViewDetails,
//     onEdit,
//     searchTerm
// }: {
//     columns: Column[];
//     data: SubscriptionPlan[];
//     itemsPerPage?: number;
//     onViewDetails: (plan: SubscriptionPlan) => void;
//     onEdit: (plan: SubscriptionPlan) => void;
//     searchTerm: string;
// }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({
//         BASIC: true,
//         STANDARD: true,
//         PREMIUM: true
//     });

//     useEffect(() => {
//         setCurrentPage(1);
//     }, [searchTerm]);

//     const groupedData = useMemo(() => {
//         const groups: Record<string, SubscriptionPlan[]> = {
//             BASIC: [],
//             STANDARD: [],
//             PREMIUM: []
//         };

//         data.forEach(plan => {
//             const tier = plan.tierCode?.toUpperCase() || 'BASIC';
//             if (groups[tier]) {
//                 groups[tier].push(plan);
//             } else {
//                 groups[tier] = [plan];
//             }
//         });

//         Object.keys(groups).forEach(tier => {
//             groups[tier].sort((a, b) => {
//                 const typeOrder = ['YEARLY', 'MONTHLY', 'WEEKLY'];
//                 return typeOrder.indexOf(a.subscriptionType) - typeOrder.indexOf(b.subscriptionType);
//             });
//         });

//         return groups;
//     }, [data]);

//     const totalVisibleItems = useMemo(() => {
//         return TIER_ORDER.reduce((total, tier) => {
//             if (expandedTiers[tier]) {
//                 return total + (groupedData[tier]?.length || 0);
//             }
//             return total;
//         }, 0);
//     }, [groupedData, expandedTiers]);

//     const totalPages = Math.ceil(totalVisibleItems / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

//     const getVisibleItemsForPage = () => {
//         const visibleItems: { plan: SubscriptionPlan, tier: string }[] = [];
//         let currentCount = 0;

//         for (const tier of TIER_ORDER) {
//             if (expandedTiers[tier] && groupedData[tier]) {
//                 for (const plan of groupedData[tier]) {
//                     if (currentCount >= startIndex && currentCount < endIndex) {
//                         visibleItems.push({ plan, tier });
//                     }
//                     currentCount++;
//                     if (visibleItems.length >= itemsPerPage) break;
//                 }
//             }
//             if (visibleItems.length >= itemsPerPage) break;
//         }

//         return visibleItems;
//     };

//     const visibleItems = getVisibleItemsForPage();

//     const handleViewDetails = (plan: SubscriptionPlan) => {
//         setSelectedPlan(plan);
//         setIsModalOpen(true);
//         onViewDetails(plan);
//     };

//     const handlePageChange = (page: number) => {
//         if (page >= 1 && page <= totalPages) {
//             setCurrentPage(page);
//         }
//     };

//     const toggleTierExpansion = (tier: string) => {
//         setExpandedTiers(prev => ({
//             ...prev,
//             [tier]: !prev[tier]
//         }));
//         setCurrentPage(1);
//     };

//     const columnsWithHandler = columns.map(col => {
//         if (col.key === 'actions') {
//             return {
//                 ...col,
//                 render: (text: string, record: SubscriptionPlan) => (
//                     <div className="flex gap-1">
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 hover:bg-accent/10"
//                             onClick={() => handleViewDetails(record)}
//                         >
//                             <Eye className="w-5 h-5 text-accent-foreground" />
//                         </Button>
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 hover:bg-accent/10"
//                             onClick={() => onEdit(record)}
//                         >
//                             <Edit className="w-4 h-4 text-accent-foreground" />
//                         </Button>
//                     </div>
//                 )
//             };
//         }
//         return col;
//     });

//     const tierCounts = TIER_ORDER.reduce((acc, tier) => {
//         acc[tier] = groupedData[tier]?.length || 0;
//         return acc;
//     }, {} as Record<string, number>);

//     return (
//         <>
//             <div className="w-full overflow-x-auto">
//                 <table className="w-full border-collapse">
//                     <thead>
//                         <tr className="border-b-2 border-accent/20">
//                             {columnsWithHandler.map((column) => (
//                                 <th
//                                     key={column.key}
//                                     className="text-left p-3 font-bold text-sm text-accent-foreground"
//                                     style={{ width: column.width ? `${column.width}px` : 'auto' }}
//                                 >
//                                     {column.title}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {TIER_ORDER.map(tier => {
//                             const tierPlans = groupedData[tier] || [];
//                             const isExpanded = expandedTiers[tier];
//                             const hasPlans = tierPlans.length > 0;

//                             if (!hasPlans) return null;

//                             return (
//                                 <React.Fragment key={tier}>
//                                     <tr className="bg-accent/5 border-y border-accent/20">
//                                         <td colSpan={columns.length} className="p-0">
//                                             <button
//                                                 onClick={() => toggleTierExpansion(tier)}
//                                                 className="w-full px-3 py-3 flex items-center justify-between hover:bg-accent/10 transition-colors"
//                                             >
//                                                 <div className="flex items-center gap-3">
//                                                     {isExpanded ? (
//                                                         <ChevronDown className="w-4 h-4 text-accent-foreground/70" />
//                                                     ) : (
//                                                         <ChevronRight className="w-4 h-4 text-accent-foreground/70" />
//                                                     )}
//                                                     <Badge className={`${getTierColor(tier)} text-sm px-3 py-1.5 font-semibold border`}>
//                                                         {tier} ({tierPlans.length})
//                                                     </Badge>
//                                                     <span className="text-sm text-accent-foreground/70">
//                                                         {tier === 'BASIC' ? 'Essential features for starting sellers' :
//                                                             tier === 'STANDARD' ? 'Enhanced features for growing businesses' :
//                                                                 'Full access plan for established merchants'}
//                                                     </span>
//                                                 </div>
//                                                 <div className="text-sm text-accent-foreground/70">
//                                                     {isExpanded ? 'Click to collapse' : 'Click to expand'}
//                                                 </div>
//                                             </button>
//                                         </td>
//                                     </tr>

//                                     {isExpanded && tierPlans.slice(0, itemsPerPage).map((plan, index) => (
//                                         <tr
//                                             key={plan.id}
//                                             className={`border-b border-accent/10 hover:bg-accent/5 ${index === tierPlans.length - 1 ? 'border-b-0' : ''}`}
//                                         >
//                                             {columnsWithHandler.map((column) => (
//                                                 <td key={column.key} className="p-3 text-sm text-accent-foreground">
//                                                     {column.render
//                                                         ? column.render(plan[column.dataIndex as keyof SubscriptionPlan], plan, index)
//                                                         : getDisplayValue(plan[column.dataIndex as keyof SubscriptionPlan])
//                                                     }
//                                                 </td>
//                                             ))}
//                                         </tr>
//                                     ))}
//                                 </React.Fragment>
//                             );
//                         })}

//                         {totalVisibleItems === 0 && (
//                             <tr>
//                                 <td colSpan={columns.length} className="p-8 text-center">
//                                     <p className="text-accent-foreground/70">No subscription plans found</p>
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-accent/10 gap-4">
//                 <div className="flex items-center gap-4">
//                     <p className="text-sm text-accent-foreground/70">
//                         Showing {Math.min(startIndex + 1, totalVisibleItems)} to {Math.min(endIndex, totalVisibleItems)} of {totalVisibleItems} Plans
//                     </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="text-xs border-accent/20 hover:bg-accent/10"
//                     >
//                         Previous
//                     </Button>

//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                         <Button
//                             key={page}
//                             variant={currentPage === page ? "default" : "outline"}
//                             size="sm"
//                             onClick={() => handlePageChange(page)}
//                             className={`w-8 h-8 p-0 text-xs ${currentPage === page ? 'bg-accent text-white' : 'border-accent/20 hover:bg-accent/10'}`}
//                         >
//                             {page}
//                         </Button>
//                     ))}

//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className="text-xs border-accent/20 hover:bg-accent/10"
//                     >
//                         Next
//                     </Button>
//                 </div>
//             </div>

//             <div className="mt-4 p-3 bg-accent/5 border border-accent/10 rounded-lg">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         {TIER_ORDER.map(tier => {
//                             const count = tierCounts[tier];
//                             if (count === 0) return null;
//                             return (
//                                 <div key={tier} className="flex items-center gap-1">
//                                     <div className={`w-3 h-3 rounded-full ${getTierColor(tier).split(' ')[0]}`} />
//                                     <span className="text-xs text-accent-foreground/70">
//                                         {tier}: {count}
//                                     </span>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => setExpandedTiers({
//                                 BASIC: true,
//                                 STANDARD: true,
//                                 PREMIUM: true
//                             })}
//                             className="text-xs"
//                         >
//                             Expand All
//                         </Button>
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => setExpandedTiers({
//                                 BASIC: false,
//                                 STANDARD: false,
//                                 PREMIUM: false
//                             })}
//                             className="text-xs"
//                         >
//                             Collapse All
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//                 <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden">
//                     <DialogHeader className='flex flex-col'>
//                         <DialogTitle className="text-accent-foreground">Subscription Plan Details</DialogTitle>
//                         <DialogDescription className="line-clamp-1 flex items-center gap-2">
//                             {selectedPlan?.name}
//                             <Badge className={getTypeColor(selectedPlan?.subscriptionType || '')}>
//                                 {getDisplayValue(selectedPlan?.subscriptionType || '')}
//                             </Badge>
//                         </DialogDescription>
//                     </DialogHeader>

//                     {selectedPlan && (
//                         <div className="py-4 overflow-y-auto max-h-[calc(80vh-120px)] pr-2">
//                             <div className="flex items-center justify-between mb-6 p-3 bg-accent/5 rounded-lg">
//                                 <div className="text-center">
//                                     <p className="text-xs text-accent-foreground/70">Price</p>
//                                     <p className="text-lg font-bold text-accent-foreground">
//                                         {formatCurrency(selectedPlan.amount, selectedPlan.currencyCode)}
//                                     </p>
//                                 </div>
//                                 <div className="text-center">
//                                     <p className="text-xs text-accent-foreground/70">Features</p>
//                                     <p className="text-lg font-bold text-accent-foreground">
//                                         {selectedPlan.features?.length || 0}
//                                     </p>
//                                 </div>
//                                 <div className="text-center">
//                                     <p className="text-xs text-accent-foreground/70">Status</p>
//                                     <Badge className={`${getStatusColor(selectedPlan.status)} text-xs`}>
//                                         {getDisplayValue(selectedPlan.status)}
//                                     </Badge>
//                                 </div>
//                             </div>

//                             <div className="mb-4">
//                                 <p className="mt-2 text-sm text-accent-foreground/70 mb-2 line-clamp-2">
//                                     {getDisplayValue(selectedPlan.description)}
//                                 </p>
//                                 {/* <div className="text-xs text-accent-foreground/50">
//                                     Plan ID: #{getDisplayValue(selectedPlan.id)}
//                                 </div> */}
//                             </div>

//                             <div className="border-t border-accent/10 pt-4">
//                                 <h4 className="font-medium text-accent-foreground mb-3 text-sm">Features ({selectedPlan.features?.length || 0})</h4>
//                                 <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
//                                     {selectedPlan.features && selectedPlan.features.length > 0 ? (
//                                         selectedPlan.features.map((feature, index) => (
//                                             <div key={index} className="flex items-start gap-2 p-2 hover:bg-accent/5 rounded">
//                                                 <div className="flex-shrink-0 mt-0.5">
//                                                     {feature.value === 'YES' ? (
//                                                         <CheckCircle className="w-3.5 h-3.5 text-green-600" />
//                                                     ) : feature.value === 'NO' ? (
//                                                         <XCircle className="w-3.5 h-3.5 text-red-600" />
//                                                     ) : feature.value === 'UNLIMITED' ? (
//                                                         <CheckCircle className="w-3.5 h-3.5 text-green-600" />
//                                                     ) : (
//                                                         <div className="w-3.5 h-3.5 rounded-full border border-accent/20"></div>
//                                                     )}
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-xs font-medium text-accent-foreground truncate">
//                                                         {feature.name}
//                                                     </p>
//                                                     <div className="flex items-center justify-between">
//                                                         <p className="text-xs text-accent-foreground/50 truncate">
//                                                             {feature.featureCode}
//                                                         </p>
//                                                         <span className={`text-xs font-medium ml-2 whitespace-nowrap ${feature.value === 'UNLIMITED' ? 'text-green-600' :
//                                                             feature.value === 'YES' ? 'text-green-600' :
//                                                                 feature.value === 'NO' ? 'text-red-600' :
//                                                                     'text-accent-foreground'
//                                                             }`}>
//                                                             {feature.value}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p className="text-sm text-accent-foreground/70 text-center py-4">No features configured</p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// const SimpleGroupedTable = ({
//     columns,
//     data,
//     itemsPerPage = 15,
//     onViewDetails,
//     onEdit,
//     searchTerm
// }: {
//     columns: Column[];
//     data: SubscriptionPlan[];
//     itemsPerPage?: number;
//     onViewDetails: (plan: SubscriptionPlan) => void;
//     onEdit: (plan: SubscriptionPlan) => void;
//     searchTerm: string;
// }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     useEffect(() => {
//         setCurrentPage(1);
//     }, [searchTerm]);

//     const groupedAndSortedData = useMemo(() => {
//         const groups: Record<string, SubscriptionPlan[]> = {
//             BASIC: [],
//             STANDARD: [],
//             PREMIUM: []
//         };

//         data.forEach(plan => {
//             const tier = plan.tierCode?.toUpperCase() || 'BASIC';
//             if (groups[tier]) {
//                 groups[tier].push(plan);
//             } else {
//                 groups[tier] = [plan];
//             }
//         });

//         Object.keys(groups).forEach(tier => {
//             groups[tier].sort((a, b) => {
//                 const typeOrder = ['YEARLY', 'MONTHLY', 'WEEKLY'];
//                 return typeOrder.indexOf(a.subscriptionType) - typeOrder.indexOf(b.subscriptionType);
//             });
//         });

//         const result: SubscriptionPlan[] = [];
//         TIER_ORDER.forEach(tier => {
//             if (groups[tier]?.length > 0) {
//                 result.push(...groups[tier]);
//             }
//         });

//         return result;
//     }, [data]);

//     const totalPages = Math.ceil(groupedAndSortedData.length / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const currentData = groupedAndSortedData.slice(startIndex, endIndex);

//     const handleViewDetails = (plan: SubscriptionPlan) => {
//         setSelectedPlan(plan);
//         setIsModalOpen(true);
//         onViewDetails(plan);
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
//                 render: (text: string, record: SubscriptionPlan) => (
//                     <div className="flex gap-1">
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 hover:bg-accent/10"
//                             onClick={() => handleViewDetails(record)}
//                         >
//                             <Eye className="w-5 h-5 text-accent-foreground" />
//                         </Button>
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 hover:bg-accent/10"
//                             onClick={() => onEdit(record)}
//                         >
//                             <Edit className="w-4 h-4 text-accent-foreground" />
//                         </Button>
//                     </div>
//                 )
//             };
//         }
//         return col;
//     });

//     let lastTier = '';

//     return (
//         <>
//             <div className="w-full overflow-x-auto">
//                 <table className="w-full border-collapse">
//                     <thead>
//                         <tr className="border-b-2 border-accent/20">
//                             {columnsWithHandler.map((column) => (
//                                 <th
//                                     key={column.key}
//                                     className="text-left p-3 font-bold text-sm text-accent-foreground"
//                                     style={{ width: column.width ? `${column.width}px` : 'auto' }}
//                                 >
//                                     {column.title}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentData.map((plan, index) => {
//                             const currentTier = plan.tierCode?.toUpperCase();
//                             const showTierHeader = currentTier !== lastTier;
//                             lastTier = currentTier;

//                             return (
//                                 <React.Fragment key={plan.id}>
//                                     {showTierHeader && (
//                                         <tr className="bg-accent/5">
//                                             <td colSpan={columns.length} className="p-2">
//                                                 <div className="flex items-center gap-2 px-3 py-2">
//                                                     <Badge className={`${getTierColor(currentTier)} text-sm px-3 py-1.5 font-semibold border`}>
//                                                         {currentTier} TIER
//                                                     </Badge>
//                                                     <span className="text-sm text-accent-foreground/70">
//                                                         {currentTier === 'BASIC' ? 'Essential plans for starting sellers' :
//                                                             currentTier === 'STANDARD' ? 'Enhanced plans for growing businesses' :
//                                                                 'Premium plans for established merchants'}
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     )}

//                                     <tr
//                                         className={`border-b border-accent/10 hover:bg-accent/5 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
//                                     >
//                                         {columnsWithHandler.map((column) => (
//                                             <td key={column.key} className="p-3 text-sm text-accent-foreground">
//                                                 {column.render
//                                                     ? column.render(plan[column.dataIndex as keyof SubscriptionPlan], plan, index)
//                                                     : getDisplayValue(plan[column.dataIndex as keyof SubscriptionPlan])
//                                                 }
//                                             </td>
//                                         ))}
//                                     </tr>
//                                 </React.Fragment>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-accent/10 gap-4">
//                 <p className="text-sm text-accent-foreground/70">
//                     Showing {startIndex + 1} to {Math.min(endIndex, groupedAndSortedData.length)} of {groupedAndSortedData.length} Plans
//                 </p>
//                 <div className="flex items-center gap-2">
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="text-xs border-accent/20 hover:bg-accent/10"
//                     >
//                         Previous
//                     </Button>

//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                         <Button
//                             key={page}
//                             variant={currentPage === page ? "default" : "outline"}
//                             size="sm"
//                             onClick={() => handlePageChange(page)}
//                             className={`w-8 h-8 p-0 text-xs ${currentPage === page ? 'bg-accent text-white' : 'border-accent/20 hover:bg-accent/10'}`}
//                         >
//                             {page}
//                         </Button>
//                     ))}

//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className="text-xs border-accent/20 hover:bg-accent/10"
//                     >
//                         Next
//                     </Button>
//                 </div>
//             </div>

//             <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//                 <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden">
//                     <DialogHeader className='flex flex-col'>
//                         <DialogTitle className="text-accent-foreground">Subscription Plan Details</DialogTitle>
//                         <DialogDescription className="line-clamp-1 flex items-center gap-2">
//                             {selectedPlan?.name}
//                             <Badge className={getTypeColor(selectedPlan?.subscriptionType || '')}>
//                                 {getDisplayValue(selectedPlan?.subscriptionType || '')}
//                             </Badge>
//                         </DialogDescription>
//                     </DialogHeader>

//                     {selectedPlan && (
//                         <div className="py-4 overflow-y-auto max-h-[calc(80vh-120px)] pr-2">
//                             <div className="flex items-center justify-between mb-6 p-3 bg-accent/5 rounded-lg">
//                                 <div className="text-center">
//                                     <p className="text-xs text-accent-foreground/70">Price</p>
//                                     <p className="text-lg font-bold text-accent-foreground">
//                                         {formatCurrency(selectedPlan.amount, selectedPlan.currencyCode)}
//                                     </p>
//                                 </div>
//                                 <div className="text-center">
//                                     <p className="text-xs text-accent-foreground/70">Features</p>
//                                     <p className="text-lg font-bold text-accent-foreground">
//                                         {selectedPlan.features?.length || 0}
//                                     </p>
//                                 </div>
//                                 <div className="text-center">
//                                     <p className="text-xs text-accent-foreground/70">Status</p>
//                                     <Badge className={`${getStatusColor(selectedPlan.status)} text-xs`}>
//                                         {getDisplayValue(selectedPlan.status)}
//                                     </Badge>
//                                 </div>
//                             </div>

//                             <div className="mb-4">
//                                 <p className="mt-2 text-sm text-accent-foreground/70 mb-2 line-clamp-2">
//                                     {getDisplayValue(selectedPlan.description)}
//                                 </p>
//                                 {/* <div className="text-xs text-accent-foreground/50">
//                                     Plan ID: #{getDisplayValue(selectedPlan.id)}
//                                 </div> */}
//                             </div>

//                             <div className="border-t border-accent/10 pt-4">
//                                 <h4 className="font-medium text-accent-foreground mb-3 text-sm">Features ({selectedPlan.features?.length || 0})</h4>
//                                 <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
//                                     {selectedPlan.features && selectedPlan.features.length > 0 ? (
//                                         selectedPlan.features.map((feature, index) => (
//                                             <div key={index} className="flex items-start gap-2 p-2 hover:bg-accent/5 rounded">
//                                                 <div className="flex-shrink-0 mt-0.5">
//                                                     {feature.value === 'YES' ? (
//                                                         <CheckCircle className="w-3.5 h-3.5 text-green-600" />
//                                                     ) : feature.value === 'NO' ? (
//                                                         <XCircle className="w-3.5 h-3.5 text-red-600" />
//                                                     ) : feature.value === 'UNLIMITED' || feature.value === 'STANDARD' ? (
//                                                         <CheckCircle className="w-3.5 h-3.5 text-green-600" />
//                                                     ) : (
//                                                         <div className="w-3.5 h-3.5 rounded-full border border-accent/20"></div>
//                                                     )}
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-xs font-medium text-accent-foreground truncate">
//                                                         {feature.name}
//                                                     </p>
//                                                     <div className="flex items-center justify-between">
//                                                         <p className="text-xs text-accent-foreground/50 truncate">
//                                                             {feature.featureCode}
//                                                         </p>
//                                                         <span className={`text-xs font-medium ml-2 whitespace-nowrap ${feature.value === 'UNLIMITED' ? 'text-green-600' :
//                                                             feature.value === 'YES' ? 'text-green-600' :
//                                                                 feature.value === 'NO' ? 'text-red-600' :
//                                                                     'text-accent-foreground'
//                                                             }`}>
//                                                             {feature.value}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p className="text-sm text-accent-foreground/70 text-center py-4">No features configured</p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// const MobilePlanCard = ({ plan, onViewDetails }: { plan: SubscriptionPlan; onViewDetails: (plan: SubscriptionPlan) => void }) => {
//     return (
//         <div className="bg-white rounded-lg p-4 space-y-3 border border-accent/20">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <p className="text-sm font-semibold text-accent-foreground">
//                         {getDisplayValue(plan.name)}
//                     </p>
//                     <p className="text-xs text-accent-foreground/70">ID: {getDisplayValue(plan.id)}</p>
//                 </div>
//                 <div className="flex flex-col items-end gap-1">
//                     <Badge className={getTierColor(plan.tierCode)}>
//                         {getDisplayValue(plan.tierCode)}
//                     </Badge>
//                     <Badge className={getTypeColor(plan.subscriptionType)}>
//                         {getDisplayValue(plan.subscriptionType)}
//                     </Badge>
//                 </div>
//             </div>

//             <p className="text-sm text-accent-foreground/80 line-clamp-2">
//                 {getDisplayValue(plan.description)}
//             </p>

//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                     <DollarSign className="w-4 h-4 text-accent-foreground" />
//                     <span className="text-sm font-semibold text-accent-foreground">
//                         {formatCurrency(plan.amount, plan.currencyCode)}
//                     </span>
//                 </div>
//                 <Badge className={getStatusColor(plan.status)}>
//                     {getDisplayValue(plan.status)}
//                 </Badge>
//             </div>

//             <div className="flex items-center justify-between pt-2 border-t border-accent/10">
//                 <div>
//                     <p className="text-xs text-accent-foreground/70">Features</p>
//                     <p className="text-sm text-accent-foreground">
//                         {plan.features?.length || 0} features
//                     </p>
//                 </div>
//                 <Button
//                     variant="ghost"
//                     size="sm"
//                     className="p-1 hover:bg-accent/10"
//                     onClick={() => onViewDetails(plan)}
//                 >
//                     <Eye className="w-5 h-5 text-accent-foreground" />
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default function SubscriptionPlansPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_SUBS', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage subscriptions"
//     });
//     const router = useRouter();
//     const { data, isLoading, error, refetch } = useQuery({
//         queryKey: ['subscription-plans'],
//         queryFn: () => axiosOperations.request({
//             url: '/subscription-plan/list',
//             method: 'GET'
//         })
//     });

//     const [searchTerm, setSearchTerm] = useState("");
//     const [showExpandedGroups, setShowExpandedGroups] = useState(false);

//     const subscriptionPlans: SubscriptionPlan[] = data?.data?.subscriptionList || [];

//     const filteredPlans = subscriptionPlans.filter(plan => {
//         const searchLower = searchTerm.toLowerCase();
//         return (
//             (plan.name?.toLowerCase() || '').includes(searchLower) ||
//             (plan.description?.toLowerCase() || '').includes(searchLower) ||
//             (plan.tierCode?.toLowerCase() || '').includes(searchLower) ||
//             (plan.subscriptionType?.toLowerCase() || '').includes(searchLower)
//         );
//     });

//     const handleViewDetails = (plan: SubscriptionPlan) => {
//     };

//     const handleEdit = (plan: SubscriptionPlan) => {
//         router.push(`/operations/subscriptions/create?id=${plan.id}`);
//     };

//     const columns: Column[] = [
//         {
//             title: 'S/N',
//             dataIndex: 'id',
//             key: 'sn',
//             width: 80,
//             render: (text: string, record: SubscriptionPlan, index: number) => (
//                 <p className="text-sm text-accent-foreground">{index + 1}</p>
//             ),
//         },
//         {
//             title: 'Plan Name',
//             dataIndex: 'name',
//             key: 'name',
//             width: 200,
//             render: (text: string, record: SubscriptionPlan) => (
//                 <div>
//                     <p className="text-sm font-medium text-accent-foreground">{getDisplayValue(text)}</p>
//                     <p className="text-xs text-accent-foreground/70 line-clamp-2">{getDisplayValue(record.description)}</p>
//                 </div>
//             ),
//         },
//         {
//             title: 'Tier',
//             dataIndex: 'tierCode',
//             key: 'tier',
//             width: 100,
//             render: (text: string) => (
//                 <Badge className={getTierColor(text)}>
//                     {getDisplayValue(text)}
//                 </Badge>
//             ),
//         },
//         {
//             title: 'Type',
//             dataIndex: 'subscriptionType',
//             key: 'type',
//             width: 100,
//             render: (text: string) => (
//                 <Badge className={getTypeColor(text)}>
//                     {getDisplayValue(text)}
//                 </Badge>
//             ),
//         },
//         {
//             title: 'Amount',
//             dataIndex: 'amount',
//             key: 'amount',
//             width: 120,
//             render: (amount: number, record: SubscriptionPlan) => (
//                 <div className="flex items-center gap-1">
//                     <p className="text-sm font-medium text-accent-foreground">
//                         {formatCurrency(amount, record.currencyCode)}
//                     </p>
//                 </div>
//             ),
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             width: 100,
//             render: (text: string) => (
//                 <Badge className={getStatusColor(text)}>
//                     {getDisplayValue(text)}
//                 </Badge>
//             ),
//         },
//         {
//             title: 'Features',
//             dataIndex: 'features',
//             key: 'features',
//             width: 100,
//             render: (features: SubscriptionFeature[]) => (
//                 <p className="text-sm text-accent-foreground">{features?.length || 0}</p>
//             ),
//         },
//         {
//             title: 'Actions',
//             dataIndex: 'actions',
//             key: 'actions',
//             width: 100,
//             render: (text: string, record: SubscriptionPlan) => (
//                 <div className="flex gap-1">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1 hover:bg-accent/10"
//                         onClick={() => handleViewDetails(record)}
//                     >
//                         <Eye className="w-5 h-5 text-accent-foreground" />
//                     </Button>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1 hover:bg-accent/10"
//                         onClick={() => handleEdit(record)}
//                     >
//                         <Edit className="w-4 h-4 text-accent-foreground" />
//                     </Button>
//                 </div>
//             ),
//         },
//     ];

//     const tierCounts = useMemo(() => {
//         const counts = { BASIC: 0, STANDARD: 0, PREMIUM: 0 };
//         filteredPlans.forEach(plan => {
//             const tier = plan.tierCode?.toUpperCase();
//             if (tier in counts) {
//                 counts[tier as keyof typeof counts]++;
//             }
//         });
//         return counts;
//     }, [filteredPlans]);

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center justify-between mb-8">
//                     <div className="flex items-center gap-4">
//                         <div>
//                             <h1 className="text-3xl font-bold text-accent-foreground mb-2">
//                                 Subscription Plans
//                             </h1>
//                             <p className="text-accent-foreground/70">
//                                 Manage subscription plans for merchants
//                             </p>
//                         </div>
//                     </div>
//                     <div className="text-right">
//                         <p className="text-2xl font-bold text-accent-foreground">{subscriptionPlans.length}</p>
//                         <p className="text-sm text-accent-foreground/70">Total Plans</p>
//                     </div>
//                 </div>

//                 <div className="space-y-6">
//                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                         <div className="relative flex-1 max-w-sm w-full">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
//                             <Input
//                                 placeholder="Search plans..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10 border-accent/20 text-accent-foreground"
//                             />
//                         </div>

//                         <div className="flex items-center gap-2 w-full sm:w-auto">
//                             <Link href="/operations/subscriptions/create" className="w-full sm:w-auto">
//                                 <Button className="w-full sm:w-auto gap-2 bg-accent hover:bg-accent/90 text-white">
//                                     <Plus className="w-4 h-4" />
//                                     Add Plan
//                                 </Button>
//                             </Link>
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => refetch()}
//                                 className="border-accent/20 hover:bg-accent/10"
//                             >
//                                 {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
//                             </Button>
//                         </div>
//                     </div>

//                     <Card className="border-accent/20 shadow-sm">
//                         <CardHeader>
//                             <div className="flex items-center justify-between">
//                                 <CardTitle className="text-lg font-semibold text-accent-foreground">
//                                     Subscription Plans List
//                                 </CardTitle>
//                                 <div className="flex items-center gap-2">
//                                     <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => setShowExpandedGroups(!showExpandedGroups)}
//                                         className="text-xs"
//                                     >
//                                         {showExpandedGroups ? 'Switch to Simple View' : 'Switch to Grouped View'}
//                                     </Button>
//                                 </div>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             {isLoading ? (
//                                 <div className="flex justify-center items-center h-40">
//                                     <div className="flex flex-col items-center gap-2">
//                                         <Loader2 className="w-8 h-8 animate-spin text-accent-foreground/70" />
//                                         <p className="text-accent-foreground/70">Loading subscription plans...</p>
//                                     </div>
//                                 </div>
//                             ) : error ? (
//                                 <div className="flex justify-center items-center h-40">
//                                     <p className="text-accent-foreground/70">Error loading subscription plans</p>
//                                 </div>
//                             ) : subscriptionPlans.length === 0 ? (
//                                 <div className="flex justify-center items-center h-40 flex-col gap-4">
//                                     <p className="text-accent-foreground/70">No subscription plans found</p>
//                                     <Link href="/operations/subscriptions/create">
//                                         <Button className="gap-2 bg-accent hover:bg-accent/90 text-white">
//                                             <Plus className="w-4 h-4" />
//                                             Create First Plan
//                                         </Button>
//                                     </Link>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="block lg:hidden space-y-4">
//                                         {filteredPlans.map((plan) => (
//                                             <MobilePlanCard
//                                                 key={plan.id}
//                                                 plan={plan}
//                                                 onViewDetails={handleViewDetails}
//                                             />
//                                         ))}
//                                     </div>

//                                     <div className="hidden lg:block">
//                                         {showExpandedGroups ? (
//                                             <GroupedTable
//                                                 columns={columns}
//                                                 data={filteredPlans}
//                                                 itemsPerPage={15}
//                                                 onViewDetails={handleViewDetails}
//                                                 onEdit={handleEdit}
//                                                 searchTerm={searchTerm}
//                                             />
//                                         ) : (
//                                             <SimpleGroupedTable
//                                                 columns={columns}
//                                                 data={filteredPlans}
//                                                 itemsPerPage={15}
//                                                 onViewDetails={handleViewDetails}
//                                                 onEdit={handleEdit}
//                                                 searchTerm={searchTerm}
//                                             />
//                                         )}
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

'use client'
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { Search, X, Eye, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { TransInflowIcon, SeperatorIcon, EditIcon } from '@/components/icons/icons';
import { SubscriptionPlanViewModal } from '@/components/Operations/subscriptions/subscription-details';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface SubscriptionFeature {
    featureCode: string;
    name: string;
    value: string;
}

interface SubscriptionPlan {
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

const getTierColor = (tierCode: string): string => {
    switch (tierCode?.toUpperCase()) {
        case 'BASIC': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'STANDARD': return 'bg-green-100 text-green-700 border-green-200';
        case 'PREMIUM': return 'bg-purple-100 text-purple-700 border-purple-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const getTypeColor = (type: string): string => {
    switch (type?.toUpperCase()) {
        case 'YEARLY': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'WEEKLY': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'MONTHLY': return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
        case 'INACTIVE': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const getDisplayValue = (value: any): string => value?.toString() || 'N/A';

const formatCurrency = (amount: number): string => {
    return `₦${(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
};

const TablePagination = ({
    current, total, perPage, onChange,
}: { current: number; total: number; perPage: number; onChange: (p: number) => void }) => {
    const pages = Math.ceil(total / perPage);
    const start = (current - 1) * perPage + 1;
    const end = Math.min(current * perPage, total);

    const getPageNumbers = () => {
        if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
        const result: (number | '...')[] = [];
        if (current <= 3) result.push(1, 2, 3, '...', pages);
        else if (current >= pages - 2) result.push(1, '...', pages - 2, pages - 1, pages);
        else result.push(1, '...', current, '...', pages);
        return result;
    };

    return (
        <div className="flex items-center justify-between mt-4 pt-4 mb-10">
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Plans per Page</p>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current - 1)} disabled={current === 1}>
                    <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                {getPageNumbers().map((p, i) =>
                    p === '...' ? (
                        <span key={`e-${i}`} className="text-xs text-gray-400 px-1">···</span>
                    ) : (
                        <button key={p} onClick={() => onChange(p as number)}
                            className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === current ? 'border-2 border-orange-400 text-orange-500' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {p}
                        </button>
                    )
                )}
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current + 1)} disabled={current === pages}>
                    Next <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default function SubscriptionPlansPage() {
    usePageMetadata('Subscription Plans', 'Manage subscription plans for merchants.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_SUBS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage subscriptions"
    });

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['subscription-plans'],
        queryFn: () => axiosOperations.request({
            url: '/subscription-plan/list',
            method: 'GET'
        })
    });

    const subscriptionPlans: SubscriptionPlan[] = data?.data?.subscriptionList || [];

    const filtered = useMemo(() => {
        return subscriptionPlans.filter((plan) => {
            const s = searchTerm.toLowerCase().trim();
            return !s || (
                plan.name?.toLowerCase().includes(s) ||
                plan.description?.toLowerCase().includes(s) ||
                plan.tierCode?.toLowerCase().includes(s) ||
                plan.subscriptionType?.toLowerCase().includes(s)
            );
        });
    }, [subscriptionPlans, searchTerm]);

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleView = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan);
        setViewModalOpen(true);
    };

    const handleEdit = (plan: SubscriptionPlan) => {
        router.push(`/operations/subscriptions/create?id=${plan.id}`);
    };

    const exportToCSV = () => {
        if (!filtered.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(filtered.map((p) => ({
            'Name': p.name,
            'Tier': p.tierCode,
            'Type': p.subscriptionType,
            'Amount': p.amount,
            'Status': p.status,
            'Features': p.features?.length || 0,
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `subscription-plans-${new Date().toISOString().split('T')[0]}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export complete');
    };

    return (
        <div className="min-h-screen px-2">
            <div className="grid gap-4 mt-3">
                <div className="mb-2">
                    <h2 className="text-md font-semibold text-dark-gray">Plans <span className="text-md text-faded-accent">({filtered.length.toLocaleString()})</span></h2>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Search plans..."
                            className="pl-9 text-medium-gray"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {searchTerm && (
                            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}

                        {/* <SeperatorIcon /> */}
                        {/* <Button onClick={exportToCSV} size="lg" variant="outline">
                            <TransInflowIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                        <Button onClick={() => refetch()} size="lg" variant="outline">
                            <RefreshCw className="w-4 h-4" />
                        </Button> */}
                        <PermissionButton
                            requiredPermissions={['MANAGE_SUBS']}
                            requireAll={true} hideIfNoPermission={false}
                            tooltipMessage="No permission to create"
                            onClick={() => router.push('/operations/subscriptions/create')}
                            size="lg"
                        >
                            Create Plan
                        </PermissionButton>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading plans</div>
            ) : (
                <div className="hidden lg:block">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <p className="text-2xl font-medium text-dark-gray">No plans found</p>
                            <p className="text-sm text-medium-gray">Try adjusting your search</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-[#EEEEEE]">
                                            {['S/N', 'Plan Name', 'Tier', 'Type', 'Amount', 'Status', 'Features', ''].map((h) => (
                                                <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.map((p, idx) => (
                                            <tr key={p.id}
                                                onClick={() => handleView(p)}
                                                className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-orange-50/40 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                                                <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</p></td>
                                                <td className="px-3 py-3.5">
                                                    <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(p.name)}</p>
                                                    <p className="text-xs text-medium-gray truncate max-w-[200px]">{getDisplayValue(p.description)}</p>
                                                </td>
                                                <td className="px-3 py-3.5"><Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getTierColor(p.tierCode)}`}>{p.tierCode}</Badge></td>
                                                <td className="px-3 py-3.5"><Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getTypeColor(p.subscriptionType)}`}>{p.subscriptionType}</Badge></td>
                                                <td className="px-3 py-3.5"><p className="text-sm font-medium text-dark-gray">{formatCurrency(p.amount)}</p></td>
                                                <td className="px-3 py-3.5"><Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(p.status)}`}>{p.status}</Badge></td>
                                                <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{p.features?.length || 0}</p></td>
                                                <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center gap-1">
                                                        <Button size="xs" variant="action" onClick={() => handleView(p)} title="View"><Eye className="w-4 h-4" /></Button>
                                                        <PermissionButton requiredPermissions={['MANAGE_SUBS']} requireAll={true} hideIfNoPermission={false}
                                                            tooltipMessage="No permission" onClick={() => handleEdit(p)} size="xs" variant="action">
                                                            <EditIcon className="w-4 h-4" />
                                                        </PermissionButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {Math.ceil(filtered.length / ITEMS_PER_PAGE) > 1 && (
                                <TablePagination current={currentPage} total={filtered.length} perPage={ITEMS_PER_PAGE} onChange={setCurrentPage} />
                            )}
                        </>
                    )}
                </div>
            )}

            <SubscriptionPlanViewModal open={viewModalOpen} onOpenChange={setViewModalOpen} plan={selectedPlan} />
        </div>
    );
}
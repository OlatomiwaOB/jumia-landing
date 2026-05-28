// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Download, Plus, Search, Eye, Edit, MapPin, Clock, Phone } from 'lucide-react';
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
// import { Badge } from '@/components/ui/badge';
// import { useRouter } from 'next/navigation';
// import { usePermission } from '@/hooks/usePermission';

// interface PickupLocation {
//     id: number;
//     name: string;
//     location: string;
//     distance: number;
//     timeframe: string;
//     contact: string;
//     amount: number;
//     status: string
// }

// interface Column {
//     title: string;
//     dataIndex: string;
//     key: string;
//     width?: number;
//     render?: (value: any, record: PickupLocation, index: number) => React.ReactNode;
// }

// const getDisplayValue = (value: any): string => {
//     return value?.toString() || 'N/A';
// };

// const formatDistance = (distance: number): string => {
//     if (distance >= 1000) {
//         return `${(distance / 1000).toFixed(1)} km`;
//     }
//     return `${distance} m`;
// };

// const getStatusColor = (status: string): string => {
//     if (!status) return 'bg-accent text-white';

//     const statusUpper = status.toUpperCase();
//     switch (statusUpper) {
//         case 'ACTIVE':
//         case 'Y':
//             return 'bg-accent text-white';
//         case 'INACTIVE':
//         case 'N':
//             return 'bg-accent text-white opacity-70';
//         case 'PENDING':
//             return 'bg-accent text-white opacity-80';
//         default:
//             return 'bg-accent text-white';
//     }
// };

// const DynamicTable = ({
//     columns,
//     data,
//     itemsPerPage = 15,
//     onViewDetails,
//     onEdit,
//     searchTerm
// }: {
//     columns: Column[];
//     data: PickupLocation[];
//     itemsPerPage?: number;
//     onViewDetails: (location: PickupLocation) => void;
//     onEdit: (location: PickupLocation) => void;
//     searchTerm: string;
// }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedLocation, setSelectedLocation] = useState<PickupLocation | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const totalPages = Math.ceil(data.length / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const currentData = data.slice(startIndex, endIndex);

//     useEffect(() => {
//         setCurrentPage(1);
//     }, [searchTerm]);

//     const handleViewDetails = (location: PickupLocation) => {
//         setSelectedLocation(location);
//         setIsModalOpen(true);
//         onViewDetails(location);
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
//                 render: (text: string, record: PickupLocation) => (
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
//                         {currentData.map((item, index) => (
//                             <tr
//                                 key={item.id}
//                                 className={`border-b border-accent/10 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
//                             >
//                                 {columnsWithHandler.map((column) => (
//                                     <td key={column.key} className="p-3 text-sm text-accent-foreground">
//                                         {column.render
//                                             ? column.render(item[column.dataIndex as keyof PickupLocation], item, index)
//                                             : getDisplayValue(item[column.dataIndex as keyof PickupLocation])
//                                         }
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-accent/10 gap-4">
//                 <p className="text-sm text-accent-foreground/70">
//                     Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Locations
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
//                 <DialogContent className="sm:max-w-lg">
//                     <DialogHeader className='flex flex-col'>
//                         <DialogTitle className="text-accent-foreground">Pickup Location Details</DialogTitle>
//                         <DialogDescription>
//                             Detailed information about the pickup location
//                         </DialogDescription>
//                     </DialogHeader>

//                     {selectedLocation && (
//                         <div className="py-4">
//                             <div className="mb-6">
//                                 <h3 className="text-lg font-semibold text-accent-foreground mb-2">
//                                     {getDisplayValue(selectedLocation.name)}
//                                 </h3>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div className="space-y-2">
//                                     <div className="flex items-center gap-2">
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Location</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(selectedLocation.location)}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <div className="flex items-center gap-2">
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Timeframe</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(selectedLocation.timeframe)}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <div>
//                                         <p className="text-sm font-medium text-accent-foreground">Distance</p>
//                                         <p className="text-sm text-accent-foreground/70 mt-1">
//                                             {formatDistance(selectedLocation.distance)}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <div className="flex items-center gap-2">
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Contact</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(selectedLocation.contact)}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <div className="flex items-center gap-2">
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Amount</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(selectedLocation.amount)}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <div className="flex items-center gap-2">
//                                         <div>
//                                             <p className="text-sm font-medium text-accent-foreground">Status</p>
//                                             <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(selectedLocation.status)}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// const MobileLocationCard = ({ location, onViewDetails }: { location: PickupLocation; onViewDetails: (location: PickupLocation) => void }) => {
//     return (
//         <div className="bg-white rounded-lg p-4 space-y-3 border border-accent/20">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <p className="text-sm font-semibold text-accent-foreground">
//                         {getDisplayValue(location.name)}
//                     </p>
//                     <p className="text-xs text-accent-foreground/70">ID: {getDisplayValue(location.id)}</p>
//                 </div>
//                 <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
//                     {formatDistance(location.distance)}
//                 </Badge>
//             </div>

//             <div className="text-sm text-accent-foreground/80 flex items-center gap-2">
//                 <MapPin className="w-4 h-4" />
//                 <span className="truncate">{getDisplayValue(location.location)}</span>
//             </div>

//             <div className="text-sm text-accent-foreground/80 flex items-center gap-2">
//                 <Clock className="w-4 h-4" />
//                 <span>{getDisplayValue(location.timeframe)}</span>
//             </div>

//             <div className="flex items-center justify-between pt-2 border-t border-accent/10">
//                 <div>
//                     <p className="text-xs text-accent-foreground/70">Contact</p>
//                     <p className="text-sm font-medium text-accent-foreground">{getDisplayValue(location.contact)}</p>
//                 </div>
//                 <Button
//                     variant="ghost"
//                     size="sm"
//                     className="p-1 hover:bg-accent/10"
//                     onClick={() => onViewDetails(location)}
//                 >
//                     <Eye className="w-5 h-5 text-accent-foreground" />
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default function PickupLocationsPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_PICKUP_LOCATIONS', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage pickup locations"
//     });

//     const router = useRouter();
//     const { data, isLoading, error, refetch } = useQuery({
//         queryKey: ['pickup-locations'],
//         queryFn: () => axiosOperations.request({
//             url: '/ecommerce/pickup-location/all',
//             method: 'GET'
//         })
//     });

//     const [searchTerm, setSearchTerm] = useState("");

//     const pickupLocations: PickupLocation[] = data?.data?.pickupLocations || [];

//     const filteredLocations = pickupLocations.filter(location => {
//         const searchLower = searchTerm.toLowerCase();
//         return (
//             (location.name?.toLowerCase() || '').includes(searchLower) ||
//             (location.location?.toLowerCase() || '').includes(searchLower) ||
//             (location.contact?.toLowerCase() || '').includes(searchLower) ||
//             (location.timeframe?.toLowerCase() || '').includes(searchLower)
//         );
//     });

//     const handleViewDetails = (location: PickupLocation) => {

//     };

//     const handleEdit = (location: PickupLocation) => {
//         router.push(`/operations/pickup-locations/create?id=${location.id}`);
//     };

//     const columns: Column[] = [
//         {
//             title: 'S/N',
//             dataIndex: 'id',
//             key: 'sn',
//             width: 80,
//             render: (text: string, record: PickupLocation, index: number) => (
//                 <p className="text-sm text-accent-foreground">{index + 1}</p>
//             ),
//         },
//         {
//             title: 'Name',
//             dataIndex: 'name',
//             key: 'name',
//             width: 200,
//             render: (text: string) => (
//                 <p className="text-sm font-medium text-accent-foreground">{getDisplayValue(text)}</p>
//             ),
//         },
//         {
//             title: 'Location',
//             dataIndex: 'location',
//             key: 'location',
//             width: 250,
//             render: (text: string) => (
//                 <div className="flex items-center gap-2">
//                     <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
//                 </div>
//             ),
//         },
//         {
//             title: 'Distance',
//             dataIndex: 'distance',
//             key: 'distance',
//             width: 100,
//             render: (distance: number) => (
//                 <p className="text-sm text-accent-foreground">{formatDistance(distance)}</p>
//             ),
//         },
//         {
//             title: 'Timeframe',
//             dataIndex: 'timeframe',
//             key: 'timeframe',
//             width: 180,
//             render: (text: string) => (
//                 <div className="flex items-center gap-2">
//                     <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
//                 </div>
//             ),
//         },
//         {
//             title: 'Contact',
//             dataIndex: 'contact',
//             key: 'contact',
//             width: 180,
//             render: (text: string) => (
//                 <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
//             ),
//         },
//         {
//             title: 'Amount',
//             dataIndex: 'amount',
//             key: 'amount',
//             width: 180,
//             render: (text: string) => (
//                 <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
//             ),
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             width: 120,
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
//             render: (text: string, record: PickupLocation) => (
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

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center justify-between mb-8">
//                     <div className="flex items-center gap-4">
//                         <div>
//                             <h1 className="text-3xl font-bold text-accent-foreground mb-2">
//                                 Pickup Locations
//                             </h1>
//                             <p className="text-accent-foreground/70">
//                                 Manage pickup locations for e-commerce orders
//                             </p>
//                         </div>
//                     </div>
//                     <div className="text-right">
//                         <p className="text-2xl font-bold text-accent-foreground">{pickupLocations.length}</p>
//                         <p className="text-sm text-accent-foreground/70">Total Locations</p>
//                     </div>
//                 </div>

//                 <div className="space-y-6">
//                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                         <div className="relative flex-1 max-w-sm w-full">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
//                             <Input
//                                 placeholder="Search locations..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10 border-accent/20 text-accent-foreground"
//                             />
//                         </div>

//                         <div className="flex items-center gap-2 w-full sm:w-auto">
//                             <Link href="/operations/pickup-locations/create" className="w-full sm:w-auto">
//                                 <Button className="w-full sm:w-auto gap-2 bg-accent hover:bg-accent/90 text-white">
//                                     <Plus className="w-4 h-4" />
//                                     Add Location
//                                 </Button>
//                             </Link>
//                             {/* <Button variant="outline" className="gap-2 border-accent/20 hover:bg-accent/10">
//                                 <Download className="w-4 h-4" />
//                                 <span className="hidden sm:inline">Export</span>
//                             </Button> */}
//                         </div>
//                     </div>

//                     <Card className="border-accent/20 shadow-sm">
//                         <CardHeader>
//                             <div className="flex items-center justify-between">
//                                 <CardTitle className="text-lg font-semibold text-accent-foreground">
//                                     Pickup Locations List
//                                 </CardTitle>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => refetch()}
//                                     className="border-accent/20 hover:bg-accent/10"
//                                 >
//                                     Refresh
//                                 </Button>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             {isLoading ? (
//                                 <div className="flex justify-center items-center h-40">
//                                     <p className="text-accent-foreground/70">Loading pickup locations...</p>
//                                 </div>
//                             ) : error ? (
//                                 <div className="flex justify-center items-center h-40">
//                                     <p className="text-accent-foreground/70">Error loading pickup locations</p>
//                                 </div>
//                             ) : pickupLocations.length === 0 ? (
//                                 <div className="flex justify-center items-center h-40 flex-col gap-4">
//                                     <p className="text-accent-foreground/70">No pickup locations found</p>
//                                     <Link href="/operations/pickup-locations/create">
//                                         <Button className="gap-2 bg-accent hover:bg-accent/90 text-white">
//                                             <Plus className="w-4 h-4" />
//                                             Add First Location
//                                         </Button>
//                                     </Link>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="block lg:hidden space-y-4">
//                                         {filteredLocations.map((location) => (
//                                             <MobileLocationCard
//                                                 key={location.id}
//                                                 location={location}
//                                                 onViewDetails={handleViewDetails}
//                                             />
//                                         ))}
//                                     </div>

//                                     <div className="hidden lg:block">
//                                         <DynamicTable
//                                             columns={columns}
//                                             data={filteredLocations}
//                                             itemsPerPage={15}
//                                             onViewDetails={handleViewDetails}
//                                             onEdit={handleEdit}
//                                             searchTerm={searchTerm}
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

'use client'
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Eye, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { TransInflowIcon, SeperatorIcon, EditIcon } from '@/components/icons/icons';
import { PickupLocationViewModal } from '@/components/Operations/pickup-locations/pickup-details';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface PickupLocation {
    id: number;
    name: string;
    location: string;
    distance: number;
    timeframe: string;
    contact: string;
    amount: number;
    status: string;
}

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
        case 'INACTIVE': return 'bg-red-100 text-red-700 border-red-200';
        case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const getDisplayValue = (value: any): string => value?.toString() || 'N/A';

const formatDistance = (distance: number): string => {
    if (distance >= 1000) return `${(distance / 1000).toFixed(1)} km`;
    return `${distance} m`;
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
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Locations per Page</p>
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

export default function PickupLocationsPage() {
    usePageMetadata('Pickup Locations', 'Manage pickup locations for e-commerce orders.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_PICKUP_LOCATIONS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage pickup locations"
    });

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<PickupLocation | null>(null);
    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['pickup-locations'],
        queryFn: () => axiosOperations.request({
            url: '/ecommerce/pickup-location/all',
            method: 'GET'
        })
    });

    const pickupLocations: PickupLocation[] = data?.data?.pickupLocations || [];

    const filtered = useMemo(() => {
        return pickupLocations.filter((l) => {
            const s = searchTerm.toLowerCase().trim();
            return !s || (
                l.name?.toLowerCase().includes(s) ||
                l.location?.toLowerCase().includes(s) ||
                l.contact?.toLowerCase().includes(s) ||
                l.timeframe?.toLowerCase().includes(s)
            );
        });
    }, [pickupLocations, searchTerm]);

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleView = (location: PickupLocation) => {
        setSelectedLocation(location);
        setViewModalOpen(true);
    };

    const handleEdit = (location: PickupLocation) => {
        router.push(`/operations/pickup-locations/create?id=${location.id}`);
    };

    const exportToCSV = () => {
        if (!filtered.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(filtered.map((l) => ({
            'Name': l.name,
            'Location': l.location,
            'Distance': formatDistance(l.distance),
            'Timeframe': l.timeframe,
            'Contact': l.contact,
            'Amount': l.amount,
            'Status': l.status,
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `pickup-locations-${new Date().toISOString().split('T')[0]}.csv`;
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
                    <h2 className="text-md font-semibold text-dark-gray">Locations <span className="text-md text-faded-accent">({filtered.length.toLocaleString()})</span></h2>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Search locations..."
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
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-2.2-5.9M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Button> */}
                        <PermissionButton
                            requiredPermissions={['MANAGE_PICKUP_LOCATIONS']}
                            requireAll={true} hideIfNoPermission={false}
                            tooltipMessage="No permission to create"
                            onClick={() => router.push('/operations/pickup-locations/create')}
                            size="lg"
                        >
                           + Add Location
                        </PermissionButton>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading locations</div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <MapPin className="w-10 h-10 text-gray-300" />
                                <p className="text-2xl font-medium text-dark-gray">No locations found</p>
                                <p className="text-sm text-medium-gray">Try adjusting your search</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#EEEEEE]">
                                                {['S/N', 'Name', 'Location', 'Distance', 'Timeframe', 'Contact', 'Amount', 'Status', ''].map((h) => (
                                                    <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((l, idx) => (
                                                <tr key={l.id}
                                                    onClick={() => handleView(l)}
                                                    className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-orange-50/40 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm font-semibold text-dark-gray">{getDisplayValue(l.name)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray max-w-[200px] truncate">{getDisplayValue(l.location)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{formatDistance(l.distance)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{getDisplayValue(l.timeframe)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{getDisplayValue(l.contact)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm font-medium text-dark-gray">₦{getDisplayValue(l.amount)}</p></td>
                                                    <td className="px-3 py-3.5">
                                                        <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(l.status)}`}>{l.status}</Badge>
                                                    </td>
                                                    <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1">
                                                            <Button size="xs" variant="action" onClick={() => handleView(l)} title="View"><Eye className="w-4 h-4" /></Button>
                                                            <PermissionButton requiredPermissions={['MANAGE_PICKUP_LOCATIONS']} requireAll={true} hideIfNoPermission={false}
                                                                tooltipMessage="No permission" onClick={() => handleEdit(l)} size="xs" variant="action">
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

                    <div className="lg:hidden space-y-3 py-2">
                        {filtered.map((l) => (
                            <div key={l.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm" onClick={() => handleView(l)}>
                                <div className="flex items-center gap-3 p-4">
                                    <div className="w-10 h-10 shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-dark-gray truncate">{l.name}</p>
                                        <p className="text-xs text-medium-gray mt-0.5">{formatDistance(l.distance)}</p>
                                    </div>
                                    <Badge className={`text-[10px] px-2 py-0.5 border font-medium ${getStatusColor(l.status)}`}>{l.status}</Badge>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                                    <p className="text-xs text-medium-gray">{l.timeframe}</p>
                                    <PermissionButton requiredPermissions={['MANAGE_PICKUP_LOCATIONS']} requireAll={true} hideIfNoPermission={false}
                                        tooltipMessage="No permission" onClick={() => handleEdit(l)} size="xs" variant="action">
                                        <EditIcon className="w-4 h-4" />
                                    </PermissionButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <PickupLocationViewModal open={viewModalOpen} onOpenChange={setViewModalOpen} location={selectedLocation} />
        </div>
    );
}
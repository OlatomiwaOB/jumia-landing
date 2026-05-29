'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Plus, Search, Eye, Edit, MapPin, Clock, Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
// import { usePermission } from '@/hooks/usePermission';

interface PickupLocation {
    id: number;
    name: string;
    location: string;
    distance: number;
    timeframe: string;
    contact: string;
    amount: number;
    status: string
}

interface Column {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    render?: (value: any, record: PickupLocation, index: number) => React.ReactNode;
}

const getDisplayValue = (value: any): string => {
    return value?.toString() || 'N/A';
};

const formatDistance = (distance: number): string => {
    if (distance >= 1000) {
        return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${distance} m`;
};

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-accent text-white';

    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
        case 'ACTIVE':
        case 'Y':
            return 'bg-accent text-white';
        case 'INACTIVE':
        case 'N':
            return 'bg-accent text-white opacity-70';
        case 'PENDING':
            return 'bg-accent text-white opacity-80';
        default:
            return 'bg-accent text-white';
    }
};

const DynamicTable = ({
    columns,
    data,
    itemsPerPage = 15,
    onViewDetails,
    onEdit,
    searchTerm
}: {
    columns: Column[];
    data: PickupLocation[];
    itemsPerPage?: number;
    onViewDetails: (location: PickupLocation) => void;
    onEdit: (location: PickupLocation) => void;
    searchTerm: string;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLocation, setSelectedLocation] = useState<PickupLocation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleViewDetails = (location: PickupLocation) => {
        setSelectedLocation(location);
        setIsModalOpen(true);
        onViewDetails(location);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const columnsWithHandler = columns.map(col => {
        if (col.key === 'actions') {
            return {
                ...col,
                render: (text: string, record: PickupLocation) => (
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-accent/10"
                            onClick={() => handleViewDetails(record)}
                        >
                            <Eye className="w-5 h-5 text-accent-foreground" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-accent/10"
                            onClick={() => onEdit(record)}
                        >
                            <Edit className="w-4 h-4 text-accent-foreground" />
                        </Button>
                    </div>
                )
            };
        }
        return col;
    });

    return (
        <>
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-accent/20">
                            {columnsWithHandler.map((column) => (
                                <th
                                    key={column.key}
                                    className="text-left p-3 font-bold text-sm text-accent-foreground"
                                    style={{ width: column.width ? `${column.width}px` : 'auto' }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`border-b border-accent/10 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
                            >
                                {columnsWithHandler.map((column) => (
                                    <td key={column.key} className="p-3 text-sm text-accent-foreground">
                                        {column.render
                                            ? column.render(item[column.dataIndex as keyof PickupLocation], item, index)
                                            : getDisplayValue(item[column.dataIndex as keyof PickupLocation])
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-accent/10 gap-4">
                <p className="text-sm text-accent-foreground/70">
                    Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Locations
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-xs border-accent/20 hover:bg-accent/10"
                    >
                        Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 p-0 text-xs ${currentPage === page ? 'bg-accent text-white' : 'border-accent/20 hover:bg-accent/10'}`}
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="text-xs border-accent/20 hover:bg-accent/10"
                    >
                        Next
                    </Button>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle className="text-accent-foreground">Pickup Location Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about the pickup location
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLocation && (
                        <div className="py-4">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-accent-foreground mb-2">
                                    {getDisplayValue(selectedLocation.name)}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Location</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(selectedLocation.location)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Timeframe</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(selectedLocation.timeframe)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm font-medium text-accent-foreground">Distance</p>
                                        <p className="text-sm text-accent-foreground/70 mt-1">
                                            {formatDistance(selectedLocation.distance)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Contact</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(selectedLocation.contact)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Amount</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(selectedLocation.amount)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-accent-foreground">Status</p>
                                            <p className="text-sm text-accent-foreground/70 mt-1">{getDisplayValue(selectedLocation.status)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

const MobileLocationCard = ({ location, onViewDetails }: { location: PickupLocation; onViewDetails: (location: PickupLocation) => void }) => {
    return (
        <div className="bg-white rounded-lg p-4 space-y-3 border border-accent/20">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-accent-foreground">
                        {getDisplayValue(location.name)}
                    </p>
                    <p className="text-xs text-accent-foreground/70">ID: {getDisplayValue(location.id)}</p>
                </div>
                <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
                    {formatDistance(location.distance)}
                </Badge>
            </div>

            <div className="text-sm text-accent-foreground/80 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{getDisplayValue(location.location)}</span>
            </div>

            <div className="text-sm text-accent-foreground/80 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{getDisplayValue(location.timeframe)}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-accent/10">
                <div>
                    <p className="text-xs text-accent-foreground/70">Contact</p>
                    <p className="text-sm font-medium text-accent-foreground">{getDisplayValue(location.contact)}</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 hover:bg-accent/10"
                    onClick={() => onViewDetails(location)}
                >
                    <Eye className="w-5 h-5 text-accent-foreground" />
                </Button>
            </div>
        </div>
    );
};

export default function PickupLocationsPage() {
    // const { usePermissionGuard } = usePermission();

    // usePermissionGuard('MANAGE_PICKUP_LOCATIONS', {
    //     redirectToNotPermitted: true,
    //     toastMessage: "You don't have permission to manage pickup locations"
    // });

    const router = useRouter();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['pickup-locations'],
        queryFn: () => axiosOperations.request({
            url: '/ecommerce/pickup-location/all',
            method: 'GET'
        })
    });

    const [searchTerm, setSearchTerm] = useState("");

    const pickupLocations: PickupLocation[] = data?.data?.pickupLocations || [];

    const filteredLocations = pickupLocations.filter(location => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (location.name?.toLowerCase() || '').includes(searchLower) ||
            (location.location?.toLowerCase() || '').includes(searchLower) ||
            (location.contact?.toLowerCase() || '').includes(searchLower) ||
            (location.timeframe?.toLowerCase() || '').includes(searchLower)
        );
    });

    const handleViewDetails = (location: PickupLocation) => {

    };

    const handleEdit = (location: PickupLocation) => {
        router.push(`/operations/pickup-locations/create?id=${location.id}`);
    };

    const columns: Column[] = [
        {
            title: 'S/N',
            dataIndex: 'id',
            key: 'sn',
            width: 80,
            render: (text: string, record: PickupLocation, index: number) => (
                <p className="text-sm text-accent-foreground">{index + 1}</p>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text: string) => (
                <p className="text-sm font-medium text-accent-foreground">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            width: 250,
            render: (text: string) => (
                <div className="flex items-center gap-2">
                    <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
                </div>
            ),
        },
        {
            title: 'Distance',
            dataIndex: 'distance',
            key: 'distance',
            width: 100,
            render: (distance: number) => (
                <p className="text-sm text-accent-foreground">{formatDistance(distance)}</p>
            ),
        },
        {
            title: 'Timeframe',
            dataIndex: 'timeframe',
            key: 'timeframe',
            width: 180,
            render: (text: string) => (
                <div className="flex items-center gap-2">
                    <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
                </div>
            ),
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
            width: 180,
            render: (text: string) => (
                <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 180,
            render: (text: string) => (
                <p className="text-sm text-accent-foreground">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (text: string) => (
                <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 w-fit`}>
                    {getDisplayValue(text)}
                </Badge>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,
            render: (text: string, record: PickupLocation) => (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/10"
                        onClick={() => handleViewDetails(record)}
                    >
                        <Eye className="w-5 h-5 text-accent-foreground" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/10"
                        onClick={() => handleEdit(record)}
                    >
                        <Edit className="w-4 h-4 text-accent-foreground" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-accent-foreground mb-2">
                                Pickup Locations
                            </h1>
                            <p className="text-accent-foreground/70">
                                Manage pickup locations for e-commerce orders
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-accent-foreground">{pickupLocations.length}</p>
                        <p className="text-sm text-accent-foreground/70">Total Locations</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
                            <Input
                                placeholder="Search locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-accent/20 text-accent-foreground"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Link href="/operations/pickup-locations/create" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto gap-2 bg-accent hover:bg-accent/90 text-white">
                                    <Plus className="w-4 h-4" />
                                    Add Location
                                </Button>
                            </Link>
                            {/* <Button variant="outline" className="gap-2 border-accent/20 hover:bg-accent/10">
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button> */}
                        </div>
                    </div>

                    <Card className="border-accent/20 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-accent-foreground">
                                    Pickup Locations List
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetch()}
                                    className="border-accent/20 hover:bg-accent/10"
                                >
                                    Refresh
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-accent-foreground/70">Loading pickup locations...</p>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-accent-foreground/70">Error loading pickup locations</p>
                                </div>
                            ) : pickupLocations.length === 0 ? (
                                <div className="flex justify-center items-center h-40 flex-col gap-4">
                                    <p className="text-accent-foreground/70">No pickup locations found</p>
                                    <Link href="/operations/pickup-locations/create">
                                        <Button className="gap-2 bg-accent hover:bg-accent/90 text-white">
                                            <Plus className="w-4 h-4" />
                                            Add First Location
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="block lg:hidden space-y-4">
                                        {filteredLocations.map((location) => (
                                            <MobileLocationCard
                                                key={location.id}
                                                location={location}
                                                onViewDetails={handleViewDetails}
                                            />
                                        ))}
                                    </div>

                                    <div className="hidden lg:block">
                                        <DynamicTable
                                            columns={columns}
                                            data={filteredLocations}
                                            itemsPerPage={15}
                                            onViewDetails={handleViewDetails}
                                            onEdit={handleEdit}
                                            searchTerm={searchTerm}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
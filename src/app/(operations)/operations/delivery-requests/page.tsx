'use client'
import React, { useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { Search, Download, Eye, Edit, Truck, User, MapPin, Package, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';

interface DeliveryRequest {
    id: number;
    orderRefNo: string;
    storeCode: string;
    storeName: string;
    pickupLocation: string;
    deliveryLocation: string;
    packageSize: string;
    weightKg: number;
    length: number;
    width: number;
    height: number;
    deliveredBy: string;
    deliverySpeed: string;
    createdDate: string;
    deliveryDate: string;
    status: string;
    currentLocation: string;
    isReturn: string;
}

interface DeliveryRequestsResponse {
    responseCode: string;
    responseMessage: string;
    deliveryRequests: DeliveryRequest[];
}

interface FilterState {
    searchTerm: string;
    orderRef: string;
    startDate: string;
    endDate: string;
    status: string;
    storeCode: string;
}

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-gray-500 text-white';

    switch (status.toUpperCase()) {
        case 'PENDING':
            return 'bg-yellow-500 text-white';
        case 'PICKED':
            return 'bg-blue-500 text-white';
        case 'ASSIGNED':
            return 'bg-orange-500 text-white';
        case 'IN_TRANSIT':
            return 'bg-orange-500 text-white';
        case 'DELIVERED':
            return 'bg-green-500 text-white';
        case 'CANCELLED':
            return 'bg-red-500 text-white';
        case 'RETURNED':
            return 'bg-purple-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const getDeliverySpeedColor = (speed: string): string => {
    if (!speed) return 'bg-gray-500 text-white';

    switch (speed.toUpperCase()) {
        case 'FAST':
            return 'bg-red-500 text-white';
        case 'MEDIUM':
            return 'bg-yellow-500 text-white';
        case 'NEXT_DAY':
            return 'bg-green-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const getPackageSizeColor = (size: string): string => {
    if (!size) return 'bg-gray-500 text-white';

    switch (size.toUpperCase()) {
        case 'SMALL':
            return 'bg-green-500 text-white';
        case 'MEDIUM':
            return 'bg-yellow-500 text-white';
        case 'LARGE':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const exportDeliveryRequestsToCSV = (requests: DeliveryRequest[]) => {
    try {
        if (!requests || requests.length === 0) {
            toast.error('No delivery requests available to export');
            return;
        }

        const csvData = requests.map(request => ({
            'Request ID': request.id,
            'Order Reference': request.orderRefNo,
            'Store Code': request.storeCode,
            'Store Name': request.storeName,
            'Pickup Location': request.pickupLocation,
            'Delivery Location': request.deliveryLocation,
            'Package Size': request.packageSize,
            'Weight (Kg)': request.weightKg,
            'Dimensions (cm)': `${request.length}x${request.width}x${request.height}`,
            'Delivery Speed': request.deliverySpeed,
            'Status': request.status,
            'Delivered By': request.deliveredBy || 'N/A',
            'Current Location': request.currentLocation || 'N/A',
            'Created Date': request.createdDate,
            'Delivery Date': request.deliveryDate || 'N/A',
            'Is Return': request.isReturn || 'No'
        }));

        const csv = Papa.unparse(csvData, {
            header: true,
            delimiter: ','
        });

        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `delivery-requests-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Delivery requests exported successfully');
    } catch (error) {
        console.error('Export failed:', error);
        toast.error('Failed to export delivery requests');
    }
};

const DeliveryRequestsTable = ({
    data,
    onViewDetails,
    onUpdateStatus,
    onAssignRider,
    onEdit
}: {
    data: DeliveryRequest[];
    onViewDetails: (request: DeliveryRequest) => void;
    onUpdateStatus: (request: DeliveryRequest) => void;
    onAssignRider: (request: DeliveryRequest) => void;
    onEdit: (request: DeliveryRequest) => void;
}) => {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRow = (id: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                        <th className="text-left p-3 font-bold text-sm text-gray-700 w-12"></th>
                        <th className="text-left p-3 font-bold text-sm text-gray-700">Order Ref</th>
                        <th className="text-left p-3 font-bold text-sm text-gray-700">Store</th>
                        <th className="text-left p-3 font-bold text-sm text-gray-700">Package Details</th>
                        <th className="text-left p-3 font-bold text-sm text-gray-700">Status</th>
                        {/* <th className="text-left p-3 font-bold text-sm text-gray-700">Delivery Info</th> */}
                        <th className="text-left p-3 font-bold text-sm text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((request) => (
                        <React.Fragment key={request.id}>
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1"
                                        onClick={() => toggleRow(request.id)}
                                    >
                                        {expandedRows.has(request.id) ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </Button>
                                </td>
                                <td className="p-3">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{request.orderRefNo}</p>
                                        {/* <p className="text-xs text-gray-500">ID: {request.id}</p> */}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{request.storeName}</p>
                                        <p className="text-xs text-gray-500">{request.storeCode}</p>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex flex-col gap-1">
                                        <Badge className={`${getPackageSizeColor(request.packageSize)} text-xs w-fit`}>
                                            {request.packageSize}
                                        </Badge>
                                        <p className="text-xs text-gray-600">
                                            {request.weightKg}kg • {request.length}x{request.width}x{request.height}cm
                                        </p>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <Badge className={`${getStatusColor(request.status)} text-xs px-2 py-1`}>
                                        {request.status}
                                    </Badge>
                                </td>
                                {/* <td className="p-3">
                                    <div className="flex flex-col gap-1">
                                        <Badge className={`${getDeliverySpeedColor(request.deliverySpeed)} text-xs w-fit`}>
                                            {request.deliverySpeed}
                                        </Badge>
                                        <p className="text-xs text-gray-600">
                                            {request.deliveredBy || 'Unassigned'}
                                        </p>
                                    </div>
                                </td> */}
                                <td className="p-3">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="p-1"
                                            onClick={() => onViewDetails(request)}
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="p-1"
                                            onClick={() => onEdit(request)}
                                            title="Edit Request"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="p-1"
                                            onClick={() => onUpdateStatus(request)}
                                            title="Update Status"
                                        >
                                            <Clock className="w-4 h-4" />
                                        </Button>
                                        {!request.deliveredBy && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-1"
                                                onClick={() => onAssignRider(request)}
                                                title="Assign Rider"
                                            >
                                                <User className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            {expandedRows.has(request.id) && (
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <td colSpan={7} className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="font-medium text-gray-700">Pickup Location:</p>
                                                <p className="text-gray-600">{request.pickupLocation}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">Delivery Location:</p>
                                                <p className="text-gray-600">{request.deliveryLocation}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">Current Location:</p>
                                                <p className="text-gray-600">{request.currentLocation || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">Created Date:</p>
                                                <p className="text-gray-600">{request.createdDate}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">Delivery Date:</p>
                                                <p className="text-gray-600">{request.deliveryDate || 'N/A'}</p>
                                            </div>
                                            {/* <div>
                                                <p className="font-medium text-gray-700">Is Return:</p>
                                                <Badge className={`${request.isReturn === 'Y' ? 'bg-red-500' : 'bg-green-500'} text-white text-xs mt-1`}>
                                                    {request.isReturn === 'Y' ? 'Yes' : 'No'}
                                                </Badge>
                                            </div> */}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default function DeliveryRequestsManagementPage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('MANAGE_DELIVERY_REQUESTS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage delivery requests"
    });
    const router = useRouter();
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        orderRef: '',
        startDate: '',
        endDate: '',
        status: '',
        storeCode: ''
    });

    const [selectedRequest, setSelectedRequest] = useState<DeliveryRequest | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
    const [isAssignRiderModalOpen, setIsAssignRiderModalOpen] = useState(false);

    const [updateStatusValue, setUpdateStatusValue] = useState('');
    const currentLocationInputRef = useRef<HTMLInputElement>(null);
    const [selectedRiderValue, setSelectedRiderValue] = useState('');

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['delivery-requests', filters],
        queryFn: () => {
            const params: any = {
                pageNumber: 1,
                pageSize: 100
            };

            if (filters.orderRef) params.orderRef = filters.orderRef;
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;
            if (filters.status) params.status = filters.status;
            if (filters.storeCode) params.storeCode = filters.storeCode;

            return axiosOperations.request<DeliveryRequestsResponse>({
                url: '/delivery-request/all',
                method: 'GET',
                params
            });
        },
        select: (response) => response.data
    });

    const deliveryRequests: DeliveryRequest[] = data?.deliveryRequests || [];

    const filteredRequests = useMemo(() => {
        let filtered = deliveryRequests;

        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(request =>
                request.orderRefNo.toLowerCase().includes(searchLower) ||
                request.storeName.toLowerCase().includes(searchLower) ||
                request.storeCode.toLowerCase().includes(searchLower) ||
                request.pickupLocation.toLowerCase().includes(searchLower) ||
                request.deliveryLocation.toLowerCase().includes(searchLower) ||
                (request.deliveredBy && request.deliveredBy.toLowerCase().includes(searchLower))
            );
        }

        return filtered;
    }, [deliveryRequests, filters.searchTerm]);

    const handleViewDetails = (request: DeliveryRequest) => {
        setSelectedRequest(request);
        setIsDetailsModalOpen(true);
    };

    const handleUpdateStatus = (request: DeliveryRequest) => {
        setSelectedRequest(request);
        setIsUpdateStatusModalOpen(true);
    };

    const handleAssignRider = (request: DeliveryRequest) => {
        setSelectedRequest(request);
        setIsAssignRiderModalOpen(true);
    };

    const handleEditRequest = (request: DeliveryRequest) => {
        router.push(`/operations/delivery-requests/edit?id=${request.id}`);
    };

    const { data: ridersData, isLoading: isLoadingRiders } = useQuery({
        queryKey: ['available-riders'],
        queryFn: () => axiosOperations.request({
            url: '/delivery-rider/riders/list',
            method: 'GET',
        }),
    });

    const riders: any = ridersData?.data?.data || [];

    const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;

        try {
            const params = new URLSearchParams();
            params.append('deliveryRequestId', selectedRequest.id.toString());
            params.append('status', updateStatusValue || selectedRequest.status);
            params.append('currentLocation', currentLocationInputRef.current?.value || '');

            const response = await axiosOperations.post('/delivery-request/status/update', null, {
                params
            });

            if (response.data?.code === '000') {
                toast.success('Delivery status updated successfully');
                setIsUpdateStatusModalOpen(false);
                refetch();
            } else {
                toast.error(response.data?.desc || 'Failed to update status');
            }
        } catch (error: any) {
            console.error('Error updating status:', error);
            toast.error(error?.response?.data?.message || 'Error updating status');
        }
    };

    const handleAssignRiderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;

        try {
            const selectedRiderEmail = selectedRiderValue;
            if (!selectedRiderEmail) {
                toast.error('Please select a rider');
                return;
            }
            const params = new URLSearchParams();
            params.append('deliveryRequestId', selectedRequest.id.toString());
            params.append('rider', selectedRiderEmail);

            const response = await axiosOperations.post('/delivery-request/assign-rider', null, {
                params
            });

            if (response.data?.code === '000') {
                toast.success('Rider assigned successfully');
                setIsAssignRiderModalOpen(false);
                setSelectedRiderValue('');
                refetch();
            } else {
                toast.error(response.data?.desc || 'Failed to assign rider');
            }
        } catch (error: any) {
            console.error('Error assigning rider:', error);
            toast.error(error?.response?.data?.message || 'Error assigning rider');
        }
    };

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            orderRef: '',
            startDate: '',
            endDate: '',
            status: '',
            storeCode: ''
        });
    };

    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'PICKED', label: 'Picked' },
        { value: 'IN_TRANSIT', label: 'In Transit' },
        { value: 'ASSIGNED', label: 'Assigned' },
        { value: 'DELIVERED', label: 'Delivered' },
        { value: 'CANCELLED', label: 'Cancelled' },
        { value: 'RETURNED', label: 'Returned' }
    ];

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Delivery Requests
                            </h1>
                            <p className="text-gray-600">
                                Manage and track all delivery requests
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{filteredRequests.length}</p>
                        <p className="text-sm text-gray-600">Total Requests</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Search</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search requests..."
                                            value={filters.searchTerm}
                                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Order Reference</Label>
                                    <Input
                                        placeholder="Order reference number"
                                        value={filters.orderRef}
                                        onChange={(e) => handleFilterChange('orderRef', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                                    <Select
                                        value={filters.status}
                                        onValueChange={(value) => handleFilterChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Store Code</Label>
                                    <Input
                                        placeholder="Store code"
                                        value={filters.storeCode}
                                        onChange={(e) => handleFilterChange('storeCode', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                                    <Input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">End Date</Label>
                                    <Input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                    />
                                </div>

                                <div className="flex items-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="flex-1"
                                    >
                                        Clear Filters
                                    </Button>
                                    <Button
                                        onClick={() => refetch()}
                                        className="flex-1"
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Delivery Requests
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => exportDeliveryRequestsToCSV(filteredRequests)}
                                        disabled={filteredRequests.length === 0}
                                    >
                                        <Download className="w-4 h-4" />
                                        Export
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => refetch()}
                                    >
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-40">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="ml-3 text-gray-600">Loading delivery requests...</p>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-red-500">Error loading delivery requests</p>
                                </div>
                            ) : filteredRequests.length === 0 ? (
                                <div className="flex justify-center items-center h-40 flex-col gap-4">
                                    <Truck className="w-12 h-12 text-gray-400" />
                                    <p className="text-gray-500">No delivery requests found</p>
                                </div>
                            ) : (
                                <DeliveryRequestsTable
                                    data={filteredRequests}
                                    onViewDetails={handleViewDetails}
                                    onUpdateStatus={handleUpdateStatus}
                                    onAssignRider={handleAssignRider}
                                    onEdit={handleEditRequest}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle className="flex items-center gap-2">
                            Delivery Request Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete information for delivery request #{selectedRequest?.id}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="py-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Order Reference</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedRequest.orderRefNo}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Request ID</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedRequest.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Store Information</p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm font-semibold">{selectedRequest.storeName}</p>
                                        <p className="text-xs text-gray-600">{selectedRequest.storeCode}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Status</p>
                                    <Badge className={`${getStatusColor(selectedRequest.status)} text-xs px-3 py-1.5`}>
                                        {selectedRequest.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Locations</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-xs font-medium text-blue-800">Pickup Location</p>
                                            </div>
                                            <p className="text-sm text-blue-900">{selectedRequest.pickupLocation}</p>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-xs font-medium text-green-800">Delivery Location</p>
                                            </div>
                                            <p className="text-sm text-green-900">{selectedRequest.deliveryLocation}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Package Details</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600">Size</p>
                                            <Badge className={`${getPackageSizeColor(selectedRequest.packageSize)} text-xs mt-1`}>
                                                {selectedRequest.packageSize}
                                            </Badge>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600">Weight</p>
                                            <p className="text-sm font-semibold">{selectedRequest.weightKg} kg</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600">Dimensions</p>
                                            <p className="text-sm font-semibold">
                                                {selectedRequest.length}x{selectedRequest.width}x{selectedRequest.height} cm
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600">Delivery Speed</p>
                                            <Badge className={`${getDeliverySpeedColor(selectedRequest.deliverySpeed)} text-xs mt-1`}>
                                                {selectedRequest.deliverySpeed}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Delivery Information</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600">Delivered By</p>
                                            <p className="text-sm font-semibold">{selectedRequest.deliveredBy || 'Not assigned'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600">Current Location</p>
                                            <p className="text-sm font-semibold">{selectedRequest.currentLocation || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Timestamps</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600">Created Date</p>
                                            <p className="text-sm font-semibold">{selectedRequest.createdDate}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600">Delivery Date</p>
                                            <p className="text-sm font-semibold">{selectedRequest.deliveryDate || 'Not delivered'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-600">Is Return</p>
                                    <Badge className={`${selectedRequest.isReturn === 'Y' ? 'bg-red-500' : 'bg-green-500'} text-white text-xs mt-1`}>
                                        {selectedRequest.isReturn === 'Y' ? 'Yes - Return Order' : 'No - Standard Delivery'}
                                    </Badge>
                                </div> */}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isUpdateStatusModalOpen} onOpenChange={setIsUpdateStatusModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle className="flex items-center gap-2">
                            Update Delivery Status
                        </DialogTitle>
                        <DialogDescription>
                            Update status for delivery request #{selectedRequest?.id}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdateStatusSubmit}>
                        <div className="py-4 space-y-4">
                            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Order:</span>
                                        <p className="font-medium">{selectedRequest?.orderRefNo}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Current Status:</span>
                                        <Badge className={`${getStatusColor(selectedRequest?.status || '')} text-xs ml-2`}>
                                            {selectedRequest?.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">New Status *</Label>
                                <Select
                                    name="status"
                                    value={updateStatusValue || selectedRequest?.status}
                                    onValueChange={setUpdateStatusValue}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currentLocation">Current Location</Label>
                                <Input
                                    id="currentLocation"
                                    name="currentLocation"
                                    placeholder="Enter current location"
                                    defaultValue={selectedRequest?.currentLocation}
                                    ref={currentLocationInputRef}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsUpdateStatusModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Update Status
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isAssignRiderModalOpen} onOpenChange={setIsAssignRiderModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle className="flex items-center gap-2">
                            Assign Rider
                        </DialogTitle>
                        <DialogDescription>
                            Assign a rider to delivery request #{selectedRequest?.id}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAssignRiderSubmit}>
                        <div className="py-4 space-y-4">
                            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <div className="mt-2 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order:</span>
                                        <span className="font-medium">{selectedRequest?.orderRefNo}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery Location:</span>
                                        <span className="font-medium truncate ml-2 max-w-[200px]">
                                            {selectedRequest?.deliveryLocation}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rider">Select Rider *</Label>
                                <Select
                                    value={selectedRiderValue}
                                    onValueChange={setSelectedRiderValue}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select rider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingRiders ? (
                                            <SelectItem value="loading" disabled>
                                                Loading riders...
                                            </SelectItem>
                                        ) : riders.length === 0 ? (
                                            <SelectItem value="no-riders" disabled>
                                                No riders found
                                            </SelectItem>
                                        ) : (
                                            riders.map((rider: any) => (
                                                <SelectItem key={rider.email} value={rider.email}>
                                                    {rider.fullName} • {rider.email}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> Once assigned, this rider will be responsible for delivering this package.
                                </p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsAssignRiderModalOpen(false);
                                    setSelectedRiderValue('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Assign Rider
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
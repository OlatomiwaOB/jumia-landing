'use client'
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Loader2, Truck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SaveRoutePriceModal from '@/components/Operations/delivery/SaveRoutePriceModal';
import CalculateRoutePriceModal from '@/components/Operations/delivery/CalculateRoutePriceModal';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Area {
    id: number;
    areaName: string;
}

interface Zone {
    zoneId: number;
    zoneCode: string;
    zoneName: string;
    status: string;
    areaList: Area[];
}

interface Column {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    render?: (value: any, record: Zone, index: number) => React.ReactNode;
}

const getDisplayValue = (value: any): string => {
    return value?.toString() || 'N/A';
};

const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE':
            return 'bg-green-100 text-green-800';
        case 'INACTIVE':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const SimpleTable = ({
    columns,
    data,
    itemsPerPage = 10,
    onViewDetails,
    onEdit
}: {
    columns: Column[];
    data: Zone[];
    itemsPerPage?: number;
    onViewDetails: (zone: Zone) => void;
    onEdit: (zone: Zone) => void;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const handleViewDetails = (zone: Zone) => {
        setSelectedZone(zone);
        setIsModalOpen(true);
        onViewDetails(zone);
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
                render: (text: string, record: Zone) => (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-accent/20"
                            onClick={() => handleViewDetails(record)}
                        >
                            <Eye className="w-4 h-4 text-accent-foreground" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-accent/20"
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
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                            {columnsWithHandler.map((column) => (
                                <th
                                    key={column.key}
                                    className="text-left p-4 font-semibold text-sm text-gray-700"
                                    style={{ width: column.width ? `${column.width}px` : 'auto' }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((zone, index) => (
                            <tr
                                key={zone.zoneId}
                                className={`border-b border-gray-100 hover:bg-gray-50 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
                            >
                                {columnsWithHandler.map((column) => (
                                    <td key={column.key} className="p-4 text-sm text-gray-700">
                                        {column.render
                                            ? column.render(zone[column.dataIndex as keyof Zone], zone, index)
                                            : getDisplayValue(zone[column.dataIndex as keyof Zone])
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
                <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Zones
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-xs border-gray-300 hover:bg-gray-100"
                    >
                        Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 p-0 text-xs ${currentPage === page ? 'bg-accent/70 text-white' : 'border-gray-300 hover:bg-gray-100'}`}
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="text-xs border-gray-300 hover:bg-gray-100"
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* View Details Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle>Zone Details</DialogTitle>
                        <DialogDescription>
                            {selectedZone?.zoneName}
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedZone && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Zone Code</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedZone.zoneCode}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <Badge className={getStatusColor(selectedZone.status)}>
                                        {selectedZone.status}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                    Areas ({selectedZone.areaList?.length || 0})
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2">
                                    {selectedZone.areaList?.map((area) => (
                                        <div key={area.id} className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-5 h-5">
                                                <input
                                                    type="checkbox"
                                                    checked
                                                    readOnly
                                                    className="w-4 h-4 text-accent/70 bg-gray-100 border-gray-300 rounded focus:ring-accent/60"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-700">{area.areaName}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {(!selectedZone.areaList || selectedZone.areaList.length === 0) && (
                                    <p className="text-sm text-gray-500 text-center py-4">No areas configured</p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default function DeliveryPage() {
    const router = useRouter();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['delivery-zones'],
        queryFn: () => axiosOperations.request({
            url: '/delivery/zones',
            method: 'GET'
        })
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [showSaveRoutePrice, setShowSaveRoutePrice] = useState(false);
    const [showCalculateRoutePrice, setShowCalculateRoutePrice] = useState(false);

    const zones: Zone[] = data?.data?.zoneList || [];

    const filteredZones = zones.filter(zone => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (zone.zoneCode?.toLowerCase() || '').includes(searchLower) ||
            (zone.zoneName?.toLowerCase() || '').includes(searchLower) ||
            (zone.areaList?.some(area => area.areaName.toLowerCase().includes(searchLower)))
        );
    });

    const handleViewDetails = (zone: Zone) => {
        // console.log('Viewing zone:', zone);
    };

    const handleEdit = (zone: Zone) => {
        router.push(`/operations/delivery/save-zone?id=${zone.zoneId}`);
    };

    const columns: Column[] = [
        {
            title: 'S/N',
            dataIndex: 'zoneId',
            key: 'sn',
            width: 80,
            render: (text: string, record: Zone, index: number) => (
                <p className="text-sm text-gray-700">{index + 1}</p>
            ),
        },
        {
            title: 'Zone Code',
            dataIndex: 'zoneCode',
            key: 'zoneCode',
            width: 120,
            render: (text: string) => (
                <p className="text-sm font-medium text-gray-900">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Zone Name',
            dataIndex: 'zoneName',
            key: 'zoneName',
            width: 200,
            render: (text: string) => (
                <p className="text-sm text-gray-900">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (text: string) => (
                <Badge className={getStatusColor(text)}>
                    {getDisplayValue(text)}
                </Badge>
            ),
        },
        {
            title: 'Areas',
            dataIndex: 'areaList',
            key: 'areas',
            width: 300,
            render: (areas: Area[]) => (
                <p className="text-sm text-gray-600 line-clamp-2">
                    {areas?.map(area => area.areaName).join(', ') || 'No areas'}
                </p>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 120,
            render: (text: string, record: Zone) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/20"
                        onClick={() => handleViewDetails(record)}
                    >
                        <Eye className="w-4 h-4 text-accent-foreground" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/20"
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Delivery Management
                            </h1>
                            <p className="text-gray-600">
                                Manage delivery zones, areas, and route pricing
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{zones.length}</p>
                        <p className="text-sm text-gray-600">Total Zones</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search zones or areas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-gray-300 text-gray-900"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <Link href="/operations/delivery/save-zone" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto gap-2 bg-accent/70 hover:bg-accent text-white">
                                    <Plus className="w-4 h-4" />
                                    Save Zone
                                </Button>
                            </Link>
                            <Button
                                onClick={() => setShowSaveRoutePrice(true)}
                                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                            >
                                Set Price
                            </Button>
                            <Button
                                onClick={() => setShowCalculateRoutePrice(true)}
                                variant="outline"
                                className="gap-2 border-gray-300 hover:bg-gray-100"
                            >
                                View Price
                            </Button>
                        </div>
                    </div>

                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <div className='flex justify-between'>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Delivery Zones List
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetch()}
                                    className="border-gray-300 hover:bg-gray-100"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-40">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                                        <p className="text-gray-600">Loading delivery zones...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-gray-600">Error loading delivery zones</p>
                                </div>
                            ) : zones.length === 0 ? (
                                <div className="flex justify-center items-center h-40 flex-col gap-4">
                                    <p className="text-gray-600">No delivery zones found</p>
                                    <Link href="/operations/delivery/save-zone">
                                        <Button className="gap-2 bg-accent/70 hover:bg-accent text-white">
                                            <Plus className="w-4 h-4" />
                                            Create First Zone
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <SimpleTable
                                    columns={columns}
                                    data={filteredZones}
                                    itemsPerPage={10}
                                    onViewDetails={handleViewDetails}
                                    onEdit={handleEdit}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Modals */}
                {showSaveRoutePrice && (
                    <SaveRoutePriceModal
                        isOpen={showSaveRoutePrice}
                        onClose={() => setShowSaveRoutePrice(false)}
                        zones={zones}
                    />
                )}

                {showCalculateRoutePrice && (
                    <CalculateRoutePriceModal
                        isOpen={showCalculateRoutePrice}
                        onClose={() => setShowCalculateRoutePrice(false)}
                    />
                )}
            </div>
        </div>
    );
}
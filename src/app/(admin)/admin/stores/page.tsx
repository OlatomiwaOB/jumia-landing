'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Download, Plus, Search, Eye, MapPin, Phone, Mail, Globe, Edit, ExternalLink, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';
import placeholder from "@/components/images/placeholder-product.webp"
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermissionBusiness';

interface Store {
    id: number;
    entityCode: string;
    code: string;
    storeName: string;
    address: string;
    logo: string;
    telephone: string;
    email: string;
    manager: string;
    status: string;
    merchantCode: string;
}

interface Column {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    render?: (value: any, record: Store, index: number) => React.ReactNode;
}

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-gray-500 text-white';

    switch (status.toUpperCase()) {
        case 'ACTIVE':
            return 'bg-green-500 text-white';
        case 'INACTIVE':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const getDisplayValue = (value: any): string => {
    return value?.toString() || 'N/A';
};

const DynamicTable = ({
    columns,
    data,
    itemsPerPage = 5,
    onViewDetails,
    onEditDetails,
    onGoToStore
}: {
    columns: Column[];
    data: Store[];
    itemsPerPage?: number;
    onViewDetails: (store: Store) => void;
    onEditDetails: (store: Store) => void;
    onGoToStore: (store: Store) => void;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const handleViewDetails = (store: Store) => {
        setSelectedStore(store);
        setIsModalOpen(true);
        onViewDetails(store);
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
                render: (text: string, record: Store) => (
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => handleViewDetails(record)}
                        >
                            <Eye className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => onEditDetails(record)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => onGoToStore(record)}
                        >
                            <ExternalLink className="w-4 h-4" />
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
                        <tr className="border-b-2 border-gray-200">
                            {columnsWithHandler.map((column) => (
                                <th
                                    key={column.key}
                                    className="text-left p-3 font-bold text-sm text-gray-700"
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
                                className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
                            >
                                {columnsWithHandler.map((column) => (
                                    <td key={column.key} className="p-3 text-sm">
                                        {column.render
                                            ? column.render(item[column.dataIndex as keyof Store], item, index)
                                            : getDisplayValue(item[column.dataIndex as keyof Store])
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
                <p className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Stores
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-xs"
                    >
                        Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0 text-xs"
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="text-xs"
                    >
                        Next
                    </Button>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle>Store Details - {selectedStore?.storeName || 'N/A'}</DialogTitle>
                        <DialogDescription>
                            Detailed information about the selected store
                        </DialogDescription>
                    </DialogHeader>

                    {selectedStore && (
                        <div className="py-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-20 h-20 relative rounded-md overflow-hidden">
                                    <Image
                                        src={selectedStore.logo || `${placeholder.src}`}
                                        alt={selectedStore.storeName}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `${placeholder.src}`;
                                        }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{getDisplayValue(selectedStore.storeName)}</h3>
                                    <Badge className={`${getStatusColor(selectedStore.status)} text-xs px-2 py-1 mt-1 w-fit`}>
                                        {getDisplayValue(selectedStore.status)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Store Code:</p>
                                    <p className="text-sm">{getDisplayValue(selectedStore.code)}</p>
                                </div>
                                {/* <div className="space-y-2">
                                    <p className="text-sm font-medium">Entity Code:</p>
                                    <p className="text-sm">{getDisplayValue(selectedStore.entityCode)}</p>
                                </div> */}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Manager:</p>
                                    <p className="text-sm">{getDisplayValue(selectedStore.manager)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Merchant Code:</p>
                                    <p className="text-sm">{getDisplayValue(selectedStore.merchantCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Status:</p>
                                    <Badge className={`${getStatusColor(selectedStore.status)} text-xs px-2 py-1 w-fit`}>
                                        {getDisplayValue(selectedStore.status)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 w-4" /> Address
                                </h4>
                                <p className="text-sm">{getDisplayValue(selectedStore.address)}</p>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h4 className="font-medium mb-3">Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedStore.telephone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            <p className="text-sm">{getDisplayValue(selectedStore.telephone)}</p>
                                        </div>
                                    )}
                                    {selectedStore.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <p className="text-sm">{getDisplayValue(selectedStore.email)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

const MobileStoreCard = ({ store, onViewDetails }: { store: Store; onViewDetails: (store: Store) => void }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative rounded-md overflow-hidden">
                        <Image
                            src={store.logo || `${placeholder.src}`}
                            alt={store.storeName}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `${placeholder.src}`;
                            }}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(store.storeName)}</p>
                        <p className="text-xs text-gray-500">{getDisplayValue(store.code)}</p>
                    </div>
                </div>
                <Badge className={`${getStatusColor(store.status)} text-xs px-2 py-1`}>
                    {getDisplayValue(store.status)}
                </Badge>
            </div>

            <div className="text-sm text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{getDisplayValue(store.address)}</span>
            </div>

            {store.telephone && (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{getDisplayValue(store.telephone)}</span>
                </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div>
                    <p className="text-xs text-gray-500">Manager</p>
                    <p className="text-sm font-medium">{getDisplayValue(store.manager)}</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => onViewDetails(store)}
                >
                    <Eye className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

export default function StoresPage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('MANAGE_STORES', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage stores"
    });
    const { user } = useUser();
    const router = useRouter();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['stores-list'],
        queryFn: () => axiosInstance.request({
            url: '/store/merchant',
            method: 'GET',
            params: {
                merchantCode: user?.merchantCode
            }
        })
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isH2P = process.env.NEXT_PUBLIC_ENTITYCODE === 'H2P';


    const stores: Store[] = data?.data?.data || [];
    const filteredStores = stores.filter(store =>
        store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.manager && store.manager.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleViewDetails = (store: Store) => {
        setSelectedStore(store);
        setIsModalOpen(true);
    };

    const handleEditDetails = (store: Store) => {
        router.push(`/admin/stores/create-store?edit=true&id=${store.code}`);
    };

    const columns: Column[] = [
        {
            title: 'Store',
            dataIndex: 'storeName',
            key: 'store',
            width: 200,
            render: (text: string, record: Store) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded-md overflow-hidden">
                        <Image
                            src={record.logo || `${placeholder.src}`}
                            alt={record.storeName}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `${placeholder.src}`;
                            }}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{getDisplayValue(text)}</p>
                        <p className="text-xs text-gray-500">{getDisplayValue(record.code)}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 200,
            render: (text: string) => (
                <p className="text-sm line-clamp-2">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Manager',
            dataIndex: 'manager',
            key: 'manager',
            width: 150,
            render: (text: string) => (
                <p className="text-sm font-medium">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
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
            render: (text: string, record: Store) => (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={() => handleViewDetails(record)}
                    >
                        <Eye className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={() => handleEditDetails(record)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    if (!isH2P) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-accent/10 rounded-full p-4">
                            <AlertCircle className="w-8 h-8 text-accent/60" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Stores
                    </h1>

                    <p className="text-gray-600 mb-6">
                        This feature is coming soon. We're working hard to bring you a seamless way to manage multitple stores.
                    </p>

                    <div className="space-y-3">
                        <p className="text-sm text-gray-500">
                            ✓ Store management<br />
                            ✓ Elaborate Inventories system<br />
                            ✓ Multiple units
                        </p>
                    </div>

                    <p className="text-xs text-gray-400 mt-8">
                        Stay tuned for updates
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Stores Management
                            </h1>
                            <p className="text-muted-foreground">
                                View and manage your stores
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{stores.length}</p>
                        <p className="text-sm text-muted-foreground">Total Stores</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search stores..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Link href="/admin/stores/create-store" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto gap-2">
                                    <Plus className="w-4 h-4" />
                                    Create Store
                                </Button>
                            </Link>
                            <Button variant="outline" className="gap-2">
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                        </div>
                    </div>

                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Store List
                                </CardTitle>
                                <Button variant="outline" size="sm" onClick={() => refetch()}>
                                    Refresh
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-gray-500">Loading stores...</p>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-red-500">Error loading stores</p>
                                </div>
                            ) : stores.length === 0 ? (
                                <div className="flex justify-center items-center h-40 flex-col gap-4">
                                    <p className="text-gray-500">No stores found</p>
                                    <Link href="/admin/stores/create-store">
                                        <Button className="gap-2">
                                            <Plus className="w-4 h-4" />
                                            Create Your First Store
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="block lg:hidden space-y-4">
                                        {filteredStores.map((store) => (
                                            <MobileStoreCard
                                                key={store.id}
                                                store={store}
                                                onViewDetails={handleViewDetails}
                                            />
                                        ))}
                                    </div>

                                    <div className="hidden lg:block">
                                        <DynamicTable
                                            columns={columns}
                                            data={filteredStores}
                                            onViewDetails={handleViewDetails}
                                            onEditDetails={handleEditDetails}
                                            onGoToStore={(store) => {
                                                window.open(`/?storeCode=${store.code}`, '_blank');
                                                // console.log('Go to store:', store);
                                            }}
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
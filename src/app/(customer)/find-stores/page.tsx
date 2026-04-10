'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Phone, Mail, User, Store, ArrowRight, Clock, Shield, Truck, Eye, Navigation, ExternalLink, Loader2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import Image from 'next/image';
import placeholder from "@/components/images/placeholder-product.webp";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import useGetLookup from "@/app/hooks/useGetLookup";

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
    businessType?: string;
    backgroundLogo?: string;
}

interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
    storeName: string;
    address: string;
}

const MapModal = ({ isOpen, onClose, storeName, address }: MapModalProps) => {
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);

    const getGoogleMapsUrl = () => {
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    };

    const getGoogleDirectionsUrl = () => {
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    };

    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const getEmbeddedMapUrl = () => {
        if (!googleMapsApiKey) {
            console.warn('Google Maps API key is not configured');
            return '';
        }

        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodedAddress}&zoom=15`;
    };

    const handleMapLoad = () => {
        setIsMapLoaded(true);
        setMapError(false);
    };

    const handleMapError = () => {
        setMapError(true);
        setIsMapLoaded(true);
    };

    useEffect(() => {
        if (isOpen) {
            setIsMapLoaded(false);
            setMapError(false);
        }
    }, [isOpen, address]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className='flex flex-col'>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-accent" />
                        Store Location - {storeName}
                    </DialogTitle>
                    <DialogDescription>
                        {"View the store location on Google Maps and get directions to visit us!"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="relative w-full h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        {!isMapLoaded && !mapError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 z-10">
                                <div className="text-center">
                                    <div className="relative mb-4">
                                        <div className="absolute inset-0 opacity-20">
                                            <div className="grid grid-cols-8 grid-rows-8 gap-1 h-full w-full">
                                                {[...Array(64)].map((_, i) => (
                                                    <div key={i} className="bg-gray-400 rounded-sm"></div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="relative z-10">
                                            <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center animate-pulse">
                                                <MapPin className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="mt-2">
                                                <div className="w-1 h-8 bg-accent mx-auto"></div>
                                                <div className="w-4 h-4 bg-accent rotate-45 mx-auto -mt-2"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                                        <p className="text-gray-600 font-medium">Loading map...</p>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto px-4">
                                        {address}
                                    </p>
                                </div>
                            </div>
                        )}

                        {mapError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 z-20">
                                <div className="text-center p-4">
                                    <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                        <MapPin className="h-6 w-6 text-red-600" />
                                    </div>
                                    <p className="text-gray-700 font-medium mb-2">Could not load map</p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Please check your connection or try opening in Google Maps
                                    </p>
                                    <a
                                        href={getGoogleMapsUrl()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        Open in Google Maps
                                    </a>
                                </div>
                            </div>
                        )}

                        {googleMapsApiKey && (
                            <iframe
                                src={getEmbeddedMapUrl()}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className={`rounded-lg transition-opacity duration-300 ${isMapLoaded && !mapError ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={handleMapLoad}
                                onError={handleMapError}
                                title={`Google Maps location for ${storeName}`}
                            />
                        )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">Store Address</p>
                                <p className="text-gray-600 mt-1">{address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">Get Directions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <a
                                href={getGoogleMapsUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white font-medium py-3 px-4 rounded-lg transition-colors"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Open in Google Maps
                            </a>
                            <a
                                href={getGoogleDirectionsUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                            >
                                <Navigation className="h-4 w-4" />
                                Get Directions
                            </a>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    {""}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function StoresPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStore, setSelectedStore] = useState<{ name: string; address: string } | null>(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [selectedBusinessType, setSelectedBusinessType] = useState<string>("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const businessTypeOptions = useGetLookup('BUSINESS_TYPE');

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['stores-list', selectedBusinessType],
        queryFn: () => axiosCustomer.request({
            url: '/store/merchant',
            method: 'GET',
            params: selectedBusinessType ? { businessType: selectedBusinessType } : {}
        })
    });

    const stores: Store[] = data?.data?.data || [];

    const filteredStores = stores.filter(store =>
        store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.businessType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.manager && store.manager.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const openMapModal = (store: Store) => {
        setSelectedStore({
            name: store.storeName,
            address: store.address
        });
        setIsMapModalOpen(true);
    };

    const handleBusinessTypeChange = (value: string) => {
        setSelectedBusinessType(value);
        setIsFilterOpen(false);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedBusinessType("");
    };

    const hasActiveFilters = searchTerm !== "" || selectedBusinessType !== "";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="container mx-auto p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-300"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-10 bg-gray-300 rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500">Error loading stores. Please try again.</p>
                    <Button onClick={() => router.refresh()} className="mt-4">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {selectedStore && (
                <MapModal
                    isOpen={isMapModalOpen}
                    onClose={() => setIsMapModalOpen(false)}
                    storeName={selectedStore.name}
                    address={selectedStore.address}
                />
            )}

            <div className="bg-accent text-white py-12 rounded-3xl">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Discover Amazing Stores
                        </h1>
                        <p className="text-lg mb-8 opacity-90">
                            Browse through our curated collection of local stores.
                            Find products you love from trusted merchants.
                        </p>

                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search stores by name, location, or manager..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-white/40"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Truck className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Get your orders delivered quickly and reliably, right to your doorstep.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Secure Shopping</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Shop with confidence knowing your payment information is protected.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Clock className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Our customer support team is always ready to assist you.
                        </p>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="md:flex items-center md:justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Available Stores
                            </h2>
                            <p className="text-gray-600">
                                {filteredStores.length} stores found
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Button
                                    variant="default"
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="flex items-center gap-2 min-w-[180px] justify-between"
                                >
                                    <span className="truncate">
                                        {selectedBusinessType
                                            ? businessTypeOptions.find(opt => opt.id === selectedBusinessType)?.name || selectedBusinessType
                                            : "Filter by Type"
                                        }
                                    </span>
                                    {isFilterOpen ? (
                                        <ChevronUp className="h-4 w-4 opacity-50" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    )}
                                </Button>

                                {isFilterOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsFilterOpen(false)}
                                        />

                                        <div className="absolute right-0 mt-2 w-full min-w-[200px] bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                            <div className="py-1 max-h-[300px] overflow-y-auto">
                                                {businessTypeOptions.length === 0 ? (
                                                    <div className="px-4 py-2 text-sm text-gray-500">
                                                        Loading options...
                                                    </div>
                                                ) : (
                                                    <>
                                                        {selectedBusinessType && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedBusinessType("");
                                                                    setIsFilterOpen(false);
                                                                }}
                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                Clear filter
                                                            </button>
                                                        )}

                                                        {businessTypeOptions.map((option) => (
                                                            <button
                                                                key={option.id}
                                                                onClick={() => handleBusinessTypeChange(option.id)}
                                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${selectedBusinessType === option.id
                                                                    ? 'bg-accent/10 text-accent font-medium'
                                                                    : 'text-gray-700'
                                                                    }`}
                                                            >
                                                                {option.name}
                                                            </button>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>

                    {filteredStores.length === 0 ? (
                        <div className="text-center py-12">
                            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No stores found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {hasActiveFilters
                                    ? "Try adjusting your search terms or filters"
                                    : "No stores available at the moment"
                                }
                            </p>
                            {hasActiveFilters && (
                                <Button onClick={clearFilters}>
                                    Clear All Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStores.map((store) => (
                                <StoreCard
                                    key={store.id}
                                    store={store}
                                    onViewMap={() => openMapModal(store)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface StoreCardProps {
    store: Store;
    onViewMap: () => void;
}

const StoreCard = ({ store, onViewMap }: StoreCardProps) => {
    const getDisplayValue = (value: any): string => {
        return value?.toString() || 'N/A';
    };

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

    return (
        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-accent/20">
            <div className="relative h-48 bg-gradient-to-br from-accent/10 to-accent/5 p-6">
                {store.backgroundLogo && (
                    <Image
                        src={store.backgroundLogo}
                        alt={store.storeName + " background"}
                        fill
                        className="object-cover group-hover:scale-90 transition-transform duration-300 group-hover:rounded-3xl"
                    />
                )}

                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full translate-y-12 -translate-x-8"></div>

                <div className="absolute top-4 right-4 z-10">
                    <Badge className={`${getStatusColor(store.status)} text-xs px-3 py-1`}>
                        {getDisplayValue(store.status)}
                    </Badge>
                </div>

                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image
                            src={store.logo || `${placeholder.src}`}
                            alt={store.storeName}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `${placeholder.src}`;
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                        {getDisplayValue(store.storeName)}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Store className="h-4 w-4 mr-1" />
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {getDisplayValue(store.code)} • {getDisplayValue(store.businessType)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4 transition-colors">
                    <div className="flex items-center text-sm flex-1">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 line-clamp-1">
                            {getDisplayValue(store.address)}
                        </span>
                    </div>
                    <button
                        onClick={onViewMap}
                        className="ml-2 p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                        title="View location on Google Maps"
                        aria-label="View store location on Google Maps"
                    >
                        <Eye className="h-4 w-4 text-gray-600 hover:text-accent transition-colors" />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    {store.telephone && (
                        <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">
                                {getDisplayValue(store.telephone)}
                            </span>
                        </div>
                    )}
                    
                    <div className='h-5'>
                        {store.manager && (
                            <div className="flex items-center text-sm">
                                <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                                <span className="text-gray-700">
                                    Managed by {getDisplayValue(store.manager)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <Link href={`/find-stores/${store.code}`} className="block w-full">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-white group/btn">
                        <span>Shop from this Store</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </div>
    );
};
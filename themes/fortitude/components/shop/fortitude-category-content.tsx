'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { ProductCard } from '../utils/products-card';
import { ProductProps } from '@/types';
import ProductDetailsModal from '../utils/product-details-modal';
import Image from 'next/image';
import {
    ShoppingBagIcon,
    BadgeCheck,
    ArrowLeftIcon,
} from 'lucide-react';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { useCategories } from '@/app/hooks/useCategories';

interface CategoryDetails {
    id: number;
    code: string;
    name: string;
    description: string;
    sector: string;
    logo: string;
    tags: string | null;
    topCategory: string | null;
    qty: number | null;
    storeCode: string | null;
}

export default function FortitudeCategoryContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryCode = decodeURIComponent(params.categoryCode as string);
    const storeCode = searchParams?.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE || '';
    const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD';

    const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [filterPriceRange, setFilterPriceRange] = useState<[number | null, number | null]>([null, null]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
    const { data: productsData, isLoading: productsLoading } = useQuery({
        queryKey: ['category-products', categoryCode, storeCode, sortBy],
        queryFn: () => {
            return axiosInstanceNoAuth.request({
                method: "GET",
                url: '/ecommerce/products/list',
                params: {
                    name: '',
                    storeCode: storeCode,
                    entityCode: entityCode,
                    category: categoryCode,
                    tag: '',
                    pageNumber: 1,
                    pageSize: 1000,
                    sortBy: sortBy
                }
            }).then(response => response.data)
        }
    });

    const currentCategory: CategoryDetails | undefined = categoriesData?.categories?.find(
        (cat: CategoryDetails) => cat.code === categoryCode
    );

    const categoryName = currentCategory?.name || 'Category';

    const processedProducts = productsData?.products
        ?.filter((product: ProductProps) => {
            const price = product.salePrice || product.oldPrice || 0;
            return (filterPriceRange[0] == null || price >= filterPriceRange[0]) &&
                (filterPriceRange[1] == null || price <= filterPriceRange[1]);
        })
        .sort((a: ProductProps, b: ProductProps) => {
            switch (sortBy) {
                case 'price-low-high':
                    return (a.salePrice || a.oldPrice || 0) - (b.salePrice || b.oldPrice || 0);
                case 'price-high-low':
                    return (b.salePrice || b.oldPrice || 0) - (a.salePrice || a.oldPrice || 0);
                case 'name':
                default:
                    return a.name?.localeCompare(b.name || '') || 0;
            }
        }) || [];

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = processedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(processedProducts.length / productsPerPage);

    if (productsLoading || categoriesLoading) {
        return (
            <div className="container mx-auto py-8 px-4 mt-20">
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                                <div className="h-6 w-16 bg-gray-200 rounded-full mb-4"></div>
                                <div className="w-full h-48 bg-gray-200 mb-4 rounded-md"></div>
                                <div className="h-6 bg-gray-200 mb-2 rounded"></div>
                                <div className="h-6 bg-gray-200 mb-4 rounded"></div>
                                <div className="h-10 bg-gray-200 rounded-3xl"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=" py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
                            <p className="text-gray-500">{processedProducts.length} items available</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentProducts.map((product: ProductProps) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => {
                                setSelectedProduct(product);
                                setIsModalOpen(true);
                            }}
                        />
                    ))}
                </div>

                {processedProducts.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your filters or browse other categories.</p>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                                    currentPage === page
                                        ? 'bg-accent text-white'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <ProductDetailsModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                product={selectedProduct}
            />
        </div>
    );
}

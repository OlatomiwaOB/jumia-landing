'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { ProductCard } from '@/utils/products-card';
import { ProductProps } from '@/types';
// import Header from '@./../../fortitude-app/layout/header';
// import Footer from '@./../../fortitude-app/layout/footer';
import ProductDetailsModal from '@/utils/product-details';
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

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryCode = decodeURIComponent(params.categoryCode as string);
    // const categoryCode = searchParams?.get('categoryCode') || '';
    const storeCode = searchParams?.get('storeCode') || process.env.NEXT_PUBLIC_STORE_CODE || '';
    const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD';

    const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    // const [filterPriceRange, setFilterPriceRange] = useState<[number, number]>([0, 100000]);
    const [filterPriceRange, setFilterPriceRange] = useState<[number | null, number | null]>([null, null]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // Fetch category details
    //   const { data: categoriesData } = useQuery({
    //     queryKey: ['categories'],
    //     queryFn: async () => {
    //       const response = await axiosInstanceNoAuth.get('/ecommerce/categories/list', {
    //         params: { storeCode, entityCode }
    //       });
    //       return response.data;
    //     }
    //   });

    // useEffect(() => {
    //     if (!searchParams?.get('storeCode')) {
    //         router.push(`?storeCode=STO0715`);
    //     }
    // }, [router, searchParams]);

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
                    // name: categoryName,
                    category: categoryCode,
                    tag: '',
                    pageNumber: 1,
                    pageSize: 1000,
                    sortBy: sortBy
                }
            }).then(response => response.data)
        }
    });

    // Get current category details
    const currentCategory: CategoryDetails | undefined = categoriesData?.categories?.find(
        (cat: CategoryDetails) => cat.code === categoryCode
    );

    const categoryName = currentCategory?.name || 'Category';

    // Process products with sorting and filtering
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

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = processedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(processedProducts.length / productsPerPage);

    // Stats for the category
    const categoryStats = {
        totalProducts: processedProducts.length,
        averagePrice: processedProducts.length > 0
            ? processedProducts.reduce((sum: number, product: ProductProps) =>
                sum + (product.salePrice || product.oldPrice || 0), 0) / processedProducts.length
            : 0,
        inStockProducts: processedProducts.filter((p: ProductProps) => (p.qtyInStore || 0) > 0).length,
        discountedProducts: processedProducts.filter((p: ProductProps) => p.onSale === true).length
    };

    if (productsLoading) {
        return (
            <>
                {/* <Header /> */}
                <div className="container mx-auto py-8 px-4 mt-20">
                    <div className="animate-pulse">
                        {/* <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div> */}
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
                {/* <Footer /> */}
            </>
        );
    }

    return (
        <>
            {/* <Header /> */}

            <div className=" py-12">
                <div className="container mx-auto px-4">
                    <button
                        onClick={() => router.push(`/shop?storeCode=${storeCode}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-accent mb-6 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back to Shop
                    </button>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div className="flex-shrink-0">
                            <div className="relative w-32 h-32 bg-white rounded-2xl shadow-lg p-4">
                                <Image
                                    src={currentCategory?.logo || '/placeholder-category.jpg'}
                                    alt={categoryName}
                                    fill
                                    className="object-contain rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <h1 className="text-2xl lg:text-4xl font-bold text-gray-900">{categoryName}</h1>
                                <div className="flex items-center p-1 bg-accent text-white rounded-full text-sm">
                                    <BadgeCheck className="w-4 h-4" />
                                </div>
                            </div>

                            <p className="text-lg text-gray-600 mb-6 max-w-md">
                                {currentCategory?.description || `Explore our wide range of ${categoryName.toLowerCase()} products.`}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#d8480b]">{categoryStats.totalProducts}</div>
                                    <div className="text-sm text-gray-500">Total Products</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#d8480b]">
                                        {formatPrice(categoryStats.averagePrice, 'NGN' as CurrencyCode)}
                                    </div>
                                    <div className="text-sm text-gray-500">Average Price</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#d8480b]">{categoryStats.inStockProducts}</div>
                                    <div className="text-sm text-gray-500">In Stock</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#d8480b]">{categoryStats.discountedProducts}</div>
                                    <div className="text-sm text-gray-500">On Sale</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                {currentCategory?.sector && (
                                    <div className="flex items-center gap-1">
                                        <ShoppingBagIcon className="w-4 h-4" />
                                        Sector: <span className="font-medium text-gray-700">{currentCategory.sector}</span>
                                    </div>
                                )}
                                {currentCategory?.code && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium text-gray-700">Code:</span> {currentCategory.code}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-12 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">{categoryStats.totalProducts} products found</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d8480b] focus:border-transparent"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                        </select>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Price:</span>
                            <input
                                type="number"
                                placeholder="Min"
                                value={filterPriceRange[0] ?? ''}
                                onChange={(e) => setFilterPriceRange([Number(e.target.value), filterPriceRange[1]])}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filterPriceRange[1] ?? ''}
                                onChange={(e) => setFilterPriceRange([filterPriceRange[0], Number(e.target.value)])}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                        </div>
                    </div>
                </div>

                {currentProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-lg ${currentPage === page
                                            ? 'bg-[#d8480b] text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-4">🛒</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-6">
                            We couldn't find any products in the {categoryName} category matching your filters.
                        </p>
                        <button
                            onClick={() => {
                                setFilterPriceRange([0, 100000]);
                                setSortBy('name');
                            }}
                            className="px-6 py-2 bg-[#d8480b] text-white rounded-lg hover:bg-[#c23c0a] transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {categoriesData?.categories && categoriesData.categories.length > 1 && (
                <div className="bg-gray-50 py-16 mb-26">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-8">Explore Other Categories</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {categoriesData.categories
                                .filter((cat: CategoryDetails) => cat.code !== categoryCode)
                                .slice(0, 5)
                                .map((category: CategoryDetails) => (
                                    <div
                                        key={category.id}
                                        onClick={() => router.push(`/shop/${encodeURIComponent(category.code)}?storeCode=${storeCode}`)}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow text-center"
                                    >
                                        <div className="relative w-16 h-16 mx-auto mb-2">
                                            <Image
                                                src={category.logo || '/placeholder-category.jpg'}
                                                alt={category.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* <Footer /> */}

            <ProductDetailsModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                product={selectedProduct}
            />
        </>
    );
}

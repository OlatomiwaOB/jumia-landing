'use client';

import { useState, useEffect, use, useRef } from 'react';
import { ProductProps } from '@/types';
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice, CurrencyCode } from '@/utils/helperfns';
import { ProductCard } from '../utils/products-card';
import ProductDetailsModal from '../utils/product-details-modal';
// import RotatingDeals2 from '@/components/themes/rotatingdeals2';
import { useCategories } from '@/app/hooks/useCategories';
import Image from 'next/image';
import { ExternalLink, Search, X, ChevronRight } from 'lucide-react';
import notFound from "@/components/images/not-found.png"

type TabType = 'new-arrivals' | 'ongoing-offers' | 'featured-products' | 'best-sellers';

export default function Shop() {
    const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<ProductProps[]>([]);
    const [dealsOfTheWeek, setDealsOfTheWeek] = useState<ProductProps[]>([]);
    const [searchResults, setSearchResults] = useState<ProductProps[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [tabProducts, setTabProducts] = useState<ProductProps[]>([]);

    // Pagination states
    const [topPicksPage, setTopPicksPage] = useState(1);
    const [topCategoriesPage, setTopCategoriesPage] = useState(1);
    const [allProductsPage, setAllProductsPage] = useState(1);
    const [filteredProductsPage, setFilteredProductsPage] = useState(1);
    const [dealsPage, setDealsPage] = useState(1);
    const PRODUCTS_PER_PAGE = 15;
    const PRODUCTS_PER_PAGE_BY_CAT = 6;

    const productsSectionRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const initialCategory = searchParams ? searchParams.get('category') || '' : '';
    const initialSearch = searchParams ? searchParams.get('search') || '' : '';
    const storeCode = searchParams ? searchParams.get('storeCode') || '' : '';
    const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [shopByCategorySelected, setShopByCategorySelected] = useState(initialCategory);
    const [topCategoriesSelected, setTopCategoriesSelected] = useState('');

    const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD';
    const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
    const initialTab = searchParams ? (searchParams.get('tab') as TabType) || 'new-arrivals' : 'new-arrivals';

    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    useEffect(() => {
        const tabFromUrl = searchParams ? (searchParams.get('tab') as TabType) : 'new-arrivals';
        if (tabFromUrl && tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams, activeTab]);

    useEffect(() => {
        if (initialSearch) {
            setSearchQuery(initialSearch);
        }
    }, [initialSearch]);

    // Auto-scroll to products section when category is selected
    useEffect(() => {
        // Check if it's mobile (screen width less than 768px)
        const isMobile = window.matchMedia('(max-width: 767px)').matches;

        if (isMobile && shopByCategorySelected && shopByCategorySelected !== initialCategory && productsSectionRef.current) {
            productsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [shopByCategorySelected, initialCategory]);

    useEffect(() => {
        if (categoriesData?.categories?.length > 0 && !shopByCategorySelected) {
            const groceriesCategory = categoriesData.categories.find((cat: any) =>
                cat.code.toLowerCase()
            ) || categoriesData.categories[0];
            setShopByCategorySelected(groceriesCategory.code);
        }

        if (categoriesData?.categories?.length > 0 && !topCategoriesSelected) {
            setTopCategoriesSelected(categoriesData.categories[0].code);
        }
    }, [categoriesData, shopByCategorySelected, topCategoriesSelected]);

    const { data: allProductsData, isLoading: allProductsLoading } = useQuery({
        queryKey: ["all-products", storeCode],
        queryFn: () => {
            return axiosInstanceNoAuth.request({
                method: "GET",
                url: '/ecommerce/products/list',
                params: {
                    name: '',
                    storeCode: storeCode,
                    entityCode: entityCode,
                    category: '',
                    tag: '',
                    pageNumber: 1,
                    pageSize: 1000
                }
            }).then(response => response.data)
        }
    });

    const { data: allBestSellerData, isLoading: allBestSellerLoading } = useQuery({
        queryKey: ["all-best-products", storeCode],
        queryFn: () => {
            return axiosInstanceNoAuth.request({
                method: "GET",
                url: '/ecommerce/products/best-selling',
                params: {
                    name: '',
                    storeCode: storeCode,
                    entityCode: entityCode,
                    category: '',
                    tag: '',
                    pageNumber: 1,
                    pageSize: 100
                }
            }).then(response => response.data)
        }
    });

    const { data: featuredProductsData } = useQuery({
        queryKey: ["featured-deals-products", storeCode],
        queryFn: () => {
            return axiosInstanceNoAuth.request({
                method: "GET",
                url: '/ecommerce/products/list',
                params: {
                    name: '',
                    storeCode: storeCode,
                    entityCode: entityCode,
                    category: '',
                    tag: '',
                    pageNumber: 1,
                    pageSize: 1000
                }
            }).then(response => response.data)
        },
    });

    useEffect(() => {
        const performSearch = async (query: string) => {
            if (!query.trim()) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);

            try {
                const response = await axiosInstanceNoAuth.request({
                    method: "GET",
                    url: '/ecommerce/products/list',
                    params: {
                        name: '',
                        storeCode: storeCode,
                        entityCode: entityCode,
                        category: '',
                        tag: '',
                        pageNumber: 1,
                        pageSize: 5000
                    }
                });

                const products = response.data?.products || [];

                // const filteredProducts = products.filter((product: ProductProps) => {
                //     const matchesName = product.name?.toLowerCase().includes(query.toLowerCase())
                //     const matchesLocation = product.storeLocationCity?.toLowerCase().includes(query.toLowerCase())
                //     const matchesDescription = product.description?.toLowerCase().includes(query.toLowerCase())

                //     return matchesName || matchesLocation || matchesDescription
                // })

                const filteredProducts = products.filter((product: ProductProps) => {
                    const searchTerms = query.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);

                    if (searchTerms.length === 0) return true;

                    const name = (product.name || '').toLowerCase();
                    const location = (product.storeLocationCity || '').toLowerCase();
                    const description = (product.description || '').toLowerCase();

                    const searchableText = `${name} ${location} ${description}`;

                    const allTermsPresent = searchTerms.every(term => {
                        const termPattern = new RegExp(`\\b${term}|${term}\\b|${term}`, 'i');
                        return termPattern.test(searchableText);
                    });

                    const hasLocationMatch = searchTerms.some(term => location.includes(term));
                    // const hasProductMatch = searchTerms.some(term => name.includes(term));

                    if (searchTerms.length >= 2 && hasLocationMatch) {
                        const productTerms = searchTerms.filter(term => !location.includes(term));
                        const allProductTermsMatch = productTerms.every(term =>
                            name.includes(term) || description.includes(term)
                        );
                        return allProductTermsMatch;
                    }

                    return allTermsPresent;
                });

                setSearchResults(filteredProducts);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        if (searchQuery.trim()) {
            performSearch(searchQuery);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, storeCode, entityCode]);

    useEffect(() => {
        if (allProductsData?.products) {
            if (shopByCategorySelected) {
                const filtered = allProductsData.products.filter((product: any) =>
                    product.category?.toLowerCase() === shopByCategorySelected.toLowerCase()
                );
                setFilteredProducts(filtered);
                setFilteredProductsPage(1); // Reset pagination when category changes
            } else {
                setFilteredProducts(allProductsData.products);
            }
        }
    }, [allProductsData, shopByCategorySelected]);

    const { data, isLoading: isFeaturedProductsLoading, error } = useQuery({
        queryKey: ["featured-products", topCategoriesSelected, storeCode],
        queryFn: () => {
            return axiosInstanceNoAuth.request({
                method: "GET",
                url: '/ecommerce/products/list',
                params: {
                    name: '',
                    storeCode: storeCode,
                    entityCode: entityCode,
                    category: topCategoriesSelected,
                    tag: '',
                    pageNumber: 1,
                    pageSize: 1000
                }
            }).then(response => response.data)
        },
        enabled: !!topCategoriesSelected
    });

    useEffect(() => {
        if (data?.products) {
            setFeaturedProducts(data.products.slice(0, 100));
            setTopCategoriesPage(1); // Reset pagination when category changes
        }
    }, [data]);

    useEffect(() => {
        if (allProductsData?.products) {
            setAllProducts(allProductsData.products);
            setAllProductsPage(1); // Reset pagination when products change

            const onSaleProducts = allProductsData.products.filter(
                (product: ProductProps) => product.onSale === true
            );
            setDealsOfTheWeek(onSaleProducts.slice(0, 100));
        }
    }, [allProductsData]);

    useEffect(() => {
        if (!allProducts.length) return;

        let filteredProducts: ProductProps[] = [];

        switch (activeTab) {
            case 'new-arrivals':
                filteredProducts = [...allProducts].reverse().slice(0, 100);
                break;
            case 'ongoing-offers':
                filteredProducts = allProducts.filter(
                    (product: ProductProps) => product.onSale === true
                ).slice(0, 100);
                break;
            case 'featured-products':
                filteredProducts = allProducts.filter(
                    (product: ProductProps) => product.featured === true
                ).slice(0, 100);
                break;
            case 'best-sellers':
                filteredProducts = allBestSellerData?.products?.slice(0, 100) || [];
                break;
            default:
                filteredProducts = allProducts.slice(0, 100);
        }

        setTabProducts(filteredProducts);
        setTopPicksPage(1); // Reset pagination when tab changes
    }, [activeTab, allProducts, allBestSellerData]);

    const handleShopCategoryClick = (categoryCode: string) => {
        setShopByCategorySelected(categoryCode);
        setSearchQuery('');
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('category', categoryCode);
        params.delete('search');
        if (storeCode) {
            params.set('storeCode', storeCode);
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleTopCategoryClick = (categoryCode: string) => {
        setTopCategoriesSelected(categoryCode);
    };

    const handleCategoryExternalLink = (categoryCode: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const currentStoreCode = searchParams?.get('storeCode') || '';
        router.push(`/shop/${encodeURIComponent(categoryCode)}?storeCode=${currentStoreCode}`);
    };

    const clearCategoryFilter = () => {
        setShopByCategorySelected('');
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.delete('category');
        if (storeCode) {
            params.set('storeCode', storeCode);
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.delete('search');
        if (storeCode) {
            params.set('storeCode', storeCode);
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const params = new URLSearchParams(searchParams?.toString() || '');
            params.set('search', searchQuery);
            params.delete('category');
            if (storeCode) {
                params.set('storeCode', storeCode);
            }
            router.push(`?${params.toString()}`, { scroll: false });
        }
    };

    const handleDealClick = (product: ProductProps) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Pagination handlers
    const loadMoreTopPicks = () => setTopPicksPage(prev => prev + 1);
    const loadMoreTopCategories = () => setTopCategoriesPage(prev => prev + 1);
    const loadMoreAllProducts = () => setAllProductsPage(prev => prev + 1);
    const loadMoreFilteredProducts = () => setFilteredProductsPage(prev => prev + 1);
    const loadMoreDeals = () => setDealsPage(prev => prev + 1);

    // Get paginated data
    const getPaginatedProducts = (products: ProductProps[], page: number) => {
        return products.slice(0, page * PRODUCTS_PER_PAGE);
    };

    const getPaginatedByCategoryProducts = (products: ProductProps[], page: number) => {
        return products.slice(0, page * PRODUCTS_PER_PAGE_BY_CAT);
    };

    const hasMoreProducts = (products: ProductProps[], page: number) => {
        return products.length > page * PRODUCTS_PER_PAGE;
    };

    const CategoryFilterIndicator = () => {
        if (!shopByCategorySelected) return null;

        return (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* <span className="text-sm text-gray-600">Filtered by:</span>
                    <span className="px-3 py-1 bg-[#d8480b] text-white text-sm rounded-full">
                        {shopByCategorySelected}
                    </span> */}
                    {shopByCategorySelected.toLowerCase() !== 'electronics' && (
                        <button
                            onClick={clearCategoryFilter}
                            className="text-accent font-bold text-xs cursor-pointer hover:underline inline-flex items-center gap-1"
                        >
                            Reset filter
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const SearchResultsSection = () => {
        if (!searchQuery.trim()) return null;

        return (
            <div className="container mx-auto py-8 px-4 my-16 mb-32">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold">Search Results</h2>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-[#d8480b] text-white text-sm rounded-full">
                                "{searchQuery}"
                            </span>
                            <button
                                onClick={clearSearch}
                                className="p-1 text-gray-500 hover:text-[#d8480b] transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <span className="text-sm text-gray-500">
                        {isSearching ? 'Searching...' : `${searchResults.length} products found`}
                    </span>
                </div>

                {isSearching ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-pulse">
                                <div className="w-full h-48 bg-gray-200 mb-4 rounded-md"></div>
                                <div className="h-6 bg-gray-200 mb-2 rounded"></div>
                                <div className="h-6 bg-gray-200 mb-4 rounded"></div>
                                <div className="h-10 bg-gray-200 rounded-3xl"></div>
                            </div>
                        ))}
                    </div>
                ) : searchResults.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {getPaginatedProducts(searchResults, allProductsPage).map((product) => (
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
                        {hasMoreProducts(searchResults, allProductsPage) && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={loadMoreAllProducts}
                                    className="px-6 py-2 bg-[#d8480b] text-white rounded-lg hover:bg-[#c23d09] transition-colors"
                                >
                                    Load More Products
                                </button>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="text-center bg-[#FEFFFF] rounded-lg p-8 max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                        <Image
                            src={notFound || "/placeholder-image.png"}
                            alt="404 Image"
                            className="h-auto max-w-[400px] mx-auto"
                        />
                        <p className="text-gray-600 mb-6">
                            We couldn't find any products matching "{searchQuery}"
                        </p>
                        <button
                            onClick={clearSearch}
                            className="px-6 py-2 bg-[#d8480b] text-white rounded-lg hover:bg-[#c23d09] transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                <YouMightAlsoLike />

                <RotatingDeals2
                    products={featuredProductsData?.products?.filter((p: ProductProps) => p.featured === true) || []}
                    onDealClick={handleDealClick}
                />
            </div >
        );
    };

    const YouMightAlsoLike = () => {
        const [randomProducts, setRandomProducts] = useState<ProductProps[]>([]);

        const shuffleProducts = () => {
            if (allProducts.length > 0) {
                const shuffled = [...allProducts]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 12);
                setRandomProducts(shuffled);
            }
        };

        useEffect(() => {
            shuffleProducts();
        }, [allProducts]);

        useEffect(() => {
            const intervalId = setInterval(() => {
                shuffleProducts();
            }, 15000);

            return () => clearInterval(intervalId);
        }, [allProducts]);

        return (
            <div className="container mx-auto py-8 px-4 mt-12">
                <div className="mb-6 py-3 border-b border-[#e7eaee] flex justify-between items-center">
                    <h2 className="text-2xl md:text-3xl font-bold">You Might Also Like</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {randomProducts.length > 0 ? (
                        randomProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setIsModalOpen(true);
                                }}
                                className="group cursor-pointer bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 p-3"
                            >
                                <div className="aspect-square bg-gray-50 rounded-lg p-3 border border-gray-100 group-hover:border-[#d8480b] transition-colors mb-2">
                                    <img
                                        src={product.picture || '/placeholder-image.png'}
                                        alt={'No image available'}
                                        className="w-full h-full object-contain"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-[#d8480b] transition-colors min-h-[2.5rem]">
                                        {product.name || 'Product Name'}
                                    </h3>

                                    <div className="flex items-center gap-2">
                                        <span className="text-base font-bold text-[#d8480b]">
                                            ₦{product.salePrice}
                                        </span>
                                        {product.oldPrice !== product.salePrice && (
                                            <span className="text-xs text-gray-400 line-through">
                                                ₦{product.oldPrice}
                                            </span>
                                        )}
                                    </div>

                                    {product.storeLocationCity && (
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <span>📍</span> {product.storeLocationCity}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        [...Array(12)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg border border-gray-100 p-3 animate-pulse">
                                <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    const RotatingDeals = ({ products, onDealClick }: { products: ProductProps[], onDealClick: (product: ProductProps) => void }) => {
        const [currentDeals, setCurrentDeals] = useState<ProductProps[]>([]);

        useEffect(() => {
            if (products.length > 0) {
                const initialDeals = [...products]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 2);
                setCurrentDeals(initialDeals);

                const interval = setInterval(() => {
                    const randomDeals = [...products]
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 2);
                    setCurrentDeals(randomDeals);
                }, 8000);

                return () => clearInterval(interval);
            }
        }, [products]);

        const deals = currentDeals.map((product) => ({
            title: product.name || "Featured Product",
            description: product.description || "Lorem ipsum dolor sit amet consectetur. Adipiscing id odio at dis morbi turpis.",
            cta: "Buy Now →",
            image: product.picture || "/placeholder-image.png",
            product: product
        }));

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {deals.length > 0 ? (
                    deals.map((deal, index) => (
                        <div key={deal.product.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                            {/* Your deal card JSX here */}
                            <div className="md:flex items-center gap-4 relative">
                                <div className={`h-[300px] md:w-1/2 p-4 flex items-center justify-center relative overflow-hidden bg-white ${index === 0 ? 'bg-[#727be0] rounded-lg px-5' : 'bg-[#e97a80] rounded-lg px-5'
                                    }`}>
                                    <div className={`absolute inset-0 ${index === 0 ? 'bg-[#11392d]' : 'bg-[#040273]'
                                        }`} style={{
                                            clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0% 100%)'
                                        }}></div>
                                    <Image
                                        src={deal.image}
                                        alt={'No image available'}
                                        width={100}
                                        height={100}
                                        loading="lazy"
                                        className="h-auto max-w-[150px] w-auto overflow-hidden rounded-md relative z-10 text-white"
                                    />
                                </div>

                                <div className="p-6 max-w-sm relative z-20 md:max-w-xs">
                                    <h3 className="text-lg md:text-xl font-bold mb-3 text-[#0c2d57]">{deal.title}</h3>
                                    <p className="mb-4 text-[#5c728e] text-xs md:text-sm">{deal.description}</p>
                                    <button
                                        className="text-black font-semibold hover:underline flex items-center gap-1 bg-[#d8480b] text-white py-2 px-4 rounded-3xl transition text-sm"
                                        onClick={() => onDealClick(deal.product)}
                                    >
                                        {deal.cta}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No featured deals available at the moment.</p>
                    </div>
                )}
            </div>
        );
    };

    const RotatingDeals2 = ({ products, onDealClick }: { products: ProductProps[], onDealClick: (product: ProductProps) => void }) => {
        const [currentDeals, setCurrentDeals] = useState<ProductProps[]>([]);

        useEffect(() => {
            if (products.length > 0) {
                const initialDeals = [...products]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 2);
                setCurrentDeals(initialDeals);

                const interval = setInterval(() => {
                    const randomDeals = [...products]
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 2);
                    setCurrentDeals(randomDeals);
                }, 8000);

                return () => clearInterval(interval);
            }
        }, [products]);

        const deals = currentDeals.map((product) => ({
            title: product.name || "Featured Product",
            description: product.description || "Lorem ipsum dolor sit amet consectetur. Adipiscing id odio at dis morbi turpis.",
            cta: "Buy Now →",
            image: product.picture || "/placeholder-image.png",
            product: product
        }));

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {deals.length > 0 ? (
                    deals.map((deal, index) => (
                        <div key={deal.product.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                            {/* Your deal card JSX here */}
                            <div className="md:flex items-center gap-4 relative">
                                <div className={`h-[300px] md:w-1/2 p-4 flex items-center justify-center relative overflow-hidden bg-white ${index === 0 ? 'bg-[#727be0] rounded-lg px-5' : 'bg-[#e97a80] rounded-lg px-5'
                                    }`}>
                                    <div className={`absolute inset-0 ${index === 0 ? 'bg-[#3d0066]' : 'bg-[#2e1503]'
                                        }`} style={{
                                            clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0% 100%)'
                                        }}></div>
                                    <Image
                                        src={deal.image}
                                        alt={'No image available'}
                                        width={100}
                                        height={100}
                                        loading="lazy"
                                        className="h-auto max-w-[150px] w-auto overflow-hidden rounded-md relative z-10 text-white"
                                    />
                                </div>

                                <div className="p-6 max-w-sm relative z-20 md:max-w-xs">
                                    <h3 className="text-lg md:text-xl font-bold mb-3 text-[#0c2d57]">{deal.title}</h3>
                                    <p className="mb-4 text-[#5c728e] text-xs md:text-sm">{deal.description}</p>
                                    <button
                                        className="text-black font-semibold hover:underline flex items-center gap-1 bg-[#d8480b] text-white py-2 px-4 rounded-3xl transition text-sm"
                                        onClick={() => onDealClick(deal.product)}
                                    >
                                        {deal.cta}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No featured deals available at the moment.</p>
                    </div>
                )}
            </div>
        );
    };

    const ProductGridSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-100 animate-pulse">
                    <div className="w-full h-48 bg-gray-200 mb-4 rounded-md"></div>
                    <div className="h-4 bg-gray-200 mb-2 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 mb-3 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded-3xl"></div>
                </div>
            ))}
        </div>
    );

    const NoProductsFound = ({ categoryName }: { categoryName: string }) => (
        <div className="col-span-full text-center py-12">
            <div className="bg-[#FEFFFF] rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found in {categoryName}</h3>
                <Image
                    src={notFound || "/placeholder-image.png"}
                    alt="404 Image"
                    className="h-auto w-auto"
                />
                <p className="text-gray-600 mb-6">
                    We couldn't find any products in this category at the moment.
                </p>
                <button
                    onClick={() => {
                        if (featuredProducts.length > 0) {
                            const featuredDealsSection = document.getElementById('product-tabs');
                            featuredDealsSection?.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    className="text-[#d8480b] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                    Check out our top picks <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );

    if ((!allProductsData && allProductsLoading) ||
        (!categoriesData && categoriesLoading) ||
        (!allBestSellerData && allBestSellerLoading)) {
        return (
            <>
                <div className="container mx-auto py-12 px-4 mt-10">
                    <div className="mb-8 py-3 border-b border-[#e7eaee]">
                        <h1 className="text-3xl font-bold">Shop by Category</h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Column - Categories (1/3 width) */}
                        <div className="lg:w-1/3">
                            <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto scrollbar-hide">
                                {categoriesData?.categories?.map((category: any) => (
                                    <div
                                        key={category.id}
                                        className="bg-white p-3 rounded-lg shadow-md border border-gray-100 animate-pulse"
                                    >
                                        <div className="relative w-full h-24 mb-2 bg-gray-200 rounded-md"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Products (2/3 width) */}
                        <div className="lg:w-2/3">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto scrollbar-hide">
                                {[...Array(9)].map((_, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-100 animate-pulse">
                                        <div className="w-full h-36 bg-gray-200 mb-3 rounded-md"></div>
                                        <div className="h-4 bg-gray-200 mb-2 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 mb-3 rounded w-1/2"></div>
                                        <div className="h-8 bg-gray-200 rounded-3xl"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-pulse">
                                <div className="h-6 w-16 bg-gray-200 rounded-full mb-4"></div>
                                <div className="w-full h-48 bg-gray-200 mb-4 rounded-md"></div>
                                <div className="h-6 bg-gray-200 mb-2 rounded"></div>
                                <div className="h-6 bg-gray-200 mb-4 rounded"></div>
                                <div className="h-10 bg-gray-200 rounded-3xl"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className="container mx-auto py-30 px-4 mt-10 text-center">
                    <p className="text-red-500">Error loading products. Please try again later.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <SearchResultsSection />

            {!searchQuery.trim() && (
                <>
                    <div className="container mx-auto py-8 px-4">
                        <div className="mb-6 py-3 border-b border-[#e7eaee]">
                            <h1 className="text-2xl md:text-3xl font-bold">Shop by Category</h1>
                        </div>

                        {/* Two-column layout for categories and products */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Column - Categories (1/3 width) - Scrollable */}
                            <div className="lg:w-1/3">
                                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto scrollbar-hide p-4 border-b-4 border-accent shadow-sm rounded-lg">
                                    {categoriesData?.categories?.map((category: any) => (
                                        <div
                                            key={category.id}
                                            className={`bg-white p-3 rounded-lg shadow-md border cursor-pointer hover:shadow-lg transition-shadow ${shopByCategorySelected === category.code ? 'ring-2 ring-[#d8480b]' : 'border-gray-100'
                                                }`}
                                            onClick={() => handleShopCategoryClick(category.code)}
                                        >
                                            <div className="relative w-full h-24 mb-2">
                                                <Image
                                                    src={category.logo || '/placeholder-image.png'}
                                                    alt={category.name}
                                                    fill
                                                    className="object-contain rounded-md"
                                                />
                                                <button
                                                    onClick={(e) => handleCategoryExternalLink(category.code, e)}
                                                    className="absolute top-1 right-1 p-1 bg-white cursor-pointer rounded-md shadow-md hover:bg-gray-100 transition-colors"
                                                    title={`View ${category.name} category page`}
                                                >
                                                    <ExternalLink className="w-3 h-3 text-gray-600" />
                                                </button>
                                            </div>
                                            <h3 className="text-xs font-semibold text-center text-[#535357] line-clamp-2">
                                                {category.name}
                                            </h3>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column - Products (2/3 width) - Scrollable */}
                            <div className="lg:w-2/3" ref={productsSectionRef}>
                                {shopByCategorySelected && (
                                    <div>
                                        <div className="mb-4 flex justify-between items-center">

                                            <h2 className="text-lg md:text-xl font-bold">Products in {shopByCategorySelected}</h2>

                                            <div className=''>
                                                <div className="text-xs text-gray-500">
                                                    {filteredProducts.length} products found
                                                </div>
                                                <div className='float-right'>
                                                    <CategoryFilterIndicator />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="">
                                            {filteredProducts.length > 0 ? (
                                                <>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {getPaginatedByCategoryProducts(filteredProducts, filteredProductsPage).map((product) => (
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
                                                    {hasMoreProducts(filteredProducts, filteredProductsPage) && (
                                                        <div className="flex justify-center mt-6">
                                                            <button
                                                                onClick={loadMoreFilteredProducts}
                                                                className="px-4 py-2 bg-[#d8480b] text-white text-sm rounded-lg hover:bg-[#c23d09] transition-colors"
                                                            >
                                                                Load More Products
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <NoProductsFound categoryName={shopByCategorySelected} />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <RotatingDeals
                            products={featuredProductsData?.products?.filter((p: ProductProps) => p.featured === true) || []}
                            onDealClick={handleDealClick}
                        />
                    </div>

                    {/* Deals of the Week Section */}
                    <div className="container mx-auto py-8 px-4" id="deals-of-the-week">
                        <div className="mb-6 py-3 border-b border-[#e7eaee] flex justify-between items-center">
                            <h1 className="text-2xl md:text-3xl font-bold">Deals of the Week</h1>
                            <span className="text-sm text-gray-500">
                                {dealsOfTheWeek.length} deals found
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {getPaginatedProducts(dealsOfTheWeek, dealsPage).map((product) => (
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

                        {hasMoreProducts(dealsOfTheWeek, dealsPage) && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={loadMoreDeals}
                                    className="px-4 py-2 bg-[#d8480b] text-white text-sm rounded-lg hover:bg-[#c23d09] transition-colors"
                                >
                                    Load More Deals
                                </button>
                            </div>
                        )}

                        <YouMightAlsoLike />
                    </div>


                    {/* Top Picks Section */}
                    <div className="container mx-auto py-8 px-4 mt-8" id="product-tabs">
                        <div className="mb-6 py-3 border-b border-[#e7eaee] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="font-semibold text-xs md:text-base flex flex-wrap items-center gap-2 md:gap-4 text-[#5c728e]">
                                <span
                                    className={`cursor-pointer px-2 py-1 ${activeTab === 'new-arrivals' ? 'text-[#d8480b] border-b-2 border-[#d8480b]' : ''}`}
                                    onClick={() => setActiveTab('new-arrivals')}
                                >
                                    New Arrivals
                                </span>
                                <span
                                    className={`cursor-pointer px-2 py-1 ${activeTab === 'ongoing-offers' ? 'text-[#d8480b] border-b-2 border-[#d8480b]' : ''}`}
                                    onClick={() => setActiveTab('ongoing-offers')}
                                >
                                    Ongoing Offers
                                </span>
                                <span
                                    className={`cursor-pointer px-2 py-1 ${activeTab === 'featured-products' ? 'text-[#d8480b] border-b-2 border-[#d8480b]' : ''}`}
                                    onClick={() => setActiveTab('featured-products')}
                                >
                                    Featured Products
                                </span>
                                <span
                                    className={`cursor-pointer px-2 py-1 ${activeTab === 'best-sellers' ? 'text-[#d8480b] border-b-2 border-[#d8480b]' : ''}`}
                                    onClick={() => setActiveTab('best-sellers')}
                                >
                                    Best Sellers
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold">Top Picks</h1>
                        </div>

                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {tabProducts.length > 0 ? (
                                    getPaginatedProducts(tabProducts, topPicksPage).map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-4 text-center py-10">
                                        <p className="text-gray-500">No products available in this category.</p>
                                    </div>
                                )}
                            </div>

                            {hasMoreProducts(tabProducts, topPicksPage) && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={loadMoreTopPicks}
                                        className="px-4 py-2 bg-[#d8480b] text-white text-sm rounded-lg hover:bg-[#c23d09] transition-colors"
                                    >
                                        Load More Products
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Categories Section */}
                    <div className="container mx-auto py-8 px-4 mt-8">
                        <div className="mb-6 py-3 border-b border-[#e7eaee] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-0">Top Categories</h1>

                            <div className="font-semibold text-xs md:text-base flex flex-wrap items-center gap-2 text-[#5c728e]">
                                {categoriesData?.categories?.slice(0, 5).map((category: any) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleTopCategoryClick(category.code)}
                                        className={`whitespace-nowrap px-3 py-2 rounded-lg transition-colors ${topCategoriesSelected === category.code
                                            ? 'bg-[#d8480b] text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            {isFeaturedProductsLoading ? (
                                <ProductGridSkeleton />
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {featuredProducts.length > 0 ? (
                                            getPaginatedProducts(featuredProducts, topCategoriesPage).map((product) => (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setIsModalOpen(true);
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <div className="col-span-4 text-center py-10">
                                                <p className="text-gray-500">No featured products available for this category.</p>
                                            </div>
                                        )}
                                    </div>

                                    {hasMoreProducts(featuredProducts, topCategoriesPage) && (
                                        <div className="flex justify-center mt-6">
                                            <button
                                                onClick={loadMoreTopCategories}
                                                className="px-4 py-2 bg-[#d8480b] text-white text-sm rounded-lg hover:bg-[#c23d09] transition-colors"
                                            >
                                                Load More Products
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <RotatingDeals2
                            products={featuredProductsData?.products?.filter((p: ProductProps) => p.featured === true) || []}
                            onDealClick={handleDealClick}
                        />
                    </div>

                    {/* All Products Section */}
                    <div className="container mx-auto py-8 px-4 mb-32">
                        <div className="mb-6 py-3 border-b border-[#e7eaee] flex justify-between items-center">
                            <h2 className="text-2xl md:text-3xl font-bold">All Products</h2>
                        </div>

                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {getPaginatedProducts(allProducts, allProductsPage).map((product) => (
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

                            {hasMoreProducts(allProducts, allProductsPage) && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={loadMoreAllProducts}
                                        className="px-4 py-2 bg-[#d8480b] text-white text-sm rounded-lg hover:bg-[#c23d09] transition-colors"
                                    >
                                        Load More Products
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            <ProductDetailsModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                product={selectedProduct}
            />

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
}
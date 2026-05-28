// 'use client'
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, Edit, Search, Grid, List, Upload, Eye, Package, BadgePercent, Megaphone, Star, RefreshCw } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import ProductsTable from "./products-table";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import axiosOperations from "@/utils/fetch-function-op-auth";
// import UploadBulkForm from "../../upload-op/upload";
// import UploadImage from "../../upload-op/upload-images";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   DialogDescription,
// } from "@/components/ui/dialog";
// import Image from "next/image";
// import { Badge } from '@/components/ui/badge'
// import placeholder from "@/components/images/placeholder-product.webp";
// import useOperations from "@/store/operationsStore";
// import { PermissionButton } from "../permission/permission-button";

// export interface Product {
//   productId: string;
//   productName: string;
//   productDescription: string;
//   code: string;
//   id: string;
//   productCategory: string;
//   productCode: string;
//   productPrice: string;
//   stockQuantity: number;
//   unitQuantity: string;
//   imageURL: string;
//   costPrice: string;
//   storeId: string;
//   barCode: string;
//   brand: string;
//   ccy: string;
//   picture: string;
//   name: string;
//   description: string;
//   category: string;
//   qtyInStore: number;
//   salePrice: number;
//   oldPrice: number;
//   pictureList: string[];
//   color: string | null;
//   itemSize: string | null;
//   model: string | null;
//   expiryDate: string | null;
//   unit: string;
//   usdPrice: number;
//   banner: boolean;
//   featured: boolean;
//   onSale: boolean;
//   discount: number;
//   vatEligible: boolean;
//   weight: string;
//   weightUnit: string;
//   storeCode: string;
//   vat: number;
// }

// interface ProductsManagerProps {
//   onCountChange?: (count: number) => void;
// }

// const ProductsManager = ({ onCountChange }: ProductsManagerProps) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
//   const [isBulkUploadImagesOpen, setIsBulkUploadImagesOpen] = useState(false);
//   const [viewMode, setViewMode] = useState<"grid" | "table">("table");
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { operations } = useOperations();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingProductId, setEditingProductId] = useState<string | null>(null);
//   const [editingProductCategory, setEditingProductCategory] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 15;
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

//   useEffect(() => {
//     const editParam = searchParams.get('edit');
//     const idParam = searchParams.get('id');
//     const categoryParam = searchParams.get('category');

//     if (editParam === 'true' && idParam && categoryParam) {
//       setIsEditMode(true);
//       setEditingProductId(idParam);
//       setEditingProductCategory(categoryParam);
//       router.push(`/operations/inventories/create-product?edit=true&id=${idParam}&category=${categoryParam}`);
//     }
//   }, [searchParams, router]);

//   useEffect(() => {
//     const handleRefresh = () => {
//       refetch();
//     };
//     window.addEventListener('refresh-inventories', handleRefresh);
//     return () => window.removeEventListener('refresh-inventories', handleRefresh);
//   }, []);

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ["products"],
//     queryFn: () => {
//       return axiosOperations.request({
//         method: "GET",
//         url: '/ecommerce/products/list',
//         params: {
//           name: '',
//           storeCode: operations?.storeCode,
//           entityCode: operations?.entityCode,
//           tag: '',
//           pageNumber: 1,
//           pageSize: 1000
//         }
//       }).then(response => response.data);
//     }
//   });

//   useEffect(() => {
//     if (data?.products && onCountChange) {
//       onCountChange(data.products.length);
//     }
//   }, [data?.products, onCountChange]);

//   const filteredProducts = data?.products?.filter((product: Product) =>
//     product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.barCode?.toLowerCase().includes(searchTerm.toLowerCase())
//   ) || [];

//   const handleEditDetails = async (product: Product) => {
//     try {
//       await queryClient.invalidateQueries({
//         queryKey: ['product-detail', product.id]
//       });

//       router.push(`/operations/inventories/create-product?edit=true&id=${product.id}&category=${product.category}`);
//     } catch (error) {
//       console.error('Error refreshing product data:', error);
//       router.push(`/operations/inventories/create-product?edit=true&id=${product.id}&category=${product.category}`);
//     }
//   };

//   const handleViewDetails = (product: Product) => {
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const getDisplayValue = (value: any): string => {
//     if (value === null || value === undefined || value === '') {
//       return 'N/A';
//     }
//     return value.toString();
//   };

//   const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
//     return `${currency} ${amount?.toFixed(2) || '0.00'}`;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
//           <p className="mt-2 text-accent-foreground/70">Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <p className="text-red-500">Error loading products</p>
//           <p className="text-accent-foreground/70">Please try again later</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//         <div className="relative flex-1 max-w-sm w-full">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
//           <Input
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 border-accent/20 text-accent-foreground"
//           />
//         </div>

//         <div className="flex items-center gap-2 w-full sm:w-auto">
//           <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")} className="w-full sm:w-auto">
//             <TabsList className="grid w-full grid-cols-2 bg-accent/5">
//               <TabsTrigger value="grid" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white">
//                 <Grid className="h-4 w-4" />
//                 Grid
//               </TabsTrigger>
//               <TabsTrigger value="table" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white">
//                 <List className="h-4 w-4" />
//                 Table
//               </TabsTrigger>
//             </TabsList>
//           </Tabs>

//           <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
//             <DialogTrigger asChild>
//               <PermissionButton
//                 requiredPermissions={['MANAGE_INVENTORY']}
//                 requireAll={true}
//                 hideIfNoPermission={false}
//                 variant="outline"
//                 tooltipMessage="You do not have permission to manage inventory"
//                 className=""
//               >
//                 <Upload className="mr-2 h-4 w-4" />
//                 Bulk Upload
//               </PermissionButton>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle></DialogTitle>
//               </DialogHeader>
//               <UploadBulkForm
//                 uploadType="products"
//                 onSuccess={() => {
//                   setIsBulkUploadOpen(false);
//                   refetch();
//                 }}
//                 onCancel={() => setIsBulkUploadOpen(false)}
//               />
//             </DialogContent>
//           </Dialog>

//           {/* <Dialog open={isBulkUploadImagesOpen} onOpenChange={setIsBulkUploadImagesOpen}>
//             <DialogTrigger asChild>
//               <Button variant="outline" className="border-accent/20 hover:bg-accent/10 hover:text-accent">
//                 <Upload className="h-4 w-4 mr-2" />
//                 <span className="hidden sm:inline">Upload Images</span>
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle></DialogTitle>
//               </DialogHeader>
//               <UploadImage
//                 uploadType="product_images"
//                 onSuccess={() => {
//                   setIsBulkUploadImagesOpen(false);
//                   refetch();
//                 }}
//                 onCancel={() => setIsBulkUploadImagesOpen(false)}
//               />
//             </DialogContent>
//           </Dialog> */}

//           <PermissionButton
//             requiredPermissions={['MANAGE_INVENTORY']}
//             requireAll={true}
//             hideIfNoPermission={false}
//             variant="outline"
//             tooltipMessage="You do not have permission to manage inventory"
//             onClick={() => router.push('/operations/inventories/product-images')}
//             className=""
//           >
//             <Upload className="mr-2 h-4 w-4" />
//             Product Images
//           </PermissionButton>

//           <PermissionButton
//             requiredPermissions={['MANAGE_INVENTORY']}
//             requireAll={true}
//             hideIfNoPermission={false}
//             tooltipMessage="You do not have permission to manage inventory"
//             onClick={() => router.push('/operations/inventories/create-product')}
//           >
//             <Plus className="h-4 w-4" />
//             Add Product
//           </PermissionButton>
//         </div>
//       </div>

//       <Card className="border-accent/20 shadow-sm">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-lg font-semibold text-accent-foreground">
//               Products List
//             </CardTitle>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => refetch()}
//               className="border-accent/20 hover:bg-accent/10"
//             >
//               <RefreshCw className="w-4 h-4 mr-2" />
//               Refresh
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {viewMode === "grid" ? (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {filteredProducts.map((product: Product) => (
//                 <Card key={product.id} className="border-accent/20 shadow-sm hover:shadow-md transition-all">
//                   <CardHeader className="pb-4">
//                     {product.picture && (
//                       <div className="w-full h-48 bg-muted rounded-lg overflow-hidden mb-4">
//                         <img
//                           src={product.picture}
//                           alt={product.name}
//                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                           onError={(e) => {
//                             const target = e.target as HTMLImageElement;
//                             target.style.display = 'none';
//                           }}
//                         />
//                       </div>
//                     )}
//                     <CardTitle className="text-lg text-accent-foreground">{product.name}</CardTitle>
//                     <p className="text-sm text-accent-foreground/70">Code: {product.code || 'NIL'}</p>
//                   </CardHeader>
//                   <CardContent className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-accent-foreground/70">Price</span>
//                       <span className="font-semibold text-accent-foreground">{formatCurrency(product.salePrice, product.ccy)}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-accent-foreground/70">Stock</span>
//                       <span className="font-medium text-accent-foreground">{product.qtyInStore} {product.unit}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-accent-foreground/70">Category</span>
//                       <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
//                         {product.category}
//                       </Badge>
//                     </div>
//                     <div className="flex gap-2 mt-4">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="flex-1 border-accent/20 hover:bg-accent/10 hover:text-accent"
//                         onClick={() => handleViewDetails(product)}
//                       >
//                         <Eye className="h-4 w-4 mr-2" />
//                         View
//                       </Button>
//                       <Button
//                         size="sm"
//                         className="flex-1 bg-accent hover:bg-accent/90 text-white"
//                         onClick={() => handleEditDetails(product)}
//                       >
//                         <Edit className="h-4 w-4 mr-2" />
//                         Edit
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <ProductsTable
//               products={filteredProducts}
//               onEdit={handleEditDetails}
//               onViewDetails={handleViewDetails}
//               itemsPerPage={itemsPerPage}
//               currentPage={currentPage}
//               onPageChange={setCurrentPage}
//               searchTerm={searchTerm}
//             />
//           )}
//         </CardContent>
//       </Card>

//   <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//     <DialogContent
//       className="sm:max-w-3xl max-h-[90vh] overflow-y-auto"
//       style={{
//         scrollbarWidth: 'none',
//         scrollbarColor: 'transparent',
//       }}
//     >
//       <DialogHeader className='flex flex-col'>
//         <DialogTitle className="text-accent-foreground">Product Details - {selectedProduct?.name || 'N/A'}</DialogTitle>
//         <DialogDescription>
//           Detailed information about the selected product
//         </DialogDescription>
//       </DialogHeader>

//       {selectedProduct && (
//         <div className="py-4 space-y-6">
//           <div className="flex flex-col md:flex-row gap-6">
//             <div className="flex-shrink-0">
//               {selectedProduct.picture ? (
//                 <div className="w-48 h-48 bg-muted rounded-lg overflow-hidden border border-accent/20">
//                   <Image
//                     src={selectedProduct.picture}
//                     alt={selectedProduct.name}
//                     width={192}
//                     height={192}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src = placeholder.src;
//                     }}
//                   />
//                 </div>
//               ) : (
//                 <div className="w-48 h-48 bg-accent/5 rounded-lg flex items-center justify-center border border-accent/20">
//                   <Package className="h-12 w-12 text-accent-foreground/50" />
//                 </div>
//               )}
//             </div>

//             <div className="flex-1 space-y-4">
//               <div>
//                 <h3 className="text-xl font-bold text-accent-foreground mb-2">{getDisplayValue(selectedProduct.name)}</h3>
//                 <p className="text-sm text-accent-foreground/70 mb-4">Code: {getDisplayValue(selectedProduct.code)}</p>
//                 <p className="text-sm text-accent-foreground/80 mb-4">{getDisplayValue(selectedProduct.description)}</p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm font-medium text-accent-foreground">Category</p>
//                   <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedProduct.category)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-accent-foreground">Brand</p>
//                   <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedProduct.brand)}</p>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-2 pt-2">
//                 {selectedProduct.banner && (
//                   <Badge className="bg-accent/20 text-accent-foreground">
//                     <Megaphone className="h-3 w-3 mr-1" />
//                     Banner
//                   </Badge>
//                 )}
//                 {selectedProduct.featured && (
//                   <Badge className="bg-accent/20 text-accent-foreground">
//                     <Star className="h-3 w-3 mr-1" />
//                     Featured
//                   </Badge>
//                 )}
//                 {selectedProduct.onSale && (
//                   <Badge className="bg-accent/20 text-accent-foreground">
//                     <BadgePercent className="h-3 w-3 mr-1" />
//                     On Sale
//                   </Badge>
//                 )}
//                 {selectedProduct.vatEligible && (
//                   <Badge className="bg-accent/20 text-accent-foreground">
//                     VAT Eligible
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-accent/10 pt-4">
//             <h4 className="font-medium text-accent-foreground mb-3 flex items-center gap-2">
//               <span className="text-accent-foreground/70">₦</span>
//               Pricing & Inventory
//             </h4>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="space-y-1">
//                 <p className="text-sm font-medium text-accent-foreground">Sale Price</p>
//                 <p className="text-lg font-semibold text-green-600">
//                   {formatCurrency(selectedProduct.salePrice, selectedProduct.ccy)}
//                 </p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-sm font-medium text-accent-foreground">Cost Price</p>
//                 <p className="text-sm text-accent-foreground/70">{formatCurrency(Number(selectedProduct.costPrice), selectedProduct.ccy)}</p>
//               </div>
//               {selectedProduct.oldPrice !== selectedProduct.salePrice && (
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium text-accent-foreground">Old Price</p>
//                   <p className="text-sm text-accent-foreground/50 line-through">
//                     {formatCurrency(selectedProduct.oldPrice, selectedProduct.ccy)}
//                   </p>
//                 </div>
//               )}
//               <div className="space-y-1">
//                 <p className="text-sm font-medium text-accent-foreground">Stock Quantity</p>
//                 <p className="text-sm font-medium text-accent-foreground">
//                   {selectedProduct.qtyInStore} {getDisplayValue(selectedProduct.unitQuantity || selectedProduct.unit)}
//                 </p>
//               </div>
//             </div>

//             {selectedProduct.onSale && selectedProduct.discount && (
//               <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-accent-foreground">Discount Applied</p>
//                     <p className="text-lg font-bold text-accent-foreground">{selectedProduct.discount}% OFF</p>
//                   </div>
//                   <BadgePercent className="h-6 w-6 text-accent-foreground" />
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="border-t border-accent/10 pt-4">
//             <h4 className="font-medium text-accent-foreground mb-3">Product Specifications</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <p className="text-sm font-medium text-accent-foreground">Color</p>
//                 <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedProduct.color)}</p>
//               </div>
//               <div className="space-y-2">
//                 <p className="text-sm font-medium text-accent-foreground">Size</p>
//                 <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedProduct.itemSize)}</p>
//               </div>
//               <div className="space-y-2">
//                 <p className="text-sm font-medium text-accent-foreground">Model</p>
//                 <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedProduct.model)}</p>
//               </div>
//               {selectedProduct.expiryDate && (
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium text-accent-foreground">Expiry Date</p>
//                   <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedProduct.expiryDate)}</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="border-t border-accent/10 pt-4">
//             <h4 className="font-medium text-accent-foreground mb-3">Identification & Codes</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <p className="text-sm font-medium text-accent-foreground">Product Code</p>
//                 <p className="text-sm font-mono bg-accent/5 px-2 py-1 rounded inline-block text-accent-foreground">
//                   {getDisplayValue(selectedProduct.code)}
//                 </p>
//               </div>
//               <div className="space-y-2">
//                 <p className="text-sm font-medium text-accent-foreground">Barcode</p>
//                 <p className="text-sm font-mono bg-accent/5 px-2 py-1 rounded inline-block text-accent-foreground">
//                   {getDisplayValue(selectedProduct.barCode)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </DialogContent>
//   </Dialog>

//       {filteredProducts.length === 0 && !searchTerm && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
//             <Plus className="h-12 w-12 text-accent-foreground/50" />
//           </div>
//           <h3 className="text-lg font-medium text-accent-foreground mb-2">No products yet</h3>
//           <p className="text-accent-foreground/70 mb-4">Get started by creating your first product</p>
//           <div className="flex gap-3 justify-center">
//             <Link href="/operations/inventories/create-product" passHref>
//               <Button className="bg-accent hover:bg-accent/90 text-white">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Product
//               </Button>
//             </Link>
//             <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline" className="border-accent/20 hover:bg-accent/10">
//               <Upload className="h-4 w-4 mr-2" />
//               Bulk Upload
//             </Button>
//           </div>
//         </div>
//       )}

//       {filteredProducts.length === 0 && searchTerm && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
//             <Search className="h-12 w-12 text-accent-foreground/50" />
//           </div>
//           <h3 className="text-lg font-medium text-accent-foreground mb-2">No products found</h3>
//           <p className="text-accent-foreground/70 mb-4">
//             No products match your search term "{searchTerm}"
//           </p>
//           <Button
//             onClick={() => setSearchTerm("")}
//             variant="outline"
//             className="border-accent/20 hover:bg-accent/10"
//           >
//             Clear Search
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductsManager;


'use client'
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Eye, ChevronLeft, ChevronRight, Plus, Upload, RefreshCw, Package, Edit, Grid, List, BadgePercent, Megaphone, Star } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosOperations from "@/utils/fetch-function-op-auth";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";
import { PermissionButton } from "@/components/Operations/permission/permission-button";
import { TransInflowIcon, SeperatorIcon, EditIcon, GridIcon, ListIcon, GridFilledIcon, BannerIcon, FeaturedIcon, SaleIcon, VatIcon } from "@/components/icons/icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import UploadBulkForm from "../../upload-op/upload";
import { toast } from "sonner";
import Papa from "papaparse";
import useOperations from "@/store/operationsStore";
import Image from "next/image";
import placeholder from "@/components/images/placeholder-product.webp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductsTable from "./products-table";

export interface Product {
    productId: string;
    productName: string;
    productDescription: string;
    code: string;
    id: string;
    productCategory: string;
    productCode: string;
    productPrice: string;
    stockQuantity: number;
    unitQuantity: string;
    imageURL: string;
    costPrice: string;
    storeId: string;
    barCode: string;
    brand: string;
    ccy: string;
    picture: string;
    name: string;
    description: string;
    category: string;
    qtyInStore: number;
    salePrice: number;
    oldPrice: number;
    pictureList: string[];
    color: string | null;
    itemSize: string | null;
    model: string | null;
    expiryDate: string | null;
    unit: string;
    usdPrice: number;
    banner: boolean;
    featured: boolean;
    onSale: boolean;
    discount: number;
    vatEligible: boolean;
    weight: string;
    weightUnit: string;
    storeCode: string;
    vat: number;
}

const getDisplayValue = (value: any): string => value?.toString() || 'N/A';

const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
    return `${currency} ${amount?.toFixed(2) || '0.00'}`;
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
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Products per Page</p>
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

interface ProductsManagerProps {
    onCountChange?: (count: number) => void;
}

const ProductsManager = ({ onCountChange }: ProductsManagerProps) => {
    const { operations } = useOperations();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "table">("table");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["products"],
        queryFn: () => axiosOperations.request({
            method: "GET",
            url: '/ecommerce/products/list',
            params: { name: '', storeCode: operations?.storeCode, entityCode: operations?.entityCode, tag: '', pageNumber: 1, pageSize: 1000 }
        }).then(response => response.data)
    });

    const products: Product[] = data?.products || [];

    useEffect(() => {
        if (onCountChange) onCountChange(products.length);
    }, [products.length, onCountChange]);

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const s = searchTerm.toLowerCase().trim();
            return !s || (
                p.name?.toLowerCase().includes(s) ||
                p.code?.toLowerCase().includes(s) ||
                p.category?.toLowerCase().includes(s) ||
                p.barCode?.toLowerCase().includes(s)
            );
        });
    }, [products, searchTerm]);

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleView = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleEdit = async (product: Product) => {
        await queryClient.invalidateQueries({ queryKey: ['product-detail', product.id] });
        router.push(`/operations/inventories/create-product?edit=true&id=${product.id}&category=${product.category}`);
    };

    const exportToCSV = () => {
        if (!filtered.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(filtered.map((p) => ({
            'Name': p.name, 'Code': p.code, 'Category': p.category,
            'Price': p.salePrice, 'Stock': p.qtyInStore, 'Unit': p.unit,
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export complete');
    };

    return (
        <div>
            <div className="mb-4">
                <div className="mb-2">
                    <h2 className="text-md font-semibold text-dark-gray">Product List <span className="text-md text-faded-accent">({products.length})</span></h2>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex gap-2">
                        <div className="flex gap-1 bg-white rounded-lg p-0.5">
                            <button
                                onClick={() => setViewMode("table")}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${viewMode === "table"
                                    ? 'bg-faded-accent text-dark-gray shadow-sm'
                                    : 'text-medium-gray hover:text-dark-gray'
                                    }`}
                            >
                                {viewMode === "table" ? (
                                    <ListIcon className="w-3.5 h-3.5 text-white scale-135" />
                                ) : (
                                    <ListIcon className="w-3.5 h-3.5 text-medium-gray scale-135" />
                                )}
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${viewMode === "grid"
                                    ? 'bg-faded-accent text-dark-gray shadow-sm'
                                    : 'text-medium-gray hover:text-dark-gray'
                                    }`}
                            >
                                {viewMode === "grid" ? (
                                    <GridFilledIcon className="w-3.5 h-3.5 scale-135" />
                                ) : (
                                    <GridIcon className="w-3.5 h-3.5 scale-135" />
                                )}
                            </button>
                        </div>
                        <div className="flex relative w-full max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                placeholder="Search products..."
                                className="pl-9 text-medium-gray h-10"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {searchTerm && (
                            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}

                        {/* <Button onClick={exportToCSV} className="h-10" variant="outline">
                            <TransInflowIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button> */}
                        <PermissionButton
                            requiredPermissions={['MANAGE_INVENTORY']} requireAll={true} hideIfNoPermission={false}
                            tooltipMessage="No permission" onClick={() => router.push('/operations/inventories/product-images')}
                            className="h-10" variant="outline"
                        >
                            <TransInflowIcon className="w-4 h-4 rotate-180" /> Product Images
                        </PermissionButton>

                        <SeperatorIcon />

                        <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-10"><TransInflowIcon className="w-4 h-4 rotate-180" />Bulk Upload</Button>
                            </DialogTrigger>
                            <DialogContent className=' overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0 max-h-[80vh]' style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                                <DialogHeader><DialogTitle></DialogTitle></DialogHeader>
                                <UploadBulkForm uploadType="products" onSuccess={() => { setIsBulkUploadOpen(false); refetch(); }} onCancel={() => setIsBulkUploadOpen(false)} />
                            </DialogContent>
                        </Dialog>

                        <PermissionButton
                            requiredPermissions={['MANAGE_INVENTORY']} requireAll={true} hideIfNoPermission={false}
                            tooltipMessage="No permission" onClick={() => router.push('/operations/inventories/create-product')}
                            className="h-10"
                        >
                            <Plus className="w-4 h-4" /> Add Product
                        </PermissionButton>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading products</div>
            ) : (
                <>
                    {viewMode === "grid" ? (
                        filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <Package className="w-10 h-10 text-gray-300" />
                                <p className="text-2xl font-medium text-dark-gray">No products found</p>
                                <p className="text-sm text-medium-gray">Try adjusting your search</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {paginated.map((product: Product) => (
                                    <Card key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                                        <CardHeader className="pb-3">
                                            <div className="w-full h-40 bg-gray-50 rounded-lg overflow-hidden mb-3">
                                                {product.picture ? (
                                                    <Image src={product.picture} alt={product.name} width={200} height={160} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-10 h-10 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <CardTitle className="text-sm font-semibold text-dark-gray">{product.name}</CardTitle>
                                            <p className="text-xs text-medium-gray">Code: {product.code || 'NIL'}</p>
                                        </CardHeader>
                                        <CardContent className="space-y-2 pt-0">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-medium-gray">Price</span>
                                                <span className="text-xs font-semibold text-green-700">{formatCurrency(product.salePrice, product.ccy)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-medium-gray">Stock</span>
                                                <span className="text-xs font-medium text-dark-gray">{product.qtyInStore} {product.unit}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-medium-gray">Category</span>
                                                <Badge className="text-[10px] px-2 py-0.5 bg-gray-100 text-dark-gray border-gray-200">{product.category}</Badge>
                                            </div>
                                            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleView(product)}>
                                                    <Eye className="w-3.5 h-3.5 mr-1" /> View
                                                </Button>
                                                <Button size="sm" className="flex-1 text-xs bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleEdit(product)}>
                                                    <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="hidden lg:block">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3">
                                    <Package className="w-10 h-10 text-gray-300" />
                                    <p className="text-2xl font-medium text-dark-gray">No products found</p>
                                    <p className="text-sm text-medium-gray">Try adjusting your search</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b-2 border-[#EEEEEE]">
                                                    {['S/N', 'Image', 'Name', 'Category', 'Code', 'Price', 'Stock', ''].map((h) => (
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
                                                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200">
                                                                {p.picture ? (
                                                                    <Image src={p.picture} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Package className="w-5 h-5 text-gray-400" />
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3.5"><p className="text-sm font-semibold text-dark-gray">{getDisplayValue(p.name)}</p></td>
                                                        <td className="px-3 py-3.5"><Badge className="text-[10px] px-2 py-0.5 bg-gray-100 text-dark-gray border-gray-200">{getDisplayValue(p.category)}</Badge></td>
                                                        <td className="px-3 py-3.5"><p className="text-sm font-mono text-dark-gray">{getDisplayValue(p.code)}</p></td>
                                                        <td className="px-3 py-3.5"><p className="text-sm font-semibold text-green-700">{formatCurrency(p.salePrice, p.ccy)}</p></td>
                                                        <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{p.qtyInStore} {p.unit}</p></td>
                                                        <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                            <div className="flex items-center gap-1">
                                                                <Button size="xs" variant="action" onClick={() => handleView(p)} title="View"><Eye className="w-4 h-4" /></Button>
                                                                <PermissionButton requiredPermissions={['MANAGE_INVENTORY']} requireAll={true} hideIfNoPermission={false}
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
                </>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent
                    className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                    style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}
                >
                    <DialogTitle className="sr-only">Product Details</DialogTitle>
                    <div className="px-6 pt-5 pb-4">
                        <h2 className="text-base font-semibold text-dark-gray mb-4">Product Details</h2>
                        {selectedProduct && (
                            <div className="space-y-4">
                                <div className="bg-white flex rounded-2xl p-4">
                                    <div className="flex flex-col md:flex-row gap-6 p-2">
                                        <div className="flex-shrink-0">
                                            {selectedProduct.picture ? (
                                                <div className="w-36 h-36 bg-[#F7F7F7] rounded-xl overflow-hidden border border-gray-200">
                                                    <Image
                                                        src={selectedProduct.picture}
                                                        alt={selectedProduct.name}
                                                        width={144}
                                                        height={144}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = placeholder.src;
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-36 h-36 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-200">
                                                    <Package className="w-10 h-10 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-dark-gray mb-1">{getDisplayValue(selectedProduct.name)}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProduct.banner && (
                                                        <Badge className="text-[10px] px-2.5 py-0.5 bg-[#FFEACC] text-medium-gray font-semibold">
                                                            <BannerIcon className="w-3 h-3 mr-1 text-medium-gray" /> Banner
                                                        </Badge>
                                                    )}
                                                    {selectedProduct.featured && (
                                                        <Badge className="text-[10px] px-2.5 py-0.5 bg-[#FFEACC] text-medium-gray font-semibold">
                                                            <FeaturedIcon className="w-3 h-3 mr-1 text-medium-gray" /> Featured
                                                        </Badge>
                                                    )}
                                                    {selectedProduct.onSale && (
                                                        <Badge className="text-[10px] px-2.5 py-0.5 bg-[#FFEACC] text-medium-gray font-semibold">
                                                            <SaleIcon className="w-3 h-3 mr-1 text-medium-gray" /> On Sale
                                                        </Badge>
                                                    )}
                                                    {selectedProduct.vatEligible && (
                                                        <Badge className="text-[10px] px-2.5 py-0.5 bg-[#FFEACC] text-medium-gray font-semibold">
                                                            <VatIcon className="w-3 h-3 mr-1 text-medium-gray" /> VAT Eligible
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium text-medium-gray max-w-sm">{getDisplayValue(selectedProduct.description)}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-2">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs text-medium-gray">Category</p>
                                                    <p className="text-xs font-semibold text-dark-gray">{getDisplayValue(selectedProduct.category)}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-xs text-medium-gray">Brand</p>
                                                    <p className="text-xs font-semibold text-dark-gray">{getDisplayValue(selectedProduct.brand)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2 border-l border-gray-200 min-w-[200px]">
                                        <p className="text-sm font-semibold text-dark-gray mt-1 mb-2">Identification & Codes</p>
                                        <div className="gap-x-6 gap-y-4">
                                            <div className="space-y-0.5 flex items-center justify-between">
                                                <p className="text-xs text-medium-gray">Code</p>
                                                <p className="text-[10px] font-mono font-semibold text-dark-gray border border-gray-300 px-2 py-0.5 rounded-lg">{getDisplayValue(selectedProduct.code)}</p>
                                            </div>
                                            <div className="space-y-0.5 flex items-center justify-between mt-2">
                                                <p className="text-xs text-medium-gray">Barcode</p>
                                                <p className="text-[10px] font-mono font-semibold text-dark-gray border border-gray-300 px-2 py-0.5 rounded-lg">{getDisplayValue(selectedProduct.barCode)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-2 w-full grid grid-cols-1 md:grid-cols-2">
                                    <div className="bg-white rounded-2xl p-4">
                                        <p className="text-sm font-semibold text-dark-gray mb-3">Product Specifications</p>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                            <div className="space-y-0.5">
                                                <p className="text-xs text-medium-gray">Colour</p>
                                                <p className="text-xs font-semibold text-dark-gray">{getDisplayValue(selectedProduct.color)}</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-xs text-medium-gray">Size</p>
                                                <p className="text-xs font-semibold text-dark-gray">{getDisplayValue(selectedProduct.itemSize)}</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-xs text-medium-gray">Model</p>
                                                <p className="text-xs font-semibold text-dark-gray">{getDisplayValue(selectedProduct.model)}</p>
                                            </div>
                                            {selectedProduct.weight && (
                                                <div className="space-y-0.5">
                                                    <p className="text-xs text-medium-gray">Weight</p>
                                                    <p className="text-xs font-semibold text-dark-gray">{selectedProduct.weight} {selectedProduct.weightUnit || ''}</p>
                                                </div>
                                            )}
                                            {selectedProduct.expiryDate && (
                                                <div className="space-y-0.5">
                                                    <p className="text-xs text-medium-gray">Expiry Date</p>
                                                    <p className="text-xs font-semibold text-dark-gray">{getDisplayValue(selectedProduct.expiryDate)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-semibold text-dark-gray">Pricing & Inventory</p>
                                            {selectedProduct.onSale && selectedProduct.discount > 0 && (
                                                <div className="p-1 bg-green-50 rounded-xl border border-green-200">
                                                    <div className="flex items-center gap-2">
                                                            <p className="text-xs text-green-600">{selectedProduct.discount}% OFF Discount Applied</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                            <div className="space-y-0.5">
                                                <p className="text-xs text-medium-gray">Sale Price</p>
                                                <p className="text-sm font-bold text-green-600">{formatCurrency(selectedProduct.salePrice, selectedProduct.ccy)}</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-xs text-medium-gray">Cost Price</p>
                                                <p className="text-xs font-semibold text-dark-gray">{formatCurrency(Number(selectedProduct.costPrice), selectedProduct.ccy)}</p>
                                            </div>
                                            {selectedProduct.oldPrice && selectedProduct.oldPrice !== selectedProduct.salePrice && (
                                                <div className="space-y-0.5">
                                                    <p className="text-xs text-medium-gray">Old Price</p>
                                                    <p className="text-xs font-semibold text-dark-gray line-through">{formatCurrency(selectedProduct.oldPrice, selectedProduct.ccy)}</p>
                                                </div>
                                            )}
                                            <div className="space-y-0.5">
                                                <p className="text-xs text-medium-gray">Stock Quantity</p>
                                                <p className="text-xs font-semibold text-dark-gray">{selectedProduct.qtyInStore} {getDisplayValue(selectedProduct.unit || selectedProduct.unitQuantity)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductsManager;
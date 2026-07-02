// 'use client'
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, Edit, Search, Grid, List, Upload, Eye, Package, BadgePercent, Megaphone, Star } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import ProductsTable from "./products-table";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import axiosInstance from "@/utils/fetch-function";
// import useUser from "@/store/userStore";
// import UploadBulkForm from "../../upload/upload";
// import UploadImage from "../../upload/upload-images";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   DialogDescription,
// } from "@/components/ui/dialog";
// import Image from "next/image";
// import { Badge } from '@/components/ui/badge'
// import placeholder from "@/components/images/placeholder-product.webp";
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
//   const { user } = useUser();
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
//       router.push(`/admin/inventories/create-product?edit=true&id=${idParam}&category=${categoryParam}`);
//     }
//   }, [searchParams, router]);

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ["products"],
//     queryFn: () => {
//       return axiosInstance.request({
//         method: "GET",
//         url: '/ecommerce/products/list',
//         params: {
//           name: '',
//           storeCode: user?.storeCode,
//           entityCode: user?.entityCode,
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

//       router.push(`/admin/inventories/create-product?edit=true&id=${product.id}&category=${product.category}`);
//     } catch (error) {
//       console.error('Error refreshing product data:', error);
//       router.push(`/admin/inventories/create-product?edit=true&id=${product.id}&category=${product.category}`);
//     }
//   };

//   const handleViewDetails = (product: Product) => {
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const handleDeleteSuccess = () => {
//     refetch();
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
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-2 text-muted-foreground">Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <p className="text-red-500">Error loading products</p>
//           <p className="text-muted-foreground">Please try again later</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="grid" className="flex items-center gap-2">
//                 <Grid className="h-4 w-4" />
//                 Grid
//               </TabsTrigger>
//               <TabsTrigger value="table" className="flex items-center gap-2">
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
//               <Button className="transition-smooth" variant="outline">
//                 <Upload className="h-4 w-4 mr-2" />
//                 Bulk Upload Images
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
//             onClick={() => router.push('/admin/inventories/product-images')}
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
//             onClick={() => router.push('/admin/inventories/create-product')}
//           >
//             <Plus className="h-4 w-4" />
//             Add Product
//           </PermissionButton>
//         </div>
//       </div>

//       {viewMode === "grid" ? (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredProducts.map((product: Product) => (
//             <Card key={product.id} className="group hover:shadow-elegant transition-smooth">
//               <CardHeader className="pb-4">
//                 {product.picture && (
//                   <div className="w-full h-48 bg-muted rounded-lg overflow-hidden mb-4">
//                     <img
//                       src={product.picture}
//                       alt={product.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
//                       onError={(e) => {
//                         const target = e.target as HTMLImageElement;
//                         target.style.display = 'none';
//                       }}
//                     />
//                   </div>
//                 )}
//                 <CardTitle className="text-lg">{product.name}</CardTitle>
//                 <p className="text-sm text-muted-foreground">Code: {product.code || 'NIL'}</p>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Price</span>
//                   <span className="font-semibold">{formatCurrency(product.salePrice, product.ccy)}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Stock</span>
//                   <span className="font-medium">{product.qtyInStore}{product.unit}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Category</span>
//                   <span className="text-sm">{product.category}</span>
//                 </div>
//                 <div className="flex gap-2 mt-4">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex-1"
//                     onClick={() => handleViewDetails(product)}
//                   >
//                     <Eye className="h-4 w-4 mr-2" />
//                     View
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     className="flex-1 bg-accent text-white hover:bg-accent-foreground"
//                     onClick={() => handleEditDetails(product)}
//                   >
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <ProductsTable
//           products={filteredProducts}
//           onEdit={handleEditDetails}
//           onViewDetails={handleViewDetails}
//           itemsPerPage={itemsPerPage}
//           currentPage={currentPage}
//           onPageChange={setCurrentPage}
//           searchTerm={searchTerm}
//           onDeleteSuccess={handleDeleteSuccess}
//         />
//       )}

//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent
//           className="sm:max-w-3xl max-h-[90vh] overflow-y-auto"
//           style={{
//             scrollbarWidth: 'none',
//             scrollbarColor: 'transparent',
//           }}
//         >
//           <DialogHeader className='flex flex-col'>
//             <DialogTitle>Product Details - {selectedProduct?.name || 'N/A'}</DialogTitle>
//             <DialogDescription>
//               Detailed information about the selected product
//             </DialogDescription>
//           </DialogHeader>

//           {selectedProduct && (
//             <div className="py-4 space-y-6">
//               <div className="flex flex-col md:flex-row gap-6">
//                 <div className="flex-shrink-0">
//                   {selectedProduct.picture ? (
//                     <div className="w-48 h-48 bg-muted rounded-lg overflow-hidden">
//                       <Image
//                         src={selectedProduct.picture}
//                         alt={selectedProduct.name}
//                         width={192}
//                         height={192}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).src = placeholder.src;
//                         }}
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
//                       <Package className="h-12 w-12 text-muted-foreground" />
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex-1 space-y-4">
//                   <div>
//                     <h3 className="text-xl font-bold mb-2">{getDisplayValue(selectedProduct.name)}</h3>
//                     <p className="text-sm text-muted-foreground mb-4">Code: {getDisplayValue(selectedProduct.code)}</p>
//                     <p className="text-sm mb-4">{getDisplayValue(selectedProduct.description)}</p>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm font-medium">Category</p>
//                       <p className="text-sm">{getDisplayValue(selectedProduct.category)}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium">Brand</p>
//                       <p className="text-sm">{getDisplayValue(selectedProduct.brand)}</p>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2 pt-2">
//                     {selectedProduct.banner && (
//                       <Badge variant="secondary" className="bg-blue-100 text-blue-800">
//                         <Megaphone className="h-3 w-3 mr-1" />
//                         Banner
//                       </Badge>
//                     )}
//                     {selectedProduct.featured && (
//                       <Badge variant="secondary" className="bg-purple-100 text-purple-800">
//                         <Star className="h-3 w-3 mr-1" />
//                         Featured
//                       </Badge>
//                     )}
//                     {selectedProduct.onSale && (
//                       <Badge variant="secondary" className="bg-green-100 text-green-800">
//                         <BadgePercent className="h-3 w-3 mr-1" />
//                         On Sale
//                       </Badge>
//                     )}
//                     {selectedProduct.vatEligible && (
//                       <Badge variant="secondary" className="bg-orange-100 text-orange-800">
//                         VAT Eligible
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="border-t pt-4">
//                 <h4 className="font-medium mb-3 flex items-center gap-2">
//                   <span className="text-muted-foreground">₦</span>
//                   Pricing & Inventory
//                 </h4>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="space-y-1">
//                     <p className="text-sm font-medium">Sale Price</p>
//                     <p className="text-lg font-semibold text-green-600">
//                       {formatCurrency(selectedProduct.salePrice, selectedProduct.ccy)}
//                     </p>
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-sm font-medium">Cost Price</p>
//                     <p className="text-sm">{formatCurrency(Number(selectedProduct.costPrice), selectedProduct.ccy)}</p>
//                   </div>
//                   {selectedProduct.oldPrice !== selectedProduct.salePrice && (
//                     <div className="space-y-1">
//                       <p className="text-sm font-medium">Old Price</p>
//                       <p className="text-sm text-muted-foreground line-through">
//                         {formatCurrency(selectedProduct.oldPrice, selectedProduct.ccy)}
//                       </p>
//                     </div>
//                   )}
//                   <div className="space-y-1">
//                     <p className="text-sm font-medium">Stock Quantity & Unit</p>
//                     <p className="text-sm font-medium">
//                       {selectedProduct.qtyInStore} {getDisplayValue(selectedProduct.unitQuantity || selectedProduct.unit)}
//                     </p>
//                   </div>
//                 </div>

//                 {selectedProduct.onSale && selectedProduct.discount && (
//                   <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-yellow-800">Discount Applied</p>
//                         <p className="text-lg font-bold text-yellow-700">{selectedProduct.discount}% OFF</p>
//                       </div>
//                       <BadgePercent className="h-6 w-6 text-yellow-600" />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="border-t pt-4">
//                 <h4 className="font-medium mb-3">Product Specifications</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">Color</p>
//                     <p className="text-sm">{getDisplayValue(selectedProduct.color)}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">Size</p>
//                     <p className="text-sm">{getDisplayValue(selectedProduct.itemSize)}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">Model</p>
//                     <p className="text-sm">{getDisplayValue(selectedProduct.model)}</p>
//                   </div>
//                   {selectedProduct.expiryDate && (
//                     <div className="space-y-2">
//                       <p className="text-sm font-medium">Expiry Date</p>
//                       <p className="text-sm">{getDisplayValue(selectedProduct.expiryDate)}</p>
//                     </div>
//                   )}
//                 </div>

//                 {(selectedProduct.weight || selectedProduct.weightUnit) && (
//                   <div className="mt-4 grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <p className="text-sm font-medium">Weight</p>
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm">{getDisplayValue(selectedProduct.weight)}</p>
//                         {selectedProduct.weightUnit && (
//                           <Badge variant="outline" className="text-xs">
//                             {selectedProduct.weightUnit}
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="border-t pt-4">
//                 <h4 className="font-medium mb-3">Identification & Codes</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">Product Code</p>
//                     <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
//                       {getDisplayValue(selectedProduct.code)}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">Barcode</p>
//                     <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
//                       {getDisplayValue(selectedProduct.barCode)}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">Product ID</p>
//                     <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
//                       {getDisplayValue(selectedProduct.id)}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">Store ID</p>
//                     <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
//                       {getDisplayValue(selectedProduct.storeCode)}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {selectedProduct.vat > 0 && (
//                 <div className="border-t pt-4">
//                   <h4 className="font-medium mb-3">Tax Information</h4>
//                   <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-blue-800">VAT Eligible</p>
//                         <p className="text-sm text-blue-700">This product includes 7.5% VAT</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm font-medium text-blue-800">VAT Value</p>
//                         <p className="text-lg font-bold text-blue-700">{formatCurrency(Number(selectedProduct.vat), selectedProduct.ccy)}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="border-t pt-4">
//                 <h4 className="font-medium mb-3">Additional Information</h4>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
//                   <div className="space-y-1">
//                     <p className="font-medium">Status</p>
//                     <Badge variant={selectedProduct.qtyInStore > 0 ? "default" : "destructive"}>
//                       {selectedProduct.qtyInStore > 0 ? 'In Stock' : 'Out of Stock'}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>

//               {/* {selectedProduct.pictureList && selectedProduct.pictureList.length > 0 && (
//                 <div className="border-t pt-4">
//                   <h4 className="font-medium mb-3">Additional Images</h4>
//                   <div className="flex gap-2 overflow-x-auto">
//                     {selectedProduct.pictureList.map((picture, index) => (
//                       <div key={index} className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
//                         <img
//                           src={picture}
//                           alt={`${selectedProduct.name} ${index + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )} */}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {filteredProducts.length === 0 && !searchTerm && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//             <Plus className="h-12 w-12 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-medium mb-2">No products yet</h3>
//           <p className="text-muted-foreground mb-4">Get started by creating your first product</p>
//           <div className="flex gap-3 justify-center">
//             <Link href="/admin/inventories/create-product" passHref>
//               <Button className="transition-smooth" variant="secondary">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Product
//               </Button>
//             </Link>
//             <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline">
//               <Upload className="h-4 w-4 mr-2" />
//               Bulk Upload
//             </Button>
//           </div>
//         </div>
//       )}

//       {filteredProducts.length === 0 && searchTerm && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//             <Search className="h-12 w-12 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-medium mb-2">No products found</h3>
//           <p className="text-muted-foreground mb-4">
//             No products match your search term "{searchTerm}"
//           </p>
//           <Button
//             onClick={() => setSearchTerm("")}
//             variant="secondary"
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
import { Search, X, Eye, ChevronLeft, ChevronRight, Plus, Upload, Package, Edit, Trash2, Loader2, Pencil } from "lucide-react";
import axiosInstanceNoAuth from "@/utils/fetch-function-auth";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermissionBusiness";
import { PermissionButton } from "@/components/Admin/permission/permission-button";
import { TransInflowIcon, SeperatorIcon, EditIcon, GridIcon, ListIcon, GridFilledIcon, BannerIcon, FeaturedIcon, SaleIcon, VatIcon } from "@/components/icons/icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UploadBulkForm from "../../upload/upload";
import { toast } from "sonner";
import Papa from "papaparse";
import useUser from "@/store/userStore";
import Image from "next/image";
import placeholder from "@/components/images/placeholder-product.webp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientIdentifiers, getClientFeatures } from '@/config/client-config';
import { BundleSubItem } from '@/types';

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
    itemVariants?: Array<{
        id: number;
        itemCode: string;
        size: string;
        color: string;
        qty: number;
        price: number;
    }>;
    /** Present when the product category is BUNDLE */
    bundleSubItems?: BundleSubItem[];
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
                            className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === current ? 'border-2 border-faded-accent text-faded-accent' : 'text-gray-600 hover:bg-gray-100'}`}>
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

// Delete Product Modal
const DeleteProductModal = ({
    isOpen,
    onClose,
    product,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSuccess?: () => void;
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { user } = useUser()
    const deleteProductMutation = useMutation({
        mutationFn: async (payload: { itemCode: string; entityCode: string }) => {
            return await axiosInstance.delete(`/itemupload/deleteProduct?itemCode=${payload.itemCode}&entityCode=${payload.entityCode}`, {
                data: payload,
            });
        },
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Product deleted successfully');
                if (onSuccess) onSuccess();
                handleClose();
            } else {
                toast.error(data?.data?.desc || 'Failed to delete product');
                setIsDeleting(false);
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete product');
            setIsDeleting(false);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        setIsDeleting(true);
        deleteProductMutation.mutate({ itemCode: product.code, entityCode: user?.entityCode! });
    };

    const handleClose = () => {
        setIsDeleting(false);
        onClose();
    };

    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
                <DialogTitle className="sr-only">Delete Product</DialogTitle>
                <div className="px-6 pt-5 pb-2">
                    <h2 className="text-base font-bold text-dark-gray">Delete Product</h2>
                    <p className="text-xs text-medium-gray mt-0.5">This action cannot be undone</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-white rounded-2xl p-4 space-y-4">
                        <div className="space-y-1.5">
                            <p className="text-xs text-medium-gray">Product Name</p>
                            <p className="text-sm font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{product.name}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-medium-gray">Product Code</p>
                            <p className="text-sm font-mono font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{product.code}</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-xs text-red-600"><span className="font-semibold">Warning:</span> This product will be permanently deleted.</p>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end pt-1">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isDeleting}>Cancel</Button>
                        <Button type="submit" disabled={isDeleting}>
                            {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : <><Trash2 className="w-4 h-4" /> Delete Product</>}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Product Variant Modal (Tabbed: Add Variant + View Variants)
const ProductVariantModal = ({
    isOpen,
    onClose,
    product,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSuccess?: () => void;
}) => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'add' | 'view'>('add');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingVariantId, setEditingVariantId] = useState<number>(0);
    const [formData, setFormData] = useState({
        size: "",
        color: "",
        qty: "",
        price: "",
    });

    const entityCode = getClientIdentifiers().entityCode;

    // Fetch product variants via getById
    const { data: productData, isLoading: isLoadingVariants } = useQuery({
        queryKey: ['product-variants', product?.id],
        queryFn: async () => {
            const response = await axiosInstanceNoAuth.request({
                method: 'GET',
                url: '/products/getById',
                params: {
                    id: product?.id,
                    entityCode: entityCode,
                },
            });
            return response.data;
        },
        enabled: isOpen && !!product?.id,
    });

    const variants = productData?.productDto?.itemVariants || productData?.data?.itemVariants || [];

    const addVariantMutation = useMutation({
        mutationFn: async (payload: any) => {
            return await axiosInstance.post('/products/save-item-variant', payload);
        },
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(isEditMode ? 'Product variant updated successfully' : 'Product variant added successfully');
                queryClient.invalidateQueries({ queryKey: ['product-variants', product?.id] });
                if (onSuccess) onSuccess();
                resetForm();
                setActiveTab('view');
            } else {
                toast.error(data?.data?.desc || 'Failed to save product variant');
                setIsLoading(false);
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to save product variant');
            setIsLoading(false);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        if (!formData.qty || isNaN(Number(formData.qty))) {
            toast.error('Valid quantity is required');
            return;
        }

        setIsLoading(true);
        addVariantMutation.mutate({
            id: isEditMode ? editingVariantId : 0,
            itemCode: product.code,
            size: formData.size,
            color: formData.color,
            qty: Number(formData.qty),
            price: formData.price ? Number(formData.price) : 0
        });
    };

    const handleEditVariant = (variant: any) => {
        setIsEditMode(true);
        setEditingVariantId(variant.id);
        setFormData({
            size: variant.size || "",
            color: variant.color || "",
            qty: variant.qty?.toString() || "",
            price: variant.price?.toString() || "",
        });
        setActiveTab('add');
    };

    const resetForm = () => {
        setIsLoading(false);
        setIsEditMode(false);
        setEditingVariantId(0);
        setFormData({ size: "", color: "", qty: "", price: "" });
    };

    const handleClose = () => {
        resetForm();
        setActiveTab('add');
        onClose();
    };

    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none' }}>
                <DialogTitle className="sr-only">Product Variants</DialogTitle>
                <div className="px-6 pt-5 pb-2">
                    <h2 className="text-base font-bold text-dark-gray">Product Variants</h2>
                    <p className="text-xs text-medium-gray mt-0.5">Manage variants for {product.name}</p>
                </div>

                {/* Tab Buttons */}
                <div className="px-6 flex gap-2 mb-2">
                    <button
                        type="button"
                        onClick={() => { setActiveTab('add'); if (!isEditMode) resetForm(); }}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'add'
                            ? 'bg-sidebar-accent text-white'
                            : 'bg-white text-medium-gray hover:text-dark-gray'
                            }`}
                    >
                        {isEditMode ? 'Edit Variant' : 'Add Variant'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('view')}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'view'
                            ? 'bg-sidebar-accent text-white'
                            : 'bg-white text-medium-gray hover:text-dark-gray'
                            }`}
                    >
                        View Variants {variants.length > 0 && <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">({variants.length})</span>}
                    </button>
                </div>

                {/* Add/Edit Variant Tab */}
                {activeTab === 'add' && (
                    <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
                        {isEditMode && (
                            <div className="flex items-center justify-between bg-sidebar-accent/10 border border-sidebar-accent/20 rounded-lg p-2">
                                <p className="text-xs text-sidebar-accent"><span className="font-semibold">Editing variant</span> — modify and save to update.</p>
                                <button type="button" onClick={resetForm} className="text-xs text-sidebar-accent hover:text-sidebar-accent/80 font-semibold underline">
                                    Cancel Edit
                                </button>
                            </div>
                        )}
                        <div className="bg-white rounded-2xl p-4 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs text-medium-gray">Size</label>
                                <Input
                                    value={formData.size}
                                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                                    placeholder="Enter size (e.g., XL, 42)"
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-medium-gray">Color</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={formData.color || "#000000"}
                                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                        className="w-12 h-10 p-1 cursor-pointer"
                                    />
                                    <Input
                                        type="text"
                                        value={formData.color}
                                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                        placeholder="Select or enter color"
                                        className="h-10 text-sm flex-1"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-medium-gray">Quantity <span className="text-red-500">*</span></label>
                                <Input
                                    type="number"
                                    required
                                    value={formData.qty}
                                    onChange={(e) => setFormData(prev => ({ ...prev, qty: e.target.value }))}
                                    placeholder="Enter quantity"
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-medium-gray">Price</label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                    placeholder="Enter variant price override (optional)"
                                    className="h-10 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end pt-1">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
                            <Button type="submit" disabled={isLoading} className="bg-sidebar-accent hover:bg-sidebar-accent/90 text-white">
                                {isLoading
                                    ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
                                    : isEditMode
                                        ? <><Pencil className="w-4 h-4 mr-2" /> Update Variant</>
                                        : <><Plus className="w-4 h-4 mr-2" /> Add Variant</>
                                }
                            </Button>
                        </div>
                    </form>
                )}

                {/* View Variants Tab */}
                {activeTab === 'view' && (
                    <div className="px-6 pb-6">
                        {isLoadingVariants ? (
                            <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
                                <div className="text-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-sidebar-accent mx-auto mb-2" />
                                    <p className="text-xs text-medium-gray">Loading variants...</p>
                                </div>
                            </div>
                        ) : variants.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
                                <div className="text-center">
                                    <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-medium-gray font-medium">No variants yet</p>
                                    <p className="text-xs text-medium-gray mt-1">Add your first variant using the &quot;Add Variant&quot; tab.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl overflow-hidden">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left px-4 py-3 text-medium-gray font-semibold">Size</th>
                                            <th className="text-left px-4 py-3 text-medium-gray font-semibold">Color</th>
                                            <th className="text-left px-4 py-3 text-medium-gray font-semibold">Qty</th>
                                            <th className="text-left px-4 py-3 text-medium-gray font-semibold">Price</th>
                                            <th className="text-right px-4 py-3 text-medium-gray font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variants.map((variant: any, index: number) => (
                                            <tr key={variant.id || index} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-dark-gray">
                                                    {variant.size || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {variant.color ? (
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-5 h-5 rounded-full border border-gray-200 shrink-0"
                                                                style={{ backgroundColor: variant.color }}
                                                            />
                                                            <span className="text-dark-gray">{variant.color}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-medium-gray">N/A</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-dark-gray">
                                                    {variant.qty != null ? variant.qty : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-dark-gray">
                                                    {variant.price != null ? variant.price : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditVariant(variant)}
                                                        className="inline-flex items-center gap-1 text-sidebar-accent hover:text-sidebar-accent/80 font-semibold transition-colors"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

interface ProductsManagerProps {
    onCountChange?: (count: number) => void;
}

const ProductsManager = ({ onCountChange }: ProductsManagerProps) => {
    const { user } = useUser();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "table">("table");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [variantProduct, setVariantProduct] = useState<Product | null>(null);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const { enableBundleManagement } = getClientFeatures();
    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["products"],
        queryFn: () => axiosInstance.request({
            method: "GET",
            url: '/ecommerce/products/list',
            params: { name: '', storeCode: user?.storeCode, entityCode: user?.entityCode, tag: '', pageNumber: 1, pageSize: 1000 }
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
        router.push(`/admin/inventories/create-product?edit=true&id=${product.id}&category=${product.category}`);
    };

    const handleDelete = (product: Product) => {
        setDeletingProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleAddVariant = (product: Product) => {
        setVariantProduct(product);
        setIsVariantModalOpen(true);
    };

    const handleManageBundle = (product: Product) => {
        router.push(`/admin/inventories/bundle?productId=${product.id}`);
    };

    const handleDeleteSuccess = () => {
        refetch();
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

                        <PermissionButton
                            requiredPermissions={['MANAGE_INVENTORY']} requireAll={true} hideIfNoPermission={false}
                            tooltipMessage="No permission" onClick={() => router.push('/admin/inventories/product-images')}
                            className="h-10" variant="outline"
                        >
                            <TransInflowIcon className="w-4 h-4 rotate-180" /> Product Images
                        </PermissionButton>

                        <SeperatorIcon />

                        <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-10"><TransInflowIcon className="w-4 h-4 rotate-180" />Bulk Upload</Button>
                            </DialogTrigger>
                            <DialogContent className='overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0 max-h-[80vh] p-6' style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                                <DialogHeader><DialogTitle></DialogTitle></DialogHeader>
                                <UploadBulkForm uploadType="products" onSuccess={() => { setIsBulkUploadOpen(false); refetch(); }} onCancel={() => setIsBulkUploadOpen(false)} />
                            </DialogContent>
                        </Dialog>

                        <PermissionButton
                            requiredPermissions={['MANAGE_INVENTORY']} requireAll={true} hideIfNoPermission={false}
                            tooltipMessage="No permission" onClick={() => router.push('/admin/inventories/create-product')}
                            className="h-10"
                        >
                            <Plus className="w-4 h-4" /> Add Product
                        </PermissionButton>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-sidebar-accent border-t-transparent animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading products</div>
            ) : (
                <>
                    {viewMode === "grid" ? (
                        filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
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
                                                <Button size="sm" className="flex-1 text-xs bg-sidebar-accent hover:bg-sidebar-accent/90 text-white" onClick={() => handleEdit(product)}>
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
                                                        className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-sidebar-accent/10 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
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
                                                                <Button size="xs" variant="action" onClick={() => handleDelete(p)} title="Delete" className="text-red-500 hover:text-red-700">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                                <Button size="xs" variant="action" onClick={() => handleAddVariant(p)} title="Add Variant" className="text-blue-500 hover:text-blue-700">
                                                                    <Plus className="w-4 h-4" />
                                                                </Button>
                                                                {enableBundleManagement && p.category?.toUpperCase() === 'BUNDLE' && (
                                                                    <Button size="xs" variant="action" onClick={() => handleManageBundle(p)} title="Manage Bundle" className="text-purple-600 hover:text-purple-800">
                                                                        <Package className="w-4 h-4" />
                                                                    </Button>
                                                                )}
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
                                                    <Image src={selectedProduct.picture} alt={selectedProduct.name} width={144} height={144}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = placeholder.src; }} />
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
                                                    {selectedProduct.banner && <Badge className="text-[10px] px-2.5 py-0.5 bg-[#FFEACC] text-medium-gray font-semibold"><BannerIcon className="w-3 h-3 mr-1 text-medium-gray" /> Banner</Badge>}
                                                    {selectedProduct.featured && <Badge className="text-[10px] px-2.5 py-0.5 bg-[#FFEACC] text-medium-gray font-semibold"><FeaturedIcon className="w-3 h-3 mr-1 text-medium-gray" /> Featured</Badge>}
                                                    {selectedProduct.onSale && <Badge className="text-[10px] px-2.5 py-0.5 bg-[#FFEACC] text-medium-gray font-semibold"><SaleIcon className="w-3 h-3 mr-1 text-medium-gray" /> On Sale</Badge>}
                                                    {selectedProduct.vatEligible && <Badge className="text-[10px] px-2.5 py-0.5 bg-[#FFEACC] text-medium-gray font-semibold"><VatIcon className="w-3 h-3 mr-1 text-medium-gray" /> VAT Eligible</Badge>}
                                                </div>
                                            </div>
                                            <div><p className="text-xs font-medium text-medium-gray max-w-sm">{getDisplayValue(selectedProduct.description)}</p></div>
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-2">
                                                <div className="space-y-0.5"><p className="text-xs text-medium-gray">Category</p><p className="text-xs font-semibold text-dark-gray">{getDisplayValue(selectedProduct.category)}</p></div>
                                                <div className="space-y-0.5"><p className="text-xs text-medium-gray">Brand</p><p className="text-xs font-semibold text-dark-gray">{getDisplayValue(selectedProduct.brand)}</p></div>
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
                                            <div className="space-y-0.5"><p className="text-xs text-medium-gray">Colour</p><p className="text-xs font-semibold text-dark-gray">{getDisplayValue(selectedProduct.color)}</p></div>
                                            <div className="space-y-0.5"><p className="text-xs text-medium-gray">Size</p><p className="text-xs font-semibold text-dark-gray">{getDisplayValue(selectedProduct.itemSize)}</p></div>
                                            <div className="space-y-0.5"><p className="text-xs text-medium-gray">Model</p><p className="text-xs font-semibold text-dark-gray">{getDisplayValue(selectedProduct.model)}</p></div>
                                            {selectedProduct.weight && <div className="space-y-0.5"><p className="text-xs text-medium-gray">Weight</p><p className="text-xs font-semibold text-dark-gray">{selectedProduct.weight} {selectedProduct.weightUnit || ''}</p></div>}
                                            {selectedProduct.expiryDate && <div className="space-y-0.5"><p className="text-xs text-medium-gray">Expiry Date</p><p className="text-xs font-semibold text-dark-gray">{getDisplayValue(selectedProduct.expiryDate)}</p></div>}
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
                                            <div className="space-y-0.5"><p className="text-xs text-medium-gray">Sale Price</p><p className="text-sm font-bold text-green-600">{formatCurrency(selectedProduct.salePrice, selectedProduct.ccy)}</p></div>
                                            <div className="space-y-0.5"><p className="text-xs text-medium-gray">Cost Price</p><p className="text-xs font-semibold text-dark-gray">{formatCurrency(Number(selectedProduct.costPrice), selectedProduct.ccy)}</p></div>
                                            {selectedProduct.oldPrice && selectedProduct.oldPrice !== selectedProduct.salePrice && <div className="space-y-0.5"><p className="text-xs text-medium-gray">Old Price</p><p className="text-xs font-semibold text-dark-gray line-through">{formatCurrency(selectedProduct.oldPrice, selectedProduct.ccy)}</p></div>}
                                            <div className="space-y-0.5"><p className="text-xs text-medium-gray">Stock Quantity</p><p className="text-xs font-semibold text-dark-gray">{selectedProduct.qtyInStore} {getDisplayValue(selectedProduct.unit || selectedProduct.unitQuantity)}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <DeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setDeletingProduct(null); }}
                product={deletingProduct}
                onSuccess={handleDeleteSuccess}
            />

            <ProductVariantModal
                isOpen={isVariantModalOpen}
                onClose={() => { setIsVariantModalOpen(false); setVariantProduct(null); }}
                product={variantProduct}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
};

export default ProductsManager;
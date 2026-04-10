'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Search, Grid, List, Upload, Eye, Package, BadgePercent, Megaphone, Star, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProductsTable from "./products-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosOperations from "@/utils/fetch-function-op-auth";
import UploadBulkForm from "../../upload-op/upload";
import UploadImage from "../../upload-op/upload-images";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Badge } from '@/components/ui/badge'
import placeholder from "@/components/images/placeholder-product.webp";
import useOperations from "@/store/operationsStore";
import { PermissionButton } from "../permission/permission-button";

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

interface ProductsManagerProps {
  onCountChange?: (count: number) => void;
}

const ProductsManager = ({ onCountChange }: ProductsManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isBulkUploadImagesOpen, setIsBulkUploadImagesOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { operations } = useOperations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProductCategory, setEditingProductCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const editParam = searchParams.get('edit');
    const idParam = searchParams.get('id');
    const categoryParam = searchParams.get('category');

    if (editParam === 'true' && idParam && categoryParam) {
      setIsEditMode(true);
      setEditingProductId(idParam);
      setEditingProductCategory(categoryParam);
      router.push(`/operations/inventories/create-product?edit=true&id=${idParam}&category=${categoryParam}`);
    }
  }, [searchParams, router]);

  useEffect(() => {
    const handleRefresh = () => {
      refetch();
    };
    window.addEventListener('refresh-inventories', handleRefresh);
    return () => window.removeEventListener('refresh-inventories', handleRefresh);
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return axiosOperations.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          name: '',
          storeCode: operations?.storeCode,
          entityCode: operations?.entityCode,
          tag: '',
          pageNumber: 1,
          pageSize: 1000
        }
      }).then(response => response.data);
    }
  });

  useEffect(() => {
    if (data?.products && onCountChange) {
      onCountChange(data.products.length);
    }
  }, [data?.products, onCountChange]);

  const filteredProducts = data?.products?.filter((product: Product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barCode?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEditDetails = async (product: Product) => {
    try {
      await queryClient.invalidateQueries({
        queryKey: ['product-detail', product.id]
      });

      router.push(`/operations/inventories/create-product?edit=true&id=${product.id}&category=${product.category}`);
    } catch (error) {
      console.error('Error refreshing product data:', error);
      router.push(`/operations/inventories/create-product?edit=true&id=${product.id}&category=${product.category}`);
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getDisplayValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return value.toString();
  };

  const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
    return `${currency} ${amount?.toFixed(2) || '0.00'}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="mt-2 text-accent-foreground/70">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-500">Error loading products</p>
          <p className="text-accent-foreground/70">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-accent/20 text-accent-foreground"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-2 bg-accent/5">
              <TabsTrigger value="grid" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white">
                <Grid className="h-4 w-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white">
                <List className="h-4 w-4" />
                Table
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogTrigger asChild>
              <PermissionButton
                requiredPermissions={['MANAGE_INVENTORY']}
                requireAll={true}
                hideIfNoPermission={false}
                variant="outline"
                tooltipMessage="You do not have permission to manage inventory"
                className=""
              >
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </PermissionButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <UploadBulkForm
                uploadType="products"
                onSuccess={() => {
                  setIsBulkUploadOpen(false);
                  refetch();
                }}
                onCancel={() => setIsBulkUploadOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* <Dialog open={isBulkUploadImagesOpen} onOpenChange={setIsBulkUploadImagesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-accent/20 hover:bg-accent/10 hover:text-accent">
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Upload Images</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <UploadImage
                uploadType="product_images"
                onSuccess={() => {
                  setIsBulkUploadImagesOpen(false);
                  refetch();
                }}
                onCancel={() => setIsBulkUploadImagesOpen(false)}
              />
            </DialogContent>
          </Dialog> */}

          <PermissionButton
            requiredPermissions={['MANAGE_INVENTORY']}
            requireAll={true}
            hideIfNoPermission={false}
            variant="outline"
            tooltipMessage="You do not have permission to manage inventory"
            onClick={() => router.push('/operations/inventories/product-images')}
            className=""
          >
            <Upload className="mr-2 h-4 w-4" />
            Product Images
          </PermissionButton>

          <PermissionButton
            requiredPermissions={['MANAGE_INVENTORY']}
            requireAll={true}
            hideIfNoPermission={false}
            tooltipMessage="You do not have permission to manage inventory"
            onClick={() => router.push('/operations/inventories/create-product')}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </PermissionButton>
        </div>
      </div>

      <Card className="border-accent/20 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-accent-foreground">
              Products List
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-accent/20 hover:bg-accent/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product: Product) => (
                <Card key={product.id} className="border-accent/20 shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="pb-4">
                    {product.picture && (
                      <div className="w-full h-48 bg-muted rounded-lg overflow-hidden mb-4">
                        <img
                          src={product.picture}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <CardTitle className="text-lg text-accent-foreground">{product.name}</CardTitle>
                    <p className="text-sm text-accent-foreground/70">Code: {product.code || 'NIL'}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-accent-foreground/70">Price</span>
                      <span className="font-semibold text-accent-foreground">{formatCurrency(product.salePrice, product.ccy)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-accent-foreground/70">Stock</span>
                      <span className="font-medium text-accent-foreground">{product.qtyInStore} {product.unit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-accent-foreground/70">Category</span>
                      <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-accent/20 hover:bg-accent/10 hover:text-accent"
                        onClick={() => handleViewDetails(product)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-accent hover:bg-accent/90 text-white"
                        onClick={() => handleEditDetails(product)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <ProductsTable
              products={filteredProducts}
              onEdit={handleEditDetails}
              onViewDetails={handleViewDetails}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              searchTerm={searchTerm}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-3xl max-h-[90vh] overflow-y-auto"
          style={{
            scrollbarWidth: 'none',
            scrollbarColor: 'transparent',
          }}
        >
          <DialogHeader className='flex flex-col'>
            <DialogTitle className="text-accent-foreground">Product Details - {selectedProduct?.name || 'N/A'}</DialogTitle>
            <DialogDescription>
              Detailed information about the selected product
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="py-4 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {selectedProduct.picture ? (
                    <div className="w-48 h-48 bg-muted rounded-lg overflow-hidden border border-accent/20">
                      <Image
                        src={selectedProduct.picture}
                        alt={selectedProduct.name}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = placeholder.src;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-accent/5 rounded-lg flex items-center justify-center border border-accent/20">
                      <Package className="h-12 w-12 text-accent-foreground/50" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-accent-foreground mb-2">{getDisplayValue(selectedProduct.name)}</h3>
                    <p className="text-sm text-accent-foreground/70 mb-4">Code: {getDisplayValue(selectedProduct.code)}</p>
                    <p className="text-sm text-accent-foreground/80 mb-4">{getDisplayValue(selectedProduct.description)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-accent-foreground">Category</p>
                      <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedProduct.category)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-accent-foreground">Brand</p>
                      <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedProduct.brand)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedProduct.banner && (
                      <Badge className="bg-accent/20 text-accent-foreground">
                        <Megaphone className="h-3 w-3 mr-1" />
                        Banner
                      </Badge>
                    )}
                    {selectedProduct.featured && (
                      <Badge className="bg-accent/20 text-accent-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {selectedProduct.onSale && (
                      <Badge className="bg-accent/20 text-accent-foreground">
                        <BadgePercent className="h-3 w-3 mr-1" />
                        On Sale
                      </Badge>
                    )}
                    {selectedProduct.vatEligible && (
                      <Badge className="bg-accent/20 text-accent-foreground">
                        VAT Eligible
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-accent/10 pt-4">
                <h4 className="font-medium text-accent-foreground mb-3 flex items-center gap-2">
                  <span className="text-accent-foreground/70">₦</span>
                  Pricing & Inventory
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-accent-foreground">Sale Price</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(selectedProduct.salePrice, selectedProduct.ccy)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-accent-foreground">Cost Price</p>
                    <p className="text-sm text-accent-foreground/70">{formatCurrency(Number(selectedProduct.costPrice), selectedProduct.ccy)}</p>
                  </div>
                  {selectedProduct.oldPrice !== selectedProduct.salePrice && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-accent-foreground">Old Price</p>
                      <p className="text-sm text-accent-foreground/50 line-through">
                        {formatCurrency(selectedProduct.oldPrice, selectedProduct.ccy)}
                      </p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-accent-foreground">Stock Quantity</p>
                    <p className="text-sm font-medium text-accent-foreground">
                      {selectedProduct.qtyInStore} {getDisplayValue(selectedProduct.unitQuantity || selectedProduct.unit)}
                    </p>
                  </div>
                </div>

                {selectedProduct.onSale && selectedProduct.discount && (
                  <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-accent-foreground">Discount Applied</p>
                        <p className="text-lg font-bold text-accent-foreground">{selectedProduct.discount}% OFF</p>
                      </div>
                      <BadgePercent className="h-6 w-6 text-accent-foreground" />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-accent/10 pt-4">
                <h4 className="font-medium text-accent-foreground mb-3">Product Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-accent-foreground">Color</p>
                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedProduct.color)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-accent-foreground">Size</p>
                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedProduct.itemSize)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-accent-foreground">Model</p>
                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedProduct.model)}</p>
                  </div>
                  {selectedProduct.expiryDate && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-accent-foreground">Expiry Date</p>
                      <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedProduct.expiryDate)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-accent/10 pt-4">
                <h4 className="font-medium text-accent-foreground mb-3">Identification & Codes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-accent-foreground">Product Code</p>
                    <p className="text-sm font-mono bg-accent/5 px-2 py-1 rounded inline-block text-accent-foreground">
                      {getDisplayValue(selectedProduct.code)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-accent-foreground">Barcode</p>
                    <p className="text-sm font-mono bg-accent/5 px-2 py-1 rounded inline-block text-accent-foreground">
                      {getDisplayValue(selectedProduct.barCode)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredProducts.length === 0 && !searchTerm && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <Plus className="h-12 w-12 text-accent-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-accent-foreground mb-2">No products yet</h3>
          <p className="text-accent-foreground/70 mb-4">Get started by creating your first product</p>
          <div className="flex gap-3 justify-center">
            <Link href="/operations/inventories/create-product" passHref>
              <Button className="bg-accent hover:bg-accent/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
            <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline" className="border-accent/20 hover:bg-accent/10">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <Search className="h-12 w-12 text-accent-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-accent-foreground mb-2">No products found</h3>
          <p className="text-accent-foreground/70 mb-4">
            No products match your search term "{searchTerm}"
          </p>
          <Button
            onClick={() => setSearchTerm("")}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
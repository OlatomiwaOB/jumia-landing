'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Search, Grid, List, Upload, Eye, Package, BadgePercent, Megaphone, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProductsTable from "./products-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import useUser from "@/store/userStore";
import UploadBulkForm from "../../upload/upload";
import UploadImage from "../../upload/upload-images";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Badge } from '@/components/ui/badge'
import placeholder from "@/components/images/placeholder-product.webp";
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
  const { user } = useUser();
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
      router.push(`/admin/inventories/create-product?edit=true&id=${idParam}&category=${categoryParam}`);
    }
  }, [searchParams, router]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return axiosInstance.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          name: '',
          storeCode: user?.storeCode,
          entityCode: user?.entityCode,
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

      router.push(`/admin/inventories/create-product?edit=true&id=${product.id}&category=${product.category}`);
    } catch (error) {
      console.error('Error refreshing product data:', error);
      router.push(`/admin/inventories/create-product?edit=true&id=${product.id}&category=${product.category}`);
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    refetch();
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-500">Error loading products</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
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
              <Button className="transition-smooth" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload Images
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
            onClick={() => router.push('/admin/inventories/product-images')}
            className=""
          >
            <Upload className="mr-2 h-4 w-4" />
            Product Images
          </PermissionButton>

          {/* <PermissionButton
            requiredPermissions={['MANAGE_INVENTORY']}
            requireAll={true}
            hideIfNoPermission={false}
            tooltipMessage="You do not have permission to manage inventory"
            onClick={() => router.push('/admin/inventories/create-product')}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </PermissionButton> */}

          <Button
            className="cursor-pointer flex items-center gap-2"
            onClick={() => router.push('/admin/inventories/create-product')}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product: Product) => (
            <Card key={product.id} className="group hover:shadow-elegant transition-smooth">
              <CardHeader className="pb-4">
                {product.picture && (
                  <div className="w-full h-48 bg-muted rounded-lg overflow-hidden mb-4">
                    <img
                      src={product.picture}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Code: {product.code || 'NIL'}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-semibold">{formatCurrency(product.salePrice, product.ccy)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Stock</span>
                  <span className="font-medium">{product.qtyInStore}{product.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="text-sm">{product.category}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(product)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 bg-accent text-white hover:bg-accent-foreground"
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
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-3xl max-h-[90vh] overflow-y-auto"
          style={{
            scrollbarWidth: 'none',
            scrollbarColor: 'transparent',
          }}
        >
          <DialogHeader className='flex flex-col'>
            <DialogTitle>Product Details - {selectedProduct?.name || 'N/A'}</DialogTitle>
            <DialogDescription>
              Detailed information about the selected product
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="py-4 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {selectedProduct.picture ? (
                    <div className="w-48 h-48 bg-muted rounded-lg overflow-hidden">
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
                    <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{getDisplayValue(selectedProduct.name)}</h3>
                    <p className="text-sm text-muted-foreground mb-4">Code: {getDisplayValue(selectedProduct.code)}</p>
                    <p className="text-sm mb-4">{getDisplayValue(selectedProduct.description)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm">{getDisplayValue(selectedProduct.category)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Brand</p>
                      <p className="text-sm">{getDisplayValue(selectedProduct.brand)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedProduct.banner && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Megaphone className="h-3 w-3 mr-1" />
                        Banner
                      </Badge>
                    )}
                    {selectedProduct.featured && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {selectedProduct.onSale && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <BadgePercent className="h-3 w-3 mr-1" />
                        On Sale
                      </Badge>
                    )}
                    {selectedProduct.vatEligible && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        VAT Eligible
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <span className="text-muted-foreground">₦</span>
                  Pricing & Inventory
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Sale Price</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(selectedProduct.salePrice, selectedProduct.ccy)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Cost Price</p>
                    <p className="text-sm">{formatCurrency(Number(selectedProduct.costPrice), selectedProduct.ccy)}</p>
                  </div>
                  {selectedProduct.oldPrice !== selectedProduct.salePrice && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Old Price</p>
                      <p className="text-sm text-muted-foreground line-through">
                        {formatCurrency(selectedProduct.oldPrice, selectedProduct.ccy)}
                      </p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Stock Quantity & Unit</p>
                    <p className="text-sm font-medium">
                      {selectedProduct.qtyInStore} {getDisplayValue(selectedProduct.unitQuantity || selectedProduct.unit)}
                    </p>
                  </div>
                </div>

                {selectedProduct.onSale && selectedProduct.discount && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Discount Applied</p>
                        <p className="text-lg font-bold text-yellow-700">{selectedProduct.discount}% OFF</p>
                      </div>
                      <BadgePercent className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Product Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Color</p>
                    <p className="text-sm">{getDisplayValue(selectedProduct.color)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Size</p>
                    <p className="text-sm">{getDisplayValue(selectedProduct.itemSize)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Model</p>
                    <p className="text-sm">{getDisplayValue(selectedProduct.model)}</p>
                  </div>
                  {selectedProduct.expiryDate && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Expiry Date</p>
                      <p className="text-sm">{getDisplayValue(selectedProduct.expiryDate)}</p>
                    </div>
                  )}
                </div>

                {(selectedProduct.weight || selectedProduct.weightUnit) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Weight</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{getDisplayValue(selectedProduct.weight)}</p>
                        {selectedProduct.weightUnit && (
                          <Badge variant="outline" className="text-xs">
                            {selectedProduct.weightUnit}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Identification & Codes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Product Code</p>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
                      {getDisplayValue(selectedProduct.code)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Barcode</p>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
                      {getDisplayValue(selectedProduct.barCode)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Product ID</p>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
                      {getDisplayValue(selectedProduct.id)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Store ID</p>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
                      {getDisplayValue(selectedProduct.storeCode)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedProduct.vat > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Tax Information</h4>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">VAT Eligible</p>
                        <p className="text-sm text-blue-700">This product includes 7.5% VAT</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-800">VAT Value</p>
                        <p className="text-lg font-bold text-blue-700">{formatCurrency(Number(selectedProduct.vat), selectedProduct.ccy)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Additional Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">Status</p>
                    <Badge variant={selectedProduct.qtyInStore > 0 ? "default" : "destructive"}>
                      {selectedProduct.qtyInStore > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* {selectedProduct.pictureList && selectedProduct.pictureList.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Additional Images</h4>
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedProduct.pictureList.map((picture, index) => (
                      <div key={index} className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={picture}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredProducts.length === 0 && !searchTerm && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products yet</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first product</p>
          <div className="flex gap-3 justify-center">
            <Link href="/admin/inventories/create-product" passHref>
              <Button className="transition-smooth" variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
            <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            No products match your search term "{searchTerm}"
          </p>
          <Button
            onClick={() => setSearchTerm("")}
            variant="secondary"
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
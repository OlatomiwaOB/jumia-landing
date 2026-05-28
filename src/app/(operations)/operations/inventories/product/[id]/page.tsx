// app/(operations)/operations/inventories/product/[id]/page.tsx
'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Megaphone, Star, BadgePercent } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { EditIcon } from '@/components/icons/icons';
import Image from 'next/image';
import placeholder from "@/components/images/placeholder-product.webp";

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

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-xs font-semibold text-dark-gray">{value || 'N/A'}</p>
    </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl p-4 space-y-4">
        <p className="text-sm font-semibold text-dark-gray">{title}</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
);

export default function ProductDetailsPage() {
    usePageMetadata('Product Details', 'View product information.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('VIEW_INVENTORY', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view inventory"
    });

    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const { data: productData, isLoading } = useQuery({
        queryKey: ['product-detail', productId],
        queryFn: () => axiosOperations.request({
            url: '/products/getById',
            method: 'GET',
            params: { id: productId }
        }),
        enabled: !!productId,
    });

    const product = productData?.data?.productDto;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-dark-gray font-semibold">Product not found</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl">
                <div className="mb-4 px-2 pt-4">
                    <Button variant="link" onClick={() => router.push('/operations/inventories')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='px-2 pb-6'>
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200">
                                    {product.picture ? (
                                        <Image src={product.picture} alt={product.name} width={64} height={64} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-md lg:text-lg font-medium text-dark-gray">{product.name}</h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm text-medium-gray font-mono">{product.code}</p>
                                        <Badge className="text-[10px] px-2 py-0.5 bg-gray-100 text-dark-gray border-gray-200">{product.category}</Badge>
                                    </div>
                                </div>
                            </div>
                            <PermissionButton
                                requiredPermissions={['MANAGE_INVENTORY']} requireAll={true} hideIfNoPermission={false}
                                tooltipMessage="No permission"
                                onClick={() => router.push(`/operations/inventories/create-product?edit=true&id=${product.id}&category=${product.category}`)}
                                className="gap-2"
                            >
                                <EditIcon className="w-4 h-4" /> Edit Product
                            </PermissionButton>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {product.banner && <Badge className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700 border-orange-200"><Megaphone className="w-3 h-3 mr-1" />Banner</Badge>}
                            {product.featured && <Badge className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 border-yellow-200"><Star className="w-3 h-3 mr-1" />Featured</Badge>}
                            {product.onSale && <Badge className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 border-green-200"><BadgePercent className="w-3 h-3 mr-1" />On Sale</Badge>}
                            {product.vat > 0 && <Badge className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 border-blue-200">VAT Eligible</Badge>}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <SectionCard title="Pricing & Inventory">
                            <Field label="Sale Price" value={formatCurrency(product.salePrice, product.ccy)} />
                            <Field label="Cost Price" value={formatCurrency(Number(product.costPrice), product.ccy)} />
                            <Field label="Stock Quantity" value={`${product.qtyInStore} ${product.unit || ''}`} />
                            {product.onSale && product.discount > 0 && <Field label="Discount" value={`${product.discount}%`} />}
                        </SectionCard>

                        <SectionCard title="Specifications">
                            <Field label="Color" value={product.color} />
                            <Field label="Size" value={product.itemSize} />
                            <Field label="Model" value={product.model} />
                            <Field label="Weight" value={product.weight ? `${product.weight} ${product.weightUnit || ''}` : 'N/A'} />
                            <Field label="Expiry Date" value={product.expiryDate} />
                        </SectionCard>

                        <SectionCard title="Identification">
                            <Field label="Product Code" value={product.code} />
                            <Field label="Barcode" value={product.barCode} />
                            <Field label="Brand" value={product.brand} />
                        </SectionCard>

                        {product.description && (
                            <div className="bg-white rounded-2xl p-4">
                                <p className="text-sm font-semibold text-dark-gray mb-2">Description</p>
                                <p className="text-sm text-dark-gray">{product.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
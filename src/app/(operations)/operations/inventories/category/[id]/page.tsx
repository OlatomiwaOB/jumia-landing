// app/(operations)/operations/inventories/category/[id]/page.tsx
'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Tag } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { EditIcon } from '@/components/icons/icons';
import Image from 'next/image';
import placeholder from "@/components/images/placeholder-product.webp";

// Keep getDisplayValue, Field, SectionCard

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

export default function CategoryDetailsPage() {
    usePageMetadata('Category Details', 'View category information.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('VIEW_INVENTORY', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view inventory"
    });

    const router = useRouter();
    const params = useParams();
    const categoryId = params.id as string;

    const { data: categoryData, isLoading } = useQuery({
        queryKey: ['category-detail', categoryId],
        queryFn: () => axiosOperations.request({
            url: `/products/category/${categoryId}`,
            method: 'GET',
        }),
        enabled: !!categoryId,
    });

    const categories = categoryData?.data?.categories;
    const category = categories && categories.length > 0 ? categories[0] : null;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-dark-gray font-semibold">Category not found</p>
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
                                    {category.logo ? (
                                        <Image src={category.logo} alt={category.name} width={64} height={64} className="w-full h-full object-cover" />
                                    ) : (
                                        <Tag className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-md lg:text-lg font-medium text-dark-gray">{category.name}</h1>
                                    <p className="text-sm text-medium-gray font-mono mt-1">{category.code}</p>
                                </div>
                            </div>
                            <PermissionButton
                                requiredPermissions={['MANAGE_INVENTORY']} requireAll={true} hideIfNoPermission={false}
                                tooltipMessage="No permission"
                                onClick={() => router.push(`/operations/inventories/create-category?edit=true&id=${category.id}`)}
                                className="gap-2"
                            >
                                <EditIcon className="w-4 h-4" /> Edit Category
                            </PermissionButton>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <SectionCard title="Category Information">
                            <Field label="Name" value={category.name} />
                            <Field label="Code" value={category.code} />
                            <Field label="Sector" value={category.sector} />
                            <Field label="Category Level" value={category.topCategory} />
                        </SectionCard>

                        {category.description && (
                            <div className="bg-white rounded-2xl p-4">
                                <p className="text-sm font-semibold text-dark-gray mb-2">Description</p>
                                <p className="text-sm text-dark-gray">{category.description}</p>
                            </div>
                        )}

                        {category.tags && (
                            <div className="bg-white rounded-2xl p-4">
                                <p className="text-sm font-semibold text-dark-gray mb-2">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {category.tags.split(',').map((tag: string, idx: number) => (
                                        <Badge key={idx} className="text-xs px-3 py-1 bg-gray-100 text-dark-gray border border-gray-200 rounded-full">
                                            {tag.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
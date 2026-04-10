'use client'
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Search, Grid, List, Upload, Eye, Tag, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CategoriesTable from "./categories-table";
import { useQuery } from "@tanstack/react-query";
import axiosOperations from "@/utils/fetch-function-op-auth";
import UploadBulkForm from "../../upload-op/upload";
import UploadImage from "../../upload-op/upload-images";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import placeholder from "@/components/images/placeholder-product.webp";
import useOperations from "@/store/operationsStore";
import { PermissionButton } from "../permission/permission-button";

export interface Category {
  id: number;
  code: string;
  name: string;
  description: string;
  sector: string;
  logo: string;
  tags: string;
  topCategory: string;
  qty: string;
  storeCode: string | null;
}

interface CategoriesManagerProps {
  onCountChange?: (count: number) => void;
}

const CategoriesManager = ({ onCountChange }: CategoriesManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { operations } = useOperations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isBulkUploadImagesOpen, setIsBulkUploadImagesOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const editParam = searchParams.get('edit');
    const idParam = searchParams.get('id');

    if (editParam === 'true' && idParam) {
      setIsEditMode(true);
      setEditingCategoryId(idParam);
      router.push(`/operations/inventories/create-category?edit=true&id=${idParam}`);
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
    queryKey: ['categories'],
    queryFn: () => axiosOperations.request({
      url: '/ecommerce/products/categories',
      params: {
        name: "",
        entityCode: operations?.entityCode,
        category: '',
        tag: '',
        pageNumber: 1,
        pageSize: 200
      }
    })
  });

  useEffect(() => {
    if (data?.data?.categories && onCountChange) {
      onCountChange(data.data.categories.length);
    }
  }, [data?.data?.categories, onCountChange]);

  const filteredCategories = useMemo(() => {
    if (!data?.data?.categories) return [];

    if (!searchTerm) return data.data.categories;

    return data.data.categories.filter((category: Category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.tags?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.data?.categories, searchTerm]);

  const handleEditCategory = (category: Category) => {
    router.push(`/operations/inventories/create-category?edit=true&id=${category.id}`);
  };

  const handleViewDetails = (category: Category) => {
    setSelectedCategory(category);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="mt-2 text-accent-foreground/70">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-500">Error loading categories</p>
          <p className="text-accent-foreground/70">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
          <Input
            placeholder="Search categories..."
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

          {/* Bulk Upload Button */}
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
              <UploadBulkForm
                uploadType="categories"
                onSuccess={() => {
                  setIsBulkUploadOpen(false);
                  refetch();
                }}
                onCancel={() => setIsBulkUploadOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Bulk Image product Button */}
          <Dialog open={isBulkUploadImagesOpen} onOpenChange={setIsBulkUploadImagesOpen}>
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
                Upload Images
              </PermissionButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <UploadImage
                uploadType="category_images"
                onSuccess={() => {
                  setIsBulkUploadImagesOpen(false);
                  refetch();
                }}
                onCancel={() => setIsBulkUploadImagesOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <PermissionButton
            requiredPermissions={['MANAGE_INVENTORY']}
            requireAll={true}
            hideIfNoPermission={false}
            tooltipMessage="You do not have permission to manage inventory"
            onClick={() => router.push('/operations/inventories/create-category')}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </PermissionButton>
        </div>
      </div>

      {/* Categories Content */}
      <Card className="border-accent/20 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-accent-foreground">
              Categories List
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
              {filteredCategories.map((category: Category) => (
                <Card key={category.id} className="border-accent/20 shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="pb-4">
                    {category.logo && (
                      <div className="w-16 h-16 bg-accent/5 rounded-lg overflow-hidden mb-4 mx-auto border border-accent/20">
                        <img
                          src={category.logo}
                          alt={category.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <CardTitle className="text-lg text-center text-accent-foreground">{category.name}</CardTitle>
                    <p className="text-sm text-accent-foreground/70 text-center">Code: {category.code}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-accent-foreground/70 text-center">{category.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-accent-foreground/70">Sector</span>
                        <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
                          {category.sector}
                        </Badge>
                      </div>

                      {category.topCategory && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-accent-foreground/70">Level</span>
                          <span className="text-sm capitalize text-accent-foreground">{category.topCategory}</span>
                        </div>
                      )}

                      {category.qty && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-accent-foreground/70">Quantity</span>
                          <span className="text-sm text-accent-foreground">{category.qty}</span>
                        </div>
                      )}
                    </div>

                    {category.tags && (
                      <div className="flex flex-wrap gap-1 mt-2 justify-center">
                        {category.tags.split(',').map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-accent/20 text-accent-foreground">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-accent/20 hover:bg-accent/10 hover:text-accent"
                        onClick={() => handleViewDetails(category)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-accent hover:bg-accent/90 text-white"
                        onClick={() => handleEditCategory(category)}
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
            <CategoriesTable
              categories={filteredCategories}
              onEdit={handleEditCategory}
              onViewDetails={handleViewDetails}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              searchTerm={searchTerm}
              onDeleteSuccess={handleDeleteSuccess}
            />
          )}
        </CardContent>
      </Card>

      {/* Category Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader className='flex flex-col'>
            <DialogTitle className="text-accent-foreground">Category Details - {selectedCategory?.name || 'N/A'}</DialogTitle>
            <DialogDescription>
              Detailed information about the selected category
            </DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <div className="py-4 space-y-6">
              {/* Logo and Basic Info */}
              <div className="flex flex-col items-center text-center mb-6">
                {selectedCategory.logo ? (
                  <div className="w-32 h-32 bg-accent/5 rounded-lg overflow-hidden mb-4 border border-accent/20">
                    <Image
                      src={selectedCategory.logo}
                      alt={selectedCategory.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = placeholder.src;
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-accent/5 rounded-lg flex items-center justify-center mb-4 border border-accent/20">
                    <Tag className="h-12 w-12 text-accent-foreground/50" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-accent-foreground">{getDisplayValue(selectedCategory.name)}</h3>
                <p className="text-sm text-accent-foreground/70">Code: {getDisplayValue(selectedCategory.code)}</p>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-accent-foreground">Description:</p>
                  <p className="text-sm bg-accent/5 p-3 rounded-md border border-accent/20 text-accent-foreground/80">
                    {getDisplayValue(selectedCategory.description)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-accent-foreground">Sector:</p>
                    <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1 w-fit">
                      {getDisplayValue(selectedCategory.sector)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-accent-foreground">Top Category:</p>
                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedCategory.topCategory)}</p>
                  </div>
                </div>

                {selectedCategory.qty && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-accent-foreground">Quantity:</p>
                    <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedCategory.qty)}</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {selectedCategory.tags && (
                <div className="border-t border-accent/10 pt-4">
                  <h4 className="font-medium text-accent-foreground mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedCategory.tags.split(',').map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-accent/20 text-accent-foreground">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredCategories.length === 0 && !searchTerm && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <Plus className="h-12 w-12 text-accent-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-accent-foreground mb-2">No categories yet</h3>
          <p className="text-accent-foreground/70 mb-4">Get started by creating your first category</p>
          <Link href="/operations/inventories/create-category" passHref>
            <Button className="bg-accent hover:bg-accent/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </Link>
        </div>
      )}

      {/* No Search Results */}
      {filteredCategories.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <Search className="h-12 w-12 text-accent-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-accent-foreground mb-2">No categories found</h3>
          <p className="text-accent-foreground/70 mb-4">
            No categories match your search term "{searchTerm}"
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

export default CategoriesManager;
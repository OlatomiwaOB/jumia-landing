// 'use client'
// import { useState, useMemo, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, Edit, Search, Grid, List, Upload, Eye, Tag, RefreshCw } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import CategoriesTable from "./categories-table";
// import { useQuery } from "@tanstack/react-query";
// import axiosOperations from "@/utils/fetch-function-op-auth";
// import UploadBulkForm from "../../upload-op/upload";
// import UploadImage from "../../upload-op/upload-images";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   DialogDescription,
// } from "@/components/ui/dialog";
// import Image from "next/image";
// import placeholder from "@/components/images/placeholder-product.webp";
// import useOperations from "@/store/operationsStore";
// import { PermissionButton } from "../permission/permission-button";

// export interface Category {
//   id: number;
//   code: string;
//   name: string;
//   description: string;
//   sector: string;
//   logo: string;
//   tags: string;
//   topCategory: string;
//   qty: string;
//   storeCode: string | null;
// }

// interface CategoriesManagerProps {
//   onCountChange?: (count: number) => void;
// }

// const CategoriesManager = ({ onCountChange }: CategoriesManagerProps) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [viewMode, setViewMode] = useState<"grid" | "table">("table");
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { operations } = useOperations();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
//   const [isBulkUploadImagesOpen, setIsBulkUploadImagesOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 15;

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

//   useEffect(() => {
//     const editParam = searchParams.get('edit');
//     const idParam = searchParams.get('id');

//     if (editParam === 'true' && idParam) {
//       setIsEditMode(true);
//       setEditingCategoryId(idParam);
//       router.push(`/operations/inventories/create-category?edit=true&id=${idParam}`);
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
//     queryKey: ['categories'],
//     queryFn: () => axiosOperations.request({
//       url: '/ecommerce/products/categories',
//       params: {
//         name: "",
//         entityCode: operations?.entityCode,
//         category: '',
//         tag: '',
//         pageNumber: 1,
//         pageSize: 200
//       }
//     })
//   });

//   useEffect(() => {
//     if (data?.data?.categories && onCountChange) {
//       onCountChange(data.data.categories.length);
//     }
//   }, [data?.data?.categories, onCountChange]);

//   const filteredCategories = useMemo(() => {
//     if (!data?.data?.categories) return [];

//     if (!searchTerm) return data.data.categories;

//     return data.data.categories.filter((category: Category) =>
//       category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       category.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       category.tags?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [data?.data?.categories, searchTerm]);

//   const handleEditCategory = (category: Category) => {
//     router.push(`/operations/inventories/create-category?edit=true&id=${category.id}`);
//   };

//   const handleViewDetails = (category: Category) => {
//     setSelectedCategory(category);
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

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
//           <p className="mt-2 text-accent-foreground/70">Loading categories...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <p className="text-red-500">Error loading categories</p>
//           <p className="text-accent-foreground/70">Please try again later</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header Actions */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//         <div className="relative flex-1 max-w-sm w-full">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
//           <Input
//             placeholder="Search categories..."
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

//           {/* Bulk Upload Button */}
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
//               <UploadBulkForm
//                 uploadType="categories"
//                 onSuccess={() => {
//                   setIsBulkUploadOpen(false);
//                   refetch();
//                 }}
//                 onCancel={() => setIsBulkUploadOpen(false)}
//               />
//             </DialogContent>
//           </Dialog>

//           {/* Bulk Image product Button */}
//           <Dialog open={isBulkUploadImagesOpen} onOpenChange={setIsBulkUploadImagesOpen}>
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
//                 Upload Images
//               </PermissionButton>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle></DialogTitle>
//               </DialogHeader>
//               <UploadImage
//                 uploadType="category_images"
//                 onSuccess={() => {
//                   setIsBulkUploadImagesOpen(false);
//                   refetch();
//                 }}
//                 onCancel={() => setIsBulkUploadImagesOpen(false)}
//               />
//             </DialogContent>
//           </Dialog>

//           <PermissionButton
//             requiredPermissions={['MANAGE_INVENTORY']}
//             requireAll={true}
//             hideIfNoPermission={false}
//             tooltipMessage="You do not have permission to manage inventory"
//             onClick={() => router.push('/operations/inventories/create-category')}
//           >
//             <Plus className="h-4 w-4" />
//             Add Category
//           </PermissionButton>
//         </div>
//       </div>

//       {/* Categories Content */}
//       <Card className="border-accent/20 shadow-sm">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-lg font-semibold text-accent-foreground">
//               Categories List
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
//               {filteredCategories.map((category: Category) => (
//                 <Card key={category.id} className="border-accent/20 shadow-sm hover:shadow-md transition-all">
//                   <CardHeader className="pb-4">
//                     {category.logo && (
//                       <div className="w-16 h-16 bg-accent/5 rounded-lg overflow-hidden mb-4 mx-auto border border-accent/20">
//                         <img
//                           src={category.logo}
//                           alt={category.name}
//                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                           onError={(e) => {
//                             const target = e.target as HTMLImageElement;
//                             target.style.display = 'none';
//                           }}
//                         />
//                       </div>
//                     )}
//                     <CardTitle className="text-lg text-center text-accent-foreground">{category.name}</CardTitle>
//                     <p className="text-sm text-accent-foreground/70 text-center">Code: {category.code}</p>
//                   </CardHeader>
//                   <CardContent className="space-y-3">
//                     <p className="text-sm text-accent-foreground/70 text-center">{category.description}</p>

//                     <div className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-accent-foreground/70">Sector</span>
//                         <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
//                           {category.sector}
//                         </Badge>
//                       </div>

//                       {category.topCategory && (
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm text-accent-foreground/70">Level</span>
//                           <span className="text-sm capitalize text-accent-foreground">{category.topCategory}</span>
//                         </div>
//                       )}

//                       {category.qty && (
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm text-accent-foreground/70">Quantity</span>
//                           <span className="text-sm text-accent-foreground">{category.qty}</span>
//                         </div>
//                       )}
//                     </div>

//                     {category.tags && (
//                       <div className="flex flex-wrap gap-1 mt-2 justify-center">
//                         {category.tags.split(',').map((tag, index) => (
//                           <Badge key={index} variant="outline" className="text-xs border-accent/20 text-accent-foreground">
//                             {tag.trim()}
//                           </Badge>
//                         ))}
//                       </div>
//                     )}

//                     <div className="flex gap-2 mt-4">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="flex-1 border-accent/20 hover:bg-accent/10 hover:text-accent"
//                         onClick={() => handleViewDetails(category)}
//                       >
//                         <Eye className="h-4 w-4 mr-2" />
//                         View
//                       </Button>
//                       <Button
//                         size="sm"
//                         className="flex-1 bg-accent hover:bg-accent/90 text-white"
//                         onClick={() => handleEditCategory(category)}
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
//             <CategoriesTable
//               categories={filteredCategories}
//               onEdit={handleEditCategory}
//               onViewDetails={handleViewDetails}
//               itemsPerPage={itemsPerPage}
//               currentPage={currentPage}
//               onPageChange={setCurrentPage}
//               searchTerm={searchTerm}
//               onDeleteSuccess={handleDeleteSuccess}
//             />
//           )}
//         </CardContent>
//       </Card>

//       {/* Category Details Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
//           <DialogHeader className='flex flex-col'>
//             <DialogTitle className="text-accent-foreground">Category Details - {selectedCategory?.name || 'N/A'}</DialogTitle>
//             <DialogDescription>
//               Detailed information about the selected category
//             </DialogDescription>
//           </DialogHeader>

//           {selectedCategory && (
//             <div className="py-4 space-y-6">
//               {/* Logo and Basic Info */}
//               <div className="flex flex-col items-center text-center mb-6">
//                 {selectedCategory.logo ? (
//                   <div className="w-32 h-32 bg-accent/5 rounded-lg overflow-hidden mb-4 border border-accent/20">
//                     <Image
//                       src={selectedCategory.logo}
//                       alt={selectedCategory.name}
//                       width={128}
//                       height={128}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src = placeholder.src;
//                       }}
//                     />
//                   </div>
//                 ) : (
//                   <div className="w-32 h-32 bg-accent/5 rounded-lg flex items-center justify-center mb-4 border border-accent/20">
//                     <Tag className="h-12 w-12 text-accent-foreground/50" />
//                   </div>
//                 )}
//                 <h3 className="text-xl font-bold text-accent-foreground">{getDisplayValue(selectedCategory.name)}</h3>
//                 <p className="text-sm text-accent-foreground/70">Code: {getDisplayValue(selectedCategory.code)}</p>
//               </div>

//               {/* Basic Information */}
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium text-accent-foreground">Description:</p>
//                   <p className="text-sm bg-accent/5 p-3 rounded-md border border-accent/20 text-accent-foreground/80">
//                     {getDisplayValue(selectedCategory.description)}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium text-accent-foreground">Sector:</p>
//                     <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1 w-fit">
//                       {getDisplayValue(selectedCategory.sector)}
//                     </Badge>
//                   </div>

//                   <div className="space-y-2">
//                     <p className="text-sm font-medium text-accent-foreground">Top Category:</p>
//                     <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedCategory.topCategory)}</p>
//                   </div>
//                 </div>

//                 {selectedCategory.qty && (
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium text-accent-foreground">Quantity:</p>
//                     <p className="text-sm text-accent-foreground/70">{getDisplayValue(selectedCategory.qty)}</p>
//                   </div>
//                 )}
//               </div>

//               {/* Tags */}
//               {selectedCategory.tags && (
//                 <div className="border-t border-accent/10 pt-4">
//                   <h4 className="font-medium text-accent-foreground mb-2">Tags</h4>
//                   <div className="flex flex-wrap gap-1">
//                     {selectedCategory.tags.split(',').map((tag, index) => (
//                       <Badge key={index} variant="outline" className="text-xs border-accent/20 text-accent-foreground">
//                         {tag.trim()}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Empty State */}
//       {filteredCategories.length === 0 && !searchTerm && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
//             <Plus className="h-12 w-12 text-accent-foreground/50" />
//           </div>
//           <h3 className="text-lg font-medium text-accent-foreground mb-2">No categories yet</h3>
//           <p className="text-accent-foreground/70 mb-4">Get started by creating your first category</p>
//           <Link href="/operations/inventories/create-category" passHref>
//             <Button className="bg-accent hover:bg-accent/90 text-white">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Category
//             </Button>
//           </Link>
//         </div>
//       )}

//       {/* No Search Results */}
//       {filteredCategories.length === 0 && searchTerm && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
//             <Search className="h-12 w-12 text-accent-foreground/50" />
//           </div>
//           <h3 className="text-lg font-medium text-accent-foreground mb-2">No categories found</h3>
//           <p className="text-accent-foreground/70 mb-4">
//             No categories match your search term "{searchTerm}"
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

// export default CategoriesManager;


'use client'
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Eye, ChevronLeft, ChevronRight, Plus, Upload, RefreshCw, Trash2, Edit, Grid, List, Tag, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosOperations from "@/utils/fetch-function-op-auth";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";
import { PermissionButton } from "@/components/Operations/permission/permission-button";
import { TransInflowIcon, SeperatorIcon, EditIcon } from "@/components/icons/icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UploadBulkForm from "../../upload-op/upload";
import { toast } from "sonner";
import Papa from "papaparse";
import useOperations from "@/store/operationsStore";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const getDisplayValue = (value: any): string => value?.toString() || 'N/A';

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
      <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Categories per Page</p>
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

// Delete Category Modal
const DeleteCategoryModal = ({
  isOpen,
  onClose,
  category,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSuccess?: () => void;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const { operations } = useOperations()
  const deleteCategoryMutation = useMutation({
    mutationFn: async (payload: { itemCode: string; entityCode: string }) => {
      return await axiosOperations.delete(`/products/delete-product-category?entityCode=${payload.entityCode}&itemCategoryCode=${payload.itemCode}`, {
        data: payload,
      });
    },
    onSuccess: (data) => {
      if (data?.data?.code === '000') {
        toast.success('Category deleted successfully');
        if (onSuccess) onSuccess();
        handleClose();
      } else {
        toast.error(data?.data?.desc || 'Failed to delete category');
        setIsDeleting(false);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
      setIsDeleting(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    setIsDeleting(true);
    deleteCategoryMutation.mutate({ itemCode: category.code, entityCode: operations?.entityCode! });
  };

  const handleClose = () => {
    setIsDeleting(false);
    onClose();
  };

  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0">
        <DialogTitle className="sr-only">Delete Category</DialogTitle>
        <div className="px-6 pt-5 pb-2">
          <h2 className="text-base font-bold text-dark-gray">Delete Category</h2>
          <p className="text-xs text-medium-gray mt-0.5">This action cannot be undone</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-white rounded-2xl p-4 space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs text-medium-gray">Category Name</p>
              <p className="text-sm font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{category.name}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-medium-gray">Category Code</p>
              <p className="text-sm font-mono font-semibold text-dark-gray bg-gray-50 p-2 rounded-lg">{category.code}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-600"><span className="font-semibold">Warning:</span> This category will be permanently deleted.</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-1">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isDeleting}>Cancel</Button>
            <Button type="submit" disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white gap-2">
              {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : <><Trash2 className="w-4 h-4" /> Delete Category</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CategoriesManager = ({ onCountChange }: CategoriesManagerProps) => {
  const { operations } = useOperations();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: () => axiosOperations.request({
      url: '/ecommerce/products/categories',
      params: { name: "", entityCode: operations?.entityCode, category: '', tag: '', pageNumber: 1, pageSize: 200 }
    })
  });

  const categories: Category[] = data?.data?.categories || [];

  useEffect(() => {
    if (onCountChange) onCountChange(categories.length);
  }, [categories.length, onCountChange]);

  const filtered = useMemo(() => {
    return categories.filter((c) => {
      const s = searchTerm.toLowerCase().trim();
      return !s || (
        c.name?.toLowerCase().includes(s) ||
        c.code?.toLowerCase().includes(s) ||
        c.sector?.toLowerCase().includes(s)
      );
    });
  }, [categories, searchTerm]);

  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    router.push(`/operations/inventories/create-category?edit=true&id=${category.id}`);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const exportToCSV = () => {
    if (!filtered.length) { toast.error('No data to export'); return; }
    const csv = Papa.unparse(filtered.map((c) => ({
      'Name': c.name, 'Code': c.code, 'Sector': c.sector, 'Description': c.description,
    })), { header: true });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
    link.download = `categories-${new Date().toISOString().split('T')[0]}.csv`;
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
          <h2 className="text-md font-semibold text-dark-gray">Category List <span className="text-md text-faded-accent">({categories.length})</span></h2>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
            <Input
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search categories..."
              className="pl-9 text-medium-gray"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Grid/Table Toggle */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === "table" ? 'bg-white text-dark-gray shadow-sm' : 'text-medium-gray hover:text-dark-gray'}`}
              >
                <List className="w-3.5 h-3.5 inline mr-1" /> Table
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === "grid" ? 'bg-white text-dark-gray shadow-sm' : 'text-medium-gray hover:text-dark-gray'}`}
              >
                <Grid className="w-3.5 h-3.5 inline mr-1" /> Grid
              </button>
            </div>

            {searchTerm && (
              <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="gap-1 text-xs">
                <X className="w-3.5 h-3.5" /> Clear
              </Button>
            )}

            <SeperatorIcon />
            <Button onClick={exportToCSV} size="lg" variant="outline">
              <TransInflowIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button onClick={() => refetch()} size="lg" variant="outline">
              <RefreshCw className="w-4 h-4" />
            </Button>

            <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg"><Upload className="w-4 h-4 mr-2" />Bulk Upload</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle></DialogTitle></DialogHeader>
                <UploadBulkForm uploadType="categories" onSuccess={() => { setIsBulkUploadOpen(false); refetch(); }} onCancel={() => setIsBulkUploadOpen(false)} />
              </DialogContent>
            </Dialog>

            <PermissionButton
              requiredPermissions={['MANAGE_INVENTORY']} requireAll={true} hideIfNoPermission={false}
              tooltipMessage="No permission" onClick={() => router.push('/operations/inventories/create-category')}
              size="lg" className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4" /> Add Category
            </PermissionButton>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading categories</div>
      ) : (
        <>
          {viewMode === "grid" ? (
            /* Grid View */
            filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Tag className="w-10 h-10 text-gray-300" />
                <p className="text-2xl font-medium text-dark-gray">No categories found</p>
                <p className="text-sm text-medium-gray">Try adjusting your search</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginated.map((category: Category) => (
                  <Card key={category.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <CardHeader className="pb-3 text-center">
                      <div className="w-16 h-16 mx-auto bg-gray-50 rounded-lg overflow-hidden mb-3 border border-gray-200">
                        {category.logo ? (
                          <Image src={category.logo} alt={category.name} width={64} height={64} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tag className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-sm font-semibold text-dark-gray">{category.name}</CardTitle>
                      <p className="text-xs text-medium-gray">Code: {category.code}</p>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      <p className="text-xs text-medium-gray text-center line-clamp-2">{category.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-medium-gray">Sector</span>
                        <Badge className="text-[10px] px-2 py-0.5 bg-gray-100 text-dark-gray border-gray-200">{category.sector}</Badge>
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleView(category)}>
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                        <Button size="sm" className="flex-1 text-xs bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleEdit(category)}>
                          <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            /* Table View */
            <div className="hidden lg:block">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Tag className="w-10 h-10 text-gray-300" />
                  <p className="text-2xl font-medium text-dark-gray">No categories found</p>
                  <p className="text-sm text-medium-gray">Try adjusting your search</p>
                </div>
              ) : (
                <>
                  <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#EEEEEE]">
                          {['S/N', 'Logo', 'Name', 'Code', 'Sector', ''].map((h) => (
                            <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((c, idx) => (
                          <tr key={c.id}
                            onClick={() => handleView(c)}
                            className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-orange-50/40 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                            <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</p></td>
                            <td className="px-3 py-3.5">
                              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200">
                                {c.logo ? (
                                  <Image src={c.logo} alt={c.name} width={40} height={40} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-500 font-bold">{c.name?.charAt(0) || 'C'}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-3.5"><p className="text-sm font-semibold text-dark-gray">{getDisplayValue(c.name)}</p></td>
                            <td className="px-3 py-3.5"><p className="text-sm font-mono text-dark-gray">{getDisplayValue(c.code)}</p></td>
                            <td className="px-3 py-3.5"><Badge className="text-[10px] px-2 py-0.5 bg-gray-100 text-dark-gray border-gray-200">{getDisplayValue(c.sector)}</Badge></td>
                            <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1">
                                <Button size="xs" variant="action" onClick={() => handleView(c)} title="View"><Eye className="w-4 h-4" /></Button>
                                <PermissionButton requiredPermissions={['MANAGE_INVENTORY']} requireAll={true} hideIfNoPermission={false}
                                  tooltipMessage="No permission" onClick={() => handleEdit(c)} size="xs" variant="action">
                                  <EditIcon className="w-4 h-4" />
                                </PermissionButton>
                                <Button size="xs" variant="action" onClick={() => handleDelete(c)} title="Delete" className="text-red-500 hover:text-red-700">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
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

      {/* Category Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
          style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}
        >
          <DialogTitle className="sr-only">Category Details</DialogTitle>
          <div className="px-6 pt-5 pb-4">
            <h2 className="text-base font-semibold text-dark-gray mb-4">Category Details</h2>
            {selectedCategory && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center gap-4 pb-3 mb-3 border-b border-[#F5F5F5]">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                      {selectedCategory.logo ? (
                        <Image src={selectedCategory.logo} alt={selectedCategory.name} width={64} height={64} className="w-full h-full object-cover" />
                      ) : (
                        <Tag className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-dark-gray">{selectedCategory.name}</p>
                      <p className="text-xs text-medium-gray font-mono">{selectedCategory.code}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-0.5"><p className="text-xs text-medium-gray">Sector</p><p className="text-xs font-semibold text-dark-gray">{selectedCategory.sector}</p></div>
                    <div className="space-y-0.5"><p className="text-xs text-medium-gray">Level</p><p className="text-xs font-semibold text-dark-gray">{selectedCategory.topCategory || 'N/A'}</p></div>
                    <div className="col-span-2 space-y-0.5"><p className="text-xs text-medium-gray">Description</p><p className="text-xs font-semibold text-dark-gray">{selectedCategory.description || 'N/A'}</p></div>
                  </div>
                </div>
                {selectedCategory.tags && (
                  <div className="bg-white rounded-2xl p-4">
                    <p className="text-sm font-semibold text-dark-gray mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory.tags.split(',').map((tag, idx) => (
                        <Badge key={idx} className="text-xs px-3 py-1 bg-gray-100 text-dark-gray border border-gray-200 rounded-full">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletingCategory(null); }}
        category={deletingCategory}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default CategoriesManager;
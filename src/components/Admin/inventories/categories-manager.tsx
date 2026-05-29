// 'use client'
// import { useState, useMemo, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, Edit, Search, Grid, List, Upload, Eye, Tag } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import CategoriesTable from "./categories-table";
// import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "@/utils/fetch-function";
// import useUser from "@/store/userStore";
// import UploadBulkForm from "../../upload/upload";
// import UploadImage from "../../upload/upload-images";
// import Link from "next/link";
// // import CreateCategoryPage from "@/app/(admin)/admin/inventories/create-category/page";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   DialogDescription,
// } from "@/components/ui/dialog";
// import Image from "next/image";
// import placeholder from "@/components/images/placeholder-product.webp";

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
//   // const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [viewMode, setViewMode] = useState<"grid" | "table">("table");
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { user } = useUser();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   // const [isEditMode, setIsEditMode] = useState(false);
//   // const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
//   const [isBulkUploadImagesOpen, setIsBulkUploadImagesOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 15;

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

//   // useEffect(() => {
//   //   const editParam = searchParams.get('edit');
//   //   const idParam = searchParams.get('id');

//   //   if (editParam === 'true' && idParam) {
//   //     setIsEditMode(true);
//   //     setEditingCategoryId(idParam);
//   //     router.push(`/admin/inventories/create-category?edit=true&id=${idParam}`);
//   //   }
//   // }, [searchParams, router]);

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['categories'],
//     queryFn: () => axiosInstance.request({
//       url: '/ecommerce/products/categories',
//       params: {
//         name: "",
//         entityCode: user?.entityCode,
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

//   // const handleEditCategory = (category: Category) => {
//   //   router.push(`/admin/inventories/create-category?edit=true&id=${category.id}`);
//   // };

//   const handleViewDetails = (category: Category) => {
//     setSelectedCategory(category);
//     setIsModalOpen(true);
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
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-2 text-muted-foreground">Loading categories...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <p className="text-red-500">Error loading categories</p>
//           <p className="text-muted-foreground">Please try again later</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header Actions */}
//       <div className="flex items-center justify-between">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search categories..."
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

//           {/* Bulk Upload Button */}
//           {/* <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
//             <DialogTrigger asChild>
//               <Button className="transition-smooth" variant="outline">
//                 <Upload className="h-4 w-4 mr-2" />
//                 Bulk Upload
//               </Button>
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

//           <Dialog open={isBulkUploadImagesOpen} onOpenChange={setIsBulkUploadImagesOpen}>
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
//                 uploadType="category_images"
//                 onSuccess={() => {
//                   setIsBulkUploadImagesOpen(false);
//                   refetch();
//                 }}
//                 onCancel={() => setIsBulkUploadImagesOpen(false)}
//               />
//             </DialogContent>
//           </Dialog> */}

//           {/* <Link href="/admin/inventories/create-category" passHref>
//             <Button className="transition-smooth" variant="secondary">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Category
//             </Button>
//           </Link> */}
//         </div>
//       </div>

//       {/* Categories Content */}
//       {viewMode === "grid" ? (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredCategories.map((category: Category) => (
//             <Card key={category.id} className="group hover:shadow-elegant transition-smooth">
//               <CardHeader className="pb-4">
//                 {category.logo && (
//                   <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden mb-4 mx-auto">
//                     <img
//                       src={category.logo}
//                       alt={category.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
//                       onError={(e) => {
//                         const target = e.target as HTMLImageElement;
//                         target.style.display = 'none';
//                       }}
//                     />
//                   </div>
//                 )}
//                 <CardTitle className="text-lg text-center">{category.name}</CardTitle>
//                 <p className="text-sm text-muted-foreground text-center">Code: {category.code}</p>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <p className="text-sm text-muted-foreground">{category.description}</p>

//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-muted-foreground">Sector</span>
//                     <Badge variant="secondary">{category.sector}</Badge>
//                   </div>

//                   {category.topCategory && (
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-muted-foreground">Level</span>
//                       <span className="text-sm capitalize">{category.topCategory}</span>
//                     </div>
//                   )}

//                   {category.qty && (
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-muted-foreground">Quantity</span>
//                       <span className="text-sm">{category.qty}</span>
//                     </div>
//                   )}
//                 </div>

//                 {category.tags && (
//                   <div className="flex flex-wrap gap-1 mt-2">
//                     {category.tags.split(',').map((tag, index) => (
//                       <Badge key={index} variant="outline" className="text-xs">
//                         {tag.trim()}
//                       </Badge>
//                     ))}
//                   </div>
//                 )}

//                 <div className="flex gap-2 mt-4">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex-1"
//                     onClick={() => handleViewDetails(category)}
//                   >
//                     <Eye className="h-4 w-4 mr-2" />
//                     View
//                   </Button>
//                   {/* <Button
//                     variant="secondary"
//                     size="sm"
//                     className="flex-1 bg-accent text-white hover:bg-accent-foreground"
//                     onClick={() => handleEditCategory(category)}
//                   >
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </Button> */}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <CategoriesTable
//           categories={filteredCategories}
//           // onEdit={handleEditCategory}
//           onViewDetails={handleViewDetails}
//           itemsPerPage={itemsPerPage}
//           currentPage={currentPage}
//           onPageChange={setCurrentPage}
//           searchTerm={searchTerm}
//         />
//       )}

//       {/* Category Details Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
//           <DialogHeader className='flex flex-col'>
//             <DialogTitle>Category Details - {selectedCategory?.name || 'N/A'}</DialogTitle>
//             <DialogDescription>
//               Detailed information about the selected category
//             </DialogDescription>
//           </DialogHeader>

//           {selectedCategory && (
//             <div className="py-4 space-y-6">
//               {/* Logo and Basic Info */}
//               <div className="flex flex-col items-center text-center mb-6">
//                 {selectedCategory.logo ? (
//                   <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden mb-4">
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
//                   <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mb-4">
//                     <Tag className="h-12 w-12 text-muted-foreground" />
//                   </div>
//                 )}
//                 <h3 className="text-xl font-bold">{getDisplayValue(selectedCategory.name)}</h3>
//                 <p className="text-sm text-muted-foreground">Code: {getDisplayValue(selectedCategory.code)}</p>
//               </div>

//               {/* Basic Information */}
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Description:</p>
//                   <p className="text-sm bg-gray-50 p-3 rounded-md">
//                     {getDisplayValue(selectedCategory.description)}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">Sector:</p>
//                     <Badge variant="secondary" className="w-fit">
//                       {getDisplayValue(selectedCategory.sector)}
//                     </Badge>
//                   </div>

//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">Top Category:</p>
//                     <p className="text-sm">{getDisplayValue(selectedCategory.topCategory)}</p>
//                   </div>
//                 </div>

//                 {selectedCategory.qty && (
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">Quantity:</p>
//                     <p className="text-sm">{getDisplayValue(selectedCategory.qty)}</p>
//                   </div>
//                 )}

//                 {selectedCategory.storeCode && (
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">Store Code:</p>
//                     <p className="text-sm">{getDisplayValue(selectedCategory.storeCode)}</p>
//                   </div>
//                 )}
//               </div>

//               {/* Tags */}
//               {selectedCategory.tags && (
//                 <div className="border-t pt-4">
//                   <h4 className="font-medium mb-2">Tags</h4>
//                   <div className="flex flex-wrap gap-1">
//                     {selectedCategory.tags.split(',').map((tag, index) => (
//                       <Badge key={index} variant="outline" className="text-xs">
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

//       {/* <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
//         <DialogContent className="min-w-[70vw] max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Edit Category</DialogTitle>
//           </DialogHeader>
//           {editingCategory && (
//             <CreateCategoryPage
//               category={editingCategory}
//               mode="edit"
//             />
//           )}
//         </DialogContent>
//       </Dialog> */}

//       {/* Empty State */}
//       {filteredCategories.length === 0 && !searchTerm && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//             <Plus className="h-12 w-12 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-medium mb-2">No categories yet</h3>
//           <p className="text-muted-foreground mb-4">Get started by creating your first category</p>
//           <Link href="/admin/inventories/create-category" passHref>
//             <Button variant="secondary">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Category
//             </Button>
//           </Link>
//         </div>
//       )}

//       {/* No Search Results */}
//       {filteredCategories.length === 0 && searchTerm && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//             <Search className="h-12 w-12 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-medium mb-2">No categories found</h3>
//           <p className="text-muted-foreground mb-4">
//             No categories match your search term "{searchTerm}"
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

// export default CategoriesManager;


'use client'
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Eye, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import { Badge } from "@/components/ui/badge";
import useUser from "@/store/userStore";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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

const CategoriesManager = ({ onCountChange }: CategoriesManagerProps) => {
    const { user } = useUser();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: () => axiosInstance.request({
            url: '/ecommerce/products/categories',
            params: { name: "", entityCode: user?.entityCode, category: '', tag: '', pageNumber: 1, pageSize: 200 }
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
                    <div className="flex items-center gap-2">
                        {searchTerm && (
                            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}
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
                    <div className="hidden lg:block">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
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
                </>
            )}

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
        </div>
    );
};

export default CategoriesManager;
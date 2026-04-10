'use client'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Category } from "./categories-manager";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosOperations from "@/utils/fetch-function-op-auth";
import { toast } from "sonner";

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onViewDetails: (category: Category) => void;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  searchTerm: string;
  onDeleteSuccess?: () => void;
}

const DeleteCategory = ({
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

  const deleteCategoryMutation = useMutation({
    mutationFn: async (payload: { itemCode: string; entityCode: string }) => {
      return await axiosOperations.delete(`/products/delete-product-category?entityCode=${payload.entityCode}&itemCategoryCode=${payload.itemCode}`, {
        data: payload,
      });
    },
    onSuccess: (data) => {
      if (data?.data?.code === '000') {
        toast.success('Category deleted successfully');
        if (onSuccess) {
          onSuccess();
        }
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

    const payload = {
      itemCode: category.code,
      entityCode: 'FTD'
    };

    deleteCategoryMutation.mutate(payload);
  };

  const handleClose = () => {
    setIsDeleting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className='flex flex-col'>
          <DialogTitle className="text-destructive">
            Delete Category
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this category?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium mb-2">Category Details:</p>
              <p><strong>Name:</strong> {category?.name}</p>
              <p><strong>Code:</strong> {category?.code}</p>
            </div>

            <div className="bg-red-50 border border-red-200 p-3 rounded-md">
              <p className="text-sm text-red-600">
                <strong>Warning:</strong> This action cannot be undone. The category data will be permanently deleted.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete Category'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CategoriesTable = ({
  categories,
  onEdit,
  onViewDetails,
  itemsPerPage = 5,
  currentPage = 1,
  onPageChange,
  searchTerm,
  onDeleteSuccess 
}: CategoriesTableProps) => {
  const getDisplayValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return value.toString();
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = categories.slice(startIndex, endIndex);

  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    {
      title: 'S/N',
      dataIndex: 'id',
      key: 'sn',
      width: 80,
      render: (text: string, record: Category, index: number) => (
        <p className="text-sm text-accent-foreground">{startIndex + index + 1}</p>
      ),
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: 80,
      render: (logo: string, record: Category) => (
        <div className="w-12 h-12 bg-accent/5 rounded-lg overflow-hidden border border-accent/20">
          {logo ? (
            <img
              src={logo}
              alt={record.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center text-accent-foreground/50 text-xs ${logo ? 'hidden' : ''}`}>
            No Logo
          </div>
        </div>
      ),
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, record: Category) => (
        <div>
          <p className="font-medium text-accent-foreground">{getDisplayValue(name)}</p>
          <p className="text-xs text-accent-foreground/70">Code: {getDisplayValue(record.code)}</p>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (description: string) => (
        <p className="text-sm text-accent-foreground/70 truncate max-w-[200px]" title={description}>
          {getDisplayValue(description)}
        </p>
      ),
    },
    // {
    //   title: "Sector",
    //   dataIndex: "sector",
    //   key: "sector",
    //   width: 120,
    //   render: (sector: string) => (
    //     <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
    //       {getDisplayValue(sector)}
    //     </Badge>
    //   ),
    // },
    // {
    //   title: "Tags",
    //   dataIndex: "tags",
    //   key: "tags",
    //   width: 200,
    //   render: (tags: string) => (
    //     <div className="flex flex-wrap gap-1">
    //       {tags ? (
    //         tags.split(',').slice(0, 3).map((tag, index) => (
    //           <Badge key={index} variant="outline" className="text-xs border-accent/20 text-accent-foreground">
    //             {tag.trim()}
    //           </Badge>
    //         ))
    //       ) : (
    //         <span className="text-accent-foreground/50 text-sm">No tags</span>
    //       )}
    //       {tags && tags.split(',').length > 3 && (
    //         <Badge variant="outline" className="text-xs border-accent/20 text-accent-foreground">
    //           +{tags.split(',').length - 3} more
    //         </Badge>
    //       )}
    //     </div>
    //   ),
    // },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record: Category) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-accent/10"
            onClick={() => onViewDetails(record)}
            title="View Details"
          >
            <Eye className="w-4 h-4 text-accent-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-accent/10"
            onClick={() => onEdit(record)}
            title="Edit Category"
          >
            <Edit className="w-4 h-4 text-accent-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-red-50"
            title="Delete Category"
            onClick={() => handleDelete(record)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-accent/20">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left p-3 font-bold text-sm text-accent-foreground"
                    style={{ width: column.width ? `${column.width}px` : 'auto' }}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-accent/10 hover:bg-accent/5 transition-colors ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="p-3 text-sm text-accent-foreground">
                      {column.render
                        ? column.render(item[column.dataIndex as keyof Category], item, index)
                        : getDisplayValue(item[column.dataIndex as keyof Category])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {categories.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-accent/10 gap-4">
            <p className="text-sm text-accent-foreground/70">
              Showing {startIndex + 1} to {Math.min(endIndex, categories.length)} of {categories.length} Categories
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-xs border-accent/20 hover:bg-accent/10"
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 p-0 text-xs ${currentPage === page ? 'bg-accent text-white' : 'border-accent/20 hover:bg-accent/10'}`}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-xs border-accent/20 hover:bg-accent/10"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      <DeleteCategory
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingCategory(null);
        }}
        category={deletingCategory}
        onSuccess={onDeleteSuccess}
      />
    </>
  );
};

export default CategoriesTable;
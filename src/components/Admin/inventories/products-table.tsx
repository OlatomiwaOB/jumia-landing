'use client'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Edit, Eye, Trash2 } from "lucide-react";
import { Product } from "./products-manager";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import { toast } from "sonner";
import { code } from "@uiw/react-md-editor";
import { copyToClipboard } from "@/utils/helperfns";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  searchTerm: string;
  onDeleteSuccess?: () => void;
}

const DeleteProduct = ({
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

  const deleteProductMutation = useMutation({
    mutationFn: async (payload: { itemCode: string; entityCode: string }) => {
      return await axiosInstance.delete(`/itemupload/deleteProduct?itemCode=${payload.itemCode}&entityCode=${payload.entityCode}`, {
        data: payload,
      });
    },
    onSuccess: (data) => {
      if (data?.data?.code === '000') {
        toast.success('Product deleted successfully');
        if (onSuccess) {
          onSuccess();
        }
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

    const payload = {
      itemCode: product.code,
      entityCode: 'FTD'
    };

    deleteProductMutation.mutate(payload);
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
            Delete Product
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this product?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium mb-2">Product Details:</p>
              <p><strong>Name:</strong> {product?.name}</p>
              <p><strong>Code:</strong> {product?.code}</p>
            </div>

            <div className="bg-red-50 border border-red-200 p-3 rounded-md">
              <p className="text-sm text-red-600">
                <strong>Warning:</strong> This action cannot be undone. The product data will be permanently deleted.
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
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProductsTable = ({
  products,
  onEdit,
  onViewDetails,
  itemsPerPage = 15,
  currentPage = 1,
  onPageChange,
  searchTerm,
  onDeleteSuccess,
}: ProductsTableProps) => {
  const getDisplayValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return value.toString();
  };

  const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
    return `${currency} ${amount?.toFixed(2) || '0.00'}`;
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = products.slice(startIndex, endIndex);

  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "picture",
      key: "image",
      width: 80,
      render: (picture: string, record: Product) => (
        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
          {picture ? (
            <img
              src={picture}
              alt={record.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center text-muted-foreground text-xs ${picture ? 'hidden' : ''}`}>
            No Image
          </div>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, record: Product) => (
        <div>
          <p className="font-medium text-foreground">{getDisplayValue(name)}</p>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category: string) => (
        <Badge variant="secondary">{getDisplayValue(category)}</Badge>
      ),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (code: string, record: Product) => (
        <div className="flex gap-1 items-center">
          <p className="font-medium text-foreground truncate line-clamp-1">{getDisplayValue(code)}</p>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(code)}
            className="h-6 w-6 hover:bg-gray-100 text-accent hover:text-accent"
          >
            <Copy className="w-3 h-3" />
          </Button> */}
        </div>
      ),
    },
    {
      title: "Sale Price",
      dataIndex: "salePrice",
      key: "salePrice",
      width: 120,
      render: (price: number, record: Product) => (
        <span className="text-sm font-semibold text-green-600">
          {formatCurrency(price, record.ccy)}
        </span>
      ),
    },
    {
      title: "Cost Price",
      dataIndex: "costPrice",
      key: "costPrice",
      width: 120,
      render: (price: number, record: Product) => (
        <span className="text-sm">
          {formatCurrency(price, record.ccy)}
        </span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "qtyInStore",
      key: "qtyInStore",
      width: 100,
      render: (stock: number, record: Product) => (
        <span className="text-sm font-medium">
          {`${stock || 0}`} {`${record.unit || ''}`}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record: Product) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => onViewDetails(record)}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => onEdit(record)}
            title="Edit Product"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-red-50"
            title="Delete Product"
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
              <tr className="border-b-2 border-gray-200">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left p-3 font-bold text-sm text-gray-700"
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
                  className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="p-3 text-sm">
                      {column.render
                        ? column.render(item[column.dataIndex as keyof Product], item)
                        : getDisplayValue(item[column.dataIndex as keyof Product])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of {products.length} Products
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-xs"
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0 text-xs"
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      <DeleteProduct
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingProduct(null);
        }}
        product={deletingProduct}
        onSuccess={onDeleteSuccess}
      />
    </>
  );
};

export default ProductsTable;
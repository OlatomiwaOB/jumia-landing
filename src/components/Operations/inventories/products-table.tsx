'use client'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Edit, Eye } from "lucide-react";
import { Product } from "./products-manager";
import { copyToClipboard } from "@/utils/helperfns";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  searchTerm: string;
}

const ProductsTable = ({
  products,
  onEdit,
  onViewDetails,
  itemsPerPage = 15,
  currentPage = 1,
  onPageChange,
  searchTerm,
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const columns = [
    {
      title: 'S/N',
      dataIndex: 'id',
      key: 'sn',
      width: 80,
      render: (text: string, record: Product, index: number) => (
        <p className="text-sm text-accent-foreground">{startIndex + index + 1}</p>
      ),
    },
    {
      title: "Image",
      dataIndex: "picture",
      key: "image",
      width: 80,
      render: (picture: string, record: Product) => (
        <div className="w-12 h-12 bg-accent/5 rounded-lg overflow-hidden border border-accent/20">
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
          <div className={`w-full h-full flex items-center justify-center text-accent-foreground/50 text-xs ${picture ? 'hidden' : ''}`}>
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
          <p className="font-medium text-accent-foreground">{getDisplayValue(name)}</p>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category: string) => (
        <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
          {getDisplayValue(category)}
        </Badge>
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
      title: "Stock",
      dataIndex: "qtyInStore",
      key: "qtyInStore",
      width: 100,
      render: (stock: number, record: Product) => (
        <span className="text-sm font-medium text-accent-foreground">
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
            className="p-1 hover:bg-accent/10"
            onClick={() => onViewDetails(record)}
            title="View Details"
          >
            <Eye className="w-4 h-4 text-accent-foreground" />
          </Button>
          {/* <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-accent/10"
            onClick={() => onEdit(record)}
            title="Edit Product"
          >
            <Edit className="w-4 h-4 text-accent-foreground" />
          </Button> */}
        </div>
      ),
    },
  ];

  return (
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
                      ? column.render(item[column.dataIndex as keyof Product], item, index)
                      : getDisplayValue(item[column.dataIndex as keyof Product])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-accent/10 gap-4">
          <p className="text-sm text-accent-foreground/70">
            Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of {products.length} Products
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

            {(() => {
              let startPage = Math.max(1, currentPage - 2);
              let endPage = Math.min(totalPages, currentPage + 2);

              if (currentPage <= 3) {
                endPage = Math.min(totalPages, 5);
              }

              if (currentPage >= totalPages - 2) {
                startPage = Math.max(1, totalPages - 4);
              }

              const visiblePages = [];
              const pages = [];

              if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) pages.push('...');
              }

              for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
              }

              if (endPage < totalPages) {
                if (endPage < totalPages - 1) pages.push('...');
                pages.push(totalPages);
              }

              return pages.map((page, index) => {
                if (page === '...') {
                  return <span key={`ellipsis-${index}`} className="px-1 text-muted-foreground">...</span>;
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page as any)}
                    className={`w-8 h-8 p-0 text-xs ${currentPage === page ? 'bg-accent text-white' : 'border-accent/20 hover:bg-accent/10'}`}
                  >
                    {page}
                  </Button>
                );
              });
            })()}

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
  );
};

export default ProductsTable;
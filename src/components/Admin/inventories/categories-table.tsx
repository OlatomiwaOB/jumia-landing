'use client'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye } from "lucide-react";
import { Category } from "./categories-manager";

interface CategoriesTableProps {
  categories: Category[];
  // onEdit: (category: Category) => void;
  onViewDetails: (category: Category) => void;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  searchTerm: string;
}

const CategoriesTable = ({ 
  categories, 
  // onEdit, 
  onViewDetails,
  itemsPerPage = 15,
  currentPage = 1,
  onPageChange,
  searchTerm
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: 80,
      render: (logo: string, record: Category) => (
        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
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
          <div className={`w-full h-full flex items-center justify-center text-muted-foreground text-xs ${logo ? 'hidden' : ''}`}>
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
          <p className="font-medium text-foreground">{getDisplayValue(name)}</p>
          <p className="text-xs text-muted-foreground">Code: {getDisplayValue(record.code)}</p>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (description: string) => (
        <p className="text-sm text-muted-foreground truncate max-w-[200px]" title={description}>
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
    //     <Badge variant="secondary">{getDisplayValue(sector)}</Badge>
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
    //           <Badge key={index} variant="outline" className="text-xs">
    //             {tag.trim()}
    //           </Badge>
    //         ))
    //       ) : (
    //         <span className="text-muted-foreground text-sm">No tags</span>
    //       )}
    //       {tags && tags.split(',').length > 3 && (
    //         <Badge variant="outline" className="text-xs">
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
            className="p-1"
            onClick={() => onViewDetails(record)}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {/* <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => onEdit(record)}
            title="Edit Category"
          >
            <Edit className="w-4 h-4" />
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
                      ? column.render(item[column.dataIndex as keyof Category], item)
                      : getDisplayValue(item[column.dataIndex as keyof Category])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {categories.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, categories.length)} of {categories.length} Categories
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
  );
};

export default CategoriesTable;
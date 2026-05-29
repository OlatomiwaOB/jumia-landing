'use client'
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Package, Tag } from "lucide-react";
import ProductsManager from "@/components/Admin/inventories/products-manager";
import CategoriesManager from "@/components/Admin/inventories/categories-manager";
import { usePermission } from "@/hooks/usePermissionBusiness";

interface InventoriesPageProps {
  productsCount?: number;
  categoriesCount?: number;
}

const InventoriesPage = () => {
  // const { usePermissionGuard } = usePermission();

  // usePermissionGuard('VIEW_INVENTORY', {
  //   redirectToNotPermitted: true,
  //   toastMessage: "You don't have permission to view inventory"
  // });
  const [activeTab, setActiveTab] = useState("products");
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);

  const handleProductsCountChange = (count: number) => {
    setProductsCount(count);
  };

  const handleCategoriesCountChange = (count: number) => {
    setCategoriesCount(count);
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "products":
        return "Product Management";
      case "categories":
        return "Category Management";
      default:
        return "Inventory Management";
    }
  };

  const getHeaderDescription = () => {
    switch (activeTab) {
      case "products":
        return "Manage your products, inventory, and pricing";
      case "categories":
        return "Organize your product categories and sectors";
      default:
        return "Manage your inventory, products, and categories";
    }
  };

  const getTotalCount = () => {
    switch (activeTab) {
      case "products":
        return productsCount;
      case "categories":
        return categoriesCount;
      default:
        return 0;
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getHeaderTitle()}
          </h1>
          <p className="text-muted-foreground">
            {getHeaderDescription()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{getTotalCount()}</p>
          <p className="text-sm text-muted-foreground">
            Total {activeTab === "products" ? "Products" : "Categories"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsManager onCountChange={handleProductsCountChange} />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesManager onCountChange={handleCategoriesCountChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoriesPage;
// 'use client'
// import { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Package, Tag, RefreshCw } from "lucide-react";
// import ProductsManager from "@/components/Operations/inventories/products-manager";
// import CategoriesManager from "@/components/Operations/inventories/categories-manager";
// import { usePermission } from "@/hooks/usePermission";

// interface InventoriesPageProps {
//   productsCount?: number;
//   categoriesCount?: number;
// }

// const InventoriesPage = () => {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('VIEW_INVENTORY', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to view inventory"
//   });
//   const [activeTab, setActiveTab] = useState("products");
//   const [productsCount, setProductsCount] = useState(0);
//   const [categoriesCount, setCategoriesCount] = useState(0);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const handleProductsCountChange = (count: number) => {
//     setProductsCount(count);
//   };

//   const handleCategoriesCountChange = (count: number) => {
//     setCategoriesCount(count);
//   };

//   // const handleRefresh = () => {
//   //   setIsRefreshing(true);
//   //   window.dispatchEvent(new CustomEvent('refresh-inventories'));
//   //   setTimeout(() => setIsRefreshing(false), 1000);
//   // };

//   const getHeaderTitle = () => {
//     switch (activeTab) {
//       case "products":
//         return "Product Management";
//       case "categories":
//         return "Category Management";
//       default:
//         return "Inventory Management";
//     }
//   };

//   const getHeaderDescription = () => {
//     switch (activeTab) {
//       case "products":
//         return "Manage your products, inventory, and pricing";
//       case "categories":
//         return "Organize your product categories and sectors";
//       default:
//         return "Manage your inventory, products, and categories";
//     }
//   };

//   const getTotalCount = () => {
//     switch (activeTab) {
//       case "products":
//         return productsCount;
//       case "categories":
//         return categoriesCount;
//       default:
//         return 0;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="container mx-auto p-6">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-accent-foreground mb-2">
//               {getHeaderTitle()}
//             </h1>
//             <p className="text-accent-foreground/70">
//               {getHeaderDescription()}
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="text-right">
//               <p className="text-2xl font-bold text-accent-foreground">{getTotalCount()}</p>
//               <p className="text-sm text-accent-foreground/70">
//                 Total {activeTab === "products" ? "Products" : "Categories"}
//               </p>
//             </div>
//           </div>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-6 bg-accent/5">
//             <TabsTrigger
//               value="products"
//               className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white"
//             >
//               <Package className="h-4 w-4" />
//               Products
//             </TabsTrigger>
//             <TabsTrigger
//               value="categories"
//               className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white"
//             >
//               <Tag className="h-4 w-4" />
//               Categories
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="products">
//             <ProductsManager onCountChange={handleProductsCountChange} />
//           </TabsContent>

//           <TabsContent value="categories">
//             <CategoriesManager onCountChange={handleCategoriesCountChange} />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default InventoriesPage;

'use client'
import { useState } from "react";
import { Package, Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsManager from "@/components/Operations/inventories/products-manager";
import CategoriesManager from "@/components/Operations/inventories/categories-manager";
import { usePermission } from "@/hooks/usePermission";
import { usePageMetadata } from "@/hooks/usePageMetadata";

const InventoriesPage = () => {
    usePageMetadata('Inventory Management', 'Manage products, inventory, pricing, and categories.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('VIEW_INVENTORY', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view inventory"
    });

    const [activeTab, setActiveTab] = useState("products");
    const [productsCount, setProductsCount] = useState(0);
    const [categoriesCount, setCategoriesCount] = useState(0);

    const handleProductsCountChange = (count: number) => setProductsCount(count);
    const handleCategoriesCountChange = (count: number) => setCategoriesCount(count);

    return (
        <div className="min-h-screen px-2">
            {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                    <p className="text-sm text-medium-gray mb-1">Total Products</p>
                    <p className="text-2xl font-semibold text-dark-gray">{productsCount.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                    <p className="text-sm text-medium-gray mb-1">Total Categories</p>
                    <p className="text-2xl font-semibold text-dark-gray">{categoriesCount.toLocaleString()}</p>
                </div>
            </div> */}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex gap-2 flex-wrap bg-transparent p-0 mb-4">
                    <TabsTrigger
                        value="products"
                    >
                        Product Management
                    </TabsTrigger>
                    <TabsTrigger
                        value="categories"
                    >
                        Categories Management
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